import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-native';
import {Container, View, Content} from 'native-base';
import {Divider} from 'react-native-elements'
import {isEmpty} from 'lodash'
import styles from './styles';
import {getCustomerFromRealm} from "../../../../../../actions/customer/index";
import Spinner from '../../../../../../components/spinner/index';
import ScreenHeader from '../../../../../../components/textHeader';
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import {getSalesReturnDataFromRealm} from "../../../../../../actions/returns";
import ReturnItemView from "../../../../../../components/returnItem";


class SalesReturnShow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,
            dataSource: null,
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteCustomers();
    }

    loadRemoteCustomers(callback) {
        const {state} = this.props.navigation;
        let salesReturnId = state.params.salesReturnId;
        this.props.getSalesReturnData(salesReturnId).done(returnData => {
            this.props.getCustomersData(returnData.customer_id); // To show customer name
            this.setState({
                dataSource: returnData,
                isLoading: false,
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
        const {state} = this.props.navigation;
        this.props.navigation.navigate('PrintSalesReturn', {salesReturnId: state.params.salesReturnId});
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={'Sales Return'}
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                              rightButtonValue='Print'
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                {this.renderButtonHeader()}
                <Content>
                    <View style={styles.content}>
                        <Spinner visible={this.state.isLoading}
                                 textContent={configurations.loginScreenLoaderText}
                                 textStyle={{color: '#00897B'}}
                                 color={'#00897B'}/>
                        {this.renderBody()}
                        {this.renderResolutionBody()}
                    </View>
                </Content>
            </Container>
        );
    }

    renderButtonHeader() {
        return (
            <View style={{backgroundColor: '#00897B', paddingBottom: 10}}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: '#FFF', fontSize: 20}}>
                        {this.props.customers ? this.props.customers.display_name : 'Not found'}
                    </Text>
                    <Text style={{color: '#FFF'}}>
                        LKR {this.state.dataSource ? transformToCurrency(this.state.dataSource.total) : '0.00'}
                    </Text>
                </View>
            </View>
        )
    }

    renderBody() {
        return (
            <View style={styles.customerHeader}>
                <View>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Returned items</Text>
                    {
                        this.state.dataSource ? this.state.dataSource.items.map((value, key) => {
                            return (
                                <View key={key}>
                                    <ReturnItemView
                                        key={key}
                                        productName={value.product_name}
                                        firstLeftItemOne={value.qty + ' * ' + transformToCurrency(value.returned_rate)}
                                        firstRightItemTwo={transformToCurrency(value.returned_amount)}
                                        backgroundColor={'#FFF'}
                                        disableRemoveButton
                                        disableSecondLine
                                    />
                                    <Divider style={{backgroundColor: '#dedede', marginTop: 5}}/>
                                </View>
                            )
                        }) : null
                    }
                    <View style={{marginTop: 10}}>
                        <View style={{flexDirection: 'row', padding: 5}}>
                            <Text style={{width: '60%', fontSize: 22, textAlign: 'right'}}>Total :</Text>
                            <Text style={{width: '40%', fontSize: 22, textAlign: 'right'}}>
                                {this.state.dataSource ? transformToCurrency(this.state.dataSource.total) : '0.00'}
                            </Text>
                        </View>
                        <Divider style={{backgroundColor: '#dedede'}}/>
                        <Divider style={{backgroundColor: '#dedede', marginTop: 4}}/>

                    </View>
                </View>
            </View>
        )
    }

    renderResolutionBody() {
        return (
            <View style={styles.buttonView}>
                <View>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Resolution details</Text>
                    {
                        this.state.dataSource ? this.state.dataSource.resolutions.map((value, key) => {
                            return (
                                <View key={key}>
                                    <ReturnItemView
                                        key={key}
                                        firstLeftItemOne={value.type}
                                        firstRightItemTwo={transformToCurrency(value.amount)}
                                        backgroundColor={'#FFF'}
                                        disableRemoveButton
                                        disableSecondLine
                                    />
                                    <Divider style={{backgroundColor: '#dedede', marginTop: 5}}/>
                                </View>
                            )
                        }) : null
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    customers: state.customer.item,
});


const mapDispatchToProps = (dispatch) => ({
    getCustomersData(customerId) {
        return dispatch(getCustomerFromRealm(customerId));
    },
    getSalesReturnData(id) {
        return dispatch(getSalesReturnDataFromRealm(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SalesReturnShow);