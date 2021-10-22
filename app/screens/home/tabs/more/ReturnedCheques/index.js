import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SearchBar} from 'react-native-elements'
import {Alert, FlatList, Text} from 'react-native';
import {Container, View, ListItem} from 'native-base';
import styles from './styles';
import DropdownAlert from "react-native-dropdownalert";
import Spinner from '../../../../../components/spinner/index';
import ScreenHeader from "../../../../../components/textHeader";
import {getReturnedChequesData} from "../../../../../actions/more";
import {transformToCurrency} from "../../../../../helpers/currencyFormatConverter";

class ReturnedCheques extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            refreshing: false,
            isSearch: false,
            isLoading: false,
            loadingText: null,
            searchText: '',
            searchArray: [],
            data: [],
        };
    }

    componentDidMount() {
        this.setState({isLoading: true, loadingText: 'Fetching returned cheques...'});
        this.loadReturnedCheques();
    }

    loadReturnedCheques() {
        this.props.getReturnedCheques().then(cheques => {
            this.setState({isLoading: false, loadingText: null, refreshing: false, data: cheques});
        }).catch(() => {
            this.setState({isLoading: false, loadingText: null, refreshing: false});
        })
    }

    renderRow(cheque) {
        return (
            <ListItem style={{marginLeft: 10, width: '100%'}} onPress={() =>
                this.props.navigation.navigate('ReturnedChequeView', {cheque})
            }>
                <View style={{width: '100%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 18, color: '#000'}}>{cheque.cheque_no}</Text>
                        <Text style={{fontSize: 18, color: '#000'}}>{transformToCurrency(cheque.total)}</Text>
                    </View>
                    <Text style={{fontSize: 16}}>{cheque.customer}</Text>
                    <Text>Cheque date: {cheque.cheque_date}</Text>
                </View>
            </ListItem>
        );
    }

    handleRefresh() {
        this.setState({refreshing: true});
        this.loadReturnedCheques();
    }

    renderStockList() {
        const {refreshing, data} = this.state;
        return (
            <FlatList
                data={data}
                onRefresh={() => this.handleRefresh()}
                refreshing={refreshing}
                renderItem={({item}) => this.renderRow(item)}
                keyExtractor={item => item.cheque_no}
            />
        )
    }

    render() {
        const {loadingText, isSearch, isLoading, searchText} = this.state;
        return (
            <Container style={styles.container}>
                <ScreenHeader name={'Returned Cheques'}
                              leftButtonValue='Back'
                              leftButtonPress={() => this.props.navigation.goBack()}
                />
                <View style={{flex: 1}}>
                    <Spinner visible={isLoading}
                             textContent={loadingText ? loadingText : 'Loading...'}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <SearchBar
                        lightTheme
                        showLoadingIcon={isSearch}
                        onChangeText={(text) => this.SearchFilterFunction(text)}
                        containerStyle={{backgroundColor: '#FFFFFF'}}
                        inputStyle={{backgroundColor: '#CCCCCC'}}
                        placeholder='Search'
                        clearIcon={{color: '#86939e', name: 'close'}}/>
                    <View style={{height: '90%', flex: 1}}>
                        {
                            searchText ? this.renderSearchView() : this.renderStockList()
                        }
                    </View>
                </View>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </Container>
        );
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        const {data} = this.state;
        this.setState({isSearch: true});
        const newData = data.filter(function (item) {
            const itemData = item.cheque_no.toUpperCase();
            const itemData2 = item.customer_name.toUpperCase();
            const textData = text.toUpperCase();
            if (itemData.startsWith(textData)) {
                return itemData.startsWith(textData)
            } else if (itemData2.startsWith(textData)) {
                return itemData2.startsWith(textData)
            }
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
    isConnected: state.system.isConnected,
});


const mapDispatchToProps = (dispatch) => ({
    getReturnedCheques() {
        return dispatch(getReturnedChequesData());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReturnedCheques);