import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Content} from 'native-base';
import {Button, ListItem} from 'react-native-elements'
import Spinner from '../../../../../../components/spinner/index';
import ScreenHeader from '../../../../../../components/textHeader';
import styles from './styles';
import {connect} from "react-redux";
import {getCustomerFromRealm} from "../../../../../../actions/customer";
import {getSalesReturnDataFromRealm} from "../../../../../../actions/returns";
import NetPrint from "../../../../NetPrint";

class SalesReturnPrinterPage extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: null,
            printers: '',
            currentPrinter: '',
            isLoading: false,
            disablePrint: false,
        }
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteCustomers();
    }

    loadRemoteCustomers(callback) {
        const {state} = this.props.navigation;
        let salesReturnId = state.params.salesReturnId;
        this.props.getSalesReturnData(salesReturnId).done(returnData => {
            this.props.getCustomersData(returnData.customer_id);
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

    render() {
        let {configurations} = this.props.screenProps.system;

        return (
            <NetPrint
                screenHeader={{
                    leftButtonPress: this.handelHeaderLeftButtonPress.bind(this)
                }}
                onPrintPress={this.handelPrintPress}
                isLoading={this.state.isLoading}
            />
        );

        return (
            <Container style={styles.container}>
                <ScreenHeader name='Select Printer'
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    // rightButtonValue='Print'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content style={styles.content}>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    {this.renderBody()}
                </Content>
                {this.renderFooter()}
            </Container>

        );
    }

    renderBody() {
        return (
            <View style={styles.customerHeader}>
                {
                    this.state.printers ?
                        this.state.printers.map(printer => (
                            <ListItem
                                leftIcon={{name: 'ios-print', type: 'ionicon'}}
                                onPress={() => this.connectPrinter(printer.id)}
                                key={printer.id}
                                title={printer.name}
                                wrapperStyle={{width: '100%'}}
                            />
                        ))
                        : null
                }
            </View>
        )
    }

    renderFooter() {
        return (
            <View style={styles.content}>
                <View style={styles.customerHeader}>
                    <Button
                        raised
                        disabled={this.state.disablePrint}
                        onPress={this.handelPrintPress.bind(this)}
                        backgroundColor={'#00897B'}
                        icon={{name: 'ios-print', type: 'ionicon'}}
                        title='PRINT'/>
                </View>
            </View>
        )
    }

    handelPrintPress() {
        let companyDetails = {
            name: this.props.user.staff[0].companies[0].name,
            city: this.props.user.staff[0].addresses[0].city
        };
        this.printSalesReturnReceipt(companyDetails)
    }

    printSalesReturnReceipt(companyDetails) {
        this.props.navigation.navigate('SalesReturnPrintPreview', {
            companyDetails,
            printData: this.state.dataSource,
            customerData: this.props.customers
        });
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
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

export default connect(mapStateToProps, mapDispatchToProps)(SalesReturnPrinterPage);
