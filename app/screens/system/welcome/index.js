import React, {Component} from 'react';

import {
    View,
    Image,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import styles from './styles';

export default class WelcomeScreen extends Component<{}> {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={styles.centerContainer}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/logo.png')}
                    />
                    <ActivityIndicator color={'#00897B'}
                                       size={'large'}
                                       style={styles.indicator}/>
                </View>
            </View>
        );
    }
}
