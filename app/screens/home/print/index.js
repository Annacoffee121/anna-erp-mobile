import React, {Component} from 'react';
import {showMessage} from '../../../helpers/toast'
import {transformAllCustomerPayment as transformPayment, changeChequePayment} from '../../../helpers/customerPayment'
import {connect} from "react-redux";
import {getOrder, getOrderPrint} from "../../../actions/orders";
import moment from 'moment';
import {uniqBy, find, findIndex, filter} from 'lodash';
import {getPaymentForCustomer} from "../../../actions/invoice";
import PrintPreview from "./printPreview";
import {getCustomerOutstanding} from "../../../../database/Customer/controller";
import NetPrint from "../NetPrint";

class ConnectPrinterPage extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: null,
            printers: '',
            currentPrinter: '',
            isLoading: false,
            loadingText: null,
            disablePrint: true,
            outstanding: null,
            printCount: 0,
            allCustomerPayments: []
        }
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        let orderId = state.params.orderId;
        this.setState({isLoading: true});
        this.loadRemoteOrders(orderId);
    }

    loadRemoteOrders(orderId, callback) {
        this.props.getOrderDataFromRealm(orderId).done(() => {
            this.props.getPreviousPayment(this.props.order.customer_id).done(() => {
                getCustomerOutstanding(this.props.order.customer_id).then(value => {
                    this.setState({
                        outstanding: value,
                        dataSource: this.props.order,
                        previousPaymentDetails: checkDate(this.props.payments),
                        allCustomerPayments: this.props.payments,
                        isLoading: false
                    });
                });
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <NetPrint
                screenHeader={{
                    leftButtonPress: this.handelHeaderLeftButtonPress.bind(this)
                }}
                onPrintPress={this.handelPrintPress}
                isLoading={this.state.isLoading}
            />
        );
    }

    handelPrintPress = () => {
        let companyDetails = {
            name: this.props.user.staff[0].companies[0].display_name,
            phone: this.props.user.staff[0].companies[0].phone,
            company_mail: this.props.user.staff[0].companies[0].email,
            city: this.props.user.staff[0].companies[0].addresses[0].city
        };
        let paymentData = [];
        this.state.previousPaymentDetails.map(payment => {
            paymentData.push({
                // id: payment.invoice.ref ? payment.invoice.ref : payment.invoice.invoice_no,
                // date: payment.invoice.invoice_date,
                uid: payment.order.id,
                id: payment.order.ref ? payment.order.ref : payment.order.order_no,
                date: payment.order.order_date,
                mode: payment.payment_mode === "Customer Credit" ? "Return" : payment.payment_mode,
                cheque_no: payment.cheque_no,
                cheque_date: payment.cheque_date,
                bank_name: payment.bank_name,
                payment: payment.payment
            })
        });
        const customerPayment = transformPayment(this.state.allCustomerPayments);
        if (checkOrderDate(this.state.dataSource)) {
            if (checkOrderPreviousBillPayment(paymentData)) return showMessage('You can\'t print payment receipt without payment');
            this.printPreviousPaymentReceipt(companyDetails, paymentData, customerPayment);
        } else if (!checkOrderDate(this.state.dataSource) && checkOrderPayment(this.state.dataSource)) {
            this.printPaymentReceipt(companyDetails, paymentData, customerPayment);
        } else {
            this.printTodayOrder(companyDetails, paymentData, customerPayment);
        }
    }

    printPreviousPaymentReceipt(companyDetails, paymentData, customerPayment) {
        this.props.navigation.navigate('PrintPreview', {
            companyDetails,
            printData: this.state.dataSource,
            printCount: this.state.printCount,
            previousCollection: paymentData,
            not_realized_cheque: addPaymentChequeToNotRealized(this.state.dataSource, customerPayment),
            out_value: this.state.dataSource.customer.outstanding_orders,
            receipt_mode: 'Payment'
        });
    }

    printPaymentReceipt(companyDetails, paymentData, customerPayment) {
        this.props.navigation.navigate('PrintPreview', {
            companyDetails,
            printData: this.state.dataSource,
            printCount: this.state.printCount,
            previousCollection: paymentData,
            not_realized_cheque: addPaymentChequeToNotRealized(this.state.dataSource, customerPayment),
            out_value: this.state.dataSource.customer.outstanding_orders,
            receipt_mode: 'Sales'
        });
    }

    printTodayOrder(companyDetails, paymentData, customerPayment) {
        this.props.navigation.navigate('PrintPreview', {
            companyDetails,
            printData: this.state.dataSource,
            printCount: this.state.printCount,
            previousCollection: paymentData,
            not_realized_cheque: addPaymentChequeToNotRealized(this.state.dataSource, customerPayment),
            out_value: this.state.dataSource.customer.outstanding_orders,
            receipt_mode: 'Credit'
        });
    }
}

function checkDate(payments) {
    let now = moment().format('YYYY-MM-DD');
    return payments.filter(function (payment) {
        return moment(payment.payment_date).isSame(now) && moment(payment.invoice.invoice_date).isBefore(now);
    });
}

function checkOrderDate(order) {
    let now = moment().format('YYYY-MM-DD');
    return moment(order.order_date).isBefore(now);
}

function checkNotRealizeCheque(cheques) {
    let now = moment().format('YYYY-MM-DD');
    return filter(cheques, cheque => moment(cheque.cheque_date).isSame(now) || moment(cheque.cheque_date).isAfter(now));
}

function checkOrderPreviousBillPayment(paymentData) {
    let totalPayment = 0;
    paymentData.map(payment => totalPayment = totalPayment + payment.payment);
    return totalPayment === 0;
}

function checkOrderPayment(order) {
    let totalPayment = 0;
    order.payments.map(payment => totalPayment = totalPayment + payment.payment);
    return order.total === totalPayment;
}

function addPaymentChequeToNotRealized(order, paymentData) {
    let not_realized_cheque = [];
    if (order.customer.not_realized_cheque.length) {
        order.customer.not_realized_cheque.map(cheque => {
            cheque.payment_mode = "Cheque";
            not_realized_cheque.push(cheque)
        });
    }
    if (order.payments.length) {
        order.payments.map(payment => {
            not_realized_cheque.push(payment)
        });
    }
    if (paymentData.length) {
        paymentData.map(payment => {
            not_realized_cheque.push(payment)
        });
    }
    return mergeSameCheques(uniqBy(not_realized_cheque, "id"));
}

function mergeSameCheques(payments) {
    const cheques = filter(payments, o => o.payment_mode === 'Cheque');
    const notRealizedCheques = checkNotRealizeCheque(cheques);
    let data = [];
    notRealizedCheques.map(cheque => {
        const index = findIndex(data, o => o.cheque_no === cheque.cheque_no);
        const findValue = find(data, o => o.cheque_no === cheque.cheque_no);
        if (index > -1) {
            data.splice(index, 1);
            data.push(changeChequePayment(findValue, cheque.payment));
        } else {
            data.push(cheque)
        }
    });
    return data;
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
    isConnected: state.system.isConnected,
    order: state.order.order,
    orderPrint: state.order.orderPrint,
    payments: state.invoice.payments,
});


const mapDispatchToProps = (dispatch) => ({
    getOrderDataFromRealm(orderId) {
        return dispatch(getOrder(orderId));
    },
    getOrderData(orderId) {
        return dispatch(getOrderPrint(orderId));
    },
    getPreviousPayment(customerId) {
        return dispatch(getPaymentForCustomer(customerId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectPrinterPage);
