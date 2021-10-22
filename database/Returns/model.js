import {SALES_RETURN_SCHEMA, RETURN_ITEMS_SCHEMA, RESOLUTIONS_SCHEMA, REPLACE_SCHEMA} from "./index";

export const SalesReturnSchema = {
    name: SALES_RETURN_SCHEMA,
    primaryKey: 'uuid',
    properties: {
        uuid: 'int',
        id: 'int?',
        customer_id: 'int',
        date: 'string?',
        items: {type: 'list', objectType: RETURN_ITEMS_SCHEMA},
        resolutions: {type: 'list', objectType: RESOLUTIONS_SCHEMA},
        return_products: {type: 'list', objectType: REPLACE_SCHEMA},
        total: 'double?',
        notes: 'string?',
        not_sync: 'bool?',
        is_printed: 'string?'
    }
};

export const ReturnItemsSchema = {
    name: RETURN_ITEMS_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        qty: 'int?',
        type: 'string?',
        sold_rate: 'double?',
        returned_rate: 'double?',
        returned_amount: 'double?',
        reason: 'string?',
        product_id: 'int?',
        product_name: 'string?',
        order_id: 'int?',
        ref: 'string?',
    }
};

export const ResolutionsSchema = {
    name: RESOLUTIONS_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        type: 'string?',
        amount: 'double?',
        order_id: 'int?',
    }
};

export const ReplaceItemsSchema = {
    name: REPLACE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        product_name: 'string?',
        product_id: 'int?',
        qty: 'int?',
        rate: 'double?',
        amount: 'double?',
    }
};