import {getNotSyncNotVisitReasons, insertNotVisitReason} from "../../../database/NotVisited/model";
import {postNewNotVisitReason} from "../customer";
import {changeNotVisitReasonSync, mapNotVisitReason} from "../../helpers/salesReturn";

export const getNotSyncData = () => {
    return getNotSyncNotVisitReasons().then(value => {
        return value ? value : [];
    }).catch(error => console.log(error))
};

export const syncAllNotVisitReasons = async () => {
    return await getNotSyncData().then(async (notVisitReasons) => {
        await Promise.all(notVisitReasons.map(async (notVisitReason) => {
            await syncWithServer(notVisitReason, notVisitReason.id).then(result => {
                return result;
            });
        }));
    });
};

const syncWithServer = async (notVisitReason, id) => {
    let mappedNotVisitReason = mapNotVisitReason(notVisitReason);
    return await postNewNotVisitReason(id, mappedNotVisitReason).then(async (value) => {
        let mappedData = changeNotVisitReasonSync(notVisitReason);
        await insertNotVisitReason(mappedData).catch(error => console.log(error));
        return value
    }).catch(exception => {
        return exception
    });
};