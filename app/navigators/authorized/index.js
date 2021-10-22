import React from 'react';
import {initialRouteName, activeTintColor, showIcon, showLabel} from "../../config/modules";
import {TabNavigator} from "react-navigation";
import {TabNavigation} from "../../helpers/navigator";

export default createBottomTabNavigator = () => {
    return TabNavigator(TabNavigation(), {
        initialRouteName: initialRouteName,
        tabBarPosition: 'bottom',
        animationEnabled: true,
        lazy: true,
        swipeEnabled: true,
        tabBarOptions: {
            renderIndicator: () => null,  // to remove bottom Indicator
            showLabel: showLabel,
            showIcon: showIcon,
            activeTintColor: activeTintColor,
            inactiveTintColor: 'black',
            ...styles,
        },
    })
};
const styles = {
    style: {
        backgroundColor: '#00897B',
    },
    labelStyle: {
        fontSize: 10,
        margin: 1,
    },
    iconStyle: {
        margin: 1,
        padding: 0,
    },

};