import React from 'react';
import {modules, more, noOfModuleOnTab} from "../config/modules";
import { Icon } from 'react-native-elements'
import MoreNavigator from "../navigators/authorized/more";

export const TabNavigation = () => {
    let moreNav = {
        'More': {
            screen: MoreNavigator(),
            navigationOptions : {
                tabBarLabel: more.label,
                tabBarIcon: ({tintColor}) => (
                    <Icon name={more.icon} type={more.iType} color={tintColor} size={23}/>
                ),
            }
        }
    };
    let tabBarModules = {};
    let ruingCount = 0;
    let modulesNav = navigation();
    Object.keys(modulesNav).forEach(function (key) {
        if(ruingCount < noOfModuleOnTab){
            tabBarModules[key] = modulesNav[key];
        }
        ruingCount++
    });
    return {
        ...tabBarModules,
        ...moreNav
    };
};

export const withoutTabNavigation = (a) => {
    let withoutTabBarModules = {};
    let ruingCount = 0;
    let modulesNav = navigation();
    Object.keys(modulesNav).forEach(function (key) {
        if(ruingCount >= noOfModuleOnTab){
            withoutTabBarModules[key] = modulesNav[key];
        }
        ruingCount++
    });
    return withoutTabBarModules;
};

const navigation = () => {
    let moduleNavigation = {};
    Object.keys(modules).forEach(function (key) {
        moduleNavigation[key] = {
            screen: modules[key].screen,
            navigationOptions : {
                tabBarLabel: modules[key].label,
                tabBarIcon: ({tintColor}) => (
                    <Icon name={modules[key].icon} type={modules[key].iType} color={tintColor} size={23}/>
                ),
            }
        }
    });
    return moduleNavigation;
};
