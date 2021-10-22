import {
    ROUTE_SCHEMA,
    MARKER_POINT_SCHEMA,
    ROUTE_CUSTOMER_SCHEMA,
    TARGET_SCHEMA,
    TARGET_LIST_SCHEMA
} from "./index";

export const RouteSchema = {
    name: ROUTE_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int',
        code: 'string',
        name: 'string',
        is_active: 'string',
        start_point: {type: MARKER_POINT_SCHEMA, objectType: MARKER_POINT_SCHEMA},
        end_point: {type: MARKER_POINT_SCHEMA, objectType: MARKER_POINT_SCHEMA},
        customers: {type: 'list', objectType: ROUTE_CUSTOMER_SCHEMA},
        way_points: {type: 'list', objectType: MARKER_POINT_SCHEMA},
        notes: {type: 'string', optional: true},
        // targets: {type: TARGET_LIST_SCHEMA, optional: true},
        targets: {type: 'list', objectType: TARGET_SCHEMA},
    }
};

export const MarkerPointSchema = {
    name: MARKER_POINT_SCHEMA,
    properties: {
        latitude: 'double?',
        longitude: 'double?',
    }
};

export const RouteCustomerSchema = {
    name: ROUTE_CUSTOMER_SCHEMA,
    primaryKey: 'id', //Primary key
    properties: {
        id: 'int',
        code: 'string?',
        salutation: 'string?',
        first_name: 'string?',
        last_name: 'string?',
        full_name: 'string?',
        display_name: 'string?',
        phone: 'string?',
        fax: 'string?',
        mobile: 'string?',
        email: 'string?',
        website: 'string?',
        type: 'string?',
        notes: {type: 'string', optional: true},
        outstanding: 'double?',
        no_of_order: 'int?',
        total_sales: 'double?',
        no_of_invoice: 'int?',
        total_invoiced: 'double?',
        received_payment: 'double?',
        payment_reminding: 'double?',
        old_sales: 'double?',
        latLon: {type: MARKER_POINT_SCHEMA, objectType: MARKER_POINT_SCHEMA},
        marker_type: 'string?',
    }
};

export const TargetSchema = {
    name: TARGET_SCHEMA,
    // primaryKey: 'id', //Primary key
    properties: {
        id: 'int?',
        start_date: 'string?',
        end_date: 'string?',
        is_active: 'string?',
        achieved: {type: 'double', optional: true},
        target: 'string?',
        type: 'string?',
    }
};

export const TargetListSchema = {
    name: TARGET_LIST_SCHEMA,
    properties: {
        entries: {type: 'list', objectType: TARGET_SCHEMA}
    }
};