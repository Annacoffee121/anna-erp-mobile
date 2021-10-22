import React, {Component,} from 'react';
import {View, Text, Alert, BackHandler, Platform} from 'react-native';
import {Container, Content} from 'native-base';
import {TextField} from 'react-native-material-textfield';
import {connect} from "react-redux";
import {NavigationActions} from "react-navigation";
import ScreenHeader from '../../../../../components/textHeader';
import styles from './styles';
import {validateAmount, validateEmptyInputText} from "../../../../../helpers/customerValidation";
import {setNewInvoice, updateInvoice, updateOrderStatus} from "../../../../../actions/invoice";
import Spinner from '../../../../../components/spinner/index';
import {showMessage} from '../../../../../helpers/toast'
import {getCustomerByOrderId, updateOrderStatusData} from "../../../../../../database/Order/controller";
import {transformOfflineInvoiceForRealm} from "../../../../../helpers/orders";
import {changeOrderStatus} from "../../../../../helpers/changeStatus";
import {getOrder} from "../../../../../actions/orders";
import {getInvoiceNumber, updateInvoiceNumber} from "../../../../../services/number/invoice";
import {insertInvoiceInRealm, updateInvoiceInRealm} from "../../../../../services/databaseService/invoice";
import {syncNew as syncNewInvoice} from "../../../../../services/sync/invoice";
import moment from "moment/moment";
import {updateDashboardCalloutValue} from "../../../../../actions/dashboard";
import v4 from "uuid";

class NewInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                invoice_date: '',
                uuid: v4(),
                due_date: moment().format('YYYY-MM-DD'),
                amount: '',
                ref: null,
                notes: '',
            },
            salesOrderId: '',
            originalAmount: '',
            hasError: false,
            isLoading: false,
            isEdit: false,
            invoiceId: null,
            updateStatus: false
        };
        // this.onBackClicked = this._onBackClicked.bind(this);
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        if (state.params.invoiceId) {
            this.setState({
                isEdit: true,
                invoiceId: state.params.invoiceId,
                dataSource: state.params.invoiceData,
                salesOrderId: state.params.orderId,
            });
            this.loadRemoteOrders(state.params.orderId);
        } else {
            // if (Platform.OS === 'android') {
            //     BackHandler.addEventListener('hardwareBackPress', this.onBackClicked);
            // }
            getInvoiceNumber().then(value => this.setState({dataSource: {...this.state.dataSource, ref: value}}));          //Set Invoice Number Or ref
            let orderDetail = state.params.orderDetails;
            this.setState({
                salesOrderId: orderDetail.orderId,
                dataSource: {...this.state.dataSource, invoice_date: orderDetail.orderDate, amount: orderDetail.amount},
                updateStatus: orderDetail.updateStatus ? orderDetail.updateStatus : false
            });
            this.loadRemoteOrders(orderDetail.orderId);
        }
    }

    loadRemoteOrders(orderId) {
        this.props.getOrderData(orderId).then(async order => {
            let invoiced_total = 0;
            if (order.invoices.length > 0) {
                await order.invoices.map(invoice => {
                    invoiced_total = invoiced_total + invoice.amount;
                })
            }
            await this.setState({originalAmount: order.total - invoiced_total})
        }).catch(error => console.log(error))
    }

    // componentWillUnmount() {
    //     if (Platform.OS === 'android') {
    //         BackHandler.removeEventListener("hardwareBackPress", this.onBackClicked);
    //     }
    // }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={this.state.isEdit ? 'UPDATE INVOICE' : 'CREATE INVOICE'}
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
        return (
            <View style={styles.customerHeader}>
                <TextField
                    label='Amount'
                    value={this.state.dataSource.amount.toString()}
                    tintColor={'#00897B'}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, amount: value}})}
                    keyboardType="numeric"
                    containerStyle={{width: '90%'}}
                    error={this.state.hasError ? validateAmount(this.state.originalAmount, this.state.dataSource.amount) : null}
                />
                <TextField
                    label='Order Date'
                    editable={false}
                    value={this.state.dataSource.invoice_date}
                    tintColor={'#00897B'}
                    containerStyle={{width: '90%'}}
                />
                {/*<View style={{width: '90%'}}>*/}
                    {/*<DatePicker*/}
                        {/*label={'Due date'}*/}
                        {/*value={this.state.dataSource.due_date}*/}
                        {/*dateChanged={(date) => this.setState({dataSource: {...this.state.dataSource, due_date: date}})}*/}
                        {/*onChange={(value) => this.setState({dataSource: {...this.state.dataSource, due_date: value}})}*/}
                        {/*error={this.state.hasError ? validateEmptyInputText(this.state.dataSource.due_date) : null}*/}
                        {/*editable={false}*/}
                        {/*disableDatePicker={true}*/}
                    {/*/>*/}
                {/*</View>*/}
                <TextField
                    label='Enter invoice related notes'
                    value={this.state.dataSource.notes ? this.state.dataSource.notes : ''}
                    onChangeText={value => this.setState({dataSource: {...this.state.dataSource, notes: value}})}
                    tintColor={'#00897B'}
                    autoCapitalize="sentences"
                    multiline={true}
                    containerStyle={{width: '90%'}}
                />
            </View>
        )
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        this.setState({isLoading: true});
        if (this.state.isEdit) {
            if (this.props.isConnected && !this.props.order.not_sync) {
                this.props.onUpdateInvoice(this.state.invoiceId, this.state.dataSource)
                    .then(value => {
                        if (value.id) {
                            updateInvoiceInRealm(value, value.id).then().catch((error) => {
                                console.log(error, 'error')
                            });
                            changeOrderStatus(this.state.salesOrderId);                                         //Change status
                            this.setState({isLoading: false, isError: false});
                            Alert.alert(
                                'Done !',
                                'Invoice Updated Successfully!!!',
                                [
                                    {text: 'OK', onPress: () => this.props.navigation.goBack()},
                                ],
                                {cancelable: false}
                            )
                        }
                    })
                    .catch(exception => {
                        this.setState({isLoading: false, isError: true});
                        console.warn(exception, 'Invoice Update exception')
                    });
            } else {
                alert('Cant edit offline')
            }
        } else {
            if (validateAmount(this.state.originalAmount, this.state.dataSource.amount)) {
                return this.setState({hasError: true, isLoading: false});
            }
            if (validateEmptyInputText(this.state.dataSource.due_date)) {
                return this.setState({hasError: true, isLoading: false});
            }
            if (this.props.isConnected) {
                if (this.state.updateStatus) {
                    this.props.onUpdateStatus(this.state.salesOrderId, {status: 'Open'})
                        .then(value => {
                            updateOrderStatusData(this.state.salesOrderId, 'Open').catch(error => console.log(error, 'Update Order Status'));
                            showMessage('Order status Updated!')
                        })
                        .catch(exception => {
                            console.warn(exception, 'Order Status Updated Exception')
                        });
                }
                syncNewInvoice(this.state.dataSource, this.state.salesOrderId).then(value => {
                    updateInvoiceNumber(this.state.dataSource.ref);
                    changeOrderStatus(this.state.salesOrderId);                                             //Change Status
                    // Change dashboard marker details
                    getCustomerByOrderId(this.state.salesOrderId).then(customerId =>{
                        updateDashboardCalloutValue(customerId).catch(error=>console.warn(error));
                    });
                    this.setState({isLoading: false, isError: false});
                    Alert.alert(
                        'Done !',
                        'Invoice Created Successfully!!!',
                        [
                            {text: 'OK', onPress: () => this.handleOkButtonPressed(value)},
                        ],
                        {cancelable: false}
                    )
                }).catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.warn(exception, 'Invoice Create exception')
                });
            } else {
                this.handelOfflineSubmission();
            }
        }
    }

    handelOfflineSubmission() {
        let newData = transformOfflineInvoiceForRealm(this.state.dataSource, this.props.order);
        insertInvoiceInRealm(newData).then(value => {
            if (this.state.updateStatus) {
                updateOrderStatusData(this.state.salesOrderId, 'Open').catch(error => console.log(error, 'Update Order Status'));
                showMessage('Order status Updated!')
            }
            changeOrderStatus(this.state.salesOrderId);
            updateInvoiceNumber(this.state.dataSource.ref);
            // Change dashboard marker details
            getCustomerByOrderId(this.state.salesOrderId).then(customerId =>{
                updateDashboardCalloutValue(customerId).catch(error=>console.warn(error));
            });
            this.setState({loading: false});
            Alert.alert(
                'Done !',
                'Invoice added to Queue!!!',
                [
                    {text: 'OK', onPress: () => this.handleOkButtonPressed(value)},
                ],
                {cancelable: false}
            )
        }).catch((error) => {
            console.log(error, 'error')
        });
    }

    handleOkButtonPressed(value) {
        // if (Platform.OS === 'android') {
        //     BackHandler.removeEventListener("hardwareBackPress", this.onBackClicked);
        // }
        this.props.navigation.dispatch(NavigationActions.popToTop());
        this.props.navigation.navigate('ShowInvoice', {invoiceId: value.id, orderId: this.state.salesOrderId});
    }

    // _onBackClicked = () => {
    //     return true
    // };
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    order: state.order.order,
});

const mapDispatchToProps = (dispatch) => ({
    onSaveInvoice(invoiceData, salesOrderId) {
        return dispatch(setNewInvoice(invoiceData, salesOrderId));
    },
    onUpdateInvoice(invoiceId, data) {
        return dispatch(updateInvoice(invoiceId, data));
    },
    onUpdateStatus(orderId, data) {
        return dispatch(updateOrderStatus(orderId, data));
    },
    getOrderData(orderId) {
        return dispatch(getOrder(orderId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewInvoice);
