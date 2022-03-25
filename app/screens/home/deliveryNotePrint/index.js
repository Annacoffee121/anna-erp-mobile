import React, {Component} from 'react';
import {connect} from "react-redux";
import {getOrder, getOrderPrint} from "../../../actions/orders";
import DeliveryNotePreview from "./deliveryNotePreview";
import NetPrint from "../NetPrint/NetPrint";

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
    }

    loadRemoteOrders(orderId, callback) {
        this.props.getOrderDataFromRealm(orderId).done(() => {
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

    render() {
        return (
            <NetPrint
                screenHeader={{
                    leftButtonPress: this.handelHeaderLeftButtonPress.bind(this)
                }}
                onPrintPress={this.handelPrintPress.bind(this)}
                isLoading={this.state.isLoading}
            />
        );
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
