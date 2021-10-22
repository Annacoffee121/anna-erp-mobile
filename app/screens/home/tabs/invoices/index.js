import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, ListView, Text} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {ButtonGroup, SearchBar} from 'react-native-elements'
import styles from './styles';
import {getInvoicesFromRealm} from "../../../../actions/invoice/index";
import Spinner from '../../../../components/spinner/index';
import IndexHeader from '../../../../components/header';
import OrderView from '../../../../components/salesOrderView'
import moment from "moment/moment";
import {transformToCurrency} from "../../../../helpers/currencyFormatConverter";

const today = moment().format('YYYY-MM-DD');
const component1 = () => <Text>All</Text>;
const component2 = () => <Text>Today</Text>;
const component3 = () => <Text>Credit</Text>;

class InvoiceTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            searchText: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            selectedIndex: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteContacts();
    }

    loadRemoteContacts(callback) {
        this.props.getInvoicesData().done(() => {
            const newData = filterAllData(this.state.searchText, this.state.selectedIndex, this.props.invoices);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData),
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    renderRow(invoice) {
        return (
            <ListItem button style={styles.ListItem} onPress={() => this.handleClick(invoice)}>
                <View style={{width: '100%'}}>
                    <OrderView
                        key={invoice.id}
                        customerName={invoice.customer_name}
                        tamilName={invoice.tamil_name ? invoice.tamil_name : ''}
                        invoiceAmount={invoice.amount}
                        orderNumber={invoice.ref}
                        invoiceStatus={invoice.status}
                        statusColor={invoice.status === 'Paid' ? '#129c31' : invoice.status === 'Open' ? '#f23734' : '#ffa121'}
                        orderDate={invoice.invoice_date}
                        due_amount={invoice.due_amount ? 'Due: ' + transformToCurrency(invoice.due_amount) : null}
                        syncStatus={invoice.not_sync}
                    />
                </View>
            </ListItem>
        );
    }

    handleClick(invoice) {
        this.props.navigation.navigate('ShowInvoice', {invoiceId: invoice.id, orderId: invoice.sales_order_id});
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
                renderRow={(invoice) => this.renderRow(invoice)}
            />
        )
    }

    updateIndex(selectedIndex) {
        this.setState({isLoading: true});
        const newData = filterAllData(this.state.searchText, selectedIndex, this.props.invoices);
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
        const totalInvoice = this.props.invoices;
        const headerName = totalInvoice ? "Invoices (" + totalInvoice.length + ")" : "Invoices (0)";
        return (
            <Container style={styles.container}>
                <IndexHeader
                    name={headerName}
                    disableLeftButton
                    // leftButtonIcon="ios-funnel"
                    // leftIconSize={22}
                    leftButtonPress={() => this.handleLeftButtonPress()}
                    disableRightButton
                    // rightButtonIcon="md-add"
                    // rightIconSize={30}
                    // rightButtonPress={() => this.handleRightButtonPress()}
                />

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

    handleLeftButtonPress() {

    }

    //Search Functions and View
    SearchFilterFunction(text) {
        this.setState({isSearch: true});
        const newData = filterAllData(text, this.state.selectedIndex, this.props.invoices);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }
}

function filterAllData(searchText, selectedIndex, rawData) {
    let newData = rawData;
    let returnData = rawData;
    if (searchText) {
        newData = rawData.filter(function (item) {
            const itemData = item.customer_name.toUpperCase();
            const itemData2 = item.invoice_date.toUpperCase();
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
            return moment(item.invoice_date).isBefore(today);
        });
    } else if (selectedIndex === 1) {
        returnData = newData.filter(function (item) {
            return moment(item.invoice_date).isSame(today);
        });
    } else {
        returnData = newData;
    }
    return returnData;
}

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    invoices: state.invoice.all.reverse(),
});


const mapDispatchToProps = (dispatch) => ({
    getInvoicesData() {
        return dispatch(getInvoicesFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceTab);