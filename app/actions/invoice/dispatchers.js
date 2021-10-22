import * as types from './types';

export const loadWebInvoiceSuccess = (invoices) => {
    return {
        type: types.LOAD_WEB_INVOICE_SUCCESS,
        invoices
    };
};


export const gotMeta = (meta) => {
    return {
        type: types.GOT_META,
        meta
    };
};

export const loadInvoiceSuccess = (invoices) => {
    return {
        type: types.LOAD_INVOICE_SUCCESS,
        invoices
    };
};

export const loadNewInvoiceSuccess = (newInvoice) => {
    return {
        type: types.POST_NEW_INVOICE_SUCCESS,
        newInvoice
    };
};

export const fetchInvoiceSuccess = (invoice) => {
    return {
        type: types.FETCH_INVOICE_SUCCESS,
        invoice
    };
};
export const patchInvoiceSuccess = (updatedInvoice) => {
    return {
        type: types.PATCH_INVOICE_SUCCESS,
        updatedInvoice
    };
};

//Payments
export const loadWebPaymentSuccess = (webPayments) => {
    return {
        type: types.LOAD_WEB_PAYMENT_SUCCESS,
        webPayments
    };
};

export const loadNewPaymentSuccess = (newPayment) => {
    return {
        type: types.POST_NEW_PAYMENT_SUCCESS,
        newPayment
    };
};

export const storeNewPaymentSuccess = (db_payment) => {
    return {
        type: types.STORE_NEW_PAYMENT_SUCCESS,
        db_payment
    };
};

export const fetchPaymentSuccess = (payment) => {
    return {
        type: types.FETCH_PAYMENT_SUCCESS,
        payment
    };
};

export const fetchPaymentForCustomerSuccess = (payments) => {
    return {
        type: types.FETCH_PAYMENT_FOR_CUSTOMER_SUCCESS,
        payments
    };
};

export const patchPaymentSuccess = (updatedPayment) => {
    return {
        type: types.PATCH_PAYMENT_SUCCESS,
        updatedPayment
    };
};

export const deletePaymentSuccess = (deletedPayment) => {
    return {
        type: types.DELETE_PAYMENT_SUCCESS,
        deletedPayment
    };
};

export const patchOrderStatusSuccess = (updatedStatus) => {
    return {
        type: types.PATCH_ORDER_STATUS_SUCCESS,
        updatedStatus
    };
};