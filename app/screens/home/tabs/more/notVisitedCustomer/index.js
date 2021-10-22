import React, {Component,} from 'react';
import {Text, View, TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import {Container, Content} from "native-base";
import styles from "./styles";
import Spinner from "../../../../../components/spinner";
import {getHandoverData} from "../../../../../actions/handover";
import {getSingleCustomerName} from "../../../../../../database/Customer/controller";
import ScreenHeader from "../../../../../components/textHeader";
import {showMessage} from "../../../../../helpers/toast";
import {getNotVisitReason} from "../../../../../actions/customer";
import ReturnItemView from "../../../../../components/returnItem";
import isEmpty from "lodash/isEmpty";

class NotVisitedCustomerReasonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            not_visited_customers: null,
            customerDetails: [],
        };
    }

    componentWillMount() {
        if (this.props.isConnected) {
            this.loadRemoteCustomers();
        } else {
            showMessage('Your connection was interrupted')
        }
    }

    componentWillUnmount() {
        const {state} = this.props.navigation;
        if (state.params) {
            state.params.refresh();
        }
    }

    loadRemoteCustomers(callback) {
        this.setState({isLoading: true});
        this.props.getHandoversData().done(async () => {
            await this.setState({
                not_visited_customers: this.props.handover.today_not_visited_customers,
                isLoading: false
            });
            this.loadCustomerDetails();
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    loadCustomerDetails() {
        let notVisitedCus = this.state.not_visited_customers;
        if (!notVisitedCus.length) return;
        let customers = [];
        notVisitedCus.map(cusId => {
            return getSingleCustomerName(cusId).then(customer => {
                return this.props.getNotVisitReasonFromRealm(cusId).then(reason => {
                    let value = {id: cusId, reason: null, gps_lat: null, gps_long: null, name: customer.display_name};
                    if (!isEmpty(reason)) {
                        let newValue = reason;
                        newValue.id = cusId;
                        newValue.name = customer.display_name;
                        customers.push(newValue);
                    } else {
                        customers.push(value);
                    }
                });
            }).then(() => this.setState({customerDetails: customers}));
        });
    }

    render() {
        return (
            <Container style={{backgroundColor:'#efeff3'}}>
                <ScreenHeader name={'Customer Not Visit Reason'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                />
                <Spinner visible={this.state.isLoading}
                         textContent={'Loading'}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                <Content>
                    {
                        this.state.not_visited_customers ?
                            this.renderCustomerList() :
                            <Text>Loading...</Text>
                    }
                </Content>
            </Container>
        )
    }

    renderCustomerList() {
        return (
            <View style={styles.secondMainContent}>
                <View style={styles.secondaryVie}>
                    {
                        this.state.not_visited_customers.length !== 0 ?
                            this.renderReasonForNotVisitedCustomer() :
                            <Text style={{textAlign: 'center', color: '#00897B', fontSize: 18}}>
                                {'Hurrah ! ! ! \n \n You have visited all customer which are assigned for you today'}
                            </Text>
                    }
                </View>
            </View>
        )
    }

    renderReasonForNotVisitedCustomer() {
        return (
            <View>
                <Text style={{fontSize: 22, color: '#00897B', marginTop: 10}}>
                    Reason for not visiting customers
                </Text>
                {
                    this.state.customerDetails.map((reasonData, index) => {
                        let color = !reasonData.reason ? '#ffe7c1' : reasonData.reason && reasonData.not_sync ? '#ff745f' : '#dfe7e5';
                        return (
                            <View key={index}>
                                <TouchableOpacity onPress={() => this.handleCustomerPressed(reasonData, index)}
                                                  style={{paddingTop: 10}}>
                                    <ReturnItemView
                                        backgroundColor={color}
                                        productName={reasonData.name}
                                        productFontSize={18}
                                        showSupportText
                                        secondText={reasonData.reason}
                                        disableFirstLine
                                        disableSecondLine
                                        disableRemoveButton
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
            </View>
        )
    }

    handleCustomerPressed(reasonData) {
        this.props.navigation.navigate('AddReason', {
            reasonData,
            refresh: this.loadCustomerDetails.bind(this)
        });
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    handover: state.handover.handover,
});

const mapDispatchToProps = (dispatch) => ({
    getHandoversData() {
        return dispatch(getHandoverData());
    },
    getNotVisitReasonFromRealm(id) {
        return dispatch(getNotVisitReason(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotVisitedCustomerReasonList);