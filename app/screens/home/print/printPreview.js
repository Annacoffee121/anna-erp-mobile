import React, {Component} from 'react';
import {View, Text} from 'react-native'
import {Container, Content} from 'native-base';
import styles from "./styles";
import ScreenHeader from '../../../components/textHeader';
import moment from "moment/moment";
import {transformToCurrency} from "../../../helpers/currencyFormatConverter";
import NetPrinterAPI from "../../../helpers/NetPrinterAPI";
import {buffer} from './view'

import {showMessage} from "../../../helpers/toast";
import {changePrintStatus} from "../../../services/order/printStatus";
import Spinner from "../../../components/spinner";

export default class PrintPreview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            printData: null,
            previousCollection: null,
            out_value: null,
            printCount: null,
            companyDetails: null,
            not_realized_cheque: null,
            receipt_mode: null,
            isLoading: false,
            loadingText: null,
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            printData: state.params.printData,
            previousCollection: state.params.previousCollection,
            out_value: state.params.out_value,
            printCount: state.params.printCount,
            companyDetails: state.params.companyDetails,
            receipt_mode: state.params.receipt_mode,
            not_realized_cheque: state.params.not_realized_cheque,
        });
    }

    render() {
        const {loadingText} = this.state;
        return (
            <Container style={styles.container}>
                <ScreenHeader
                    name={'Print Preview'}
                    leftButtonValue='Back'
                    leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    rightButtonValue='Print'
                    rightButtonPress={() => {
                        this.handelHeaderRightButtonPress();
                    }}
                />
                <Content>
                    <Spinner visible={this.state.isLoading}
                             textContent={loadingText ? loadingText : 'Please wait... We are preparing your print!'}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.content}>
                        {
                            this.state.printData ? this.renderBody() : null
                        }
                    </View>
                </Content>
            </Container>
        )
    }

    renderBody() {
        let printData = this.state.printData;
        let not_realized_cheque = this.state.not_realized_cheque;
        let previousCollection = this.state.previousCollection;
        let out_value = this.state.out_value;
        let companyDetails = this.state.companyDetails;
        let receipt = this.state.receipt_mode === 'Payment' ? 'Payment Receipt' : 'Sales Order - ' + printData.ref;
        let outstanding_data = validatePaidOutstanding(this.state.printData.customer.outstanding_orders, this.state.printData.id);
        const data = {
            companyName: companyDetails.name + ' - ' + companyDetails.city,
            phone: companyDetails.phone,
            company_mail: companyDetails.company_mail,
            orderId: printData.ref ? receipt : receipt + printData.order_no,
            customer: {
                name: printData.customer.display_name ? printData.customer.display_name : '',
                addressL1: printData.customer.street_one ? printData.customer.street_one + ' ,' : '',
                addressL2: printData.customer.street_two ? printData.customer.street_two : '',
                addressL3: printData.customer.city ? printData.customer.city : '',
            },
            date: moment().format('YYYY-MM-DD h:mm:ss'),
            orderDate: printData.order_date,
            deliveryDate: printData.delivery_date,
            items: printData.order_items,
            subTotal: printData.sub_total,
            discount: printData.discount_rate,
            adjustment: printData.adjustment,
            total: printData.total,
            invoice: printData.invoices,
            invoiceTotal: calculateInvoiceTotal(printData.invoices),
            payment: printData.payments,
            paymentTotal: calculatePaymentTotal(printData.payments),
            balancePayment: printData.total - calculatePaymentTotal(printData.payments),
            totalOutstanding: calculateInvoiceTotal(outstanding_data),
            totalOutWithBalance: (printData.total - calculatePaymentTotal(printData.payments)) + calculateInvoiceTotal(outstanding_data),
            outstanding: outstanding_data,
            previousCollection: previousCollection,
            previousCollectionTot: calculatePaymentTotal(previousCollection),
            totalReceived: calculatePaymentTotal(previousCollection) + calculatePaymentTotal(printData.payments),
            notRealizedCheque: not_realized_cheque,
            notRealizedChequeTotal: calculatePaymentTotal(not_realized_cheque)
        };
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{backgroundColor: '#FFF', width: 380, padding: 10}}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{data.companyName}</Text>
                    <Text style={{textAlign: 'center'}}>{data.orderId}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer.name}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer.addressL1 + data.customer.addressL2}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer.addressL3}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            this.state.receipt_mode === 'Credit' ? <Text>[Original] - </Text> : null
                        }
                        <Text>{data.date}</Text>
                    </View>
                    {
                        this.state.receipt_mode !== 'Payment' ?
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{width: '50%'}}>{'Order Date:' + data.orderDate}</Text>
                                <Text style={{width: '50%', textAlign: 'right'}}>
                                    {'Delivery Date:' + data.deliveryDate}
                                </Text>
                            </View> : null
                    }

                    {
                        this.state.receipt_mode !== 'Payment' ? this.renderOrderDetails(data) : null
                    }

                    {
                        data.previousCollection.length ? this.renderPreviousCollectionDetails(data)
                            : null
                    }
                    {
                        this.state.receipt_mode !== 'Payment' ?
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>
                                    Remaining Payment:</Text>
                                <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                                    {transformToCurrency(data.balancePayment)}
                                </Text>
                            </View>
                            : null
                    }
                    {
                        // this.renderTotalOutstandingDetails(data)
                        data.outstanding.length && data.totalOutstanding > 0 ? this.renderOutstandingDetails(data) : null
                    }
                    {
                        data.notRealizedCheque.length ? this.renderNotRealizedCheque(data) : null
                    }
                    {
                        this.state.receipt_mode === 'Credit' ? this.renderFooterDetails() : null
                    }
                    <Text style={{textAlign: 'center'}}>60 Years Of Experience</Text>
                    <Text style={{textAlign: 'center'}}>Thank You!!</Text>
                    <Text style={{textAlign: 'center'}}>Hotline: {data.phone}</Text>
                    <Text style={{textAlign: 'center'}}>Email: {data.company_mail}</Text>
                    <Text style={{textAlign: 'center'}}>Web: www.annacoffee.com</Text>
                </View>
            </View>
        )
    }

    renderOrderDetails(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Order Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Items&Desc</Text>
                    <Text style={{width: '10.42%', fontWeight: 'bold'}}>Qty</Text>
                    <Text style={{width: '20.83%', textAlign: 'right', fontWeight: 'bold'}}>Rate</Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderOrderItems(data.items)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '25.01%'}}>{'-----------------------'}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.total)}
                    </Text>
                </View>
                {
                    data.payment.length ? this.renderPaymentDetails(data) : null
                }
            </View>
        )
    }

    renderPaymentDetails(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Payment Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Mode</Text>
                    <Text style={{width: '31.25%', fontWeight: 'bold', textAlign: 'right'}}>Amount</Text>
                </View>
                {this.renderPaymentItems(data.payment, data)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '56.26%'}}>
                        {'-----------------------------------------'}
                    </Text>
                </View>
            </View>
        )
    }

    renderOutstandingDetails(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Outstanding Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Order No</Text>
                    <Text style={{width: '31.25%', fontWeight: 'bold', textAlign: 'right'}}>Amount</Text>
                </View>
                {this.renderOutstandingItems(data.outstanding, data)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{
                        textAlign: 'right',
                        width: '56.26%'
                    }}>{'-----------------------------------------'}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.totalOutWithBalance)}
                    </Text>
                </View>
            </View>
        )
    }

    renderPreviousCollectionDetails(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Bill Collection</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '35.41%', fontWeight: 'bold'}}>Order No</Text>
                    <Text style={{width: '22.92%', fontWeight: 'bold'}}>Order Date</Text>
                    <Text style={{width: '16.67%', fontWeight: 'bold', textAlign: 'right'}}>Mode</Text>
                    <Text style={{width: '25%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderPreviousCollectionItems(data.previousCollection)}

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.previousCollectionTot)}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>Tot.Coll:</Text>
                    {
                        this.state.receipt_mode !== 'Payment'
                            ? <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                                {transformToCurrency(data.totalReceived)}
                            </Text>
                            : <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                                {transformToCurrency(data.previousCollectionTot)}
                            </Text>
                    }
                </View>

                {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                {/*<Text style={{backgroundColor: '#000', color: '#FFF', width: '40%'}}> Total Outstanding</Text>*/}
                {/*<Text style={{textAlign: 'right', width: '25%'}}>Total:</Text>*/}
                {/*<Text style={{textAlign: 'right', width: '35%'}}>*/}
                {/*{transformToCurrency(data.previousCollectionTot)}*/}
                {/*</Text>*/}
                {/*</View>*/}
                {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                {/*<Text style={{backgroundColor: '#000', color: '#FFF', width: '40%'}}>*/}
                {/*{transformToCurrency(data.totalOutstanding)}*/}
                {/*</Text>*/}
                {/*<Text style={{textAlign: 'right', width: '25%'}}>Tot.Coll:</Text>*/}
                {/*{*/}
                {/*this.state.receipt_mode !== 'Payment'*/}
                {/*? <Text*/}
                {/*style={{textAlign: 'right', width: '35%'}}>{transformToCurrency(data.totalReceived)}</Text>*/}
                {/*: <Text style={{*/}
                {/*textAlign: 'right',*/}
                {/*width: '35%'*/}
                {/*}}>{transformToCurrency(data.previousCollectionTot)}</Text>*/}
                {/*}*/}
                {/*</View>*/}
            </View>
        )
    }

    renderTotalOutstandingDetails(data) {
        return (
            <View style={{backgroundColor: '#000'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '65%', color: '#FFF'}}>Total Outstanding:</Text>
                    <Text style={{textAlign: 'right', width: '35%', color: '#FFF'}}>
                        {transformToCurrency(data.totalOutstanding)}
                    </Text>
                </View>
            </View>
        )
    }

    renderNotRealizedCheque(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Cheques subject to be
                    realized</Text>
                {this.renderNotRealizedChequeItems(data.notRealizedCheque)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '50%'}}>
                        {'---------------------                          '}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '50%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '25.00%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.notRealizedChequeTotal)}
                    </Text>
                </View>
            </View>
        )
    }

    renderFooterDetails() {
        return (
            <View>
                <Text style={{width: '100%'}}>{' '}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '50%'}}>{'Rep.Sign:______________'}</Text>
                    <Text style={{width: '50%', textAlign: 'right'}}>{'Cus.Sign:______________'}</Text>
                </View>
                <Text style={{width: '100%'}}>{' '}</Text>
            </View>
        )
    }

    renderOrderItems(order) {
        return (
            <View>
                {
                    order.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{width: '43.74%'}}>{item.product_name}</Text>
                            <Text style={{width: '10.42%'}}>{item.quantity}</Text>
                            <Text style={{width: '20.83%', textAlign: 'right'}}>{transformToCurrency(item.rate)}</Text>
                            <Text
                                style={{width: '25.01%', textAlign: 'right'}}>{transformToCurrency(item.amount)}</Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    renderPaymentItems(payments, data) {
        return (
            <View>
                {
                    payments.map((payment, index) => {
                        const payment_mode = payment.payment_mode === "Customer Credit" ? "Return" : payment.payment_mode;
                        return (
                            <View key={index}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{width: '43.74%'}}>{payment_mode}</Text>
                                    <Text style={{width: '31.25%', textAlign: 'right'}}>
                                        {transformToCurrency(payment.payment)}
                                    </Text>
                                    {
                                        payments.length - 1 === index ?
                                            <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>
                                                {transformToCurrency(data.paymentTotal)}
                                            </Text>
                                            : null
                                    }
                                </View>
                                {
                                    payment_mode === 'Cheque'
                                        ?
                                        <View>
                                            <Text>{'# ' + payment.cheque_no + ', ' + payment.cheque_date}</Text>
                                            <Text>{payment.bank_name}</Text>
                                        </View>
                                        : null
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    renderOutstandingItems(Outstanding, data) {
        return (
            <View>
                {
                    Outstanding.map((outstanding, index) => (
                        <View key={index}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{width: '43.74%'}}>{outstanding.ref}</Text>
                                <Text style={{width: '31.25%', textAlign: 'right'}}>
                                    {transformToCurrency(outstanding.amount)}
                                </Text>
                                {
                                    Outstanding.length - 1 === index ?
                                        <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>
                                            {transformToCurrency(data.totalOutstanding)}
                                        </Text>
                                        : null
                                }
                            </View>
                            <Text style={{width: '43.74%'}}>{outstanding.order_date}</Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    renderNotRealizedChequeItems(cheques) {
        return (
            <View>
                {
                    cheques.map((cheque, index) => (
                        <View key={index}>
                            <Text style={{width: '75%'}}>
                                {'# ' + cheque.cheque_no + ', ' + cheque.cheque_date}
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{width: '50%'}}>
                                    {cheque.bank_name}
                                </Text>
                                <Text style={{width: '25%', textAlign: 'right'}}>
                                    {transformToCurrency(cheque.payment)}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
    }

    renderPreviousCollectionItems(previousCollections) {
        return (
            <View>
                {
                    previousCollections.map((payment, index) => (
                        <View key={index}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{width: '35.41%'}}>{payment.id}</Text>
                                <Text style={{width: '22.92%'}}>{payment.date}</Text>
                                <Text style={{width: '16.67%', textAlign: 'right'}}>{payment.mode}</Text>
                                <Text style={{width: '25%', textAlign: 'right'}}>
                                    {transformToCurrency(payment.payment)}
                                </Text>
                            </View>
                            {
                                payment.mode === 'Cheque'
                                    ?
                                    <Text>{'# ' + payment.cheque_no + ', ' + payment.cheque_date + ', ' + payment.bank_name}</Text>
                                    : null
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        const {receipt_mode, printData} = this.state;
        if (printData.is_order_printed === 'Yes' && receipt_mode !== 'Payment') return showMessage('Sorry, This bill is already printed');
        let count = 1;
        if (this.state.receipt_mode === 'Credit') {
            this.setState({isLoading: true});
            this.printBill(count);
            count++;
            setTimeout(() => {
                this.printBill(count);
                this.setOrderPrintStatus();
            }, 10000)
        } else {
            this.printBill(count);
            this.setOrderPrintStatus();
        }
    }

    printBill(count) {
        NetPrinterAPI.printText(
            buffer(
                this.state.printData,
                count,
                this.state.previousCollection,
                this.state.out_value,
                this.state.companyDetails,
                this.state.receipt_mode,
                this.state.not_realized_cheque
            )
        );
    }

    setOrderPrintStatus() {
        changePrintStatus(this.state.printData.id, 'Yes').then((order) => {
            if (order) {
                this.setState({isLoading: false});
                this.props.navigation.pop(3);
                // const resetAction = NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({routeName: 'InvoiceIndex'}),
                //     ]
                // });
                // this.props.navigation.dispatch(resetAction)
            }
        })
    }
}


// Payment Total Calculation function
function calculatePaymentTotal(data) {
    let paymentTotal = 0;
    if (data) {
        data.map((value) => {
            paymentTotal = paymentTotal + value.payment
        });
    }
    return paymentTotal;
}

// Payment Total Calculation function
function calculateInvoiceTotal(data) {
    let invoiceTotal = 0;
    if (data) {
        data.map((value) => {
            invoiceTotal = invoiceTotal + value.amount
        });
    }
    return invoiceTotal;
}

function validatePaidOutstanding(data, id) {
    let newArray = [];
    if (data.length) {
        data.map((value) => {
            if (value.amount > 0 && value.id !== id) {
                newArray.push(value)
            }
        });
    }
    return newArray;
}
