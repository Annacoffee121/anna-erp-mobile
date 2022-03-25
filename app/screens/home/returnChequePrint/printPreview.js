import React, {Component} from 'react';
import {View, Text} from 'react-native'
import {Container, Content} from 'native-base';
import styles from "./styles";
import ScreenHeader from '../../../components/textHeader';
import moment from "moment/moment";
import {transformToCurrency} from "../../../helpers/currencyFormatConverter";
import {buffer} from './view'
import Spinner from "../../../components/spinner";
import {changePaymentPrintStatus} from "../../../services/returnCheque/printStatus";
import NetPrinterAPI from "../../../helpers/NetPrinterAPI";

export default class PrintPreview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,
            loadingText: null,
        };
    }

    render() {
        const {loadingText} = this.state;
        const {printData} = this.props.navigation.state.params;
        return (
            <Container style={styles.container}>
                <ScreenHeader
                    name={'Print Preview'}
                    leftButtonValue='Back'
                    leftButtonPress={() => this.props.navigation.goBack()}
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
                            printData ? this.renderBody() : null
                        }
                    </View>
                </Content>
            </Container>
        )
    }

    renderBody() {
        const {companyDetails, printData} = this.props.navigation.state.params;
        const data = {
            companyName: companyDetails.name + ' - ' + companyDetails.city,
            phone: companyDetails.phone,
            company_mail: companyDetails.company_mail,
            orderId: 'Payment Receipt',
            cheque: {
                no: printData.cheque_no,
                bank: printData.bank,
                date: printData.cheque_date,
                total: printData.total,
            },
            customer: printData.customer,
            payment: Object.values(printData.payments),
            date: moment().format('YYYY-MM-DD h:mm:ss'),
            paymentTotal: calculatePaymentTotal(Object.values(printData.payments)),
            balance: printData.total - calculatePaymentTotal(Object.values(printData.payments)),
        };
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{backgroundColor: '#FFF', width: 380, padding: 10}}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{data.companyName}</Text>
                    <Text style={{textAlign: 'center'}}>{data.orderId}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer}</Text>
                    <Text style={{textAlign: 'center'}}>{data.date}</Text>
                    {this.renderOrderDetails(data.cheque)}
                    {this.renderPaymentDetails(data.payment, data.paymentTotal, data.balance)}
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
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Cheque Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '14.58%', fontWeight: 'bold'}}>Ch. No.</Text>
                    <Text style={{width: '39.58%', fontWeight: 'bold'}}>Bank</Text>
                    <Text style={{width: '20.83%', textAlign: 'right', fontWeight: 'bold'}}>Date</Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderOrderItems(data)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '25.01%'}}>{'-----------------------'}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.total)}
                    </Text>
                </View>
            </View>
        )
    }

    renderOrderItems(cheque) {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{width: '20.42%'}}>{cheque.no}</Text>
                <Text style={{width: '33.74%'}}>{cheque.bank}</Text>
                <Text style={{width: '20.83%', textAlign: 'right'}}>{cheque.date}</Text>
                <Text
                    style={{width: '25.01%', textAlign: 'right'}}>{transformToCurrency(cheque.total)}</Text>
            </View>
        )
    }

    renderPaymentDetails(payments, total, balance) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Payment Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Mode</Text>
                    <Text style={{width: '31.25%', fontWeight: 'bold', textAlign: 'right'}}>Amount</Text>
                </View>
                {this.renderPaymentItems(payments, total)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '56.26%'}}>
                        {'-----------------------------------------'}
                    </Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>{transformToCurrency(balance)}</Text>
                </View>
            </View>
        )
    }

    renderPaymentItems(payments, total) {
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
                                                {transformToCurrency(total)}
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

    handelHeaderRightButtonPress() {
        this.printBill();
        this.setOrderPrintStatus();
    }

    printBill() {
        const {companyDetails, printData} = this.props.navigation.state.params;
        NetPrinterAPI.printText(buffer(printData, companyDetails));
    }

    async setOrderPrintStatus() {
        const {printData} = this.props.navigation.state.params;
        await Promise.all(Object.values(printData.payments).map(payment => {
            changePaymentPrintStatus(payment.id, payment.uuid, "Yes").then(result => {
                if (result) {
                    this.setState({isLoading: false});
                    this.props.navigation.pop(3);
                }
            })
        }))
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
