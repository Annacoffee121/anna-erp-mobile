import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";

const contactRoute = apiRoute('sales/handover');
const routesRoute = apiRoute('search/route/');
const routeCustomerRoute = apiRoute('setting/route/');
const postRoute = apiRoute('setting/route/pick-next');
const nextDayRoute = apiRoute('setting/route/next-day-route');
const expensesRoute = apiRoute('sales/expense');

export const loadHandoverRequest = (payload) => {
    return client.get(contactRoute)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return data;
            });
        });
};

export const postHandover = (payload) => {
    return client.post(contactRoute, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const loadNextDayRouteRequest = (payload) => {
    return client.get(nextDayRoute, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const loadRoutsRequest = (payload) => {
    return client.get(`${routesRoute}${payload}`)
        .then(response => {
            return response.json().then((data) => {
                return data;
            });
        });
};

export const loadRouteCustomersRequest = (payload) => {
    return client.get(`${routeCustomerRoute}${payload}`)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const postTomorrowRoute = (payload) => {
    return client.post(postRoute, payload)
        .then(response => {
            return response.json().then((data) => {
                return data;
            });
        });
};


// Expenses Actions
export const postExpenses = (payload) => {
    return client.post(expensesRoute, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const getExpenses = () => {
    let route = expensesRoute + '/for-today';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const deleteExpenseFromServer = (expense_id) => {
    let route = expensesRoute + '/' + expense_id;
    return client.delete(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};