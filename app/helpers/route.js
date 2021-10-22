export const transformRoute = (routeData) => {
    if (!routeData) return [];
    return convertRouteData(routeData);
};

function convertRouteData(object) {
    object.map((value, key) => {
        let way_points = [];
        // Add LatLon for customer pointer
        value.customers.map((customer) => {
            if (customer.gps_lat && customer.gps_long) {
                customer.latLon = {latitude: JSON.parse(customer.gps_lat), longitude: JSON.parse(customer.gps_long)}
            } else {
                customer.latLon = {latitude: 0, longitude: 0}
            }
            if (customer.no_of_order === 0) {
                customer.marker_type = 'Red'
            } else if (customer.no_of_order !== 0 && customer.payment_reminding === 0) {
                customer.marker_type = 'Green'
            } else {
                customer.marker_type = 'Yellow'
            }

        });
        //Change way point format
        if (value.way_points) {
            let way = JSON.parse(value.way_points);
            way.map(value => {
                let result = getLngLat(value);
                way_points.push(result);
            })
        }
        //Change start point end point format
        let end_point = value.end_point ? JSON.parse(value.end_point) : {lat: 0, lng: 0};
        let start_point = value.start_point ? JSON.parse(value.start_point) : {lat: 0, lng: 0};
        object[key].end_point = getLngLat(end_point);
        object[key].start_point = getLngLat(start_point);
        object[key].way_points = way_points;
    });
    return object;
}

function getLngLat(latLng) {
    return endpoint = {
        latitude: latLng.lat,
        longitude: latLng.lng
    };
}

export const transformCalloutDashbord = (callOut) => {
    if (!callOut) return {};
    return convertCalloutData(callOut);
};

function convertCalloutData(callOut) {
    if (callOut.no_of_order === 0) {
        callOut.marker_type = 'Red'
    } else if (callOut.no_of_order !== 0 && callOut.payment_reminding === 0) {
        callOut.marker_type = 'Green'
    } else {
        callOut.marker_type = 'Yellow'
    }
    return callOut
}

export const transformCustomerLocation = (customerId, location) => {
    return {
        id: customerId,
        latLon: getLatLon(location)
    }
};

function getLatLon(location) {
    return {
        latitude: location.gps_lat,
        longitude: location.gps_long
    };
}