import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Modal} from 'react-native'
import {Content, Container} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import ScreenHeader from '../../../../../components/textHeader'
import ReturnItemView from '../../../../../components/returnItem'
import styles from './style'
import {connect} from "react-redux";
import {updateContactPerson} from "../../../../../actions/customer";
import Spinner from '../../../../../components/spinner/index';
import {Button, Divider, Icon} from 'react-native-elements'
import moment from "moment/moment";
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import {showMessage} from "../../../../../helpers/toast";
import {setNewSalesReturn, storeSalesReturn} from "../../../../../actions/returns";
import {mapOfflineSalesReturnForRealm, mapSalesReturn} from "../../../../../helpers/salesReturn";
import {isEmpty, findIndex, filter, differenceBy, find} from 'lodash'
import {validateReturnAmount} from "../../../../../helpers/customerValidation";
import {addAllReplacedStock} from "../../../../../services/product/stockUpdate";
import {getOrdersFromRealm} from "../../../../../actions/orders";
import {setNewPaymentInDB} from "../../../../../actions/invoice";
import {changeRetunCreditNotePayment} from "../../../../../helpers/payment";
import {get_invoice_by_sales_order_id} from "../../../../../../database/Invoice/controller";

class CreateNewSalesReturn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_id: null,
            date: moment().format('YYYY-MM-DD'),
            items: [],
            resolutions: [],
            return_products: [],
            notes: '',
            total: 0,
            resolution_amount: 0,
            balance_amount: 0,
            isLoading: false,
            isEdit: false,
            hasError: false,
            customerName: null,
            refund_clicked: false,
            credit_clicked: false,
            replace_clicked: false,
            modalVisible: false,
            orders: [],
            creditOrder: null
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            customerName: state.params.customerName,
            customer_id: state.params.customerId,
            isLoading: true
        });
        this.props.getOrdersData().then(orders => {
            this.setState({
                orders: filterOrder(orders, state.params.customerId),
                isLoading: false
            });
        }).catch(e => console.warn(e));
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params.customerId) {
            state.params.refresh();
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name='Add Sales Return'
                              rightButtonValue={this.state.isEdit ? 'Update' : 'Create'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />
                {this.renderHeader()}
                <Content bounces={false} disableKBDismissScroll={true}>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps='always'
                        keyboardDismissMode={"on-drag"}>
                        <View>
                            {this.renderBody()}
                            {this.renderResolution()}
                            {this.renderNotes()}
                        </View>
                    </KeyboardAwareScrollView>
                </Content>
                {this.renderModal()}
            </Container>
        )
    }

    renderHeader() {
        return (
            <View style={{backgroundColor: '#00897B', paddingBottom: 10}}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: '#FFF', fontSize: 20, fontWeight: 'bold'}}>
                        {this.state.customerName ? this.state.customerName : 'Customer Name'}
                    </Text>
                    <Text style={{color: '#FFF'}}>{moment().format('YYYY-MM-DD')}</Text>
                </View>
            </View>
        )
    }

    renderBody() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Items being returned</Text>
                    <Button
                        raised
                        icon={{name: 'add'}}
                        backgroundColor={'#00897B'}
                        color={'#FFF'}
                        onPress={this.handelAddReturnItems.bind(this)}
                        title='Add Items'/>
                    {
                        this.state.items.length ?
                            this.state.items.map((returnItem, index) => {
                                return (
                                    <TouchableOpacity key={index}
                                        // onPress={() => this.handelEditReturnItems(returnItem, index)}
                                                      style={{paddingTop: 10}}>
                                        <ReturnItemView
                                            productName={returnItem.product_name}
                                            firstLeftItemOne={'Qty'}
                                            firstLeftItemTwo={returnItem.qty}
                                            firstRightItemOne={'R.Rate'}
                                            firstRightItemTwo={transformToCurrency(returnItem.returned_rate)}
                                            secondLeftItemOne={'# '}
                                            secondLeftItemTwo={returnItem.ref}
                                            secondRightItemOne={'Amount'}
                                            secondRightItemTwo={transformToCurrency(returnItem.returned_amount)}
                                            removePress={() => this.handelItemRemovePress(index)}
                                        />
                                    </TouchableOpacity>
                                )
                            }) : <Text style={{textAlign: 'center'}}>No sales return items found</Text>
                    }
                    {
                        this.state.items.length ? this.renderTotal() : null
                    }
                </View>
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

    renderResolution() {
        return (
            <View style={styles.viseContainer}>
                <View style={{padding: 20}}>
                    <Text style={styles.headerText}>Returned items resolution </Text>
                    <View style={styles.resolutionView}>
                        {
                            !this.state.refund_clicked ?
                                <Button
                                    title={'Refund'}
                                    buttonStyle={styles.buttonStyle}
                                    onPress={() => this.handelRefundPress()}
                                />
                                : null
                        }
                        {
                            !this.state.credit_clicked ?
                                <Button
                                    title={'Credit'}
                                    buttonStyle={styles.buttonStyle}
                                    onPress={() => this.handelCreditPress()}
                                />
                                : null
                        }
                        {
                            !this.state.replace_clicked ?
                                <Button
                                    title={'Replace'}
                                    buttonStyle={styles.buttonStyle}
                                    onPress={() => this.handelReplacePress()}
                                />
                                : null
                        }
                    </View>
                    {
                        this.state.hasError && this.state.items.length && !this.state.resolutions.length
                            ? <Text style={styles.errorText}>* Please add resolution
                                for return item</Text>
                            : null
                    }
                    {
                        this.state.refund_clicked ? this.renderRefund() : null
                    }
                    {
                        this.state.credit_clicked ? this.renderCredit() : null
                    }
                    {
                        this.state.replace_clicked ? this.renderReplace() : null
                    }
                </View>
            </View>
        )
    }

    renderRefund() {
        const index = findIndex(this.state.resolutions, function (o) {
            return o.type === 'Refund';
        });
        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <TextField
                    label='Refund amount'
                    value={this.state.resolutions[index].amount.toString()}
                    returnKeyType="done"
                    keyboardType="numeric"
                    onChangeText={async value => {
                        let oldResolution = [...this.state.resolutions];
                        oldResolution[index] = {...oldResolution[index], amount: value};
                        await this.setState({resolutions: oldResolution});
                        this.calculateTotal();
                    }}
                    containerStyle={{width: '90%', marginRight: 5}}
                    tintColor={'#00897B'}
                    error={this.state.hasError ?
                        validateReturnAmount(this.state.total, this.state.resolution_amount, this.state.balance_amount)
                        : null}
                />
                <TouchableOpacity onPress={() => this.handelRemoveRefundPress(index)}
                                  style={{width: '10%', marginLeft: 5}}>
                    <Icon
                        name='remove'
                        type='font-awesome'
                        color={'#ca2c2c'}
                        size={30}/>
                </TouchableOpacity>
            </View>
        )
    }

    renderCredit() {
        const index = findIndex(this.state.resolutions, function (o) {
            return o.type === 'Credit';
        });
        const {creditOrder} = this.state;
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TextField
                        label='Credit amount'
                        value={this.state.resolutions[index].amount.toString()}
                        returnKeyType="done"
                        keyboardType="numeric"
                        onChangeText={async value => {
                            let oldResolution = [...this.state.resolutions];
                            oldResolution[index] = {...oldResolution[index], amount: value};
                            await this.setState({resolutions: oldResolution});
                            this.calculateTotal();
                        }}
                        containerStyle={{width: '90%', marginRight: 5}}
                        tintColor={'#00897B'}
                        error={this.state.hasError ?
                            validateReturnAmount(this.state.total, this.state.resolution_amount, this.state.balance_amount)
                            : null}
                    />
                    <TouchableOpacity onPress={() => this.handelRemoveCreditPress(index)}
                                      style={{width: '10%', marginLeft: 5}}>
                        <Icon
                            name='remove'
                            type='font-awesome'
                            color={'#ca2c2c'}
                            size={30}/>
                    </TouchableOpacity>
                </View>
                {creditOrder ?
                    <View style={styles.resView}>
                        <View style={{width: "90%"}}>
                            <View>
                                <Text style={{fontSize: 15, color: '#000'}}>{creditOrder.ref}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>{creditOrder.order_date}</Text>
                                    <Text>{"  -  "}</Text>
                                    <Text>{transformToCurrency(creditOrder.due_amount)}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={async () => {
                            let oldResolution = [...this.state.resolutions];
                            oldResolution[index] = {
                                ...oldResolution[index],
                                order_id: null
                            };
                            await this.setState({
                                creditOrder: null,
                                resolutions: oldResolution
                            });
                        }}
                                          style={styles.removeIcon}>
                            <Icon
                                name='remove'
                                type='font-awesome'
                                color={'#ca2c2c'}
                                size={30}/>
                        </TouchableOpacity>
                    </View>
                    : null}
                <Button
                    raised
                    icon={{name: 'add'}}
                    backgroundColor={'#00897B'}
                    color={'#FFF'}
                    onPress={() => this.setState({modalVisible: true})}
                    containerViewStyle={{marginTop: 10}}
                    title='Add related order'/>
            </View>
        )
    }

    renderModal() {
        const {orders} = this.state;
        const finalOrders = filter(orders, order => order.due_amount > 0);
        const index = findIndex(this.state.resolutions, function (o) {
            return o.type === 'Credit';
        });
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({modalVisible: false})}>
                <Container style={{backgroundColor: '#efeff3'}}>
                    <ScreenHeader name='Select related order'
                                  leftButtonValue='Back'
                                  leftButtonPress={() => this.setState({modalVisible: false})}
                    />
                    <Content bounces={false} disableKBDismissScroll={true}>
                        {finalOrders.length ?
                            finalOrders.map((order, i) =>
                                <TouchableOpacity key={i}
                                                  style={{padding: 10, marginBottom: 2, backgroundColor: "#FFF"}}
                                                  onPress={async () => {
                                                      let oldResolution = [...this.state.resolutions];
                                                      oldResolution[index] = {
                                                          ...oldResolution[index],
                                                          order_id: order.order_id
                                                      };
                                                      this.getInvoiceId(order.order_id);
                                                      await this.setState({
                                                          creditOrder: order,
                                                          modalVisible: false,
                                                          resolutions: oldResolution
                                                      })
                                                  }}>
                                    <View key={i}>
                                        <Text style={{fontSize: 15, color: '#000'}}>{order.ref}</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text>{order.order_date}</Text>
                                            <Text>{"  -  "}</Text>
                                            <Text>{transformToCurrency(order.due_amount)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                            :
                            <Text style={{padding: 10, textAlign: 'center', width: '100%'}}>* Orders not found *</Text>
                        }
                    </Content>
                </Container>
            </Modal>
        )
    }

    renderReplace() {
        const index = findIndex(this.state.resolutions, function (o) {
            return o.type === 'Replace';
        });
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TextField
                        label='Replace amount'
                        value={this.state.resolutions[index].amount.toString()}
                        returnKeyType="done"
                        keyboardType="numeric"
                        onChangeText={async value => {
                            let oldResolution = [...this.state.resolutions];
                            oldResolution[index] = {...oldResolution[index], amount: value};
                            await this.setState({resolutions: oldResolution});
                            this.calculateTotal();
                        }}
                        editable={false}
                        containerStyle={{width: '90%', marginRight: 5}}
                        tintColor={'#00897B'}
                        error={this.state.hasError ?
                            validateReturnAmount(this.state.total, this.state.resolution_amount, this.state.balance_amount)
                            : null}
                    />
                    <TouchableOpacity onPress={() => this.handelRemoveReplacePress(index)}
                                      style={{width: '10%', marginLeft: 5}}>
                        <Icon
                            name='remove'
                            type='font-awesome'
                            color={'#ca2c2c'}
                            size={30}/>
                    </TouchableOpacity>
                </View>
                {
                    this.state.return_products.map((value, key) => {
                        return (
                            <TouchableOpacity key={key}
                                              onPress={() => this.handelItemPress(value, key)}
                                              style={{paddingTop: 10}}>
                                <ReturnItemView
                                    productName={value.product_name}
                                    firstLeftItemOne={value.qty + ' * ' + transformToCurrency(value.rate)}
                                    firstRightItemTwo={transformToCurrency(value.amount)}
                                    disableSecondLine
                                    removePress={() => this.handelItemRemoveButtonPress(value, key)}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
                <Button
                    raised
                    icon={{name: 'add'}}
                    backgroundColor={'#00897B'}
                    color={'#FFF'}
                    onPress={this.handelAddItemView.bind(this)}
                    containerViewStyle={{marginTop: 10}}
                    title='Add replace line'/>
            </View>
        )
    }

    handelRefundPress() {
        if (this.state.balance_amount <= 0) return showMessage('Resolution already fulfilled');
        let previousData = this.state.resolutions;
        previousData.push({
            type: 'Refund',
            amount: this.state.balance_amount
        });
        this.setState({refund_clicked: true});
        this.calculateTotal();
    }

    handelRemoveRefundPress(index) {
        this.setState({refund_clicked: false});
        let oldResolution = this.state.resolutions;
        oldResolution.splice(index, 1);
        this.setState({resolutions: oldResolution});
        this.calculateTotal();
    }

    handelCreditPress() {
        if (this.state.balance_amount <= 0) return showMessage('Resolution already fulfilled');
        let previousData = this.state.resolutions;
        previousData.push({
            type: 'Credit',
            amount: this.state.balance_amount
        });
        this.setState({credit_clicked: true});
        this.calculateTotal();
    }

    handelRemoveCreditPress(index) {
        this.setState({credit_clicked: false});
        let oldResolution = this.state.resolutions;
        oldResolution.splice(index, 1);
        this.setState({resolutions: oldResolution, creditOrder: null});
        this.calculateTotal();
    }

    handelReplacePress() {
        if (this.state.balance_amount <= 0) return showMessage('Resolution already fulfilled');
        let previousData = this.state.resolutions;
        previousData.push({
            type: 'Replace',
            amount: 0
        });
        this.setState({replace_clicked: true});
        this.calculateTotal();
    }

    handelRemoveReplacePress(index) {
        this.setState({replace_clicked: false});
        let oldResolution = this.state.resolutions;
        oldResolution.splice(index, 1);
        this.setState({
            resolutions: oldResolution,
            return_products: []
        });
        this.calculateTotal();
    }

    renderNotes() {
        return (
            <View style={styles.viseContainer}>
                <View style={{padding: 20}}>
                    <TextField
                        label='Enter sales return related notes'
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
        )
    }

    handelAddReturnItems() {
        this.props.navigation.navigate('SalesReturnItems', {
            returnItemData: this.returnItemData.bind(this),
            customerId: this.state.customer_id,
            isEdit: false,
            added_items: this.state.items
        });
    }

    returnItemData(returnItem) {
        let previousReturnItem = this.state.items;
        previousReturnItem.push(returnItem);
        this.setState({items: previousReturnItem});
        this.calculateTotal();
    }

    handelEditReturnItems(returnItem, index) {
        this.props.navigation.navigate('SalesReturnItems', {
            returnItemData: this.returnEditItemData.bind(this, index),
            customerId: this.state.customer_id,
            isEdit: true,
            previousItem: returnItem
        });
    }

    returnEditItemData(index, returnItem) {
        let previousReturnItem = this.state.items;
        previousReturnItem[index] = returnItem;
        this.setState({items: previousReturnItem});
        this.calculateTotal();
    }

    handelItemRemovePress(index) {
        let previousReturnLineItem = this.state.items;
        previousReturnLineItem.splice(index, 1);
        this.setState({items: previousReturnLineItem});
        this.calculateTotal();
    }

    handelHeaderRightButtonPress() {
        const {creditOrder, credit_clicked} = this.state;
        if (!this.state.items.length) return showMessage('Return item not found!');
        if (this.state.total !== this.state.resolution_amount) {
            return this.setState({hasError: true})
        }
        if (credit_clicked && !creditOrder) return showMessage('Select an order to set-off this credit');
        this.setState({isLoading: true});
        if (this.props.isConnected) {
            const mappedData = mapSalesReturn(this.state);
            this.props.onPostSalesReturn(this.state.customer_id, mappedData).then(ReturnData => {
                if (!isEmpty(ReturnData)) {
                    this.setState({isLoading: false});
                    this.storeDataToDb(false, ReturnData.id);
                    if (ReturnData.credit_payment) {
                        const data = changeRetunCreditNotePayment(ReturnData.credit_payment);
                        this.props.storePaymentData(data).then(value => console.log(value))
                    }
                }
            }).catch(exception => {
                this.setState({isLoading: false, hasError: true});
                this.handelSalesReturnException(exception)
            });
        } else {
            const {resolutions, customer_id, invoice_id} = this.state;
            const creditResolution = find(resolutions, o => o.type === 'Credit');
            if (creditResolution.order_id) {
                const data = {
                    invoice_id,
                    sales_order_id: creditResolution.order_id,
                    payment: creditResolution.amount,
                    customer_id: customer_id,
                };
                const storeData = changeRetunCreditNotePayment(data);
                this.props.storePaymentData(storeData).then(value => console.log(value))
            }
            this.storeDataToDb(true);
        }
    }

    getInvoiceId(orderId) {
        get_invoice_by_sales_order_id(orderId).then(invoices =>
            this.setState({invoice_id: invoices[0].id})
        ).catch(e => console.warn(e, 'Invoice get error'))
    }

    storeDataToDb(not_sync, id) {
        const mappedData = mapOfflineSalesReturnForRealm(this.state, not_sync, id);
        this.props.onStoreSalesReturn(mappedData).then(data => {
            if (!isEmpty(data)) {
                this.setState({isLoading: false});
                if (data.return_products.length) {
                    addAllReplacedStock(data.return_products);
                }
                this.props.navigation.goBack();
            }
        }).catch(e => console.warn(e, "storeDataToDb"))
    }


    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelAddItemView() {
        if (this.state.balance_amount <= 0) return showMessage('Resolution already fulfilled');
        this.props.navigation.navigate('ReplaceItems', {
            returnData: this.returnData.bind(this),
            order_items: this.state.return_products ? this.state.return_products : [],
            isEdit: this.state.isEdit,
            allowedAmount: this.state.balance_amount
        });
    }

    handelItemRemoveButtonPress(value, index) {
        let previousLineItem = this.state.return_products;
        previousLineItem.splice(index, 1);
        this.setState({return_products: previousLineItem});
        this.handelReplaceCalculation();
    }

    handelItemPress(value, key,) {
        let {navigate} = this.props.navigation;
        navigate('ReplaceItems', {
            returnData: this.returnEditData.bind(this, key),
            order_items: this.state.return_products ? this.state.return_products : [],
            previousItem: value,
            isEdit: this.state.isEdit,
            allowedAmount: calculateAllowedAmount(value, this.state.resolutions, this.state.total)
        })
    }

    returnData(lineItem) {
        let previousLineItem = this.state.return_products;
        previousLineItem.push(lineItem);
        this.setState({return_products: previousLineItem});
        this.handelReplaceCalculation();
    }

    returnEditData(index, lineItem) {
        let previousLineItem = this.state.return_products;
        previousLineItem[index] = lineItem;
        this.setState({return_products: previousLineItem});
        this.handelReplaceCalculation();
    }

    calculateTotal() {
        if (this.state.items.length) {
            let total = 0;
            let resolution_amount = 0;
            this.state.items.map(returnItem => {
                total = total + parseFloat(returnItem.returned_amount)
            });
            this.state.resolutions.map(resolution => {
                resolution_amount = resolution_amount + parseFloat(resolution.amount)
            });
            this.setState({total, resolution_amount, balance_amount: total - resolution_amount})
        } else {
            this.setState({total: 0, resolution_amount: 0, balance_amount: 0})
        }
    }

    async handelReplaceCalculation() {
        const index = findIndex(this.state.resolutions, function (o) {
            return o.type === 'Replace';
        });
        let oldResolution = [...this.state.resolutions];
        let total = 0;
        this.state.return_products.map(product => {
            total = total + product.amount;
        });

        oldResolution[index] = {...oldResolution[index], amount: total};
        await this.setState({resolutions: oldResolution});
        this.calculateTotal();
    }

    handelSalesReturnException(exception) {
        console.warn(exception);
        if (exception.status === 422) {
            exception.json().then(response => {
                showMessage(response.message)
            });
        }
    }
}

function calculateAllowedAmount(value, resolutions, total) {
    let returnTotal = 0;
    resolutions.map(resolution => {
        returnTotal = returnTotal + parseFloat(resolution.amount)
    });
    return total - (returnTotal - value.amount);
}

function filterOrder(orders, customer_id) {
    return filter(orders, order => order.customer_id === customer_id)
}

function filterSelectedOrders(orders, selected_orders) {
    return differenceBy(orders, selected_orders, 'order_id')
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    onPostSalesReturn(customerID, returnData) {
        return dispatch(setNewSalesReturn(customerID, returnData));
    },
    onStoreSalesReturn(returnData) {
        return dispatch(storeSalesReturn(returnData));
    },
    onUpdateContactPerson(id, customerData) {
        return dispatch(updateContactPerson(id, customerData));
    },
    getOrdersData() {
        return dispatch(getOrdersFromRealm());
    },
    storePaymentData(payment) {
        return dispatch(setNewPaymentInDB(payment));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewSalesReturn);
