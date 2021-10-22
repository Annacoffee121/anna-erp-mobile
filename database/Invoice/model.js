import {INVOICE_SCHEMA} from "./index";

export const InvoiceSchema = {
    name: INVOICE_SCHEMA,
    primaryKey: 'u_id', //Primary key
    properties: {
        u_id: 'string',
        uuid: 'string?',
        id: 'int',
        invoice_no: 'string?',
        invoice_date: 'string?',
        due_date: 'string?',
        invoice_type: 'string?',
        ref: 'string?',
        amount: 'double?',
        prepared_by: 'int?',
        approval_status: 'string?',
        status: 'string?',
        notes: 'string?',
        sales_order_id: 'int?',
        customer_id: 'int?',
        business_type_id: 'int?',
        company_id: 'int?',
        not_sync: 'bool?',
        created_at:'string?',
    }
};