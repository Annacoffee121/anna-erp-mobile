import * as types from './types';

export const configurationsLoadSuccess = (configurations) => {
    return {
        type: types.CONFIGURATIONS_LOAD_SUCCESS,
        configurations
    };
};

export const connectionStatus = (isConnected) => {
    return {
        type: types.CHANGE_CONNECTION_STATUS,
        isConnected
    };
};