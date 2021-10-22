import moment from "moment";
import v4 from "uuid";
import {ID} from "./createId";

export const transformPayment = (payment) => {
    if (!payment) return [];
    return changeKeyObject(payment);
};

function changeKeyObject(payment) {
    let value = {};
    value.payment_type = payment.payment_type;
    value.payment_mode = payment.payment_mode;
    value.payment = payment.payment;
    value.payment_date = payment.payment_date;
    value.deposited_to = payment.deposited_to;
    value.cheque_no = payment.cheque_no;
    value.cheque_date = payment.cheque_date;
    value.cheque_type = payment.cheque_type;
    value.account_no = payment.account_no;
    value.deposited_date = payment.deposited_date;
    value.card_holder_name = payment.card_holder_name;
    value.card_no = payment.card_no;
    value.expiry_date = payment.expiry_date;
    value.bank_id = payment.bank_id;
    value.notes = payment.notes;
    return value;
}

export const transformPaymentToEdit = (payment) => {
    if (!payment) return [];
    return changePaymentObject(payment);
};

function changePaymentObject(payment) {
    let value = {};
    value.u_id = payment.u_id;
    value.id = payment.id;
    value.payment = payment.payment;
    value.payment_date = payment.payment_date;
    value.payment_type = payment.payment_type;
    value.payment_mode = payment.payment_mode;
    value.deposited_to = payment.deposited_to;
    value.cheque_no = payment.cheque_no ? payment.cheque_no : '';
    value.cheque_date = payment.cheque_date ? payment.cheque_date : '';
    value.cheque_type = payment.cheque_type ? payment.cheque_type : 'Own';
    value.account_no = payment.account_no ? payment.account_no : '';
    value.deposited_date = payment.deposited_date ? payment.deposited_date : '';
    value.card_holder_name = payment.card_holder_name ? payment.card_holder_name : '';
    value.card_no = payment.card_no ? payment.card_no : '';
    value.expiry_date = payment.expiry_date ? payment.expiry_date : '';
    value.bank_id = payment.bank_id ? payment.bank_id : '';
    value.notes = payment.notes ? payment.notes : '';
    return value;
}

export const changeRetunCreditNotePayment = (items) => {
    if (!items) return {};
    return transformCreditNotePayment(items);
};

function transformCreditNotePayment(items) {
    let paymentData = {};
    paymentData.payment_type = items.payment_type ? items.payment_type : "Partial payment";
    paymentData.id = items.id ? items.id : ID();
    paymentData.u_id = v4();
    paymentData.uuid = v4();
    paymentData.payment_mode = "Customer Credit";
    paymentData.payment = items.payment;
    paymentData.payment_date = items.payment_date ? items.payment_date : moment().format('YYYY-MM-DD');
    paymentData.deposited_to = 1;
    paymentData.invoice_id = items.invoice_id;
    paymentData.sales_order_id = items.sales_order_id;
    paymentData.customer_id = items.customer_id;
    paymentData.company_id = items.company_id ? items.company_id: '';
    paymentData.notes = 'Payment created from sales return with Credit resolution';
    paymentData.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return paymentData;
}