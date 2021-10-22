import {EscPos} from "escpos-xml";

export const buffer = (printData, count, previousCollection, out_value, companyDetails, receipt_mode, not_realized_cheque) => {
    // Values for XML
    const receipt = receipt_mode === 'Payment' ? 'Payment Receipt' : 'Sales Order - ' + printData.ref;
    const outstanding_data = validatePaidOutstanding(printData.customer.outstanding_orders, printData.id);
    const data = {
        printStatus: count === 1 ? '[Original]' : '[Copy]',
        companyName: companyDetails.name + ' - ' + companyDetails.city,
        phone: companyDetails.phone,
        company_mail: companyDetails.company_mail,
        orderId: printData.ref ? receipt : receipt + printData.order_no,
        customer: {
            name: printData.customer.display_name ? printData.customer.display_name : '',
            addressL1: printData.customer.street_one ? printData.customer.street_one + ' ,' : '',
            addressL2: printData.customer.street_two ? printData.customer.street_two : '',
            addressL3: printData.customer.city ? printData.customer.city : '',
        },
        date: new Date(),
        orderDate: printData.order_date,
        deliveryDate: printData.delivery_date,
        items: printData.order_items,
        subTotal: printData.sub_total,
        discount: printData.discount_rate,
        adjustment: printData.adjustment,
        total: printData.total,
        invoice: printData.invoices,
        invoiceTotal: calculateInvoiceTotal(printData.invoices),
        payment: printData.payments,
        paymentTotal: calculatePaymentTotal(printData.payments),
        balancePayment: printData.total - calculatePaymentTotal(printData.payments),
        totalOutstanding: calculateInvoiceTotal(outstanding_data),
        totalOutWithBalance: (printData.total - calculatePaymentTotal(printData.payments)) + calculateInvoiceTotal(outstanding_data),
        outstanding: outstanding_data,
        // totalOutstanding: out_value,
        previousCollection: previousCollection,
        previousCollectionTot: calculatePaymentTotal(previousCollection),
        totalReceived: calculatePaymentTotal(previousCollection) + calculatePaymentTotal(printData.payments),
        notRealizedCheque: not_realized_cheque,
        notRealizedChequeTotal: calculatePaymentTotal(not_realized_cheque)
    };

    // Design XML to print (** Printer length 48 **)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += "\<document>";
    xml += `<bold><align mode="center"><text-line>{{companyName}}</text-line></align></bold>`;
    xml += `<align mode="center">`;
    xml += "\<text-line>" + data.orderId + "\</text-line>";
    xml += "\<text-line>" + data.customer.name + "\</text-line>";
    xml += "\<text-line>" + data.customer.addressL1 + data.customer.addressL3 + "\</text-line>";

    if (receipt_mode === 'Credit') {
        xml += `<small><text-line>{{printStatus}} - {{moment date format="YYYY-MM-DD HH:mm:ss"}}</text-line></small>`;
    } else {
        xml += `<small><text-line>{{moment date format="YYYY-MM-DD HH:mm:ss"}}</text-line></small>`;
    }
    xml += `</align>`;
    if (receipt_mode !== 'Payment') {
        xml += "\<text-line>" + leftItemValue('Order Date:' + data.orderDate, 24) + rightItemValue('Delivery Date:' + data.deliveryDate, 24) + "\</text-line>";
    }
    // Order Details
    if (receipt_mode !== 'Payment') {
        xml += `<bold>`;
        xml += `<underline>`;
        xml += "\<text-line>" + 'Order Details' + "\</text-line>";
        xml += `</underline>`;
        xml += "\<text-line\> " + leftItemValue('Items&Desc', 21) + leftItemValue('Qty', 5)
            + rightItemValue('Rate', 10) + rightItemValue('Amount', 12) + "\</text-line\>";
        xml += `</bold>`;
        xml += `${orderItems(data.items)}`;
        xml += "\<align mode=\"right\">";
        xml += "\<text-line>" + '-----------' + "\</text-line>";
        xml += "\<text-line>" + rightItemValue('Total: ', 36) + rightItemValue(formatCurrency(data.total), 11) + "\</text-line>";
        xml += "\</align>";
        // xml += `<line-feed />`;

        // Payment Details
        if (data.payment.length) {
            xml += `<bold>`;
            xml += `<underline>`;
            xml += "\<text-line>" + 'Payment Details' + "\</text-line>";
            xml += `</underline>`;
            xml += "\<text-line\> " + leftItemValue('Mode', 21) + rightItemValue('Amount', 15) + "\</text-line\>";
            xml += `</bold>`;
            xml += `${paymentDetails(data.payment, data)}`;
            xml += "\<align mode=\"right\">";
            xml += "\<text-line>" + '----------------------' + "\</text-line>";
            // xml += `<bold>`;
            // xml += "\<text-line>" + rightItemValue('Remaining Payment: ', 36) + rightItemValue(formatCurrency(data.balancePayment), 11) + "\</text-line>";
            // xml += `</bold>`;
            xml += "\</align>";
        }
    }

    // Previous Bill Collection
    if (data.previousCollection.length > 0) {
        xml += `<bold>`;
        xml += `<underline>`;
        xml += "\<text-line>" + 'Bill Collection' + "\</text-line>";
        xml += `</underline>`;
        xml += "\<text-line\> " + leftItemValue('Order No', 17) + leftItemValue('Order Date', 11)
            + rightItemValue('Mode', 8) + rightItemValue('Amount', 12) + "\</text-line\>";
        xml += `</bold>`;
        xml += `${previousBillCollectionDetails(data.previousCollection)}`;

        xml += "\<align mode=\"right\">";
        xml += "\<text-line>" + '-----------' + "\</text-line>";
        xml += `<bold>`;
        xml += "\<text-line>" + rightItemValue('Total: ', 36) + rightItemValue(formatCurrency(data.previousCollectionTot), 11) + "\</text-line>";
        xml += `<line-feed/>`;
        if (receipt_mode !== 'Payment') {
            xml += "\<text-line>" + rightItemValue('Tot.Coll: ', 36) + rightItemValue(formatCurrency(data.totalReceived), 11) + "\</text-line>";
        } else {
            xml += "\<text-line>" + rightItemValue('Tot.Coll: ', 36) + rightItemValue(formatCurrency(data.previousCollectionTot), 11) + "\</text-line>";
        }
        xml += `</bold>`;
        xml += "\</align>";

        // xml += "\<white-mode><text>" + leftItemValue('| Total Outstanding', 20) + "\</text></white-mode>";
        // xml += "\<text-line>" + leftItemValue('|      Total:', 13) + rightItemValue(formatCurrency(data.previousCollectionTot), 15) + "\</text-line>";
        // xml += "\<white-mode><text>" + leftItemValue('| ' + formatCurrency(data.totalOutstanding), 20) + "\</text></white-mode>";
        // if (receipt_mode !== 'Payment') {
        //     xml += "\<bold><text-line>" + leftItemValue('|   Tot.Coll:', 13) + rightItemValue(formatCurrency(data.totalReceived), 15) + "\</text-line></bold>";
        // } else {
        //     xml += "\<bold><text-line>" + leftItemValue('|  Tot.Coll:', 13) + rightItemValue(formatCurrency(data.previousCollectionTot), 15) + "\</text-line></bold>";
        // }
    }
    if (receipt_mode !== 'Payment') {
        xml += "\<align mode=\"right\">";
        xml += `<bold>`;
        xml += "\<text-line>" + rightItemValue('Remaining Payment: ', 36) + rightItemValue(formatCurrency(data.balancePayment), 11) + "\</text-line>";
        xml += `</bold>`;
        xml += "\</align>";
    }
    // xml += "\<white-mode><text-line>" + leftItemValue('Total Outstanding', 20) + rightItemValue(formatCurrency(data.totalOutstanding), 28) + "\</text-line></white-mode>";

    if (data.outstanding.length && data.totalOutstanding > 0) {
        xml += `<line-feed/>`;
        xml += `<bold>`;
        xml += `<underline>`;
        xml += "\<text-line>" + 'Outstanding Details' + "\</text-line>";
        xml += `</underline>`;
        xml += "\<text-line\> " + leftItemValue('Order No', 21) + rightItemValue('Amount', 15) + "\</text-line\>";
        xml += `</bold>`;
        xml += `${outstandingDetails(data.outstanding, data)}`;
        xml += "\<align mode=\"right\">";
        xml += "\<text-line>" + '----------------------' + "\</text-line>";
        xml += "\<text-line>" + rightItemValue(formatCurrency(data.totalOutWithBalance), 12) + "\</text-line>";
        xml += "\</align>";
    }

    // Not realized cheque details
    if (data.notRealizedCheque.length) {
        xml += `<line-feed/>`;
        xml += `<bold>`;
        xml += `<underline>`;
        xml += "\<text-line>" + 'Cheques subject to be realized' + "\</text-line>";
        xml += `</underline>`;
        xml += `</bold>`;
        xml += `${notRealizedCheques(data.notRealizedCheque)}`;
        xml += "\<align mode=\"right\">";
        xml += "\<text-line>" + '----------            ' + "\</text-line>";
        xml += `<bold>`;
        xml += "\<text-line>" + rightItemValue('Total: ', 36) + rightItemValue(formatCurrency(data.notRealizedChequeTotal), 12) + '            ' + "\</text-line>";
        xml += `</bold>`;
        xml += "\</align>";
    }
    // Footer Details
    if (receipt_mode === 'Credit') {
        xml += `<line-feed/>`;
        xml += "\<text-line>" + leftItemValue('Auth.Sign:______________', 24) + rightItemValue('Cus.Sign:______________', 24) + "\</text-line>";
    }
    xml += `<line-feed/>`;
    xml += `<align mode="center">
            <text-line>60 Years Of Experience</text-line>
            <text-line>Thank You!!</text-line>
            <text-line>Hotline: ${data.phone}</text-line>
            <text-line>Email: ${data.company_mail}</text-line>
            <text-line>Web: www.annacoffee.com</text-line>
            </align>`;
    xml += `<line-feed/>`;
    xml += "\</document>";

    return EscPos.getBufferFromTemplate(xml, data);
};

function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = "0";
    }

    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10) {
        cents = "0" + cents;
    }
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    return (((sign) ? '' : '-') + num + '.' + cents);
}

// Payment Total Calculation function
function calculatePaymentTotal(data) {
    let paymentTotal = 0;
    if (data) {
        data.map((value) => {
            paymentTotal = paymentTotal + value.payment
        });
    }
    return paymentTotal;
}

// Payment Total Calculation function
function calculateInvoiceTotal(data) {
    let invoiceTotal = 0;
    if (data) {
        data.map((value) => {
            invoiceTotal = invoiceTotal + value.amount
        });
    }
    return invoiceTotal;
}

// Print order items function
function orderItems(data) {
    let xml = ``;
    data.map((item, key) => {
        let num = key + 1;
        xml += "\<text-line\> " + leftItemValue(item.product_name, 21) + leftItemValue(item.quantity.toString(), 5) +
            rightItemValue(formatCurrency(item.rate), 10) + rightItemValue(formatCurrency(item.amount), 12)
            + "\</text-line\>"
    });
    return xml;
}

// Print invoice details function
function invoiceDetails(data) {
    let xml = ``;
    data.map((item, key) => {
        let num = key + 1;
        xml += "\<text-line\> " + leftItemValue(item.ref ? item.ref : item.invoice_no, 18)
            + leftItemValue(item.due_date, 15) + rightItemValue(formatCurrency(item.amount), 15) + "\</text-line\>"
    });
    return xml;
}

// Print payment details function
function paymentDetails(data, mainData) {
    let xml = ``;
    data.map((item, key) => {
        const payment_mode = item.payment_mode === "Customer Credit" ? "Return" : item.payment_mode;
        if (data.length - 1 === key) {
            xml += "\<text-line\> " + leftItemValue(payment_mode, 21)
                + rightItemValue(formatCurrency(item.payment), 15) + rightItemValue(formatCurrency(mainData.paymentTotal), 12) + "\</text-line\>";
        } else {
            xml += "\<text-line\> " + leftItemValue(payment_mode, 21)
                + rightItemValue(formatCurrency(item.payment), 15) + "\</text-line\>";
        }
        if (payment_mode === 'Cheque') {
            xml += "\<text-line\> " + leftItemValue('#', 2) + leftItemValue(item.cheque_no + ', '
                + item.cheque_date, 36) + "\</text-line\>";
            xml += "\<text-line\> " + leftItemValue(item.bank_name, 23) + "\</text-line\>";
        }
    });
    return xml;
}

function outstandingDetails(data, mainData) {
    let xml = ``;
    data.map((item, key) => {
        if (data.length - 1 === key) {
            xml += "\<text-line\> " + leftItemValue(item.ref, 21)
                + rightItemValue(formatCurrency(item.amount), 15) + rightItemValue(formatCurrency(mainData.totalOutstanding), 12) + "\</text-line\>";
            xml += "\<text-line\> " + leftItemValue(item.order_date, 21) + "\</text-line\>";
        } else {
            xml += "\<text-line\> " + leftItemValue(item.ref, 21)
                + rightItemValue(formatCurrency(item.amount), 15) + "\</text-line\>";
            xml += "\<text-line\> " + leftItemValue(item.order_date, 21) + "\</text-line\>";
        }
    });
    return xml;
}

// Print Previous Bill Collection
function previousBillCollectionDetails(data) {
    let xml = ``;
    data.map((item, key) => {
        let num = key + 1;
        xml += "\<text-line\> " + leftItemValue(item.id, 17) + leftItemValue(item.date, 11)
            + rightItemValue(item.mode, 8) + rightItemValue(formatCurrency(item.payment), 12) + "\</text-line\>";
        if (item.mode === 'Cheque') {
            xml += "\<text-line\> " + leftItemValue('#', 2) + leftItemValue(item.cheque_no + ', '
                + item.cheque_date + ', ' + item.bank_name, 46) + "\</text-line\>";
        }
    });
    return xml;
}

function notRealizedCheques(data) {
    let xml = ``;
    data.map((item) => {
        xml += "\<text-line\> " + leftItemValue('#', 2) + leftItemValue(item.cheque_no + ', '
            + item.cheque_date, 34) + "\</text-line\>";
        xml += "\<text-line\> " + leftItemValue(item.bank_name, 24) + rightItemValue(formatCurrency(item.payment), 12) + "\</text-line\>";
    });
    return xml;
}

// Define space for Left function
function leftItemValue(snippet, length) {
    if (snippet.length >= length) {
        return snippet.substring(0, length);
    } else {
        while (snippet.length !== length) {
            snippet = snippet.concat(" ");
        }
        return snippet;
    }
}

// Define space for Right function
function rightItemValue(snippet, length) {
    if (snippet.length >= length) {
        return snippet.substring(0, length);
    } else {
        while (snippet.length !== length) {
            snippet = " " + snippet;
        }
        return snippet;
    }
}

function validatePaidOutstanding(data, id) {
    let newArray = [];
    if (data.length) {
        data.map((value) => {
            if (value.amount > 0 && value.id !== id) {
                newArray.push(value)
            }
        });
    }
    return newArray;
}
