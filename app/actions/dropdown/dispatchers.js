import * as types from './types';

export const loadSalutationSuccess = (salutation) => {
    return {
        type: types.LOAD_SALUTATION_SUCCESS,
        salutation
    };
};

export const loadCountrySuccess = (country) => {
    return {
        type: types.LOAD_COUNTRY_SUCCESS,
        country
    };
};

export const loadRouteSuccess = (route) => {
    return {
        type: types.LOAD_ROUTE_SUCCESS,
        route
    };
};

export const fetchRouteLocationSuccess = (routeLocation) => {
    return {
        type: types.FETCH_ROUTE_LOCATION_SUCCESS,
        routeLocation
    };
};

export const loadWebBusinessTypeSuccess = (businessType) => {
    return {
        type: types.LOAD_WEB_BUSINESS_TYPE_SUCCESS,
        businessType
    };
};

export const loadBusinessTypeSuccess = (businessType) => {
    return {
        type: types.LOAD_BUSINESS_TYPE_SUCCESS,
        businessType
    };
};

export const loadCustomerSuccess = (customer) => {
    return {
        type: types.LOAD_CUSTOMER_SUCCESS,
        customer
    };
};

export const loadSalesRepSuccess = (salesRep) => {
    return {
        type: types.LOAD_SALES_REP_SUCCESS,
        salesRep
    };
};

export const loadPriceBookSuccess = (priceBook) => {
    return {
        type: types.LOAD_PRICE_BOOK_SUCCESS,
        priceBook
    };
};

export const loadProductsSuccess = (products) => {
    return {
        type: types.LOAD_PRODUCT_SUCCESS,
        products
    };
};

export const loadChangeActualStockSuccess = (aStock) => {
    return {
        type: types.LOAD_ACTUAL_STOCK_SUCCESS,
        aStock
    };
};

export const loadStoreSuccess = (store) => {
    return {
        type: types.LOAD_STORE_SUCCESS,
        store
    };
};

export const loadUnitTypeWebSuccess = (unitType) => {
    return {
        type: types.LOAD_UNIT_TYPE_WEB_SUCCESS,
        unitType
    };
};

export const loadUnitTypeSuccess = (unitType) => {
    return {
        type: types.LOAD_UNIT_TYPE_SUCCESS,
        unitType
    };
};

export const loadDepositedToWebSuccess = (depositedTo) => {
    return {
        type: types.LOAD_DEPOSITED_TO_WEB_SUCCESS,
        depositedTo
    };
};

export const loadDepositedToSuccess = (depositedTo) => {
    return {
        type: types.LOAD_DEPOSITED_TO_SUCCESS,
        depositedTo
    };
};

export const loadBankWebSuccess = (bank) => {
    return {
        type: types.LOAD_BANK_WEB_SUCCESS,
        bank
    };
};

export const loadBankSuccess = (bank) => {
    return {
        type: types.LOAD_BANK_SUCCESS,
        bank
    };
};