import * as _ from 'lodash';
import {AsyncStorage} from 'react-native';

export default class Storage {
    baseName;

    constructor(baseName = null) {
        this.baseName = baseName;
    }

    get(key) {
        return AsyncStorage.getItem(this.prefix(key)).then(response => {
            return this.transformValueToObject(response);
        });
    }

    set(key, value) {
        return AsyncStorage.setItem(
            this.prefix(key),
            this.transformValueToString(value)
        );
    }

    remove(key) {
        return AsyncStorage.removeItem(this.prefix(key), value);
    }

    getKeys() {
        return AsyncStorage.getAllKeys();
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.getKeys().then(keys => {
                AsyncStorage.multiGet(keys).then(stores => {
                    let responses = {};
                    stores.forEach(store => {
                        _.set(responses, store[0], this.transformValueToObject(store[1]));
                    });

                    resolve(responses);
                    return responses;
                }).catch(errors => {
                    reject(errors);
                    return errors;
                });
            });
        });
    }

    removeAll() {
        return new Promise((resolve, reject) => {
            this.getKeys().then(keys => {
                AsyncStorage.multiRemove(keys).then(() => {
                    resolve(keys);
                    return keys;
                }).catch(errors => {
                    reject(errors);
                    return errors;
                });
            });
        });
    }

    multiGet(keys) {
        return AsyncStorage.multiRemove(keys).then(stores => {
            let responses = {};
            stores.forEach(store => {
                _.set(responses, store[0], this.transformValueToObject(store[1]));
            });
            return responses;
        });
    }

    multiSet(objects) {
        let stores = [];
        let keys = _.keys(objects);
        keys.forEach(key => {
            stores.push([
                key,
                this.transformValueToString(objects[key])
            ]);
        });

        return AsyncStorage.multiSet(stores);
    }

    multiRemove(keys) {
        return AsyncStorage.multiRemove(keys);
    }

    prefix(key) {
        if (!this.baseName) return key;
        return this.baseName + '.' + key;
    }

    transformValueToString(value) {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    }

    transformValueToObject(value) {
        if (!value) return {};
        return JSON.parse(value);
    }
}