import {MATA_SCHEMA, MATA_ALLOCATION_SCHEMA} from "./index";
import databaseOptions from "../index";
import Realm from "realm";

export const MataSchema = {
    primaryKey: 'id', //Primary key
    name: MATA_SCHEMA,
    properties: {
        id: 'int',
        next_order_ref: 'string?',
        next_invoice_ref: 'string?',
        rep_cl: 'double?',
        rep_total_cl: 'double?',
        route_cl: 'double?',
        route_total_cl: 'double?',
        start_odo_meter_reading: 'int?',
        allocation: {type: MATA_ALLOCATION_SCHEMA, objectType: MATA_ALLOCATION_SCHEMA},
    }
};

export const MataAllocationSchema = {
    primaryKey: 'id', //Primary key
    name: MATA_ALLOCATION_SCHEMA,
    properties: {
        id: 'int',
        from_date: 'string?',
        to_date: 'string?',
    }
};

export const insertMetaData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(MATA_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const get_last_order_ref = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(MATA_SCHEMA);
        resolve(data[0].next_order_ref);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const update_last_order_ref = (value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(MATA_SCHEMA);
            let singleData = data[0];
            singleData.next_order_ref = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const get_last_invoice_ref = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(MATA_SCHEMA);
        resolve(data[0].next_invoice_ref);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const update_last_invoice_ref = (value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(MATA_SCHEMA);
            let singleData = data[0];
            singleData.next_invoice_ref = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const get_credit_limit = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(MATA_SCHEMA);
        resolve(data[0]);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const get_allocation = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(MATA_SCHEMA);
       if(data.length){
           let allocation = data[0].allocation;
           resolve(allocation);
       } else {
           resolve(null);
       }
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getStartODOReading = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(MATA_SCHEMA);
        resolve(data[0].start_odo_meter_reading);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

