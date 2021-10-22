import Realm from "realm";
import {PRODUCTS_SCHEMA} from "./index";
import databaseOptions from '../index'
import {transformProducts, transformProductsReplaced, transformProductsSoldQty} from "../../app/helpers/orders";

export const insertProducts = Data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(PRODUCTS_SCHEMA, Data, true); // to create table
            resolve(Data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getAllProducts = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(PRODUCTS_SCHEMA);
        resolve(transformProducts(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});


export const getSingleProductUsingId = productId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let singleData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + productId);
        let data = singleData[0];
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSoldStockById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let productData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + id);
        let product = productData[0];
        resolve(product.sold_stock ? product.sold_stock : 0);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const updateSoldStock = (id, quantity) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let productData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + id);
            let product = productData[0];
            product.sold_stock = quantity;
            resolve(product);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const updateActualStock = (id, data) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let productData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + id);
            let product = productData[0];
            product.actual_stock = data.actual_stock ? parseInt(data.actual_stock) : null;
            resolve(id);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getReplacedStockById = (id) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let productData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + id);
        let product = productData[0];
        resolve(product.replaced_qty ? product.replaced_qty : 0);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const addReplacedStock = (id, quantity) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let productData = realm.objects(PRODUCTS_SCHEMA).filtered('id = ' + id);
            let product = productData[0];
            product.replaced_qty = quantity;
            resolve(product);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const getAllSoldQuantity = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(PRODUCTS_SCHEMA);
        resolve(transformProductsSoldQty(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllReplacedQuantity = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(PRODUCTS_SCHEMA);
        resolve(transformProductsReplaced(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});