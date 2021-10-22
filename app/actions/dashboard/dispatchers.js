import * as types from './types';

export const fetchRouteSuccess = (routeToDb) => {
    return {
        type: types.FETCH_ROUTE_SUCCESS,
        routeToDb
    };
};

export const fetchDBRouteSuccess = (route) => {
    return {
        type: types.FETCH_DB_ROUTE_SUCCESS,
        route
    };
};