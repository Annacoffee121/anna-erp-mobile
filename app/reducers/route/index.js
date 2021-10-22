import defaultRoute from './default';
import * as types from '../../actions/dashboard/types';

export default routs = (state = defaultRoute, action) => {
    switch (action.type) {
        default:
            return state;
        case types.FETCH_DB_ROUTE_SUCCESS:
            return {
                ...state,
                all: action.route
            };
            break;
    }
};