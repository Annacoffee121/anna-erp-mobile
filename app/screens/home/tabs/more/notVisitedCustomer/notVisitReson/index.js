import React, {Component,} from 'react';
import {Text, View, Alert} from 'react-native'
import {connect} from "react-redux";
import {Avatar} from 'react-native-elements'
import {Container, Content} from "native-base";
import DropdownAlert from 'react-native-dropdownalert';
import styles from "../styles";
import Spinner from "../../../../../../components/spinner";
import ScreenHeader from "../../../../../../components/textHeader";
import {validateEmptyInputText} from "../../../../../../helpers/customerValidation";
import {TextField} from "react-native-material-textfield";
import {insertNotVisitReason} from "../../../../../../../database/NotVisited/model";
import GeoLocationService from "../../../../../../services/system/google-location";
import {showMessage} from "../../../../../../helpers/toast";
import {setNewNotVisitReason} from "../../../../../../actions/customer";
import {mapNotVisitReason} from "../../../../../../helpers/salesReturn";

class AddNotVisitedReason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            reasonData: null,
            hasError: false
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            reasonData: state.params.reasonData,
            isLoading: false
        });
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params) {
            state.params.refresh();
        }
    }

    onError = error => {
        if (error) {
            let errorKeys = Object.keys(error.errors);
            if (errorKeys.length) {
                this.dropdown.alertWithType('error', error.message, error.errors[errorKeys[0]][0]);
            }
        }
    };

    onDbError = error => {
        this.dropdown.alertWithType('error', 'Database insert error', 'GPS coordinates not found, Please check the gps');
    };

    render() {
        return (
            <Container style={{backgroundColor:'#efeff3'}}>
                <ScreenHeader name={'Not Visit Reason'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                              rightButtonValue='Submit'
                              rightButtonPress={() => this.getGeoLocationAndStoreReason(this.state.reasonData)}
                />
                <Spinner visible={this.state.isLoading}
                         textContent={'Loading'}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                <Content>
                    {
                        this.state.reasonData ?
                            this.renderCustomerList() :
                            <Text>Loading...</Text>
                    }
                </Content>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        )
    }

    renderCustomerList() {
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    <View style={{padding: 10}}>
                        <TextField
                            label={'Customer name'}
                            value={this.state.reasonData.name}
                            tintColor={'#00897B'}
                            editable={false}
                        />
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                            <TextField
                                label={'Not visited reason'}
                                value={this.state.reasonData.reason ? this.state.reasonData.reason : ''}
                                returnKeyType="next"
                                containerStyle={{width: '90%'}}
                                onChangeText={(value) => {
                                    this.setState({
                                        reasonData: {...this.state.reasonData, reason: value}
                                    })
                                }}
                                tintColor={'#00897B'}
                                error={this.state.hasError ? validateEmptyInputText(this.state.reasonData.reason) : null}
                            />
                            <Avatar
                                medium
                                rounded
                                icon={{
                                    name: 'ios-arrow-dropdown-circle',
                                    type: 'ionicon',
                                    color: '#00897B',
                                    size: 40
                                }}
                                overlayContainerStyle={{backgroundColor: 'white'}}
                                onPress={() => this.handleReasonList()}
                                activeOpacity={0.7}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    handleReasonList() {
        this.props.navigation.navigate('Reason', {returnReasonData: this.returnReasonData.bind(this)});
    }

    returnReasonData(reason) {
        this.setState({
            reasonData: {...this.state.reasonData, reason: reason}
        })
    }

    getGeoLocationAndStoreReason(reasonData) {
        if (!reasonData.reason || reasonData.reason === '') return this.setState({hasError: true});
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            console.log('errors', errors);
        }).done(() => {
            Alert.alert(
                'Are you sure ?',
                'Do you want to submit this not visit reason?',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes', onPress: () => this.handelStoreReason()},
                ],
                {cancelable: false}
            );
        })
    }

    addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            this.setState({
                reasonData: {
                    ...this.state.reasonData,
                    gps_lat: position.coords.latitude,
                    gps_long: position.coords.longitude
                }
            });
        }
    }

    handelStoreReason() {
        this.setState({isLoading: true});
        if (this.props.isConnected) {
            let newData = mapNotVisitReason(this.state.reasonData);
            this.props.setNotVisitReason(this.state.reasonData.id, newData).then(() => {
                this.setState({isLoading: false});
                showMessage('Customer not visit reason synced');
                insertNotVisitReason(this.state.reasonData).then(() => {
                    this.props.navigation.goBack()
                }).catch(error => console.log(error, 'db error'));
            }).catch(exception => {
                this.setState({isLoading: false});
                this.handelException(exception)
            })
        } else {
            this.state.reasonData.not_sync = true;
            insertNotVisitReason(this.state.reasonData).then(() => {
                this.setState({isLoading: false});
                this.props.navigation.goBack()
            }).catch(error => {
                this.setState({isLoading: false});
                this.onDbError(error);
            });
        }
    }

    handelException(exception) {
        if (exception.status === 422) {
            exception.json().then(response => {
                this.onError(response);
            });
        }
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    setNotVisitReason(id, data) {
        return dispatch(setNewNotVisitReason(id, data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNotVisitedReason);