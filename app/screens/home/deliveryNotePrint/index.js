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
import {getOrder, getOrderPrint} from "../../../actions/orders";
import DeliveryNotePreview from "./deliveryNotePreview";
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
            disablePrint: false,
        }
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        let orderId = state.params.orderId;
        this.setState({isLoading: true});
        this.loadRemoteOrders(orderId);

        BluetoothSerial.list().then(printers => {
            this.setState({printers: printers})
        });
    }

    loadRemoteOrders(orderId, callback) {
        this.props.getOrderDataFromRealm(orderId).done(() => {
            this.setState({
                dataSource: this.props.order,
                isLoading: false
            });
            this.automaticPrinterConnect();
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    automaticPrinterConnect() {
        getPrinterData(1).then(result => {
            if (result) {
                if (!result.connect_status) {
                    this.connectPrinter(result)
                } else {
                    this.setState({currentPrinter: result.message, isLoading: false, disablePrint: false});
                    this.handelPrintPress();
                    showMessage(result.message);
                }
            }
        })
    }

    //To Connect printer
    connectPrinter(printer) {
        this.setState({isLoading: true});
        BluetoothSerial.connect(printer.id).then(response => {
            let data = changePrinterDataToStore(printer, response, true);
            insertPrinterData(data).then(value => {
                this.setState({currentPrinter: response, isLoading: false, disablePrint: false});
                this.handelPrintPress();
                showMessage(response.message);
            })
        }).catch(error => {
            let data = changePrinterDataToStore(printer, error, false);
            insertPrinterData(data).then(value => {
                showMessage(error.message);
                this.setState({isLoading: false, disablePrint: true})
            })
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    render() {
        let {configurations} = this.props.screenProps.system;
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
            name: this.props.user.staff[0].companies[0].display_name,
            city: this.props.user.staff[0].companies[0].addresses[0].city
        };
        this.printTodayOrder(companyDetails);
    }

    printTodayOrder(companyDetails) {
        this.props.navigation.navigate('DeliveryNotePreview', {
            companyDetails,
            printData: this.state.dataSource,
        });
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
    isConnected: state.system.isConnected,
    order: state.order.order,
});


const mapDispatchToProps = (dispatch) => ({
    getOrderDataFromRealm(orderId) {
        return dispatch(getOrder(orderId));
    },
    getOrderData(orderId) {
        return dispatch(getOrderPrint(orderId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectPrinterPage);