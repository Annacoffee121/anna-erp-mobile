import {EXPENSES_SCHEMA, EXPENSES_TYPE_SCHEMA} from "./index";
import databaseOptions from "../index";
import Realm from "realm";
import {transformExpensesType} from "../../app/helpers/expenses";

export const ExpensesSchema = {
    primaryKey: 'uuid', //Primary key
    name: EXPENSES_SCHEMA,
    properties: {
        uuid: 'string',
        id: 'int',
        type: 'string?',
        type_id: 'int?',
        calculate_mileage_using: 'string?',
        start_reading: 'int?',
        end_reading: 'int?',
        distance: 'int?',
        gps_lat: 'double?',
        gps_long: 'double?',
        expense_date: 'string?',
        expense_time: 'string?',
        liter: 'int?',
        odometer: 'int?',
        amount: 'double?',
        is_synced: 'bool?',
        notes: 'string?',
    }
};

export const ExpensesTypeSchema = {
    primaryKey: 'value', //Primary key
    name: EXPENSES_TYPE_SCHEMA,
    properties: {
        value: 'int?',
        name: 'string?',
        type: 'string?',
    }
};

export const insertExpense = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(EXPENSES_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'insert error')));
});

export const getExpenses = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let fuelExpenseData = realm.objects(EXPENSES_SCHEMA);
        resolve(fuelExpenseData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getExpensesById = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const expenseData = realm.objects(EXPENSES_SCHEMA).filtered('id = ' + id);
        const expense = expenseData[0] ? expenseData[0].uuid : null;
        resolve(expense);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const getOfflineExpenses = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let expenseData = realm.objects(EXPENSES_SCHEMA).filtered('is_synced = ' + false);
        resolve(expenseData);
    }).catch((error) => reject(console.warn(error, 'get error')));
});

export const deleteExpense = id => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.delete(realm.objectForPrimaryKey(EXPENSES_SCHEMA, id));
            resolve();
        });
    }).catch((error) => reject(console.warn(error, 'delete error')));
});

// Expenses Type ***********
export const insertExpenseType = data => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(EXPENSES_TYPE_SCHEMA, data, true); // to create table
            resolve(data);
        });
    }).catch((error) => reject(console.warn(error, 'Expense Type insert error')));
});

export const getAllExpensesType = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let ExpenseTypeData = realm.objects(EXPENSES_TYPE_SCHEMA);
        resolve(transformExpensesType(ExpenseTypeData));
    }).catch((error) => reject(console.warn(error, 'get error')));
});