import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Linking,
    Platform,
    BackHandler,
    Alert
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {has, isEmpty, first} from 'lodash';
import {NavigationActions} from 'react-navigation'
import moment from "moment/moment";

import styles from './style'
import {loginProcess, getUserProcess, dateCheckProcess} from '../../../actions/auth'
import {configurationsLoad, sendFCM} from '../../../actions/system'
import Spinner from '../../../components/spinner'
import {getRoute} from "../../../actions/dashboard";

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        let {configurations} = props.screenProps.system;
        this.state = {
            user: null,
            selectDefaultUser: has(props.auth, 'user.id'),
            formData: {
                username: null,
                password: null,
            },
            isLoading: false,
            isError: false,
            errorText: configurations.loginScreenDefaultErrorText,
            serverDate: null
        };
        this.onPress = this.onPress.bind(this);
        this.onBackClicked = this._onBackClicked.bind(this);
        // this.openHomePage();
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackClicked);
        }
        if (this.props.auth.oauth) {
            if (this.props.auth.oauth.hasOwnProperty('access_token')) {
                this.props.navigation.navigate('Authorized');
            }
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackClicked);
        }
    }

    setUsername = (username) => {
        this.state.formData.username = username;
    };

    setPassword = (password) => {
        this.state.formData.password = password;
    };

    onPress() {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            this.props.getDate().then(date => {
                if (moment(date.date).isSame(moment().format('YYYY-MM-DD'))) {
                    this.loginStart();
                } else {
                    this.setState({isLoading: false});
                    alert('Please check your device date which is wrong!');
                }
            });
        } else {
            alert('Your connection was interrupted!');
        }
    }

    async loginStart() {
        this.setState({'isLoading': true, isError: false});
        let auth = await this.props.onLogin(this.state.formData).catch(exception => {
            this.setState({isLoading: false, isError: true});
            this.handelLoginException(exception);
        });
        if (!auth) return;
        let user = await this.props.getUser().catch(() => {
            this.setState({isLoading: false});
        });
        if (!user) return this.props.navigation.navigate('FaceUnlock');
        if (auth && user) {
            this.props.navigation.dispatch(NavigationActions.popToTop());
            this.props.navigation.navigate('Download');
            this.setState({isLoading: false, isError: false});
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <KeyboardAwareScrollView
                resetScrollToCoords={{x: 0, y: 0}}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
                keyboardShouldPersistTaps='always'
            >
                <StatusBar backgroundColor="#00897B" barStyle="light-content"/>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo}
                           source={require('../../../assets/images/logo.png')}/>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             color={'#00897B'}
                             textStyle={{color: '#00897B'}}/>
                    {this.renderForm()}
                </View>
                {this.renderFooter()}
            </KeyboardAwareScrollView>
        );
    }

    renderForm() {
        let {configurations} = this.props.screenProps.system;
        return (
            <View style={styles.formContainer}>
                <StatusBar backgroundColor="#00897B" barStyle="light-content"/>
                {
                    (this.state.isError)
                        ? <Text style={styles.loginErrorText}>{this.state.errorText}</Text>
                        : <Text style={styles.loginHelperText}>{configurations.loginScreenTitle}</Text>
                }
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder={configurations.loginScreenUsernamePlaceholder}
                        placeholderTextColor="rgba(0, 139, 139, 0.4)"
                        returnKeyType="next"
                        onSubmitEditing={() => this.passwordInput.focus()}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        blurOnSubmit={false}
                        underlineColorAndroid="transparent"
                        onChangeText={username => this.setUsername(username)}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder={configurations.loginScreenPasswordPlaceholder}
                        placeholderTextColor="rgba(0, 139, 139, 0.4)"
                        returnKeyType="go"
                        secureTextEntry
                        style={styles.input}
                        ref={(input) => this.passwordInput = input}
                        underlineColorAndroid="transparent"
                        onChangeText={password => this.setPassword(password)}
                        blurOnSubmit={true}
                        onSubmitEditing={this.onPress}
                    />
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={this.onPress}>
                    <Text style={styles.buttonText}>
                        {configurations.loginScreenSubmitButtonText}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.forgotPwdText}
                      onPress={() => Linking.openURL('http://google.com')}>
                    {configurations.forgotText}
                </Text>
            </View>
        )
    }

    renderFooter() {
        let {configurations} = this.props.screenProps.system;
        return (
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    {configurations.footerText}
                </Text>
                <Text style={styles.footerText}>
                    {"  " + configurations.versionText}
                </Text>
            </View>
        )
    }

    // openHomePage() {
    //     if (this.state.selectDefaultUser) {
    //         this.props.navigation.navigate('Authorized');
    //     }
    // }

    handelLoginException(exception) {
        if (exception.status === 400) {
            exception.json().then(response => {
                this.setState({errorText: response.hint});
            });
        }

        if (exception.status === 401) {
            exception.json().then(response => {
                this.setState({errorText: response.message});
            });
        }
    }

    _onBackClicked = () => {
        return BackHandler.exitApp()
    };
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    auth: state.auth,
    system: state.system,
});

const mapDispatchToProps = (dispatch) => ({
    onLogin({username, password}) {
        return dispatch(loginProcess({username, password}));
    },
    getRouteData(date) {
        return dispatch(getRoute(date));
    },
    getUser() {
        return dispatch(getUserProcess());
    },
    getDate() {
        return dispatch(dateCheckProcess());
    },
    loadConfigurations(tenantId) {
        return dispatch(configurationsLoad(tenantId));
    },
    sendFCMToken(payload) {
        return dispatch(sendFCM(payload))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
