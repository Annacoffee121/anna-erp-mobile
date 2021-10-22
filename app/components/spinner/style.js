import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    spinnerBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#FFFFFF'
    },
    spinnerTextContainer: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    spinnerTextContent: {
        top: 80,
        height: 50,
        fontSize: 20,
        fontWeight: 'bold'
    },
});
export default styles;