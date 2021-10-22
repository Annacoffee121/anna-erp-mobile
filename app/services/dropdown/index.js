import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
const contactRoute = apiRoute('search/');

export const loadSalutationRequest = (payload) => {
    return client.get(contactRoute + 'salutation')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadCountryRequest = (payload) => {
    return client.get(contactRoute + 'country')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadRouteRequest = (payload) => {
    return client.get(contactRoute + 'route')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const fetchRouteLocationRequest = (routeId) => {
    let route = contactRoute + 'route-location' + '/' + routeId;
    return client.get(route)
        .then(response => {
            return response.json().then(({results}) => {
                return results
            });
        });
};

export const loadBusinessTypeRequest = (payload) => {
    return client.get(contactRoute + 'business-type')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadCustomersRequest = (payload) => {
    return client.get(contactRoute + 'customer')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadSalesRepRequest = (payload) => {
    return client.get(contactRoute + 'rep')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadPriceBookRequest = (payload) => {
    return client.get(contactRoute + 'price-book')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadProductsRequest = (payload) => {
    return client.get(contactRoute + 'product')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadStoreRequest = (payload) => {
    return client.get(contactRoute + 'store')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};


export const loadUnitTypeRequest = (payload) => {
    return client.get(contactRoute + 'unit-type')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadDepositedToRequest = (payload) => {
    return client.get(contactRoute + 'deposited-to')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};

export const loadBankRequest = (payload) => {
    return client.get(contactRoute + 'bank')
        .then(response => {
            return response.json().then(({results}) => {
                if(payload) return results;
                return results
            });
        });
};