import {changePrintStatus} from "./index";
import {updatePaymentPrintStatusData} from "../../../database/ReturnedCheques/controller";

export const changePaymentPrintStatus = (payment_id, uuid, value) => {
    return changePrintStatus(payment_id, {is_printed: value}).then(() => {
        return updatePaymentPrintStatusData(uuid, value).then(payment => {
            return payment;
        })
    });
};
