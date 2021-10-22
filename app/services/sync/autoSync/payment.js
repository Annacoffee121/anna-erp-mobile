import {postNewPayment} from "../../invoice";
import {transformPayment} from "../../../helpers/invoices";
import {getSingleInvoiceData} from "../../../../database/Invoice/controller";
import {getNotSyncPaymentData} from "../../../../database/Payment/controller";
import {updatePaymentInRealm} from "../../databaseService/payment";
import {changeOrderStatus} from "../../../helpers/changeStatus";

const getNotSyncData = () => {
    return getNotSyncPaymentData().then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const autoSyncPayment = async () => {
    return await getNotSyncData().then(async (payments) => {
        await Promise.all(payments.map(async (payment) => {
            await syncNew(payment, payment.invoice_id).then(result => {
                return result;
            });
        }));
    });
};

const syncNew = (payment, invoiceId) => {
    return getSingleInvoiceData(invoiceId).then(invoice => {
        return syncWithServer(payment, invoiceId, invoice.sales_order_id)
    });

};

const syncWithServer = async (payment, invoiceId, orderId) => {
    let mappedPayment = transformPayment(payment);
    return await postNewPayment(mappedPayment, invoiceId).then(async (value) => {
        if (value.id) {
            await changeOrderStatus(orderId);
            updatePaymentInRealm(value, payment.id).then(() => {
                return value;
            }).catch(error => console.log(error));
        } else {
            return value;
        }
    }).catch(exception => {
        console.log(exception, 'exception');
        return exception
    });
};