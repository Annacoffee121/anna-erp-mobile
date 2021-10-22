export const transformSingleCustomers = (customer) => {
    if (!customer) return {};
    return transformData(customer);
};


function transformData(object) {
    object.customerDetails = {
        salutation: object.salutation ? object.salutation : '',
        first_name: object.first_name ? object.first_name : '',
        last_name: object.last_name ? object.last_name : '',
        display_name: object.display_name ? object.display_name : '',
        phone: object.phone ? object.phone : '',
        fax: object.fax ? object.fax : '',
        mobile: object.mobile ? object.mobile : '',
        email: object.email ? object.email : '',
        website: object.website ? object.website : '',
        notes: object.notes ? object.notes : '',
        logo_file: object.logo_file ? object.logo_file : '',
        is_active: object.is_active ? object.is_active : '',
        route_id: object.route.id ? object.route.id : 0,
        location_id: object.location.id ? object.location.id : 0,
        street_one: '',
        street_two: '',
        city: '',
        province: '',
        postal_code: '',
        country_id: 0,
        contact_persons: object.contact_persons,
        gps_lat:object.gps_lat ? object.gps_lat : 0,
        gps_long: object.gps_long ? object.gps_long :0,
    };
    object.addresses.map((value) => {
        object.customerDetails.street_one = value.street_one ? value.street_one : '';
        object.customerDetails.street_two = value.street_two ? value.street_two : '';
        object.customerDetails.city = value.city ? value.city : '';
        object.customerDetails.province = value.province ? value.province : '';
        object.customerDetails.postal_code = value.postal_code ? value.postal_code : '';
        object.customerDetails.country_id = value.country_id ? value.country_id : 0;
        object.country = value.country_id ? value.country.name : '';
    });
    object.route = object.route.name;
    object.routeLocation = object.location.name;
    // delete object.addresses;
    return object;
}