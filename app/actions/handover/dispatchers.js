import * as types from './types';

export const loadHandoverSuccess = (handover) => {
    return {
        type: types.LOAD_HANDOVER_SUCCESS,
        handover
    };
};

export const postHandoverSuccess = (postHandover) => {
    return {
        type: types.POST_HANDOVER_SUCCESS,
        postHandover
    };
};

export const loadNextDayRoutsSuccess = (nextRouts) => {
    return {
        type: types.LOAD_NEXT_DAY_ROUTS_SUCCESS,
        nextRouts
    };
};

export const loadRoutsSuccess = (routs) => {
    return {
        type: types.LOAD_ROUTS_SUCCESS,
        routs
    };
};

export const loadRouteCustomersSuccess = (customers) => {
    return {
        type: types.LOAD_ROUTE_CUSTOMERS_SUCCESS,
        customers
    };
};

export const postRouteSuccess = (result) => {
    return {
        type: types.POST_ROUTE_SUCCESS,
        result
    };
};

export const postExpenseSuccess = (expense) => {
    return {
        type: types.POST_EXPENSE_SUCCESS,
        expense
    };
};

export const getExpenseSuccess = (expenseData) => {
    return {
        type: types.GET_EXPENSE_SUCCESS,
        expenseData
    };
};

export const deleteExpenseSuccess = (d_expense) => {
    return {
        type: types.REMOVE_EXPENSE_SUCCESS,
        d_expense
    };
};