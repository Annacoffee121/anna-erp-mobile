import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, Text, ListView, ScrollView} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {ButtonGroup, SearchBar} from 'react-native-elements'
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import styles from './styles';
import {getOrdersFromRealm} from "../../../../actions/orders/index";
import Spinner from '../../../../components/spinner/index';
import IndexHeader from '../../../../components/header';
import OrderView from '../../../../components/salesOrderView'
import FilterItemView from '../../../../components/filterItem'
import moment from "moment/moment";
import {transformToCurrency} from "../../../../helpers/currencyFormatConverter";

let filterData = ['All Order', 'Scheduled Orders', 'Drafted Orders', 'Approval Pending', 'Open Order', 'Overdue', 'Partially Invoiced'];
const today = moment().format('YYYY-MM-DD');
const component1 = () => <Text>All</Text>;
const component2 = () => <Text>Today</Text>;
const component3 = () => <Text>Credit</Text>;

class OrdersTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            searchText: '',
            filterItem: 'All Order',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            selectedIndex: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.handleRightButtonPress = this.handleRightButtonPress.bind(this);
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteContacts();
    }

    loadRemoteContacts(callback) {
        this.props.getOrdersData().done(() => {
            const newData = filterAllData(this.state.searchText, this.state.selectedIndex, this.props.orders);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData),
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    renderRow(order) {
        return (
            <ListItem button style={styles.ListItem} onPress={() => this.handleClick(order)}>
                <View style={{width: '100%'}}>
                    <OrderView
                        key={order.id}
                        customerName={order.customer_name}
                        tamilName={order.tamil_name ? order.tamil_name : ''}
                        invoiceAmount={order.total}
                        orderNumber={order.ref}
                        invoiceStatus={order.status}
                        statusColor={order.status === 'Closed' ? '#129c31' : order.status === 'Open' ? '#ffa121' : '#f23734'}
                        orderDate={order.order_date}
                        due_amount={order.due_amount ? 'Due: ' + transformToCurrency(order.due_amount) : null}
                        syncStatus={order.not_sync}
                    />
                </View>
            </ListItem>
        );
    }

    handleClick(order) {
        let {navigate} = this.props.navigation;
        navigate('ShowOrder', {orderId: order.id})
    }

    handleRefresh() {
        this.setState({refreshing: true});
        this.loadRemoteContacts(() => this.setState({refreshing: false}));
    }

    renderContactView() {
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh.bind(this)}
                        tintColor="#00897B"
                        title="Loading..."
                        colors={['#00897B', '#00897B']}
                        progressBackgroundColor="#ffffff"
                    />}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(order) => this.renderRow(order)}
            />
        )
    }

    handleRightButtonPress() {
        this.props.navigation.navigate('AddNewOrder');
    }

    updateIndex(selectedIndex) {
        this.setState({isLoading: true});
        const newData = filterAllData(this.state.searchText, selectedIndex, this.props.orders);
        this.setState({
            selectedIndex,
            dataSource: this.state.dataSource.cloneWithRows(newData),
            isLoading: false
        })
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        const buttons = [{element: component1}, {element: component2}, {element: component3}];
        const {selectedIndex} = this.state;
        const totalOrder =  this.props.orders;
        const headerName = totalOrder ? "Orders (" + totalOrder.length + ")" : "Orders (0)";
        return (
            <Container style={styles.container}>
                <IndexHeader
                    name={headerName}
                    disableLeftButton
                    // leftButtonIcon="ios-funnel"
                    // leftIconSize={22}
                    leftButtonPress={() => this.popupDialog.show()}
                    rightButtonIcon="md-add"
                    rightIconSize={30}
                    rightButtonPress={() => this.handleRightButtonPress()}/>

                {this.renderPopUp()}
                <View style={{flex: 1}}>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.container}>
                        <ButtonGroup
                            onPress={(val) => this.updateIndex(val)}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{marginBottom: 0, marginTop: 10}}
                            selectedButtonStyle={{backgroundColor: '#cccccc'}}
                        />
                        <SearchBar
                            lightTheme
                            showLoadingIcon={this.state.isSearch}
                            onChangeText={(text) => this.SearchFilterFunction(text)}
                            containerStyle={{backgroundColor: '#FFF', borderTopColor: '#FFF', top: 0}}
                            inputStyle={{backgroundColor: '#CCCCCC'}}
                            placeholder='Search'
                            clearIcon={{color: '#86939e', name: 'close'}}/>
                        <View style={{flex: 1}}>
                            {this.renderContactView()}
                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        this.setState({isSearch: true});
        const newData = filterAllData(text, this.state.selectedIndex, this.props.orders);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }

    renderPopUp() {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.popupDialog = popupDialog;
                }}
                dialogTitle={<DialogTitle title="FILTER ORDERS BY"/>}
                width={0.8}>
                <ScrollView style={{padding: 10}}>
                    {
                        filterData.map((value, index) => {
                            return (
                                <FilterItemView
                                    key={index}
                                    iconColor={this.state.filterItem === value ? '#00897B' : '#000'}
                                    value={value}
                                    itemPressed={() => this.handleFilterItemPressed(value)}/>
                            );
                        })
                    }
                </ScrollView>
            </PopupDialog>
        )
    }

    handleFilterItemPressed(value) {
        this.setState({filterItem: value});
        this.popupDialog.dismiss();
    }
}

function filterAllData(searchText, selectedIndex, rawData) {
    let newData = rawData;
    let returnData = rawData;
    if (searchText) {
        newData = rawData.filter(function (item) {
            const itemData = item.customer_name.toUpperCase();
            const itemData2 = item.order_date.toUpperCase();
            const textData = searchText.toUpperCase();
            if (itemData.startsWith(textData)) {
                return itemData.startsWith(textData)
            } else if (itemData2.indexOf(textData) > -1) {
                return itemData2.indexOf(textData) > -1
            }
        });
    }
    if (selectedIndex === 2) {
        returnData = newData.filter(function (item) {
            return moment(item.order_date).isBefore(today);
        });
    } else if (selectedIndex === 1) {
        returnData = newData.filter(function (item) {
            return moment(item.order_date).isSame(today);
        });
    } else {
        returnData = newData;
    }
    return returnData;
}

const mapStateToProps = (state) => ({
    auth: state.auth.oauth,
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    orders: state.order.all.reverse(),
});


const mapDispatchToProps = (dispatch) => ({
    getOrdersData() {
        return dispatch(getOrdersFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTab);