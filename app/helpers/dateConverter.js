export const dateConverter = (date) => {
    if (!date) return '2018-04-12';
    return convertDate(date);
};

function convertDate(data) {
    let month = ("0" + (data.getMonth() + 1)).slice(-2);
    let date = ("0" + data.getDate()).slice(-2);
    return data.getFullYear() + "-" + month + "-" + date;
}

export const changePrinterDataToStore = (printer, response, connect_status) => {
    return convertPrinterData(printer, response, connect_status);
};

function convertPrinterData(printer, response, connect_status) {
    let data = {};
    data.uid = 1;
    data.id = printer.id;
    data.name = printer.name;
    data.message = response.message;
    data.connect_status = connect_status;
    return data
}