import * as types from './types';

export const loadCustomersSuccess = (customers) => {
    return {
        type: types.LOAD_CUSTOMERS_SUCCESS,
        customers
    };
};

export const loadAllCustomersSuccess = (customers) => {
    return {
        type: types.LOAD_ALL_CUSTOMERS_SUCCESS,
        customers
    };
};

export const fetchCustomerSuccess = (customer) => {
    return {
        type: types.FETCH_CUSTOMER_SUCCESS,
        customer
    };
};

export const loadNewCustomersSuccess = (newCustomer) => {
    return {
        type: types.POST_NEW_CUSTOMERS_SUCCESS,
        newCustomer
    };
};

export const patchCustomersSuccess = (updatedCustomer) => {
    return {
        type: types.PATCH_CUSTOMERS_SUCCESS,
        updatedCustomer
    };
};

export const fetchCustomerOrderSuccess = (customerOrder) => {
    return {
        type: types.FETCH_CUSTOMER_ORDER_SUCCESS,
        customerOrder
    };
};

export const fetchCustomerInvoiceSuccess = (customerInvoice) => {
    return {
        type: types.FETCH_CUSTOMER_INVOICE_SUCCESS,
        customerInvoice
    };
};

export const fetchCustomerPaymentSuccess = (customerPayment) => {
    return {
        type: types.FETCH_CUSTOMER_PAYMENT_SUCCESS,
        customerPayment
    };
};

export const fetchCustomerProductSuccess = (customerProducts) => {
    return {
        type: types.FETCH_CUSTOMER_PRODUCT_SUCCESS,
        customerProducts
    };
};

export const getReturnProductFromDbSuccess = (returnProducts) => {
    return {
        type: types.GET_RETURN_PRODUCT_SUCCESS,
        returnProducts
    };
};

export const getProductRateSuccess = (returnRate) => {
    return {
        type: types.GET_RETURN_PRODUCT_RATE_SUCCESS,
        returnRate
    };
};

export const loadNewContactPersonSuccess = (newContactPerson) => {
    return {
        type: types.POST_NEW_CONTACT_PERSON_SUCCESS,
        newContactPerson
    };
};

export const patchContactPersonSuccess = (updatedContactPerson) => {
    return {
        type: types.PATCH_CONTACT_PERSON_SUCCESS,
        updatedContactPerson
    };
};

export const deleteContactPersonSuccess = (deletedContactPerson) => {
    return {
        type: types.DELETE_CONTACT_PERSON_SUCCESS,
        deletedContactPerson
    };
};

export const loadNewNotVisitReasonSuccess = (newReason) => {
    return {
        type: types.POST_NEW_NOT_VISIT_REASON_SUCCESS,
        newReason
    };
};

export const loadNotVisitReasonRealmSuccess = (reason) => {
    return {
        type: types.GET_NOT_VISIT_REASON_SUCCESS,
        reason
    };
};