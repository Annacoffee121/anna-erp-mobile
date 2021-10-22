import defaultDropdowns from './default';
import * as types from '../../actions/dropdown/types';

export default dropdowns = (state = defaultDropdowns, action) => {
    switch (action.type) {
        default:
            return state;
        case types.LOAD_SALUTATION_SUCCESS:
            return {
                ...state,
                salutations: action.salutation
            };
        case types.LOAD_COUNTRY_SUCCESS:
            return {
                ...state,
                country: action.country
            };
        case types.LOAD_ROUTE_SUCCESS:
            return {
                ...state,
                route: action.route
            };
        case types.FETCH_ROUTE_LOCATION_SUCCESS:
            return {
                ...state,
                routeLocation: action.routeLocation
            };
        case types.LOAD_BUSINESS_TYPE_SUCCESS:
            return {
                ...state,
                businessType: action.businessType
            };
        case types.LOAD_CUSTOMER_SUCCESS:
            return {
                ...state,
                customer: action.customer
            };
        case types.LOAD_SALES_REP_SUCCESS:
            return {
                ...state,
                salesRep: action.salesRep
            };
        case types.LOAD_PRICE_BOOK_SUCCESS:
            return {
                ...state,
                priceBook: action.priceBook
            };
        case types.LOAD_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case types.LOAD_STORE_SUCCESS:
            return {
                ...state,
                store: action.store
            };
        case types.LOAD_UNIT_TYPE_SUCCESS:
            return {
                ...state,
                unitType: action.unitType
            };
        case types.LOAD_DEPOSITED_TO_SUCCESS:
            return {
                ...state,
                depositedTo: action.depositedTo
            };
        case types.LOAD_BANK_SUCCESS:
            return {
                ...state,
                bank: action.bank
            };
            break;
    }
};