import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
import {transformRoute} from "../../helpers/route";
const dashboardRoute = apiRoute('dashboard');

export const fetchRouteRequest = () => {
    return client.get(dashboardRoute)
        .then(response => {
            return response.json().then(({data}) => {
                return transformRoute(data);
            });
        });
};