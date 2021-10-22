import Realm from "realm";
import {ORDER_SCHEMA} from "./index";
import databaseOptions from '../index'
import {transformOrderToList} from "../../app/helpers/orders";
import {BANK_SCHEMA} from "../DropDown";
import {INVOICE_SCHEMA} from "../Invoice";
import {PAYMENT_SCHEMA} from "../Payment";
import {CUSTOMER_SCHEMA} from "../Customer";

export const insertOrderData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(ORDER_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getOrderById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let orderData = realm.objects(ORDER_SCHEMA).filtered('id = ' + id);
        let order = orderData[0] ? orderData[0].u_id : null;
        resolve(order);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllOrderData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(ORDER_SCHEMA);
        resolve(transformOrderToList(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSingleOrderData = orderId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let orderData = realm.objects(ORDER_SCHEMA).filtered('id = ' + orderId);
            let order = orderData[0];
            let customer = realm.objects(CUSTOMER_SCHEMA).filtered('id = ' + order.customer_id);
            order.customer = customer[0];
            let invoices = realm.objects(INVOICE_SCHEMA).filtered('sales_order_id = ' + orderId);
            order.invoices = invoices.length > 0 ? invoices : [];
            let payments = realm.objects(PAYMENT_SCHEMA).filtered('sales_order_id = ' + orderId);
            order.payments = payments ? payments : [];
            order.payments.map((payment) => {
                if (payment.bank_id) {
                    let bankData = realm.objects(BANK_SCHEMA).filtered('value = ' + payment.bank_id);
                    payment.bank_name = bankData.hasOwnProperty(0) ? bankData[0].name : '* not_found';
                }
            });
            resolve(order);
        });
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getNotSyncOrderData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(ORDER_SCHEMA).filtered('not_sync = ' + true);
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateOrderStatusData = (id, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(ORDER_SCHEMA).filtered('id = ' + id);
            let singleData = data[0];
            singleData.status = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const updatePrintStatusData = (id, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(ORDER_SCHEMA).filtered('id = ' + id);
            let singleData = data[0];
            singleData.is_order_printed = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const updateOrderInvoiceStatusData = (id, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let data = realm.objects(ORDER_SCHEMA).filtered('id = ' + id);
            let singleData = data[0];
            singleData.invoice_status = value;
            resolve(singleData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getOrderByCustomerId = (customerId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(ORDER_SCHEMA).filtered('customer_id = ' + customerId);
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getCustomerByOrderId = (orderId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(ORDER_SCHEMA).filtered('id = ' + orderId);
        resolve(data[0].customer_id);
    }).catch((error) => reject(console.warn(error, 'get error')));
});