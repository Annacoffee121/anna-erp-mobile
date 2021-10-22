import defaultTasks from './default';
import * as types from '../../actions/system/types';

export default system = (state = defaultTasks, action) => {
    switch (action.type) {
        case types.CHANGE_CONNECTION_STATUS:
            return {
                ...state,
                isConnected: action.isConnected
            };

        case types.CONFIGURATIONS_LOAD_SUCCESS:
            return {
                ...state,
                configurations: {
                    ...state.configurations,
                    ...action.configurations
                }
            };

        default:
            return state;
    }
};