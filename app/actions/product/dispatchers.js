import * as types from './types';

export const loadAllWebProductsSuccess = (products) => {
    return {
        type: types.LOAD_ALL_WEB_PRODUCTS_SUCCESS,
        products
    };
};

export const loadAllWebReturnProductsSuccess = (return_products) => {
    return {
        type: types.LOAD_ALL_WEB_RETURN_PRODUCTS_SUCCESS,
        return_products
    };
};

export const postStockConfirmationSuccess = (con_products) => {
    return {
        type: types.POST_STOCK_CONFIRMATION_SUCCESS,
        con_products
    };
};