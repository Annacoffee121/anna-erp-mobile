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
    mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
        alignItems: 'center'
    },
    rotatedText: {
        backgroundColor: '#ff5215',
        color: '#FFF',
        width: 170,
        textAlign: 'center',
        transform: [{rotate: '-50deg'}]
    },
    rotatedTextTwo: {
        backgroundColor: '#00d800',
        color: '#FFF',
        width: 170,
        textAlign: 'center',
        transform: [{rotate: '-45deg'}]
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    valueText: {
        fontSize: 17,
        color: '#000000'
    },
    normalText: {
        fontSize: 17,
    },
    valueTextWithFlex: {
        fontSize: 17,
        color: '#000000',
        textAlign: 'right',
        flex: 1
    },
    normalTextWithFlex: {
        fontSize: 17,
        textAlign: 'right',
        flex: 1
    },
    smallTextWithFlex: {
        fontSize: 12,
        textAlign: 'right',
        flex: 1,
        marginRight:30,
    },
    blackText: {
        color: '#000000'
    },
    itemMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});