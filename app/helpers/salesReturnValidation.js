import {map, concat, compact} from 'lodash'

export function validateReturnProductQty(qty, product_id, order_id, orders, stored_returns) {
    let response;
    if (!orders.length) return response = 'Please select related order first';
    if (!product_id) return response = 'Please select product first';
    if (!order_id) return response = 'Please select related order first';

    const allData = stored_returns.map(stored_return => {
        return stored_return.items.find(element => {
            return element.product_id === product_id && element.order_id === order_id;
        });
    });
    const data = compact(allData);
    let storedQuantity = 0;
    if (data.length) {
        data.map(value => storedQuantity = storedQuantity + value.qty)
    }

    const result = orders.find(function (element) {
        return element.id === order_id;
    });
    const quantity = parseInt(qty);
    const availableBalance = result.quantity - storedQuantity;

    if (!quantity) {
        response = 'This is a required field'
    } else if (quantity === 0) {
        response = 'This is a required field'
    } else if (availableBalance === 0) {
        response = 'Products are already returned for this order '
    } else if (availableBalance < quantity) {
        response = 'Sold stock is ' + availableBalance
    }
    return response;
}

export function validateReturnProduct(product_id, already_added_items, order_id) {
    let response;
    const result = already_added_items.find(element => {
        return element.product_id === product_id && element.order_id === order_id;
    });

    if (!product_id) {
        response = 'Select a valid field'
    } else if (product_id === 0) {
        response = 'Select a valid field'
    } else if (result) {
        response = 'This product is already added'
    }
    return response;
}