import Realm from "realm";
import {INVOICE_SCHEMA} from "./index";
import databaseOptions from '../index'
import {transformInvoicesToList} from "../../app/helpers/invoices";
import {PAYMENT_SCHEMA} from "../Payment";

export const insertInvoiceData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(INVOICE_SCHEMA, data, true);
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'invoice insert error')));
});

export const getInvoiceById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('id = ' + id);
        let invoice = invoiceData[0] ? invoiceData[0].u_id : null;
        resolve(invoice);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllInvoiceData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(INVOICE_SCHEMA);
        resolve(transformInvoicesToList(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSingleInvoiceData = invoiceId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('id = ' + invoiceId);
        let invoice = invoiceData[0];
        invoice.payments = realm.objects(PAYMENT_SCHEMA).filtered('invoice_id = ' + invoiceId);
        resolve(invoice);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateInvoiceStatus = (id, value) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('id = ' + id);
            let invoice = invoiceData[0];
            invoice.status = value;
            resolve(invoice);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const get_invoice_by_sales_order_id = (sales_order_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('sales_order_id = ' + sales_order_id);
        resolve(invoiceData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const update_invoice_sales_order_id = (id, new_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('id = ' + id);
            let invoice = invoiceData[0];
            invoice.sales_order_id = new_id;
            resolve(invoice);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getNotSyncInvoiceData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let invoiceData = realm.objects(INVOICE_SCHEMA).filtered('not_sync = ' + true);
        resolve(invoiceData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getInvoiceByCustomerId = (customerId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(INVOICE_SCHEMA).filtered('customer_id = ' + customerId);
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});