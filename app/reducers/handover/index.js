import defaultHandover from './default';
import * as types from '../../actions/handover/types';

export default handover = (state = defaultHandover, action) => {
    switch (action.type) {
        default:
            return state;
        case types.LOAD_HANDOVER_SUCCESS:
            return {
                ...state,
                handover: action.handover
            };
        case types.LOAD_ROUTS_SUCCESS:
            return {
                ...state,
                nextRouts: action.routs
            };
            break;
    }
};