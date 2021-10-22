import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text, View, Image, ActivityIndicator, StatusBar} from 'react-native';
import styles from './styles'
import {getRoute} from "../../../actions/dashboard";
import {getAllCustomers} from "../../../actions/customer";
import {getBank, getBusinessType, getDepositedTo, getUnitType} from "../../../actions/dropdown";
import {getAllProductss, getAllReturnProducts} from "../../../actions/product";
import {getOrders} from "../../../actions/orders";
import {getInvoices, getMetaDataProcess, getPayments} from "../../../actions/invoice";
import {getExpenseTypeData, getPriceBookData} from "../../../actions/settings";
import {insertDashboardData} from "../../../../database/Dashboard/controller";
import {insertCustomerData} from "../../../../database/Customer/controller";
import {insertProducts} from "../../../../database/Products/controller";
import {insertMetaData} from "../../../../database/Mata/model";
import {getOrderById, insertOrderData} from "../../../../database/Order/controller";
import {getInvoiceById, insertInvoiceData} from "../../../../database/Invoice/controller";
import {getPaymentById, insertPaymentData} from "../../../../database/Payment/controller";
import {
    insertBusinessType,
    insertUnitType,
    insertDepositedTo,
    insertBank
} from "../../../../database/DropDown/controller";
import {Container} from "native-base";
import {insertReturnProducts} from "../../../../database/ReturnProducts/controller";
import {insertPriceBookData} from "../../../../database/PriceBook";
import {getExpensesById, insertExpense, insertExpenseType} from "../../../../database/Expenses/model";
import moment from "moment";
import {getExpensesFromServer} from "../../../actions/handover";
import {transformExpenseToStore} from "../../../helpers/handover";
import {insertReturnedCheque} from "../../../../database/ReturnedCheques/controller";
import {getReturnCheques} from "../../../actions/returnedCheque";
import {changeRCForDataStore} from "../../../helpers/returnedCheque";

class LoadingScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            status: '* * *'
        };
    }

    async componentWillMount() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            // Download Data
            await this.handleDashBoardDownload();
            await this.handleCustomerDownload();
            await this.handleBusinessTypeDownload();
            await this.handleUnitTypeDownload();
            await this.handleDepositedToDownload();
            await this.handleBankDownload();
            await this.handleProductsDownload();
            await this.handlePriceBookDownload();
            await this.handleReturnProductsDownload();
            await this.handleReturnedChequeDownload();
            await this.handleMetaDataDownload();
            await this.handleExpenseTypeDownload();
            await this.handleOrderDownload();
            await this.handleInvoiceDownload();
            await this.handleExpenseDownload();
            await this.handlePaymentDownload();
        } else {
            alert('Internet is not connected')
        }
    }

    handleDashBoardDownload() {
        this.props.getRouteData().then((data) => {
            data.map((value) => {
                insertDashboardData(value).catch((error) => {
                    console.log(error, 'error')
                })
            });
        }).done(() => this.setState({status: 'Route downloaded successfully!'}));
    }

    handleCustomerDownload() {
        this.props.getCustomersData().then((data) => {
            data.map((value) => {
                insertCustomerData(value).catch((error) => {
                    console.log(error, 'error')
                })
            });
        }).done(() => this.setState({status: 'Customers downloaded successfully!'}));
    }

    handleProductsDownload() {
        this.props.getProductsData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertProducts(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Products downloaded successfully!'}));
    }

    handlePriceBookDownload() {
        this.props.getPriceBookDataValue().then((data) => {
            data ? insertPriceBookData(data).catch(error => console.log(error, 'insert'))
                : null
        }).done(() => this.setState({status: 'Price book downloaded successfully!'}));
    }

    handleReturnProductsDownload() {
        this.props.getReturnProductsData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertReturnProducts(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Return products downloaded successfully!'}));
    }

    handleReturnedChequeDownload() {
        this.props.getReturnCheques().then((dataArray) => {
            dataArray.length ? dataArray.map(data => {
                const finalData = changeRCForDataStore(data);
                insertReturnedCheque(finalData).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Returned cheques downloaded successfully!'}));
    }

    handleBusinessTypeDownload() {
        this.props.getBusinessTypeData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertBusinessType(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Business type downloaded successfully!'}));
    }

    handleUnitTypeDownload() {
        this.props.getUnitTypeData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertUnitType(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Unit type downloaded successfully!'}));
    }

    handleDepositedToDownload() {
        this.props.getDepositedToData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertDepositedTo(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Deposited to downloaded successfully!'}));
    }

    handleBankDownload() {
        this.props.getBankData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertBank(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Bank downloaded successfully!'}));
    }

    handleOrderDownload() {
        this.props.getOrdersData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(async order => {
                await getOrderById(order.id).then(async order_u_id => {
                    if (order_u_id) {
                        order.u_id = order_u_id;
                        order.created_at = moment(order.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertOrderData(order).catch(error => console.log(error, 'insert'));
                    } else {
                        order.created_at = moment(order.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertOrderData(order).catch(error => console.log(error, 'insert'));
                    }
                });
            }) : null
        }).done(() => this.setState({status: 'Order downloaded successfully!'}));
    }

    handleInvoiceDownload() {
        this.props.getInvoicesData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(async invoice => {
                await getInvoiceById(invoice.id).then(async invoice_u_id => {
                    if (invoice_u_id) {
                        invoice.u_id = invoice_u_id;
                        invoice.created_at = moment(invoice.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertInvoiceData(invoice).catch(error => console.log(error, 'insert'));
                    } else {
                        invoice.created_at = moment(invoice.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertInvoiceData(invoice).catch(error => console.log(error, 'insert'));
                    }
                });
            }) : null
        }).done(() => this.setState({status: 'Invoice downloaded successfully!'}));
    }

    handleExpenseDownload() {
        this.props.getExpensesData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(async expense => {
                await getExpensesById(expense.id).then(async expenses_uuid => {
                    if (expenses_uuid) {
                        expense.uuid = expenses_uuid;
                        const data = transformExpenseToStore(expense, null);
                        await insertExpense(data).catch(error => console.log(error, 'insert'))
                    } else {
                        const data = transformExpenseToStore(expense, null);
                        insertExpense(data).catch(error => console.log(error, 'insert'))
                    }
                });
            }) : null
        }).done(() => this.setState({status: 'Expense downloaded successfully!'}));
    }

    handlePaymentDownload() {
        this.props.getPaymentsData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(async payment => {
                await getPaymentById(payment.id).then(async payment_u_id => {
                    if (payment_u_id) {
                        payment.u_id = payment_u_id;
                        payment.created_at = moment(payment.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertPaymentData(payment).catch(error => console.log(error, 'insert'));
                    } else {
                        payment.created_at = moment(payment.created_at.date).format('YYYY-MM-DD HH:mm:ss');
                        await insertPaymentData(payment).catch(error => console.log(error, 'insert'));
                    }
                });
            }) : null
        }).done(() => {
            this.setState({status: 'Payment downloaded successfully!'});
            this.handleNavigate();
        });
    }

    handleMetaDataDownload() {
        this.props.getMeta().then(value => {
            let valueWithId = {
                id: 1,
                next_order_ref: value.next_order_ref,
                next_invoice_ref: value.next_invoice_ref,
                rep_cl: value.rep_cl,
                rep_total_cl: value.rep_total_cl,
                route_cl: value.route_cl,
                route_total_cl: value.route_total_cl,
                start_odo_meter_reading: value.start_odo_meter_reading,
                allocation: value.allocation,
            };
            insertMetaData(valueWithId).catch(error => console.log(error, 'insert'))
        }).done(() => this.setState({status: 'Meta data downloaded successfully!'}))
    }

    handleExpenseTypeDownload() {
        this.props.getExpenseTypeData().then((dataArray) => {
            dataArray.length > 0 ? dataArray.map(data => {
                insertExpenseType(data).catch(error => console.log(error, 'insert'));
            }) : null
        }).done(() => this.setState({status: 'Expense type downloaded successfully!'}));
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar backgroundColor="#00897B" barStyle="light-content"/>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo}
                           source={require('../../../assets/images/logo.png')}/>
                    <ActivityIndicator color={'#00897B'}
                                       size={'large'}
                                       animating={this.state.isLoading}
                                       style={styles.indicator}/>
                    <View style={styles.textViewStyle}>
                        <Text style={{color: '#00897B', fontSize: 20}}>Please wait !!!</Text>
                        <Text style={{color: '#00897B', fontSize: 16}}>Downloading is in progress . . .</Text>
                        <Text style={{color: '#000'}}>{this.state.status}</Text>
                    </View>
                </View>
            </Container>
        );
    }

    handleNavigate() {
        this.setState({isLoading: false});
        this.props.navigation.navigate('Authorized');
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    getRouteData() {
        return dispatch(getRoute());
    },
    getCustomersData() {
        return dispatch(getAllCustomers());
    },
    getBusinessTypeData() {
        return dispatch(getBusinessType());
    },
    getUnitTypeData() {
        return dispatch(getUnitType());
    },
    getDepositedToData() {
        return dispatch(getDepositedTo());
    },
    getBankData() {
        return dispatch(getBank());
    },
    getProductsData() {
        return dispatch(getAllProductss());
    },
    getPriceBookDataValue() {
        return dispatch(getPriceBookData());
    },
    getReturnProductsData() {
        return dispatch(getAllReturnProducts());
    },
    getOrdersData() {
        return dispatch(getOrders());
    },
    getInvoicesData() {
        return dispatch(getInvoices());
    },
    getExpensesData() {
        return dispatch(getExpensesFromServer());
    },
    getPaymentsData() {
        return dispatch(getPayments());
    },
    getMeta() {
        return dispatch(getMetaDataProcess());
    },
    getExpenseTypeData() {
        return dispatch(getExpenseTypeData());
    },
    getReturnCheques() {
        return dispatch(getReturnCheques());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
