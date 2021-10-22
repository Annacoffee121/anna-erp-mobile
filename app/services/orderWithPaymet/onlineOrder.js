import moment from "moment";
import {insertOrderInRealm} from "../databaseService/order";
import {postNewOrder} from "../order/index";
import {transformOrderItems} from "../../helpers/itemTransfomer";
import {updateOrderNumber} from "../number/order";
import {
    updateBulkCustomerPaymentOutstanding,
    updateCustomerInvoiceOutstanding, updateCustomerOrderOutstanding
} from "../customer/outstandingUpdate";
import {updateDashboardCalloutValue} from "../../actions/dashboard/index";
import {addSoldStock} from "../product/stockUpdate";
import {createInvoiceToSync} from "../../helpers/invoices";
import {postNewInvoice, postNewPayment} from "../invoice/index";
import {insertInvoiceInRealm} from "../databaseService/invoice";
import {changeOrderStatus} from "../../helpers/changeStatus";
import {updateInvoiceNumber} from "../number/invoice";
import {insertPaymentInRealm} from "../databaseService/payment";
import {getTotalPaid} from "../../helpers/customerValidation";
import {reduceCreditLevel} from "../../helpers/mata";

export const syncOrder = async (order, payments, invoice_ref) => {
    let mappedOrder = transformOrderItems(order);
    return await postNewOrder(mappedOrder).then(async responseOrder => {
        if (responseOrder.id) {
            await insertOrderInRealm(responseOrder).then(async () => {
                updateOrderNumber(order.ref);
                addSoldStock(order.order_items);
                updateCustomerOrderOutstanding(responseOrder);
                await syncInvoice(responseOrder, invoice_ref).then(async responseInvoice => {
                    if (!payments.length) return reduceCreditLevel(responseOrder, null);
                    await syncAllPayment(payments, responseInvoice.id).then(() => {
                        updateBulkCustomerPaymentOutstanding(responseOrder.customer_id, getTotalPaid(payments));
                        reduceCreditLevel(responseOrder, getTotalPaid(payments));
                        updateDashboardCalloutValue(responseOrder.customer_id);
                        changeOrderStatus(responseOrder.id);
                    }).catch(error => console.warn(error));
                });
            }).catch(error => console.warn(error));
        }
        return await responseOrder;
    }).catch(exception => {
        console.warn(exception, 'orders exception');
        return exception
    });
};

const syncInvoice = async (responseOrder, invoice_ref) => {
    let mappedInvoice = createInvoiceToSync(responseOrder, invoice_ref);
    return await postNewInvoice(mappedInvoice, responseOrder.id).then(async (responseInvoice) => {
        if (responseInvoice.id) {
            insertInvoiceInRealm(responseInvoice).then(() => {
                changeOrderStatus(responseOrder.id);
                updateInvoiceNumber(mappedInvoice.ref);
                updateCustomerInvoiceOutstanding(responseInvoice);
                updateDashboardCalloutValue(responseOrder.customer_id);
            });
        }
        return responseInvoice
    }).catch(exception => {
        console.warn(exception, 'invoice exception');
        return exception;
    });
};

const syncAllPayment = async (payments, invoice_id) => {
    await Promise.all(payments.map(async (payment) => {
        await syncPayment(payment, invoice_id).then(result => {
            return result;
        });
    }));
};

const syncPayment = async (payment, invoice_id) => {
    payment.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return await postNewPayment(payment, invoice_id).then(async (responsePayment) => {
        if (responsePayment.id) {
            insertPaymentInRealm(responsePayment).then(() => {
                return responsePayment
            });
        }
    }).catch(exception => {
        return exception
    });
};
