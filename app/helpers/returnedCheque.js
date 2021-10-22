import v4 from 'uuid'
import {filter} from "lodash";

export const changeRCForDataStore = (chequeData) => {
    if (!chequeData) return {};
    return transformData(chequeData);
};

function transformData(chequeData) {
    let cheque = {};
    cheque.cheque_no = chequeData.cheque_no;
    cheque.customer = chequeData.customer;
    cheque.bank = chequeData.bank;
    cheque.cheque_date = chequeData.cheque_date;
    cheque.status = chequeData.status;
    cheque.total = chequeData.total;
    cheque.payments = transformPaymentData(chequeData.payments, true);
    return cheque;
}

function transformPaymentData(payments, online) {
    const data = [];
    payments.map(payment => {
        let value = {};
        value.uuid = payment.uuid ? payment.uuid : v4();
        value.id = payment.id ? payment.id : null;
        value.payment = payment.payment ? parseFloat(payment.payment) : null;
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
        value.bank_id = payment.bank_id ? payment.bank_id : null;
        value.prepared_by = payment.prepared_by ? payment.prepared_by : null;
        value.notes = payment.notes ? payment.notes : '';
        value.gps_lat = payment.gps_lat ? payment.gps_lat : null;
        value.gps_long = payment.gps_long ? payment.gps_long : null;
        value.is_not_synced = !online;
        value.is_printed = payment.is_printed ? payment.is_printed : null;
        value.created_at = '';
        data.push(value);
    });
    return data;
}

export function transformSinglePayment(payment, uuid, online) {
    let value = {};
    value.uuid = uuid ? uuid : v4();
    value.id = payment.id ? payment.id : null;
    value.payment = payment.payment ? parseFloat(payment.payment) : null;
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
    value.bank_id = payment.bank_id ? payment.bank_id : null;
    value.prepared_by = payment.prepared_by ? payment.prepared_by : null;
    value.notes = payment.notes ? payment.notes : '';
    value.gps_lat = payment.gps_lat ? payment.gps_lat : null;
    value.gps_long = payment.gps_long ? payment.gps_long : null;
    value.is_not_synced = !online;
    value.is_printed = payment.is_printed ? payment.is_printed : null;
    value.created_at = '';
    return value;
}

export function convertDataToPrint(chequeData) {
    const payments = filter(chequeData.payments, o => o.is_printed !== "Yes");
    let cheque = {};
    cheque.cheque_no = chequeData.cheque_no;
    cheque.customer = chequeData.customer;
    cheque.bank = chequeData.bank;
    cheque.cheque_date = chequeData.cheque_date;
    cheque.status = chequeData.status;
    cheque.total = chequeData.total;
    cheque.payments = {...payments};
    return cheque;
}
