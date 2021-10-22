import React from 'react';
import {StackNavigator,} from 'react-navigation';
import MoreScreen from "../../../screens/home/tabs/more/index";
import HandoverScreen from '../../../screens/home/tabs/more/handover';
import ExpensesTab from "../../../screens/home/tabs/more/handover/expenses";
import NotVisitedCustomerReasonList from "../../../screens/home/tabs/more/notVisitedCustomer";
import NotVisitedReasonTab from "../../../screens/home/tabs/more/handover/reason";
import AddNotVisitedReason from "../../../screens/home/tabs/more/notVisitedCustomer/notVisitReson";
import StockListTab from "../../../screens/home/tabs/more/stock";
import PickRoute from "../../../screens/home/tabs/more/PickRoute";
import StockConfirmationScreen from "../../../screens/home/tabs/more/stockConfirmation";
import ReturnedChequesScreen from "../../../screens/home/tabs/more/ReturnedCheques";
import ReturnedChequeViewScreen from "../../../screens/home/tabs/more/ReturnedCheques/View";
import ReturnChequePrintPage from "../../../screens/home/returnChequePrint";
import ReturnPrintPreview from "../../../screens/home/returnChequePrint/printPreview";
import DropDownSearch from "../../../screens/home/tabs/orders/search";
import NewPayment from "../../../screens/home/tabs/more/ReturnedCheques/payment";

export default createMoreNavigator = () => {
    return StackNavigator(
        {
            MoreIndex: {
                screen: MoreScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            StockList: {
                screen: StockListTab,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            Handover: {
                screen: HandoverScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            Expenses: {
                screen: ExpensesTab,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddReason: {
                screen: AddNotVisitedReason,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            Reason: {
                screen: NotVisitedReasonTab,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            CustomerReason: {
                screen: NotVisitedCustomerReasonList,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SelectRoute: {
                screen: PickRoute,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            StockConfirmation: {
                screen: StockConfirmationScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ReturnedCheques: {
                screen: ReturnedChequesScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ReturnedChequeView: {
                screen: ReturnedChequeViewScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            PrintReturnCheque: {
                screen: ReturnChequePrintPage,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ReturnChequePrintPreview: {
                screen: ReturnPrintPreview,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SearchBankItems: {
                screen: DropDownSearch,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddChequePayment: {
                screen: NewPayment,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: 'MoreIndex'
        }
    );
}
