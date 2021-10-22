import React from 'react';
import {StackNavigator,} from 'react-navigation';
import OrderIndexScreen from '../../../screens/home/tabs/invoices/index';
import ShowInvoiceScreen from '../../../screens/home/tabs/invoices/show';
import NewInvoice from '../../../screens/home/tabs/invoices/new'
import NewPayment from '../../../screens/home/tabs/invoices/payment'
import DropDownSearch from "../../../screens/home/tabs/orders/search";
import PrintPage from "../../../screens/home/print";
import PrintPreview from "../../../screens/home/print/printPreview";
import DeliveryPrintPage from "../../../screens/home/deliveryNotePrint";
import DeliveryNotePreview from "../../../screens/home/deliveryNotePrint/deliveryNotePreview";

export default createInvoiceNavigator = () => {
    return StackNavigator(
        {
            InvoiceIndex: {
                screen: OrderIndexScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ShowInvoice: {
                screen: ShowInvoiceScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddInvoice: {
                screen: NewInvoice,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddPayment: {
                screen: NewPayment,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SearchInvoiceItems: {
                screen: DropDownSearch,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            PrintOrder: {
                screen: PrintPage,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            PrintPreview: {
                screen: PrintPreview,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            PrintDeliveryNote: {
                screen: DeliveryPrintPage,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            DeliveryNotePreview: {
                screen: DeliveryNotePreview,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: 'InvoiceIndex'
        }
    );
}