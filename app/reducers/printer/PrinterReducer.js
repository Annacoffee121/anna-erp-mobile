import * as types from "../../actions/netPrint/types";

const defaultState = {
    printer: null,
};

export default function (state = defaultState, action) {
    switch (action.type) {

        case types.NET_PRINTER_GET:
            return {
                ...state,
                printer: action.payload,
            };
        default:
            return state;
    }
}
