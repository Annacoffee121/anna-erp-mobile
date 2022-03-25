import React, {Component} from 'react';
import {connect} from "react-redux";
import NetPrint from "../NetPrint/NetPrint";

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
