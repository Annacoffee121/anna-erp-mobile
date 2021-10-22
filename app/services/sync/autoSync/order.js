import {getNotSyncOrderData} from "../../../../database/Order/controller";
import {transformOrderItems} from "../../../helpers/itemTransfomer";
import {postNewOrder} from "../../order";
import {get_invoice_by_sales_order_id, update_invoice_sales_order_id} from "../../../../database/Invoice/controller";
import {get_payment_by_sales_order_id, update_payment_by_sales_order_id} from "../../../../database/Payment/controller";
import {updateOrderInRealm} from "../../databaseService/order";

const getNotSyncData = () => {
    return getNotSyncOrderData().then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const autoSyncOrder = async () => {
    return await getNotSyncData().then(async (orders) => {
        await Promise.all(orders.map(async (order) => {
            await syncNew(order).then(result => {
                return result;
            });
        }));
    });
};

const syncNew = async (order) => {
    let mappedOrder = transformOrderItems(order);
    return await postNewOrder(mappedOrder).then(async value => {
        if (value.id) {
            if (order.id) {
                await updateInvoiceSalesOrderId(value.id, order.id);
                await updatePaymentSalesOrderId(value.id, order.id);
            }
            value.gps_lat = parseFloat(value.gps_lat);
            value.gps_long = parseFloat(value.gps_long);
            await updateOrderInRealm(value, order.id).then(() => {
                return value;
            }).catch(error => console.log(error))
        } else {
            return await value;
        }
    }).catch(exception => {
        console.log(exception, 'order create exception')
    });
};

//Update Invoice by sales order id
export const getInvoicesToUpdate = (sales_order_id) => {
    return get_invoice_by_sales_order_id(sales_order_id).then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const updateInvoiceSalesOrderId = (new_id, sales_order_id) => {
    return getInvoicesToUpdate(sales_order_id).then((invoices) => {
        invoices.map((invoice) => {
            updateInvoice(invoice.id, new_id);
        });
    });
};

export const updateInvoice = (id, new_id) => {
    return update_invoice_sales_order_id(id, new_id).then(value => {
        return value;
    }).catch(error => console.log(error))
};

//Update Payment by sales order id
export const getPaymentsToUpdate = (sales_order_id) => {
    return get_payment_by_sales_order_id(sales_order_id).then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const updatePaymentSalesOrderId = (new_id, sales_order_id) => {
    return getPaymentsToUpdate(sales_order_id).then((payments) => {
        payments.map((payment) => {
            updatePayment(payment.id, new_id);
        });
    });
};

export const updatePayment = (id, new_id) => {
    return update_payment_by_sales_order_id(id, new_id).then(value => {
        return value;
    }).catch(error => console.log(error))
};