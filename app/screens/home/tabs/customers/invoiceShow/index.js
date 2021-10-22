import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, Text, ListView,} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {SearchBar} from 'react-native-elements'
import styles from './styles';
import {getCustomerInvoice} from "../../../../../actions/customer/index";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from '../../../../../components/textHeader'
import OrderView from '../../../../../components/salesOrderView'
import {NavigationActions} from "react-navigation";

class InvoiceShow extends Component {
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
        this.props.getCustomerInvoiceData(customerId).done(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.customerInvoice),
                searchArray: Object.values(this.props.customerInvoice),  //Set new array for searching purpose
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
        return (
            <ListItem button style={styles.ListItem} onPress={() => this.handleClick(invoice)}>
                <View style={{width: '100%'}}>
                    <OrderView
                        key={invoice.id}
                        customerName={invoice.ref ? invoice.ref : invoice.invoice_no}
                        invoiceAmount={invoice.amount}
                        orderNumber={invoice.invoice_date}
                        invoiceStatus={invoice.status}
                        statusColor={invoice.status === 'Paid' ? '#129c31' : invoice.status === 'Open' ? '#f23734' : '#ffa121'}
                    />
                </View>
            </ListItem>
        );
    }

    handleClick(invoice) {
        const {state} = this.props.navigation;
        let customerId = state.params.customerId;
        // this.props.navigation.dispatch(NavigationActions.popToTop());
        this.props.navigation.navigate('ShowCustomerInvoice', {
            invoiceId: invoice.id,
            orderId: invoice.sales_order_id,
            customerId: customerId
        });
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
                <ScreenHeader name={customerName + ' Invoices'}
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
            const itemData = item.ref.toUpperCase();
            const itemData2 = item.status.toUpperCase();
            const itemData3 = item.invoice_date.toUpperCase();
            const textData = text.toUpperCase();
            if (itemData.indexOf(textData) > -1) {
                return itemData.indexOf(textData) > -1
            } else if (itemData2.indexOf(textData) > -1) {
                return itemData2.indexOf(textData) > -1
            } else if (itemData3.indexOf(textData) > -1) {
                return itemData3.indexOf(textData) > -1
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
    customerInvoice: state.customer.customerInvoice,
});


const mapDispatchToProps = (dispatch) => ({
    getCustomerInvoiceData(customerId) {
        return dispatch(getCustomerInvoice(customerId));
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceShow);