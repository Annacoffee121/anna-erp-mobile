export const PRINTER_SCHEMA = "printer";

export const PrinterSchema = {
    name: PRINTER_SCHEMA,
    primaryKey: 'uid',
    properties: {
        uid: 'int',
        id: 'string?',
        name: 'string?',
        message: 'string?',
        connect_status: 'bool?',
    }
};