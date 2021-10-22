import {getOrderById, insertOrderData} from "../../../database/Order/controller";
import {transformSingleOrders} from "../../helpers/orders";
import uuidv1 from "uuid/v1";

// Online
export const insertOrderInRealm = (order) => {
    order.u_id = uuidv1();
    order.gps_lat = parseFloat(order.gps_lat);
    order.gps_long = parseFloat(order.gps_long);
    return insertOrderData(transformSingleOrders(order)).catch(error => console.log(error, 'insert'));
};

export const updateOrderInRealm = (order, order_id) => {
    return getOrderById(order_id).then(order_u_id => {
        order.u_id = order_u_id;
        return insertOrderData(transformSingleOrders(order)).catch(error => console.log(error, 'insert'));
    });
};