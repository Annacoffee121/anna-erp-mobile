import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native'
import {NavigationActions} from 'react-navigation';
import {Content, Container} from 'native-base'
import v4 from 'uuid'
import {Button, Divider} from 'react-native-elements'
import {TextField} from 'react-native-material-textfield';
import {first, filter} from 'lodash';
import ImagePicker from '../../../../../components/document-picker'
import AddPaymentComp from '../../../../../components/add-payment'
import ScreenHeader from '../../../../../components/textHeader'
import styles from './styles'
import {
    getBalanceTotal,
    getTotalPaid,
    newValidateProductId,
    validateCreditLimit,
    validateEmptyInputText,
    validateFullNumberInput,
    validateId,
    validateLineItems,
    validatePayment,
    validateStock
} from "../../../../../helpers/customerValidation";
import {connect} from "react-redux";
import {getBusinessTypeFromRealm, getCustomersFromRealm, getProductsFromRealm} from "../../../../../actions/dropdown";
import {setNewOrder, orderToQueue, updateOrder, getOrder} from "../../../../../actions/orders";
import Spinner from '../../../../../components/spinner/index';
import {transformOrderItems} from '../../../../../helpers/itemTransfomer'
import {transformOrderToEdit} from '../../../../../helpers/orders'
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import {showMessage} from "../../../../../helpers/toast";
import {getOrderNumber} from "../../../../../services/number/order";
import {updateOrderInRealm} from "../../../../../services/databaseService/order";
import {updateAllSoldStock} from "../../../../../services/product/stockUpdate";
import moment from "moment/moment";
import GeoLocationService from "../../../../../services/system/google-location";
import {updateDashboardCalloutValue} from "../../../../../actions/dashboard";
import {getInvoiceNumber, updateInvoiceNumber} from "../../../../../services/number/invoice";
import {syncNew as syncNewInvoice} from "../../../../../services/sync/invoice";
import {changeOrderStatus} from "../../../../../helpers/changeStatus";
import {updateInvoiceInRealm} from "../../../../../services/databaseService/invoice";
import {get_invoice_by_sales_order_id} from "../../../../../../database/Invoice/controller";
import {updateInvoice} from "../../../../../actions/invoice";
import {syncOrder} from "../../../../../services/orderWithPaymet/onlineOrder";
import {storeOrder} from "../../../../../services/orderWithPaymet/offlineOrder";
import ReturnItemView from "../../../../../components/returnItem";
import {getOneProduct, getPriceBookDataFromRealm} from "../../../../../actions/settings";
import {get_allocation, get_credit_limit} from "../../../../../../database/Mata/model";
import {deleteAll, getSingleCustomerData} from "../../../../../../database/Customer/controller";
import DropdownAlert from 'react-native-dropdownalert';
import {storage} from "../../../../../config/storage";
import {logoutProcess} from "../../../../../actions/auth";
import {validateAllocationDate} from "../../../../../helpers/allocationDateCheck";

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: {
                business_type_id: 1,
                uuid: v4(),
                order_type: 'Direct',
                customer_id: null,
                ref: null,
                sales_type: 'Distribution',
                order_date: moment().format('YYYY-MM-DD'),
                delivery_date: moment().format('YYYY-MM-DD'),
                order_items: [],
                notes: '',
                terms: '',
                save_as: '',
                gps_lat: null,
                gps_long: null,
                created_at: null,
            },
            itemDetails: {
                product_name: '',
                product_id: null,
                unit_type_name: '',
                unit_type_id: 5,
                quantity: '',
                store_id: 1,
                rate: 0,
                amount: 0,
                notes: '',
                availableStock: 0
            },
            pickerData: '',
            businessType: '',
            customer: '',
            total: 0,
            hasError: false,
            itemError: false,
            isLoading: false,
            isLocation: false,
            orderId: null,
            isEdit: false,
            isConvert: false,
            orderStatus: null,
            payment: [],
            invoice_ref: null,
        };
    }

    componentWillMount() {
        this.validateAllocation()
    }

    validateAllocation() {
        get_allocation().then(allocation => {
            if (validateAllocationDate(allocation.to_date)) {
                this.exitFromApp();
            } else {
                this.mountData();
            }
        })
    }

    async mountData() {
        const {state} = this.props.navigation;
        if (state.params) {
            if (state.params.orderId) {
                await this.setState({
                    isEdit: state.params.isEdit,
                    isConvert: state.params.isConvert,
                    orderId: state.params.orderId,
                    orderStatus: state.params.orderStatus
                });
                await this.loadRemoteOrders();
            } else if (state.params.customerId) {
                await this.setState({order: {...this.state.order, customer_id: state.params.customerId}});
                await this.setCustomerDropDownValue();
            }
        }
    }

    exitFromApp() {
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

    onError = error => {
        if (error) {
            this.dropdown.alertWithType('error', 'Credit level', error);
        } else {
            this.dropdown.alertWithType('error', 'Order Creation', 'Sorry, We have found an issue in creating order! \n' +
                'Please try again!');
        }
    };

    loadRemoteOrders(callback) {
        const {state} = this.props.navigation;
        this.props.getOrderData(state.params.orderId).done(() => {
            this.state.order = transformOrderToEdit(this.props.order);
            this.setDropDownValue();
            this.setState({isLoading: false});
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params) {
            if (state.params.orderId) {
                state.params.refresh();
            }
        }
    }

    async setDropDownValue() {
        await this.setCustomerDropDownValue();
    }

    async setCustomerDropDownValue() {
        if (!this.props.customer) {
            await this.props.getCustomerData()
        }
        let customerValue = _.find(this.props.customer, {value: this.state.order.customer_id});
        await this.setState({
            customer: customerValue ? customerValue.name : '',
        })
    }

    returnData(lineItem) {
        let previousLineItem = this.state.order.order_items;
        previousLineItem.push(lineItem);
        this.setState({order: {...this.state.order, order_items: previousLineItem}});
        this.handelCalculation();
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name={this.state.isEdit ? 'Update Order' : 'Add Order'}
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                              rightButtonValue={this.state.isEdit ? 'Update' : 'Save'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.container}>
                        {this.renderBusinessTypeDetails()}
                        {this.renderAddItem()}
                        {
                            !this.state.isEdit ? this.renderPaymentDetails() : null
                        }
                        {this.renderFooterDetails()}
                    </View>
                </Content>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        )
    }

    renderBusinessTypeDetails() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <Text style={{fontSize: 20, color: '#00897B'}}>Order Details</Text>
                    <TextField
                        label='Order date'
                        editable={false}
                        value={moment().format('YYYY MMM DD')}
                        tintColor={'#00897B'}
                    />
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('SearchItems', {
                            getData: this.props.getCustomerData,
                            data: this.props.customer,
                            returnDropDownData: (value, id) => {
                                this.setState({customer: value, order: {...this.state.order, customer_id: id}})
                            }
                        })
                    }}>
                        <TextField
                            label='Customer'
                            editable={false}
                            value={this.state.customer}
                            tintColor={'#00897B'}
                            error={this.state.hasError ? validateId(this.state.order.customer_id) : null}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderAddItem() {
        return (
            <View style={styles.itemContainer}>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 20, color: '#00897B'}}>Item Details</Text>
                    <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10, backgroundColor: '#dfe7e5'}}>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('SearchItems', {
                                    getData: this.props.getProductsData,
                                    data: this.props.products,
                                    returnDropDownData: async (value, id) => {
                                        this.setState({
                                            itemDetails: {
                                                ...this.state.itemDetails,
                                                product_name: value,
                                                product_id: id
                                            }
                                        });
                                        await this.handelPriceCalculation();
                                        await this.checkAvailableStock();
                                    }
                                });
                            }}
                                              style={{width: '59%', marginRight: 5}}>
                                <TextField
                                    label='Item'
                                    editable={false}
                                    value={this.state.itemDetails.product_name}
                                    tintColor={'#00897B'}
                                    error={this.state.itemError ?
                                        newValidateProductId(this.state.itemDetails.product_id, this.state.order.order_items)
                                        : null}
                                />
                            </TouchableOpacity>
                            <TextField
                                label='Quantity'
                                value={this.state.itemDetails.quantity.toString()}
                                returnKeyType="next"
                                onChangeText={async (value) => {
                                    await this.setState({itemDetails: {...this.state.itemDetails, quantity: value}});
                                    await this.handelPriceCalculation();
                                    await this.checkAvailableStock();
                                }}
                                tintColor={'#00897B'}
                                keyboardType="number-pad"
                                containerStyle={{width: '18%', marginLeft: 5, marginRight: 5}}
                                error={this.state.itemError ?
                                    validateFullNumberInput(this.state.itemDetails.quantity, this.state.itemDetails.availableStock)
                                    : null}
                            />
                            <TextField
                                editable={false}
                                label='Av.Stock'
                                value={this.state.itemDetails.availableStock ?
                                    this.state.itemDetails.availableStock.toString() : '0'}
                                containerStyle={{width: '18%', marginLeft: 5}}
                                style={{textAlign: 'center'}}
                                tintColor={'#00897B'}
                            />
                        </View>
                        <Button
                            raised
                            icon={{name: 'add'}}
                            backgroundColor={'#00897B'}
                            color={'#FFF'}
                            onPress={this.handelAddItemView.bind(this)}
                            title='Add to line'/>
                    </View>
                    {this.renderItemDetails()}
                </View>
            </View>
        )
    }

    renderItemDetails() {
        return (
            <View>
                {
                    this.state.hasError && this.state.order.order_items.length < 1
                        ? <Text style={{color: '#d50000', textAlign: 'center', fontSize: 17}}> ~ Please add item to
                            continue ~ </Text>
                        : null
                }
                {
                    this.state.order.order_items.map((value, index) => {
                        return (

                            <View key={index}
                                  style={{paddingTop: 10}}>
                                <ReturnItemView
                                    count={index + 1}
                                    productName={value.product_name}
                                    firstLeftItemOne={value.quantity + ' * ' + transformToCurrency(value.rate)}
                                    firstRightItemTwo={transformToCurrency(value.amount)}
                                    disableSecondLine
                                    removePress={() => this.handelItemRemoveButtonPress(value, index)}
                                />
                            </View>
                        )
                    })
                }
                {
                    this.state.order.order_items.length ? this.renderTotal() : null
                }
            </View>
        )
    }

    renderTotal() {
        return (
            <View style={{marginTop: 10}}>
                <Divider style={{backgroundColor: '#949b99', width: '100%', height: 2}}/>
                <View style={{flexDirection: 'row', padding: 10}}>
                    <Text style={{width: '60%', fontSize: 22, textAlign: 'right'}}>Total :</Text>
                    <Text style={{width: '40%', fontSize: 22, textAlign: 'right'}}>
                        {transformToCurrency(this.state.total)}
                    </Text>
                </View>
                <Divider style={{backgroundColor: '#949b99', width: '100%', height: 2}}/>
                <Divider style={{backgroundColor: '#949b99', width: '100%', height: 2, marginTop: 4}}/>
            </View>
        )
    }

    renderPaymentDetails() {
        const {isLocation} = this.state;
        return (
            <View style={styles.itemContainer}>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Payment Details</Text>
                    {isLocation ? <Text style={styles.location}>Please wait, getting location ...</Text> : null}
                    <AddPaymentComp onChange={(value) => this.handelOnChangePayment(value)}
                                    onLocation={(v) => this.setState({isLocation: v})}
                                    defaultPayment={this.state.total}
                                    totalPaid={getTotalPaid(this.state.payment)}
                                    balancePayment={getBalanceTotal(this.state.total, this.state.payment)}
                                    hasError={this.state.hasError}
                                    onNavigate={this.props.navigation.navigate}/>
                </View>
            </View>
        )
    }

    handelOnChangePayment(value) {
        this.setState({payment: value})
    }

    renderFooterDetails() {
        return (
            <View style={styles.itemContainer}>
                <View style={{padding: 20}}>
                    <TextField
                        label='Terms & Conditions'
                        multiline={true}
                        value={this.state.order.terms}
                        onChangeText={value => {
                            this.setState({order: {...this.state.order, terms: value}});
                        }}
                        tintColor={'#00897B'}
                    />
                    <TextField
                        label='Notes'
                        multiline={true}
                        value={this.state.order.notes}
                        onChangeText={value => {
                            this.setState({order: {...this.state.order, notes: value}});
                        }}
                        tintColor={'#00897B'}
                    />
                    <ImagePicker
                        onChange={this.handelLogoChange.bind(this)}
                    />
                </View>
            </View>
        )
    }

    handelLogoChange(value) {
        console.log(value, 'Logo');
    }

    handelCalculation() {
        let subTotal = 0;
        if (this.state.order.order_items.length > 0) {
            this.state.order.order_items.map(item => {
                subTotal = subTotal + item.amount;
            });
        }
        this.setState({total: subTotal})
    }

    handelHeaderRightButtonPress() {
        if (validateLineItems(this.state.order.order_items)) {
            return this.setState({hasError: true});
        }
        if (validatePayment(this.state.payment, this.state.total)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.order.business_type_id)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.order.customer_id)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.order.order_date)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.order.delivery_date)) {
            return this.setState({hasError: true});
        }
        if (this.state.order.order_items.length < 1) {
            return this.setState({hasError: true});
        }
        this.creditLevelValidation()
    }

    creditLevelValidation() {
        get_credit_limit().then(mata => {
            getSingleCustomerData(this.state.order.customer_id).then(customer => {
                if (validateCreditLimit(mata, customer, this.state.payment, this.state.total)) {
                    this.onError(validateCreditLimit(mata, customer, this.state.payment, this.state.total));
                    return this.setState({hasError: true});
                }
                this.getGeoLocation()
            });
        })
    }

    getGeoLocation() {
        this.setState({isLoading: true});
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            console.warn('errors', errors);
        });
    }

    async addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            await this.setState({
                order: {
                    ...this.state.order, gps_lat: position.coords.latitude, gps_long: position.coords.longitude,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'), isLoading: false
                }
            });
            this.startOrderProgress();
        }
    }

    startOrderProgress() {
        if (this.state.isEdit && this.state.orderStatus !== 'Draft') {
            this.updateConfirmation();
        } else if (this.state.isEdit && this.state.orderStatus === 'Draft') {
            this.updateOnlyDraftOrder();
        } else if (this.state.isConvert) {
            this.updateDraftOrderAndCreateInvoice();
        } else {
            getOrderNumber().then(async value => {
                await this.setState({order: {...this.state.order, ref: value, isLoading: false}});
                Alert.alert(
                    'Are you sure?',
                    'If yes, click on submit to complete order!',
                    [
                        {text: 'Cancel', onPress: () => this.setState({isLoading: false}), style: 'cancel'},
                        {text: 'Submit', onPress: () => this.submitPress()},
                    ],
                    {cancelable: false}
                )
            });
        }
    }

    async submitPress() {
        await getInvoiceNumber().then(async invoice_ref => {
            await this.setState({isLoading: true, invoice_ref, order: {...this.state.order, save_as: 'Save'}});
            await this.saveOrderWithPayment();
        });
    }

    saveOrderWithPayment() {
        if (this.props.isConnected) {
            syncOrder(this.state.order, this.state.payment, this.state.invoice_ref).then(response => {
                this.handleSaveOrderSuccess(response.id);
            }).catch(error => {
                this.setState({isLoading: false});
                console.warn(error)
            })
        } else {
            storeOrder(this.state.order, this.state.payment, this.state.invoice_ref, this.state.customer).then(response => {
                this.handleSaveOrderSuccess(response.id);
            }).catch(error => {
                this.setState({isLoading: false});
                console.warn(error)
            })
        }
    }

    handleSaveOrderSuccess(orderId) {
        if (!orderId) {
            this.setState({isLoading: false});
            return this.onError();
        }
        Alert.alert(
            'Done!',
            'Order created successfully',
            [
                {text: 'Ok', onPress: () => this.moveToInvoiceView(orderId)},
            ],
            {cancelable: false}
        );
    }

    moveToInvoiceView(orderId) {
        get_invoice_by_sales_order_id(orderId).then(invoice => {
            this.props.navigation.dispatch(NavigationActions.popToTop());
            this.props.navigation.navigate('ShowInvoice', {invoiceId: invoice[0].id, orderId: orderId});
            this.setState({isLoading: false});
        })
    }

    updateDraftOrderAndCreateInvoice() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            let newData = transformOrderItems(this.state.order);
            newData.status = 'Open';
            this.props.onUpdateOrder(this.state.orderId, newData).then(order => {
                if (order.id) {
                    order.gps_lat = parseFloat(order.gps_lat);
                    order.gps_long = parseFloat(order.gps_long);
                    updateOrderInRealm(order, order.id).catch(exception => console.log(exception));
                    this.createInvoiceForDraftOrder(order)
                }
            }).catch(exception => {
                this.setState({isLoading: false, hasError: true});
                console.warn(exception, 'order Update exception')
            });
        } else {
            showMessage('You can\'t edit order in offline')
        }
    }

    createInvoiceForDraftOrder(order) {
        getInvoiceNumber().then(inv_ref => {
            const invoiceData = {
                invoice_date: order.order_date,
                due_date: order.order_date,
                amount: order.total,
                ref: inv_ref,
                notes: 'Auto generated for draft order'
            };
            if (this.props.isConnected) {
                syncNewInvoice(invoiceData, order.id).then(invoice => {
                    updateInvoiceNumber(inv_ref);
                    updateDashboardCalloutValue(this.state.order.customer_id).catch(error => console.warn(error));
                    this.setState({isLoading: false, isError: false});
                    Alert.alert(
                        'Done!',
                        'Order converted successfully',
                        [
                            {text: 'OK', onPress: () => this.handleInvoiceOkButtonPressed(invoice, order.id)},
                        ],
                        {cancelable: false}
                    )
                }).catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.warn(exception, 'Invoice Create exception')
                });
            }
        });
    }

    updateOnlyDraftOrder() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            let newData = transformOrderItems(this.state.order);
            this.props.onUpdateOrder(this.state.orderId, newData).then(order => {
                if (order.id) {
                    order.gps_lat = parseFloat(order.gps_lat);
                    order.gps_long = parseFloat(order.gps_long);
                    updateOrderInRealm(order, order.id).catch(exception => console.log(exception));
                    this.setState({isLoading: false, hasError: false});
                    Alert.alert(
                        'Done!',
                        'Draft order updated successfully',
                        [
                            {text: 'OK', onPress: () => this.props.navigation.goBack()},
                        ],
                        {cancelable: false}
                    )
                }
            }).catch(exception => {
                this.setState({isLoading: false, hasError: true});
                console.warn(exception, 'order Update exception')
            });
        } else {
            showMessage('You can\'t edit order in offline')
        }
    }

    updateConfirmation() {
        Alert.alert(
            'Are you sure?',
            'Do you want to update this order?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes, Update!', onPress: () => this.updateOrder()},
            ],
            {cancelable: false}
        )
    }

    updateOrder() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            const old_order = transformOrderToEdit(this.props.order);
            let newData = transformOrderItems(this.state.order);
            this.props.onUpdateOrder(this.state.orderId, newData).then(order => {
                if (order.id) {
                    order.gps_lat = parseFloat(order.gps_lat);
                    order.gps_long = parseFloat(order.gps_long);
                    updateOrderInRealm(order, order.id).catch(exception => console.log(exception));
                    get_invoice_by_sales_order_id(order.id).then(invoice => {
                        this.updateInvoice(invoice[0], order);
                    });
                    updateAllSoldStock(old_order.order_items, order.order_items); // (Stock need to be update)
                }
            }).catch(exception => {
                this.setState({isLoading: false, hasError: true});
                console.warn(exception, 'order Update exception')
            });
        } else {
            showMessage('You can\'t update order in offline')
        }
    }

    updateInvoice(invoice, order) {
        const invoiceData = {
            invoice_date: invoice.invoice_date,
            due_date: invoice.due_date,
            amount: order.total,
            ref: invoice.ref,
            notes: 'Auto generated'
        };
        this.props.onUpdateInvoice(invoice.id, invoiceData).then(value => {
            if (value.id) {
                updateInvoiceInRealm(value, value.id).then(() => {
                    updateDashboardCalloutValue(this.state.order.customer_id).catch(error => console.warn(error));
                }).catch((error) => console.warn(error, 'error'));
                changeOrderStatus(order.id);                                         //Change status
                this.setState({isLoading: false, isError: false});
                Alert.alert(
                    'Done!',
                    'Order & Invoice updated successfully!!!',
                    [
                        {text: 'OK', onPress: () => this.props.navigation.goBack()},
                    ],
                    {cancelable: false}
                )
            }
        }).catch(exception => {
            this.setState({isLoading: false, isError: true});
            console.warn(exception, 'Invoice Update exception')
        });
    }

    handleInvoiceOkButtonPressed(value, orderId) {
        this.props.navigation.dispatch(NavigationActions.popToTop());
        this.props.navigation.navigate('ShowInvoice', {invoiceId: value.id, orderId: orderId});
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    async handelAddItemView() {
        if (newValidateProductId(this.state.itemDetails.product_id, this.state.order.order_items)) {
            return this.setState({itemError: true});
        }
        if (validateStock(this.state.itemDetails.quantity, this.state.itemDetails.availableStock)) {
            return this.setState({itemError: true});
        }
        if (validateId(this.state.itemDetails.unit_type_id)) {
            return this.setState({itemError: true});
        }
        if (validateFullNumberInput(this.state.itemDetails.quantity, this.state.itemDetails.availableStock)) {
            return this.setState({itemError: true});
        }

        const itemDetails = {
            product_name: '', product_id: null, unit_type_name: '', unit_type_id: 5,
            quantity: '', store_id: 1, rate: 0, amount: 0, notes: '', availableStock: 0
        };
        let order_items = this.state.order.order_items;
        order_items.push(this.state.itemDetails);
        await this.setState({order: {...this.state.order, order_items}, itemDetails, itemError: false});
        this.handelCalculation();
    }

    handelItemRemoveButtonPress(value, index) {
        let previousLineItem = this.state.order.order_items;
        previousLineItem.splice(index, 1);
        this.setState({order: {...this.state.order, order_items: previousLineItem}});
        this.handelCalculation();
    }

    // Get price using Product Id
    handelPriceCalculation() {
        if (this.state.itemDetails.product_id && this.state.itemDetails.quantity) {
            let rate = 0;
            this.props.getOneProductData(this.state.itemDetails.product_id).done(() => {
                this.props.getPriBookData().done(() => {
                    const {productDetails, realmPriceBook} = this.props;
                    const {product_id, quantity} = this.state.itemDetails;
                    let priceBook = null;

                    if (realmPriceBook) {
                        priceBook = first(filter(realmPriceBook.prices, (priceItem) => {
                            return product_id === priceItem.product_id
                                && quantity >= priceItem.range_start_from
                                && quantity <= priceItem.range_end_to
                        }));
                    }

                    if (priceBook) {
                        rate = priceBook.price;
                    } else {
                        rate = productDetails.distribution_price;
                    }
                    this.setState({
                        itemDetails: {
                            ...this.state.itemDetails,
                            rate: rate,
                            amount: rate * this.state.itemDetails.quantity
                        }
                    });
                });
            });
        }
    }

    checkAvailableStock() {
        if (this.state.itemDetails.product_id) {
            this.props.getOneProductData(this.state.itemDetails.product_id).done(() => {
                let soldItem = this.props.productDetails.sold_stock ? this.props.productDetails.sold_stock : 0;
                if (this.state.isEdit) {
                    let order = transformOrderToEdit(this.props.order);
                    const result = order.order_items.filter(item => item.product_id === this.state.itemDetails.product_id);
                    let previousQty = result.length ? parseInt(result[0].quantity) : 0;
                    soldItem = soldItem - previousQty;
                }
                const replacedItem = this.props.productDetails.replaced_qty ? this.props.productDetails.replaced_qty : 0;
                let sold_stock = soldItem + replacedItem;
                this.setState({
                    itemDetails: {
                        ...this.state.itemDetails,
                        availableStock: this.props.productDetails.stock_level - sold_stock
                    }
                })
            });
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    businessType: state.dropdowns.businessType,
    customer: state.dropdowns.customer,
    order: state.order.order,
    products: state.dropdowns.products,
    productDetails: state.settings.productDetails,
    realmPriceBook: state.settings.realmPriceBook,
});

const mapDispatchToProps = (dispatch) => ({
    getBusinessTypeData() {
        return dispatch(getBusinessTypeFromRealm());
    },
    getCustomerData() {
        return dispatch(getCustomersFromRealm());
    },
    onSaveSalesOrder(salesOrderData) {
        return dispatch(setNewOrder(salesOrderData));
    },
    getOrderData(orderId) {
        return dispatch(getOrder(orderId));
    },
    saveOfflineOrderSubmission(payload) {
        return dispatch(orderToQueue(payload))
    },
    onUpdateOrder(orderId, data) {
        return dispatch(updateOrder(orderId, data));
    },
    onUpdateInvoice(invoiceId, data) {
        return dispatch(updateInvoice(invoiceId, data));
    },
    getOneProductData(productID) {
        return dispatch(getOneProduct(productID));
    },
    getPriBookData() {
        return dispatch(getPriceBookDataFromRealm());
    },
    getProductsData() {
        return dispatch(getProductsFromRealm());
    },
    onLogout: () => {
        return dispatch(logoutProcess());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOrder);
