import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    mainHeading: {
        padding: 10,
        backgroundColor: '#fFF',
        color: '#00897B',
        fontSize: 16,
        width: '100%'
    },
    heading: {
        padding: 10,
        backgroundColor: '#fFF',
        color: '#ff7532',
        fontSize: 16,
        width: '100%'
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 30
    },
    mainContent: {
        flex:1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    secondaryVie: {
        height: '100%'
    },
    searchText: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5
    },
    clickText: {
        borderColor: '#636363',
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#FFF'
    },
    customerList: {
        padding: 10,
        // maxHeight: '70%',
        backgroundColor: '#FFF',
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 0,
    },
    buttonStyle: {
        width: 200,
        backgroundColor: '#00897B',
        alignItems: 'center',
        borderRadius: 3,
        padding: 10
    }
});