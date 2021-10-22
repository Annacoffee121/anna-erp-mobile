import Realm from 'realm';
import {
    RouteSchema,
    MarkerPointSchema,
    RouteCustomerSchema,
    TargetSchema,
    TargetListSchema
} from './Dashboard/model'
import {
    CustomerSchema,
    ContactPersonSchema,
    OutstandingSchema,
    CustomerAddressSchema, OutstandingOrderSchema, NotRealizedChequeSchema
} from './Customer/model'
import {BusinessTypeSchema, UnitTypeSchema, DepositedToSchema, BankSchema} from './DropDown/model'
import {ProductsSchema} from './Products/model'
import {
    OrderSchema,
    OrderItemSchema,
} from './Order/model'
import {MataSchema, MataAllocationSchema} from './Mata/model'
import {InvoiceSchema} from './Invoice/model'
import {PaymentSchema} from './Payment/model'
import {ExpensesSchema, ExpensesTypeSchema} from "./Expenses/model";
import {NotVisitSchema} from "./NotVisited/model";
import {ReturnItemsSchema, SalesReturnSchema, ResolutionsSchema, ReplaceItemsSchema} from "./Returns/model";
import {ReturnProductsOrderSchema, ReturnProductsSchema} from "./ReturnProducts/model";
import {PrinterSchema} from "./Printer/model";
import {ReturnChequesSchema, ReturnChequesPaymentSchema} from "./ReturnedCheques/model";
import {PriceBookPricesSchema, PriceBookSchema} from "./PriceBook/model";

const AllSchema = [RouteSchema, MarkerPointSchema, RouteCustomerSchema, TargetSchema, TargetListSchema,
    CustomerSchema, ContactPersonSchema, OutstandingSchema, OutstandingOrderSchema,
    CustomerAddressSchema, BusinessTypeSchema, UnitTypeSchema, NotRealizedChequeSchema,
    DepositedToSchema, BankSchema, ProductsSchema, OrderSchema, OrderItemSchema, MataSchema, MataAllocationSchema, InvoiceSchema,
    PaymentSchema, ExpensesSchema, ExpensesTypeSchema, NotVisitSchema, SalesReturnSchema, ReturnItemsSchema, ResolutionsSchema, ReturnChequesPaymentSchema,
    ReplaceItemsSchema, ReturnProductsSchema, ReturnProductsOrderSchema, PrinterSchema, PriceBookSchema, PriceBookPricesSchema, ReturnChequesSchema];

const databaseOptions = {
    path: 'annaApp.realm',
    schema: AllSchema,
    schemaVersion: 0,
};

export default new Realm(databaseOptions);