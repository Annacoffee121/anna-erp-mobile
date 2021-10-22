import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native'
import {Content, Container} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import ScreenHeader from '../../../../../../components/textHeader'
import {
    validatePhoneNumber,
    validateEmptyInputText,
    validateEmail,
} from '../../../../../../helpers/customerValidation';
import styles from './style'
import {connect} from "react-redux";
import {getSalutation} from "../../../../../../actions/dropdown";
import {setNewContactPerson, updateContactPerson} from "../../../../../../actions/customer";
import Spinner from '../../../../../../components/spinner/index';
import {
    insertContactPersonToCustomerData,
    updateContactPersonData
} from '../../../../../../../database/Customer/controller';

class CreateNewContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactPersonData: {
                salutation: '',
                first_name: '',
                last_name: '',
                full_name: '',
                email: '',
                phone: '',
                mobile: '',
                designation: '',
                department: '',
            },
            contactPersonId: null,
            hasError: false,
            status: null,
            isLoading: false,
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        if (state.params.previousItem) {
            this.state.contactPersonData = state.params.previousItem;
        } else if (state.params.customerId) {
            if (state.params.status === 'New') {
                this.setState({status: state.params.status});
            } else if (state.params.status === 'Edit') {
                this.setState({
                    status: state.params.status,
                    contactPersonData: state.params.contactData,
                    contactPersonId: state.params.contactId
                });
            }
        }
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params.customerId) {
            state.params.refresh();
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={{backgroundColor:'#efeff3'}}>
                <ScreenHeader name='Add Contact Person'
                              rightButtonValue={this.state.status === 'New' ? 'Create' : this.state.status === 'Edit' ? 'Update' : 'Save'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />
                <Content bounces={false} disableKBDismissScroll={true}>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps='always'
                        keyboardDismissMode={"on-drag"}>
                        <View style={styles.subContainer}>
                            {this.renderCustomerDetails()}
                        </View>
                    </KeyboardAwareScrollView>
                </Content>
            </Container>
        )
    }

    renderCustomerDetails() {
        return (
            <View style={{padding: 20}}>
                <Text style={{fontSize: 20, color: '#00897B'}}>Contact Person Details</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('SearchCustomerItems', {
                            getData: this.props.getSalutationData,
                            data: this.props.salutations,
                            returnDropDownData: (value) => {
                                this.setState({contactPersonData: {...this.state.contactPersonData, salutation: value}})
                            }
                        })
                    }} style={{width: '30%'}}>
                        <TextField
                            label='Salutation'
                            editable={false}
                            value={this.state.contactPersonData.salutation}
                            tintColor={'#00897B'}
                            // error={this.state.hasError ? validateId(this.state.contactPersonData.salutation) : null}
                        />
                    </TouchableOpacity>

                    <TextField
                        label='First Name'
                        value={this.state.contactPersonData.first_name}
                        containerStyle={{marginLeft: 10, width: '70%'}}
                        returnKeyType="next"
                        onSubmitEditing={() => this.lastName.focus()}
                        onChangeText={value => {
                            const newContactPerson = Object.assign({}, this.state.contactPersonData, {first_name: value});
                            this.setState({contactPersonData: newContactPerson});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.contactPersonData.first_name) : null}
                    />
                </View>
                <TextField
                    label='Last Name'
                    value={this.state.contactPersonData.last_name}
                    returnKeyType="next"
                    onSubmitEditing={() => this.fullName.focus()}
                    ref={(input) => this.lastName = input}
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {last_name: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                    error={this.state.hasError ? validateEmptyInputText(this.state.contactPersonData.last_name) : null}
                />
                <TextField
                    label='Full Name'
                    value={this.state.contactPersonData.full_name}
                    returnKeyType="next"
                    onSubmitEditing={() => this.email.focus()}
                    ref={(input) => this.fullName = input}
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {full_name: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                />
                <TextField
                    label='Email'
                    value={this.state.contactPersonData.email}
                    returnKeyType="next"
                    onSubmitEditing={() => this.phone.focus()}
                    ref={(input) => this.email = input}
                    keyboardType="email-address"
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {email: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                    error={this.state.hasError ? validateEmail(this.state.contactPersonData.email) : null}
                />
                <TextField
                    label='Phone'
                    value={this.state.contactPersonData.phone}
                    returnKeyType="next"
                    onSubmitEditing={() => this.mobile.focus()}
                    ref={(input) => this.phone = input}
                    keyboardType="phone-pad"
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {phone: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                    error={this.state.hasError ? validatePhoneNumber(this.state.contactPersonData.phone) : null}
                />
                <TextField
                    label='Mobile'
                    value={this.state.contactPersonData.mobile}
                    returnKeyType="next"
                    onSubmitEditing={() => this.designation.focus()}
                    ref={(input) => this.mobile = input}
                    keyboardType="phone-pad"
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {mobile: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                    error={this.state.hasError ? validatePhoneNumber(this.state.contactPersonData.mobile) : null}
                />
                <TextField
                    label='Designation'
                    value={this.state.contactPersonData.designation}
                    returnKeyType="next"
                    onSubmitEditing={() => this.department.focus()}
                    ref={(input) => this.designation = input}
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {designation: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                />
                <TextField
                    label='Department'
                    value={this.state.contactPersonData.department}
                    returnKeyType="done"
                    ref={(input) => this.department = input}
                    onChangeText={value => {
                        const newContactPerson = Object.assign({}, this.state.contactPersonData, {department: value});
                        this.setState({contactPersonData: newContactPerson});
                    }}
                    tintColor={'#00897B'}
                />
            </View>
        )
    }

    handelHeaderRightButtonPress() {
        // Validate text inputs
        for (let key in this.state.contactPersonData) {
            if (this.state.contactPersonData.hasOwnProperty(key)) {
                if (key !== 'salutation' && key !== 'full_name' && key !== 'designation' && key !== 'department') { //Skip Not required fields
                    if (validateEmptyInputText(this.state.contactPersonData[key])) {
                        return this.setState({hasError: true});
                    }
                }
            }
        }
        if (validateEmail(this.state.contactPersonData.email)) {
            return this.setState({hasError: true});
        }
        if (validatePhoneNumber(this.state.contactPersonData.mobile)) {
            return this.setState({hasError: true});
        }
        if (validatePhoneNumber(this.state.contactPersonData.phone)) {
            return this.setState({hasError: true});
        }

        this.setState({isLoading: true});
        if (this.state.status === 'New') {
            const {state} = this.props.navigation;
            this.props.onSaveContact(state.params.customerId, this.state.contactPersonData)
                .then(value => {
                    insertContactPersonToCustomerData(state.params.customerId, value).then()
                        .catch(error => console.log(error, 'insert Contact Person'));
                    if (value.id) {
                        this.setState({isLoading: false, isError: false});
                        Alert.alert(
                            'Done !',
                            'Contact Person Created Successfully!!!',
                            [
                                {text: 'OK', onPress: () => this.props.navigation.goBack()},
                            ],
                            {cancelable: false}
                        )
                    }
                })
                .catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.warn(exception, 'Create exception');
                });
        } else if (this.state.status === 'Edit') {
            this.props.onUpdateContactPerson(this.state.contactPersonId, this.state.contactPersonData).then(value => {
                if (value.id) {
                    updateContactPersonData(value).catch(error => console.log(error, 'Edit Contact Person'));
                    this.setState({isLoading: false, isError: false});
                    Alert.alert(
                        'Done !',
                        'Contact Person Updated Successfully!!!',
                        [
                            {text: 'OK', onPress: () => this.props.navigation.goBack()},
                        ],
                        {cancelable: false}
                    )
                }
            }).catch(exception => {
                this.setState({isLoading: false, isError: true});
                console.warn(exception, 'Update exception');
            });
        } else {
            //Send the data back to MainComponent
            this.props.navigation.state.params.returnData(this.state.contactPersonData);
            this.props.navigation.goBack();
        }
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    salutations: state.dropdowns.salutations,
});

const mapDispatchToProps = (dispatch) => ({
    getSalutationData() {
        return dispatch(getSalutation());
    },
    onSaveContact(customerId, contactPersonData) {
        return dispatch(setNewContactPerson(customerId, contactPersonData));
    },
    onUpdateContactPerson(id, customerData) {
        return dispatch(updateContactPerson(id, customerData));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewContact);