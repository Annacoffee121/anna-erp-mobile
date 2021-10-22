import defaultSettings from './default';
import * as types from '../../actions/settings/types';

export default Settings = (state = defaultSettings, action) => {
    switch (action.type) {
        default:
            return state;
        case types.FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                productDetails: action.oneProductDetails
            };
        case types.LOAD_PRICE_BOOK_DATA_SUCCESS:
            return {
                ...state,
                priceBookData: action.priceBookData
            };
        case types.GET_PRICE_BOOK_FROM_REALM_SUCCESS:
            return {
                ...state,
                realmPriceBook: action.realmPriceBook
            };
            break;
    }
};