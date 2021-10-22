import {
    StyleSheet
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    staffViewContent: {
        paddingTop: 15,
        paddingBottom: 15
    },
    viewContent: {
        paddingBottom: 15
    },
    staffView: {
        backgroundColor: '#FFFFFF',
        borderColor: '#fff',
    },
    footerContainer: {
        height:25,
        backgroundColor: 'transparent',
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText:{
        textAlign:'center',
        color: '#00897B',
    },
});