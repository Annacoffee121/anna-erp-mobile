import {getConfigurations, sendFCMToken} from '../../services/system';
import {connectionStatus,configurationsLoadSuccess} from './dispatchers';

export const configurationsLoad = (tenantId) => {
    return (dispatch) => {
        return getConfigurations(tenantId).then(configurations => {
            dispatch(configurationsLoadSuccess(configurations));
            return configurations;
        });
    }
};

export const changeConnectionStatus = (isConnected) => {
    return (dispatch) => {
        dispatch(connectionStatus(isConnected));
    }
};

export const sendFCM = (payload) => {
    return (dispatch) => {
        dispatch(sendFCMToken(payload));
    }
};