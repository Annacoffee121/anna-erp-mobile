import * as types from "./types";
import * as NetPrinterDatabase from "../../../database/NetPrinter";

export const getNetPrinter = () => dispatch => {
    NetPrinterDatabase.getNetPrinter().then(printer => {
        dispatch({
            type: types.NET_PRINTER_GET,
            payload: printer
        });
    });
}

export const addOrUpdatePrinter = (data) => dispatch => {
    NetPrinterDatabase.addOrUpdatePrinter(data).then(printer => {
        dispatch({
            type: types.NET_PRINTER_GET,
            payload: printer
        });
    });
}
