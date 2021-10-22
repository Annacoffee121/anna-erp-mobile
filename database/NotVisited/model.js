import {NOT_VISIT_SCHEMA} from "./index";
import databaseOptions from "../index";
import Realm from "realm";
import {changeHandoverFromRealm} from "../../app/helpers/handover";

export const NotVisitSchema = {
    primaryKey: 'id', //Primary key
    name: NOT_VISIT_SCHEMA,
    properties: {
        id: 'int',
        reason: 'string',
        gps_lat: 'double',
        gps_long: 'double',
        is_visited: 'string?',
        not_sync: 'bool?',
    }
};

export const insertNotVisitReason = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(NOT_VISIT_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch(error => reject(error));
});

export const getAllNotVisitReason = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let notVisitedReasonData = realm.objects(NOT_VISIT_SCHEMA);
        resolve(notVisitedReasonData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getNotVisitReasonById = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let notVisitedReasonData = realm.objects(NOT_VISIT_SCHEMA).filtered('id = ' + id);
        let value = changeHandoverFromRealm(notVisitedReasonData[0]);
        resolve(value);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getNotSyncNotVisitReasons = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(NOT_VISIT_SCHEMA).filtered('not_sync = ' + true);
        resolve(returnData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});