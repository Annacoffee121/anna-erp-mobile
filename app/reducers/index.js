import {combineReducers} from 'redux';

import system from './system';
import auth from './auth';
import customer from './customer';
import route from './route';
import order from'./order';
import invoice from'./invoice';
import dropdowns from'./dropdowns';
import settings from'./settings';
import handover from'./handover';
import printer from'./printer';

export const appReducer = combineReducers({
    system,
    auth,
    customer,
    route,
    order,
    invoice,
    dropdowns,
    settings,
    handover,
    printer,
});

export const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
        state = undefined
    }
    return appReducer(state, action)
};

export const makeRootReducer =
    (asyncReducers) =>
        (state, action) =>
            combineReducers({
                system,
                auth,
                customer,
                route,
                order,
                invoice,
                dropdowns,
                settings,
                handover,
                ...asyncReducers,
            })(action.type === 'LOGOUT_SUCCESS' ? undefined : state, action);
