import {getNotSyncSalesReturn, insertSalesReturnData} from "../../../database/Returns";
import {mapOfflineSalesReturnForRealm, mapSalesReturn} from "../../helpers/salesReturn";
import {postNewSalesReturn} from "../order";

export const getNotSyncData = () => {
    return getNotSyncSalesReturn().then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const syncAllSalesReturn = async () => {
    return await getNotSyncData().then(async (salesReturns) => {
        await Promise.all(salesReturns.map(async (salesReturn) => {
            await syncWithServer(salesReturn, salesReturn.customer_id).then(result => {
                return result;
            });
        }));
    });
};

const syncWithServer = async (salesReturn, customer_id) => {
    let mappedSalesReturn = mapSalesReturn(salesReturn);
    return await postNewSalesReturn(customer_id, mappedSalesReturn).then(async (value) => {
        if (value.id) {
            let newData = mapOfflineSalesReturnForRealm(salesReturn, false, value.id);
            await insertSalesReturnData(newData).catch(error => console.log(error));
        }
        return value
    }).catch(exception => {
        return exception
    });
};