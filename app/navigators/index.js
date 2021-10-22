import React from 'react';
import {StackNavigator} from 'react-navigation';

import createGuestNavigators from './guest';
import createAuthTabNavigators from './authorized/index';
import downloadScreen from '../screens/auth/download';
import ExitScreen from '../components/ExitApp';
import FaceUnlock from '../screens/auth/login/FaceUnlock';

export default createRootNavigator = (authorized = false) => StackNavigator({
        Guest: {
            screen: createGuestNavigators(),
        },
        Download: {
            screen: downloadScreen,
        },
        Validation: {
            screen: ExitScreen,
        },
        FaceUnlock: {
            screen: FaceUnlock,
        },
        Authorized: {
            screen: createAuthTabNavigators(),
        }
    },
    {
        headerMode: 'none',
        mode: 'modal',
        initialRouteName: authorized ? 'Validation' : 'Guest'
    }
)