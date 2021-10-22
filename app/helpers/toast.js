import {Toast} from 'native-base';

export const showMessage = (text) => {
    Toast.show({
        text,
        position: 'bottom',
        duration: 2000,
        style: {
            marginBottom: 0,
        }
    });
};