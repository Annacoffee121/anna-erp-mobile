import React, {Component} from 'react';
import {get, find, isEmpty} from 'lodash';
import {View, TouchableOpacity, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements'
import PropTypes from './prop-types';
import {connect} from "react-redux";
import {validateId, validateStock, validateStockForComponent} from "../../helpers/customerValidation";
import {TextField} from "react-native-material-textfield";
import {getProductsFromRealm} from "../../actions/dropdown";
import {transformToCurrency} from "../../helpers/currencyFormatConverter";
import {getOneProduct} from "../../actions/settings";
import {transformOrderToEdit} from "../../helpers/orders";
import {getOrder} from "../../actions/orders";

class AddOrderItemCompo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            availableStock: null,
            isEdit: false,
            previousIndex: null
        };
    };

    componentDidMount() {
        if (this.props.onEdit) {
            this.loadRemoteOrders();
        }
        this.onSuccess()
    }

    onSuccess() {
        if (this.props.onChange) {
            this.props.onChange(this.state.dataSource);
        }
    }

    loadRemoteOrders(callback) {
        this.props.getOrderData(this.props.onEdit).done(() => {
            let order = transformOrderToEdit(this.props.order);
            this.setState({dataSource: order.order_items});
            this.setState({isLoading: false});
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    render() {
        return (
            <View>
                {
                    this.state.dataSource.length ?
                        this.state.dataSource.map((payment, index) => (
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
                {
                    this.state.dataSource.length ?
                        <View style={{backgroundColor: '#dfe7e5', flexDirection: 'row', padding: 10}}>
                            <Text style={{width: '60%', fontSize: 20, textAlign: 'right'}}>Total :</Text>
                            <Text style={{width: '40%', fontSize: 20, textAlign: 'right'}}>
                                {transformToCurrency(this.props.total)}
                            </Text>
                        </View> :
                        null
                }

                <View style={{padding: 10}}>
                    <Button
                        raised
                        icon={{name: 'add'}}
                        backgroundColor={'#00897B'}
                        color={'#FFF'}
                        onPress={this.handelAddLineItem.bind(this)}
                        title={'Add new line'}/>
                </View>
            </View>
        );
    }

    renderBody(item, index) {
        return (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {
                        this.props.onNavigate('SearchItems', {
                            getData: this.props.getProductsData,
                            data: this.props.products,
                            returnDropDownData: async (value, id) => {
                                let dataSource = [...this.state.dataSource];
                                dataSource[index].product_id = id;
                                dataSource[index].product_name = value;
                                await this.setState({dataSource});
                                await this.handelCalculation(index);
                                await this.checkAvailableStock(index);
                                this.onSuccess();
                            }
                        });
                    }}
                                      style={{width: '79%', marginRight: 5}}>
                        <TextField
                            label='Item'
                            editable={false}
                            value={this.state.dataSource[index].product_name}
                            tintColor={'#00897B'}
                            error={this.props.hasError ? validateId(item.product_id) : null}
                        />
                    </TouchableOpacity>
                    <TextField
                        editable={false}
                        label='Stock'
                        value={this.state.dataSource[index].stock ? this.state.dataSource[index].stock.toString() : '0'}
                        containerStyle={{width: '19%', marginLeft: 5}}
                        tintColor={'#00897B'}
                    />
                </View>
                {
                    this.state.dataSource[index].is_disabled
                        ? <Text style={{color: '#d50000', textAlign: 'center', fontSize: 17, marginBottom: 5}}>
                            {'~ ' + item.is_disabled + ' is already added ~'}
                        </Text>
                        : this.renderSecondLine(item, index)
                }
            </View>
        )
    }

    renderSecondLine(item, index) {
        return (
            <View style={{flexDirection: 'row'}}>
                <TextField
                    label='Quantity'
                    value={this.state.dataSource[index].quantity.toString()}
                    returnKeyType="next"
                    onChangeText={async (value) => {
                        let dataSource = [...this.state.dataSource];
                        dataSource[index].quantity = value;
                        await this.setState({dataSource});
                        await this.handelCalculation(index);
                        await this.checkAvailableStock(index);
                        this.onSuccess();
                    }}
                    tintColor={'#00897B'}
                    keyboardType="numeric"
                    containerStyle={{width: '28%', marginRight: 5}}
                    error={this.props.hasError ? validateStock(this.state.dataSource[index].quantity, this.state.dataSource[index].stock)
                        : validateStockForComponent(this.state.dataSource[index].quantity, this.state.dataSource[index].stock)}
                />
                <TextField
                    disabled
                    label='Rate'
                    value={transformToCurrency(this.state.dataSource[index].rate)}
                    containerStyle={{width: '28%', marginLeft: 5, marginRight: 5}}
                    style={{textAlign: 'center'}}
                />
                <TextField
                    disabled
                    label='Amount'
                    value={transformToCurrency(this.state.dataSource[index].amount)}
                    style={{textAlign: 'right'}}
                    containerStyle={{width: '38%', marginLeft: 5}}
                    tintColor={'#00897B'}
                />
            </View>
        )
    }

    async handelAddLineItem() {
        const freshData = {
            product_name: '', product_id: null, unit_type_name: '', unit_type_id: 5, quantity: 0,
            store_id: 1, rate: 0, amount: 0, notes: '', is_disabled: null, stock: null,
        };
        let newData = this.state.dataSource;
        newData.push(freshData);
        await this.setState({dataSource: newData});
        this.onSuccess();
    }

    async handelRemovePaymentPressed(index) {
        let stateValues = this.state.dataSource;
        stateValues.splice(index, 1);
        await this.setState({dataSource: stateValues});
        this.onSuccess()
    }

    handelCalculation(index) {
        if (this.state.dataSource[index].product_id && this.state.dataSource[index].unit_type_id && this.state.dataSource[index].quantity) {
            let unit_type_id = this.state.dataSource[index].unit_type_id;
            let rate = 0;
            this.props.getOneProductData(this.state.dataSource[index].product_id).done(() => {
                if (unit_type_id === 1) {
                    rate = this.props.productDetails.box_price ? this.props.productDetails.box_price : 0;
                } else if (unit_type_id === 2) {
                    rate = this.props.productDetails.carton_price ? this.props.productDetails.carton_price : 0;
                } else if (unit_type_id === 3) {
                    rate = this.props.productDetails.dozen_price ? this.props.productDetails.dozen_price : 0;
                } else if (unit_type_id === 4) {
                    rate = this.props.productDetails.each_price ? this.props.productDetails.each_price : 0;
                } else if (unit_type_id === 5) {
                    rate = this.props.productDetails.pieces_price ? this.props.productDetails.pieces_price : 0;
                }
                let dataSource = [...this.state.dataSource];
                dataSource[index].rate = rate;
                dataSource[index].amount = rate * this.state.dataSource[index].quantity;
                this.setState({dataSource});
            });
        }
    }

    checkAvailableStock(index) {
        if (this.state.dataSource[index].product_id) {
            this.props.getOneProductData(this.state.dataSource[index].product_id).done(async () => {
                let soldItem = this.props.productDetails.sold_stock ? this.props.productDetails.sold_stock : 0;
                if (this.props.onEdit) {
                    let order = transformOrderToEdit(this.props.order);
                    const result = order.order_items.filter(item => item.product_id === this.state.dataSource[index].product_id);
                    let previousQty = result.length ? parseInt(result[0].quantity) : 0;
                    soldItem = soldItem - previousQty;
                }
                const replacedItem = this.props.productDetails.replaced_qty ? this.props.productDetails.replaced_qty : 0;
                let sold_stock = soldItem + replacedItem;
                const result = this.state.dataSource.filter(item => item.product_id === this.state.dataSource[index].product_id);
                if (result.length > 1) {
                    let dataSource = [...this.state.dataSource];
                    dataSource[index].product_id = null;
                    dataSource[index].product_name = '';
                    dataSource[index].is_disabled = result[0].product_name;
                    await this.setState({dataSource});
                    this.onSuccess()
                } else {
                    let dataSource = [...this.state.dataSource];
                    dataSource[index].is_disabled = null;
                    dataSource[index].stock = this.props.productDetails.stock_level - sold_stock;
                    await this.setState({dataSource});
                    this.onSuccess()
                }
            });
        }
    }
}

AddOrderItemCompo.propTypes = PropTypes;

const mapStateToProps = (state) => ({
    products: state.dropdowns.products,
    productDetails: state.settings.productDetails,
    order: state.order.order
});
const mapDispatchToProps = (dispatch) => ({
    getProductsData() {
        return dispatch(getProductsFromRealm());
    },
    getOneProductData(productID) {
        return dispatch(getOneProduct(productID));
    },
    getOrderData(orderId) {
        return dispatch(getOrder(orderId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddOrderItemCompo);