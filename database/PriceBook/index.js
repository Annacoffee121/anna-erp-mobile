import databaseOptions from "../index";
import Realm from "realm";

export const PRICE_BOOK = "price_book";
export const PRICE_BOOK_PRICES = "price_book_prices";

export const insertPriceBookData = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(PRICE_BOOK, data, true);
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'Price Book insert error')));
});

export const getAllPriceBookData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let returnData = realm.objects(PRICE_BOOK);
        resolve(returnData.length ? returnData[0] :null);
    }).catch((error) => reject(console.warn(error, 'Price Book get error')));
});