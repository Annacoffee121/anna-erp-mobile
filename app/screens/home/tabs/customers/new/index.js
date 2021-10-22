import React, {Component} from 'react';
import {Text, View, Alert, TouchableOpacity} from 'react-native'
import {Content, Container} from 'native-base'
import {CheckBox, Button} from 'react-native-elements'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {TextField} from 'react-native-material-textfield';
import {connect} from "react-redux";
import ImagePickerQuestion from '../../../../../components/image-picker'
import ScreenHeader from '../../../../../components/textHeader'
import ContactItem from '../../../../../components/contactView'
import styles from './style'
import {getCustomerFromRealm, setNewCustomer, updateCustomer} from "../../../../../actions/customer";
import Spinner from '../../../../../components/spinner/index';
import {
    validatePhoneNumber, validateEmptyInputText, validateEmail,
    validateWebsite, validateId
} from '../../../../../helpers/customerValidation';
import {getCountry, getRoute, getRouteLocation, getSalutation} from "../../../../../actions/dropdown";
import GeoLocationService from "../../../../../services/system/google-location";
import {insertCustomerData} from "../../../../../../database/Customer/controller";
import {transformUpdateCustomer, transformOfflineCustomerForRealm} from "../../../../../helpers/customer";
import {showMessage} from "../../../../../helpers/toast";
import {get_allocation} from "../../../../../../database/Mata/model";

class CreateNewCustomer extends Component {
    constructor() {
        super();
        this.state = {
            customerDetails: {
                daily_sale_id: null,
                salutation: '',
                first_name: '',
                last_name: '',
                display_name: '',
                phone: '',
                fax: '',
                mobile: '',
                email: '',
                website: '',
                street_one: '',
                street_two: '',
                city: '',
                province: '',
                postal_code: '',
                country_id: 0,
                route_id: 0,
                location_id: 0,
                notes: '',
                logo_file: '',
                is_active: 'Yes',
                contact_persons: [],
                not_realized_cheque: [],
                gps_lat: 0,
                gps_long: 0,
            },
            routeLocation: '',
            country: '',
            hasError: false,
            isEdit: false,
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteCustomers();
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        let customerId = state.params;
        if (customerId) {
            state.params.refresh();
        }
    }

    addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            this.setState({
                customerDetails: {
                    ...this.state.customerDetails,
                    gps_lat: position.coords.latitude,
                    gps_long: position.coords.longitude,
                }
            });
        }
    }

    loadRemoteCustomers() {
        const {state} = this.props.navigation;
        //** Verify if new customer or edit, and load details
        if (state.params) {
            this.setState({isEdit: true});
            this.props.getCustomersData(state.params.customerId).done(() => {
                this.state.customerDetails = this.props.customers;
                this.setState({
                    routeLocation: this.props.customers.location_name,
                    country: this.props.customers.country_name,
                    isLoading: false
                });
            });
        } else {
            let dashboardRoute = this.props.dashboardRoute;
            let routeId = dashboardRoute.length > 0 ? dashboardRoute[0].id : 0;
            get_allocation().then(allocation => {
                this.setState({
                    customerDetails: {...this.state.customerDetails, route_id: routeId, daily_sale_id: allocation.id},
                    isLoading: false
                });
            });
        }
    }

    returnData(newContactPerson) {
        let contact = this.state.customerDetails.contact_persons;
        contact.push(newContactPerson);
        this.setState({customerDetails: {...this.state.customerDetails, contact_persons: contact}});
    }

    returnEditData(index, contactPerson) {
        let previousContact = this.state.customerDetails.contact_persons;
        previousContact[index] = contactPerson;
        this.setState({customerDetails: {...this.state.customerDetails, contact_persons: previousContact}});
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <ScreenHeader name='Add Customer'
                              rightButtonValue={this.state.isEdit ? 'Update' : 'Save'}
                              rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />
                <Content bounces={false} disableKBDismissScroll={true}>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{x: 0, y: 0}}
                        enableOnAndroid={true}
                        contentContainerStyle={styles.container}
                        scrollEnabled={false}
                        keyboardShouldPersistTaps='always'>
                        {this.renderHeaderDetails()}
                        {this.renderCustomerDetails()}
                        {this.renderCustomerAddress()}
                        {
                            this.state.isEdit ? null
                                : this.renderContactPerson()
                        }

                    </KeyboardAwareScrollView>
                </Content>
            </Container>
        )
    }

    renderHeaderDetails() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <View style={styles.headerView}>
                        <View style={{flexDirection: 'column', width: '70%'}}>
                            <Text style={{fontSize: 20, color: '#00897B'}}>Customer Details</Text>
                            {
                                this.state.customerDetails.route_id === 0
                                    ? <Text style={{color: '#ff180a'}}> ** route_id not found, Please refresh the
                                        Dashboard ** </Text>
                                    : null
                            }
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('SearchCustomerItems', {
                                    route_id: this.state.customerDetails.route_id,
                                    getData: this.props.getRouteLocationData,
                                    data: this.props.routeLocation,
                                    returnDropDownData: (value, id) => {
                                        this.setState({
                                            routeLocation: value,
                                            customerDetails: {...this.state.customerDetails, location_id: id}
                                        })
                                    }
                                })
                            }} disabled={this.state.customerDetails.route_id === 0} style={{width: '90%'}}>
                                <TextField
                                    label='Sales Route Location'
                                    editable={false}
                                    value={this.state.routeLocation}
                                    tintColor={'#00897B'}
                                    error={this.state.hasError ? validateId(this.state.customerDetails.location_id) : null}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <ImagePickerQuestion
                                onChange={this.handelLogoChange.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderCustomerDetails() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SearchCustomerItems', {
                                getData: this.props.getSalutationData,
                                data: this.props.salutations,
                                returnDropDownData: (value) => {
                                    this.setState({customerDetails: {...this.state.customerDetails, salutation: value}})
                                }
                            })
                        }} style={{width: '30%'}}>
                            <TextField
                                label='Salutation'
                                editable={false}
                                value={this.state.customerDetails.salutation}
                                tintColor={'#00897B'}
                                error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.salutation) : null}
                            />
                        </TouchableOpacity>
                        <TextField
                            label='First Name'
                            value={this.state.customerDetails.first_name}
                            containerStyle={{marginLeft: 10, width: '70%'}}
                            returnKeyType="next"
                            onSubmitEditing={() => this.last_name.focus()}
                            onChangeText={value => {
                                const newCustomer = Object.assign({}, this.state.customerDetails, {first_name: value});
                                this.setState({customerDetails: newCustomer});
                            }}
                            tintColor={'#00897B'}
                            error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.first_name) : null}
                        />
                    </View>
                    <TextField
                        label='Last Name'
                        value={this.state.customerDetails.last_name}
                        returnKeyType="next"
                        onSubmitEditing={() => this.display_name.focus()}
                        ref={(input) => this.last_name = input}
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {last_name: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.last_name) : null}
                    />
                    <TextField
                        label='Display Name'
                        value={this.state.customerDetails.display_name}
                        returnKeyType="next"
                        onSubmitEditing={() => this.phone.focus()}
                        ref={(input) => this.display_name = input}
                        keyboardType="email-address"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {display_name: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.display_name) : null}
                    />
                    <TextField
                        label='Phone'
                        value={this.state.customerDetails.phone}
                        returnKeyType="next"
                        onSubmitEditing={() => this.fax.focus()}
                        ref={(input) => this.phone = input}
                        keyboardType="phone-pad"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {phone: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        // error={this.state.hasError ? validatePhoneNumber(this.state.customerDetails.phone) : null}
                    />
                    <TextField
                        label='Fax'
                        value={this.state.customerDetails.fax}
                        returnKeyType="next"
                        onSubmitEditing={() => this.mobile.focus()}
                        ref={(input) => this.fax = input}
                        keyboardType="phone-pad"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {fax: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        // error={this.state.hasError ? validatePhoneNumber(this.state.customerDetails.fax) : null}
                    />
                    <TextField
                        label='Mobile'
                        value={this.state.customerDetails.mobile}
                        returnKeyType="next"
                        onSubmitEditing={() => this.email.focus()}
                        ref={(input) => this.mobile = input}
                        keyboardType="phone-pad"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {mobile: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validatePhoneNumber(this.state.customerDetails.mobile) : null}
                    />
                    <TextField
                        label='Email'
                        value={this.state.customerDetails.email}
                        returnKeyType="next"
                        onSubmitEditing={() => this.website.focus()}
                        ref={(input) => this.email = input}
                        keyboardType="email-address"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {email: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        // error={this.state.hasError ? validateEmail(this.state.customerDetails.email) : null}
                    />
                    <TextField
                        label='Website'
                        value={this.state.customerDetails.website}
                        returnKeyType="done"
                        ref={(input) => this.website = input}
                        keyboardType="email-address"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {website: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        // error={this.state.hasError ? validateWebsite(this.state.customerDetails.website) : null}
                    />
                    <TextField
                        label='Enter customer related notes'
                        value={this.state.customerDetails.notes}
                        returnKeyType="done"
                        keyboardType="default"
                        onChangeText={value => {
                            const newCustomer = Object.assign({}, this.state.customerDetails, {notes: value});
                            this.setState({customerDetails: newCustomer});
                        }}
                        tintColor={'#00897B'}
                        autoCapitalize="sentences"
                        multiline={true}
                    />
                </View>
            </View>
        )
    }

    renderCustomerAddress() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Customer Address</Text>
                    <TextField
                        label='Street One'
                        value={this.state.customerDetails.street_one}
                        returnKeyType="next"
                        onSubmitEditing={() => this.streetTwo.focus()}
                        onChangeText={value => {
                            const newCustomerAddress = Object.assign({}, this.state.customerDetails, {street_one: value});
                            this.setState({customerDetails: newCustomerAddress});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.street_one) : null}
                    />
                    <TextField
                        label='Street Two'
                        value={this.state.customerDetails.street_two}
                        returnKeyType="next"
                        onSubmitEditing={() => this.city.focus()}
                        ref={(input) => this.streetTwo = input}
                        onChangeText={value => {
                            const newCustomerAddress = Object.assign({}, this.state.customerDetails, {street_two: value});
                            this.setState({customerDetails: newCustomerAddress});
                        }}
                        tintColor={'#00897B'}
                    />
                    <TextField
                        label='City'
                        value={this.state.customerDetails.city}
                        returnKeyType="next"
                        onSubmitEditing={() => this.province.focus()}
                        ref={(input) => this.city = input}
                        onChangeText={value => {
                            const newCustomerAddress = Object.assign({}, this.state.customerDetails, {city: value});
                            this.setState({customerDetails: newCustomerAddress});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.city) : null}
                    />
                    <TextField
                        label='Province'
                        value={this.state.customerDetails.province}
                        returnKeyType="next"
                        onSubmitEditing={() => this.postalCode.focus()}
                        ref={(input) => this.province = input}
                        onChangeText={value => {
                            const newCustomerAddress = Object.assign({}, this.state.customerDetails, {province: value});
                            this.setState({customerDetails: newCustomerAddress});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.province) : null}
                    />
                    <TextField
                        label='Postal Code'
                        value={this.state.customerDetails.postal_code}
                        returnKeyType="done"
                        ref={(input) => this.postalCode = input}
                        keyboardType="phone-pad"
                        onChangeText={value => {
                            const newCustomerAddress = Object.assign({}, this.state.customerDetails, {postal_code: value});
                            this.setState({customerDetails: newCustomerAddress});
                        }}
                        tintColor={'#00897B'}
                        error={this.state.hasError ? validateEmptyInputText(this.state.customerDetails.postal_code) : null}
                    />

                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('SearchCustomerItems', {
                            getData: this.props.getCountryData,
                            data: this.props.countries,
                            returnDropDownData: (value, id) => {
                                this.setState({
                                    country: value, customerDetails: {...this.state.customerDetails, country_id: id}
                                })
                            }
                        })
                    }} disabled={this.state.customerDetails.route_id === 0}>
                        <TextField
                            label='Country'
                            editable={false}
                            value={this.state.country}
                            tintColor={'#00897B'}
                            error={this.state.hasError ? validateId(this.state.customerDetails.country_id) : null}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderContactPerson() {
        return (
            <View style={styles.subContainer}>
                <View style={{padding: 20}}>
                    <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Contact Person</Text>
                    <Button
                        raised
                        icon={{name: 'add'}}
                        backgroundColor={'#00897B'}
                        color={'#FFF'}
                        onPress={this.handelContactPersonView.bind(this)}
                        title='Add Contact Person'/>
                    {
                        this.state.customerDetails.contact_persons.map((contact, index) => {
                            return (
                                <TouchableOpacity key={index}
                                                  onPress={() => this.handelContactPersonPressed(contact, index)}
                                                  style={{paddingTop: 6}}>
                                    <ContactItem
                                        salutation={contact.salutation}
                                        firstName={contact.first_name}
                                        lastName={contact.last_name}
                                        emailId={contact.email}
                                        removeButtonPress={() => this.handelContactRemoveButtonPress(contact, index)}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    handelContactPersonView() {
        //To get returnData from ChildComponent
        this.props.navigation.navigate('NewContact', {returnData: this.returnData.bind(this)});
    }

    handelLogoChange(value) {
        this.setState({customerDetails: {...this.state.customerDetails, logo_file: value.added[0].data}})
    }

    handelHeaderRightButtonPress() {
        if (validateEmptyInputText(this.state.customerDetails.salutation)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.first_name)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.last_name)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.display_name)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.street_one)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.city)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.province)) {
            return this.setState({hasError: true});
        }
        if (validateEmptyInputText(this.state.customerDetails.postal_code)) {
            return this.setState({hasError: true});
        }
        // if (validatePhoneNumber(this.state.customerDetails.fax)) {
        //     return this.setState({hasError: true});
        // }
        // if (validatePhoneNumber(this.state.customerDetails.phone)) {
        //     return this.setState({hasError: true});
        // }
        if (validatePhoneNumber(this.state.customerDetails.mobile)) {
            return this.setState({hasError: true});
        }
        // if (validateEmail(this.state.customerDetails.email)) {
        //     return this.setState({hasError: true});
        // }
        // if (validateWebsite(this.state.customerDetails.website)) {
        //     return this.setState({hasError: true});
        // }
        if (validateId(this.state.customerDetails.country_id)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.customerDetails.route_id)) {
            return this.setState({hasError: true});
        }
        if (validateId(this.state.customerDetails.location_id)) {
            return this.setState({hasError: true});
        }

        // Store or sync customer with GPS
        this.setState({isLoading: true, isError: false});
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            this.setState({isLoading: false});
            console.log('errors', errors);
        }).done(() => {
            if (this.props.isConnected) {
                this.syncCustomer();
            } else {
                this.storeCustomer();
            }
        })
    }

    syncCustomer() {
        if (this.state.isEdit) {
            // ** Update Customer
            this.props.onUpdateCustomer(this.props.customers.id, this.state.customerDetails)
                .then(value => {
                    insertCustomerData(transformUpdateCustomer(value)).then().catch((error) => {
                        console.log(error, 'error')
                    });
                    if (value.id) {
                        this.setState({isLoading: false, isError: false});
                        Alert.alert(
                            'Done !',
                            'Customer Updated Successfully!!!',
                            [
                                {text: 'OK', onPress: () => this.props.navigation.goBack()},
                            ],
                            {cancelable: false}
                        )
                    }
                })
                .catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.log(exception, 'Customer Update exception');
                });
        } else {
            // ** Save Customer
            this.props.onSaveCustomer(this.state.customerDetails)
                .then(value => {
                    insertCustomerData(transformUpdateCustomer(value)).then().catch((error) => {
                        console.log(error, 'error')
                    });
                    if (value.id) {
                        this.setState({isLoading: false, isError: false});
                        Alert.alert(
                            'Done !',
                            'Customer Created Successfully!!!',
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
        }
    }

    storeCustomer() {
        insertCustomerData(transformOfflineCustomerForRealm(this.state)).then(value => {
            this.setState({isLoading: false, isError: false});
            showMessage('Customer created in local store!!');
            this.props.navigation.goBack();
        }).catch(error => {
            console.log(error, 'error')
        });
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelContactPersonPressed(contact, index) {
        let {navigate} = this.props.navigation;
        navigate('NewContact', {returnData: this.returnEditData.bind(this, index), previousItem: contact})
    }

    handelContactRemoveButtonPress(contact, index) {
        let previousContactPerson = this.state.customerDetails.contact_persons;
        previousContactPerson.splice(index, 1);
        this.setState({customerDetails: {...this.state.customerDetails, contact_persons: previousContactPerson}});
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    dashboardRoute: state.route.all,
    customers: state.customer.item,
    route: state.dropdowns.route,
    routeLocation: state.dropdowns.routeLocation,
    salutations: state.dropdowns.salutations,
    countries: state.dropdowns.country,
});

const mapDispatchToProps = (dispatch) => ({
    getCustomersData(customerId) {
        return dispatch(getCustomerFromRealm(customerId));
    },
    onSaveCustomer(customerData) {
        return dispatch(setNewCustomer(customerData));
    },
    onUpdateCustomer(customerId, customerData) {
        return dispatch(updateCustomer(customerId, customerData));
    },
    getRouteData() {
        return dispatch(getRoute());
    },
    getRouteLocationData(route_id) {
        return dispatch(getRouteLocation(route_id));
    },
    getSalutationData() {
        return dispatch(getSalutation());
    },
    getCountryData() {
        return dispatch(getCountry());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCustomer);