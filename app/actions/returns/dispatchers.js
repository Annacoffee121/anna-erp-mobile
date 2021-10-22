import * as types from './types';

export const loadNewSalesReturnSuccess = (salesReturn) => {
    return {
        type: types.POST_SALES_RETURN_SUCCESS,
        salesReturn
    };
};

export const loadStoreSalesReturnSuccess = (sales_return) => {
    return {
        type: types.STORE_SALES_RETURN_SUCCESS,
        sales_return
    };
};

export const loadGetSalesReturnDataSuccess = (sales_return_data) => {
    return {
        type: types.GET_SALES_RETURN_DATA_SUCCESS,
        sales_return_data
    };
};

export const loadGetSalesReturnSuccess = (sales_returns) => {
    return {
        type: types.GET_SALES_RETURN_SUCCESS,
        sales_returns
    };
};