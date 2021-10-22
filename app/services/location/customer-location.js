import {patchCustomerLocation} from "../customer";
import {insertCustomerData} from "../../../database/Customer/controller";
import {updateDashboardCustomerData} from "../../../database/Dashboard/controller";
import {transformCustomerLocation} from "../../helpers/route";

export const updateLocation = (customerId, location) => {
    return patchCustomerLocation(customerId, location).then(() => {
        return updateLocationInDb(customerId, location).then(value => {
            return value;
        })
    })
};

export const updateLocationInDb = (customerId, location) => {
    let newData = location;
    newData.id = customerId;
    return insertCustomerData(newData).then(() => {
        let dashboardData = transformCustomerLocation(customerId, location);
        return updateDashboardCustomerData(dashboardData).then(value => {
            return value;
        })
    })
};