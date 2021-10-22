import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements'
import PropTypes from './prop-types';
import DefaultProps from './default-props';
import {connect} from "react-redux";
import {Dropdown} from 'react-native-material-dropdown';
import {
    getBalanceTotal,
    validateAmount, validateChequeDigit, validateCreditCardDigit,
    validateChequeDate, validateEmptyInputText, validateId
} from "../../helpers/customerValidation";
import {TextField} from "react-native-material-textfield";
import moment from "moment/moment";
import DatePicker from "../date-picker";
import {getBankFromRealm} from "../../actions/dropdown";
import {showMessage} from "../../helpers/toast";
import {transformToCurrency} from "../../helpers/currencyFormatConverter";
import v4 from "uuid";
import GeoLocationService from "../../services/system/google-location";

class AddPaymentCompo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            hasError: false,
            chequeBank: '',
            depositBank: '',
            cardBank: '',
            canUpdate: true
        };
    };

    componentDidMount() {
        this.onSuccess()
    }

    componentDidUpdate() {
        const {payment} = this.props;
        const {canUpdate} = this.state;
        if (!payment) return;
        if (payment.length && canUpdate) {
            this.setState({canUpdate: false, dataSource: payment})
        }
    }


    onSuccess(value) {
        let stateValues = this.state.dataSource;
        if (this.props.onChange) {
            this.props.onChange(stateValues);
        }
    }

    onLocation(value) {
        this.props.onLocation(value);
    }

    render() {
        let color = this.props.balancePayment === 0 ? '#2b9135' : '#ff745f';
        const {dataSource} = this.state;
        return (
            <View>
                {
                    dataSource.length ?
                        dataSource.map((payment, index) => (
                            <View key={index} style={{backgroundColor: '#dfe7e5', marginBottom: 10}}>
                                <View style={{alignItems: 'flex-end', marginTop: 3, marginRight: 3}}>
                                    <TouchableOpacity onPress={() => this.handelRemovePaymentPressed(index)}>
                                        <Icon
                                            name='remove'
                                            color={'#c92a27'}
                                            type='font-awesome'
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{paddingLeft: 10, paddingRight: 10,}}>
                                    {this.renderBody(payment, index)}
                                </View>
                            </View>
                        )) : null
                }

                <View style={{padding: 10}}>
                    <Text style={{fontSize: 18, textAlign: 'center', marginBottom: 13, color: color}}>
                        {'Available balance: ' + transformToCurrency(this.props.balancePayment)}
                    </Text>
                    <Button
                        raised
                        icon={{name: 'add'}}
                        backgroundColor={'#00897B'}
                        color={'#FFF'}
                        onPress={this.handelAddPayment.bind(this)}
                        title={'Add payment'}/>
                </View>
            </View>
        );
    }

    renderBody(payment, index) {
        let paymentModeData = [{value: 'Cash'}, {value: 'Cheque'}, {value: 'Direct Deposit'}, {value: 'Credit Card'}];
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Dropdown
                        style={{alignItems: 'center'}}
                        label={'Payment mode'}
                        value={payment.payment_mode}
                        containerStyle={{width: '49%', marginRight: 5}}
                        data={paymentModeData}
                        animationDuration={10}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].payment_mode = value;
                            await payment.payment_mode === 'Cash' ?
                                dataSource[index].deposited_to = 1 :
                                dataSource[index].deposited_to = 50;
                            await this.handleClear(index);
                            await this.setState({dataSource});
                            this.onSuccess()
                        }}
                        selectedItemColor={'#00897B'}
                    />
                    <TextField
                        label='Payment'
                        value={payment.payment.toString()}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].payment = value;
                            await this.setState({dataSource});
                            await this.changePaymentType(index);
                            this.onSuccess();
                        }}
                        keyboardType="numeric"
                        containerStyle={{width: '49%', marginLeft: 10}}
                        error={this.props.hasError ? validateAmount(this.props.defaultPayment, this.props.totalPaid) : null}
                    />
                </View>
                {
                    payment.payment_mode === 'Cheque' ? this.renderChequeDetail(payment, index)
                        : payment.payment_mode === 'Direct Deposit' ? this.renderDirectDepositDetail(payment, index)
                        : payment.payment_mode === 'Credit Card' ? this.renderCreditCardDetail(payment, index)
                            : null
                }
            </View>
        )
    }

    renderChequeDetail(payment, index) {
        const chequeTypeData = [{value: 'Own',}, {value: 'Third Party',}];
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextField
                        label='Cheque no'
                        value={payment.cheque_no.toString()}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].cheque_no = value;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        keyboardType="numeric"
                        containerStyle={{width: '49%', marginRight: 10}}
                        error={this.props.hasError ? validateChequeDigit(payment.cheque_no) : null}
                    />
                    <DatePicker
                        label={'Cheque date'}
                        value={payment.cheque_date}
                        width={'50%'}
                        dateChanged={async (date) => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].cheque_date = date;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        error={this.props.hasError ? validateChequeDate(payment.cheque_date, payment.payment_date) : null}
                        editable={false}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Dropdown
                        style={{alignItems: 'center'}}
                        label={'Cheque type'}
                        value={payment.cheque_type}
                        containerStyle={{width: '49%', marginRight: 5}}
                        data={chequeTypeData}
                        animationDuration={10}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].cheque_type = value;
                            await this.setState({dataSource});
                            this.onSuccess()
                        }}
                        selectedItemColor={'#00897B'}
                    />
                    <TouchableOpacity onPress={() => {
                        this.props.onNavigate('SearchItems', {
                            getData: this.props.getBankData,
                            data: this.props.bank,
                            returnDropDownData: async (value, id) => {
                                let dataSource = [...this.state.dataSource];
                                dataSource[index].bank_id = id;
                                await this.setState({dataSource, chequeBank: value});
                                this.onSuccess();
                            }
                        })
                    }} style={{width: '48%', marginLeft: 5}}>
                        <TextField
                            label='Cheque written bank'
                            editable={false}
                            value={this.state.chequeBank}
                            tintColor={'#00897B'}
                            containerStyle={{width: '100%'}}
                            error={this.props.hasError ? validateId(payment.bank_id) : null}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderDirectDepositDetail(payment, index) {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextField
                        label='Account no'
                        value={payment.account_no.toString()}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].account_no = value;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        keyboardType="numeric"
                        containerStyle={{width: '49%', marginRight: 10}}
                        error={this.props.hasError ? validateEmptyInputText(payment.account_no) : null}
                    />
                    <DatePicker
                        label={'Deposited date'}
                        value={payment.deposited_date}
                        width={'50%'}
                        dateChanged={async (date) => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].deposited_date = date;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        error={this.props.hasError ? validateEmptyInputText(payment.deposited_date) : null}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    this.props.onNavigate('SearchItems', {
                        getData: this.props.getBankData,
                        data: this.props.bank,
                        returnDropDownData: async (value, id) => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].bank_id = id;
                            await this.setState({dataSource, depositBank: value});
                            this.onSuccess();
                        }
                    })
                }} style={{width: '100%'}}>
                    <TextField
                        label='Deposited bank'
                        editable={false}
                        value={this.state.depositBank}
                        tintColor={'#00897B'}
                        containerStyle={{width: '100%'}}
                        error={this.props.hasError ? validateId(payment.bank_id) : null}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderCreditCardDetail(payment, index) {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextField
                        label='Card holder name'
                        value={payment.card_holder_name}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].card_holder_name = value;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        containerStyle={{width: '49%', marginRight: 10}}
                        error={this.props.hasError ? validateEmptyInputText(payment.card_holder_name) : null}
                    />
                    <TextField
                        label='Card no'
                        value={payment.card_no.toString()}
                        tintColor={'#00897B'}
                        onChangeText={async value => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].card_no = value;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        keyboardType="numeric"
                        containerStyle={{width: '49%'}}
                        error={this.props.hasError ? validateCreditCardDigit(payment.card_no) : null}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {
                        this.props.onNavigate('SearchItems', {
                            getData: this.props.getBankData,
                            data: this.props.bank,
                            returnDropDownData: async (value, id) => {
                                let dataSource = [...this.state.dataSource];
                                dataSource[index].bank_id = id;
                                await this.setState({dataSource, cardBank: value});
                                this.onSuccess();
                            }
                        })
                    }} style={{width: '49%', marginRight: 10}}>
                        <TextField
                            label='Bank'
                            editable={false}
                            value={this.state.cardBank}
                            tintColor={'#00897B'}
                            containerStyle={{width: '100%'}}
                            error={this.props.hasError ? validateId(payment.bank_id) : null}
                        />
                    </TouchableOpacity>
                    <DatePicker
                        label={'Expiry date'}
                        value={payment.expiry_date}
                        width={'50%'}
                        editable={false}
                        dateChanged={async (date) => {
                            let dataSource = [...this.state.dataSource];
                            dataSource[index].expiry_date = date;
                            await this.setState({dataSource});
                            this.onSuccess();
                        }}
                        error={this.props.hasError ? validateChequeDate(payment.expiry_date, payment.payment_date) : null}
                    />
                </View>
            </View>
        )
    }

    changePaymentType(index) {
        let balance = getBalanceTotal(this.props.defaultPayment, this.state.dataSource);
        let dataSource = [...this.state.dataSource];
        if (balance === 0) {
            dataSource[index].payment_type = 'Final Payment';
        } else {
            dataSource[index].payment_type = 'Partial Payment';
        }
        this.setState({dataSource})
    }

    handleClear(index) {
        if (this.state.dataSource[index].payment_mode === 'Cash') {
            let dataSource = [...this.state.dataSource];
            dataSource[index].cheque_no = '';
            dataSource[index].cheque_date = '';
            dataSource[index].account_no = '';
            dataSource[index].deposited_date = '';
            dataSource[index].bank_id = '';
            this.setState({dataSource})
        }
    }

    handelAddPayment() {
        if (this.props.defaultPayment === 0) return showMessage('Please add line item to add payment!');
        if (this.props.balancePayment <= 0) return showMessage('Payment fulfilled already!');
        this.getGeoLocation();
    }

    getGeoLocation() {
        this.onLocation(true);
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            this.onLocation(false);
            console.warn('errors', errors);
            showMessage("Location error - 1");
        });
    }

    async addGeoLocationHeader(position) {
        this.onLocation(false);
        if (!position.hasOwnProperty("coords")) return showMessage("Location error - 2");
        this.addPayment(position.coords.latitude, position.coords.longitude);
    }

    async addPayment(gps_lat, gps_long) {
        const newPayment = {
            payment_type: 'Final Payment',
            payment_mode: 'Cash',
            uuid: v4(),
            payment: this.props.balancePayment,
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
            gps_lat,
            gps_long,
            bank_id: null,
            notes: 'Created in order panel'
        };
        let newData = this.state.dataSource;
        newData.push(newPayment);
        await this.setState({dataSource: newData});
        this.onSuccess();
    }

    async handelRemovePaymentPressed(index) {
        let stateValues = this.state.dataSource;
        stateValues.splice(index, 1);
        await this.setState({dataSource: stateValues});
        this.onSuccess()
    }
}

AddPaymentCompo.propTypes = PropTypes;
AddPaymentCompo.defaultProps = DefaultProps;

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    bank: state.dropdowns.bank,
});
const mapDispatchToProps = (dispatch) => ({
    getBankData() {
        return dispatch(getBankFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPaymentCompo);
