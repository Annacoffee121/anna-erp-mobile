import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Content} from 'native-base';
import BluetoothSerial from 'react-native-bluetooth-serial'
import {Button, ListItem} from 'react-native-elements'
import Spinner from '../../../components/spinner/index';
import ScreenHeader from '../../../components/textHeader';
import {showMessage} from '../../../helpers/toast'
import styles from './styles';
import {connect} from "react-redux";
import {getPrinterData, insertPrinterData} from "../../../../database/Printer";
import {changePrinterDataToStore} from "../../../helpers/dateConverter";

class ConnectPrinterPage extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: null,
            printers: '',
            currentPrinter: '',
            isLoading: false,
            loadingText: null,
            disablePrint: true,
            outstanding: null,
            printCount: 0,
            allCustomerPayments: []
        }
    }

    componentWillMount() {
        BluetoothSerial.list().then(printers => {
            this.setState({printers: printers})
        });
        this.automaticPrinterConnect();
    }

    automaticPrinterConnect() {
        getPrinterData(1).then(result => {
            if (result) {
                BluetoothSerial.isConnected().then(isConnected => {
                    if (isConnected) {
                        this.setState({currentPrinter: result.message, isLoading: false, disablePrint: false});
                        this.handelPrintPress();
                        showMessage(result.message);
                    } else {
                        this.connectPrinter(result)
                    }
                });
            }
        })
    }

    //To Connect printer
    connectPrinter(printer) {
        this.setState({
            isLoading: true,
            loadingText: `Connecting to ${printer.name ? printer.name : ''} printer, Please wait...`
        });
        BluetoothSerial.connect(printer.id).then(response => {
            let data = changePrinterDataToStore(printer, response, true);
            insertPrinterData(data).then(value => {
                this.setState({currentPrinter: response, isLoading: false, loadingText: null, disablePrint: false});
                this.handelPrintPress();
                showMessage(response.message);
            })
        }).catch(error => {
            let data = changePrinterDataToStore(printer, error, false);
            insertPrinterData(data).then(value => {
                showMessage(error.message);
                this.setState({isLoading: false, loadingText: null, disablePrint: true})
            })
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        const {isLoading, loadingText} = this.state;
        return (
            <Container style={styles.container}>
                <ScreenHeader name='Select Printer'
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    // rightButtonValue='Print'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content style={styles.content}>
                    <Spinner visible={isLoading}
                             textContent={loadingText ? loadingText : configurations.loginScreenLoaderText}
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
                                onPress={() => this.connectPrinter(printer)}
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
                        onPress={() => {
                            this.setState({isLoading: true, loadingText: 'Validating printer connection!'});
                            BluetoothSerial.isConnected().then(isConnected => {
                                this.setState({isLoading: false, loadingText: null});
                                if (!isConnected) return showMessage('Printer is not connected. Please check!');
                                this.handelPrintPress();
                            })
                        }}
                        backgroundColor={'#00897B'}
                        icon={{name: 'ios-print', type: 'ionicon'}}
                        title='PRINT'/>
                </View>
            </View>
        )
    }

    handelPrintPress() {
        const companyDetails = {
            name: this.props.user.staff[0].companies[0].display_name,
            phone: this.props.user.staff[0].companies[0].phone,
            company_mail: this.props.user.staff[0].companies[0].email,
            city: this.props.user.staff[0].companies[0].addresses[0].city
        };
        this.printPaymentReceipt(companyDetails);
    }

    printPaymentReceipt(companyDetails) {
        const {cheque} = this.props.navigation.state.params;
        this.props.navigation.navigate('ReturnChequePrintPreview', {
            companyDetails,
            printData: cheque,
        });
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
    isConnected: state.system.isConnected,
    order: state.order.order,
    orderPrint: state.order.orderPrint,
    payments: state.invoice.payments,
});


const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectPrinterPage);
