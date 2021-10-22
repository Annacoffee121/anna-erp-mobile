import {
    ORDER_SCHEMA, ORDER_ITEM_SCHEMA
} from "./index";

export const OrderSchema = {
    name: ORDER_SCHEMA,
    primaryKey: 'u_id', //Primary key
    properties: {
        u_id: 'string',
        uuid: 'string?',
        id: 'int',
        order_no: 'string?',
        order_date: 'string',
        ref: 'string?',
        delivery_date: 'string',
        order_type: 'string',
        notes: 'string?',
        total: 'double?',
        status: 'string?',
        delivery_status: 'string?',
        invoice_status: 'string?',
        is_invoiced: 'string?',
        customer_id: 'int',
        customer_name: 'string?',
        tamil_name: 'string?',
        rep_id: 'int?',
        sales_type: 'string?',
        business_type_id: 'int?',
        company_id: 'int?',
        prepared_by: 'int?',
        approval_status: 'string?',
        customer_outstanding: 'string?',
        gps_lat: 'double?',
        gps_long: 'double?',
        not_sync: 'bool?',
        order_items: {type: 'list', objectType: ORDER_ITEM_SCHEMA},
        is_order_printed:'string?',
        created_at:'string?',
    }
};

export const OrderItemSchema = {
    name: ORDER_ITEM_SCHEMA,
    properties: {
        product_id: 'int?',
        product_name: 'string?',
        store_id: 'int?',
        store_name: 'string?',
        unit_type_id: 'int?',
        unit_type_name: 'string?',
        quantity: 'int?',
        rate: 'double?',
        amount: 'double?',
        status: 'string?',
        notes: 'string?',
    }
};