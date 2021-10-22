import {EscPos} from "escpos-xml";

export const buffer = (printData, companyDetails) => {
    // Values for XML
    const data = {
        companyName: companyDetails.name + ' - ' + companyDetails.city,
        orderId: "Delivery Note",
        customer: {
            name: printData.customer.display_name ? printData.customer.display_name : '',
            addressL1: printData.customer.street_one ? printData.customer.street_one + ' ,' : '',
            addressL2: printData.customer.street_two ? printData.customer.street_two : '',
            addressL3: printData.customer.city ? printData.customer.city : '',
        },
        date: new Date(),
        items: printData.order_items,
        total: printData.total,
    };

    // Design XML to print (** Printer length 48 **)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += "\<document>";
    // xml += `<bold><align mode="center"><text-line>{{companyName}}</text-line></align></bold>`;
    xml += `<align mode="center">`;
    xml += "\<text-line size=\"1:0\">" + '********************' + "\</text-line>";
    xml += "\<text-line size=\"1:1\">" + '*  Not an Invoice  *' + "\</text-line>";
    xml += "\<text-line size=\"1:0\">" + '********************' + "\</text-line>";
    xml += `</align>`;
    xml += `<align mode="center">`;
    xml += "\<text-line size=\"1:0\">" + data.orderId + "\</text-line>";
    xml += `<small><text-line>{{moment date format="YYYY-MM-DD HH:mm:ss"}}</text-line></small>`;
    xml += `</align>`;
    // xml += `<line-feed />`;

    // Order Details
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
    xml += `<line-feed />`;

    // xml += `<align mode="center"><text-line>Thank You!!</text-line><text-line>Hotline: 021-201-0000</text-line><text-line>Solution By: www.ceymplon.lk</text-line></align>`;
    // xml += `<line-feed/>`;
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
