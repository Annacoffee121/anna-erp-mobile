import Config from 'react-native-config';
import Client from '../services/api/client';

export const baseRoute = Config.API_ENDPOINT;
export const accessTokenName = 'access_token';
export const client = new Client(baseRoute);
client.addHeader('Accept', 'application/json');
client.addHeader('Content-Type', 'application/json');
client.enableAuthentication(accessTokenName);