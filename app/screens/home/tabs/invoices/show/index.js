import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sortBy} from 'lodash';
import {Text, Alert} from 'react-native';
import {Container, View, Content} from 'native-base';
import {Avatar} from 'react-native-elements'
import DropdownAlert from 'react-native-dropdownalert';

import styles from './styles';
import {getInvoice} from "../../../../../actions/invoice/index";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from '../../../../../components/textHeader';
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import {showMessage} from "../../../../../helpers/toast";
import PaymentView from '../../../../../components/paymentList'
import {removePayment} from "../../../../../actions/invoice";
import {changeOrderStatus} from "../../../../../helpers/changeStatus";
import {getInvoiceByCustomerId, updateInvoiceStatus} from "../../../../../../database/Invoice/controller";
import {deletePaymentData} from "../../../../../../database/Payment/controller";
import moment from "moment/moment";
import {getCustomerByOrderId} from "../../../../../../database/Order/controller";
import {updateDashboardCalloutValue} from "../../../../../actions/dashboard";
import {getCustomerFromRealm} from "../../../../../actions/customer";

class InvoiceShow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            today: moment().format('YYYY-MM-DD'),
            refreshing: false,
            isSearch: false,
            isLoading: false,
            dataSource: null,
            paymentTotal: 0,
            balancePayment: 0,
            invoiceId: null,
            orderId: null,
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        let invoiceId = state.params.invoiceId;
        this.setState({
            isLoading: true,
            invoiceId: invoiceId,
            orderId: state.params.orderId
        });
        this.loadRemoteOrders();
    }

    loadRemoteOrders(callback) {
        const {state} = this.props.navigation;
        let invoiceId = state.params.invoiceId;
        this.props.getInvoiceData(invoiceId).done(() => {
            this.props.getCustomersData(this.props.invoice.customer_id); // To show customer name
            let balance = this.props.invoice.amount - calculatePaymentTotal(this.props.invoice.payments);
            this.setState({
                dataSource: this.props.invoice,
                paymentTotal: calculatePaymentTotal(this.props.invoice.payments),
                balancePayment: balance,
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        this.props.navigation.navigate('PrintOrder', {orderId: this.state.orderId});
    }

    onError = ref => {
        if (ref) {
            this.dropdown.alertWithType('error', 'Previous collection pending', ref + ' have to be settled first');
        }
    };

    handleChangeStatus() {
        changeOrderStatus(this.state.orderId);
        let totalPayment = calculatePaymentTotal(this.props.invoice.payments);
        let balance = this.props.invoice.amount - totalPayment;
        if (balance === 0) {
            updateInvoiceStatus(this.state.invoiceId, 'Paid').then(
                this.loadRemoteOrders(this)
            ).catch(error => console.warn(error, 'status update'))
        } else if (totalPayment === 0) {
            updateInvoiceStatus(this.state.invoiceId, 'Open').then(
                this.loadRemoteOrders(this)
            ).catch(error => console.warn(error, 'status update'))
        } else {
            updateInvoiceStatus(this.state.invoiceId, 'Partially Paid').then(
                this.loadRemoteOrders(this)
            ).catch(error => console.warn(error, 'status update'))
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader
                    name={this.state.dataSource ? this.state.dataSource.ref ? this.state.dataSource.ref : '* not_found' : 'Loading..'}
                    leftButtonValue='Back'
                    leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    // rightButtonValue='Print'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                {this.renderButtonHeader()}
                <Content>
                    <View style={styles.content}>
                        <Spinner visible={this.state.isLoading}
                                 textContent={configurations.loginScreenLoaderText}
                                 textStyle={{color: '#00897B'}}
                                 color={'#00897B'}/>
                        {this.renderInvoiceHeader()}
                        {this.renderPayment()}
                        {this.renderFooter()}
                        {this.renderNotes()}
                    </View>
                </Content>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        );
    }

    renderInvoiceHeader() {
        return (
            <View style={styles.customerHeader}>
                <View style={styles.mainView}>
                    <View style={styles.leftContainer}>
                        <Text
                            style={styles.rotatedText}>{this.state.dataSource ? this.state.dataSource.status : 'Loading'}</Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <View>
                            <Text style={styles.normalText}>Invoice date</Text>
                            {/*<Text style={styles.normalText}>Due Date</Text>*/}
                            <Text style={styles.normalText}>Amount</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={styles.valueText}>
                            {this.state.dataSource ? this.state.dataSource.invoice_date : ''}
                        </Text>
                        {/*<Text style={styles.valueText}>*/}
                        {/*{this.state.dataSource ? this.state.dataSource.due_date : ''}*/}
                        {/*</Text>*/}
                        <Text style={styles.valueText}>
                            {this.state.dataSource ? transformToCurrency(this.state.dataSource.amount) : '0.00'}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderPayment() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B'}}>Payment details</Text>
                {
                    this.state.dataSource
                        ? this.state.dataSource.payments.length > 0
                        ? this.state.dataSource.payments.map((value, key) => {
                            return (
                                <PaymentView
                                    key={key}
                                    paymentPressed={() => this.handelEditPaymentPressed(value)}
                                    mode={value.payment_mode}
                                    type={value.payment_type}
                                    amount={value.payment}
                                    syncStatus={value.not_sync}
                                    paymentDetails={
                                        value.payment_mode === 'Cheque'
                                            ? value.cheque_no + ', ' + value.cheque_date + ', ' + value.bank_name
                                            : value.payment_mode === 'Direct Deposit'
                                            ? value.account_no + ', ' + value.deposited_date + ', ' + value.bank_name
                                            : value.card_no + ', ' + value.expiry_date + ', ' + value.bank_name
                                    }
                                    disableRemoveButton={true}
                                    // removeButtonPress={() => this.handelRemoveButtonPressed(value)}
                                    removeButtonPress={() => {
                                    }}
                                    disableRefundButton={true}
                                    refundButtonPress={() => console.log('refund')}
                                />
                            )
                        })
                        : <Text style={{textAlign: 'center'}}>No payments found</Text>
                        : null
                }
            </View>
        )
    }

    renderFooter() {
        return (
            <View style={styles.buttonView}>
                <View style={styles.itemMainView}>
                    <Text style={styles.normalTextWithFlex}>Payments made:</Text>
                    <Text style={styles.valueTextWithFlex}>{transformToCurrency(this.state.paymentTotal)}</Text>
                </View>
                <View style={styles.itemMainView}>
                    <Text style={styles.normalTextWithFlex}>Balance due:</Text>
                    <Text style={styles.valueTextWithFlex}>{transformToCurrency(this.state.balancePayment)}</Text>
                </View>
            </View>
        )
    }

    renderNotes() {
        return (
            <View style={styles.buttonView}>
                <View>
                    <Text style={{fontSize: 18}}>Notes</Text>
                    {
                        this.state.dataSource
                            ? <Text
                                style={styles.blackText}>{this.state.dataSource.notes ? this.state.dataSource.notes : 'Notes not found'}</Text>
                            : null
                    }
                </View>
            </View>
        )
    }

    renderButtonHeader() {
        return (
            <View style={{backgroundColor: '#00897B', paddingBottom: 10}}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: '#FFF', fontSize: 20,}}>
                        Due: {transformToCurrency(this.state.balancePayment)}
                    </Text>
                    <Text style={{color: '#FFF'}}>
                        {this.props.customers ? this.props.customers.display_name : 'Not found'}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 50,
                    paddingRight: 50
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'attach-money', color: '#00897B', size: 30}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelRecordPaymentClick()}
                            activeOpacity={0.7}
                            // containerStyle={{marginLeft: 20}}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Record Payment</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'add-to-photos', color: '#00897B', size: 30}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelPrintDeliveryNotePressed()}
                            activeOpacity={0.7}
                            // containerStyle={{marginLeft: 20}}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Print Delivery Note</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'ios-print', color: '#00897B', type: 'ionicon', size: 30}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={this.handelHeaderRightButtonPress.bind(this)}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Print Order</Text>
                    </View>
                </View>
            </View>
        )
    }

    handelPrintDeliveryNotePressed() {
        this.props.navigation.navigate('PrintDeliveryNote', {orderId: this.state.orderId});
    }

    handelEditInvoicePressed() {
        showMessage('Sorry invoice edit is disabled')
        // if (!moment(this.state.dataSource.invoice_date).isSame(today)) return showMessage('You can\'t edit previous invoice');
        // if (this.state.dataSource.payments.length) return showMessage('Sorry you can\' edit invoice with payment');
        // let newData = transformInvoiceItems(this.state.dataSource);
        // this.props.navigation.navigate('AddInvoice', {
        //     invoiceId: this.state.invoiceId,
        //     orderId: this.state.orderId,
        //     invoiceData: newData,
        // });
    }

    handelEditPaymentPressed(value) {
        const {today} = this.state;
        if (!moment(value.payment_date).isSame(today)) return showMessage('You can\'t edit previous payment');
        this.props.navigation.navigate('AddPayment', {
            paymentId: value.id,
            balancePayment: this.state.balancePayment,
            orderId: this.state.orderId,
            refresh: this.handleChangeStatus.bind(this)
        });
    }

    handelRecordPaymentClick() {
        const {today} = this.state;
        if (this.state.balancePayment === 0) return showMessage('Already paid');
        getInvoiceByCustomerId(this.state.dataSource.customer_id).then(invoices => {
            let value = checkOldCollection(invoices, today);
            let haveToSettleInvoice = validateOldCollection(value, this.state.dataSource);
            if (haveToSettleInvoice.length) return this.onError(haveToSettleInvoice[0].ref);
            this.props.navigation.navigate('AddPayment', {
                balancePayment: this.state.balancePayment,
                invoiceId: this.state.invoiceId,
                orderId: this.state.orderId,
                refresh: this.handleChangeStatus.bind(this)
            });
        });
    }

    handelRemoveButtonPressed(payment) {
        const {today} = this.state;
        if (!moment(payment.payment_date).isSame(today)) return showMessage('You can\'t delete previous payment');
        Alert.alert(
            'Are You Sure?',
            'Do you want to remove this payment?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.removeButtonPressed(payment)},
            ],
            {cancelable: false}
        );
    }

    removeButtonPressed(payment) {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            this.props.onDeletePayment(payment.id)
                .then(value => {
                    if (value) {
                        deletePaymentData(payment.id).then(() => this.handleChangeStatus()).catch((error) => {
                            console.log(error, 'delete error')
                        });
                        getCustomerByOrderId(this.state.orderId).then(customerId => {
                            updateDashboardCalloutValue(customerId).catch(error => console.warn(error));
                        });
                        this.setState({isLoading: false, isError: false});
                        showMessage(value.message);
                    }
                })
                .catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.warn(exception, 'Payment remove exception')
                });
        }
    }
}

function calculatePaymentTotal(data) {
    let total = 0;
    if (data) {
        data.map((value) => {
            total = total + value.payment
        });
    }
    return total;
}

function checkOldCollection(invoices, today) {
    let sortedInvoices = [];
    let oldInvoices = invoices.filter(function (item) {
        return moment(item.invoice_date).isBefore(today);
    });
    if (oldInvoices.length) {
        sortedInvoices = sortBy(oldInvoices, (o) => Date.parse(o.invoice_date))
    }
    return sortedInvoices;
}

function validateOldCollection(invoices, data) {
    let response = [];
    let result = invoices.filter(function (element) {
        return element.status !== 'Paid';
    });
    if (result.length && result[0].id !== data.id) {
        response.push(result[0])
    }
    return response;
}

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    customers: state.customer.item,
    invoice: state.invoice.invoice,
});


const mapDispatchToProps = (dispatch) => ({
    getInvoiceData(invoiceId) {
        return dispatch(getInvoice(invoiceId));
    },
    getCustomersData(customerId) {
        return dispatch(getCustomerFromRealm(customerId));
    },
    onDeletePayment(paymentId) {
        return dispatch(removePayment(paymentId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceShow);
