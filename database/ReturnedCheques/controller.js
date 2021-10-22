import Realm from "realm";
import {RETURNED_CHEQUES_SCHEMA, RETURNED_CHEQUES_PAYMENT_SCHEMA} from "./index";
import databaseOptions from '../index'

export const insertReturnedCheque = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(RETURNED_CHEQUES_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'Returned Cheque insert error')));
});

export const getAllReturnedCheques = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(RETURNED_CHEQUES_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'Returned Cheque get error')));
});

export const getOneReturnedChequeById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const singleData = realm.objects(RETURNED_CHEQUES_SCHEMA).filtered(`cheque_no LIKE '${id}'`);
        const data = singleData[0];
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'Returned Cheque get error')));
});

export const getAllRetChNotSyncPayments = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const dataArray = [];
        let allData = realm.objects(RETURNED_CHEQUES_SCHEMA).filtered('payments.is_not_synced = ' + true);
        allData.map(cheque => {
            const payments = cheque.payments.filter(o => o.is_not_synced === true);
            return dataArray.push({cheque_no: cheque.cheque_no, payments})
        });
        resolve(dataArray);
    }).catch((error) => reject(console.warn(error, 'Returned Cheque payment get error')));
});

export const insertReturnedChequePayment = (cheque_no, paymentData) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            const singleData = realm.objects(RETURNED_CHEQUES_SCHEMA).filtered(`cheque_no LIKE '${cheque_no}'`);
            const data = singleData[0];
            const index = data.payments.findIndex(o=>o.uuid === paymentData.uuid);
            if(index < 0){
                data.payments.push(realm.create(RETURNED_CHEQUES_PAYMENT_SCHEMA, paymentData));
            } else {
                data.payments.splice(index, 1);
                data.payments.push(realm.create(RETURNED_CHEQUES_PAYMENT_SCHEMA, paymentData, true));
            }
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'Returned Cheque insert error')));
});

export const updatePaymentPrintStatusData = (uuid, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(RETURNED_CHEQUES_PAYMENT_SCHEMA).filtered(`uuid = "${uuid}"`);
            let singleData = data[0];
            singleData.is_printed = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

