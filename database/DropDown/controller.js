import Realm from "realm";
import {BUSINESS_TYPE_SCHEMA, UNIT_TYPE_SCHEMA, DEPOSITED_TO_SCHEMA, BANK_SCHEMA} from "./index";
import databaseOptions from '../index'

export const insertBusinessType = Data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(BUSINESS_TYPE_SCHEMA, Data, true); // to create table
            resolve(Data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllBusinessType = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(BUSINESS_TYPE_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const insertUnitType = Data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(UNIT_TYPE_SCHEMA, Data, true); // to create table
            resolve(Data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllUnitType = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(UNIT_TYPE_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const insertDepositedTo = Data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(DEPOSITED_TO_SCHEMA, Data, true); // to create table
            resolve(Data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllDepositedTo = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(DEPOSITED_TO_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const insertBank = Data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(BANK_SCHEMA, Data, true); // to create table
            resolve(Data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllBank = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(BANK_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});