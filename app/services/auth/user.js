import {
    client
} from '../../config/api';

import {
    apiRoute
} from "../../helpers/api";

const taskRoute = apiRoute('user');

export const getUser = () => {
    return client.get(taskRoute)
        .then(response => {
            return response.json().then(user => {
                return user;
            });
        });
};