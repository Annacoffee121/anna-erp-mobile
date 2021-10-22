import {
    StyleSheet
} from 'react-native';
import {containerColors, containerHeaderColors, headerColors} from '../../../../config/theme'
export default StyleSheet.create({
    container: {
        ...containerColors
    },
    header : {
        ...headerColors
    },
    list: {
        marginTop: 1,
        ...containerColors
    },
    ListItemDivider : {
        ...containerHeaderColors
    },
    ListItemDividerText: {
        fontWeight: 'bold',
        color: 'black',
    },
    ListItem: {
        marginBottom : 1,
        ...containerColors
    },
    left : {
        width: 55,
    },
    text : {

    },
    image : {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 10,
        borderColor: '#B2B7BB',
        borderWidth: 2
    },
    textContainer:{
        height: 40,
        padding: 0,
        margin: 0,
        borderBottomColor: '#C9C9C8',
        flex: 1,
        flexDirection: 'row'
    }
});