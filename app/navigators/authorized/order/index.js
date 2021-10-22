import React from 'react';
import {StackNavigator,} from 'react-navigation';
import OrderIndexScreen from '../../../screens/home/tabs/orders/index';
import ShowOrderScreen from '../../../screens/home/tabs/orders/show';
import NewOrderScreen from "../../../screens/home/tabs/orders/addNewOrder";
import CreateLineItems from "../../../screens/home/tabs/orders/addNewOrder/lineItems";
import DropDownSearch from '../../../screens/home/tabs/orders/search'
import PrintPage from '../../../screens/home/print'
import NewInvoice from '../../../screens/home/tabs/invoices/new'

export default createOrderNavigator = () => {
    return StackNavigator(
        {
            OrderIndex: {
                screen: OrderIndexScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            ShowOrder: {
                screen: ShowOrderScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddNewOrder: {
                screen: NewOrderScreen,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            AddLineItems: {
                screen: CreateLineItems,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            SearchItems: {
                screen: DropDownSearch,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            // PrintOrder: {
            //     screen: PrintPage,
            //     navigationOptions: {
            //         gesturesEnabled: false
            //     }
            // },
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: 'OrderIndex'
        }
    );
}