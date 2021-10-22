import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native'
import {Content, Container} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import ScreenHeader from '../../../../../../components/textHeader'
import {
    validateEmptyInputText,
    validateId,
} from '../../../../../../helpers/customerValidation';
import {
    validateReturnProductQty,
    validateReturnProduct
} from '../../../../../../helpers/salesReturnValidation';
import styles from './style'
import {connect} from "react-redux";
import {getReturnProductsFromDb, getReturnRateByOrderId} from "../../../../../../actions/customer";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import {Avatar} from "react-native-elements";
import {getSalesReturnFromRealm} from "../../../../../../actions/returns";
import {filter} from "lodash";

class CreateReturnLineItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemDetails: {
                product_name: '',
                type: 'Stock',
                product_id: null,
                qty: 0,
                sold_rate: 0,
                returned_rate: 0,
                returned_amount: 0, //Total
                reason: '',
                order_id: null,
                ref: '',
                notes: ''
            },
            productOrders: [],
            already_added_items: [],
            stored_returns: [],
            customer_id: null,
            hasError: false,
            isEdit: false
        };
    }

    async componentWillMount() {
        const {state} = this.props.navigation;
        this.props.getSalesReturnData(state.params.customerId).done(stored_returns => {
            this.setState({
                isEdit: state.params.isEdit,
                customer_id: state.params.customerId,
                already_added_items: state.params.added_items,
                stored_returns,
            });
            if (state.params.previousItem) {
                this.state.itemDetails = state.params.previousItem;
                // await this.setDropDownValue(state.params.customerId);
            }
        });
    }

    async setDropDownValue(customerId) {
        // Download dropDown if not available
        if (!this.props.returnProducts) {
            await this.props.getReturnProductsData(customerId)
        }
        // Set values to dropDown
        let productValue = _.find(this.props.returnProducts, {id: this.state.itemDetails.product_id});
        await this.setState({
            itemDetails: {
                ...this.state.itemDetails,
                product_name: productValue ? productValue.name : '',
            }
        })
    }

    render() {
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name='Return item Information'
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                              rightButtonValue={this.state.isEdit ? 'Update' : 'Save'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content bounces={false} disableKBDismissScroll={true}>
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps='always'
                        keyboardDismissMode={"on-drag"}>
                        <View style={styles.subContainer}>
                            {this.renderCustomerDetails()}
                        </View>
                    </KeyboardAwareScrollView>
                </Content>
            </Container>
        )
    }

    renderCustomerDetails() {
        return (
            <View style={{padding: 20}}>
                <Text style={{fontSize: 20, color: '#00897B'}}>Return line items</Text>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SearchCustomerItems', {
                        route_id: this.state.customer_id,
                        getData: this.props.getReturnProductsData,
                        data: this.props.returnProducts,
                        returnDropDownData: async (value, id) => {
                            this.setState({
                                itemDetails: {
                                    ...this.state.itemDetails,
                                    product_name: value,
                                    product_id: id
                                }
                            });
                            await this.setDefault();
                            await this.setRelatedOrder();
                            await this.handelCalculation();
                        }
                    });
                }}>
                    <TextField
                        label='Return item'
                        editable={false}
                        value={this.state.itemDetails.product_name}
                        tintColor={'#00897B'}
                        error={this.state.hasError ?
                            validateReturnProduct(this.state.itemDetails.product_id, this.state.already_added_items, this.state.itemDetails.order_id)
                            : null}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('ReturnOrderSearch', {
                        data: this.state.productOrders,
                        returnDropDownData: async (value, id) => {
                            this.setState({
                                itemDetails: {
                                    ...this.state.itemDetails,
                                    ref: value,
                                    order_id: id
                                }
                            });
                            await this.handelCalculation();
                        }
                    });
                }}>
                    <TextField
                        label='Related order'
                        editable={false}
                        value={this.state.itemDetails.ref}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateId(this.state.itemDetails.order_id) : null}
                    />
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                    <TextField
                        label='Qty'
                        value={this.state.itemDetails.qty.toString()}
                        returnKeyType="next"
                        onSubmitEditing={() => this.returnRateInput.focus()}
                        onChangeText={async (value) => {
                            await this.setState({itemDetails: {...this.state.itemDetails, qty: value}});
                            await this.handelCalculation();
                        }}
                        tintColor={'#00897B'}
                        keyboardType="numeric"
                        containerStyle={{width: '49%', marginRight: 5}}
                        error={this.state.hasError ?
                            validateReturnProductQty(this.state.itemDetails.qty, this.state.itemDetails.product_id, this.state.itemDetails.order_id, this.state.productOrders, this.state.stored_returns)
                            : null}
                    />
                    <TextField
                        disabled
                        label='Sold rate'
                        value={transformToCurrency(this.state.itemDetails.sold_rate)}
                        containerStyle={{width: '49%', marginLeft: 5}}
                        style={{textAlign: 'right'}}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        width: '49%',
                        marginRight: 5
                    }}>
                        <TextField
                            label='Reason'
                            editable={false}
                            value={this.state.itemDetails.reason}
                            tintColor={'#00897B'}
                            containerStyle={{width: '80%'}}
                            returnKeyType="next"
                            onChangeText={async (value) => {
                                await this.setState({itemDetails: {...this.state.itemDetails, reason: value}});
                            }}
                            error={this.state.hasError ? validateEmptyInputText(this.state.itemDetails.reason) : null}
                        />
                        <Avatar
                            medium
                            rounded
                            icon={{
                                name: 'ios-arrow-dropdown-circle',
                                type: 'ionicon',
                                color: '#00897B',
                                size: 28
                            }}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelReturnReason()}
                            activeOpacity={0.7}
                        />
                    </View>
                    <TextField
                        disabled
                        label='Amount'
                        value={transformToCurrency(this.state.itemDetails.returned_amount)}
                        tintColor={'#00897B'}
                        containerStyle={{width: '49%', marginLeft: 5}}
                        style={{textAlign: 'right'}}
                    />
                </View>
                <TextField
                    label='Item related notes'
                    value={this.state.itemDetails.notes ? this.state.itemDetails.notes : ''}
                    tintColor={'#00897B'}
                    multiline={true}
                    onChangeText={value => {
                        this.setState({itemDetails: {...this.state.itemDetails, notes: value}});
                    }}
                />
            </View>
        )
    }

    handelReturnReason() {
        this.props.navigation.navigate('SalesReturnReason', {returnReasonData: this.salesReturnReasonData.bind(this)});
    }

    salesReturnReasonData(reason) {
        this.setState({itemDetails: {...this.state.itemDetails, reason: reason}});
    }

    handelHeaderRightButtonPress() {
        if (validateReturnProduct(this.state.itemDetails.product_id, this.state.already_added_items, this.state.itemDetails.order_id)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.itemDetails.order_id)) {
            return this.setState({hasError: true});
        }
        if (validateReturnProductQty(this.state.itemDetails.qty, this.state.itemDetails.product_id, this.state.itemDetails.order_id, this.state.productOrders, this.state.stored_returns)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.itemDetails.returned_rate)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.itemDetails.reason)) {
            return this.setState({hasError: true});
        }

        //Send the data back to MainComponent
        this.props.navigation.state.params.returnItemData(this.state.itemDetails);
        this.props.navigation.goBack();
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    setDefault() {
        this.setState({
            itemDetails: {
                ...this.state.itemDetails,
                qty: 0,
                sold_rate: 0,
                returned_rate: 0,
                returned_amount: 0,
                reason: '',
                order_id: null,
                ref: '',
            }
        })

    }

    setRelatedOrder() {
        const {state} = this.props.navigation;
        let customerId = state.params.customerId;
        if (this.state.itemDetails.product_id) {
            let found = this.props.returnProducts.find(element => {
                return element.id === this.state.itemDetails.product_id;
            });
            const orders = filter(found.orders, (o) => o.customer_id === customerId);
            this.setState({productOrders: orders.length ? orders : []});
        }
    }

    // Get price using order Id
    handelCalculation() {
        const {product_id, qty, order_id} = this.state.itemDetails;
        if (product_id && qty && order_id) {
            this.props.getProductRate(product_id, order_id).done(order => {
                this.setState({
                    itemDetails: {
                        ...this.state.itemDetails,
                        returned_rate: order.rate,
                        sold_rate: order.rate,
                        returned_amount: order.rate * qty
                    }
                });
            });
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    returnProducts: state.customer.returnProducts,
});

const mapDispatchToProps = (dispatch) => ({
    getReturnProductsData(customerId) {
        return dispatch(getReturnProductsFromDb(customerId));
    },
    getProductRate(product_id, order_id) {
        return dispatch(getReturnRateByOrderId(product_id, order_id));
    },
    getSalesReturnData(customerId) {
        return dispatch(getSalesReturnFromRealm(customerId));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateReturnLineItems);
