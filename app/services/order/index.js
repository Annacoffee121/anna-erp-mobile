import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
import {transformOrders} from "../../helpers/orders";

const contactRoute = apiRoute('sales/orders');
const returnRoute = apiRoute('sales/return');

export const loadOrdersRequest = (payload) => {
    let route = contactRoute + '/for-today';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return transformOrders(data);
            });
        });
};

export const getOrderData = (payload) => {
    let route = contactRoute + '/' + payload;
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return data;
            });
        });
};

export const postNewOrder = (payload) => {
    return client.post(contactRoute, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchOrder = (invoiceId, payload) => {
    let route = contactRoute + '/' + invoiceId;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const fetchOrderRequest = (orderId) => {
    let route = contactRoute + '/' + orderId;
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                // return transformSingleCustomers(data);
                return data;
            });
        });
};

export const fetchPrintStatusRequest = (orderId, payload) => {
    let route = contactRoute + '/' + orderId + '/is-printed';
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const fetchReturnPrintStatusRequest = (returnId, payload) => {
    let route = returnRoute + '/is-printed/' + returnId;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const postNewSalesReturn = (customerId, payload) => {
    let route = returnRoute + '/' + customerId;
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};