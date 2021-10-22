import {
    loadCustomersRequest,
    loadAllCustomersRequest,
    fetchCustomerRequest,
    postNewCustomer,
    patchCustomer,
    fetchCustomerOrderRequest,
    fetchCustomerInvoiceRequest,
    fetchCustomerPaymentRequest,
    postNewContactPerson,
    patchContactPerson,
    deleteContactPerson,
} from '../../services/customer/index';

import {
    loadCustomersSuccess,
    loadAllCustomersSuccess,
    fetchCustomerSuccess,
    loadNewCustomersSuccess,
    patchCustomersSuccess,
    fetchCustomerOrderSuccess,
    fetchCustomerInvoiceSuccess,
    fetchCustomerPaymentSuccess,
    loadNewContactPersonSuccess,
    patchContactPersonSuccess,
    deleteContactPersonSuccess, fetchCustomerProductSuccess, loadNewNotVisitReasonSuccess,
    loadNotVisitReasonRealmSuccess, getReturnProductFromDbSuccess, getProductRateSuccess,
} from './dispatchers';
import {getAllCustomerData, getSingleCustomerData} from "../../../database/Customer/controller";
import {getOrderByCustomerId} from "../../../database/Order/controller";
import {getInvoiceByCustomerId} from "../../../database/Invoice/controller";
import {getAllPaymentByCustomerId} from "../../../database/Payment/controller";
import {fetchCustomerProductsRequest, postNewNotVisitReason} from "../../services/customer";
import {getNotVisitReasonById} from "../../../database/NotVisited/model";
import {getProductsByCustomerId, getRateByOrderId} from "../../../database/ReturnProducts/controller";

// export const getCustomers = (payload) => {
//     return (dispatch) => {
//         return loadCustomersRequest(payload).then(customers => {
//             dispatch(loadCustomersSuccess(customers));
//             return customers;
//         });
//     };
// };

export const getAllCustomers = (payload) => {
    return (dispatch) => {
        return loadAllCustomersRequest(payload).then(customers => {
            dispatch(loadAllCustomersSuccess(customers));
            return customers;
        });
    };
};

export const getCustomersFromRealm = (payload) => {
    return (dispatch) => {
        return getAllCustomerData(payload).then(customers => {
            dispatch(loadCustomersSuccess(customers));
            return customers;
        });
    };
};

// export const getCustomer = (payload) => {
//     return (dispatch) => {
//         return fetchCustomerRequest(payload).then(customer => {
//             dispatch(fetchCustomerSuccess(customer));
//             return customer;
//         });
//     };
// };

export const getCustomerFromRealm = (payload) => {
    return (dispatch) => {
        return getSingleCustomerData(payload).then(customer => {
            dispatch(fetchCustomerSuccess(customer));
            return customer;
        });
    };
};

export const setNewCustomer = (payload) => {
    return (dispatch) => {
        return postNewCustomer(payload).then(newCustomer => {
            dispatch(loadNewCustomersSuccess(newCustomer));
            return newCustomer;
        });
    };
};

export const updateCustomer = (id, payload) => {
    return (dispatch) => {
        return patchCustomer(id, payload).then(patchCustomer => {
            dispatch(patchCustomersSuccess(patchCustomer));
            return patchCustomer;
        });
    };
};

// export const getCustomerOrder = (payload) => {
//     return (dispatch) => {
//         return fetchCustomerOrderRequest(payload).then(customerOrder => {
//             dispatch(fetchCustomerOrderSuccess(customerOrder));
//             return customerOrder;
//         });
//     };
// };
export const getCustomerOrder = (payload) => {
    return (dispatch) => {
        return getOrderByCustomerId(payload).then(customerOrder => {
            dispatch(fetchCustomerOrderSuccess(customerOrder));
            return customerOrder;
        });
    };
};

// export const getCustomerInvoice = (payload) => {
//     return (dispatch) => {
//         return fetchCustomerInvoiceRequest(payload).then(customerInvoice => {
//             dispatch(fetchCustomerInvoiceSuccess(customerInvoice));
//             return customerInvoice;
//         });
//     };
// };
export const getCustomerInvoice = (payload) => {
    return (dispatch) => {
        return getInvoiceByCustomerId(payload).then(customerInvoice => {
            dispatch(fetchCustomerInvoiceSuccess(customerInvoice));
            return customerInvoice;
        });
    };
};

// export const getCustomerPayment = (payload) => {
//     return (dispatch) => {
//         return fetchCustomerPaymentRequest(payload).then(customerPayment => {
//             dispatch(fetchCustomerPaymentSuccess(customerPayment));
//             return customerPayment;
//         });
//     };
// };
export const getCustomerPayment = (payload) => {
    return (dispatch) => {
        return getAllPaymentByCustomerId(payload).then(customerPayment => {
            dispatch(fetchCustomerPaymentSuccess(customerPayment));
            return customerPayment;
        });
    };
};

export const getCustomerProducts = (payload) => {
    return (dispatch) => {
        return fetchCustomerProductsRequest(payload).then(customerProducts => {
            dispatch(fetchCustomerProductSuccess(customerProducts));
            return customerProducts;
        });
    };
};

export const getReturnProductsFromDb = (payload) => {
    return (dispatch) => {
        return getProductsByCustomerId(payload).then(returnProducts => {
            dispatch(getReturnProductFromDbSuccess(returnProducts));
            return returnProducts;
        });
    };
};

export const getReturnRateByOrderId = (product_id, order_id) => {
    return (dispatch) => {
        return getRateByOrderId(product_id, order_id).then(returnProducts => {
            dispatch(getProductRateSuccess(returnProducts));
            return returnProducts;
        });
    };
};

export const setNewContactPerson = (id, payload) => {
    return (dispatch) => {
        return postNewContactPerson(id, payload).then(newContactPerson => {
            dispatch(loadNewContactPersonSuccess(newContactPerson));
            return newContactPerson;
        });
    };
};

export const updateContactPerson = (id, payload) => {
    return (dispatch) => {
        return patchContactPerson(id, payload).then(patchContactPerson => {
            dispatch(patchContactPersonSuccess(patchContactPerson));
            return patchContactPerson;
        });
    };
};

export const removeContactPerson = (id) => {
    return (dispatch) => {
        return deleteContactPerson(id).then(deleteContactPerson => {
            dispatch(deleteContactPersonSuccess(deleteContactPerson));
            return deleteContactPerson;
        });
    };
};

export const setNewNotVisitReason = (id, payload) => {
    return (dispatch) => {
        return postNewNotVisitReason(id, payload).then(newReason => {
            dispatch(loadNewNotVisitReasonSuccess(newReason));
            return newReason;
        });
    };
};

export const getNotVisitReason = (id) => {
    return (dispatch) => {
        return getNotVisitReasonById(id).then(reason => {
            dispatch(loadNotVisitReasonRealmSuccess(reason));
            return reason;
        });
    };
};