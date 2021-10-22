import React, {Component,} from 'react';
import {Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert} from 'react-native'
import {connect} from "react-redux";
import styles from "./styles";
import ScreenHeader from "../../../../../components/textHeader";
import Spinner from "../../../../../components/spinner";
import {
    getAllRoutesData,
    getNextDayRoute,
    getRoutesCustomerData,
    submitTomorrowRoute
} from "../../../../../actions/handover";
import {showMessage} from "../../../../../helpers/toast";

class PickRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataSource: null,
            customers: null,
            text: '',
            modalVisible: false,
            route: 'Click here to select route',
            routeId: null,
            tomorrow_route: null,
            isEdit: false
        }
    }

    componentWillMount() {
        this.getNextDayRoute();
    }

    getNextDayRoute() {
        if (!this.props.isConnected) return showMessage('No network connection found');
        this.setState({isLoading: true});
        this.props.getNextDayRoutData().then(data => {
                if (!data) return this.getDataFromServer('');
                this.setState({tomorrow_route: data.name, isLoading: false})
            }
        ).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        })
    }

    getDataFromServer(text) {
        if (!this.props.isConnected) return showMessage('No network connection found');
        this.setState({isLoading: true});
        this.props.getRoutData(text).then(data =>
            this.setState({dataSource: data.results, isLoading: false})
        ).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        })
    }

    getCustomerFromServer(routeId) {
        if (!this.props.isConnected) return showMessage('No network connection found');
        this.setState({isLoading: true});
        this.props.getRoutCustomers(routeId)
            .then(route => {
                this.setState({customers: route.customers, isLoading: false})
            })
            .catch(error => {
                this.setState({isLoading: false});
                console.log(error)
            })
    }

    submitRoute() {
        if (!this.props.isConnected) return showMessage('No network connection found');
        if (!this.state.routeId) return showMessage('Select a route to submit!');
        this.setState({isLoading: true});
        this.props.setTomorrowRoute({route_id: this.state.routeId}).then(async result => {
            await this.setState({isLoading: false});
            Alert.alert(
                'Done',
                'Route submitted successfully!',
                [
                    {text: 'Ok', onPress: () => this.props.navigation.goBack()},
                ],
                {cancelable: false}
            );
        }).catch(error => {
            this.setState({isLoading: false})
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeader name={'Next day allocation'}
                              style={{width: '100%'}}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}/>
                <Spinner visible={this.state.isLoading}
                         textContent={'Loading'}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>
                {this.state.tomorrow_route && !this.state.isEdit ? this.renderEditRoute() : this.renderNewRoute()}
                {this.renderModal()}
            </View>
        )
    }

    renderEditRoute() {
        const {tomorrow_route} = this.state;
        return (
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <Text style={[styles.mainHeading, {textAlign: 'center'}]}>
                    {"You have already selected " + tomorrow_route.toString() + " for tomorrow! \n Would you like to edit?"}
                </Text>
                <TouchableOpacity
                    onPress={async () => {
                        await this.getDataFromServer('');
                        this.setState({isEdit: true});
                    }}
                    style={[styles.buttonStyle, {marginTop: 10}]}
                >
                    <Text style={{color: "#FFF"}}>Edit route</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderNewRoute() {
        const text = this.state.isEdit ? "Update" : "Submit";
        return (
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <Text style={styles.mainHeading}>Select your route for
                    tomorrow</Text>
                {
                    !this.props.isConnected ? <Text>No network connection..</Text> :
                        this.state.dataSource ?
                            this.renderPage() :
                            <Text>Loading...</Text>
                }
                <View style={styles.bottom}>
                    <TouchableOpacity
                        onPress={() => this.submitRoute()}
                        style={styles.buttonStyle}
                    >
                        <Text style={{color: "#FFF"}}>{text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderModal() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({modalVisible: false})}>
                {this.state.dataSource ? this.renderList() : null}
            </Modal>
        )
    }

    renderList() {
        const {dataSource, text} = this.state;
        return (
            <View style={{flex: 1}}>
                <ScreenHeader name={'Pick a route'}
                              style={{width: '100%'}}
                              leftButtonValue='Close'
                              leftButtonPress={() => this.setState({modalVisible: false})}/>
                <View style={styles.mainContent}>
                    <TextInput
                        style={styles.searchText}
                        onChangeText={async (text) => {
                            await this.setState({text});
                            this.getDataFromServer(text);
                        }}
                        value={text}
                    />
                    <ScrollView style={styles.secondaryVie}>
                        {
                            dataSource.map((route, index) => (
                                <TouchableOpacity key={index} style={{padding: 5}}
                                                  onPress={async () => {
                                                      await this.setState({
                                                          modalVisible: false,
                                                          route: route.name,
                                                          routeId: route.value
                                                      });
                                                      this.getCustomerFromServer(route.value);
                                                  }
                                                  }>
                                    <Text>{route.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }

    renderPage() {
        const {route, customers} = this.state;
        return (
            <View style={{width: '100%', padding: 10, flex: 1}}>
                <Text style={styles.clickText}
                      onPress={() => this.setState({modalVisible: true})}>
                    {route}
                </Text>
                {customers ? this.renderCustomerList() : null}
            </View>
        )
    }

    renderCustomerList() {
        return (
            <View style={{marginTop: 10}}>
                <Text style={styles.heading}>Please check your customer list for tomorrow and press submit to
                    confirm.</Text>
                <View style={styles.customerList}>
                    <ScrollView style={styles.secondaryVie}>
                        {
                            this.state.customers.map((customer, index) => (
                                <Text key={index} style={{padding: 5}}>{customer.display_name}</Text>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        )

    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
    getNextDayRoutData() {
        return dispatch(getNextDayRoute());
    },
    getRoutData(text) {
        return dispatch(getAllRoutesData(text));
    },
    getRoutCustomers(routeId) {
        return dispatch(getRoutesCustomerData(routeId));
    },
    setTomorrowRoute(routeId) {
        return dispatch(submitTomorrowRoute(routeId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PickRoute);