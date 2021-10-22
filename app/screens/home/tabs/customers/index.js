import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, Text, ListView,} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {filter} from 'lodash';
import {SearchBar} from 'react-native-elements'
import styles from './styles';
import {getCustomersFromRealm} from "../../../../actions/customer/index";
import Spinner from '../../../../components/spinner/index';
import IndexHeader from '../../../../components/header';
import ContactItem from '../../../../components/contactView/customer'
import {getAllCustomersFromDB} from "../../../../../database/Customer/controller";

class CustomersTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            fetching: !props.customers.length,
            refreshing: false,
            isSearch: false,
            isLoading: false,
            searchText: '',
            searchArray: [],
            customers: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            }),
            dataSearchSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.handleRightButtonPress = this.handleRightButtonPress.bind(this);
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteContacts();
    }

    loadRemoteContacts(callback) {
        getAllCustomersFromDB().then(customers => this.setState({customers}));
        this.props.getCustomersData().done(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.props.customers),
                searchArray: Object.values(this.props.customers),  //Set new array for searching purpose
                fetching: false,
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    renderRow(customer) {
        return (
            <ListItem button style={styles.ListItem} onPress={() => this.handleClick(customer)}>
                <View>
                    <ContactItem
                        key={customer.id}
                        disableRemoveButton
                        disableDivider
                        displayName={customer.display_name}
                        tamilName={customer.tamil_name}
                        salutation={customer.salutation}
                        firstName={customer.first_name}
                        lastName={customer.last_name}
                    />
                </View>
            </ListItem>
        );
    }

    handleClick(customer) {
        let {navigate} = this.props.navigation;
        navigate('CustomerShow', {customer: customer.id})
    }

    handleRefresh() {
        this.setState({refreshing: true});
        getAllCustomersFromDB().then(customers => this.setState({customers}));
        this.loadRemoteContacts(() => this.setState({refreshing: false}));
    }

    renderSectionHeader(sectionData, section) {
        return (
            <ListItem itemDivider style={styles.ListItemDivider}>
                <Text style={styles.ListItemDividerText}>{section}</Text>
            </ListItem>
        )
    }

    renderContactView() {
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh.bind(this)}
                        tintColor="#ff0000"
                        title="Loading..."
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffffff"
                    />}
                dataSource={this.state.dataSource}
                renderRow={(customer) => this.renderRow(customer)}
                renderSectionHeader={(sectionData, section) => this.renderSectionHeader(sectionData, section)}
            />
        )
    }

    handleRightButtonPress() {
        this.props.navigation.navigate('CustomerNew');
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        const {customers} = this.state;
        const headerName = "Customers (" + customers.length + ")";
        return (
            <Container style={styles.container}>
                <IndexHeader
                    name={headerName}
                    disableLeftButton
                    // leftButtonIcon="ios-funnel"
                    // leftIconSize={22}
                    rightButtonIcon="md-add"
                    rightIconSize={30}
                    rightButtonPress={() => this.handleRightButtonPress()}
                />

                <View>
                    <Spinner visible={this.state.isLoading}
                             textContent={configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.container}>
                        <SearchBar
                            lightTheme
                            showLoadingIcon={this.state.isSearch}
                            onChangeText={(text) => this.SearchFilterFunction(text)}
                            containerStyle={{backgroundColor: '#FFFFFF'}}
                            inputStyle={{backgroundColor: '#CCCCCC'}}
                            placeholder='Search'
                            clearIcon={{color: '#86939e', name: 'close'}}/>
                        <View style={{height: '87%'}}>
                            {
                                (this.state.searchText === '') ? this.renderContactView() : this.renderSearchView()
                            }
                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        this.setState({isSearch: true});
        const {customers} = this.state;
        const newData = filter(customers, item => {
            const itemData = item.full_name.toUpperCase();
            const itemData2 = item.display_name.toUpperCase();
            const itemData3 = item.email.toUpperCase();
            const textData = text.toUpperCase();
            if (itemData.startsWith(textData)) {
                return itemData.startsWith(textData)
            } else if (itemData2.startsWith(textData)) {
                return itemData2.startsWith(textData)
            } else if (itemData3.indexOf(textData) > -1) {
                return itemData3.indexOf(textData) > -1
            }
        });
        this.setState({
            dataSearchSource: this.state.dataSearchSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }

    renderSearchView() {
        return (
            <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSearchSource}
                renderRow={(customer) => this.renderRow(customer)}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    customers: state.customer.all,
});


const mapDispatchToProps = (dispatch) => ({
    getCustomersData() {
        return dispatch(getCustomersFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomersTab);