import React, {Component} from 'react';
import {connect} from 'react-redux';
import {filter} from 'lodash';
import {RefreshControl, Text, ListView,} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {SearchBar} from 'react-native-elements'
import styles from './styles';
import {getCustomerInvoice} from "../../../../../actions/customer/index";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from '../../../../../components/textHeader'
import OrderView from '../../../../../components/salesOrderView'
import {NavigationActions} from "react-navigation";
import {getReturnProductsFromDb} from "../../../../../actions/customer";

class ProductsShow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            searchText: '',
            searchArray: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            dataSearchSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentWillMount() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            this.loaData();
        }
    }

    loaData(callback) {
        const {state} = this.props.navigation;
        let customerId = state.params.customerId;
        this.props.getReturnProductsData(customerId).done(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.returnProducts),
                searchArray: Object.values(this.props.returnProducts),  //Set new array for searching purpose
                isLoading: false
            });
            result.length > 0 ? result = [] : null;  // Remove Old Value
            changeArrayContent(this.state.searchArray);
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    renderRow(invoice) {
        const {state} = this.props.navigation;
        let customerId = state.params.customerId;
        const orders = filter(invoice.orders, (o) => o.customer_id === customerId);
        const total = getTotal(orders);
        const soldProducts = getSoldProducts(orders);
        const orderLength = 'Sold qty: ' + soldProducts;
        return (
            <ListItem button style={styles.ListItem} onPress={() => this.handleClick(invoice)}>
                <View style={{width: '100%'}}>
                    <OrderView
                        key={invoice.id}
                        customerName={invoice.name}
                        invoiceAmount={total ? total : 0}
                        statusColor={'#949b99'}
                        invoiceStatus={invoice.orders ? orderLength : null}
                        orderNumber={'# ' + invoice.code}
                    />
                </View>
            </ListItem>
        );
    }

    handleClick(invoice) {
        // const {state} = this.props.navigation;
        // let customerId = state.params.customerId;
        // // this.props.navigation.dispatch(NavigationActions.popToTop());
        // this.props.navigation.navigate('ShowCustomerInvoice', {invoiceId: invoice.id, orderId: invoice.sales_order_id, customerId:customerId});
    }

    handleRefresh() {
        this.setState({refreshing: true});
        this.loaData(() => this.setState({refreshing: false}));
    }

    renderContactView() {
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh.bind(this)}
                        tintColor="#ff0000"
                        title="Loading..."
                        colors={['#00897B', '#FF5215', '#00897B']}
                        progressBackgroundColor="#ffffff"
                    />}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(invoice) => this.renderRow(invoice)}
            />
        )
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        const {state} = this.props.navigation;
        const {customerName} = state.params;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={customerName + ' Products'}
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />

                <View>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.container}>
                        <SearchBar
                            lightTheme
                            showLoadingIcon={this.state.isSearch}
                            onChangeText={(text) => this.SearchFilterFunction(text)}
                            containerStyle={{backgroundColor: '#FFFFFF'}}
                            inputStyle={{backgroundColor: '#CCCCCC'}}
                            placeholder='Search'
                            clearIcon={{color: '#86939e', name: 'close'}}/>
                        <View style={{height: '87%'}}>
                            {
                                (this.state.searchText === '') ? this.renderContactView() : this.renderSearchView()
                            }
                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        this.setState({isSearch: true});
        const newData = result.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const itemData2 = item.code.toUpperCase();
            const textData = text.toUpperCase();
            if (itemData.startsWith(textData)) {
                return itemData.startsWith(textData)
            } else if (itemData2.indexOf(textData) > -1) {
                return itemData2.indexOf(textData) > -1
            }
        });
        this.setState({
            dataSearchSource: this.state.dataSearchSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }

    renderSearchView() {
        return (
            <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSearchSource}
                renderRow={(invoice) => this.renderRow(invoice)}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    // customerProducts: state.customer.customerProducts,
    returnProducts: state.customer.returnProducts,
});


const mapDispatchToProps = (dispatch) => ({
    // getCustomerProductsData(customerId) {
    //     return dispatch(getCustomerProducts(customerId));
    // },
    getReturnProductsData(customerId) {
        return dispatch(getReturnProductsFromDb(customerId));
    },
});

let result = [];

function changeArrayContent(ar) {
    for (let i = 0; i < ar.length; i++) {
        if (ar[i] instanceof Array) {
            changeArrayContent(ar[i])
        }
        else if (typeof ar[i] === 'object') {
            result.push(ar[i])
        }
        else {
            result.push(ar[i])
        }
    }
}

function getTotal(orders) {
    let amount = 0;
    orders.map(order => {
        amount = amount + order.rate * order.quantity;
    });
    return amount;
}

function getSoldProducts(orders) {
    let total = 0;
    orders.map(order => {
        total = total + order.quantity;
    });
    return total;
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsShow);