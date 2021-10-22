import {
    loadAllProductRequest,
} from '../../services/product/index';

import {
    loadAllWebProductsSuccess, loadAllWebReturnProductsSuccess, postStockConfirmationSuccess,
} from './dispatchers';
import {loadAllReturnProductRequest, postStockConfirmationRequest} from "../../services/product";

export const getAllProductss = (payload) => {
    return (dispatch) => {
        return loadAllProductRequest(payload).then(customers => {
            dispatch(loadAllWebProductsSuccess(customers));
            return customers;
        });
    };
};

export const getAllReturnProducts = (payload) => {
    return (dispatch) => {
        return loadAllReturnProductRequest(payload).then(products => {
            dispatch(loadAllWebReturnProductsSuccess(products));
            return products;
        });
    };
};

export const setStockConfirmation = (payload) => {
    return (dispatch) => {
        return postStockConfirmationRequest(payload).then(con_products => {
            dispatch(postStockConfirmationSuccess(con_products));
            return con_products;
        });
    };
};