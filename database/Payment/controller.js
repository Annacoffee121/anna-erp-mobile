import Realm from "realm";
import {PAYMENT_SCHEMA} from "./index";
import databaseOptions from '../index'
import {INVOICE_SCHEMA} from "../Invoice";
import {BANK_SCHEMA} from "../DropDown";
import {ORDER_SCHEMA} from "../Order";

export const insertPaymentData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(PAYMENT_SCHEMA, data, true);
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'PaymentData insert error')));
});

export const getPaymentById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('id = ' + id);
        let payment = paymentData[0] ? paymentData[0].u_id : null;
        resolve(payment);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllPaymentData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let PaymentData = realm.objects(PAYMENT_SCHEMA);
        resolve(PaymentData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getPaymentByCustomerId = customerId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let newPayments = [];
            let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('customer_id = ' + customerId);
            paymentData.map(payment => {
                let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('id = ' + payment.invoice_id);
                payment.invoice = invoiceData.hasOwnProperty(0) ? invoiceData[0] : {};
                let orderData = realm.objects(ORDER_SCHEMA).filtered('id = ' + payment.sales_order_id);
                payment.order = orderData.hasOwnProperty(0) ? orderData[0] : {};
                if (payment.bank_id) {
                    let bankData = realm.objects(BANK_SCHEMA).filtered('value = ' + payment.bank_id);
                    payment.bank_name = bankData.hasOwnProperty(0) ? bankData[0].name : '* not_found';
                }
                newPayments.push(payment)
            });
            resolve(newPayments);
        });
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSinglePaymentData = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('id = ' + id);
        let payment = paymentData[0];
        resolve(payment);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const deletePaymentData = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('id = ' + id);
            realm.delete(paymentData);
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'delete error')));
});

export const get_payment_by_sales_order_id = (sales_order_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('sales_order_id = ' + sales_order_id);
        resolve(paymentData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const update_payment_by_sales_order_id = (id, new_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('id = ' + id);
            let payment = paymentData[0];
            payment.sales_order_id = new_id;
            resolve(payment);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const get_payment_by_invoice_id = (invoice_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('invoice_id = ' + invoice_id);
        resolve(paymentData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const get_payment_by_order_id = (order_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('sales_order_id = ' + order_id);
        resolve(paymentData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const update_payment_by_invoice_id = (id, new_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('id = ' + id);
            let payment = paymentData[0];
            payment.invoice_id = new_id;
            resolve(payment);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getNotSyncPaymentData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let paymentData = realm.objects(PAYMENT_SCHEMA).filtered('not_sync = ' + true);
        resolve(paymentData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllPaymentByCustomerId = (customerId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(PAYMENT_SCHEMA).filtered('customer_id = ' + customerId);
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});