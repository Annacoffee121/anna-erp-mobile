import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    mapContent: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 10,
        position: 'relative',
        height: 550,
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'white',
    },
    mapView: {
        height: '90%',
        width: '100%',
        position: 'relative',
    },
    staffViewContent: {
        padding: 10,
    },
    staffView: {
        padding: 5,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    staffName: {
        fontSize: 18,
        color: '#000'
    },
    staffEmail: {
        fontSize: 14,
    },
    targetView: {
        padding: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    headingText: {
        fontSize: 20,
        color: '#00897B',
        marginBottom: 10
    },
    targetValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    targetValueView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDownStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: '35%'
    },
    calloutStyle: {
        height: 210,
        width: 300,
        flex: 1,
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    calloutViewStyle: {
        flexGrow: 1,
        backgroundColor: '#00897B',
        paddingLeft: 10,
        paddingRight: 10
    },
    calloutTextOne: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 17
    },
});