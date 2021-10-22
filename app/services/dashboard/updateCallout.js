import {getOrderByCustomerId} from "../../../database/Order/controller";
import {getInvoiceByCustomerId} from "../../../database/Invoice/controller";
import {getPaymentByCustomerId} from "../../../database/Payment/controller";
import moment from "moment/moment";
import {getOutstandingByCusId} from "../../../database/Dashboard/controller";

export const getAllCallOutData = async (id) => {
    let no_of_order = 0;
    let total_sales = 0;
    let no_of_invoice = 0;
    let total_invoiced = 0;
    let received_payment = 0;
    let old_sales = 0;
    let outstanding = 0;
    await getOrderByCustomerId(id).then(orders => {
        no_of_order = checkOrderDate(orders).length;
        checkOrderDate(orders).map(order => total_sales = total_sales + order.total)
    });
    await getInvoiceByCustomerId(id).then(invoices => {
        no_of_invoice = checkInvoiceDate(invoices).length;
        checkInvoiceDate(invoices).map(invoice => total_invoiced = total_invoiced + invoice.amount)
    });
    await getPaymentByCustomerId(id).then(payments => {
        getTodayPayments(payments).map(payment => received_payment = received_payment + payment.payment);
        getPreviousPayments(payments).map(payment => old_sales = old_sales + payment.payment);
    });
    await getOutstandingByCusId(id).then(outstandingAmount => {
        outstanding = outstandingAmount - old_sales;
    });

    let payment_reminding = total_sales - received_payment;
    let totalOutstanding = outstanding + payment_reminding;
    return {id, no_of_order, no_of_invoice, total_sales, total_invoiced, received_payment, payment_reminding, old_sales, outstanding : totalOutstanding};
};

function checkOrderDate(orders) {
    let now = moment().format('YYYY-MM-DD');
    return orders.filter(function (order) {
        return moment(order.order_date).isSame(now);
    });
}

function checkInvoiceDate(orders) {
    let now = moment().format('YYYY-MM-DD');
    return orders.filter(function (order) {
        return moment(order.invoice_date).isSame(now);
    });
}

function getTodayPayments(payments) {
    let now = moment().format('YYYY-MM-DD');
    return payments.filter(function (payment) {
        return moment(payment.payment_date).isSame(now) && moment(payment.invoice.invoice_date).isSame(now);
    });
}

function getPreviousPayments(payments) {
    let now = moment().format('YYYY-MM-DD');
    return payments.filter(function (payment) {
        return moment(payment.payment_date).isSame(now) && moment(payment.invoice.invoice_date).isBefore(now);
    });
}
