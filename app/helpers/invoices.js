import {getSingleCustomerName} from "../../database/Customer/controller";
import uuidv1 from "uuid/v1";
import {ID} from "./createId";
import {get_payment_by_invoice_id} from "../../database/Payment/controller";
import moment from "moment";

export const transformInvoicesToList = (invoice) => {
    if (!invoice) return [];
    return changeInvoiceList(invoice);
};

function changeInvoiceList(invoice) {
    let invoiceArray = [];
    invoice.map((value) => {
        let invoiceList = {};
        invoiceList.id = value.id;
        invoiceList.sales_order_id = value.sales_order_id;
        getSingleCustomerName(value.customer_id).done(data => {
            invoiceList.customer_name = data.display_name ? data.display_name : data.last_name;
            invoiceList.tamil_name = data.tamil_name ? data.tamil_name : '';
        });
        get_payment_by_invoice_id(value.id).done(data => {
            invoiceList.due_amount = value.amount - getDeuAmount(data);
        });
        invoiceList.amount = value.amount;
        invoiceList.invoice_no = value.invoice_no;
        invoiceList.ref = value.ref;
        invoiceList.status = value.status;
        invoiceList.invoice_date = value.invoice_date;
        invoiceList.not_sync = value.not_sync;
        invoiceArray.push(invoiceList)
    });
    return invoiceArray;
}

export function getDeuAmount(data) {
    let paid = 0;
    if (data.length) {
        data.map(payment => {
            paid += payment.payment;
        });
    }
    return paid;
}

export const transformInvoices = (invoices) => {
    if (!invoices) return [];
    return changeKeyObject(invoices);
};

function changeKeyObject(invoices) {
    invoices.map((value) => {
        value.u_id = uuidv1();
    });
    return invoices;
}

export const transformPayments = (payments) => {
    if (!payments) return [];
    return changePaymentsObject(payments);
};

function changePaymentsObject(payments) {
    payments.map((value) => {
        value.u_id = uuidv1();
    });
    return payments;
}

export const transformPayment = (items) => {
    if (!items) return {};
    return transformPaymentData(items);
};

function transformPaymentData(items) {
    let paymentData = {};
    paymentData.payment_type = items.payment_type;
    paymentData.uuid = items.uuid;
    paymentData.payment_mode = items.payment_mode;
    paymentData.payment = items.payment;
    paymentData.payment_date = items.payment_date;
    paymentData.deposited_to = items.deposited_to;
    paymentData.cheque_no = items.cheque_no ? items.cheque_no : '';
    paymentData.cheque_date = items.cheque_date ? items.cheque_date : '';
    paymentData.cheque_type = items.cheque_type;
    paymentData.card_holder_name = items.card_holder_name ? items.card_holder_name : '';
    paymentData.card_no = items.card_no ? items.card_no : '';
    paymentData.expiry_date = items.expiry_date ? items.expiry_date : '';
    paymentData.bank_id = items.bank_id ? items.bank_id : '';
    paymentData.account_no = items.account_no ? items.account_no : '';
    paymentData.deposited_date = items.deposited_date ? items.deposited_date : '';
    paymentData.gps_lat = items.gps_lat ? items.gps_lat : '';
    paymentData.gps_long = items.gps_long ? items.gps_long : '';
    paymentData.notes = items.notes ? items.notes : '';
    paymentData.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return paymentData;
}

export const transformInvoiceItemToSync = (items) => {
    if (!items) return {};
    return transformInvoiceData(items);
};

function transformInvoiceData(items) {
    let invoiceData = {};
    invoiceData.invoice_date = items.invoice_date;
    invoiceData.uuid = items.uuid;
    invoiceData.due_date = items.due_date;
    invoiceData.amount = items.amount;
    invoiceData.notes = items.notes;
    invoiceData.ref = items.ref;
    return invoiceData;
}

export const createInvoiceToSync = (order, invoice_ref) => {
    if (!order) return {};
    return createInvoiceData(order, invoice_ref)
};

function createInvoiceData(order, invoice_ref) {
    let invoiceData = {};
    invoiceData.invoice_date = order.order_date;
    invoiceData.uuid = order.uuid;
    invoiceData.due_date = order.order_date;
    invoiceData.amount = order.total;
    invoiceData.ref = invoice_ref;
    invoiceData.notes = 'Auto generated';
    invoiceData.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return invoiceData;
}

export const createInvoiceToStore = (order, invoice_ref) => {
    if (!order) return {};
    return createOfflineInvoiceData(order, invoice_ref)
};

function createOfflineInvoiceData(order, invoice_ref) {
    let invoiceData = {};
    invoiceData.invoice_date = order.order_date;
    invoiceData.due_date = order.order_date;
    invoiceData.amount = parseFloat(order.total);
    invoiceData.ref = invoice_ref;
    invoiceData.notes = 'Auto generated';
    invoiceData.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

    invoiceData.id = ID();
    invoiceData.invoice_no = invoice_ref;
    invoiceData.uuid = order.uuid;
    invoiceData.not_sync = true;
    invoiceData.status = 'Open';
    invoiceData.sales_order_id = order.id;
    invoiceData.customer_id = order.customer_id;
    invoiceData.business_type_id = order.business_type_id;
    invoiceData.company_id = order.company_id;
    return invoiceData;
}