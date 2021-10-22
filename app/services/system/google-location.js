import Geolocation from 'react-native-geolocation-service';

class GeoLocationService {
    get() {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    resolve(position);
                    return position;
                },
                error => {
                    reject(error);
                    return error;
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
        });
    }
}

export default new GeoLocationService();
