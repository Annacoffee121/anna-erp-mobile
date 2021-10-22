import * as _ from 'lodash';
import {ID} from "./createId";

export const transformCustomers = (contacts, alphabet = true) => {
    if (!contacts) return [];
    if (!alphabet) return contacts;
    return alphabetKeyObject(contacts);
};

function alphabetKeyObject(object) {
    let alphabetContact = [];
    Object.keys(object).forEach(function (key) {
        let customer = {};
        customer.id = object[key].id;
        customer.salutation = object[key].salutation;
        customer.first_name = object[key].first_name;
        customer.last_name = object[key].last_name;
        customer.tamil_name = object[key].tamil_name ? object[key].tamil_name : '';
        customer.full_name = object[key].full_name ? object[key].full_name : '';
        customer.display_name = object[key].display_name ? object[key].display_name : '';
        customer.email = object[key].email;

        let lastName = customer.display_name;
        let firstLetter = lastName ? lastName.charAt(0).toUpperCase() : '#';
        if (!alphabetContact.hasOwnProperty(firstLetter)) alphabetContact[firstLetter] = [];
        alphabetContact[firstLetter] = pushToArray(alphabetContact[firstLetter], customer)
    });
    return sortObject(alphabetContact);
}

function pushToArray(arr, val) {
    if (arr.length === _.pull(arr, val).length) {
        arr.push(val);
    }
    return arr;
}

function sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

export const transformCustomerForDropDown = (contacts) => {
    if (!contacts) return [];
    return filterCustomerForDropDown(contacts);
};

function filterCustomerForDropDown(contacts) {
    let data = [];
    contacts.map(customer => {
        let dropData = {};
        dropData.value = customer.id;
        dropData.name = customer.display_name ? customer.display_name : customer.last_name;
        dropData.tamil_name = customer.tamil_name ? customer.tamil_name : '';
        data.push(dropData)
    });
    return data;
}

export const transformContactPerson = (contacts) => {
    if (!contacts) return {};
    return convertContactPerson(contacts);
};

function convertContactPerson(contacts) {
    let ContactPersonData = {};
    ContactPersonData.salutation = contacts.salutation ? contacts.salutation : '';
    ContactPersonData.first_name = contacts.first_name ? contacts.first_name : '';
    ContactPersonData.last_name = contacts.last_name ? contacts.last_name : '';
    ContactPersonData.full_name = contacts.full_name ? contacts.full_name : '';
    ContactPersonData.email = contacts.email ? contacts.email : '';
    ContactPersonData.phone = contacts.phone ? contacts.phone : '';
    ContactPersonData.mobile = contacts.mobile ? contacts.mobile : '';
    ContactPersonData.designation = contacts.designation ? contacts.designation : '';
    ContactPersonData.department = contacts.department ? contacts.department : '';
    return ContactPersonData;
}

export const transformForAllCustomers = (customer) => {
    if (!customer) return [];
    return changeCountry(customer);
};

// Add Customer detail array to DB
function changeCountry(data) {
    data.map((customer) => {
        if (customer.route) {
            customer.route_id = customer.route.id;
            customer.route_name = customer.route.name;
        }

        customer.gps_lat ? customer.gps_lat = JSON.parse(customer.gps_lat) : customer.gps_lat = 0;
        customer.gps_long ? customer.gps_long = JSON.parse(customer.gps_long) : customer.gps_long = 0;

        if (!customer.outstanding) {
            customer.outstanding = {
                ordered: 0,
                invoiced: 0,
                paid: 0,
                balance: 0
            }
        }

        if (customer.location) {
            customer.location_id = customer.location.id;
            customer.location_name = customer.location.name;
        }

        if (customer.addresses) {
            customer.addresses.map((address) => {
                customer.country_name = address.country.name;
                customer.country_id = address.country.id;
                customer.street_one = address.street_one;
                customer.street_two = address.street_two;
                customer.city = address.city;
                customer.province = address.province;
                customer.postal_code = address.postal_code;
            })
        }
        if(customer.not_realized_cheque.length){
            let newNotRealizedCheque = [];
            customer.not_realized_cheque.map(cheque=>{
                let newData= {};
                newData.id= cheque.id;
                newData.payment= cheque.payment;
                newData.payment_date= cheque.payment_date;
                newData.cheque_type= cheque.cheque_type;
                newData.cheque_no= cheque.cheque_no;
                newData.cheque_date= cheque.cheque_date;
                newData.bank_id= cheque.bank_id;
                newData.deposited_to= cheque.deposited_to.id;
                newData.payment_type= cheque.payment_type;
                newData.bank_name= cheque.bank.name;
                newNotRealizedCheque.push(newData)
            });
            customer.not_realized_cheque = newNotRealizedCheque;
        }
    });
    return data
}

export const transformUpdateCustomer = (customer) => {
    if (!customer) return {};
    return changeUpdateCustomer(customer);
};

function changeUpdateCustomer(customer) {
    if (customer.route) {
        customer.route_id = customer.route.id;
        customer.route_name = customer.route.name;
    }

    customer.gps_lat ? customer.gps_lat = JSON.parse(customer.gps_lat) : customer.gps_lat = 0;
    customer.gps_long ? customer.gps_long = JSON.parse(customer.gps_long) : customer.gps_long = 0;
    customer.not_realized_cheque = [];

    if (!customer.outstanding) {
        customer.outstanding = {
            ordered: 0,
            invoiced: 0,
            paid: 0,
            balance: 0
        }
    }

    if (customer.location) {
        customer.location_id = customer.location.id;
        customer.location_name = customer.location.name;
    }

    if (customer.addresses) {
        customer.addresses.map((address) => {
            customer.country_name = address.country.name;
            customer.country_id = address.country.id;
            customer.street_one = address.street_one;
            customer.street_two = address.street_two;
            customer.city = address.city;
            customer.province = address.province;
            customer.postal_code = address.postal_code;
        })
    }
    return customer;
}

export const transformOfflineCustomerForRealm = (customer) => {
    if (!customer) return {};
    return changeOfflineCustomer(customer);
};

function changeOfflineCustomer(customer) {
    customer.customerDetails.id = ID();                                     // Create a random number for id
    customer.customerDetails.country_name = customer.country;               // Set country name
    customer.customerDetails.location_name = customer.routeLocation;        // Set Route location name
    customer.customerDetails.not_sync = true;                               // Set not_sync to true to sync later
    customer.not_realized_cheque = [];                               // Set not_sync to true to sync later

    if (customer.customerDetails.contact_persons) {
        customer.customerDetails.contact_persons.map(person => {
            person.id = ID();
        })
    }

    if (!customer.outstanding) {                                            // set outstanding
        customer.customerDetails.outstanding = {
            ordered: 0,
            invoiced: 0,
            paid: 0,
            balance: 0
        }
    }
    return customer.customerDetails;
}

export const transformOfflineCustomerForSync = (customer) => {
    if (!customer) return {};
    return changeOfflineCustomerToSync(customer);
};

function changeOfflineCustomerToSync(customer) {
    let customerData = {};
    let contactPerson = [];

    if (customer.contact_persons.length > 0) {
        customer.contact_persons.map(contact => {
            let contactPersonData = {};
            contactPersonData.salutation = contact.salutation;
            contactPersonData.first_name = contact.first_name;
            contactPersonData.last_name = contact.last_name;
            contactPersonData.full_name = contact.full_name;
            contactPersonData.email = contact.email;
            contactPersonData.phone = contact.phone;
            contactPersonData.mobile = contact.mobile;
            contactPersonData.designation = contact.designation;
            contactPersonData.department = contact.department;
            contactPerson.push(contactPersonData)
        });
    }

    customerData.salutation = customer.salutation;
    customerData.first_name = customer.first_name;
    customerData.last_name = customer.last_name;
    customerData.display_name = customer.display_name;
    customerData.phone = customer.phone;
    customerData.fax = customer.fax;
    customerData.mobile = customer.mobile;
    customerData.email = customer.email;
    customerData.website = customer.website;
    customerData.street_one = customer.street_one;
    customerData.street_two = customer.street_two;
    customerData.city = customer.city;
    customerData.province = customer.province;
    customerData.postal_code = customer.postal_code;
    customerData.country_id = customer.country_id;
    customerData.route_id = customer.route_id;
    customerData.location_id = customer.location_id;
    customerData.notes = customer.notes;
    customerData.logo_file = customer.logo_file;
    customerData.is_active = 'Yes';
    customerData.contact_persons = contactPerson;
    customerData.gps_lat = customer.gps_lat;
    customerData.gps_long = customer.gps_long;

    return customerData;
}

export const transformCustomerOrderOutstanding = (order, outstanding) => {
    if (!order) return {};
    if (!outstanding) return {};
    return convertOutstanding(order, outstanding);
};

function convertOutstanding(order, outstanding) {
    let balance = (order.total + outstanding.ordered) - outstanding.paid;
    let returnData = {};
    returnData.id = order.customer_id;
    returnData.outstanding = {
        ordered: order.total + outstanding.ordered,
        invoiced: outstanding.invoiced,
        paid: outstanding.paid,
        balance: balance,
    };
    return returnData;
}

export const transformCustomerInvoiceOutstanding = (invoice, outstanding) => {
    if (!invoice) return {};
    if (!outstanding) return {};
    return convertInvOutstanding(invoice, outstanding);
};

function convertInvOutstanding(invoice, outstanding) {
    let returnData = {};
    returnData.id = invoice.customer_id;
    returnData.outstanding = {
        ordered: outstanding.ordered,
        invoiced: outstanding.invoiced + invoice.amount,
        paid: outstanding.paid,
        balance: outstanding.balance,
    };
    return returnData;
}

export const transformCustomerPaymentOutstanding = (payment, customer) => {
    if (!payment) return {};
    if (!customer) return {};
    return convertPaymentOutstanding(payment, customer.outstanding, customer.outstanding_orders);
};

function convertPaymentOutstanding(payment, outstanding, outstanding_orders) {
    let newOutstanding_orders = [];
    if (outstanding_orders.length) {
        outstanding_orders.map(outstanding_order => {
            if (outstanding_order.id === payment.sales_order_id) {
                let newData = {};
                newData.id = outstanding_order.id;
                newData.ref = outstanding_order.ref;
                newData.order_no = outstanding_order.order_no;
                newData.amount = outstanding_order.amount - payment.payment;
                newOutstanding_orders.push(newData);
            } else {
                newOutstanding_orders.push(outstanding_order)
            }
        })

    }
    let balance = outstanding.ordered - (outstanding.paid + payment.payment);
    let returnData = {};
    returnData.id = payment.customer_id;
    returnData.outstanding = {
        ordered: outstanding.ordered,
        invoiced: outstanding.invoiced,
        paid: outstanding.paid + payment.payment,
        balance: balance,
    };
    if (newOutstanding_orders.length) {
        returnData.outstanding_orders = newOutstanding_orders
    }
    return returnData;
}

export const transformBulkCustomerPaymentOutstanding = (paymentTotal, outstanding, customer_id) => {
    if (!outstanding) return {};
    return convertBulkPaymentOutstanding(paymentTotal, outstanding, customer_id);
};

function convertBulkPaymentOutstanding(paymentTotal, outstanding, customer_id) {
    let balance = outstanding.ordered - (outstanding.paid + paymentTotal);
    let returnData = {};
    returnData.id = customer_id;
    returnData.outstanding = {
        ordered: outstanding.ordered,
        invoiced: outstanding.invoiced,
        paid: outstanding.paid + paymentTotal,
        balance: balance,
    };
    return returnData;
}