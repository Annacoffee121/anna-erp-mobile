import defaultContacts from './default';
import * as types from '../../actions/customer/types';

export default contacts = (state = defaultContacts, action) => {
    switch (action.type) {
        default:
            return state;
        case types.LOAD_CUSTOMERS_SUCCESS:
            return {
                ...state,
                all: action.customers
            };
        case types.FETCH_CUSTOMER_SUCCESS:
            return {
                ...state,
                item: action.customer
            };
        case types.FETCH_CUSTOMER_ORDER_SUCCESS:
            return {
                ...state,
                customerOrder: action.customerOrder
            };
        case types.FETCH_CUSTOMER_INVOICE_SUCCESS:
            return {
                ...state,
                customerInvoice: action.customerInvoice
            };
        case types.FETCH_CUSTOMER_PAYMENT_SUCCESS:
            return {
                ...state,
                customerPayment: action.customerPayment
            };
        case types.FETCH_CUSTOMER_PRODUCT_SUCCESS:
            return {
                ...state,
                customerProducts: action.customerProducts
            };
        case types.GET_RETURN_PRODUCT_SUCCESS:
            return {
                ...state,
                returnProducts: action.returnProducts
            };
            break;
    }
};