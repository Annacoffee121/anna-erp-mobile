import moment from "moment/moment";
import {transformToCurrency} from "./currencyFormatConverter";
import findIndex from "lodash/findIndex";

export function validateEmptyInputText(value) {
    let response;
    if (value === '') {
        response = 'This is a required field'
    } else if (!value) {
        response = 'This is a required field'
    }
    return response;
}

export function validateNumberEmptyInputText(value) {
    let response;
    if (value === '') {
        response = 'This is a required field'
    } else if (value <= 0) {
        response = 'This is a required field'
    } else if (!value) {
        response = 'This is a required field'
    }
    return response;
}

export function validateFullNumberInput(quantity, available) {
    let response;
    const decimal = /^[-+]?[0-9]+\.+$/;
    if (Math.floor(quantity) === 0) {
        response = 'This is a required field'
    } else if (!quantity) {
        response = 'This is a required field'
    } else if (quantity > available) {
        response = 'Available stock ( ' + available + ' )';
    } else if ((quantity - Math.floor(quantity)) !== 0) {
        response = 'Use full number only'
    } else if (quantity.match(decimal)) {
        response = 'Full number only'
    }
    return response;
}

export function validateEmail(value) {
    let emailId = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let response;
    if (value === '') {
        response = 'This is a required field'
    } else if (!emailId.test(value)) {
        response = 'Fill with correct fields'
    }
    return response;
}

export function validatePhoneNumber(value) {
    let phoneNo = /^\d{10}$/;
    let response;
    if (value === '') {
        response = 'This is a required field'
    } else if (!value.match(phoneNo)) {
        response = 'Fill with correct fields'
    }
    return response;
}

export function validateWebsite(value) {
    let website = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    let response;
    if (value === '') {
        response = 'This is a required field'
    } else if (!website.test(value)) {
        response = 'Fill with correct fields'
    }
    return response;
}

export function validateId(value) {
    let response;
    if (!value) {
        response = 'Select a valid field'
    } else if (value === 0) {
        response = 'Select a valid field'
    }
    return response;
}

export function validateAmount(originalValue, value) {
    let response;
    if (!value) {
        response = 'This is a required field'
    } else if (originalValue < value) {
        response = 'Can\'t enter amount more than allowed';
    }
    return response;
}

export function validateReturnAmount(total, resolution_amount, balance_amount) {
    let response;
    if (!resolution_amount) {
        response = 'Please do an action for return resolution!'
    } else if (resolution_amount === 0) {
        response = 'Please do an action for return resolution!'
    } else if (total < resolution_amount) {
        response = 'Please remove extra ' + transformToCurrency(balance_amount) + ' amount';
    } else if (total > resolution_amount) {
        response = 'Please do action for balance ' + transformToCurrency(balance_amount) + ' amount';
    }
    return response;
}

export function validateEndReading(startReading, endReading) {
    console.log(startReading, endReading, 'startReading, endReading')
    let start = startReading ? parseInt(startReading) : 0;
    let end = parseInt(endReading);
    let response;
    if (!endReading) {
        response = 'This is a required field'
    } else if (end === 0) {
        response = 'This is a required field';
    } else if (end <= start) {
        response = 'End reading can\'t be smaller than start reading';
    }
    return response;
}

export function validateStock(quantity, available) {
    let response;
    if (quantity === 0 || quantity === '0') {
        response = 'This is a required field'
    } else if (!quantity) {
        response = 'This is a required field'
    } else if (quantity > available) {
        response = 'Available stock ( ' + available + ' )';
    }
    return response;
}

export function validateStockForComponent(quantity, available) {
    let response;
    if (quantity === 0) {
        response;
    } else if (!quantity) {
        response = 'This is a required field'
    } else if (quantity > available) {
        response = 'Available stock ( ' + available + ' )';
    }
    return response;
}

export function validateChequeDigit(chequeNumber) {
    let response;
    if (chequeNumber === '') {
        response = 'This is a required field'
    } else if (chequeNumber.length !== 6) {
        response = 'Cheque number should have 6 digits!';
    }
    return response;
}

export function validateCreditCardDigit(creditCardDigit) {
    let response;
    if (creditCardDigit === '') {
        response = 'This is a required field'
    } else if (creditCardDigit.length !== 16) {
        response = 'Credit Card number should have 16 digits!';
    }
    return response;
}

export function validateDate(selected_date, allocate_date) {
    let response;
    if (selected_date === '') {
        response = 'This is a required field'
    } else if (moment(selected_date).isBefore(allocate_date)) {
        response = 'Date can\'t be older than today!';
    }
    return response;
}

export function validateChequeDate(selected_date) {
    const availableDate = moment().subtract(5, 'months').format('YYYY-MM-DD');
    let response;
    if (selected_date === '') {
        response = 'This is a required field'
    } else if (moment(selected_date).isBefore(availableDate)) {
        response = 'Date can\'t be older than ' + availableDate + ' !';
    }
    return response;
}

export function getBalanceTotal(total, payments) {
    if (payments.length) {
        return total - getTotalPaid(payments)
    } else {
        return total
    }
}

export function getFinalBalanceTotal(total, payments, storedPayment) {
    if (payments.length || storedPayment.length) {
        return total - (getTotalPaid(payments) + getTotalPaid(storedPayment))
    } else {
        return total
    }
}

export function getTotalPaid(payments) {
    let paid = 0;
    if (payments.length) {
        payments.map(data => {
            let payment = data.payment ? parseFloat(data.payment) : 0;
            paid = paid + payment;
        });
    }
    return paid
}

export function validatePaymentAmount(payments, total) {
    let response;
    if (total < getTotalPaid(payments)) {
        response = 'Please remove the extra payment'
    }
    return response;
}

export function validatePayment(payments, total) {
    if (!payments.length) return false;
    if (validatePaymentAmount(payments, total)) return validatePaymentAmount(payments, total);
    let response = false;
    payments.map(payment => {
        if (validateEmptyInputText(payment.payment_date)) {
            response = 'payment_date';
        } else if (validateId(payment.deposited_to)) {
            response = 'deposited_to';
        } else if (payment.payment_mode === 'Cheque') {
            if (validateChequeDate(payment.cheque_date, payment.payment_date)) {
                response = 'cheque_date';
            } else if (validateChequeDigit(payment.cheque_no)) {
                response = 'cheque_no';
            } else if (validateId(payment.bank_id)) {
                response = 'cheque_bank_id';
            }
        } else if (payment.payment_mode === 'Direct Deposit') {
            if (validateEmptyInputText(payment.deposited_date)) {
                response = 'deposited_date';
            } else if (validateEmptyInputText(payment.account_no)) {
                response = 'account_no';
            } else if (validateId(payment.bank_id)) {
                response = 'account_bank_id';
            }
        } else if (payment.payment_mode === 'Credit Card') {
            if (validateEmptyInputText(payment.card_holder_name)) {
                response = 'card_holder_name';
            } else if (validateCreditCardDigit(payment.card_no)) {
                response = 'card_no';
            } else if (validateDate(payment.expiry_date, payment.payment_date)) {
                response = 'expiry_date';
            } else if (validateId(payment.bank_id)) {
                response = 'card_bank_id';
            }
        }
    });
    return response;
}

export function newValidateProductId(product_id, order_items) {
    const result = order_items.filter(item => item.product_id === product_id);
    let response;
    if (!product_id) {
        response = 'Select a valid field'
    } else if (product_id === 0) {
        response = 'Select a valid field'
    } else if (result.length) {
        response = 'Already added product'
    }
    return response;
}

export function validateProductId(product_id, order_items, previousIndex, isEdit) {
    const index = findIndex(order_items, function (o) {
        return o.product_id === product_id;
    });
    let response;
    if (!product_id) {
        response = 'Select a valid field'
    } else if (product_id === 0) {
        response = 'Select a valid field'
    } else if (index >= 0) {
        if (isEdit && index !== previousIndex) {
            response = 'Already added product'
        } else if (!isEdit) {
            response = 'Already added product'
        }
    }
    return response;
}

export function validateLineItems(lineItems) {
    if (!lineItems.length) return false;
    let response = false;
    lineItems.map(lineItem => {
        if (validateProductId(lineItem.product_id)) {
            response = 'product_id not found'
        }
        if (validateStock(lineItem.quantity, lineItem.stock)) {
            response = 'stock error'
        }
        if (validateId(lineItem.unit_type_id)) {
            response = 'unit_type_id error'
        }
        if (validateEmptyInputText(lineItem.quantity)) {
            response = 'quantity error'
        }
    });
    return response;
}

export function validateCreditLimit(mata, customer, payment, total) {
    let todayCreditAmount = getBalanceTotal(total, payment);
    if (mata.route_total_cl) {
        if (todayCreditAmount > mata.route_cl) {
            return 'Insufficient route credit level'
        }
    }
    if (mata.rep_total_cl) {
        if (todayCreditAmount > mata.rep_cl) {
            return 'Insufficient rep credit level'
        }
    }
    if (customer.credit_limit_amount) {
        if (todayCreditAmount > customer.balance_cl) {
            return 'Insufficient customer credit level'
        }
    }
}