import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 140,
        height: 94
    },
    appTitle: {
        color: '#00897B',
        paddingTop: 20,
        fontSize: 22,
        fontWeight: '300'
    },
    appOwner: {
        color: '#00897B',
        paddingTop: 20,
        fontSize: 15,
        fontWeight: '200'
    },
    title: {
        color: 'white',
        marginTop: 10,
        width: 200,
        textAlign: 'center'
    },
    formContainer: {
        width:350,
        padding:10
    },
    loginHelperText: {
        color: '#00897B',
        paddingBottom: 10,
        textAlign: 'center'
    },
    loginErrorText: {
        textAlign: 'center',
        paddingBottom: 10,
        color:'#c32926'
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: 'rgba(0, 139, 139, 0.4)',
        marginBottom: 10,
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#00897B',
        paddingHorizontal: 10,

    },
    buttonContainer: {
        backgroundColor: '#00897B',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 18
    },
    footerContainer: {
        height:25,
        backgroundColor: '#00897B',
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText:{
        textAlign:'center',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    forgotPwdText:{
       color:'blue',
        marginTop:10,
    },
});
export default styles;