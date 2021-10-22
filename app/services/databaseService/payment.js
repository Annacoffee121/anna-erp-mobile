import {getPaymentById, insertPaymentData} from "../../../database/Payment/controller";
import uuidv1 from "uuid/v1";
import moment from "moment";

export const insertPaymentInRealm = (payment) => {
    payment.u_id = uuidv1();
    if(payment.created_at.date){
        payment.created_at =  moment(payment.created_at.date).format('YYYY-MM-DD HH:mm:ss');
    }
    return insertPaymentData(payment).catch(error => console.log(error, 'insert'));
};

export const updatePaymentInRealm = (payment, payment_id) => {
    if (payment_id) {
        return getPaymentById(payment_id).then(payment_u_id => {
            payment.u_id = payment_u_id;
            payment.not_sync =  false;
            if(payment.created_at.date){
                payment.created_at =  moment(payment.created_at.date).format('YYYY-MM-DD HH:mm:ss');
            }
            return insertPaymentData(payment).catch(error => console.log(error, 'insert'));
        });
    } else {
        return insertPaymentInRealm(payment).catch(error => console.log(error, 'insert'));
    }
};