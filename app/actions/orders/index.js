import {
    loadOrdersRequest,
    postNewOrder,
    fetchOrderRequest,
    patchOrder,
} from '../../services/order/index';

import {
    loadOrdersSuccess,
    loadNewOrderSuccess,
    fetchOrderSuccess,
    orderAdd,
    patchOrderSuccess,
    loadOrdersWebSuccess, getOrderSuccess, loadSyncQueuesStatus,
} from './dispatchers';
import {getAllOrderData, getSingleOrderData} from '../../../database/Order/controller'
import {getOrderData} from "../../services/order";

const offlineStatus = 'Offline';

export const getOrders = (payload) => {
    return (dispatch) => {
        return loadOrdersRequest(payload).then(orders => {
            dispatch(loadOrdersWebSuccess(orders));
            return orders;
        });
    };
};

export const getOrdersFromRealm = (payload) => {
    return (dispatch) => {
        return getAllOrderData(payload).then(orders => {
            dispatch(loadOrdersSuccess(orders));
            return orders;
        });
    };
};

export const setNewOrder = (payload) => {
    return (dispatch) => {
        return postNewOrder(payload).then(newOrder => {
            dispatch(loadNewOrderSuccess(newOrder));
            return newOrder;
        });
    };
};

export const updateOrder = (id, payload) => {
    return (dispatch) => {
        return patchOrder(id, payload).then(patchOrder => {
            dispatch(patchOrderSuccess(patchOrder));
            return patchOrder;
        });
    };
};

export const getOrder = (payload) => {
    return (dispatch) => {
        return getSingleOrderData(payload).then(order => {
            dispatch(fetchOrderSuccess(order));
            return order;
        });
    };
};

export const getOrderPrint = (payload) => {
    return (dispatch) => {
        return getOrderData(payload).then(order => {
            dispatch(getOrderSuccess(order));
            return order;
        });
    };
};

export const orderToQueue = (order) => {
    return (dispatch) => {
        order.online_status = offlineStatus;
        order.fulfil = false;

        dispatch(orderAdd(order));
    };
};

export const handelOrderQueues = (orders) => {
    return (dispatch) => {
        let queueOrders = orders.filter(order => order.online_status === offlineStatus && order.fulfil === false);

        queueOrders.forEach(order => {
            return postNewOrder(order).then(newOrder => {
                dispatch(loadNewOrderSuccess(newOrder));
                return newOrder;
            });
        });
    };
};

export const handelAutoSyncStatus = (status) => {
    return (dispatch) => {
        dispatch(loadSyncQueuesStatus(status));
        return status;
    };
};