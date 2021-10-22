import {postNewPayment} from "../invoice";
import {transformPayment} from "../../helpers/invoices";
import {getSingleInvoiceData} from "../../../database/Invoice/controller";
import {getNotSyncPaymentData} from "../../../database/Payment/controller";
import {updatePaymentInRealm} from "../databaseService/payment";
import {syncNew as syncNewInvoice} from './invoice'
import {changeOrderStatus} from "../../helpers/changeStatus";
import {sortedUniqBy} from "lodash";

export const getNotSyncData = () => {
    return getNotSyncPaymentData().then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const syncAllPayment = async () => {
    return await getNotSyncData().then(async (payments) => {
        const uniquePayments = sortedUniqBy(payments, "uuid");
        await Promise.all(uniquePayments.map(async (payment) => {
            await syncNew(payment, payment.invoice_id).then(result => {
                return result;
            });
        }));
    });
};

export const syncNew = (payment, invoiceId) => {
    return getSingleInvoiceData(invoiceId).then(invoice => {
        if (invoice.not_sync) {
            return syncNewInvoice(invoice, invoice.sales_order_id).then(syncedInvoice => {
                return syncWithServer(payment, syncedInvoice.id, syncedInvoice.sales_order_id)
            }).catch(error => console.log(error))
        } else {
            return syncWithServer(payment, invoiceId, invoice.sales_order_id)
        }
    });

};

const syncWithServer = async (payment, invoiceId, orderId) => {
    let mappedPayment = transformPayment(payment);
    return await postNewPayment(mappedPayment, invoiceId).then(async (value) => {
        if (value.id) {
            await updatePaymentInRealm(value, payment.id).catch(error => console.log(error));
            changeOrderStatus(orderId);
        }
        return value
    }).catch(exception => {
        console.log(exception, 'exception');
        return exception
    });
};