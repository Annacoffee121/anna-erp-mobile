import * as types from './types';

export const loginSuccess = (oauth) => {
    return {
        type: types.LOGIN_SUCCESS,
        oauth
    };
};

export const faceLoginSuccess = (faceResult) => {
    return {
        type: types.SEND_FACE_SUCCESS,
        faceResult
    };
};

export const getDateSuccess = (date) => {
    return {
        type: types.GET_DATE_SUCCESS,
        date
    };
};

export const logoutSuccess = () => {
    return {
        type: types.LOGOUT_SUCCESS
    };
};

export const gotUser = (user) => {
    return {
        type: types.GOT_USER,
        user
    };
};