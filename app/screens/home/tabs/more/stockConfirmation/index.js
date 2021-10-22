import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Alert, FlatList} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import {SearchBar, Button} from 'react-native-elements'
import styles from './styles';
import {findIndex, filter} from 'lodash';
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from "../../../../../components/textHeader";
import ProductsEditView from '../../../../../components/productsEditView'
import {changeActualStock, getProductsFromRealm} from "../../../../../actions/dropdown";
import {setStockConfirmation} from "../../../../../actions/product";
import DropdownAlert from "react-native-dropdownalert";
import {showMessage} from "../../../../../helpers/toast";

class StockConfirmation extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            loadingText: null,
            searchText: '',
            searchArray: [],
            data: {},
            products: []
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.loadRemoteContacts();
    }

    loadRemoteContacts() {
        this.props.getProductsData().then(products => {
                this.setState({products});
                let data = {};
                products.map(product => {
                    const soldStock = product.sold_stock ? product.sold_stock : 0;
                    const replacedStock = product.replaced_qty ? product.replaced_qty : 0;
                    const totalSold = soldStock + replacedStock;
                    const actualStock = product.actual_stock ? product.actual_stock : null;
                    data = {
                        ...data,
                        [product.value]: {
                            allocated_stock: product.stock_level,
                            sold_stock: totalSold,
                            balance_stock: product.stock_level - totalSold,
                            actual_stock: actualStock,
                        }
                    };
                });
                this.setState({isLoading: false, refreshing: false, data})
            }
        );
    }

    renderRow(product) {
        const soldStock = product.sold_stock ? product.sold_stock : 0;
        const replacedStock = product.replaced_qty ? product.replaced_qty : 0;
        const totalSold = soldStock + replacedStock;
        return (
            <ListItem style={{marginRight: 10, marginLeft: 10}}>
                <ProductsEditView name={product.name}
                                  tamilName={product.tamil_name}
                                  allocated={product.stock_level}
                                  totalSold={totalSold}
                                  balance={product.stock_level - totalSold}
                                  onChangeText={(text) => this.handleTextChange(text, product)}
                                  value={product.actual_stock ? product.actual_stock.toString() : ''}
                />
            </ListItem>
        );
    }

    handleTextChange(text, product) {
        let {products, searchText, searchArray} = this.state;
        const proIndex = findIndex(products, o => o.value === product.value);
        products[proIndex] = {...products[proIndex], actual_stock: text};
        const seaIndex = findIndex(searchArray, o => o.value === product.value);
        searchArray[seaIndex] = {...searchArray[seaIndex], actual_stock: text};
        this.setState({
            products,
            searchArray: searchText ? searchArray : [],
            data: {
                ...this.state.data, [product.value]:
                    {...this.state.data[product.value], actual_stock: text}
            }
        });
    }

    handleRefresh() {
        this.setState({refreshing: true});
        this.loadRemoteContacts();
    }

    renderStockList() {
        const {refreshing, products} = this.state;
        return (
            <FlatList
                data={products}
                onRefresh={() => this.handleRefresh()}
                refreshing={refreshing}
                renderItem={({item}) => this.renderRow(item)}
                keyExtractor={item => item.value.toString()}
            />
        )
    }

    render() {
        const {configurations} = this.props;
        const {data} = this.state;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={'Stock confirmation'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                />
                <View style={{flex: 1}}>
                    <Spinner visible={this.state.isLoading}
                             textContent={this.state.loadingText ? this.state.loadingText : configurations.loginScreenLoaderText}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <SearchBar
                        lightTheme
                        showLoadingIcon={this.state.isSearch}
                        onChangeText={(text) => this.SearchFilterFunction(text)}
                        containerStyle={{backgroundColor: '#FFFFFF'}}
                        inputStyle={{backgroundColor: '#CCCCCC'}}
                        placeholder='Search'
                        clearIcon={{color: '#86939e', name: 'close'}}/>
                    <View style={{height: '90%', flex: 1}}>
                        {
                            (this.state.searchText === '') ? this.renderStockList() : this.renderSearchView()
                        }
                    </View>
                    <Button
                        raised
                        icon={{name: 'check'}}
                        backgroundColor={'#00897B'}
                        containerViewStyle={{marginBottom: 5}}
                        color={'#FFF'}
                        onPress={() => this.handleConfirmStockPress(data)}
                        title='Confirm Stock'/>
                </View>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        );
    }

    handleConfirmStockPress(data) {
        const not_marked_products = filter(data, o => !o.actual_stock);
        if (not_marked_products.length) return showMessage(`There are ${not_marked_products.length} products need to be fill actual balance!`);
        Alert.alert(
            'Are you sure ?',
            'Do you want to confirm stock?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Yes',
                    onPress: () => this.handleSendData(data)
                },
            ],
            {cancelable: false}
        )
    }

    handleSendData(stocks) {
        if (this.props.isConnected) {
            this.setState({loadingText: 'Uploading data to server...', isLoading: true});
            this.props.postStockConfirmationData({stocks}).then(async () => {
                this.setState({loadingText: 'Uploading data to local database...'});
                await Object.keys(stocks).map(key => {
                    this.props.updateActualStockInRealm(key, stocks[key]).then(() => {
                    });
                })
            }).then(() => {
                this.setState({loadingText: null, isLoading: false});
                this.props.navigation.goBack();
            }).catch(() => {
                this.setState({loadingText: null, isLoading: false});
                this.dropdown.alertWithType('error', 'Upload error', 'Please try again!');
            })
        } else {
            this.dropdown.alertWithType('error', 'No internet connection', 'Please connect internet to enable this function!');
        }
    }

//Search Functions and View
    SearchFilterFunction(text) {
        const {products} = this.state;
        this.setState({isSearch: true});
        const newData = products.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.startsWith(textData)
        });
        this.setState({
            searchArray: newData,
            searchText: text,
            isSearch: false
        })
    }

    renderSearchView() {
        const {searchArray} = this.state;
        return (
            <View>
                {searchArray.map((item, i) => <View key={i}>{this.renderRow(item)}</View>)}
            </View>
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
    postStockConfirmationData(payload) {
        return dispatch(setStockConfirmation(payload));
    },
    updateActualStockInRealm(key, data) {
        return dispatch(changeActualStock(key, data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StockConfirmation);
