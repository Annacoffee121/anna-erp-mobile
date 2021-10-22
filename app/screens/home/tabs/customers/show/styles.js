import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeff3'
    },
    content: {
        padding: 10,
    },
    customerHeader: {
        padding: 5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff'
    },
    buttonView: {
        marginTop: 5,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    headingText: {
        fontSize: 18,
        color: '#000000'
    },
    normalText: {
        fontSize: 15,
    },
    touchableView: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableStyle: {
        marginRight: 2,
        backgroundColor: '#00897B',
        height: 35,
        width: 93,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00897B',
    },
    targetView: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 5
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
    createOrder: {
        marginTop: 10,
        width: '40%',
        height: 40,
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#00897B',
        justifyContent: 'center'
    },
    mainView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    }
});