import {login, getUser, getDate, faceLogin} from '../../services/auth';

import {
    loginSuccess,
    logoutSuccess,
    gotUser, getDateSuccess, faceLoginSuccess,
} from './dispatchers';

export const loginProcess = (payload) => {
    return (dispatch) => {
        return login(payload).then(auth => {
            dispatch(loginSuccess(auth));
            return auth;
        });
    };
};

export const faceLoginProcess = (payload) => {
    return (dispatch) => {
        return faceLogin(payload).then(faceResult => {
            dispatch(faceLoginSuccess(faceResult));
            return faceResult;
        });
    };
};

export const dateCheckProcess = (payload) => {
    return (dispatch) => {
        return getDate(payload).then(date => {
            dispatch(getDateSuccess(date));
            return date;
        });
    };
};

export const logoutProcess = () => {
    return (dispatch) => {
        dispatch(logoutSuccess());
    };
};

export const getUserProcess = () => {
    return (dispatch) => {
        return getUser().then(user => {
            dispatch(gotUser(user));
            return user;
        });
    };
};