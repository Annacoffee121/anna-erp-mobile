import {client} from '../../config/api';
import {oauthClient} from '../../config/auth';
import {authRoute, apiRoute} from '../../helpers/api';

const oauthRoute = authRoute('oauth/token');
const dateRoute = apiRoute('date');
const faceUnlockRoute = apiRoute('tfa/verify');

export const login = (payload) => {
    return client.post(oauthRoute, {
        ...payload,
        ...oauthClient,
    }).then(response => response.json());
};

export const faceLogin = (payload) => {
    return client.post(faceUnlockRoute, payload)
        .then(response => {
            return response.json().then(data => {
                return data;
            });
        });
};

export const getDate = () => {
    return client.get(dateRoute)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};