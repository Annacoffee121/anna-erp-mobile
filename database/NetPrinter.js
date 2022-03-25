import Realm from "realm";
import databaseOptions from "./index";

class NetPrinter {}

NetPrinter.schema = {
    name: 'net_printer',
    properties: {
        id: 'string',
        ip: 'string',
        port: 'int'
    }
}

export default NetPrinter;

export const getNetPrinter = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let netPrinters = realm.objects(NetPrinter.schema.name);

        resolve(netPrinters && netPrinters[0] || null);

    }).catch(error => {
        console.warn(error, 'get error');
        return reject(error);
    });
});

export const addOrUpdatePrinter = (data) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            const printer = realm.create(NetPrinter.schema.name, data, true);

            resolve(printer);
        })
    }).catch(error => {
        console.warn(error, 'Realm ' + NetPrinter.schema.name);
        return reject(error);
    });
});
