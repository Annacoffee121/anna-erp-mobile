import {Platform, NetInfo} from 'react-native';
import {client} from '../../config/api';
import {apiRoute, tenantRoute} from "../../helpers/api";
import {transformConfiguration} from "../../helpers/system";

export const getConfigurations = (tenantId) => {
    let route = tenantRoute(tenantId, 'app-config');
    return client.get(route).then(response => {
        return response.json().then(({data}) => {
            return transformConfiguration(data);
        });
    });
};

export const sendFCMToken = (payload) => {
    let route = apiRoute('services/fcm');
    return client.post(route, payload).then(response => {
        return response.json().then(({data}) => {
            return data
        });
    });
};


export const isConnected = () => {
    if (Platform.OS === 'ios') {
        return new Promise(resolve => {
            const handleFirstConnectivityChangeIOS = isConnected => {
                NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
                resolve(isConnected);
            };
            NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
        });
    }

    // return new Promise(resolve => resolve(false));
    return NetInfo.isConnected.fetch();
};