import {StyleSheet} from 'react-native';
import defaultStyles from "../../../defaultStyles";

export default {
    container: defaultStyles.container,
    content: defaultStyles.content,
    input: defaultStyles.input,

    ...StyleSheet.create({
        contentView: {
            padding: 5,
            backgroundColor: '#FFFFFF'
        },
        label: {
            paddingBottom: 5,
        },
        inputWrapper: {
            borderWidth: 1,
            borderColor: 'rgba(0, 139, 139, 0.4)',
            marginBottom: 10,
            backgroundColor: '#FFFFFF'
        },
    })
};
