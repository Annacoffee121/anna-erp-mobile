import React, {Component,} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Container, Content} from 'native-base';
import {TextField} from 'react-native-material-textfield';
import {connect} from "react-redux";
import {Dropdown} from 'react-native-material-dropdown';
import _ from 'lodash'
import ScreenHeader from '../../../../../../components/textHeader';
import styles from './styles';
import {
    validateAmount, validateChequeDigit, validateCreditCardDigit,
    validateDate, validateEmptyInputText, validateId, validateChequeDate
} from "../../../../../../helpers/customerValidation";
import DatePicker from '../../../../../../components/date-picker/index'
import Spinner from '../../../../../../components/spinner/index';
import {getBankFromRealm} from "../../../../../../actions/dropdown";
import moment from "moment/moment";
import v4 from "uuid";
import GeoLocationService from "../../../../../../services/system/google-location";
import {showMessage} from "../../../../../../helpers/toast";
import {
    patchChequePayment,
    updateChequePayment
} from "../../../../../../services/sync/returnedCheque";

class NewPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                payment_type: 'Final Payment',
                uuid: v4(),
                payment_mode: 'Cash',
                payment: '',
                payment_date: moment().format('YYYY-MM-DD'),
                deposited_to: 1,
                cheque_no: '',
                cheque_date: '',
                cheque_type: 'Own',
                account_no: '',
                deposited_date: '',
                card_holder_name: '',
                card_no: '',
                expiry_date: '',
                bank_id: null,
                gps_lat: null,
                gps_long: null,
                notes: '',
            },
            bank: '',
            originalAmount: null,
            invoiceId: null,
            paymentId: null,
            isEdit: false,
            hasError: false,
            isLoading: false,
            orderId: null,
            availablePayment: null
        };
    }

    componentDidMount() {
        this.mountData()
    }


    mountData() {
        const {balancePayment, payment} = this.props.navigation.state.params;
        const {totalPayment, storedPayments} = this.props.navigation.state.params;
        this.setState({
            isEdit: true,
            dataSource: payment,
            originalAmount: balancePayment,
        });
        this.setDropDownValue();
        this.checkAvailableBalance(totalPayment, storedPayments, payment.payment)
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        state.params.refresh();
    }

    setDropDownValue() {
        // Download dropDown if not available
        if (!this.props.bank) {
            this.props.getBankData()
        }
        // Set values to dropDown
        let bankValue = _.find(this.props.bank, {value: this.state.dataSource.bank_id});
        this.setState({
            bank: bankValue ? bankValue.name : ''
        })
    }

    getGeoLocation() {
        this.setState({isLoading: true});
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            this.setState({isLoading: false});
            showMessage('Payment location error-1');
        });
    }

    async addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            await this.setState({
                dataSource: {
                    ...this.state.dataSource, gps_lat: position.coords.latitude, gps_long: position.coords.longitude,
                }
            });
            this.progressPaymentAction();
        } else {
            this.setState({isLoading: false});
            showMessage('Payment location error-2');
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={this.state.isEdit ? 'Update Payment' : 'Record Payment'}
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                              rightButtonValue={this.state.isEdit ? 'Update' : 'Create'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content>
                    <View style={styles.content}>
                        <Spinner visible={this.state.isLoading}
                                 textContent={configurations.loginScreenLoaderText}
                                 textStyle={{color: '#00897B'}}
                                 color={'#00897B'}/>
                        {this.renderBody()}
                    </View>
                </Content>
            </Container>
        )
    }

    renderBody() {
        let paymentModeData = [{value: 'Cash'}, {value: 'Cheque'}, {value: 'Direct Deposit'}, {value: 'Credit Card'}];
        return (
            <View style={styles.customerHeader}>
                <View style={{flexDirection: 'row', width: '90%'}}>
                    <Dropdown
                        style={{alignItems: 'center'}}
                        label={'Payment mode'}
                        value={this.state.dataSource.payment_mode}
                        containerStyle={{width: '50%', marginRight: 5}}
                        data={paymentModeData}
                        animationDuration={10}
                        onChangeText={value => {
                            this.setState({dataSource: {...this.state.dataSource, payment_mode: value}});
                            this.state.dataSource.payment_mode === 'Cash' ?
                                this.setState({dataSource: {...this.state.dataSource, deposited_to: 1}}) :
                                this.setState({dataSource: {...this.state.dataSource, deposited_to: 50}});
                            this.handleClear();
                        }}
                        selectedItemColor={'#00897B'}
                    />
                    <TextField
                        label='Payment'
                        value={this.state.dataSource.payment.toString()}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            await this.changePaymentType(value);
                            this.setState({dataSource: {...this.state.dataSource, payment: value}});
                        }}
                        keyboardType="numeric"
                        containerStyle={{width: '50%', marginLeft: 5}}
                        error={this.state.hasError && !this.state.isEdit ? validateAmount(this.state.availablePayment, this.state.dataSource.payment) :
                            this.state.hasError && this.state.isEdit ? validateAmount(this.state.originalAmount, this.state.dataSource.payment) :
                                null}
                    />
                </View>

                {
                    this.state.dataSource.payment_mode === 'Cheque'
                        ? this.renderChequeDetail()
                        : this.state.dataSource.payment_mode === 'Direct Deposit'
                        ? this.renderDirectDepositDetail()
                        : this.state.dataSource.payment_mode === 'Credit Card'
                            ? this.renderCreditCardDetail()
                            : null
                }
            </View>
        )
    }

    renderChequeDetail() {
        const chequeTypeData = [{value: 'Own',}, {value: 'Third Party',}];
        return (
            <View style={{width: '90%'}}>
                <TextField
                    label='Cheque no'
                    value={this.state.dataSource.cheque_no ? this.state.dataSource.cheque_no.toString() : ''}
                    tintColor={'#00897B'}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, cheque_no: value}})}
                    keyboardType="numeric"
                    containerStyle={{width: '100%'}}
                    error={this.state.hasError ? validateChequeDigit(this.state.dataSource.cheque_no) : null}
                />
                <DatePicker
                    label={'Cheque date'}
                    value={this.state.dataSource.cheque_date}
                    dateChanged={(date) => this.setState({dataSource: {...this.state.dataSource, cheque_date: date}})}
                    onChange={(value) => this.setState({dataSource: {...this.state.dataSource, cheque_date: value}})}
                    error={this.state.hasError ? validateChequeDate(this.state.dataSource.cheque_date, this.state.dataSource.payment_date) : null}
                    editable={false}
                />
                <Dropdown
                    style={{alignItems: 'center'}}
                    label={'Cheque type'}
                    value={this.state.dataSource.cheque_type}
                    containerStyle={{width: '100%'}}
                    data={chequeTypeData}
                    animationDuration={10}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, cheque_type: value}})}
                    selectedItemColor={'#00897B'}
                />
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SearchBankItems', {
                        getData: this.props.getBankData,
                        data: this.props.bank,
                        returnDropDownData: (value, id) => {
                            this.setState({bank: value, dataSource: {...this.state.dataSource, bank_id: id}})
                        }
                    })
                }} style={{width: '90%'}}>
                    <TextField
                        label='Cheque written bank'
                        editable={false}
                        value={this.state.bank}
                        tintColor={'#00897B'}
                        containerStyle={{width: '100%'}}
                        error={this.state.hasError ? validateId(this.state.dataSource.bank_id) : null}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderDirectDepositDetail() {
        return (
            <View style={{width: '90%'}}>
                <TextField
                    label='Account no'
                    value={this.state.dataSource.account_no.toString()}
                    tintColor={'#00897B'}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, account_no: value}})}
                    keyboardType="numeric"
                    containerStyle={{width: '100%'}}
                    error={this.state.hasError ? validateEmptyInputText(this.state.dataSource.account_no) : null}
                />
                <DatePicker
                    label={'Deposited date'}
                    value={this.state.dataSource.deposited_date}
                    dateChanged={(date) => this.setState({
                        dataSource: {
                            ...this.state.dataSource,
                            deposited_date: date
                        }
                    })}
                    onChange={(value) => this.setState({dataSource: {...this.state.dataSource, deposited_date: value}})}
                    error={this.state.hasError ? validateEmptyInputText(this.state.dataSource.deposited_date) : null}
                />
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SearchBankItems', {
                        getData: this.props.getBankData,
                        data: this.props.bank,
                        returnDropDownData: (value, id) => {
                            this.setState({bank: value, dataSource: {...this.state.dataSource, bank_id: id}})
                        }
                    })
                }} style={{width: '90%'}}>
                    <TextField
                        label='Deposited bank'
                        editable={false}
                        value={this.state.bank}
                        tintColor={'#00897B'}
                        containerStyle={{width: '100%'}}
                        error={this.state.hasError ? validateId(this.state.dataSource.bank_id) : null}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderCreditCardDetail() {
        return (
            <View style={{width: '90%'}}>
                <TextField
                    label='Card holder name'
                    value={this.state.dataSource.card_holder_name}
                    tintColor={'#00897B'}
                    onChangeText={value => this.setState({
                        dataSource: {
                            ...this.state.dataSource,
                            card_holder_name: value
                        }
                    })}
                    containerStyle={{width: '100%'}}
                    error={this.state.hasError ? validateEmptyInputText(this.state.dataSource.card_holder_name) : null}
                />
                <TextField
                    label='Card no'
                    value={this.state.dataSource.card_no.toString()}
                    tintColor={'#00897B'}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, card_no: value}})}
                    keyboardType="numeric"
                    containerStyle={{width: '100%'}}
                    error={this.state.hasError ? validateCreditCardDigit(this.state.dataSource.card_no) : null}
                />
                <DatePicker
                    label={'Expiry date'}
                    value={this.state.dataSource.expiry_date}
                    dateChanged={(date) => this.setState({
                        dataSource: {
                            ...this.state.dataSource,
                            expiry_date: date
                        }
                    })}
                    onChange={(value) => this.setState({dataSource: {...this.state.dataSource, expiry_date: value}})}
                    error={this.state.hasError ? validateDate(this.state.dataSource.expiry_date, this.state.dataSource.payment_date) : null}
                />
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SearchBankItems', {
                        getData: this.props.getBankData,
                        data: this.props.bank,
                        returnDropDownData: (value, id) => {
                            this.setState({bank: value, dataSource: {...this.state.dataSource, bank_id: id}})
                        }
                    })
                }} style={{width: '90%'}}>
                    <TextField
                        label='Bank'
                        editable={false}
                        value={this.state.bank}
                        tintColor={'#00897B'}
                        containerStyle={{width: '100%'}}
                        error={this.state.hasError ? validateId(this.state.dataSource.bank_id) : null}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    handleClear() {
        if (this.state.dataSource.payment_mode === 'Cash') {
            this.setState({
                dataSource: {
                    ...this.state.dataSource,
                    cheque_no: '',
                    cheque_date: '',
                    account_no: '',
                    deposited_date: '',
                    bank_id: null,
                }

            })
        }
    }

    async checkAvailableBalance(totalPayment, storedPayments, currentAmount) {
        let alreadyPaid = 0;
        if (storedPayments.length) {
            storedPayments.map(payment => {
                alreadyPaid = alreadyPaid + payment.payment
            })
        }
        await this.setState({availablePayment: totalPayment - (alreadyPaid - currentAmount)})
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        if (validateEmptyInputText(this.state.dataSource.payment_date)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.dataSource.deposited_to)) {
            return this.setState({hasError: true});
        }
        if (validateAmount(this.state.availablePayment, this.state.dataSource.payment)) {
            return this.setState({hasError: true});
        }
        if (this.state.isEdit) {
            if (validateAmount(this.state.originalAmount, this.state.dataSource.payment)) {
                return this.setState({hasError: true});
            }
        }
        if (this.state.dataSource.payment_mode === 'Cheque') {
            if (validateChequeDate(this.state.dataSource.cheque_date, this.state.dataSource.payment_date)) {
                return this.setState({hasError: true});
            }
            if (validateChequeDigit(this.state.dataSource.cheque_no)) {
                return this.setState({hasError: true});
            }
            if (validateId(this.state.dataSource.bank_id)) {
                return this.setState({hasError: true});
            }
        }
        if (this.state.dataSource.payment_mode === 'Direct Deposit') {
            if (validateEmptyInputText(this.state.dataSource.deposited_date)) {
                return this.setState({hasError: true});
            }
            if (validateEmptyInputText(this.state.dataSource.account_no)) {
                return this.setState({hasError: true});
            }
            if (validateId(this.state.dataSource.bank_id)) {
                return this.setState({hasError: true});
            }
        }
        if (this.state.dataSource.payment_mode === 'Credit Card') {
            if (validateEmptyInputText(this.state.dataSource.card_holder_name)) {
                return this.setState({hasError: true});
            }
            if (validateCreditCardDigit(this.state.dataSource.card_no)) {
                return this.setState({hasError: true});
            }
            if (validateDate(this.state.dataSource.expiry_date, this.state.dataSource.payment_date)) {
                return this.setState({hasError: true});
            }
            if (validateId(this.state.dataSource.bank_id)) {
                return this.setState({hasError: true});
            }
        }
        this.getGeoLocation();
    }

    progressPaymentAction() {
        const {isConnected} = this.props;
        const {dataSource} = this.state;
        const {chequeNo} = this.props.navigation.state.params;
        this.setState({isLoading: true, loadingText: 'Updating payment...'});
        if (isConnected && dataSource.id) {
            patchChequePayment(dataSource, chequeNo).then(() => {
                this.setState({isLoading: false, loadingText: null});
                showMessage('Payment synced successfully!');
                this.props.navigation.goBack();
            }).catch((error) => {
                console.warn(error, 'error');
                this.setState({isLoading: false, loadingText: null});
            })
        } else {
            updateChequePayment(dataSource, chequeNo).then(() => {
                this.setState({isLoading: false, loadingText: null});
                showMessage('Payment stored successfully!');
                this.props.navigation.goBack();
            }).catch(() => this.setState({isLoading: false, loadingText: null}))
        }
    }

    changePaymentType(value) {
        let amount = value ? parseFloat(value) : 0;
        if (this.state.availablePayment === amount) {
            this.setState({dataSource: {...this.state.dataSource, payment_type: 'Final Payment'}});
        } else {
            this.setState({dataSource: {...this.state.dataSource, payment_type: 'Partial Payment'}});
        }
    }
}


const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    bank: state.dropdowns.bank,
    payment: state.invoice.payment,
});

const mapDispatchToProps = (dispatch) => ({
    getBankData() {
        return dispatch(getBankFromRealm());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPayment);
