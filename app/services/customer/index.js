import {client} from '../../config/api';
import {apiRoute} from "../../helpers/api";
import {transformForAllCustomers} from "../../helpers/customer";
import {transformSingleCustomers} from "../../helpers/singleCustomers";

const contactRoute = apiRoute('customers');
const contactPersonRoute = apiRoute('contact-person');
const salesRoute = apiRoute('sales/return/');

// export const loadCustomersRequest = (payload) => {
//     return client.get(contactRoute)
//         .then(response => {
//             return response.json().then(({data}) => {
//                 if (payload) return data;
//                 return transformCustomers(data);
//             });
//         });
// };

export const loadAllCustomersRequest = (payload) => {
    let route = contactRoute + '/for-today';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                if (payload) return data;
                return transformForAllCustomers(data);
            });
        });
};

export const fetchCustomerRequest = (contact) => {
    let route = contactRoute + '/' + contact;
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return transformSingleCustomers(data);
            });
        });
};

export const postNewCustomer = (payload) => {
    return client.post(contactRoute, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchCustomer = (id, payload) => {
    let route = contactRoute + '/' + id;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchCustomerLocation = (id, payload) => {
    let route = contactRoute + '/' + id + '/location';
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const fetchCustomerOrderRequest = (customerId) => {
    let route = contactRoute + '/' + customerId + '/orders';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data
            });
        });
};

export const fetchCustomerInvoiceRequest = (customerId) => {
    let route = contactRoute + '/' + customerId + '/invoices';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data
            });
        });
};

export const fetchCustomerPaymentRequest = (customerId) => {
    let route = contactRoute + '/' + customerId + '/payments';
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data
            });
        });
};

export const fetchCustomerProductsRequest = (customerId) => {
    let route = salesRoute + customerId;
    return client.get(route)
        .then(response => {
            return response.json().then(({data}) => {
                return data
            });
        });
};

export const postNewContactPerson = (customerId, payload) => {
    let route = contactPersonRoute + '/customer/' + customerId;
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const patchContactPerson = (id, payload) => {
    let route = contactPersonRoute + '/' + id;
    return client.patch(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};

export const deleteContactPerson = (Id) => {
    let route = contactPersonRoute + '/' + Id;
    return client.delete(route)
        .then(response => {
            return response.json().then((value) => {
                return value;
            });
        });
};

export const postNewNotVisitReason = (customerId, payload) => {
    let route = contactRoute + '/' + customerId + '/not-visited';
    return client.post(route, payload)
        .then(response => {
            return response.json().then(({data}) => {
                return data;
            });
        });
};