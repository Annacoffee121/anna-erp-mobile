import {EscPos} from "escpos-xml";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";

export const buffer = (printData, companyDetails, customerData) => {
    // Values for XML
    const data = {
        companyName: companyDetails.name + ' - ' + companyDetails.city,
        printHeading: 'Sales Return',
        customer: {
            name: customerData.display_name ? customerData.display_name : '',
            addressL1: customerData.street_one ? customerData.street_one : 'street_one',
            addressL2: customerData.street_two ? customerData.street_two : 'street_two',
            addressL3: customerData.city ? customerData.city : 'city',
        },
        date: new Date(),
        returnedItems: printData.items,
        returnTotal: printData.total,
        replacedItems: printData.return_products,
        resolutionData: printData.resolutions,
        resolutionTotal: calculateTotal(printData.resolutions),
    };

    // Design XML to print (** Printer length 48 **)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += "\<document>";
    xml += `<bold><align mode="center"><text-line>{{companyName}}</text-line></align></bold>`;
    xml += `<align mode="center">`;
    xml += "\<text-line>" + data.printHeading + "\</text-line>";
    xml += "\<text-line>" + data.customer.name + "\</text-line>";
    xml += "\<text-line>" + data.customer.addressL1 + ',' + data.customer.addressL3 + "\</text-line>";
    xml += `<small><text-line>{{moment date format="YYYY-MM-DD HH:mm:ss"}}</text-line></small>`;
    xml += `</align>`;

    // Returned Items Details
    xml += `<bold>`;
    xml += `<underline>`;
    xml += "\<text-line>" + 'Returned Items' + "\</text-line>";
    xml += `</underline>`;
    xml += "\<text-line\> " + leftItemValue('Items&Desc', 21) + leftItemValue('Qty', 5)
        + rightItemValue('Rate', 10) + rightItemValue('Amount', 12) + "\</text-line\>";
    xml += `</bold>`;
    xml += `${returnedItems(data.returnedItems)}`;
    xml += "\<align mode=\"right\">";
    xml += "\<text-line>" + rightItemValue('Total: ', 15) + rightItemValue(transformToCurrency(data.returnTotal), 15) + "\</text-line>";
    xml += "\</align>";
    xml += `<line-feed />`;

    // Resolutions Details
    xml += `<bold>`;
    xml += `<underline>`;
    xml += "\<text-line>" + 'Resolutions' + "\</text-line>";
    xml += `</underline>`;
    xml += `</bold>`;
    // Replaced items
    if (data.replacedItems.length) {
        xml += `<bold>`;
        xml += "\<text-line>" + 'Replaced' + "\</text-line>";
        xml += "\<text-line\> " + leftItemValue('Items&Desc', 21) + leftItemValue('Qty', 5)
            + rightItemValue('Rate', 10) + rightItemValue('Amount', 12) + "\</text-line\>";
        xml += `</bold>`;
        xml += `${replacedItems(data.replacedItems)}`;
        xml += `<line-feed />`;
    }
    xml += `${resolutionItems(data.resolutionData)}`;
    xml += "\<align mode=\"right\">";
    xml += "\<text-line>" + rightItemValue('Total: ', 15) + rightItemValue(transformToCurrency(data.resolutionTotal), 15) + "\</text-line>";
    xml += "\</align>";
    xml += `<align mode="center"><text-line>Thank You!!</text-line><text-line>Solution By: www.ceymplon.lk</text-line></align>`;
    xml += `<line-feed />`;
    xml += "\</document>";

    return EscPos.getBufferFromTemplate(xml, data);
};

// Print order items function
function returnedItems(data) {
    let xml = ``;
    data.map((item) => {
        xml += "\<text-line\> " + leftItemValue(item.product_name, 21) + leftItemValue(item.qty.toString(), 5) +
            rightItemValue(transformToCurrency(item.returned_rate), 10) + rightItemValue(transformToCurrency(item.returned_amount), 12)
            + "\</text-line\>"
    });
    return xml;
}

function replacedItems(data) {
    let xml = ``;
    data.map((item) => {
        xml += "\<text-line\> " + leftItemValue(item.product_name, 21) + leftItemValue(item.qty.toString(), 5) +
            rightItemValue(transformToCurrency(item.rate), 10) + rightItemValue(transformToCurrency(item.amount), 12)
            + "\</text-line\>"
    });
    return xml;
}

function resolutionItems(data) {
    let xml = ``;
    data.map((item) => {
        if (item.type !== 'Replace') {
            xml += "\<text-line\> " + leftItemValue(item.type, 24)
                + rightItemValue(transformToCurrency(item.amount), 24) + "\</text-line\>"
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

// Payment Total Calculation function
function calculateTotal(data) {
    let total = 0;
    if (data) {
        data.map((value) => {
            total = total + value.amount
        });
    }
    return total;
}