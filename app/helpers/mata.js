import {get_credit_limit, insertMetaData} from "../../database/Mata/model";
import {getSingleCustomerData, insertCustomerData} from "../../database/Customer/controller";

export const reduceCreditLevel = (order, payment) => {
    let totalPayment = payment ? parseFloat(payment) : 0;
    let totalCredit = order.total - totalPayment;
    get_credit_limit().then(mata => {
        if (mata.route_total_cl) {
            let data = {
                id: 1,
                rep_cl: mata.rep_total_cl ? mata.rep_cl - totalCredit : mata.rep_cl,
                route_cl: mata.route_total_cl ? mata.route_cl - totalCredit : mata.route_cl
            };
            insertMetaData(data).catch(error => console.log(error)) // To Update mata data
        }
    });

    getSingleCustomerData(order.customer_id).then(customer => {
        let data = {
            id: customer.id,
            balance_cl: customer.credit_limit_amount ? customer.balance_cl - totalCredit : customer.balance_cl
        };
        insertCustomerData(data).catch(error => console.log(error)) // To Update mata data
    });
};

export const increaseCreditLevel = (customer_id, paymentTotal) => {
    get_credit_limit().then(mata => {
        let data = {
            id: 1,
            rep_cl: mata.rep_total_cl ? mata.rep_cl + paymentTotal : mata.rep_cl,
            route_cl: mata.route_total_cl ? mata.route_cl + paymentTotal : mata.route_cl
        };
        insertMetaData(data).catch(error => console.log(error)) // To Update mata data
    });

    getSingleCustomerData(customer_id).then(customer => {
        let data = {
            id: customer.id,
            balance_cl: customer.credit_limit_amount ? customer.balance_cl + paymentTotal : customer.balance_cl
        };
        insertCustomerData(data).catch(error => console.log(error)) // To Update mata data
    });
};

export const updateCreditLevel = (customer_id, newPayment, oldPayment) => {
    get_credit_limit().then(mata => {
        let repValue = mata.rep_cl - oldPayment;
        let routeValue = mata.route_cl - oldPayment;
        let data = {
            id: 1,
            rep_cl: mata.rep_total_cl ? repValue + newPayment : mata.rep_cl,
            route_cl: mata.route_total_cl ? routeValue + newPayment : mata.route_cl
        };
        insertMetaData(data).catch(error => console.log(error)) // To Update mata data
    });

    getSingleCustomerData(customer_id).then(customer => {
        let customerValue = customer.balance_cl - oldPayment;
        let data = {
            id: customer.id,
            balance_cl: customer.credit_limit_amount ? customerValue + newPayment : customer.balance_cl
        };
        insertCustomerData(data).catch(error => console.log(error)) // To Update mata data
    });
};