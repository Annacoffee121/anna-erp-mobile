import {PAYMENT_SCHEMA} from "./index";

export const PaymentSchema = {
    name: PAYMENT_SCHEMA,
    primaryKey: 'u_id', //Primary key
    properties: {
        u_id: 'string',
        uuid: 'string?',
        id: 'int',
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
        card_holder_name:'string?',
        card_no:'string?',
        expiry_date:'string?',
        bank_id: 'int?',
        status: 'string?',
        notes: 'string?',
        prepared_by: 'int?',
        invoice_id: 'int?',
        sales_order_id: 'int?',
        customer_id: 'int?',
        business_type_id: 'int?',
        company_id: 'int?',
        deposited_to: 'int?',
        bank_name: 'string?',
        gps_lat: 'double?',
        gps_long: 'double?',
        not_sync: 'bool?',
        created_at:'string?',
    }
};