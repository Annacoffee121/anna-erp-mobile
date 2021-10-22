import Realm from "realm";
import {RETURN_PRODUCTS_ORDER_SCHEMA, RETURN_PRODUCTS_SCHEMA} from "./index";
import databaseOptions from '../index'

export const insertReturnProducts = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(RETURN_PRODUCTS_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'ReturnProducts insert error')));
});

export const getAllReturnProducts = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(RETURN_PRODUCTS_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getProductsByCustomerId = customerId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let productData = realm.objects(RETURN_PRODUCTS_SCHEMA).filtered('orders.customer_id = ' + customerId);
        resolve(productData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getRateByOrderId = (product_id, order_id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const products = realm.objects(RETURN_PRODUCTS_SCHEMA).filtered('id = ' + product_id);
        const orderData = products[0].orders.filter(order => order.id === order_id);
        resolve(orderData[0]);
    }).catch((error) => reject(console.warn(error, 'get error')));
});