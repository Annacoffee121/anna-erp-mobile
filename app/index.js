/**
 * AnnA React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {has} from 'lodash'
import {NetInfo, AppState} from 'react-native'
import {Provider} from 'react-redux'
import React, {Component} from 'react'
import store from './stores'
import {Root} from 'native-base'
import createRootNavigator from './navigators'
import WelcomeScreen from './screens/system/welcome'
import {isConnected} from './services/system'
import {handleQueues} from './helpers/queues'
import {changeConnectionStatus} from './actions/system'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
            loading: true,
            authorize: false,
            systemProps: {},
            appState: AppState.currentState
        };
    }

    componentDidMount() {
        this.initStore();
        // NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange.bind(this));
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.connectivityListener.bind(this)
        );
        // NetInfo.removeEventListener('connectionChange', this.handleFirstConnectivityChange.bind(this));
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    // handleFirstConnectivityChange(connectionInfo) {
    //     if (!this.state.store) return;
    //     const storeState = this.state.store.getState();
    //     if (enableSync(connectionInfo)) {
    //         const {order} = storeState;
    //         if (order.status) return;
    //         setTimeout(() => {
    //             NetInfo.getConnectionInfo().then(connectionInfo2 => {
    //                 if (!order.status && enableSync(connectionInfo2)) handleQueues(this.state.store);
    //             });
    //         }, 15000);
    //     }
    // }

    handleAppStateChange = async nextAppState => {
        this.setState({appState: nextAppState});
    };

    initStore() {
        store().then(store => {
            this.setState({store}, () => {
                this.initConnection();
                // this.handelFCMRegister();
            });
        }).catch(errors => {
            console.log('Store errors', errors);
        });
    }

    initConnection() {
        isConnected().then(isConnected => {
            this.connectivityListener(isConnected);
            this.handelConnection();
        });
    }

    initState() {
        let state = this.state.store.getState();
        this.setState({
            loading: false,
            authorize: has(state, 'auth.oauth.access_token')
        });
    }

    render() {
        const {loading, store} = this.state;
        if (loading) return <WelcomeScreen/>;
        const storeState = store.getState();
        const Navigators = createRootNavigator(this.state.authorize);
        let {auth, system} = storeState;


        return (
            <Provider store={store}>
                <Root>
                    <Navigators screenProps={{
                        auth, system, ...this.state.systemProps
                    }}/>
                </Root>
            </Provider>
        )
    }

    handelConnection() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.connectivityListener.bind(this)
        );
        this.initState();
    }

    connectivityListener(isConnected) {
        if (!this.state.store) return;
        NetInfo.getConnectionInfo().then(connectionInfo => {
            const storeState = this.state.store.getState();
            if (isConnected && enableSync(connectionInfo)) {
                setTimeout(() => {
                    const {order} = storeState;
                    NetInfo.getConnectionInfo().then(connectionInfo2 => {
                        if (isConnected && !order.status && enableSync(connectionInfo2)) handleQueues(this.state.store);
                    });
                }, 10000);
            }
        });
        this.state.store.dispatch(changeConnectionStatus(isConnected));
    }
}

function enableSync(connectionInfo) {
    const type = connectionInfo.type;
    const eType = connectionInfo.effectiveType;
    if (type === "wifi") {
        return true;
    } else if (type === "cellular") {
        if (eType === "4g" || eType === "3g") return true
    }
    return false;
}