// import {Platform} from 'react-native';

class GeoLocations {
    get(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                  resolve(position);
                  return position;
                },(error) => {
                    reject(error);
                    return error;
                },
                // {enableHighAccuracy: Platform.OS !== 'android', timeout: 2000, maximumAge: 2000 }
              );
        });
    }
}
export default new GeoLocations;