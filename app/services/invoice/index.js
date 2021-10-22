import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
import {transformInvoices, transformPayments} from "../../helpers/invoices";

const salesRoute = apiRoute('sales/invoices');
const paymentRoute = apiRoute('sales/payments');
const orderRoute = apiRoute('sales/orders');
const metaRoute = apiRoute('mata');

export const loadInvoiceRequest = (payload) => {
    let route = salesRoute + '/for-today';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return transformInvoices(data);
            });
        });
};


export const getMeta = () => {
    return client.get(metaRoute)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const postNewInvoice = (payload, salesOrderId) => {
    let route = salesRoute + '/' + salesOrderId;
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

// export const fetchInvoiceRequest = (invoiceId) => {
//     let route = salesRoute + '/' + invoiceId;
//     return client.get(route)
//         .then(response => {
//             return response.json().then(({data}) => {
//                 return data;
//             });
//         });
// };

export const patchInvoice = (invoiceId, payload) => {
    let route = salesRoute + '/' + invoiceId;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchOrderStatus = (orderId, payload) => {
    let route = orderRoute + '/' + orderId + '/update-status';
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

// Payments
export const loadPaymentRequest = (payload) => {
    let route = paymentRoute + '/for-today';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return transformPayments(data);
            });
        });
};

export const postNewPayment = (payload, invoiceId) => {
    let route = paymentRoute + '/' + invoiceId;
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchPayment = (paymentId, payload) => {
    let route = paymentRoute + '/' + paymentId;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const deletePayment = (paymentId) => {
    let route = paymentRoute + '/' + paymentId;
    return client.delete(route)
        .then(response => {
            return response.json().then((value) => {
                return value;
            });
        });
};