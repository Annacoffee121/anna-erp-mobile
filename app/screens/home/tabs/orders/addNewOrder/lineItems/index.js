import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native'
import {Content, Container} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import ScreenHeader from '../../../../../../components/textHeader'
import {
    validateEmptyInputText, validateId,
    validateProductId, validateStock
} from '../../../../../../helpers/customerValidation';
import styles from './style'
import {connect} from "react-redux";
import {getProductsFromRealm, getUnitTypeFromRealm} from "../../../../../../actions/dropdown";
import {getOneProduct} from "../../../../../../actions/settings";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";

class CreateLineItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemDetails: {
                product_name: '',
                product_id: null,
                unit_type_name: '',
                unit_type_id: 5,
                quantity: 0,
                store_id: 1,
                rate: 0,
                amount: 0,
                notes: '',
            },
            order_items: [],
            availableStock: null,
            hasError: false,
            isEdit: false,
            previousIndex: null
        };
    }

    async componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            order_items: state.params.order_items,
            isEdit: state.params.isEdit,
            previousIndex: state.params.previousIndex
        });
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
                              rightButtonValue='Add'
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
                <View style={{flexDirection: 'row'}}>
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
                                await this.handelCalculation();
                                await this.checkAvailableStock();
                            }
                        });
                    }}
                                      style={{width: '79%', marginRight: 5}}>
                        <TextField
                            label='Item'
                            editable={false}
                            value={this.state.itemDetails.product_name}
                            tintColor={'#00897B'}
                            error={this.state.hasError ?
                                validateProductId(this.state.itemDetails.product_id, this.state.order_items, this.state.previousIndex, this.state.isEdit)
                                : null}
                        />
                    </TouchableOpacity>
                    <TextField
                        editable={false}
                        label='Stock'
                        value={this.state.availableStock ? this.state.availableStock.toString() : '0'}
                        containerStyle={{width: '19%', marginLeft: 5}}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateStock(this.state.itemDetails.quantity, this.state.availableStock) : null}
                    />
                </View>
                {/*<TouchableOpacity onPress={() => {*/}
                {/*this.props.navigation.navigate('SearchItems', {*/}
                {/*getData: this.props.getUnitTypeData,*/}
                {/*data: this.props.unitType,*/}
                {/*returnDropDownData: async (value, id) => {*/}
                {/*this.setState({*/}
                {/*itemDetails: {*/}
                {/*...this.state.itemDetails,*/}
                {/*unit_type_name: value,*/}
                {/*unit_type_id: id*/}
                {/*}*/}
                {/*});*/}
                {/*await this.handelCalculation();*/}
                {/*}*/}
                {/*})*/}
                {/*}}>*/}
                {/*<TextField*/}
                {/*label='Unit type'*/}
                {/*editable={false}*/}
                {/*value={this.state.itemDetails.unit_type_name}*/}
                {/*tintColor={'#00897B'}*/}
                {/*error={this.state.hasError ? validateId(this.state.itemDetails.unit_type_id) : null}*/}
                {/*/>*/}
                {/*</TouchableOpacity>*/}
                <View style={{flexDirection: 'row'}}>
                    <TextField
                        label='Quantity'
                        value={this.state.itemDetails.quantity.toString()}
                        returnKeyType="next"
                        onChangeText={async (value) => {
                            await this.setState({itemDetails: {...this.state.itemDetails, quantity: value}});
                            await this.handelCalculation();
                            await this.checkAvailableStock();
                        }}
                        tintColor={'#00897B'}
                        keyboardType="numeric"
                        containerStyle={{width: '29%', marginRight: 5}}
                        error={this.state.hasError ? validateStock(this.state.itemDetails.quantity, this.state.availableStock) : null}
                    />
                    <TextField
                        disabled
                        label='Rate'
                        value={transformToCurrency(this.state.itemDetails.rate)}
                        containerStyle={{width: '29%', marginLeft: 5, marginRight: 5}}
                        style={{textAlign: 'center'}}
                    />
                    <TextField
                        disabled
                        label='Amount'
                        value={transformToCurrency(this.state.itemDetails.amount)}
                        style={{textAlign: 'right'}}
                        containerStyle={{width: '39%', marginLeft: 5}}
                        tintColor={'#00897B'}
                    />
                </View>
                {/*<View style={{flexDirection: 'row'}}>*/}
                {/*<TextField*/}
                {/*disabled*/}
                {/*label='Amount'*/}
                {/*value={transformToCurrency(this.state.itemDetails.amount)}*/}
                {/*style={{textAlign: 'right'}}*/}
                {/*containerStyle={{width: '100%'}}*/}
                {/*tintColor={'#00897B'}*/}
                {/*/>*/}
                {/*</View>*/}
                {/*<TextField*/}
                {/*label='Item related notes'*/}
                {/*value={this.state.itemDetails.notes ? this.state.itemDetails.notes : ''}*/}
                {/*tintColor={'#00897B'}*/}
                {/*multiline={true}*/}
                {/*onChangeText={value => {*/}
                {/*this.setState({itemDetails: {...this.state.itemDetails, notes: value}});*/}
                {/*}}*/}
                {/*/>*/}
            </View>
        )
    }

    handelHeaderRightButtonPress() {
        if (validateProductId(this.state.itemDetails.product_id, this.state.order_items, this.state.previousIndex, this.state.isEdit)) {
            return this.setState({hasError: true});
        }
        if (validateStock(this.state.itemDetails.quantity, this.state.availableStock)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.itemDetails.unit_type_id)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.itemDetails.quantity)) {
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
        if (this.state.itemDetails.product_id && this.state.itemDetails.unit_type_id && this.state.itemDetails.quantity) {
            let rate = 0;
            this.props.getOneProductData(this.state.itemDetails.product_id).done(() => {
                if (this.state.itemDetails.unit_type_id === 1) {
                    rate = this.props.productDetails.box_price ? this.props.productDetails.box_price : 0;
                } else if (this.state.itemDetails.unit_type_id === 2) {
                    rate = this.props.productDetails.carton_price ? this.props.productDetails.carton_price : 0;
                } else if (this.state.itemDetails.unit_type_id === 3) {
                    rate = this.props.productDetails.dozen_price ? this.props.productDetails.dozen_price : 0;
                } else if (this.state.itemDetails.unit_type_id === 4) {
                    rate = this.props.productDetails.each_price ? this.props.productDetails.each_price : 0;
                } else if (this.state.itemDetails.unit_type_id === 5) {
                    rate = this.props.productDetails.pieces_price ? this.props.productDetails.pieces_price : 0;
                }
                this.setState({
                    itemDetails: {...this.state.itemDetails, rate: rate, amount: rate * this.state.itemDetails.quantity}
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
                        currently_added_stock = currently_added_stock + parseInt(item.quantity)
                    });
                }
                if (state.params.previousItem && this.state.itemDetails.product_id === state.params.previousItem.product_id) {
                    currently_added_stock = currently_added_stock - parseInt(state.params.previousItem.quantity)
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
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateLineItems);