import React, {Component,} from 'react';
import {Alert, Text, TouchableOpacity, View} from "react-native";
import {Container, Content} from "native-base";
import {find} from "lodash";
import {Button, Icon} from "react-native-elements";
import {TextField} from "react-native-material-textfield";
import {Dropdown} from "react-native-material-dropdown";
import {connect} from "react-redux";
import {ID} from "../../../../../../helpers/createId";
import ScreenHeader from "../../../../../../components/textHeader";
import styles from "./styles";
import {
    validateEndReading,
    validateNumberEmptyInputText
} from "../../../../../../helpers/customerValidation";
import GeoLocationService from "../../../../../../services/system/google-location";
import {
    deleteExpense,
    getAllExpensesType,
    getExpenses,
    insertExpense
} from "../../../../../../../database/Expenses/model";
import {getStartODOReading} from "../../../../../../../database/Mata/model";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import {transformExpense, transformExpenseToStore} from "../../../../../../helpers/handover";
import {removeExpense, submitExpenses} from "../../../../../../actions/handover";
import moment from "moment";
import Spinner from "../../../../../../components/spinner";
import {showMessage} from "../../../../../../helpers/toast";

class ExpensesTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expense_type: [],
            expense_type_id: null,
            isLoading: false,
            expense: {
                id: ID(),
                type: 'General',
                type_id: null,
                calculate_mileage_using: '',
                start_reading: '',
                end_reading: '',
                distance: '',
                gps_lat: null,
                gps_long: null,
                expense_date: null,
                expense_time: null,
                is_synced: false,
                liter: '',
                odometer: '',
                amount: '',
                notes: '',
            },
            hasError: false,
            expenses: [],
            start_odo_meter_reading: null
        };
    }

    componentWillMount() {
        this.loadExpenses();
    }

    loadExpenses() {
        getAllExpensesType().then(expense_type => {
            const type = find(expense_type, o => o.value === "General");
            const expense_type_id = type ? type.id : null;
            this.setState({
                expense_type, expense_type_id, expense: {
                    ...this.state.expense, type_id: expense_type_id
                }
            });
        });
        getExpenses().then(expensesData => {
            if (expensesData.length) {
                this.setState({expenses: expensesData});
            }
        });
        getStartODOReading().then(start_odo_meter_reading =>
            this.setState({start_odo_meter_reading})
        )
    }

    getGeoLocation() {
        this.setState({isLoading: true});
        GeoLocationService.get().then(async (position) => {
            this.addGeoLocationHeader(position);
            await this.addFuelExpenseToDb();
        }).catch(errors => {
            this.setState({isLoading: false});
            console.log('errors', errors);
        });
    }

    addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            this.setState({
                expense: {
                    ...this.state.expense,
                    gps_lat: position.coords.latitude,
                    gps_long: position.coords.longitude,
                    expense_date: moment().format('YYYY-MM-DD'),
                    expense_time: moment().format('HH:mm:ss'),
                }
            });
        }
    }

    render() {
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name={'Add expenses'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                    // rightButtonValue='Add'
                    // rightButtonPress={() => this.handleRightButtonPressed()}
                />
                <Content>
                    <Spinner visible={this.state.isLoading}
                             textContent={"Loading please wait.."}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    {this.state.expense_type.length ? this.renderDropDown() : null}
                    {this.renderExpenses()}
                </Content>
            </Container>
        )
    }

    renderDropDown() {
        return (
            <View style={styles.mainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 5}}>Expense details</Text>
                    <View style={{paddingLeft: 10, paddingRight: 10}}>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <Dropdown
                                style={{alignItems: 'center'}}
                                label={'Expense type'}
                                value={this.state.expense.type}
                                containerStyle={{width: '49%', marginRight: 5}}
                                data={this.state.expense_type}
                                animationDuration={10}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        expense: {
                                            ...this.state.expense,
                                            type: value,
                                            type_id: this.state.expense_type[index].id
                                        }
                                    })
                                }}
                                selectedItemColor={'#00897B'}
                            />
                            <TextField
                                label='Amount'
                                value={this.state.expense.amount.toString()}
                                returnKeyType="done"
                                keyboardType="numeric"
                                onChangeText={value => this.setState({
                                    expense: {...this.state.expense, amount: value}
                                })}
                                tintColor={'#00897B'}
                                containerStyle={{width: '49%', marginLeft: 5}}
                                error={this.state.hasError ? validateNumberEmptyInputText(this.state.expense.amount) : null}
                            />
                        </View>
                        {
                            this.state.expense.type === 'Fuel' ?
                                this.renderFuelView() : null
                        }
                        <TextField
                            label={'Expenses related notes'}
                            value={this.state.expense.notes}
                            returnKeyType="done"
                            keyboardType="default"
                            onChangeText={value => this.setState({
                                expense: {...this.state.expense, notes: value}
                            })}
                            tintColor={'#00897B'}
                            autoCapitalize="sentences"
                            multiline={true}
                        />
                        <Button
                            raised
                            icon={{name: 'add'}}
                            backgroundColor={'#00897B'}
                            color={'#FFF'}
                            onPress={() => this.handleRightButtonPressed()}
                            title='Add to line'/>
                    </View>
                </View>
            </View>
        )
    }

    renderFuelView() {
        const {expense, start_odo_meter_reading} = this.state;
        return (
            <View style={{flexDirection: 'row',}}>
                <TextField
                    label='ODO Meter reading'
                    value={this.state.expense.odometer}
                    returnKeyType="done"
                    keyboardType="numeric"
                    onChangeText={value => this.setState({
                        expense: {...this.state.expense, odometer: value}
                    })}
                    tintColor={'#00897B'}
                    containerStyle={{width: '49%', marginRight: 5}}
                    error={this.state.hasError ? validateEndReading(start_odo_meter_reading, expense.odometer) : null}
                />
                <TextField
                    label='Fuel in liter'
                    value={this.state.expense.liter}
                    returnKeyType="done"
                    keyboardType="numeric"
                    onChangeText={value => this.setState({
                        expense: {...this.state.expense, liter: value}
                    })}
                    containerStyle={{width: '49%', marginLeft: 5}}
                    tintColor={'#00897B'}
                    error={this.state.hasError ? validateNumberEmptyInputText(this.state.expense.liter) : null}
                />
            </View>
        )
    }

    renderExpenses() {
        const {expenses} = this.state;
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    {expenses.length ?
                        expenses.map((expense, index) => {
                            const color = expense.is_synced ? "#ebf3f1" : "#f1a78d";
                            return (
                                <View key={index}
                                      style={[{backgroundColor: color}, styles.mainView]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{width: '40%'}}>{expense.type} </Text>
                                        <Text style={styles.amountText}>{transformToCurrency(expense.amount)}</Text>
                                        <TouchableOpacity
                                            style={{width: '30%', alignItems: 'flex-end'}}
                                            onPress={() => this.removeButtonPressed(expense)}>
                                            <Icon
                                                name='remove'
                                                type='font-awesome'
                                                color={'#ca2c2c'}
                                                size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                        : <Text>~ No expenses found ~</Text>}
                </View>
            </View>
        )
    }

    removeButtonPressed(value) {
        Alert.alert(
            'Are you sure?',
            'Do you want delete this expense?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes, Delete!', onPress: () => this.removeFromArray(value)},
            ],
            {cancelable: false}
        )
    }

    removeFromArray(value) {
        const {isConnected} = this.props;
        if (isConnected && value.is_synced) {
            this.props.removeExpensesData(value.id).then(res => {
                deleteExpense(value.id).then(() => {
                    let previousItem = this.state.expenses;
                    this.setState({expenses: previousItem});
                }).catch(error => console.warn(error))
            }).catch(error => console.log(error, "Expense delete error"));
        } else if (!value.is_synced) {
            deleteExpense(value.id).then(() => {
                let previousItem = this.state.expenses;
                this.setState({expenses: previousItem});
            }).catch(error => console.warn(error))
        } else {
            showMessage("Can't delete this expense at the moment!")
        }
    }

    handleRightButtonPressed() {
        const {expense, start_odo_meter_reading} = this.state;
        if (expense.type !== 'Fuel') {
            if (validateNumberEmptyInputText(expense.amount)) {
                return this.setState({hasError: true});
            }
        }
        if (expense.type === 'Fuel') {
            if (validateNumberEmptyInputText(expense.amount)) {
                return this.setState({hasError: true});
            }
            if (validateEndReading(start_odo_meter_reading, expense.odometer)) {
                return this.setState({hasError: true});
            }
            if (validateNumberEmptyInputText(expense.liter)) {
                return this.setState({hasError: true});
            }
        }
        return this.getGeoLocation();
    }

    addFuelExpenseToDb() {
        const {isConnected} = this.props;
        const {expense_type_id} = this.state;
        const expense = {
            id: ID(),
            type: 'General',
            type_id: expense_type_id,
            calculate_mileage_using: '',
            start_reading: '',
            end_reading: '',
            distance: '',
            gps_lat: null,
            gps_long: null,
            expense_date: null,
            expense_time: null,
            is_synced: false,
            liter: '',
            odometer: '',
            amount: '',
            notes: '',
        };
        let data = transformExpense(this.state.expense);
        if (isConnected) {
            this.props.submitExpensesData(data).then(res => {
                const tData = transformExpenseToStore(this.state.expense, res);
                insertExpense(tData).then(() => {
                    this.setState({isLoading: false});
                    this.setState({expense, hasError: false});
                    this.loadExpenses();
                }).catch(error => console.log(error))
            }).catch(error => {
                this.setState({isLoading: false});
                console.log(error, "submit expenses error")
            })
        } else {
            insertExpense(data).then(() => {
                this.setState({isLoading: false});
                this.setState({expense, hasError: false});
                this.loadExpenses();
            }).catch(error => console.log(error))
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    submitExpensesData(formData) {
        return dispatch(submitExpenses(formData));
    },
    removeExpensesData(expense_id) {
        return dispatch(removeExpense(expense_id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTab);