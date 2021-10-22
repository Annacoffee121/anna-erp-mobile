import * as types from './types';

export const fetchProductSuccess = (oneProductDetails) => {
    return {
        type: types.FETCH_PRODUCT_SUCCESS,
        oneProductDetails
    };
};

export const loadPriceBookDataSuccess = (priceBookData) => {
    return {
        type: types.LOAD_PRICE_BOOK_DATA_SUCCESS,
        priceBookData
    };
};

export const getPriceBookFromRealmSuccess = (realmPriceBook) => {
    return {
        type: types.GET_PRICE_BOOK_FROM_REALM_SUCCESS,
        realmPriceBook
    };
};

export const loadExpenseTypeSuccess = (expenseType) => {
    return {
        type: types.LOAD_EXPENSE_TYPE_SUCCESS,
        expenseType
    };
};