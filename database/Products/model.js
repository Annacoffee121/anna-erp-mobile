import {PRODUCTS_SCHEMA} from "./index";

export const ProductsSchema = {
    name: PRODUCTS_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int',
        code: 'string',
        name: 'string',
        tamil_name: 'string?',
        measurement: 'string',
        type: 'string',
        min_stock_level: 'string',
        stock_level: 'int?',
        actual_stock: 'int?',
        sold_stock: 'int?',
        replaced_qty: 'int?',
        notes: 'string?',
        distribution_price: 'double?',
        buying_price: 'double?',
        wholesale_price: 'double?',
        retail_price: 'double?',
        box_price: 'double?',
        carton_price: 'double?',
        dozen_price: 'double?',
        each_price: 'double?',
        pieces_price: 'double?',
        packet_price: 'double?',
        category_id: 'int?',
    }
};