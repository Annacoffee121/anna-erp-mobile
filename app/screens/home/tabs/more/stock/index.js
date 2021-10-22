import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, ListView,} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {SearchBar} from 'react-native-elements'
import styles from './styles';
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from "../../../../../components/textHeader";
import ProductView from '../../../../../components/productsView'
import {getProductsFromRealm} from "../../../../../actions/dropdown";

class StockListTab extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            searchText: '',
            searchArray: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            dataSearchSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.loadRemoteContacts();
    }

    loadRemoteContacts(callback) {
        this.props.getProductsData().done(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.products),
                searchArray: Object.values(this.props.products),  //Set new array for searching purpose
                isLoading: false
            });
            if (typeof callback === 'function' || callback instanceof Function) {
                callback();
            }
        });
    }

    renderRow(product) {
        const soldStock = product.sold_stock ? product.sold_stock : 0;
        const replacedStock = product.replaced_qty ? product.replaced_qty : 0;
        let color = product.stock_level === soldStock ? '#f9e7eb' : '#FFF';
        return (
            <ListItem button
                      style={{marginBottom: 2, marginRight: 10, marginLeft: 10, padding: 5, backgroundColor: color}}
                      onPress={() => console.log(product, 'product')}>
                <View style={{width: '100%'}}>
                    <ProductView
                        key={product.value}
                        itemName={product.name}
                        itemTamilName={product.tamil_name}
                        allocateQty={product.stock_level}
                        packetPrice={product.packet_price}
                        soldQty={soldStock + replacedStock}
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
                renderRow={(product) => this.renderRow(product)}
            />
        )
    }

    render() {
        let {configurations} = this.props.screenProps.system;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={'Stock Details'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
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
        const newData = this.state.searchArray.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.startsWith(textData)
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
                renderRow={(product) => this.renderRow(product)}/>
        )
    }
}

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
    isConnected: state.system.isConnected,
    products: state.dropdowns.products,
});


const mapDispatchToProps = (dispatch) => ({
    getProductsData() {
        return dispatch(getProductsFromRealm());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StockListTab);