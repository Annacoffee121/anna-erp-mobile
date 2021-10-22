import {
    getReturnChequeSuccess,
} from './dispatchers';
import {onLoadReturnCheques} from "../../services/returnCheque";

export const getReturnCheques = () => {
    return (dispatch) => {
        return onLoadReturnCheques().then(retCheque => {
            dispatch(getReturnChequeSuccess(retCheque));
            return retCheque;
        });
    };
};

export const postReturnCheques = (data) => {
    return (dispatch) => {
        return onLoadReturnCheques(data).then(retCheque => {
            dispatch(getReturnChequeSuccess(retCheque));
            return retCheque;
        });
    };
};