import React from 'react';
import {StackNavigator,} from 'react-navigation';
import CustomerIndexScreen from '../../../screens/home/tabs/customers/index';
import CustomerShowScreen from '../../../screens/home/tabs/customers/show/index';
import CustomerNewScreen from '../../../screens/home/tabs/customers/new/index';
import AddNewContactScreen from '../../../screens/home/tabs/customers/new/contact/index';
import CreateNewSalesReturn from '../../../screens/home/tabs/customers/salesReturn';
import SalesReturnShow from '../../../screens/home/tabs/customers/salesReturn/show';
import CreateReturnLineItems from '../../../screens/home/tabs/customers/salesReturn/returnLineItems';
import DropDownSearch from "../../../screens/home/tabs/orders/search";
import CustomerOrderShow from "../../../screens/home/tabs/customers/orderShow";
import CustomerInvoiceShow from "../../../screens/home/tabs/customers/invoiceShow";
import CustomerPaymentShow from "../../../screens/home/tabs/customers/paymentShow";
import CustomerProductShow from "../../../screens/home/tabs/customers/productsShow";
import ShowOrderScreen from "../../../screens/home/tabs/orders/show";
import ShowInvoiceScreen from "../../../screens/home/tabs/invoices/show";
import NotVisitedReasonTab from "../../../screens/home/tabs/more/handover/reason";
import SalesReturnReasonTab from "../../../screens/home/tabs/customers/salesReturn/reason";
import ReplaceLineItems from "../../../screens/home/tabs/customers/salesReturn/replaceLineItems";
import SearchReturnOrder from "../../../screens/home/tabs/customers/salesReturn/search";
import SalesReturnPrinterPage from "../../../screens/home/tabs/customers/salesReturn/print";
import SalesReturnPrintPreview from "../../../screens/home/tabs/customers/salesReturn/print/printPreview";


export default createContactNavigator = () => {
    return StackNavigator(
        {
            CustomerIndex: {
                screen: CustomerIndexScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerShow: {
                screen: CustomerShowScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerNew: {
                screen: CustomerNewScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            NewContact: {
                screen: AddNewContactScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SalesReturnNew: {
                screen: CreateNewSalesReturn,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SalesReturnShow: {
                screen: SalesReturnShow,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SalesReturnItems: {
                screen: CreateReturnLineItems,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SalesReturnReason: {
                screen: SalesReturnReasonTab,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ReplaceItems: {
                screen: ReplaceLineItems,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ReturnOrderSearch: {
                screen: SearchReturnOrder,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            PrintSalesReturn: {
                screen: SalesReturnPrinterPage,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SalesReturnPrintPreview: {
                screen: SalesReturnPrintPreview,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SearchCustomerItems: {
                screen: DropDownSearch,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerOrder: {
                screen: CustomerOrderShow,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerInvoice: {
                screen: CustomerInvoiceShow,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerPayment: {
                screen: CustomerPaymentShow,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerProduct: {
                screen: CustomerProductShow,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ShowCustomerOrder: {
                screen: ShowOrderScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ShowCustomerInvoice: {
                screen: ShowInvoiceScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerNotVisitedReason: {
                screen: NotVisitedReasonTab,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: 'CustomerIndex'
        }
    );
}