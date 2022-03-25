import {NativeModules} from "react-native";
import {Buffer} from "buffer";

const RNNetPrinter = NativeModules.RNNetPrinter;

export default {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDeviceList: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connectPrinter: function (host, port) {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.connectPrinter(host, port, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    closeConn: function () {
        return new Promise(function (resolve) {
            RNNetPrinter.closeConn();
            resolve();
        });
    },
    printText: function (text) {

        if (typeof text === 'string') text = Buffer(text);

        RNNetPrinter.printRawData(text.toString('base64'), function (error) {
            console.warn(error);

            return error;
        });
    },
};
