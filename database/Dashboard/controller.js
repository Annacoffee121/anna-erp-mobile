import Realm from "realm";
import {ROUTE_CUSTOMER_SCHEMA, ROUTE_SCHEMA} from "./index";
import databaseOptions from '../index'

export const insertDashboardData = newCustomerData => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(ROUTE_SCHEMA, newCustomerData, true); // to create table
            resolve(newCustomerData);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllDashboardData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(ROUTE_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getOutstandingByCusId = CusId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(ROUTE_CUSTOMER_SCHEMA).filtered('id = ' + CusId);
        let singleData = data[0].outstanding ? data[0].outstanding : 0;
        resolve(singleData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateDashboardCustomerData = newCustomerData => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(ROUTE_CUSTOMER_SCHEMA, newCustomerData, true); // to create table
            resolve(newCustomerData);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});