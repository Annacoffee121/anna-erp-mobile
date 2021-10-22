import {BUSINESS_TYPE_SCHEMA,UNIT_TYPE_SCHEMA, DEPOSITED_TO_SCHEMA, BANK_SCHEMA} from "./index";

export const BusinessTypeSchema = {
    name: BUSINESS_TYPE_SCHEMA,
    primaryKey: 'value', //Primary key
    properties: {
        value: 'int',
        name: 'string',
    }
};

export const UnitTypeSchema = {
    name: UNIT_TYPE_SCHEMA,
    primaryKey: 'value', //Primary key
    properties: {
        value: 'int',
        name: 'string',
    }
};

export const DepositedToSchema = {
    name: DEPOSITED_TO_SCHEMA,
    primaryKey: 'value', //Primary key
    properties: {
        value: 'int',
        name: 'string',
    }
};

export const BankSchema = {
    name: BANK_SCHEMA,
    primaryKey: 'value', //Primary key
    properties: {
        value: 'int',
        name: 'string',
    }
};