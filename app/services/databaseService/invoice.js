import {getInvoiceById, insertInvoiceData} from "../../../database/Invoice/controller";
import uuidv1 from "uuid/v1";
import moment from "moment";

export const insertInvoiceInRealm = (invoice) => {
    invoice.u_id = uuidv1();
    if(invoice.created_at.date) {
        invoice.created_at = moment(invoice.created_at.date).format('YYYY-MM-DD HH:mm:ss');
    }
    return insertInvoiceData(invoice).catch(error => console.log(error, 'insert'));
};

export const updateInvoiceInRealm = (invoice, invoice_id) => {
    if (invoice_id) {
        return getInvoiceById(invoice_id).then(invoice_u_id => {
            invoice.u_id = invoice_u_id;
            invoice.not_sync = false;
            if(invoice.created_at.date) {
                invoice.created_at = moment(invoice.created_at.date).format('YYYY-MM-DD HH:mm:ss');
            }
            return insertInvoiceData(invoice).catch(error => console.log(error, 'insert'));
        });
    } else {
        return insertInvoiceInRealm(invoice).catch(error => console.log(error, 'insert'));
    }
};