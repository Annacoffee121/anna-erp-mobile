import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    mainContent: {
        padding: 10
    },
    secondaryVie: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 0,
        borderColor: '#fff',
    },
    secondMainContent: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    expensesList: {
        marginTop: 3,
        backgroundColor: '#d7d7d7',
        padding: 5,
        borderRadius: 5,
        borderColor: '#d7d7d7',
    },
    secondListView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    forgotPwdText:{
        color:'blue',
        marginTop:5,
        textAlign:'center',
        textDecorationLine:'underline'
    },
});