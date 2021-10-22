import {
    loadSalutationRequest,
    loadCountryRequest,
    loadRouteRequest,
    fetchRouteLocationRequest,
    loadBusinessTypeRequest,
    loadPriceBookRequest,
    loadProductsRequest,
    loadStoreRequest,
    loadUnitTypeRequest,
    loadDepositedToRequest,
    loadBankRequest,
} from '../../services/dropdown/index';

import {
    loadSalutationSuccess,
    loadCountrySuccess,
    loadRouteSuccess,
    fetchRouteLocationSuccess,
    loadBusinessTypeSuccess,
    loadCustomerSuccess,
    loadPriceBookSuccess,
    loadProductsSuccess,
    loadStoreSuccess,
    loadUnitTypeSuccess,
    loadDepositedToSuccess,
    loadDepositedToWebSuccess,
    loadBankSuccess,
    loadWebBusinessTypeSuccess,
    loadUnitTypeWebSuccess,
    loadBankWebSuccess, loadChangeActualStockSuccess,
} from './dispatchers';
import {getAllBusinessType, getAllUnitType, getAllDepositedTo, getAllBank} from '../../../database/DropDown/controller'
import {getCustomerListForDropDown} from '../../../database/Customer/controller'
import {getAllProducts, updateActualStock} from '../../../database/Products/controller'

export const getSalutation = (payload) => {
    return (dispatch) => {
        return loadSalutationRequest(payload).then(salutation => {
            dispatch(loadSalutationSuccess(salutation));
            return salutation;
        });
    };
};

export const getCountry = (payload) => {
    return (dispatch) => {
        return loadCountryRequest(payload).then(country => {
            dispatch(loadCountrySuccess(country));
            return country;
        });
    };
};

export const getRoute = (payload) => {
    return (dispatch) => {
        return loadRouteRequest(payload).then(route => {
            dispatch(loadRouteSuccess(route));
            return route;
        });
    };
};


export const getRouteLocation = (payload) => {
    return (dispatch) => {
        return fetchRouteLocationRequest(payload).then(routeLocation => {
            dispatch(fetchRouteLocationSuccess(routeLocation));
            return routeLocation;
        });
    };
};

export const getBusinessType = (payload) => {
    return (dispatch) => {
        return loadBusinessTypeRequest(payload).then(businessType => {
            dispatch(loadWebBusinessTypeSuccess(businessType));
            return businessType;
        });
    };
};

export const getBusinessTypeFromRealm = (payload) => {
    return (dispatch) => {
        return getAllBusinessType(payload).then(businessType => {
            dispatch(loadBusinessTypeSuccess(businessType));
            return businessType;
        });
    };
};

export const getCustomersFromRealm = (payload) => {
    return (dispatch) => {
        return getCustomerListForDropDown(payload).then(customer => {
            dispatch(loadCustomerSuccess(customer));
            return customer;
        });
    };
};

export const getPriceBook = (payload) => {
    return (dispatch) => {
        return loadPriceBookRequest(payload).then(priceBook => {
            dispatch(loadPriceBookSuccess(priceBook));
            return priceBook;
        });
    };
};

export const getProductsFromRealm = (payload) => {
    return (dispatch) => {
        return getAllProducts(payload).then(products => {
            dispatch(loadProductsSuccess(products));
            return products;
        });
    };
};

export const changeActualStock = (key, data) => {
    return (dispatch) => {
        return updateActualStock(key, data).then(aStock => {
            dispatch(loadChangeActualStockSuccess(aStock));
            return aStock;
        });
    };
};

export const getStore = (payload) => {
    return (dispatch) => {
        return loadStoreRequest(payload).then(store => {
            dispatch(loadStoreSuccess(store));
            return store;
        });
    };
};

export const getUnitType = (payload) => {
    return (dispatch) => {
        return loadUnitTypeRequest(payload).then(unitType => {
            dispatch(loadUnitTypeWebSuccess(unitType));
            return unitType;
        });
    };
};

export const getUnitTypeFromRealm = (payload) => {
    return (dispatch) => {
        return getAllUnitType(payload).then(businessType => {
            dispatch(loadUnitTypeSuccess(businessType));
            return businessType;
        });
    };
};

export const getDepositedTo = (payload) => {
    return (dispatch) => {
        return loadDepositedToRequest(payload).then(depositedTo => {
            dispatch(loadDepositedToWebSuccess(depositedTo));
            return depositedTo;
        });
    };
};

export const getDepositedToFromRealm = (payload) => {
    return (dispatch) => {
        return getAllDepositedTo(payload).then(depositedTo => {
            dispatch(loadDepositedToSuccess(depositedTo));
            return depositedTo;
        });
    };
};

export const getBank = (payload) => {
    return (dispatch) => {
        return loadBankRequest(payload).then(bank => {
            dispatch(loadBankWebSuccess(bank));
            return bank;
        });
    };
};

export const getBankFromRealm = (payload) => {
    return (dispatch) => {
        return getAllBank(payload).then(bank => {
            dispatch(loadBankSuccess(bank));
            return bank;
        });
    };
};