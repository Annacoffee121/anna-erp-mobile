import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Image,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import styles from './style';
import {logoutProcess} from '../../../actions/auth';
import {storage} from '../../../config/storage';
// import {ImageCache} from 'react-native-img-cache'

class Logout extends Component {
    state = {
        loading: false
    };

    componentDidMount() {
        this.setState({loading: true});
        this.props.onLogout();
        this.clearStorage();
    }

    clearStorage() {
        storage.removeAll().then(() => {
            this.setState({loading: false});
            let {navigate} = this.props.navigation;
            navigate('Guest');
            // this.clearStage();
        });
    }

    // clearStage() {
    //     ImageCache.get().clear().done(() => {
    //         this.setState({loading: false});
    //         let {navigate} = this.props.navigation;
    //         navigate('Guest');
    //     });
    // }

    render() {
        if (!this.state.loading) return null;
        let {configurations} = this.props.system;
        return (
            <View style={[styles.container, {
                backgroundColor: configurations.baseBackgroundColor
            }]}>
                <StatusBar hidden={true}/>
                <View style={styles.centerContainer}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/images/logo.png')}
                    />
                    <ActivityIndicator color={'white'}
                                       size={'large'}
                                       style={styles.indicator}/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    system: state.system,
});

const mapDispatchToProps = (dispatch) => ({
    onLogout: () => {
        return dispatch(logoutProcess());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
