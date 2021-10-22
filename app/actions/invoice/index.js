import {
    postNewInvoice,
    loadInvoiceRequest,
    postNewPayment,
    patchPayment,
    deletePayment,
    patchInvoice,
    patchOrderStatus,
    getMeta,
    loadPaymentRequest,
} from '../../services/invoice/index';

import {
    loadNewInvoiceSuccess,
    loadInvoiceSuccess,
    fetchInvoiceSuccess,
    loadNewPaymentSuccess,
    fetchPaymentSuccess,
    patchPaymentSuccess,
    deletePaymentSuccess,
    patchInvoiceSuccess,
    patchOrderStatusSuccess,
    loadWebInvoiceSuccess,
    gotMeta,
    fetchPaymentForCustomerSuccess,
    loadWebPaymentSuccess, storeNewPaymentSuccess,
} from './dispatchers';
import {getAllInvoiceData, getSingleInvoiceData} from "../../../database/Invoice/controller";
import {getPaymentByCustomerId, getSinglePaymentData, insertPaymentData} from "../../../database/Payment/controller";

export const getInvoices = (payload) => {
    return (dispatch) => {
        return loadInvoiceRequest(payload).then(invoices => {
            dispatch(loadWebInvoiceSuccess(invoices));
            return invoices;
        });
    };
};

export const getMetaDataProcess = (payload) => {
    return (dispatch) => {
        return getMeta(payload).then(meta => {
            dispatch(gotMeta(meta));
            return meta;
        });
    };
};

export const getInvoicesFromRealm = (payload) => {
    return (dispatch) => {
        return getAllInvoiceData(payload).then(invoices => {
            dispatch(loadInvoiceSuccess(invoices));
            return invoices;
        });
    };
};

export const setNewInvoice = (payload, salesOrderId) => {
    return (dispatch) => {
        return postNewInvoice(payload, salesOrderId).then(newInvoice => {
            dispatch(loadNewInvoiceSuccess(newInvoice));
            return newInvoice;
        });
    };
};

export const getInvoice = (payload) => {
    return (dispatch) => {
        return getSingleInvoiceData(payload).then(invoice => {
            dispatch(fetchInvoiceSuccess(invoice));
            return invoice;
        });
    };
};

// Payments
export const getPayments = (payload) => {
    return (dispatch) => {
        return loadPaymentRequest(payload).then(payments => {
            dispatch(loadWebPaymentSuccess(payments));
            return payments;
        });
    };
};

export const updateInvoice = (id, payload) => {
    return (dispatch) => {
        return patchInvoice(id, payload).then(patchInvoice => {
            dispatch(patchInvoiceSuccess(patchInvoice));
            return patchInvoice;
        });
    };
};

export const setNewPayment = (payload, invoiceId) => {
    return (dispatch) => {
        return postNewPayment(payload, invoiceId).then(newPayment => {
            dispatch(loadNewPaymentSuccess(newPayment));
            return newPayment;
        });
    };
};

export const setNewPaymentInDB = (payload) => {
    return (dispatch) => {
        return insertPaymentData(payload).then(db_payment => {
            dispatch(storeNewPaymentSuccess(db_payment));
            return db_payment;
        });
    };
};

export const getPaymentFromRealm = (payload) => {
    return (dispatch) => {
        return getSinglePaymentData(payload).then(payment => {
            dispatch(fetchPaymentSuccess(payment));
            return payment;
        });
    };
};

export const updatePayment = (id, payload) => {
    return (dispatch) => {
        return patchPayment(id, payload).then(patchPayment => {
            dispatch(patchPaymentSuccess(patchPayment));
            return patchPayment;
        });
    };
};

export const removePayment = (id) => {
    return (dispatch) => {
        return deletePayment(id).then(deletePayment => {
            dispatch(deletePaymentSuccess(deletePayment));
            return deletePayment;
        });
    };
};

export const updateOrderStatus = (id, payload) => {
    return (dispatch) => {
        return patchOrderStatus(id, payload).then(patchStatus => {
            dispatch(patchOrderStatusSuccess(patchStatus));
            return patchStatus;
        });
    };
};

export const getPaymentForCustomer = (payload) => {
    return (dispatch) => {
        return getPaymentByCustomerId(payload).then(payments => {
            dispatch(fetchPaymentForCustomerSuccess(payments));
            return payments;
        });
    };
};