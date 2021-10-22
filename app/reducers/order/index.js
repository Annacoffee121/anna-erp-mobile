import defaultOrders from './default';
import * as types from '../../actions/orders/types';
import {findIndex} from '../../helpers/collection';

export default orders = (state = defaultOrders, action) => {
    switch (action.type) {
        default:
            return state;
        case types.LOAD_ORDERS_SUCCESS:
            return {
                ...state,
                all: action.orders
            };
        case types.POST_NEW_ORDER_SUCCESS:
            state.all.push(action.newOrder);
            return {
                ...state,
                all: state.all
            };
        case types.SYNC_STATUS_SUCCESS:
            return {
                ...state,
                status: action.status
            };
        case types.FETCH_ORDER_SUCCESS:
            return {
                ...state,
                order: action.order
            };
        case types.GET_ORDER_SUCCESS:
            return {
                ...state,
                orderPrint: action.orderPrint
            };
        case types.OFFLINE_ORDER_ADD:
            state.all.push(action.offlineOrder);
            return {
                ...state,
                all: state.all,
            };
            break;
    }
};