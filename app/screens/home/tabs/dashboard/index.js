import React, {Component,} from 'react';
import {Container, Content, Left, Right} from 'native-base';
import MapView, {Callout, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Text, View, Image} from 'react-native'
import * as Progress from 'react-native-progress';
import Config from 'react-native-config';
import {Avatar} from 'react-native-elements'
import {connect} from "react-redux";
import {Dropdown} from 'react-native-material-dropdown';
import styles from './styles';
import IndexHeader from '../../../../components/header'
import GeoLocationService from '../../../../services/system/google-location'
import {getRouteFromRealm} from "../../../../actions/dashboard";
import Spinner from '../../../../components/spinner/index';
import {dateConverter} from '../../../../helpers/dateConverter';
import {changeToCurrency, transformToCurrency} from '../../../../helpers/currencyFormatConverter';
import {getAllPaymentData} from "../../../../../database/Payment/controller";
import DashboardCustomerText from "../../../../components/dashboardPanel";
import {profileImage} from "../../../../helpers/images";

const GOOGLE_MAPS_API_KEY = Config.MAPS_API_KEY;

class DashboardTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            isLoading: false,
            dataSource: [],
            valueIndex: 0,
            geo_latitude: null,
            geo_longitude: null,
            geo_accuracy: null,
            geo_altitude: null,
            image: null
        };
    }

    componentWillMount() {
        // console.log(Realm.path)
        this.getGeoLocation();
        let today = new Date();
        this.setState({date: dateConverter(today), image: true});
        this.loadRemoteRoute();
    }

    handleLeftButtonPress() {
        getAllPaymentData().then(result => {
            console.log(result, 'getAllPaymentData')
        })
    }

    loadRemoteRoute() {
        this.setState({isLoading: true});
        this.props.getRouteData().done(() => {
            this.setState({
                dataSource: this.props.route,
                isLoading: false
            });
        });
    }

    getGeoLocation() {
        GeoLocationService.get().then((position) => {
            this.addGeoLocationHeader(position);
        }).catch(errors => {
            console.log('errors', errors);
        }).done(() => {
            console.log(this.state.geo_latitude, this.state.geo_longitude, 'LatLong',)
        })
    }

    addGeoLocationHeader(position) {
        if (position.hasOwnProperty("coords")) {
            this.setState({
                geo_latitude: position.coords.latitude,
                geo_longitude: position.coords.longitude,
                geo_accuracy: position.coords.accuracy,
                geo_altitude: position.coords.altitude,
            });
        }
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={{backgroundColor: '#efeff3'}}>
                <IndexHeader
                    name={this.state.date}
                    leftButtonIcon="ios-search"
                    leftIconSize={22}
                    leftButtonPress={() => this.handleLeftButtonPress()}
                    rightButtonIcon="ios-refresh-outline"
                    rightIconSize={22}
                    rightButtonPress={() => this.loadRemoteRoute()}
                />
                <Spinner visible={this.state.isLoading}
                         textContent={configurations.loginScreenLoaderText}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                {
                    this.state.dataSource.length > 0
                        ? <Content>
                            {this.renderStaffDetails()}
                            {this.renderMap()}
                            {/*{this.renderTargetSummary()}*/}
                        </Content>
                        : <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                            <Text>Hurrah! You have no tasks waiting on you!</Text>
                        </View>
                }

            </Container>
        );
    }

    renderStaffDetails() {
        let {user} = this.props;
        if (!user) return null;
        return (
            <View style={styles.staffViewContent}>
                <View style={styles.staffView}>
                    <Avatar
                        large
                        rounded
                        source={{
                            uri: this.state.image ? profileImage(user.id) : null,
                        }}
                        activeOpacity={0.7}
                    />
                    <Text style={styles.staffName}>{this.props.user ? this.props.user.name : ''}</Text>
                    <Text style={styles.staffEmail}>{this.props.user ? this.props.user.email : ''}</Text>
                </View>
            </View>
        )
    }

    renderMap() {
        let routesData = [];
        this.state.dataSource.map((value) => {
            routesData.push({value: value.code})
        });
        let wayPoint = [];
        this.state.dataSource[this.state.valueIndex].way_points.map(value => {
            wayPoint.push(value)
        });
        return (
            <View style={{paddingLeft: 10, paddingRight: 10}}>
                <View style={styles.mapContent}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <Left>
                            <Text>{this.state.dataSource[this.state.valueIndex].name}</Text>
                        </Left>
                        {
                            this.state.dataSource.length > 1
                                ? <View style={styles.dropDownStyle}>
                                    <Dropdown
                                        style={{alignItems: 'center'}}
                                        value={routesData[0].value}
                                        containerStyle={{width: '100%'}}
                                        data={routesData}
                                        animationDuration={10}
                                        labelHeight={10}
                                        inputContainerStyle={{borderBottomColor: 'transparent',}}
                                        onChangeText={value => {
                                            console.log(value, 'drop down value')
                                        }}
                                        selectedItemColor={'#00897B'}/></View>
                                : null
                        }
                        <Right>
                            <Text>Customers: {this.state.dataSource[this.state.valueIndex].customers.length}</Text>
                        </Right>
                    </View>
                    {!!this.state.geo_latitude && !!this.state.geo_longitude && <MapView
                        style={styles.mapView}
                        initialRegion={{
                            latitude: this.state.geo_latitude,
                            longitude: this.state.geo_longitude,
                            // latitude: 9.67845,
                            // longitude: 80.01742,
                            latitudeDelta: 0.2922,
                            longitudeDelta: 0.0421,
                        }}>

                        <Marker
                            coordinate={{"latitude": this.state.geo_latitude, "longitude": this.state.geo_longitude}}
                            title={"Current Location"}
                        />

                        {this.state.dataSource[this.state.valueIndex].customers.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{latitude: marker.latLon.latitude, longitude: marker.latLon.longitude}}
                                image={marker.marker_type === 'Green' ? require('../../../../assets/images/icons/markerGreen.png')
                                    : marker.marker_type === 'Yellow' ? require('../../../../assets/images/icons/markerOrange.png')
                                        : require('../../../../assets/images/icons/markerRed.png')}>

                                <Callout tooltip={true}
                                         style={styles.calloutStyle}>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <View style={styles.calloutViewStyle}>
                                            <Text style={styles.calloutTextOne}>Order Details</Text>
                                            <Text style={{textAlign: 'center', color: '#FFF'}}>
                                                {marker.display_name}
                                            </Text>
                                            <DashboardCustomerText leftValue={'Orders'}
                                                                   rightValue={marker.no_of_order}/>
                                            <DashboardCustomerText leftValue={'Total Sales'}
                                                                   rightValue={changeToCurrency(marker.total_sales)}/>
                                            <DashboardCustomerText leftValue={'Total Invoiced'}
                                                                   rightValue={changeToCurrency(marker.total_invoiced)}/>
                                            <DashboardCustomerText leftValue={'Total Received'}
                                                                   rightValue={changeToCurrency(marker.received_payment)}/>
                                            <DashboardCustomerText leftValue={'Payment Remaining'}
                                                                   rightValue={changeToCurrency(marker.payment_reminding)}/>
                                            <DashboardCustomerText leftValue={'Previous Collection'}
                                                                   rightValue={changeToCurrency(marker.old_sales)}/>
                                            <DashboardCustomerText leftValue={'Total Outstanding'}
                                                                   rightValue={changeToCurrency(marker.outstanding)}/>
                                        </View>
                                        <Image source={require('../../../../assets/images/icons/markerRectangle.png')}
                                               style={{width: 20, height: 20}}/>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}

                        <MapViewDirections
                            origin={this.state.dataSource[this.state.valueIndex].start_point}
                            waypoints={wayPoint}
                            destination={this.state.dataSource[this.state.valueIndex].end_point}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={5}
                            strokeColor='rgba(0, 0, 255, 0.4)'
                        />
                    </MapView>}
                </View>
            </View>
        )
    }

    renderTargetSummary() {
        let target = 0;
        let achieved = 0;
        if (this.state.dataSource[this.state.valueIndex].targets.length > 0) {
            target = this.state.dataSource[this.state.valueIndex].targets[0].target ?
                this.state.dataSource[this.state.valueIndex].targets[0].target : 0;
            achieved = this.state.dataSource[this.state.valueIndex].targets[0].achieved ?
                this.state.dataSource[this.state.valueIndex].targets[0].achieved : 0;
        }
        let balance = target - achieved;
        return (
            <View style={styles.staffViewContent}>
                <View style={styles.targetView}>
                    <Text style={styles.headingText}>Target Summary</Text>
                    <Progress.Bar progress={target !== 0 ? achieved / target : 0} width={null} borderRadius={0}
                                  height={10} color={'#00897B'}
                                  style={{marginBottom: 10}}/>

                    <View style={styles.targetValueContainer}>
                        <View style={styles.targetValueView}>
                            <Text style={{fontSize: 20, color: '#697eff'}}> Target </Text>
                            <Text> {transformToCurrency(target)} </Text>
                        </View>
                        <View style={styles.targetValueView}>
                            <Text style={{fontSize: 20, color: 'green'}}> Achieved </Text>
                            <Text> {transformToCurrency(achieved)} </Text>
                        </View>
                        <View style={styles.targetValueView}>
                            <Text style={{fontSize: 20, color: '#FBAF29'}}> Balance </Text>
                            <Text> {transformToCurrency(balance)} </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user.data,
    configurations: state.system.configurations,
    route: state.route.all,
    auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    getRouteData() {
        return dispatch(getRouteFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTab);