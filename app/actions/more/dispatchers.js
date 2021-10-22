import * as types from './types';

export const loadReturnedChequeSuccess = (cheques) => {
    return {
        type: types.LOAD_RETURNED_CHEQUE_SUCCESS,
        cheques
    };
};