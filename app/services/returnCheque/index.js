import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";

const returnChequeRoute = apiRoute('sales/cheque-payments');

export const onLoadReturnCheques = () => {
    return client.get(returnChequeRoute)
        .then(response => {
            return response.json().then((data) => {
                return data;
            });
        });
};

export const sendReturnCheques = (payload, cheque_no) => {
    const route = returnChequeRoute + '/' + cheque_no;
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchReturnChequesPayment = (payload, paymentId) => {
    let route = returnChequeRoute + '/' + paymentId;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const changePrintStatus = (payment_id, payload) => {
    let route = returnChequeRoute + '/' + payment_id + '/is-printed';
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};
