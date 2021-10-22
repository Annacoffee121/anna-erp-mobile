import React, {Component} from 'react';
import {connect} from 'react-redux';
import {filter} from 'lodash';
import {Text} from 'react-native';
import styles from './styles';
import {Button} from "react-native-elements";
import {Container, Content, View} from 'native-base';
import DropdownAlert from "react-native-dropdownalert";
import {showMessage} from "../../../../../../helpers/toast";
import Spinner from '../../../../../../components/spinner/index';
import ScreenHeader from "../../../../../../components/textHeader";
import PaymentView from "../../../../../../components/paymentList";
import AddPaymentComp from "../../../../../../components/returnChequePayment";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import {getFinalBalanceTotal, getTotalPaid} from "../../../../../../helpers/customerValidation";
import {storeAllRetChePayments, syncAllRetChePayments} from "../../../../../../services/sync/returnedCheque";
import {convertDataToPrint} from "../../../../../../helpers/returnedCheque";
import {getReturnedChequeById} from "../../../../../../actions/more";

class ReturnedChequeView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            cheque: null,
            isLoading: false,
            loadingText: null,
            total: 0,
            payment: [],
            storedPayment: [],
            isLocation: false,
            hasError: false
        };
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const {cheque} = this.props.navigation.state.params;
        this.props.getReturnedCheques(cheque.cheque_no).then(data => {
            this.setState({cheque: data, total: data.total, storedPayment: Object.values(data.payments)})
        });
    }

    render() {
        const {cheque} = this.state;
        return (
            <Container style={styles.container}>
                {cheque ? this.renderBody() : <Text>Loading...</Text>}
            </Container>
        )
    }

    renderBody() {
        const {loadingText, isLoading, isLocation} = this.state;
        const {payment, storedPayment, total, cheque} = this.state;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={cheque ? cheque.cheque_no : 'Returned cheque detail'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                              rightButtonValue='Submit'
                              rightButtonPress={() => this.onSubmitPress()}
                />
                <Spinner visible={isLoading}
                         textContent={loadingText ? loadingText : 'Loading...'}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                <View style={{backgroundColor: '#00897B', paddingBottom: 10, alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 20, color: '#FFF'}}>Amount: </Text>
                        <Text style={{fontSize: 20, color: '#e1e1e1'}}>{transformToCurrency(cheque.total)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text style={{fontSize: 17, color: '#FFF'}}>Cheque date: </Text>
                        <Text style={{fontSize: 17, color: '#e1e1e1'}}>{cheque.cheque_date}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text style={{fontSize: 15, color: '#FFF'}}>Customer name: </Text>
                        <Text style={{fontSize: 15, color: '#e1e1e1'}}>{cheque.customer}</Text>
                    </View>
                </View>
                <Content style={styles.content}>
                    {storedPayment.length ?
                        <View style={styles.cardView}>
                            {
                                storedPayment.map((value, key) => (
                                    <PaymentView
                                        key={key}
                                        paymentPressed={() => {
                                        }}
                                        mode={value.payment_mode}
                                        type={value.payment_type}
                                        amount={value.payment}
                                        syncStatus={value.is_not_synced}
                                        paymentDetails={
                                            value.payment_mode === 'Cheque'
                                                ? value.cheque_no + ', ' + value.cheque_date + ', ' + value.bank_name
                                                : value.payment_mode === 'Direct Deposit'
                                                ? value.account_no + ', ' + value.deposited_date + ', ' + value.bank_name
                                                : value.card_no + ', ' + value.expiry_date + ', ' + value.bank_name
                                        }
                                        disableRemoveButton={true}
                                        removeButtonPress={() => {
                                        }}
                                        refundButtonPress={() => {
                                            this.props.navigation.navigate('AddChequePayment', {
                                                payment: value,
                                                totalPayment: cheque.total,
                                                storedPayments: storedPayment,
                                                chequeNo: cheque.cheque_no,
                                                refresh: this.handleChangeStatus.bind(this)
                                            });
                                        }}
                                    />

                                ))
                            }
                            <View style={{marginTop: 10}}>
                                <Button
                                    raised
                                    icon={{name: 'print'}}
                                    backgroundColor={'#00897B'}
                                    color={'#FFF'}
                                    onPress={() => {
                                        const payments = filter(cheque.payments, o => o.is_printed !== "Yes");
                                        if (!payments.length) return showMessage("There are no payments to print!");
                                        const chequeData = convertDataToPrint(cheque);
                                        this.props.navigation.navigate('PrintReturnCheque', {cheque: chequeData})
                                    }}
                                    title={'Print'}/>
                            </View>
                        </View>
                        : null}
                    <View style={styles.cardView}>
                        {isLocation ? <Text style={styles.location}>Please wait, getting location ...</Text> : null}
                        <AddPaymentComp onChange={(value) => this.handelOnChangePayment(value)}
                                        onLocation={(v) => this.setState({isLocation: v})}
                                        defaultPayment={total}
                                        totalPaid={getTotalPaid(payment) + getTotalPaid(storedPayment)}
                                        balancePayment={getFinalBalanceTotal(total, payment, storedPayment)}
                                        hasError={this.state.hasError}
                                        onNavigate={this.props.navigation.navigate}/>
                    </View>
                </Content>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        );
    }

    handelOnChangePayment(value) {
        this.setState({payment: value})
    }

    handleChangeStatus() {
        this.loadData()
    }

    onSubmitPress() {
        const {isConnected} = this.props;
        const {payment, cheque} = this.state;
        if (!payment.length) return showMessage("Can't submit without payments!");
        this.setState({isLoading: true, loadingText: 'Updating payment...'});
        if (isConnected) {
            syncAllRetChePayments(payment, cheque.cheque_no).then(() => {
                this.setState({isLoading: false, loadingText: null});
                showMessage('Payment synced successfully!');
                this.props.navigation.goBack();
            }).catch(() => this.setState({isLoading: false, loadingText: null}))
        } else {
            storeAllRetChePayments(payment, cheque.cheque_no).then(() => {
                this.setState({isLoading: false, loadingText: null});
                showMessage('Payment stored successfully!');
                this.props.navigation.goBack();
            }).catch(() => this.setState({isLoading: false, loadingText: null}))
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});


const mapDispatchToProps = (dispatch) => ({
    getReturnedCheques(id) {
        return dispatch(getReturnedChequeById(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReturnedChequeView);
