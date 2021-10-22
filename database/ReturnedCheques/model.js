import {RETURNED_CHEQUES_SCHEMA, RETURNED_CHEQUES_PAYMENT_SCHEMA} from "./index";

export const ReturnChequesSchema = {
    name: RETURNED_CHEQUES_SCHEMA,
    primaryKey: 'cheque_no', //Primary key
    properties: {
        cheque_no: 'string',
        customer: 'string?',
        bank: 'string?',
        cheque_date: 'string?',
        total: 'double?',
        payments: {type: 'list', objectType: RETURNED_CHEQUES_PAYMENT_SCHEMA}
    }
};

export const ReturnChequesPaymentSchema = {
    name: RETURNED_CHEQUES_PAYMENT_SCHEMA,
    primaryKey: 'uuid', //Primary key
    properties: {
        uuid: 'string',
        id: 'int?',
        payment: 'double?',
        payment_date: 'string?',
        payment_type: 'string?',
        payment_mode: 'string?',
        payment_from: 'string?',
        cheque_no: 'string?',
        cheque_date: 'string?',
        cheque_type: 'string?',
        account_no: 'string?',
        deposited_date: 'string?',
        card_holder_name: 'string?',
        card_no: 'string?',
        expiry_date: 'string?',
        bank_id: 'int?',
        status: 'string?',
        notes: 'string?',
        prepared_by: 'int?',
        deposited_to: 'int?',
        bank_name: 'string?',
        gps_lat: 'double?',
        gps_long: 'double?',
        created_at: 'string?',
        is_not_synced: 'bool?',
        is_printed: 'string?'
    }
};
