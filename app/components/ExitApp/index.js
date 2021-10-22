import React, {Component} from 'react';
import {
    View,
    Image,
    ActivityIndicator, BackHandler,
} from 'react-native';
import {get_allocation} from "../../../database/Mata/model";
import {validateAllocationDate} from "../../helpers/allocationDateCheck";
import {storage} from "../../config/storage";
import {deleteAll} from "../../../database/Customer/controller";
import {NavigationActions} from "react-navigation";
import styles from './styles';
import {showMessage} from "../../helpers/toast";
import connect from "react-redux/es/connect/connect";
import {logoutProcess} from "../../actions/auth";

class ExitScreen extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            doubleBackToExitPressedOnce: false,
        };
    }

    componentWillMount() {
        this.userValidation();
    }

    userValidation(){
        if (this.props.user){
            this.validateAllocation();
        } else{
            this.props.navigation.navigate('FaceUnlock');
        }
    }

    validateAllocation() {
        get_allocation().then(allocation => {
            if (!allocation) return;
            if (validateAllocationDate(allocation.to_date)) {
                this.exitFromApp();
            } else {
                this.props.navigation.navigate('Authorized');
            }
        })
    }

    exitFromApp() {
        this.setState({loading: true});
        this.props.onLogout();
        storage.removeAll().then(() => {
            deleteAll().then(() => {
                this.setState({loading: false});
                this.props.navigation.dispatch(NavigationActions.popToTop());
                let {navigate} = this.props.navigation;
                navigate('Guest');
            }).catch(error => console.log(error, 'error'))
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/images/logo.png')}
                    />
                    <ActivityIndicator color={'#00897B'}
                                       size={'large'}
                                       style={styles.indicator}/>
                </View>
            </View>
        );
    }

    _onBackClicked = () => {
        // return BackHandler.exitApp()
        if (this.state.doubleBackToExitPressedOnce) {
            BackHandler.exitApp();
        }
        showMessage('Press back again to exit');
        this.setState({doubleBackToExitPressedOnce: true});
        setTimeout(() => {
            this.setState({doubleBackToExitPressedOnce: false});
        }, 2000);
        return true;
    };
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
});

const mapDispatchToProps = (dispatch) => ({
    onLogout: () => {
        return dispatch(logoutProcess());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExitScreen);
