import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";

const productRoute = apiRoute('sales/products');
const returnRoute = apiRoute('sales/return');
const confirmRoute = apiRoute('sales/confirm-stock');

export const loadAllProductRequest = (payload) => {
    return client.get(productRoute)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return data;
            });
        });
};

export const loadAllReturnProductRequest = (payload) => {
    return client.get(returnRoute)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return data;
            });
        });
};

export const postStockConfirmationRequest = (payload) => {
    return client.patch(confirmRoute, payload)
        .then(response => {
            return response
        });
};