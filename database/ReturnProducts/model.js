import {RETURN_PRODUCTS_SCHEMA, RETURN_PRODUCTS_ORDER_SCHEMA} from "./index";

export const ReturnProductsSchema = {
    name: RETURN_PRODUCTS_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int',
        name: 'string?',
        code: 'string?',
        orders: {type: 'list', objectType: RETURN_PRODUCTS_ORDER_SCHEMA},
    }
};

export const ReturnProductsOrderSchema = {
    name: RETURN_PRODUCTS_ORDER_SCHEMA,
    properties: {
        id: 'int?',
        customer_id: 'int?',
        order_no: 'string?',
        ref: 'string?',
        rate: 'double?',
        quantity: 'int?',
    }
};
