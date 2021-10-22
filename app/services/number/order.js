import {get_last_order_ref, update_last_order_ref} from "../../../database/Mata/model";

// Create last_order_ref
export const getOrderNumber = () => {
    return get_last_order_ref().then(value => {
        return value
    })
};

// Update last_order_ref
export const updateOrderNumber = (lastOrderNumber) => {
    update_last_order_ref(changeOrderNumber(lastOrderNumber)).catch(error => console.log(error))
};

export const changeOrderNumber = (lastOrderNumber) => {
    let value = lastOrderNumber.split('/');
    let number = parseInt(value[3]);
    let newNumber = number + 1;
    let formattedNumber = ("000000" + newNumber).slice(-6);
    return value[0] + '/' + value[1] + '/' + value[2] + '/' + formattedNumber;
};