export const transformOrderItems = (orderItems) => {
    if (!orderItems) return [];
    return transformData(orderItems);
};

function transformData(object) {
    let order = {};
    let orderItems = [];
    object.order_items.map((value) => {
        let items = {};
        items.product_id = value.product_id;
        items.unit_type_id = value.unit_type_id;
        items.quantity = value.quantity;
        items.notes = value.notes;
        orderItems.push(items)
    });

    order.business_type_id = object.business_type_id;
    order.uuid = object.uuid;
    order.order_type = object.order_type;
    order.customer_id = object.customer_id;
    order.ref = object.ref;
    order.gps_lat = object.gps_lat;
    order.gps_long = object.gps_long;
    order.order_date = object.order_date;
    order.delivery_date = object.delivery_date;
    order.order_items = orderItems;
    order.notes = object.notes;
    order.terms = object.terms;
    order.file = object.file;
    order.save_as = object.save_as;
    order.created_at = object.created_at;
    return order;
}

export const transformInvoiceItems = (items) => {
    if (!items) return {};
    return transformInvoiceData(items);
};

function transformInvoiceData(items) {
    let invoiceData = {};
    invoiceData.invoice_date = items.invoice_date;
    invoiceData.due_date = items.due_date;
    invoiceData.amount = items.amount;
    invoiceData.notes = items.notes;
    return invoiceData;
}

export const transformOrderToEdit = (items) => {
    if (!items) return {};
    return transformEditOrderData(items);
};

function transformEditOrderData(items) {
    let data = {};
    let orderData = {};
    let orderItems = [];
    orderData.business_type_id = items.business_type_id;
    orderData.order_type = items.order_type;
    orderData.customer_id = items.customer_id;
    orderData.price_book_id = items.price_book_id;
    orderData.sales_type = items.sales_type;
    orderData.order_date = items.order_date ? items.order_date : '';
    orderData.delivery_date = items.delivery_date ? items.delivery_date : '';
    orderData.scheduled_date = items.scheduled_date ? items.scheduled_date : '';
    orderData.order_items = items.order_items;
    orderData.notes = items.notes ? items.notes : '';
    orderData.adjustment = items.adjustment ? items.adjustment : '0';
    orderData.discount_rate = items.discount_rate ? items.discount_rate : '0';
    orderData.discount_type = items.discount_type;
    orderData.terms = items.terms ? items.terms : '';

    data.orderData = orderData;
    data.total = items.total ? items.total : '0';
    data.subTotal = items.sub_total ? items.sub_total : '0';
    return data;
}