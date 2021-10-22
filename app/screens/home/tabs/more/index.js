import React, {Component,} from 'react';
import {Text, View} from 'react-native'
import {
    getNotSyncCustomerData,
    insertCustomerData,
    deleteCustomerById
} from '../../../../../database/Customer/controller';
import {transformUpdateCustomer, transformOfflineCustomerForSync} from "../../../../helpers/customer";
import {connect} from "react-redux";
import {setNewCustomer} from "../../../../actions/customer";
import {showMessage} from "../../../../helpers/toast";
import IndexHeader from '../../../../components/header'
import {ListItem} from 'react-native-elements'
import {Container, Content} from "native-base";
import Spinner from "../../../../components/spinner";
import styles from "./styles";
import {setNewOrder} from "../../../../actions/orders";

import {syncAll as syncAllOrder} from '../../../../services/sync/order'
import {syncAll as syncAllInvoice} from '../../../../services/sync/invoice'
import {syncAllPayment} from "../../../../services/sync/payment";
import {handleOfflineDataValidation} from "../../../../helpers/offline-data";
import {syncAllSalesReturn} from "../../../../services/sync/salesReturn";
import {syncAllNotVisitReasons} from "../../../../services/sync/notVisitReason";
import {syncAllExpenses} from "../../../../services/sync/expenses";

class MoreTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    render() {
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <IndexHeader
                    name={'More'}
                    disableLeftButton
                    disableRightButton
                />
                <Spinner visible={this.state.isLoading}
                         textContent={'Please wait \n Some background work in progress'}
                         textStyle={{color: '#00897B', textAlign: 'center'}}
                         color={'#00897B'}/>
                <Content>
                    {this.renderMoreList()}
                    {this.renderMoreOnlineList()}
                    {this.renderFooter()}
                </Content>

            </Container>
        )
    }

    renderFooter() {
        const {versionText} = this.props.configurations;
        return (
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    {versionText}
                </Text>
            </View>
        )
    }

    renderMoreList() {
        return (
            <View style={styles.staffViewContent}>
                <View style={styles.staffView}>
                    <ListItem
                        title={'Stock'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'ios-basket', type: 'ionicon'}}
                        subtitle={'View allocated stock details'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleStockPressed()}
                    />
                    <ListItem
                        title={'Expenses'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'money', type: 'font-awesome'}}
                        subtitle={'View or add daily expenses'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleExpensesPressed()}
                    />
                    <ListItem
                        title={'Stock confirmation'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'checklist', type: 'octicon'}}
                        subtitle={'Confirm stock before handover'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() =>this.handleStockConfirmationPressed()}
                    />
                    <ListItem
                        title={'Returned cheques'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'newspaper', type: 'material-community'}}
                        subtitle={'View and take action for returned cheques'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() =>this.handleReturnedChequesPressed()}
                        containerStyle={{borderBottomColor: '#FFF'}}
                    />
                </View>
            </View>
        )
    }

    renderMoreOnlineList() {
        return (
            <View style={styles.viewContent}>
                <View style={styles.staffView}>
                    <ListItem
                        title={'Customer not visit reason'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'book-open-page-variant', type: 'material-community'}}
                        subtitle={'View or add customer not visit reason'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleNotVisitReasonPressed()}
                    />
                    <ListItem
                        title={'Next day allocation'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'google-maps', type: 'material-community'}}
                        subtitle={'Pick your next day route'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.selectNextDayRoute()}
                    />
                    <ListItem
                        title={'Handovers'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'md-hand', type: 'ionicon'}}
                        subtitle={'Handover today\'s data & log-out'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleHandoverPressed()}
                    />
                    <ListItem
                        title={'Download'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'ios-cloud-download', type: 'ionicon'}}
                        subtitle={'Download today\'s allocation'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleDownloadPressed()}
                    />
                    <ListItem
                        title={'Sync'}
                        titleStyle={{marginLeft: 10}}
                        leftIcon={{name: 'md-sync', type: 'ionicon'}}
                        subtitle={'Sync all offline data'}
                        subtitleStyle={{marginLeft: 10}}
                        onPress={() => this.handleSyncPressed()}
                        containerStyle={{borderBottomColor: '#FFF'}}
                    />
                </View>
            </View>
        )
    }

    handleStockPressed() {
        let {navigate} = this.props.navigation;
        navigate('StockList')
    }

    handleExpensesPressed() {
        this.props.navigation.navigate('Expenses');
    }

    handleStockConfirmationPressed() {
        this.props.navigation.navigate('StockConfirmation');
    }

    handleReturnedChequesPressed() {
        this.props.navigation.navigate('ReturnedCheques');
    }

    handleNotVisitReasonPressed() {
        if (this.props.isConnected) {
            let {navigate} = this.props.navigation;
            navigate('CustomerReason')
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    selectNextDayRoute() {
        if (this.props.isConnected) {
            let {navigate} = this.props.navigation;
            navigate('SelectRoute')
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    handleHandoverPressed() {
        if (this.props.isConnected) {
            let {navigate} = this.props.navigation;
            navigate('Handover')
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    handleDownloadPressed() {
        if (this.props.isConnected) {
            handleOfflineDataValidation().then(response => {
                if (response) return showMessage(response + ' Please press sync button!!!');
                this.props.navigation.navigate('Download');
            })
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    async handleSyncPressed() {
        if (this.props.isConnected) {
            if (this.props.autoSyncStatus) return showMessage('Auto sync is in progress! Please wait!');
            this.setState({isLoading: true});
            await this.getCustomerDataAndSync();
            await this.syncExpensesData();
            await this.syncSalesReturnData();
            await this.syncNotVisitReasonData();
            await this.syncOrderData();
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    syncOrderData() {
        syncAllOrder().then(() => {
            this.syncInvoiceData();
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        });
    }

    syncInvoiceData() {
        syncAllInvoice().then(() => {
            this.syncPaymentData();
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        });
    }

    syncPaymentData() {
        syncAllPayment().then(() => {
            this.setState({isLoading: false});
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        });
    }

    syncExpensesData() {
        syncAllExpenses().then(() => {
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        })
    }

    getCustomerDataAndSync() {
        getNotSyncCustomerData().then(value => {
            value.map(data => {
                this.syncCustomer(transformOfflineCustomerForSync(data), data.id)
            })
        }).catch(error => console.log(error))
    }

    syncSalesReturnData() {
        syncAllSalesReturn().then(() => {
            // this.setState({isLoading: false});
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        });
    }

    syncNotVisitReasonData() {
        syncAllNotVisitReasons().then(() => {
            // this.setState({isLoading: false});
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        });
    }

    syncCustomer(customer, tempCusId) {
        this.props.onSaveCustomer(customer)
            .then(value => {
                deleteCustomerById(tempCusId).catch((error) => console.log(error, 'error'));
                insertCustomerData(transformUpdateCustomer(value)).then().catch((error) => {
                    console.log(error, 'error')
                });
                if (value.id) {
                    this.setState({isLoading: false});
                    showMessage('Customer synced successfully!!')
                }
            })
            .catch(exception => {
                this.setState({isLoading: false, isError: true});
                console.warn(exception, 'Create exception');
            });
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    autoSyncStatus: state.order.status,
    configurations: state.system.configurations
});

const mapDispatchToProps = (dispatch) => ({
    onSaveCustomer(customerData) {
        return dispatch(setNewCustomer(customerData));
    },
    onSaveSalesOrder(salesOrderData) {
        return dispatch(setNewOrder(salesOrderData));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MoreTab);