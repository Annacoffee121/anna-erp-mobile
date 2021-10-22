import defaultInvoices from './default';
import * as types from '../../actions/invoice/types';
import {find} from "../../helpers/collection";

export default orders = (state = defaultInvoices, action) => {
    switch (action.type) {
        default:
            return state;
        case types.LOAD_INVOICE_SUCCESS:
            return {
                ...state,
                all: action.invoices
            };
        case types.FETCH_INVOICE_SUCCESS:
            return {
                ...state,
                invoice: action.invoice
            };
        case types.FETCH_PAYMENT_SUCCESS:
            return {
                ...state,
                payment: action.payment
            };
        case types.FETCH_PAYMENT_FOR_CUSTOMER_SUCCESS:
            return {
                ...state,
                payments: action.payments
            };
            break;
    }
};