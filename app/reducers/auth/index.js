import defaultTasks from './default';
import * as types from '../../actions/auth/types';

export default auth = (state = defaultTasks, action) => {
    switch (action.type) {
        default:
            return state;

        case types.LOGIN_SUCCESS:
            return {
                ...state,
                oauth: action.oauth
            };

        case types.LOGOUT_SUCCESS:
            return {
                ...state,
                oauth: null
            };

        case types.GOT_USER:
            return {
                ...state,
                user: action.user
            };
    }
};