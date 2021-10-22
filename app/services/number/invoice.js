import {get_last_invoice_ref, update_last_invoice_ref} from "../../../database/Mata/model";

// Create last_invoice_ref
export const getInvoiceNumber = () => {
    return get_last_invoice_ref().then(value => {
        return value
    })
};

// Update last_invoice_ref
export const updateInvoiceNumber = (lastInvoiceNumber) => {
    update_last_invoice_ref(changeInvoiceNumber(lastInvoiceNumber)).catch(error => console.log(error))
};

export const changeInvoiceNumber = (lastInvoiceNumber) => {
    let value = lastInvoiceNumber.split('/');
    let number = parseInt(value[3]);
    let newNumber = number + 1;
    let formattedNumber = ("000000" + newNumber).slice(-6);
    return value[0] + '/' + value[1] + '/' + value[2] + '/' + formattedNumber;
};