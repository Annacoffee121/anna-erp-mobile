import uuidv1 from 'uuid/v1';
import {ID} from "./createId";
import {getSingleCustomerName} from "../../database/Customer/controller";
import {get_payment_by_order_id} from "../../database/Payment/controller";
import moment from "moment";

export const transformOrders = (orders) => {
    if (!orders) return [];
    return changeKeyObject(orders);
};

function changeKeyObject(order) {
    order.map((value) => {
        value.u_id = uuidv1();
        value.gps_lat = value.gps_lat ? JSON.parse(value.gps_lat) : 0;
        value.gps_long = value.gps_long ? JSON.parse(value.gps_long) : 0;
        value.customer_name = value.customer.display_name ? value.customer.display_name : value.customer.last_name;
        value.bank_name = value.bank ? value.bank.name : null;
    });
    return order;
}

export const transformOfflineOrderForRealm = (order, name) => {
    if (!order) return {};
    return changeOrderOffline(order, name);
};

function changeOrderOffline(order, name) {
    let totalAmount = 0;
    order.order_items.map((value) => {
        value.quantity = parseInt(value.quantity);                          // Change string to int
        totalAmount = totalAmount + value.amount;                           // calculated total amount
    });
    order.u_id = uuidv1();
    order.total = totalAmount;                                              // set calculated total amount
    order.id = order.id ? order.id : ID();                                  // Create a random number for id
    order.order_no = order.ref;                                             // set reference number
    order.not_sync = true;                                                  // Set not_sync to true to sync later
    order.customer_name = name;                                             // Set customer name
    order.invoice_status = 'Pending';
    if (order.save_as === 'Save') {
        order.status = 'Open';
    } else {
        order.status = 'Draft';
    }
    return order;
}

export const transformOfflineInvoiceForRealm = (invoice, order) => {
    if (!invoice) return {};
    return changeInvoiceOffline(invoice, order);
};

function changeInvoiceOffline(invoice, order) {
    invoice.id = invoice.id ? invoice.id : ID();                                    // Set created random number for id
    invoice.invoice_no = invoice.ref;                                               // Set invoice_no
    invoice.amount = parseInt(invoice.amount);                                      // Set created random number for invoice_no
    invoice.not_sync = true;                                                        // Set not_sync to true to sync later
    invoice.status = 'Open';                                                        // Set status
    invoice.sales_order_id = order.id;                                              // Set order Id
    invoice.customer_id = order.customer_id;                                        // Set customer id from order details
    invoice.business_type_id = order.business_type_id;                              // Set business_type_id from order details
    invoice.company_id = order.company_id;                                          // Set company_id from order details
    return invoice;
}

export const transformOfflinePaymentForRealm = (payment, order, invoiceId) => {
    if (!payment) return {};
    return changePaymentOffline(payment, order, invoiceId);
};

function changePaymentOffline(payment, order, invoiceId) {
    payment.id = payment.id ? payment.id : ID();                                    // Set created random number for id
    payment.payment = parseFloat(payment.payment);                                  // Change string to Float
    payment.not_sync = true;                                                        // Set not_sync to true to sync later
    payment.status = 'Open';                                                        // Set status
    payment.invoice_id = invoiceId;                                                 // Set Invoice id
    payment.sales_order_id = order.id;                                              // Set order Id
    payment.customer_id = order.customer_id;                                        // Set customer id from order details
    payment.business_type_id = order.business_type_id;                              // Set business_type_id from order details
    payment.company_id = order.company_id;                                          // Set company_id from order details
    payment.created_at = payment.created_at ? payment.created_at : moment().format('YYYY-MM-DD HH:mm:ss');
    return payment;
}

export const transformSingleOrders = (orders) => {
    if (!orders) return {};
    return changeSingleKeyObject(orders);
};

function changeSingleKeyObject(value) {
    value.created_at = moment(value.created_at.date).format('YYYY-MM-DD HH:mm:ss');
    value.customer_name = value.customer.display_name ? value.customer.display_name : value.customer.last_name;
    value.tamil_name = value.customer.tamil_name ? value.customer.tamil_name : '';
    value.not_sync = value.not_sync ? value.not_sync : null;
    return value;
}

export const transformOrderToList = (order) => {
    if (!order) return [];
    return changeOrderList(order);
};

function changeOrderList(order) {
    let orderArray = [];
    order.map((value) => {
        let orderList = {};
        orderList.id = value.id;
        orderList.customer_name = value.customer_name;
        getSingleCustomerName(value.customer_id).done(data => {
            orderList.tamil_name = data.tamil_name ? data.tamil_name : '';
        });
        get_payment_by_order_id(value.id).done(data => {
            orderList.due_amount = value.total - getDeuAmount(data);
        });
        orderList.total = value.total;
        orderList.customer_id = value.customer_id;
        orderList.order_id = value.id;
        orderList.order_no = value.order_no;
        orderList.ref = value.ref;
        orderList.status = value.status;
        orderList.order_date = value.order_date;
        orderList.not_sync = value.not_sync;
        orderList.created_at = value.created_at;
        orderArray.push(orderList)
    });
    return orderArray;
}

function getDeuAmount(data) {
    let paid = 0;
    if (data.length) {
        data.map(payment => {
            paid += payment.payment;
        });
    }
    return paid;
}

export const transformOrderToEdit = (order) => {
    if (!order) return [];
    return changeOrderToEdit(order);
};

function changeOrderToEdit(order) {
    let orderData = {};
    let orderItems = [];

    order.order_items.map((value) => {
        let product = {};
        product.product_name = value.product_name;
        product.product_id = value.product_id;
        product.unit_type_name = value.unit_type_name;
        product.unit_type_id = value.unit_type_id;
        product.quantity = value.quantity;
        product.store_id = value.store_id;
        product.rate = value.rate;
        product.amount = value.amount;
        product.notes = value.notes ? value.notes : '';
        orderItems.push(product)
    });

    orderData.business_type_id = order.business_type_id;
    orderData.order_type = order.order_type;
    orderData.customer_id = order.customer_id;
    orderData.sales_type = order.sales_type;
    orderData.order_date = order.order_date;
    orderData.delivery_date = order.delivery_date;
    orderData.notes = order.notes ? order.notes : '';
    orderData.terms = order.terms ? order.terms : '';
    orderData.order_items = orderItems;
    return orderData;
}

export const transformProducts = (products) => {
    if (!products) return [];
    return changeProductsForDropDown(products);
};

function changeProductsForDropDown(products) {
    let productList = [];
    products.map((value) => {
        let dropProduct = {};
        dropProduct.value = value.id;
        dropProduct.name = value.name;
        dropProduct.tamil_name = value.tamil_name;
        dropProduct.stock_level = value.stock_level;
        dropProduct.sold_stock = value.sold_stock;
        dropProduct.replaced_qty = value.replaced_qty;
        dropProduct.packet_price = value.packet_price;
        dropProduct.actual_stock = value.actual_stock;
        productList.push(dropProduct)
    });
    return productList;
}

export const transformProductsSoldQty = (products) => {
    if (!products) return [];
    return changeSoldQty(products);
};

function changeSoldQty(products) {
    let productList = {};
    products.map((value) => {
        if (value.sold_stock) {
            productList[value.id] = value.sold_stock
        }
    });
    return productList;
}

export const transformProductsReplaced = (products) => {
    if (!products) return [];
    return changeReplacedQty(products);
};

function changeReplacedQty(products) {
    let productList = {};
    products.map((value) => {
        if (value.replaced_qty) {
            productList[value.id] = value.replaced_qty
        }
    });
    return productList;
}
