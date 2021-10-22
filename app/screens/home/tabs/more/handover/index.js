import React, {Component,} from 'react';
import {Alert, Text, View} from 'react-native'
import {Divider, Button} from 'react-native-elements'
import {Container, Content} from "native-base";
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from "../../../../../components/spinner";
import styles from "./styles";
import {connect} from "react-redux";
import {getHandoverData, submitHandover} from "../../../../../actions/handover";
import {calculatePaymentTotal, transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import CollectionView from "../../../../../components/moreButtons";
import {TextField} from "react-native-material-textfield";
import ScreenHeader from "../../../../../components/textHeader";
import {logoutProcess} from "../../../../../actions/auth";
import {storage} from "../../../../../config/storage";
import {deleteAll} from "../../../../../../database/Customer/controller";
import {NavigationActions} from 'react-navigation'
import {validateEmptyInputText, validateEndReading} from "../../../../../helpers/customerValidation";
import {getExpenses} from "../../../../../../database/Expenses/model";
import {showMessage} from "../../../../../helpers/toast";
import {getAllReplacedQuantity, getAllSoldQuantity} from "../../../../../../database/Products/controller";
import {
    changeHandoverData, getAllNotVisitReasonAndValidate, getNotVisitCustomerNotes
} from "../../../../../helpers/handover";
import {getAllNotVisitReason} from "../../../../../../database/NotVisited/model";
import {handleOfflineDataValidation} from "../../../../../helpers/offline-data";
import {getResolutionDetails} from "../../../../../../database/Returns";
import {get_allocation} from "../../../../../../database/Mata/model";
import {validateAllocationDate} from "../../../../../helpers/allocationDateCheck";

class HandoverTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataSource: null,
            tomorrow_route: null,
            all_actual_stock_confirmed: null,
            allowance: 0,
            mileage_rate: 0,
            start_odo_meter_reading: 0,
            odometer_end_reading: '',
            expenses: [],
            allocated_customers: [],
            visited_customers: [],
            not_visited_customers: [],
            notes: '',
            hasError: false,
            customerNames: [],
            not_visit_customer_notes: {},
            sold_qty: null,
            replaced_qty: null,
            isCusReasonError: false,
            numOfReason: null,
            return_total: 0,
            today_credit_bill_amount: 0
        };
    }

    componentWillMount() {
        this.validateAllocation();
    }

    validateAllocation() {
        get_allocation().then(allocation => {
            if (validateAllocationDate(allocation.to_date)) {
                this.handleOkButtonPressed();
            } else {
                this.loadRemoteOrders();
            }
        })
    }

    onError = error => {
        if (error) {
            let errorKeys = Object.keys(error.errors);
            if (errorKeys.length) {
                this.dropdown.alertWithType('error',
                    error.message,
                    error.errors[0] || error.errors[errorKeys[0]][0]);
            }
        }
    };

    loadRemoteOrders(callback) {
        if (!this.props.isConnected) return this.goBackWithMessage();
        this.setState({isLoading: true, isCusReasonError: false});
        getAllSoldQuantity().then(result => {
            this.setState({sold_qty: result})
        });
        getResolutionDetails().then(Resolutions => {
            let result = Resolutions.filter(resolution => resolution.type === 'Refund');
            if (result.length) {
                this.setState({return_total: calculatePaymentTotal(result)})
            }
        });
        getAllReplacedQuantity().then(result => {
            this.setState({replaced_qty: result})
        });
        this.props.getHandoversData().done(() => {
            this.setState({
                dataSource: this.props.handover.collections,
                allowance: this.props.handover.allowance,
                mileage_rate: this.props.handover.mileage_rate,
                start_odo_meter_reading: this.props.handover.start_odo_meter_reading,
                allocated_customers: this.props.handover.today_allocated_customers,
                visited_customers: this.props.handover.today_visited_customers,
                not_visited_customers: this.props.handover.today_not_visited_customers,
                today_credit_bill_amount: this.props.handover.today_credit_bill_amount,
                tomorrow_route: this.props.handover.tomorrow_route,
                all_actual_stock_confirmed: this.props.handover.all_actual_stock_confirmed,
                isLoading: false
            });
            this.loadExpenses();
            this.loadNotVisitLength();
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    loadNotVisitLength() {
        let newArray = [];
        getAllNotVisitReason().then(allReason => {
            this.state.not_visited_customers.map(id => {
                let found = allReason.find(function (element) {
                    return element.id === id;
                });
                if (found) {
                    if (found.reason) {
                        newArray.push(found)
                    }
                }
            });
            let notVisit = this.state.not_visited_customers.length - newArray.length;
            this.setState({numOfReason: notVisit})
        });
    }

    loadExpenses() {
        getExpenses().then(expensesData => {
            if (expensesData.length) {
                this.setState({expenses: expensesData});
            }
        })
    }

    render() {
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name={'Handover'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                    // rightButtonValue='Submit'
                    // rightButtonPress={() => this.handleRightButtonPress()}
                />
                <Spinner visible={this.state.isLoading}
                         textContent={'Loading'}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                {
                    this.state.dataSource ?
                        this.headerDetails() :
                        <Text>Loading...</Text>
                }
                <Content>
                    {
                        this.state.dataSource ?
                            this.renderMoreList() :
                            <Text>Loading...</Text>
                    }
                </Content>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        )
    }

    headerDetails() {
        return (
            <View>
                {
                    this.state.not_visited_customers.length !== 0 ?
                        this.renderWarningHeader() : null
                }
                {
                    this.state.hasError && this.state.isCusReasonError ?
                        this.renderReasonForNotVisitedCustomer() : null
                }
                {this.renderSubmitButton()}
            </View>
        )
    }

    renderSubmitButton = () => (
        <View style={{backgroundColor: '#FFF', padding: 5}}>
            <Button
                raised
                onPress={() => this.handleRightButtonPress()}
                icon={{name: 'md-hand', type: 'ionicon'}}
                backgroundColor={'#008000'}
                title='Submit Handover'/>
        </View>
    );

    renderMoreList() {
        return (
            <View>
                {this.renderVisitedCustomerDetails()}
                {this.renderTodayCollection()}
                {this.renderOldCollection()}
                {this.renderReturnedChequeCollection()}
                {this.renderCreditSelection()}
                {this.renderExpenses()}
                {this.renderTotalCollection()}
                {this.renderFooter()}
            </View>
        )
    }

    renderWarningHeader() {
        return (
            <View style={{backgroundColor: '#ffa423', alignItems: 'center', height: 50}}>
                <Text style={{fontSize: 18, color: '#FFF', marginTop: 10, textAlign: 'center'}}>
                    {'You have ' + this.state.not_visited_customers.length + ' more customer to visit today'}
                </Text>
            </View>
        )
    }

    renderVisitedCustomerDetails() {
        return (
            <View style={styles.mainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Today's achievement</Text>
                    <CollectionView
                        leftVaueOne={'Allocated customers:'}
                        rightVaueOne={this.state.allocated_customers.length}
                        leftVaueTwo={'Visited customers:'}
                        rightVaueTwo={this.state.visited_customers.length}
                    />
                </View>
            </View>
        )
    }

    renderReasonForNotVisitedCustomer() {
        return (
            <View style={{backgroundColor: '#ffa423', alignItems: 'center', height: 80}}>
                <Text style={{color: '#FFF', textAlign: 'center', fontSize: 18}}>
                    {
                        this.state.numOfReason > 1
                            ? 'There are ' + this.state.numOfReason + ' customers that you have not visited today, please mark the reason to continue!'
                            : 'There is ' + this.state.numOfReason + ' customer that you have not visited today, please mark the reason to continue!'
                    }
                </Text>
                <Text style={styles.forgotPwdText}
                      onPress={() => this.props.navigation.navigate('CustomerReason', {refresh: this.loadRemoteOrders.bind(this)})}>
                    {'Click here to mark'}
                </Text>
            </View>
        )
    }

    renderTodayCollection() {
        let collection = this.state.dataSource.today_collections;
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Collection from Today's Orders</Text>
                    <CollectionView
                        leftVaueOne={'Cash:'}
                        rightVaueOne={transformToCurrency(collection.cash)}
                        leftVaueTwo={'Cheque:'}
                        rightVaueTwo={transformToCurrency(collection.cheque)}
                    />
                    <CollectionView
                        leftVaueOne={'Direct Deposit:'}
                        rightVaueOne={transformToCurrency(collection.direct_deposit)}
                        leftVaueTwo={'Credit Card:'}
                        rightVaueTwo={transformToCurrency(collection.credit_card)}
                    />
                </View>
            </View>
        )
    }

    renderOldCollection() {
        let collection = this.state.dataSource.old_collections;
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Collection from Old Orders</Text>
                    <CollectionView
                        leftVaueOne={'Cash:'}
                        rightVaueOne={transformToCurrency(collection.cash)}
                        leftVaueTwo={'Cheque:'}
                        rightVaueTwo={transformToCurrency(collection.cheque)}
                    />
                    <CollectionView
                        leftVaueOne={'Direct Deposit:'}
                        rightVaueOne={transformToCurrency(collection.direct_deposit)}
                        leftVaueTwo={'Credit Card:'}
                        rightVaueTwo={transformToCurrency(collection.credit_card)}
                    />
                </View>
            </View>
        )
    }

    renderReturnedChequeCollection() {
        const collection = this.state.dataSource.returned_cheque_collections;
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Collection for Returned Cheques</Text>
                    <CollectionView
                        leftVaueOne={'Cash:'}
                        rightVaueOne={transformToCurrency(collection.cash)}
                        leftVaueTwo={'Cheque:'}
                        rightVaueTwo={transformToCurrency(collection.cheque)}
                    />
                    <CollectionView
                        leftVaueOne={'Direct Deposit:'}
                        rightVaueOne={transformToCurrency(collection.direct_deposit)}
                        leftVaueTwo={'Credit Card:'}
                        rightVaueTwo={transformToCurrency(collection.credit_card)}
                    />
                </View>
            </View>
        )
    }

    renderCreditSelection() {
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Today's credit bill</Text>
                    <View style={{padding: 3, marginLeft: 7, marginRight: 7, flexDirection: 'row'}}>
                        <Text style={{width: '50%', fontSize: 18}}>{'Total credit'}</Text>
                        <Text style={{width: '50%', textAlign: 'right', fontSize: 18, color: '#000'}}>
                            {transformToCurrency(this.state.today_credit_bill_amount)}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderExpenses() {
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Expenses</Text>
                    {
                        this.state.expenses.length
                            ? this.renderList()
                            : <Text style={{textAlign: 'center'}}>No expenses found</Text>
                    }
                </View>
            </View>
        )
    }

    renderTotalCollection() {
        let collection = this.state.dataSource.old_collections;
        let todayCollection = this.state.dataSource.today_collections;
        const chequeCollections = this.state.dataSource.returned_cheque_collections;
        const total = collection.cash + todayCollection.cash + chequeCollections.cash + collection.cheque +
            todayCollection.cheque + chequeCollections.cheque + collection.direct_deposit + todayCollection.direct_deposit +
            chequeCollections.direct_deposit + collection.credit_card + todayCollection.credit_card + chequeCollections.credit_card;
        let totalExpense = calculatePaymentTotal(this.state.expenses);
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>Total Collections</Text>
                    <CollectionView
                        leftVaueOne={'Cash:'}
                        rightVaueOne={transformToCurrency(collection.cash + todayCollection.cash + chequeCollections.cash)}
                        leftVaueTwo={'Cheque:'}
                        rightVaueTwo={transformToCurrency(collection.cheque + todayCollection.cheque + chequeCollections.cheque)}
                    />
                    <CollectionView
                        leftVaueOne={'Direct Deposit:'}
                        rightVaueOne={transformToCurrency(collection.direct_deposit + todayCollection.direct_deposit + chequeCollections.direct_deposit)}
                        leftVaueTwo={'Credit Card:'}
                        rightVaueTwo={transformToCurrency(collection.credit_card + todayCollection.credit_card + chequeCollections.credit_card)}
                    />
                    <Divider style={{backgroundColor: '#b0b0b0', height: 1}}/>
                    <View style={{flexDirection: 'row', padding: 3, marginLeft: 7, marginRight: 7}}>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>Total</Text>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>
                            {transformToCurrency(total)}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 3, marginLeft: 7, marginRight: 7}}>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>Total Expense</Text>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>
                            {transformToCurrency(totalExpense)}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 3, marginLeft: 7, marginRight: 7}}>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>Allowance</Text>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>
                            {transformToCurrency(this.state.allowance)}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 3, marginLeft: 7, marginRight: 7}}>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>Total Refund</Text>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>
                            {transformToCurrency(this.state.return_total)}
                        </Text>
                    </View>
                    <Divider style={{backgroundColor: '#b0b0b0', height: 1}}/>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>Grand Total</Text>
                        <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>
                            {transformToCurrency(total - (totalExpense + this.state.return_total + this.state.allowance))}
                        </Text>
                    </View>
                    <Divider style={{backgroundColor: '#b0b0b0', height: 1}}/>
                    <Divider style={{backgroundColor: '#b0b0b0', height: 1, marginTop: 2}}/>
                </View>
            </View>
        )
    }

    renderFooter() {
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <View style={{padding: 10}}>
                        <TextField
                            label='Odometer end reading'
                            containerStyle={{width: '100%'}}
                            value={this.state.odometer_end_reading.toString()}
                            returnKeyType="done"
                            keyboardType="numeric"
                            onChangeText={value => this.setState({odometer_end_reading: value})}
                            tintColor={'#00897B'}
                            error={this.state.hasError ? validateEndReading(this.state.start_odo_meter_reading, this.state.odometer_end_reading) : null}
                        />
                        <TextField
                            label='Enter handover related notes'
                            value={this.state.notes}
                            returnKeyType="done"
                            keyboardType="default"
                            onChangeText={value => this.setState({notes: value})}
                            tintColor={'#00897B'}
                            autoCapitalize="sentences"
                            multiline={true}
                        />
                    </View>
                </View>
            </View>
        )
    }

    renderList() {
        return (
            <View>
                {
                    this.state.expenses.map((expense, index) => (
                        <View key={index}
                              style={{padding: 3, marginLeft: 7, marginRight: 7}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{width: '50%', fontSize: 18}}>{expense.type}</Text>
                                <Text style={{width: '50%', textAlign: 'right', fontSize: 18, color: '#000'}}>
                                    {transformToCurrency(expense.amount)}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )

    }

    returnReasonData(customer, reason) {
        this.setState({
            not_visit_customer_notes: {
                ...this.state.not_visit_customer_notes,
                [customer]: reason
            }
        })
    }

    handleRightButtonPress() {
        if (!this.state.all_actual_stock_confirmed) return this.dropdown.alertWithType('error',
            'Stock confirmation', 'Please complete actual stock confirmation process before handover!');
        if (!this.state.tomorrow_route) return this.dropdown.alertWithType('error',
            'Next day allocation', 'Please select route for tomorrow or refresh handover page!');
        handleOfflineDataValidation().then(response => {
            if (response) return showMessage(response + ' Please press sync button!!!');
            this.continueHandover();
        })
    }

    async continueHandover() {
        let validateResponse = 0;
        if (this.state.not_visited_customers.length) {
            await getAllNotVisitReasonAndValidate(this.state.not_visited_customers).then(response => {
                validateResponse = response
            })
        }
        if (this.state.numOfReason > 0) {
            return this.setState({hasError: true, isCusReasonError: true});
        }
        // if (!this.state.expenses.length > 0) {
        //     return this.setState({hasError: true});
        // }
        if (validateEmptyInputText(this.state.odometer_end_reading)) {
            this.dropdown.alertWithType('error',
                'Odometer end reading', validateEmptyInputText(this.state.odometer_end_reading));
            return this.setState({hasError: true});
        }
        if (validateEndReading(this.state.start_odo_meter_reading, this.state.odometer_end_reading)) {
            this.dropdown.alertWithType('error',
                'Odometer end reading', validateEndReading(this.state.start_odo_meter_reading, this.state.odometer_end_reading));
            return this.setState({hasError: true});
        }
        // if (validateEmptyInputText(this.state.notes)) {
        //     return this.setState({hasError: true});
        // }
        if (this.state.not_visited_customers.length !== 0) {
            Alert.alert(
                'Are you sure ?',
                'Do you want to submit handover without visiting balance ' + this.state.not_visited_customers.length + ' customers?',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes, I want!', onPress: () => this.submitHandover()},
                ],
                {cancelable: false}
            )
        } else {
            this.submitHandover()
        }
    }

    submitHandover() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            getNotVisitCustomerNotes().then(reason => {
                let data = changeHandoverData(this.state, reason);
                this.props.onSubmitHandover(data).then(value => {
                    this.setState({isLoading: false, isError: false});
                    if (value.id) {
                        Alert.alert(
                            'Success!',
                            'Handover Submitted Successfully!!',
                            [
                                {text: 'OK', onPress: () => this.handleOkButtonPressed(value)},
                            ],
                            {cancelable: false}
                        )
                    }
                }).catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    this.handelException(exception)
                });
            });
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    handelException(exception) {
        if (exception.status === 422 || exception.status === 403) {
            exception.json().then(response => {
                this.onError(response);
            });
        }
    }

    handleOkButtonPressed() {
        this.setState({loading: true});
        this.props.onLogout();
        storage.removeAll().then(() => {
            deleteAll().then(() => {
                this.setState({loading: false});
                this.props.navigation.dispatch(NavigationActions.popToTop());
                let {navigate} = this.props.navigation;
                navigate('Guest');
            }).catch(error => console.log(error, 'error'))
        });
    }

    goBackWithMessage() {
        showMessage('Your connection was interrupted');
        this.props.navigation.goBack()
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    handover: state.handover.handover,
});

const mapDispatchToProps = (dispatch) => ({
    getHandoversData() {
        return dispatch(getHandoverData());
    },
    onSubmitHandover(data) {
        return dispatch(submitHandover(data));
    },
    onLogout: () => {
        return dispatch(logoutProcess());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HandoverTab);