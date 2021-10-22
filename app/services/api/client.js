import * as _ from 'lodash';
import Storage from '../../services/system/storage';

export const storage = new Storage;
import GeoLocations from '../../services/system/geo-location'

export default class Client {
    headers = {
        'Accept': 'application/json'
    };
    baseRoute;

    authentication = {
        enable: false,
        name: null,
        type: 'Bearer',
        token: null,
    };

    constructor(baseRoute) {
        this.baseRoute = baseRoute;
    }

    enableAuthentication(name, type = null, token = null) {
        this.authentication.enable = true;

        this.authentication.name = name;
        if (type) this.authentication.type = type;
        if (token) this.authentication.token = token;
    }

    addHeader(key, value) {
        this.headers[key] = value;
    }

    hasHeader(key) {
        return !!this.headers[key];
    }

    deleteHeader(key) {
        delete this.headers[key];
    }

    get(route) {
        return this.fetch('GET', route);
    }

    post(route, payload) {
        return this.fetch('POST', route, payload);
    }

    put(route, payload) {
        return this.fetch('PUT', route, payload);
    }

    patch(route, payload) {
        return this.fetch('PATCH', route, payload);
    }

    delete(route) {
        return this.fetch('DELETE', route);
    }

    fetch(method, route, body = {}) {
        return new Promise((resolve, reject) => {
            this.checkGeoLocation().then((position) => {
                this.addGeoLocationHeader(position);
            }).catch(errors => {
                // console.log('errors', errors);
            }).done(() => {
                this.handelFetchWithGeoLocation(method, route, body).then(response => {
                    resolve(response);
                    return response;
                }).catch(errors => {
                    reject(errors);
                    return errors;
                });
            });
        });
    }

    handelFetchWithGeoLocation(method, route, body = {}) {
        return new Promise((resolve, reject) => {
            this.checkAuthentication().then(token => {
                if (token) this.addAuthenticationHeader(token);

                this.fetchHandel(method, route, body).then(response => {
                    if (!response.ok) throw response;
                    resolve(response);
                    return response;
                }).catch(exception => {
                    reject(exception);
                    return exception;
                });
            }).catch(errors => {
                reject(errors);
                return errors;
            });
        });
    }

    fetchHandel(method, route, body) {
        return fetch(this.generateRoute(route), this.generateOptions(method, body));
    }

    checkAuthentication() {
        return new Promise((resolve, reject) => {
            if (!this.authentication.enable) resolve();
            storage.get('auth').then(response => {
                let token = _.get(response, 'oauth.' + this.authentication.name);
                if (!token) token = null;

                resolve(token);
                return token;
            }).catch(exception => {
                reject(exception);
                return exception;
            });
        });
    }

    addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            this.addHeader('Geo-Latitude', position.coords.latitude);
            this.addHeader('Geo-Longitude', position.coords.longitude);
            this.addHeader('Geo-Accuracy', position.coords.accuracy);
            this.addHeader('Geo-Altitude', position.coords.altitude);
        }
    }

    checkGeoLocation() {
        return GeoLocations.get();
    }

    addAuthenticationHeader(token) {
        this.addHeader('Authorization', this.authentication.type + ' ' + token);
    }

    generateOptions(method, body) {
        let bodyNotAllowedMethods = ['GET', 'HEAD'];
        let commonOptions = {
            mode: 'cros',
            headers: this.headers,
        };

        if (bodyNotAllowedMethods.indexOf(method) >= 0) {
            return {
                method,
                ...commonOptions
            }
        }
        return {
            method,
            ...commonOptions,
            body: this.generateBody(body),
        }
    }

    generateRoute(route) {
        return this.baseRoute + '/' + route;
    }

    generateBody(body) {
        return JSON.stringify(body);
    }
};