import databaseOptions from "../index";
import Realm from "realm";

export const SALES_RETURN_SCHEMA = "sales_return";
export const RETURN_ITEMS_SCHEMA = "return_items";
export const RESOLUTIONS_SCHEMA = "return_items_resolutions";
export const REPLACE_SCHEMA = "replace_items";

export const insertSalesReturnData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(SALES_RETURN_SCHEMA, data, true);
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'Sales return insert error')));
});

export const getSalesReturn = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(SALES_RETURN_SCHEMA).filtered('id = ' + id);
        resolve(returnData[0]);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSalesReturnByCustomerId = customerId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(SALES_RETURN_SCHEMA).filtered('customer_id = ' + customerId);
        resolve(returnData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getNotSyncSalesReturn = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(SALES_RETURN_SCHEMA).filtered('not_sync = ' + true);
        resolve(returnData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateReturnPrintStatus = (id, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(SALES_RETURN_SCHEMA).filtered('id = ' + id);
            let singleData = data[0];
            singleData.is_printed = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getResolutionDetails = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(RESOLUTIONS_SCHEMA);
        resolve(returnData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});