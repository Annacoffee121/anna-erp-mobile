import React, {Component} from 'react';
import DashboardTab from "../screens/home/tabs/dashboard/index";
import customerNavigator from "../navigators/authorized/customer/index";
import orderNavigator from "../navigators/authorized/order/index";
import invoiceNavigator from "../navigators/authorized/invoice/index";
import Logout from "../screens/auth/logout/index";

export const initialRouteName = 'Dashboard';
export const activeTintColor = '#FFF';
export const noOfModuleOnTab = 4;
export const showIcon = true;
export const showLabel = true;
export const more = {
    label: 'More',
    icon: 'list-thumbnails',
    iType:'foundation'
};

export const modules = {
    Dashboard: {
        label: 'Dashboard',
        screen: DashboardTab,
        icon: 'dashboard',
        iType:'font-awesome'
    },
    Customer: {
        label: 'Customers',
        screen: customerNavigator(),
        icon: 'ios-people',
        iType:'ionicon'
    },
    Orders: {
        label: 'Orders',
        screen: orderNavigator(),
        icon: 'ios-cart',
        iType:'ionicon'
    },
    Invoices: {
        label: 'Invoices',
        screen: invoiceNavigator(),
        icon: 'ios-paper',
        iType:'ionicon'
    },
    Logout: {
        label: 'Logout',
        screen: Logout,
        icon: 'ios-log-out',
        iType:'ionicon'
    }
};
