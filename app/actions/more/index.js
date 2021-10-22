import {getAllReturnedCheques, getOneReturnedChequeById} from "../../../database/ReturnedCheques/controller";
import {loadReturnedChequeSuccess} from "./dispatchers";

export const getReturnedChequesData = () => {
    return (dispatch) => {
        return getAllReturnedCheques().then(cheques => {
            dispatch(loadReturnedChequeSuccess(cheques));
            return cheques;
        });
    };
};

export const getReturnedChequeById = (id) => {
    return (dispatch) => {
        return getOneReturnedChequeById(id).then(cheques => {
            dispatch(loadReturnedChequeSuccess(cheques));
            return cheques;
        });
    };
};
