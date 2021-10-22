import * as types from './types';

export const loadOrdersWebSuccess = (orders) => {
    return {
        type: types.LOAD_ORDERS_WEB_SUCCESS,
        orders
    };
};

export const loadOrdersSuccess = (orders) => {
    return {
        type: types.LOAD_ORDERS_SUCCESS,
        orders
    };
};

export const loadNewOrderSuccess = (newOrder) => {
    return {
        type: types.POST_NEW_ORDER_SUCCESS,
        newOrder
    };
};

export const loadSyncQueuesStatus = (status) => {
    return {
        type: types.SYNC_STATUS_SUCCESS,
        status
    };
};

export const patchOrderSuccess = (updatedInvoice) => {
    return {
        type: types.PATCH_ORDER_SUCCESS,
        updatedInvoice
    };
};

export const fetchOrderSuccess = (order) => {
    return {
        type: types.FETCH_ORDER_SUCCESS,
        order
    };
};

export const getOrderSuccess = (orderPrint) => {
    return {
        type: types.GET_ORDER_SUCCESS,
        orderPrint
    };
};

export const orderAdd = (offlineOrder) => {
    return {
        type: types.OFFLINE_ORDER_ADD,
        offlineOrder
    };
};