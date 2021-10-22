import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Alert, RefreshControl, Text, TouchableOpacity} from 'react-native';
import {Container, View, Content, Thumbnail} from 'native-base';
import {Avatar, Button} from 'react-native-elements'
import * as Progress from 'react-native-progress';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import {isEmpty} from 'lodash'

import styles from './styles';
import {getCustomerFromRealm, removeContactPerson} from "../../../../../actions/customer/index";
import {transformContactPerson} from "../../../../../helpers/customer";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from '../../../../../components/textHeader';
import ContactItem from '../../../../../components/contactView'
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";
import {deleteContactPerson} from '../../../../../../database/Customer/controller';
import {showMessage} from "../../../../../helpers/toast";
import {TextField} from "react-native-material-textfield";
import GeoLocationService from "../../../../../services/system/google-location";
import {getNotVisitReasonById, insertNotVisitReason} from "../../../../../../database/NotVisited/model";
import {setNewNotVisitReason} from "../../../../../actions/customer";
import {getSalesReturnFromRealm} from "../../../../../actions/returns";
import ReturnItemView from "../../../../../components/returnItem";
import {mapNotVisitReason} from "../../../../../helpers/salesReturn";
import {updateLocation, updateLocationInDb} from "../../../../../services/location/customer-location";

class CustomerShow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            dataSource: null,
            sales_return: [],
            notVisit: {
                id: null,
                reason: '',
                gps_lat: null,
                gps_long: null
            }
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteCustomers();
    }

    loadRemoteCustomers(callback) {
        const {state} = this.props.navigation;
        let customerId = state.params.customer;
        this.props.getCustomersData(customerId).done(() => {
            this.setState({
                dataSource: this.props.customers,
                isLoading: false,
                notVisit: {...this.state.notVisit, id: customerId}
            });
            this.loadNotVisitedReason(customerId);
            this.loadSalesReturn(customerId);
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    loadNotVisitedReason(customerId) {
        getNotVisitReasonById(customerId).then(reason => {
            if (!isEmpty(reason)) {
                this.setState({notVisit: reason})
            }
        })
    }

    loadSalesReturn(customerId) {
        this.props.getSalesReturnData(customerId).then(sales_return => {
            this.setState({sales_return})
        })
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        this.props.navigation.navigate('CustomerNew', {
            customerId: this.state.dataSource.id,
            refresh: this.loadRemoteCustomers.bind(this)
        });
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={this.state.dataSource ? this.state.dataSource.display_name : 'Customer Name'}
                              leftButtonValue='Back'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />
                {this.renderButtonHeader()}
                {this.renderPopUp()}
                <Content>
                    <View style={styles.content}>
                        <Spinner visible={this.state.isLoading}
                                 textContent={configurations.loginScreenLoaderText}
                                 textStyle={{color: '#00897B'}}
                                 color={'#00897B'}/>
                        {this.renderBody()}
                        {this.renderSalesReturn()}
                        {this.renderContactPerson()}
                        {this.renderNotVisitedReason()}
                        {this.renderLocation()}
                        {this.renderNotes()}
                    </View>
                </Content>
            </Container>
        );
    }

    renderButtonHeader() {
        return (
            <View style={{backgroundColor: '#00897B', paddingBottom: 10}}>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <Text style={{
                        color: '#FFF',
                        fontSize: 20,
                    }}>{this.state.dataSource ? this.state.dataSource.tamil_name ?
                        this.state.dataSource.tamil_name : this.state.dataSource.full_name ? this.state.dataSource.full_name
                            : '* * * * *' : 'Customer Name'}</Text>
                    <Text
                        style={{color: '#FFF'}}>{this.state.dataSource ? this.state.dataSource.phone : null}</Text>
                </View>
                <View style={styles.mainView}>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'add-shopping-cart', color: '#00897B', size: 28}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelAddOrderPressed()}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Add Order</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'ios-cart', color: '#00897B', size: 30, type: 'ionicon'}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelOrderPressed()}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Orders</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'ios-paper', color: '#00897B', type: 'ionicon', size: 30}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={this.handelInvoicePressed.bind(this)}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Invoices</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'ios-cash', color: '#00897B', size: 30, type: 'ionicon'}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelPaymentPressed()}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Payments</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Avatar
                            medium
                            rounded
                            icon={{name: 'shopping-basket', color: '#00897B', size: 28}}
                            overlayContainerStyle={{backgroundColor: 'white'}}
                            onPress={() => this.handelProductsPressed()}
                            activeOpacity={0.7}
                        />
                        <Text style={{width: 70, textAlign: 'center', color: '#FFF'}}>Products</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderPopUp() {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.popupDialog = popupDialog;
                }}
                dialogTitle={<DialogTitle title="Contact Person Details"/>}
                width={0.8}>
                <View style={{padding: 10}}>
                    <Text>Under Development...</Text>
                </View>
            </PopupDialog>
        )
    }

    renderBody() {
        let invoiced = 0;
        let paid = 0;
        if (this.state.dataSource) {
            invoiced = this.state.dataSource.outstanding.invoiced ?
                this.state.dataSource.outstanding.invoiced : 0;
            paid = this.state.dataSource.outstanding.paid ?
                this.state.dataSource.outstanding.paid : 0;
        }
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Outstanding Summary</Text>
                <View style={styles.targetValueContainer}>
                    <Text style={{marginRight: 5, fontSize: 18, color: '#000'}}>Total Sales order Amount</Text>
                    <Text style={{fontSize: 18, color: '#000'}}>
                        {this.state.dataSource ? transformToCurrency(this.state.dataSource.outstanding.ordered) : '0.00'}
                    </Text>
                </View>
                <Progress.Bar
                    progress={invoiced !== 0 ? paid / invoiced : 0}
                    width={null} borderRadius={0}
                    height={10} color={'#00897B'}
                    style={{marginBottom: 10}}/>
                <View style={styles.targetValueContainer}>
                    <View style={styles.targetValueView}>
                        <Text style={{fontSize: 20, color: '#697eff'}}> Total Invoice </Text>
                        <Text>
                            {this.state.dataSource ? transformToCurrency(this.state.dataSource.outstanding.invoiced) : '0.00'}
                        </Text>
                    </View>
                    <View style={styles.targetValueView}>
                        <Text style={{fontSize: 20, color: 'green'}}> Total Paid </Text>
                        <Text>
                            {this.state.dataSource ? transformToCurrency(this.state.dataSource.outstanding.paid) : '0.00'}
                        </Text>
                    </View>
                    <View style={styles.targetValueView}>
                        <Text style={{fontSize: 20, color: '#FBAF29'}}> Balance </Text>
                        <Text>
                            {this.state.dataSource ? transformToCurrency(this.state.dataSource.outstanding.balance) : '0.00'}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderSalesReturn() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Sales Return</Text>
                <Button
                    raised
                    icon={{name: 'add'}}
                    backgroundColor={'#00897B'}
                    color={'#FFF'}
                    onPress={this.handelCreateNewSalesReturn.bind(this)}
                    title='Add New Sales Return'/>
                {
                    this.state.dataSource ?
                        (this.state.sales_return.length) ?
                            this.state.sales_return.map((salesReturn, index) => {
                                return (
                                    <TouchableOpacity key={index}
                                                      onPress={() => this.handelSalesReturnPressed(salesReturn, index)}
                                                      style={{paddingTop: 10}}>
                                        <ReturnItemView
                                            productName={'Sales Return'}
                                            firstLeftItemOne={'No. of items'}
                                            firstLeftItemTwo={salesReturn.items.length}
                                            firstRightItemOne={'R.Total'}
                                            firstRightItemTwo={transformToCurrency(salesReturn.total)}
                                            backgroundColor={salesReturn.not_sync ? '#ffcaa6' : '#dfe7e5'}
                                            disableRemoveButton
                                            disableSecondLine
                                        />
                                    </TouchableOpacity>
                                )
                            }) : <Text style={{textAlign: 'center'}}>No sales return found</Text>
                        : null
                }
            </View>
        )
    }

    renderContactPerson() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Contact Person</Text>
                <Button
                    raised
                    icon={{name: 'add'}}
                    backgroundColor={'#00897B'}
                    color={'#FFF'}
                    onPress={this.handelCreateNewContactPerson.bind(this)}
                    title='Add New Contact Person'/>
                {
                    this.state.dataSource ?
                        (this.state.dataSource.contact_persons.length !== 0) ?
                            this.state.dataSource.contact_persons.map((contact, index) => {
                                return (
                                    <TouchableOpacity key={index}
                                                      onPress={() => this.handelContactPersonPressed(contact, index)}
                                                      style={{paddingTop: 10}}>
                                        <ContactItem
                                            avatarPressed={() => this.popupDialog.show()}
                                            salutation={contact.salutation}
                                            firstName={contact.first_name}
                                            lastName={contact.last_name}
                                            emailId={contact.email}
                                            removeButtonPress={() => this.handelContactRemoveButtonPress(contact, index)}
                                        />
                                    </TouchableOpacity>
                                )
                            }) : <Text style={{textAlign: 'center'}}>No contact person found</Text>
                        : null
                }
            </View>
        )
    }

    renderLocation() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Location</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar
                        large
                        icon={{name: 'md-locate', color: '#00897B', type: 'ionicon'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                        onPress={() => this.handelUpdateLocation()}
                        activeOpacity={0.7}
                        // containerStyle={{flex: 4, marginTop: 75}}
                    />
                    <View>
                        <Text> Latitude: {this.state.dataSource ? this.state.dataSource.gps_lat : ''}</Text>
                        <Text> Longitude: {this.state.dataSource ? this.state.dataSource.gps_long : ''}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderNotes() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Notes</Text>
                {
                    (this.state.dataSource && this.state.dataSource.notes)
                        ? <Text style={{color: '#000', paddingBottom: 10}}>{this.state.dataSource.notes}</Text>
                        : <Text style={{textAlign: 'center'}}>There are no Notes to Show</Text>
                }
            </View>
        )
    }

    renderNotVisitedReason() {
        return (
            <View style={styles.buttonView}>
                <Text style={{fontSize: 20, color: '#00897B', marginBottom: 10}}>Reason for not visit</Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end', width: '75%'}}>
                        <TextField
                            label={'Not visited reason'}
                            value={this.state.notVisit.reason}
                            returnKeyType="next"
                            containerStyle={{width: '90%'}}
                            onChangeText={value => this.setState({notVisit: {...this.state.notVisit, reason: value}})}
                            tintColor={'#00897B'}
                        />
                        <Avatar
                            small
                            icon={{name: 'caret-down', type: 'font-awesome', size: 30}}
                            overlayContainerStyle={{backgroundColor: '#00897B'}}
                            onPress={() => this.handleReasonList()}
                            activeOpacity={0.7}
                        />
                    </View>
                    <Button
                        title="Update"
                        buttonStyle={{
                            backgroundColor: "#00897B",
                            width: 78,
                            height: 35,
                            borderColor: "transparent",
                        }}
                        onPress={() => this.getGeoLocationAndStoreReason()}
                        containerStyle={{marginTop: 20}}
                    />
                </View>
            </View>
        )
    }

    handelUpdateLocation() {
        Alert.alert(
            'Are you sure?',
            'Do you want update this customer\'s location?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.getGeoLocation()},
            ],
            {cancelable: false}
        )
    }

    getGeoLocation() {
        this.setState({isLoading: true});
        GeoLocationService.get().then((position) => {
            this.addGeoLocation(position);
        }).catch(errors => {
            this.setState({isLoading: false});
            console.log('errors', errors);
        }).done(() => {
            console.log('done')
        })
    }

    addGeoLocation(position) {
        if (position.hasOwnProperty("coords")) {
            this.updateLocation({
                gps_lat: position.coords.latitude,
                gps_long: position.coords.longitude,
            });
            this.setState({isLoading: false});
        }
    }

    updateLocation(location) {
        const {state} = this.props.navigation;
        let customerId = state.params.customer;
        if (!location.gps_lat || !location.gps_lat) return showMessage('Location not found!');
        if (this.props.isConnected) {
            updateLocation(customerId, location).then(() => {
                this.loadRemoteCustomers();
            })
        } else {
            updateLocationInDb(customerId, location).then(() => {
                this.loadRemoteCustomers();
            })
        }
    }

    handleReasonList() {
        this.props.navigation.navigate('CustomerNotVisitedReason', {returnReasonData: this.returnReasonData.bind(this)});
    }

    returnReasonData(reason) {
        this.setState({notVisit: {...this.state.notVisit, reason: reason}});
    }

    getGeoLocationAndStoreReason() {
        if (this.state.notVisit.reason === '') return;
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
                notVisit: {
                    ...this.state.notVisit,
                    gps_lat: position.coords.latitude,
                    gps_long: position.coords.longitude
                }
            });
        }
    }

    handelStoreReason() {
        this.setState({isLoading: true});
        if (this.props.isConnected) {
            let newData = mapNotVisitReason(this.state.notVisit);
            this.props.setNotVisitReason(this.state.notVisit.id, newData).then(() => {
                this.setState({isLoading: false});
                showMessage('Customer not visit reason synced');
                insertNotVisitReason(this.state.notVisit).then(() => {
                    this.setState({isLoading: false});
                }).catch(error => console.log(error));
            }).catch(error => {
                console.warn(error);
                this.setState({isLoading: false});
            })
        } else {
            this.state.notVisit.not_sync = true;
            insertNotVisitReason(this.state.notVisit).then(() => {
                this.setState({isLoading: false});
                showMessage('Customer not visit reason stored');
            }).catch(error => console.warn(error));
        }
    }

    handelCreateNewSalesReturn() {
        this.props.navigation.navigate('SalesReturnNew', {
            customerId: this.state.dataSource.id,
            customerName: this.state.dataSource.display_name,
            refresh: this.loadRemoteCustomers.bind(this)
        });
    }

    handelSalesReturnPressed(salesReturn) {
        this.props.navigation.navigate('SalesReturnShow', {
            salesReturnId: salesReturn.id,
        });
    }

    handelCreateNewContactPerson() {
        this.props.navigation.navigate('NewContact', {
            customerId: this.state.dataSource.id,
            status: 'New',
            refresh: this.loadRemoteCustomers.bind(this)
        });
    }

    handelContactPersonPressed(contact) {
        this.props.navigation.navigate('NewContact', {
            customerId: this.state.dataSource.id,
            status: 'Edit',
            contactData: transformContactPerson(contact),
            contactId: contact.id,
            refresh: this.loadRemoteCustomers.bind(this)
        });
    }

    handelContactRemoveButtonPress(contact, index) {
        Alert.alert(
            'Are You Sure?',
            'Do You Want to Remove this Contact Person?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.removeContactPerson(contact, index)},
            ],
            {cancelable: false}
        );
    }

    removeContactPerson(contact) {
        if (this.props.isConnected) {
            this.setState({isLoading: true});
            this.props.onDeleteContactPerson(contact.id)
                .then(value => {
                    deleteContactPerson(contact.id).then().catch(error => console.log(error, 'Delete Contact Person'));
                    if (value) {
                        this.setState({isLoading: false, isError: false});
                        Alert.alert(
                            'Done !',
                            value.message,
                            [
                                {text: 'Ok', onPress: () => this.loadRemoteCustomers()},
                            ],
                            {cancelable: false}
                        );
                    }
                })
                .catch(exception => {
                    this.setState({isLoading: false, isError: true});
                    console.warn(exception, 'Contact person remove exception')
                });
        } else {

        }
    }

    handelAddOrderPressed() {
        this.props.navigation.navigate('AddNewOrder', {
            customerId: this.state.dataSource.id,
        })
    }

    handelOrderPressed() {
        this.props.navigation.navigate('CustomerOrder', {
            customerId: this.state.dataSource.id,
            customerName: this.state.dataSource.display_name ?
                this.state.dataSource.display_name : '* name not found *'
        })
    }

    handelInvoicePressed() {
        this.props.navigation.navigate('CustomerInvoice', {
            customerId: this.state.dataSource.id,
            customerName: this.state.dataSource.display_name ?
                this.state.dataSource.display_name : '* name not found *'
        })
    }

    handelPaymentPressed() {
        this.props.navigation.navigate('CustomerPayment', {
            customerId: this.state.dataSource.id,
            customerName: this.state.dataSource.display_name ?
                this.state.dataSource.display_name : '* name not found *'
        })
    }

    handelProductsPressed() {
        if (!this.props.isConnected) return showMessage('Sorry you can\'t view products without internet!');
        this.props.navigation.navigate('CustomerProduct', {
            customerId: this.state.dataSource.id,
            customerName: this.state.dataSource.display_name ?
                this.state.dataSource.display_name : '* name not found *'
        })
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    customers: state.customer.item,
});


const mapDispatchToProps = (dispatch) => ({
    getCustomersData(customerId) {
        return dispatch(getCustomerFromRealm(customerId));
    },
    onDeleteContactPerson(Id) {
        return dispatch(removeContactPerson(Id));
    },
    setNotVisitReason(id, data) {
        return dispatch(setNewNotVisitReason(id, data));
    },
    getSalesReturnData(customerId) {
        return dispatch(getSalesReturnFromRealm(customerId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerShow);