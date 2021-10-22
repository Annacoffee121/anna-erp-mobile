import {EscPos} from "escpos-xml";

export const buffer = (printData, companyDetails) => {
    // Values for XML
    const data = {
        companyName: companyDetails.name + ' - ' + companyDetails.city,
        phone: companyDetails.phone,
        company_mail: companyDetails.company_mail,
        orderId: 'Payment Receipt',
        cheque: {
            no: printData.cheque_no,
            bank: printData.bank,
            date: printData.cheque_date,
            total: printData.total,
        },
        customer: printData.customer,
        payment: Object.values(printData.payments),
        paymentTotal: calculatePaymentTotal(Object.values(printData.payments)),
        balance: printData.total - calculatePaymentTotal(Object.values(printData.payments)),
    };

    // Design XML to print (** Printer length 48 **)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += "\<document>";
    xml += `<bold><align mode="center"><text-line>{{companyName}}</text-line></align></bold>`;
    xml += `<align mode="center">`;
    xml += "\<text-line>" + data.orderId + "\</text-line>";
    xml += "\<text-line>" + data.customer + "\</text-line>";
    xml += `<small><text-line>{{moment date format="YYYY-MM-DD HH:mm:ss"}}</text-line></small>`;
    xml += `</align>`;

    // Cheque Details
    xml += `<bold>`;
    xml += `<underline>`;
    xml += "\<text-line>" + 'Cheque Details' + "\</text-line>";
    xml += `</underline>`;
    xml += "\<text-line\> " + leftItemValue('Ch. No.', 7) + leftItemValue('Bank', 19)
        + leftItemValue('Date', 10) + rightItemValue('Amount', 12) + "\</text-line\>";
    xml += `</bold>`;
    xml += `${orderItems(data.cheque)}`;
    xml += "\<align mode=\"right\">";
    xml += "\<text-line>" + '-----------' + "\</text-line>";
    xml += "\<text-line>" + rightItemValue('Total: ', 36) + rightItemValue(formatCurrency(data.cheque.total), 11) + "\</text-line>";
    xml += "\</align>";
    // xml += `<line-feed />`;

    //Payment details
    xml += `<bold>`;
    xml += `<underline>`;
    xml += "\<text-line>" + 'Payment Details' + "\</text-line>";
    xml += `</underline>`;
    xml += "\<text-line\> " + leftItemValue('Mode', 21) + rightItemValue('Amount', 15) + "\</text-line\>";
    xml += `</bold>`;
    xml += `${paymentDetails(data.payment, data.paymentTotal)}`;
    xml += "\<align mode=\"right\">";
    xml += "\<text-line>" + '----------------------' + "\</text-line>";
    xml += "\<text-line>" + data.balance + "\</text-line>";
    xml += "\</align>";

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

// Print order items function
function orderItems(cheque) {
    let xml = ``;
    xml += "\<text-line\> " + leftItemValue(cheque.no, 7) + leftItemValue(cheque.bank, 19) +
        leftItemValue(cheque.date, 10) + rightItemValue(formatCurrency(cheque.total), 12)
        + "\</text-line\>";
    return xml;
}

// Print payment details function
function paymentDetails(payments, total) {
    let xml = ``;
    payments.map((payment, key) => {
        const payment_mode = payment.payment_mode === "Customer Credit" ? "Return" : payment.payment_mode;
        if (payments.length - 1 === key) {
            xml += "\<text-line\> " + leftItemValue(payment_mode, 21)
                + rightItemValue(formatCurrency(payment.payment), 15) + rightItemValue(formatCurrency(total), 12) + "\</text-line\>";
        } else {
            xml += "\<text-line\> " + leftItemValue(payment_mode, 21)
                + rightItemValue(formatCurrency(payment.payment), 15) + "\</text-line\>";
        }
        if (payment_mode === 'Cheque') {
            xml += "\<text-line\> " + leftItemValue('#', 2) + leftItemValue(payment.cheque_no + ', '
                + payment.cheque_date, 36) + "\</text-line\>";
            if (payment.bank_name) {
                xml += "\<text-line\> " + leftItemValue(payment.bank_name, 23) + "\</text-line\>";
            }
        }
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
