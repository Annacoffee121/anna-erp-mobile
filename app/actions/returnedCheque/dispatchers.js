import * as types from './types';

export const getReturnChequeSuccess = (oauth) => {
    return {
        type: types.GET_RETURN_CHEQUE_SUCCESS,
        oauth
    };
};