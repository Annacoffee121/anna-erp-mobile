export const transformAllCustomerPayment = (payments) => {
    if (!payments.length) return [];
    return transformData(payments);
};

function transformData(payments) {
    let newData = [];
    payments.map(payment => {
        if (payment.payment_mode === "Cheque") {
            newData.push({
                uid: payment.u_id,
                id: payment.id,
                date: payment.payment_date,
                payment_mode: payment.payment_mode,
                cheque_no: payment.cheque_no,
                cheque_date: payment.cheque_date,
                bank_name: payment.bank_name,
                payment: payment.payment
            })
        }
    });
    return newData;
}

export const changeChequePayment = (cheque, newValue) => {
    let newData = {};
    newData.uid = cheque.u_id;
    newData.id = cheque.id;
    newData.date = cheque.payment_date;
    newData.payment_mode = cheque.payment_mode;
    newData.cheque_no = cheque.cheque_no;
    newData.cheque_date = cheque.cheque_date;
    newData.bank_name = cheque.bank_name;
    newData.payment = cheque.payment + newValue;
    return newData;
};