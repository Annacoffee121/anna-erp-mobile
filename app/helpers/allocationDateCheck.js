import moment from "moment/moment";

export const validateAllocationDate = (to_date) => {
    return moment(to_date).isBefore(moment().format('YYYY-MM-DD'));
};
