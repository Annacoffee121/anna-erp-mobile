import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native'
import {Content, Container} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import ScreenHeader from '../../../../../../components/textHeader'
import {
    validateAmount, validateEmptyInputText, validateId,
    validateStock
} from '../../../../../../helpers/customerValidation';
import styles from './style'
import {connect} from "react-redux";
import {getProductsFromRealm, getUnitTypeFromRealm} from "../../../../../../actions/dropdown";
import {getOneProduct, getPriceBookDataFromRealm} from "../../../../../../actions/settings";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import {filter, first} from "lodash";

class ReplaceLineItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemDetails: {
                product_name: '',
                product_id: null,
                unit_type_name: '',
                unit_type_id: 5,
                qty: 0,
                store_id: 1,
                rate: 0,
                amount: 0,
                notes: '',
            },
            allowedAmount : 0,
            order_items: [],
            availableStock: null,
            hasError: false,
            isEdit: false
        };
    }

    async componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({order_items: state.params.order_items, isEdit: state.params.isEdit, allowedAmount: state.params.allowedAmount});
        if (state.params.previousItem) {
            this.state.itemDetails = state.params.previousItem;
            await this.setDropDownValue();
        }
    }

    async setDropDownValue() {
        // Download dropDown if not available
        if (!this.props.products) {
            await this.props.getProductsData()
        }
        if (!this.props.unitType) {
            await this.props.getUnitTypeData()
        }
        // Set values to dropDown
        let productValue = _.find(this.props.products, {value: this.state.itemDetails.product_id});
        let productUnitValue = _.find(this.props.unitType, {value: this.state.itemDetails.unit_type_id});
        await this.setState({
            itemDetails: {
                ...this.state.itemDetails,
                product_name: productValue ? productValue.name : '',
                unit_type_name: productUnitValue ? productUnitValue.name : '',
            }
        })
    }

    render() {
        return (
            <Container style={{backgroundColor:'#efeff3'}}>
                <ScreenHeader name='Item Information'
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                              rightButtonValue='Save'
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
                <Text style={{fontSize: 20, color: '#00897B'}}>Line Items</Text>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SearchCustomerItems', {
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
                            await this.handelCalculation();
                            await this.checkAvailableStock();
                        }
                    });
                }}>
                    <TextField
                        label='Item'
                        editable={false}
                        value={this.state.itemDetails.product_name}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateId(this.state.itemDetails.product_id) : null}
                    />
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                    <TextField
                        label='Quantity'
                        value={this.state.itemDetails.qty.toString()}
                        returnKeyType="next"
                        onChangeText={async (value) => {
                            await this.setState({itemDetails: {...this.state.itemDetails, qty: value}});
                            await this.handelCalculation();
                            await this.checkAvailableStock();
                        }}
                        tintColor={'#00897B'}
                        keyboardType="numeric"
                        containerStyle={{width: '49%', marginRight: 5}}
                        error={this.state.hasError ? validateStock(this.state.itemDetails.qty, this.state.availableStock) : null}
                    />
                    <TextField
                        disabled
                        label='Rate'
                        value={transformToCurrency(this.state.itemDetails.rate)}
                        containerStyle={{width: '49%', marginLeft: 5}}
                        style={{textAlign: 'right'}}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TextField
                        disabled
                        label='Available stock'
                        value={this.state.availableStock ? this.state.availableStock.toString() : '0'}
                        containerStyle={{width: '49%', marginRight: 5}}
                        tintColor={'#00897B'}
                    />
                    <TextField
                        label='Amount'
                        value={transformToCurrency(this.state.itemDetails.amount)}
                        style={{textAlign: 'right'}}
                        containerStyle={{width: '49%', marginLeft: 5}}
                        tintColor={'#00897B'}
                        editable={false}
                        error={this.state.hasError ? validateAmount(this.state.allowedAmount, this.state.itemDetails.amount) : null}
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

    handelHeaderRightButtonPress() {
        if (validateId(this.state.itemDetails.product_id)) {
            return this.setState({hasError: true});
        }
        if (validateStock(this.state.itemDetails.qty, this.state.availableStock)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.itemDetails.unit_type_id)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.itemDetails.qty)) {
            return this.setState({hasError: true});
        }
        if (validateAmount(this.state.allowedAmount, this.state.itemDetails.amount)) {
            return this.setState({hasError: true});
        }

        //Send the data back to MainComponent
        this.props.navigation.state.params.returnData(this.state.itemDetails);
        this.props.navigation.goBack();
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    // Get price using Product Id
    handelCalculation() {
        if (this.state.itemDetails.product_id && this.state.itemDetails.qty) {
            let rate = 0;
            this.props.getOneProductData(this.state.itemDetails.product_id).done(() => {
                this.props.getPriBookData().done(() => {
                    const {productDetails, realmPriceBook} = this.props;
                    const {product_id, qty} = this.state.itemDetails;
                    let priceBook = null;

                    if (realmPriceBook) {
                        priceBook = first(filter(realmPriceBook.prices, (priceItem) => {
                            return product_id === priceItem.product_id
                                && qty >= priceItem.range_start_from
                                && qty <= priceItem.range_end_to
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
                            amount: rate * this.state.itemDetails.qty
                        }
                    });
                });
            });
        }
    }

    checkAvailableStock() {
        const {state} = this.props.navigation;
        if (this.state.itemDetails.product_id) {
            this.props.getOneProductData(this.state.itemDetails.product_id).done(() => {
                const soldItem = this.props.productDetails.sold_stock ? this.props.productDetails.sold_stock : 0;
                const replacedItem = this.props.productDetails.replaced_qty ? this.props.productDetails.replaced_qty : 0;
                let sold_stock = soldItem + replacedItem;
                let currently_added_stock = 0;
                if (this.state.order_items.length && !this.state.isEdit) {
                    const result = this.state.order_items.filter(item => item.product_id === this.state.itemDetails.product_id);
                    result.map(item => {
                        currently_added_stock = currently_added_stock + parseInt(item.qty)
                    });
                }
                if (state.params.previousItem && this.state.itemDetails.product_id === state.params.previousItem.product_id) {
                    currently_added_stock = currently_added_stock - parseInt(state.params.previousItem.qty)
                }
                this.setState({availableStock: this.props.productDetails.stock_level - (sold_stock + currently_added_stock)})
            });
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    products: state.dropdowns.products,
    unitType: state.dropdowns.unitType,
    productDetails: state.settings.productDetails,
    realmPriceBook: state.settings.realmPriceBook,
});

const mapDispatchToProps = (dispatch) => ({
    getOneProductData(productID) {
        return dispatch(getOneProduct(productID));
    },
    getProductsData() {
        return dispatch(getProductsFromRealm());
    },
    getUnitTypeData() {
        return dispatch(getUnitTypeFromRealm());
    },
    getPriBookData() {
        return dispatch(getPriceBookDataFromRealm());
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(ReplaceLineItems);