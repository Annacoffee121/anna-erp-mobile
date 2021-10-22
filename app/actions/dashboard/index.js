import {
    fetchRouteRequest
} from '../../services/dashboard/index';

import {
    fetchRouteSuccess,
    fetchDBRouteSuccess
} from './dispatchers';
import {getAllDashboardData, updateDashboardCustomerData} from '../../../database/Dashboard/controller';
import {getAllCallOutData} from "../../services/dashboard/updateCallout";
import {transformCalloutDashbord} from "../../helpers/route";

export const getRoute = (payload) => {
    return (dispatch) => {
        return fetchRouteRequest(payload).then(routeToDb => {
            dispatch(fetchRouteSuccess(routeToDb));
            return routeToDb;
        });
    };
};

export const getRouteFromRealm = (payload) => {
    return (dispatch) => {
        return getAllDashboardData(payload).then(route => {
            dispatch(fetchDBRouteSuccess(route));
            return route;
        });
    };
};

export const updateDashboardCalloutValue = (customer_id) => {
    return getAllCallOutData(customer_id).then(result => {
        //Update Dashboard customer Outstanding
        let transformedData = transformCalloutDashbord(result);
        return updateDashboardCustomerData(transformedData).then(value => {
            return value;
        }).catch((error) => {
            console.log(error, 'error')
        });
    });
};