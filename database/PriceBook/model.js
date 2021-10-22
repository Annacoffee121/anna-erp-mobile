import {PRICE_BOOK, PRICE_BOOK_PRICES} from "./index";

export const PriceBookSchema = {
    name: PRICE_BOOK,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        code: 'string?',
        name: 'string?',
        category: 'string?',
        type: 'string?',
        notes: 'string?',
        is_active: 'string?',
        prices: {type: 'list', objectType: PRICE_BOOK_PRICES},
    }
};

export const PriceBookPricesSchema = {
    name: PRICE_BOOK_PRICES,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        price: 'double?',
        range_start_from: 'int?',
        range_end_to: 'int?',
        product_id: 'int?',
        price_book_id: 'int?',
    }
};