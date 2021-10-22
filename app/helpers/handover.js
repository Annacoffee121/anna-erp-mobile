import {getAllNotVisitReason} from "../../database/NotVisited/model";
import v4 from "uuid";

export const changeHandoverData = (data, not_visit_data) => {
    if (!data) return {};
    if (!not_visit_data) return {};
    return transformData(data, not_visit_data);
};

function transformData(data, not_visit_data) {
    let newData = {};
    // newData.expenses = data.expenses;
    newData.odometer_end_reading = data.odometer_end_reading;
    newData.allowance = data.allowance;
    newData.notes = data.notes;
    newData.not_visit_customer_notes = not_visit_data;
    newData.sold_qty = data.sold_qty;
    newData.replaced_qty = data.replaced_qty;
    return newData;
}

export const getNotVisitCustomerNotes = () => {
    let not_visit_data = {};
    return getAllNotVisitReason().then(reasons => {
        reasons.map(reason => {
            not_visit_data[reason.id] = {
                reason: reason.reason,
                gps_lat: reason.gps_lat,
                gps_long: reason.gps_long,
            };
        });
        return not_visit_data;
    });
};


async function validateReason(array, allReason) {
    let data = null;
    await array.map(async id => {
        data = allReason.map(function (e) {
            return e.id;
        }).indexOf(id);
    });
    return await data;
}

export const getAllNotVisitReasonAndValidate = async (notVisitedCus) => {
    return await getAllNotVisitReason().then(async allReason => {
        return await validateReason(notVisitedCus, allReason).then(val => {
            return val;
        })
    })
};

export const changeHandoverFromRealm = (data) => {
    if (!data) return {};
    return transformRealmData(data);
};

function transformRealmData(data) {
    let newData = {};
    newData.id = data.id;
    newData.reason = data.reason;
    newData.gps_lat = data.gps_lat;
    newData.gps_long = data.gps_long;
    newData.not_sync = data.not_sync;
    return newData;
}

export const transformExpense = (expense) => {
    if (!expense) return {};
    return changeExpenseToStore(expense);
};

function changeExpenseToStore(expense) {
    let data = expense;
    data.uuid = expense.uuid ? expense.uuid : v4();
    data.id = parseInt(expense.id);
    data.amount = parseFloat(expense.amount);
    data.odometer = expense.odometer ? parseInt(expense.odometer) : null;
    data.liter = expense.liter ? parseInt(expense.liter) : null;
    data.start_reading = expense.start_reading ? parseInt(expense.start_reading) : null;
    data.end_reading = expense.end_reading ? parseInt(expense.end_reading) : null;
    data.distance = expense.distance ? parseInt(expense.distance) : null;
    return data;
}

export const transformSyncExpense = (expense) => {
    if (!expense) return {};
    return changeExpenseToSync(expense);
};

function changeExpenseToSync(expense) {
    let data = {};
    data.id = parseInt(expense.id);
    data.type = expense.type ? expense.type.toString() : null;
    data.type_id = expense.type_id ? parseInt(expense.type_id) : null;
    data.calculate_mileage_using = expense.calculate_mileage_using ? expense.calculate_mileage_using.toString() : null;
    data.start_reading = expense.start_reading ? parseInt(expense.start_reading) : null;
    data.end_reading = expense.end_reading ? parseInt(expense.end_reading) : null;
    data.distance = expense.distance ? parseInt(expense.distance) : null;
    data.gps_lat = expense.gps_lat ? parseFloat(expense.gps_lat) : null;
    data.gps_long = expense.gps_long ? parseFloat(expense.gps_long) : null;
    data.expense_date = expense.expense_date ? expense.expense_date.toString() : null;
    data.expense_time = expense.expense_time ? expense.expense_time.toString() : null;
    data.liter = expense.liter ? parseInt(expense.liter) : null;
    data.odometer = expense.odometer ? parseInt(expense.odometer) : null;
    data.amount = parseFloat(expense.amount);
    data.notes = expense.notes ? expense.notes.toString() : null;
    return data;
}

export const transformExpenseToStore = (expense, res) => {
    if (!expense) return {};
    return changeExpense(expense, res);
};

function changeExpense(expense, res) {
    let data = expense;
    data.uuid = expense.uuid ? expense.uuid : v4();
    data.id = res ? parseInt(res.id) : parseInt(expense.id);
    data.is_synced = true;
    data.amount = parseFloat(expense.amount);
    data.type = expense.type_name ? expense.type_name : expense.type;
    data.gps_lat = expense.gps_lat ? parseFloat(expense.gps_lat) : null;
    data.gps_long = expense.gps_long ? parseFloat(expense.gps_long) : null;
    data.odometer = expense.odometer ? parseInt(expense.odometer) : null;
    data.liter = expense.liter ? parseInt(expense.liter) : null;
    data.start_reading = expense.start_reading ? parseInt(expense.start_reading) : null;
    data.end_reading = expense.end_reading ? parseInt(expense.end_reading) : null;
    data.distance = expense.distance ? parseInt(expense.distance) : null;
    return data;
}

export const transformUpdateExpense = (expense, res) => {
    if (!expense) return {};
    return changeUpdateExpense(expense, res);
};

function changeUpdateExpense(expense, response) {
    let data = {};
    data.uuid = expense.uuid ? expense.uuid : v4();
    data.id = parseInt(response.id);
    data.type = expense.type ? expense.type.toString() : null;
    data.type_id = expense.type_id ? parseInt(expense.type_id) : null;
    data.calculate_mileage_using = expense.calculate_mileage_using ? expense.calculate_mileage_using.toString() : null;
    data.start_reading = expense.start_reading ? parseInt(expense.start_reading) : null;
    data.end_reading = expense.end_reading ? parseInt(expense.end_reading) : null;
    data.distance = expense.distance ? parseInt(expense.distance) : null;
    data.gps_lat = expense.gps_lat ? parseFloat(expense.gps_lat) : null;
    data.gps_long = expense.gps_long ? parseFloat(expense.gps_long) : null;
    data.expense_date = expense.expense_date ? expense.expense_date.toString() : null;
    data.expense_time = expense.expense_time ? expense.expense_time.toString() : null;
    data.liter = expense.liter ? parseInt(expense.liter) : null;
    data.odometer = expense.odometer ? parseInt(expense.odometer) : null;
    data.is_synced = true;
    data.amount = parseFloat(expense.amount);
    data.notes = expense.notes ? expense.notes.toString() : null;
    return data;
}