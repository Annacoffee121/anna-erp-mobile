import {
    fetchOneProductRequest,
    loadPriceBookDataRequest,
    loadExpenseTypeRequest
} from '../../services/settings/index';

import {
    fetchProductSuccess,
    getPriceBookFromRealmSuccess,
    loadExpenseTypeSuccess,
    loadPriceBookDataSuccess,
} from './dispatchers';
import {getSingleProductUsingId} from '../../../database/Products/controller'
import {getAllPriceBookData} from "../../../database/PriceBook";

export const getOneProduct = (payload) => {
    return (dispatch) => {
        return getSingleProductUsingId(payload).then(oneProduct => {
            dispatch(fetchProductSuccess(oneProduct));
            return oneProduct;
        });
    };
};

export const getPriceBookData = (payload) => {
    return (dispatch) => {
        return loadPriceBookDataRequest(payload).then(price_book => {
            dispatch(loadPriceBookDataSuccess(price_book));
            return price_book;
        });
    };
};

export const getPriceBookDataFromRealm = () => {
    return (dispatch) => {
        return getAllPriceBookData().then(price_book_db => {
            dispatch(getPriceBookFromRealmSuccess(price_book_db));
            return price_book_db;
        });
    };
};

export const getExpenseTypeData = (payload) => {
    return (dispatch) => {
        return loadExpenseTypeRequest(payload).then(expense_type => {
            dispatch(loadExpenseTypeSuccess(expense_type));
            return expense_type;
        });
    };
};