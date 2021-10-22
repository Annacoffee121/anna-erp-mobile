import {transformSinglePayment} from "../../helpers/returnedCheque";
import {patchReturnChequesPayment, sendReturnCheques} from "../returnCheque";
import {getAllRetChNotSyncPayments, insertReturnedChequePayment} from "../../../database/ReturnedCheques/controller";

//Sync from offline
const getOfflineData = () => {
    return getAllRetChNotSyncPayments().then(value => {
        return value.length ? value : [];
    }).catch(error => console.log(error))
};

export const syncAllRetChPayments = async () => {
    return await getOfflineData().then(async cheques => {
        await Promise.all(cheques.map(async cheque => {
            await syncChequePayment(cheque, cheque.cheque_no).then(result => {
                return result;
            });
        }));
    });
};

export const syncChequePayment = async (cheque, cheque_no) => {
    await Promise.all(cheque.payments.map(async payment => {
        await syncPayment(payment, cheque_no).then(result => {
            return result;
        });
    }));
};


// Sync data and store data in realm
export const syncAllRetChePayments = async (payments, cheque_no) => {
    await Promise.all(payments.map(async payment => {
        await syncPayment(payment, cheque_no).then(result => {
            return result;
        });
    }));
};

const syncPayment = async (payment, cheque_no) => {
    return await sendReturnCheques(payment, cheque_no).then(async value => {
        const data = transformSinglePayment(value, payment.uuid, true);
        insertReturnedChequePayment(cheque_no, data).then(() => console.log('Return Cheques payment stored')).catch(er => console.log(er, '#Return Cheques error'))
    }).catch(exception => {
        console.log(exception, 'Return cheque payment create exception')
    });
};

// Store data in realm
export const storeAllRetChePayments = async (payments, cheque_no) => {
    await Promise.all(payments.map(async payment => {
        const data = transformSinglePayment(payment, payment.uuid, false);
        await insertReturnedChequePayment(cheque_no, data).then(result => {
            return result;
        }).catch(er => console.log(er, '#Return Cheques error'))
    }));
};

// Update payment data
export function patchChequePayment(payment, cheque_no) {
    return new Promise((resolve, reject) => {
        patchReturnChequesPayment(payment, payment.id).then(async value => {
            const data = transformSinglePayment(value, payment.uuid, true);
            insertReturnedChequePayment(cheque_no, data).then(() => console.log('Return Cheques payment stored')).catch(er => console.log(er, '#Return Cheques error'))
            resolve(value)
        }).catch(exception => {
            reject(exception);
        });
    })
}

// Update payment data in realm
export const updateChequePayment = async (payment, cheque_no) => {
    const data = transformSinglePayment(payment, payment.uuid, false);
    await insertReturnedChequePayment(cheque_no, data).then(result => {
        return result;
    }).catch(er => console.log(er, '#Return Cheques error'))
};
