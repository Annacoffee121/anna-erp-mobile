import {updatePrintStatusData} from "../../../database/Order/controller";
import {fetchPrintStatusRequest, fetchReturnPrintStatusRequest} from "./index";
import {updateReturnPrintStatus} from "../../../database/Returns";

export const changePrintStatus = (orderId, value) => {
    return fetchPrintStatusRequest(orderId, {is_order_printed: value}).then(() => {
        return updatePrintStatusData(orderId, value).then(order => {
            return order;
        })
    });
};

export const changeSalesReturnPrintStatus = (id, value) => {
    return fetchReturnPrintStatusRequest(id, {is_printed: value}).then(() => {
        return updateReturnPrintStatus(id, value).then(returnData => {
            return returnData;
        })
    }).catch(error => {
        return error
    });
};