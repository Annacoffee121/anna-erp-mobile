import {getNotSyncData as notSyncOrders} from "../services/sync/order";
import {getNotSyncData as notSyncInvoices} from "../services/sync/invoice";
import {getNotSyncData as notSyncPayments} from "../services/sync/payment";
import {getNotSyncData as notSyncSalesReturn} from "../services/sync/salesReturn";
import {getNotSyncData as notSyncNotVisitReason} from "../services/sync/notVisitReason";

export const handleOfflineDataValidation = () => {
    return validateOrder().then(response => {
        if (!response) {
            return validateInvoice().then(invResponse => {
                if (!invResponse) {
                    return validatePayment().then(payResponse => {
                        if (!payResponse) {
                            return validateSalesReturn().then(salRetResponse => {
                                if (!salRetResponse) {
                                    return validateReason().then(notVisReasonResponse => {
                                        return notVisReasonResponse;
                                    })
                                } else {
                                    return salRetResponse
                                }
                            })
                        } else {
                            return payResponse
                        }
                    })
                } else {
                    return invResponse;
                }
            })
        } else {
            return response;
        }
    });
};

const validateOrder = () => {
    let response;
    return notSyncOrders().then(async orders => {
        if (orders.length) {
            return response = 'There are ' + orders.length + ' orders to sync!'
        }
    });
};

const validateInvoice = () => {
    let response;
    return notSyncInvoices().then(invoices => {
        if (invoices.length) {
            return response = 'There are ' + invoices.length + ' invoices to sync!'
        }
    });
};

const validatePayment = () => {
    let response;
    return notSyncPayments().then(payments => {
        if (payments.length) {
            return response = 'There are ' + payments.length + ' payments to sync!'
        }
    });
};

const validateSalesReturn = () => {
    let response;
    return notSyncSalesReturn().then(salesReturns => {
        if (salesReturns.length) {
            return response = 'There are ' + salesReturns.length + ' sales return to sync!'
        }
    });
};

const validateReason = () => {
    let response;
    return notSyncNotVisitReason().then(notVisReasons => {
        if (notVisReasons.length) {
            return response = 'There are ' + notVisReasons.length + ' not visit reason to sync!'
        }
    });
};