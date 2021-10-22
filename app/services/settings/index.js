import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
// import {transformSingleCustomers} from "../../helpers/singleCustomers";

const contactRoute = apiRoute('setting/');
const searchRoute = apiRoute('search/');

export const fetchOneProductRequest = (productId) => {
    let route = contactRoute + 'products/' + productId;
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                // return transformSingleCustomers(data);
                return data;
            });
        });
};

export const loadPriceBookDataRequest = () => {
    let route = contactRoute + 'price-books';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const loadExpenseTypeRequest = () => {
    let route = searchRoute + 'expense-type';
    return client.get(route)
        .then(response => {
            return response.json().then(({results}) => {
                return results;
            });
        });
};