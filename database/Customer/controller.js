import Realm from "realm";
import {CUSTOMER_SCHEMA, CONTACT_PERSON_SCHEMA} from "./index";
import databaseOptions from '../index'
import {transformCustomers, transformCustomerForDropDown} from "../../app/helpers/customer";

export const deleteAll = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.deleteAll();
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'delete error')));
});

export const insertCustomerData = newCustomerData => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(CUSTOMER_SCHEMA, newCustomerData, true); // to create table
            resolve(newCustomerData);
        });
    }).catch((error) => reject(console.warn(error, 'Customer Data insert error')));
});

export const getAllCustomerData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(CUSTOMER_SCHEMA);
        resolve(transformCustomers(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getAllCustomersFromDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(CUSTOMER_SCHEMA);
        resolve(allData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getCustomerListForDropDown = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allData = realm.objects(CUSTOMER_SCHEMA);
        resolve(transformCustomerForDropDown(allData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getSingleCustomerData = customerId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let singleData = realm.objects(CUSTOMER_SCHEMA).filtered('id = ' + customerId);
        let data = singleData[0];
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'customer get error')));
});

export const getSingleCustomerName = customerId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let singleData = realm.objects(CUSTOMER_SCHEMA).filtered('id = ' + customerId);
        let data = singleData[0];
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getNotSyncCustomerData = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(CUSTOMER_SCHEMA).filtered('not_sync = true');
        resolve(data);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const deleteCustomerById = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteValue = realm.objectForPrimaryKey(CUSTOMER_SCHEMA, id);
            realm.delete(deleteValue);
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'delete error')));
});

export const getCustomerOutstanding = CusId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let data = realm.objects(CUSTOMER_SCHEMA).filtered('id = ' + CusId);
        let singleData = data[0].outstanding ? data[0].outstanding.balance : 0;
        resolve(singleData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});
//Contact person *****************
export const insertContactPersonToCustomerData = (customerId, newContactPersonData) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let singleData = realm.objects(CUSTOMER_SCHEMA).filtered('id = ' + customerId);
            let data = singleData[0];
            data.contact_persons.push(realm.create(CONTACT_PERSON_SCHEMA, newContactPersonData));
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const updateContactPersonData = newData => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(CONTACT_PERSON_SCHEMA, newData, true); // to update with With Primary Key
            resolve(newData);
        });
    }).catch((error) => reject(console.warn(error, 'update error')));
});

export const deleteContactPerson = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteValue = realm.objectForPrimaryKey(CONTACT_PERSON_SCHEMA, id);
            realm.delete(deleteValue);
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'delete error')));
});