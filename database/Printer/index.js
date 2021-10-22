import databaseOptions from "../index";
import Realm from "realm";
import {PRINTER_SCHEMA} from "./model";

export const insertPrinterData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(PRINTER_SCHEMA, data, true);
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'Sales return insert error')));
});

export const getPrinterData = uid => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(PRINTER_SCHEMA).filtered('uid = ' + uid);
        resolve(returnData[0]);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateConnectStatus = connect_status => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(PRINTER_SCHEMA).filtered('uid = ' + 1);
            let singleData = data[0];
            singleData.connect_status = connect_status;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'Sales return insert error')));
});