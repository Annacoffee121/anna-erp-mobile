import {getSingleOrderData, updateOrderInvoiceStatusData, updateOrderStatusData} from "../../database/Order/controller";
import {updateInvoiceStatus} from "../../database/Invoice/controller";

export const changeOrderStatus = (orderId) => {
    getSingleOrderData(orderId).then(async (value) => {
        let totalAmount = value.total;
        let invoicedAmount = 0;
        let totalPayment = 0;
        let orderInvoiceStatusValue = null;
        let orderStatusValue = null;
        let invoiceStatusValue = null;
        if (value.payments.length) {
            value.payments.map(invoice => {
                totalPayment = totalPayment + invoice.payment;
            });
        }

        value.invoices.map(invoice => {
            invoicedAmount = invoicedAmount + invoice.amount;
        });

        if (totalAmount === invoicedAmount && invoicedAmount === totalPayment) {
            orderStatusValue = 'Closed';
        } else {
            orderStatusValue = 'Open';
        }

        if (value.invoices.length === 0) {
            orderInvoiceStatusValue = 'Pending';
        } else if (value.invoices.length > 0 && totalAmount === invoicedAmount) {
            orderInvoiceStatusValue = 'Invoiced';
        } else if (value.invoices.length > 0 && totalAmount > invoicedAmount) {
            orderInvoiceStatusValue = 'Partially Invoiced';
        }

        if (totalAmount === invoicedAmount && invoicedAmount === totalPayment) {
            invoiceStatusValue = 'Paid';
        } else if (invoicedAmount > totalPayment && totalPayment > 0) {
            invoiceStatusValue = 'Partially Paid';
        } else {
            invoiceStatusValue = 'Open';
        }

        await updateOrderInvoiceStatusData(orderId, orderInvoiceStatusValue).then().catch((error) => {
            console.log(error, 'error')
        });

        await updateOrderStatusData(orderId, orderStatusValue).then().catch((error) => {
            console.log(error, 'error')
        });

        if (value.invoices[0]){
            await updateInvoiceStatus(value.invoices[0].id, invoiceStatusValue).then().catch((error) => {
                console.log(error, 'error')
            });
        }
    });
};

