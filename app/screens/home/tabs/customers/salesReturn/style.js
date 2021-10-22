import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    subContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff'
    },
    viseContainer: {
        marginTop: 5,
        backgroundColor: '#FFF',
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FFF'
    },
    resolutionView: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-between'
    },
    buttonStyle: {
        backgroundColor: '#00897B',
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },
    errorText: {
        color: '#d92626',
        padding: 10,
        textAlign: 'center'
    },
    headerText: {
        fontSize: 20,
        color: '#00897B',
        marginBottom: 10
    },
    removeIcon: {
        width: '10%',
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resView: {
        flexDirection: 'row',
        marginTop: 5,
        backgroundColor: 'rgba(0,137,123, 0.4)',
        padding: 5
    }
});
export default styles;