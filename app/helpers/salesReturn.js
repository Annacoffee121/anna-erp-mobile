import {ID} from "./createId";

export const mapSalesReturn = (salesReturnData) => {
    if (!salesReturnData) return {};
    return transformSalesReturn(salesReturnData);
};

function transformSalesReturn(salesReturnData) {
    let return_data = {};
    let items = [];
    let return_products = [];

    salesReturnData.items.map(returnItem => {
        let newItems = {};
        newItems.qty = returnItem.qty;
        newItems.type = returnItem.type;
        newItems.sold_rate = returnItem.sold_rate;
        newItems.returned_rate = returnItem.returned_rate;
        newItems.returned_amount = returnItem.returned_amount;
        newItems.reason = returnItem.reason;
        newItems.product_id = returnItem.product_id;
        newItems.order_id = returnItem.order_id;
        items.push(newItems)
    });

    salesReturnData.return_products.map(products => {
        let newItems = {};
        newItems.qty = products.qty;
        newItems.rate = products.rate;
        newItems.amount = products.amount;
        newItems.product_id = products.product_id;
        return_products.push(newItems)
    });

    return_data.date = salesReturnData.date;
    return_data.notes = salesReturnData.notes;
    return_data.items = items;
    return_data.resolutions = salesReturnData.resolutions;
    return_data.return_products = return_products;
    return_data.is_printed = salesReturnData.is_printed ? salesReturnData.is_printed : 'No';
    return return_data;
}

export const mapOfflineSalesReturnForRealm = (salesReturnData, not_sync, id) => {
    if (!salesReturnData) return {};
    return transformData(salesReturnData, not_sync, id);
};

function transformData(salesReturnData, not_sync, id) {
    let return_data = {};
    let items = [];
    let resolutions = [];
    let return_products = [];

    salesReturnData.items.map(returnItem => {
        let newItems = {};
        newItems.id = returnItem.id ? returnItem.id : ID();
        newItems.qty = parseInt(returnItem.qty);
        newItems.type = returnItem.type;
        newItems.sold_rate = parseFloat(returnItem.sold_rate);
        newItems.returned_rate = parseFloat(returnItem.returned_rate);
        newItems.returned_amount = parseFloat(returnItem.returned_amount);
        newItems.reason = returnItem.reason;
        newItems.product_id = returnItem.product_id;
        newItems.product_name = returnItem.product_name;
        newItems.order_id = returnItem.order_id;
        newItems.ref = returnItem.ref;
        items.push(newItems)
    });

    salesReturnData.resolutions.map(resolution => {
        let newItems = {};
        newItems.id = resolution.id ? resolution.id : ID();
        newItems.type = resolution.type;
        newItems.amount = parseFloat(resolution.amount);
        newItems.order_id = resolution.order_id;
        resolutions.push(newItems)
    });

    salesReturnData.return_products.map(products => {
        let newItems = {};
        newItems.id = products.id ? products.id : ID();
        newItems.product_name = products.product_name;
        newItems.product_id = products.product_id;
        newItems.qty = parseInt(products.qty);
        newItems.rate = parseFloat(products.rate);
        newItems.amount = parseFloat(products.amount);
        return_products.push(newItems)
    });

    return_data.uuid = salesReturnData.uuid ? salesReturnData.uuid : ID();
    return_data.id = id ? id : ID();
    return_data.customer_id = salesReturnData.customer_id;
    return_data.date = salesReturnData.date;
    return_data.items = items;
    return_data.resolutions = resolutions;
    return_data.return_products = return_products;
    return_data.total = salesReturnData.total;
    return_data.notes = salesReturnData.notes;
    return_data.not_sync = not_sync;
    return_data.is_printed = 'No';
    return return_data;
}

export const mapNotVisitReason = (notVisitReason) => {
    if (!notVisitReason) return {};
    return transformNotVisitReason(notVisitReason);
};

function transformNotVisitReason(notVisitReason) {
    return {
        reason: notVisitReason.reason,
        gps_lat: notVisitReason.gps_lat,
        gps_long: notVisitReason.gps_long
    };
}

export const changeNotVisitReasonSync = (notVisitReason) => {
    if (!notVisitReason) return {};
    return syncNotVisitReason(notVisitReason);
};

function syncNotVisitReason(notVisitReason) {
    return {
        id: notVisitReason.id,
        reason: notVisitReason.reason,
        gps_lat: notVisitReason.gps_lat,
        gps_long: notVisitReason.gps_long,
        is_visited: notVisitReason.is_visited,
        not_sync: false
    };
}