import {postNewInvoice} from "../../invoice";
import {transformInvoiceItemToSync} from "../../../helpers/invoices";
import {get_payment_by_invoice_id, update_payment_by_invoice_id} from "../../../../database/Payment/controller";
import {updateInvoiceInRealm} from "../../databaseService/invoice";
import {getNotSyncInvoiceData} from "../../../../database/Invoice/controller";
import {changeOrderStatus} from "../../../helpers/changeStatus";

const getNotSyncData = () => {
    return getNotSyncInvoiceData().then(value => {
        return value ? value : [];

    }).catch(error => console.log(error))
};

export const autoSyncInvoice = async () => {
    return await getNotSyncData().then(async (invoices) => {
        await Promise.all(invoices.map(async (invoice) => {
            await syncNew(invoice, invoice.sales_order_id).then(result => {
                return result;
            });
        }));
    });
};

const syncNew = (invoice, orderId) => {
    return syncWithServer(invoice, orderId)
};

const syncWithServer = async (invoice, orderId) => {
    let mappedInvoice = transformInvoiceItemToSync(invoice);
    return await postNewInvoice(mappedInvoice, orderId).then(async (value) => {
        if (value.id) {
            if (invoice.id) {
                await updatePaymentInvoiceId(value.id, invoice.id);
            }
            await changeOrderStatus(orderId);
            updateInvoiceInRealm(value, invoice.id).then(() => {
                return value
            }).catch(error => console.log(error))
        } else {
            return value
        }
    }).catch(exception => {
        console.log(exception, 'Invoice Create exception')
    });
};

//Update Payment by invoice id
export const getPaymentsToUpdateInvoiceId = (invoice_id) => {
    return get_payment_by_invoice_id(invoice_id).then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const updatePaymentInvoiceId = (new_id, invoice_id) => {
    return getPaymentsToUpdateInvoiceId(invoice_id).then((payments) => {
        payments.map((payment) => {
            updatePaymentInvId(payment.id, new_id);
        });
    });
};

export const updatePaymentInvId = (id, new_id) => {
    return update_payment_by_invoice_id(id, new_id).then(value => {
        return value;
    }).catch(error => console.log(error))
};