import {
    loadGetSalesReturnDataSuccess,
    loadGetSalesReturnSuccess, loadNewSalesReturnSuccess,
    loadStoreSalesReturnSuccess,
} from './dispatchers';
import {getSalesReturn, getSalesReturnByCustomerId, insertSalesReturnData} from "../../../database/Returns";
import {postNewSalesReturn} from "../../services/order";

export const storeSalesReturn = (payload) => {
    return (dispatch) => {
        return insertSalesReturnData(payload).then(sales_return => {
            dispatch(loadStoreSalesReturnSuccess(sales_return));
            return sales_return;
        });
    };
};

export const setNewSalesReturn = (id, payload) => {
    return (dispatch) => {
        return postNewSalesReturn(id, payload).then(salesReturn => {
            dispatch(loadNewSalesReturnSuccess(salesReturn));
            return salesReturn;
        });
    };
};

export const getSalesReturnDataFromRealm = (payload) => {
    return (dispatch) => {
        return getSalesReturn(payload).then(sales_return_data => {
            dispatch(loadGetSalesReturnDataSuccess(sales_return_data));
            return sales_return_data;
        });
    };
};

export const getSalesReturnFromRealm = (payload) => {
    return (dispatch) => {
        return getSalesReturnByCustomerId(payload).then(sales_returns => {
            dispatch(loadGetSalesReturnSuccess(sales_returns));
            return sales_returns;
        });
    };
};