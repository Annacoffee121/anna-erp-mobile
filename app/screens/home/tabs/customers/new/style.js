import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    subContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff'
    },
    headerView: {
        flexDirection: 'row',
    },
    lineBorder: {
        height: 2,
        backgroundColor: '#909090',
        marginLeft: 5,
        marginRight: 5,
    },
    subLineBorder: {
        height: 1,
        backgroundColor: '#9c9c9c',
    },
    textInputStyle: {
        textAlign: 'right',
        width: 250,
        marginEnd: 10
    },
    checkBoxStyle: {
        borderColor: '#FFF',
        backgroundColor: '#FFF'
    }
});
export default styles;