import {
    CUSTOMER_SCHEMA, CONTACT_PERSON_SCHEMA, OUTSTANDING_SCHEMA, ADDRESS_SCHEMA,
    OUTSTANDING_ORDER_SCHEMA, NOT_REALIZED_CHEQUE_SCHEMA
} from "./index";

export const CustomerSchema = {
    name: CUSTOMER_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int',
        code: 'string?',
        credit_limit_amount: 'double?',
        balance_cl: 'double?',
        credit_limit_notify_rate: 'double?',
        salutation: 'string',
        first_name: 'string',
        last_name: 'string',
        full_name: 'string?',
        display_name: 'string',
        tamil_name: 'string?',
        phone: 'string?',
        fax: 'string?',
        mobile: 'string?',
        email: 'string?',
        website: 'string?',
        type: 'string?',
        gps_lat: 'double?',
        gps_long: 'double?',
        notes: 'string?',
        is_active: 'string?',
        route_id: 'int',
        route_name: 'string?',
        location_id: 'int?',
        daily_sale_id: 'int?',
        location_name: 'string?',
        country_id: 'int?',
        country_name: 'string?',
        street_one: 'string?',
        street_two: 'string?',
        city: 'string?',
        province: 'string?',
        postal_code: 'string?',
        logo_file: 'string?',
        not_sync: 'bool?',
        outstanding: {type: OUTSTANDING_SCHEMA, objectType: OUTSTANDING_SCHEMA},
        contact_persons: {type: 'list', objectType: CONTACT_PERSON_SCHEMA},
        addresses: {type: 'list', objectType: ADDRESS_SCHEMA},
        outstanding_orders: {type: 'list', objectType: OUTSTANDING_ORDER_SCHEMA},
        not_realized_cheque: {type: 'list', objectType: NOT_REALIZED_CHEQUE_SCHEMA},
    }
};

export const ContactPersonSchema = {
    name: CONTACT_PERSON_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int?',
        salutation: 'string?',
        first_name: 'string?',
        last_name: 'string?',
        full_name: 'string?',
        phone: 'string?',
        mobile: 'string?',
        email: 'string?',
        designation: 'string?',
        department: 'string?',
        is_active: 'string?',
    }
};

export const OutstandingSchema = {
    name: OUTSTANDING_SCHEMA,
    properties: {
        ordered: 'double?',
        invoiced: 'double?',
        paid: 'double?',
        balance: 'double?',
    }
};

export const OutstandingOrderSchema = {
    name: OUTSTANDING_ORDER_SCHEMA,
    properties: {
        id: 'int?',
        ref: 'string?',
        order_no: 'string?',
        order_date: 'string?',
        amount: 'double?',
    }
};

export const NotRealizedChequeSchema = {
    name: NOT_REALIZED_CHEQUE_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int?',
        payment: 'double?',
        payment_date: 'string?',
        cheque_type: 'string?',
        cheque_no: 'string?',
        cheque_date: 'string?',
        bank_id: 'int?',
        deposited_to: 'int?',
        payment_type: 'string?',
        bank_name: 'string?'
    }
};

export const CustomerAddressSchema = {
    name: ADDRESS_SCHEMA,
    properties: {
        street_one: 'string?',
        street_two: 'string?',
        city: 'string?',
        province: 'string?',
        postal_code: 'string?',
        country_id: 'int?'
    }
};