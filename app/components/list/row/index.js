import React, {
    Component
} from 'react';

import {
    Text,
    View,
} from 'react-native';

import styles from './styles';
import PropTypes from './prop-types';

export default class ListRow extends Component<{}> {
    rowPress() {
        if(typeof this.props.rowPress === 'undefined') return;
        this.props.rowPress(this.props.item);
    }

    render() {
        return (
            <View
                style={styles.container}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}
                      onPress={this.rowPress.bind(this)}>{this.props.item.name}</Text>
            </View>
        );
    }
}

ListRow.propTypes = PropTypes;