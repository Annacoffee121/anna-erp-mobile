import {getSingleCustomerData, insertCustomerData} from "../../../database/Customer/controller";
import {
    transformBulkCustomerPaymentOutstanding,
    transformCustomerInvoiceOutstanding, transformCustomerOrderOutstanding,
    transformCustomerPaymentOutstanding
} from "../../helpers/customer";

//Update customer order Outstanding
export const updateCustomerOrderOutstanding = (order) => {
    getSingleCustomerData(order.customer_id).then(customer => {
        let newData = transformCustomerOrderOutstanding(order, customer.outstanding);
        insertCustomerData(newData).catch(error => console.log(error, 'error'))
    });
};

//Update customer invoice Outstanding
export const updateCustomerInvoiceOutstanding = (invoice) => {
    getSingleCustomerData(invoice.customer_id).then(customer => {
        let newData = transformCustomerInvoiceOutstanding(invoice, customer.outstanding);
        insertCustomerData(newData).catch(error => console.log(error, 'error'))
    });
};

//Update customer payment Outstanding
export const updateCustomerPaymentOutstanding = (payment) => {
    getSingleCustomerData(payment.customer_id).then(customer => {
        let newData = transformCustomerPaymentOutstanding(payment, customer);
        insertCustomerData(newData).catch(error => console.log(error, 'error'))
    });
};

//Update customer bulk payment Outstanding
export const updateBulkCustomerPaymentOutstanding = (customer_id, paymentTotal) => {
    getSingleCustomerData(customer_id).then(customer => {
        let newData = transformBulkCustomerPaymentOutstanding(paymentTotal, customer.outstanding, customer_id);
        insertCustomerData(newData).catch(error => console.log(error, 'error'))
    });
};