import {updateOrderNumber} from "../number/order";
import {
    updateBulkCustomerPaymentOutstanding,
    updateCustomerInvoiceOutstanding, updateCustomerOrderOutstanding,
} from "../customer/outstandingUpdate";
import {insertOrderData} from "../../../database/Order/controller";
import {updateDashboardCalloutValue} from "../../actions/dashboard";
import {transformOfflineOrderForRealm, transformOfflinePaymentForRealm} from "../../helpers/orders";
import {addSoldStock} from "../product/stockUpdate";
import {createInvoiceToStore} from "../../helpers/invoices";
import {insertInvoiceInRealm} from "../databaseService/invoice";
import {changeOrderStatus} from "../../helpers/changeStatus";
import {updateInvoiceNumber} from "../number/invoice";
import {insertPaymentInRealm} from "../databaseService/payment";
import {getTotalPaid} from "../../helpers/customerValidation";
import {reduceCreditLevel} from "../../helpers/mata";

export const storeOrder = async (order, payments, invoice_ref, customer) => {
    let mappedOrder = transformOfflineOrderForRealm(order, customer);
    return await insertOrderData(mappedOrder).then(async storedOrder => {
        updateOrderNumber(order.ref);
        addSoldStock(order.order_items);
        updateCustomerOrderOutstanding(storedOrder);
        await storeInvoice(storedOrder, invoice_ref).then(async storedInvoice => {
            if (!payments.length) return reduceCreditLevel(storedOrder, null);
            await storeAllPayment(payments, storedInvoice.id, storedOrder).then(() => {
                updateBulkCustomerPaymentOutstanding(storedOrder.customer_id, getTotalPaid(payments));
                reduceCreditLevel(storedOrder, getTotalPaid(payments));
                updateDashboardCalloutValue(storedOrder.customer_id);
                changeOrderStatus(storedOrder.id);
            }).catch(error => console.warn(error));
        }).catch(error => console.warn(error));
        return await storedOrder;
    }).catch((error) => {
        return error
    });
};

const storeInvoice = async (storedOrder, invoice_ref) => {
    let mappedInvoice = createInvoiceToStore(storedOrder, invoice_ref);
    return await insertInvoiceInRealm(mappedInvoice).then(async storedInvoice => {
        changeOrderStatus(storedOrder.id);
        updateInvoiceNumber(mappedInvoice.ref);
        updateCustomerInvoiceOutstanding(storedInvoice);
        updateDashboardCalloutValue(storedOrder.customer_id);
        return storedInvoice
    }).catch(exception => {
        return exception;
    });
};

const storeAllPayment = async (payments, invoice_id, storedOrder) => {
    await Promise.all(payments.map(async (payment) => {
        await storePayment(payment, invoice_id, storedOrder).then(result => {
            return result;
        });
    }));
};

const storePayment = async (payment, invoice_id, storedOrder) => {
    let mappedPayment = transformOfflinePaymentForRealm(payment, storedOrder, invoice_id);
    return await insertPaymentInRealm(mappedPayment).then(storedPayment => {
        return storedPayment;
    }).catch(error => {
        return error;
    });

};