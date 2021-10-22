import {isEmpty} from 'lodash';
import {configStore} from "../config/store";
import {storage} from '../config/storage';
import {getPrinterData, updateConnectStatus} from "../../database/Printer";

export default store = async () => {
    let storageData = await storage.getAll();
    let store = configStore(storageData);
    if (isEmpty(storageData)) {
        await storage.multiSet(store.getState());
    }

    handelPrinterConnection(1);

    store.subscribe(() => {
        let state = store.getState();
        subscriptions(state);
        if (!isEmpty(state.auth.oauth)) {
            authSubscriptions(state);
        }
    });

    return store;
};

export const subscriptions = (state) => {

};

const handelPrinterConnection = (uid) => {
    getPrinterData(uid).then(result => {
        if (result) {
            updateConnectStatus(false).catch(error => console.warn(error))
        }
    });
};

export const authSubscriptions = (state) => {
    return storage.multiSet(state).catch(errors => {
        // console.log('Storage Error : ', errors);
    });
};