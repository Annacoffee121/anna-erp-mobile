import {
    loadHandoverRequest,
    postHandover,
} from '../../services/handover/index';

import {
    deleteExpenseSuccess, getExpenseSuccess,
    loadHandoverSuccess, loadNextDayRoutsSuccess, loadRouteCustomersSuccess, loadRoutsSuccess, postExpenseSuccess,
    postHandoverSuccess, postRouteSuccess
} from './dispatchers';
import {
    deleteExpenseFromServer, getExpenses,
    loadNextDayRouteRequest,
    loadRouteCustomersRequest,
    loadRoutsRequest, postExpenses,
    postTomorrowRoute
} from "../../services/handover";

export const getHandoverData = (payload) => {
    return (dispatch) => {
        return loadHandoverRequest(payload).then(handovers => {
            dispatch(loadHandoverSuccess(handovers));
            return handovers;
        });
    };
};

export const submitHandover = (payload) => {
    return (dispatch) => {
        return postHandover(payload).then(handover => {
            dispatch(postHandoverSuccess(handover));
            return handover;
        });
    };
};

export const getNextDayRoute = (payload) => {
    return (dispatch) => {
        return loadNextDayRouteRequest(payload).then(nextRouts => {
            dispatch(loadNextDayRoutsSuccess(nextRouts));
            return nextRouts;
        });
    };
};

export const getAllRoutesData = (payload) => {
    return (dispatch) => {
        return loadRoutsRequest(payload).then(routs => {
            dispatch(loadRoutsSuccess(routs));
            return routs;
        });
    };
};

export const getRoutesCustomerData = (payload) => {
    return (dispatch) => {
        return loadRouteCustomersRequest(payload).then(customers => {
            dispatch(loadRouteCustomersSuccess(customers));
            return customers;
        });
    };
};

export const submitTomorrowRoute = (payload) => {
    return (dispatch) => {
        return postTomorrowRoute(payload).then(result => {
            dispatch(postRouteSuccess(result));
            return result;
        });
    };
};


// Expenses Actions
export const submitExpenses = (payload) => {
    return (dispatch) => {
        return postExpenses(payload).then(expense => {
            dispatch(postExpenseSuccess(expense));
            return expense;
        });
    };
};

export const getExpensesFromServer = () => {
    return (dispatch) => {
        return getExpenses().then(expenseData => {
            dispatch(getExpenseSuccess(expenseData));
            return expenseData;
        });
    };
};

export const removeExpense = (expense_id) => {
    return (dispatch) => {
        return deleteExpenseFromServer(expense_id).then(d_expense => {
            dispatch(deleteExpenseSuccess(d_expense));
            return d_expense;
        });
    };
};
