import {
    StackNavigator,
} from 'react-navigation';

import * as AuthNavigators from './auth';

export default createGuestNavigators = () => {
    return StackNavigator({
        ...AuthNavigators,
    }, {
        initialRouteName: 'AuthLogin'
    });
};