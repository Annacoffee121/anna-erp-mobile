import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Alert, Text, TouchableOpacity} from 'react-native';
import {Container, View, Content} from 'native-base';
import {Avatar, Divider} from 'react-native-elements'

import styles from './styles';
import {getOrder} from "../../../../../actions/orders/index";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from '../../../../../components/textHeader';
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import {transformOrderToEdit} from "../../../../../helpers/itemTransfomer";
import {NavigationActions} from "react-navigation";
import moment from "moment/moment";
import {showMessage} from "../../../../../helpers/toast";
import {getDeuAmount} from "../../../../../helpers/invoices";

class OrderShow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            dataSource: null,
            orderId: null,
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({orderId: state.params.orderId, isLoading: true});
        this.loadRemoteOrders();
    }

    loadRemoteOrders(callback) {
        const {state} = this.props.navigation;
        this.props.getOrderData(state.params.orderId).done(() => {
            this.setState({
                dataSource: this.props.order,
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        this.props.navigation.navigate('PrintOrder', {orderId: this.state.orderId});
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader
                    name={this.state.dataSource ? this.state.dataSource.ref ? this.state.dataSource.ref : '* not_found' : 'Loading...'}
                    leftButtonValue='Back'
                    leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    // rightButtonValue='Print'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                {this.renderButtonHeader()}
                <Content>
                    <View style={styles.content}>
                        <Spinner visible={this.state.isLoading}
                                 textContent={configurations.loginScreenLoaderText}
                                 textStyle={{color: '#00897B'}}
                                 color={'#00897B'}/>
                        {this.renderCustomerHeader()}
                        {this.renderItemBody()}
                        {this.renderInvoiceBody()}
                        {this.renderFooter()}
                    </View>
                </Content>
            </Container>
        );
    }

    renderCustomerHeader() {
        return (
            <View style={styles.customerHeader}>
                <View style={styles.mainView}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.rotatedText}>
                            {this.state.dataSource ? this.state.dataSource.status : 'Loading'}</Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <View>
                            {/*<Text style={styles.normalText}>Order</Text>*/}
                            <Text style={styles.normalText}>Order Date</Text>
                            <Text style={styles.normalText}>Amount</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        {/*<Text*/}
                            {/*style={styles.valueText}>{this.state.dataSource ? this.state.dataSource.ref : ''}</Text>*/}
                        <Text style={styles.valueText}>
                            {this.state.dataSource ? this.state.dataSource.order_date : ''}
                        </Text>
                        <Text style={styles.valueText}>
                            {this.state.dataSource ? transformToCurrency(this.state.dataSource.total) : ''}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderItemBody() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B'}}>Line items</Text>
                {
                    this.state.dataSource ? this.state.dataSource.order_items.map((value, key) => {
                        return (
                            <View key={key}>
                                <View style={styles.itemMainView}>
                                    <View>
                                        <Text style={styles.normalText}>{value.product_name}</Text>
                                        <Text>{value.quantity} * {transformToCurrency(value.rate)}</Text>
                                    </View>
                                    <Text style={styles.bigBlackText}>{transformToCurrency(value.amount)}</Text>
                                </View>
                                <Divider style={{backgroundColor: '#dedede', marginTop: 6}}/>
                            </View>
                        )
                    }) : null
                }

            </View>
        )
    }

    renderInvoiceBody() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B'}}>Invoice</Text>
                {
                    this.state.dataSource ? this.state.dataSource.invoices.map((value, key) => {
                        return (
                            <TouchableOpacity key={key} onPress={() => this.handleInvoicePressed(value)}>
                                <View style={styles.itemMainView}>
                                    <View>
                                        <Text style={styles.normalText}>{value.ref}</Text>
                                        <Text>{value.invoice_date}</Text>
                                    </View>
                                    <Text style={styles.bigBlackText}>{transformToCurrency(value.amount)}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }) : null
                }
            </View>
        )
    }

    renderFooter() {
        let deu_amount = 0;
        let payment = 0;
        if (this.state.dataSource) {
            payment = getDeuAmount(this.state.dataSource.payments);
            deu_amount = this.state.dataSource.total - getDeuAmount(this.state.dataSource.payments);
        }
        return (
            <View style={styles.buttonView}>
                <View style={styles.itemMainView}>
                    <Text style={styles.normalTextWithFlex}>Payments made:</Text>
                    <Text style={styles.valueTextWithFlex}>{transformToCurrency(payment)}</Text>
                </View>
                <View style={styles.itemMainView}>
                    <Text style={styles.normalTextWithFlex}>Balance due:</Text>
                    <Text style={styles.valueTextWithFlex}>{transformToCurrency(deu_amount)}</Text>
                </View>
            </View>
        )
    }

    renderButtonHeader() {
        let deu_amount = 0;
        if (this.state.dataSource) {
            deu_amount = this.state.dataSource.total - getDeuAmount(this.state.dataSource.payments);
        }
        return (
            <View style={{backgroundColor: '#00897B', paddingBottom: 10}}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: '#FFF', fontSize: 20}}>
                        Due: {transformToCurrency(deu_amount)}
                    </Text>
                    <Text
                        style={{color: '#FFF'}}>{this.state.dataSource ? this.state.dataSource.customer_name : null}</Text>
                </View>
                {
                    this.state.dataSource
                        ? this.renderDraftView()
                        : null
                }

            </View>
        )
    }

    renderDraftView() {
        return (
            <View style={styles.draftButtonView}>
                <View style={{alignItems: 'center'}}>
                    <Avatar
                        medium
                        rounded
                        icon={{name: 'edit', color: '#00897B', size: 30}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => this.handelEditOrderPressed()}
                        activeOpacity={0.7}
                        // containerStyle={{marginLeft: 20}}
                    />
                    <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Edit order</Text>
                </View>
                {
                    this.state.dataSource.status === 'Draft' ?
                        <View style={{alignItems: 'center'}}>
                            <Avatar
                                medium
                                rounded
                                icon={{name: 'md-repeat', color: '#00897B', type: 'ionicon', size: 30}}
                                overlayContainerStyle={{backgroundColor: 'white'}}
                                onPress={() => this.handelConvertOrderPressed()}
                                activeOpacity={0.7}
                            />
                            <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Convert to Invoice</Text>
                        </View> : null
                }
                <View style={{alignItems: 'center'}}>
                    <Avatar
                        medium
                        rounded
                        icon={{name: 'ios-print', color: '#00897B', type: 'ionicon', size: 30}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => this.handelHeaderRightButtonPress()}
                        activeOpacity={0.7}
                        // containerStyle={{marginLeft: 20}}
                    />
                    <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Print order</Text>
                </View>
            </View>
        )
    }

    handleInvoicePressed(invoice) {
        this.props.navigation.navigate('ShowInvoice', {invoiceId: invoice.id, orderId: invoice.sales_order_id});
    }

    handelEditOrderPressed() {
        if (!moment(this.state.dataSource.order_date).isSame(moment().format('YYYY-MM-DD'))) return showMessage('You can\'t edit previous order');
        if (this.state.dataSource.payments.length) return showMessage('You can\'t edit order with payment');
        if (this.state.dataSource.is_order_printed === 'Yes') return showMessage('You can\'t edit order after print generated');
        let newData = transformOrderToEdit(this.state.dataSource);
        this.props.navigation.navigate('AddNewOrder', {
            orderId: this.state.orderId,
            isEdit: true,
            isConvert: false,
            orderData: newData,
            orderStatus: this.state.dataSource.status,
            refresh: this.loadRemoteOrders.bind(this)
        });
    }

    handelConvertOrderPressed() {
        Alert.alert(
            'Are you sure?',
            'Do you sure want to covert this Order open? You can\'t revert this action again!',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes, Convert', onPress: () => this.ediOrderAndCreateInvoice()},
            ],
            {cancelable: false}
        )
    }

    ediOrderAndCreateInvoice() {
        let newData = transformOrderToEdit(this.state.dataSource);
        this.props.navigation.navigate('AddNewOrder', {
            orderId: this.state.orderId,
            isEdit: false,
            isConvert: true,
            orderData: newData,
            orderStatus: this.state.dataSource.status,
            refresh: this.loadRemoteOrders.bind(this)
        });
    }

    createInvoice() {
        let totalAmount = 0;
        if (this.state.dataSource.invoice_status === 'Partially Invoiced') {
            this.state.dataSource.invoices.map(value => {
                totalAmount = totalAmount + value.amount;
            })
        }

        this.props.navigation.dispatch(NavigationActions.popToTop());
        this.props.navigation.navigate('AddInvoice',
            {
                orderDetails: {
                    orderId: this.state.orderId,
                    amount: this.state.dataSource.total - totalAmount,
                    orderDate: this.state.dataSource.order_date,
                    updateStatus: true
                }
            });
    }

    createInvoiceDirect() {
        let totalAmount = 0;
        if (this.state.dataSource.invoice_status === 'Partially Invoiced') {
            this.state.dataSource.invoices.map(value => {
                totalAmount = totalAmount + value.amount;
            })
        }

        this.props.navigation.dispatch(NavigationActions.popToTop());
        this.props.navigation.navigate('AddInvoice',
            {
                orderDetails: {
                    orderId: this.state.orderId,
                    amount: this.state.dataSource.total - totalAmount,
                    orderDate: this.state.dataSource.order_date,
                }
            });
    }
}

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    order: state.order.order,
});


const mapDispatchToProps = (dispatch) => ({
    getOrderData(orderId) {
        return dispatch(getOrder(orderId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderShow);
