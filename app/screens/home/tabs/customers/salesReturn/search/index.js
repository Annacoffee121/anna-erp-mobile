import React, {Component} from 'react';
import {View, Text, ListView, ActivityIndicator, RefreshControl, TextInput} from 'react-native'
import {ListItem} from 'native-base';
import styles from './styles'
import ScreenHeader from '../../../../../../components/textHeader'
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";

export default class SearchReturnOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            valueName: '',
            valueId: null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            productData: [],
            isLoading: true,
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        if (state.params.data.length) {
            this.setState({
                productData: state.params.data,
                dataSource: this.state.dataSource.cloneWithRows(state.params.data),
                isLoading: false
            })
        } else {
            let data = [{name: 'Orders not found', value: null}];
            this.setState({
                productData: data,
                dataSource: this.state.dataSource.cloneWithRows(data),
                isLoading: false
            })
        }
    }

    loadItems() {
        this.setState({refreshing: false});
    }

    SearchFilterFunction(text) {
        const newData = this.state.productData.filter(function (item) {
            const itemData = item.ref.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.startsWith(textData)
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }

    handleRefresh() {
        this.setState({refreshing: true});
        this.loadItems();
    }

    renderRow(rowData) {
        return (
            <ListItem button
                      onPress={() => this.handelHeaderRightButtonPress(rowData)}
                      style={{backgroundColor: '#FFF', marginLeft: 10, marginRight: 10, marginBottom: 2, padding: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Text>{rowData.ref ? rowData.ref : rowData.order_no}</Text>
                    <Text># {transformToCurrency(rowData.rate)}</Text>
                </View>
            </ListItem>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScreenHeader name='Search'
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                />
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <View style={{padding: 10}}>
                            <TextInput
                                value={this.state.valueName}
                                style={styles.textInputStyle}
                                onChangeText={value => {
                                    this.setState({valueName: value, valueId: null});
                                    this.SearchFilterFunction(value);
                                }}
                                placeholder={'Type Here...'}
                                underlineColorAndroid="transparent"
                            />
                            {
                                this.state.isLoading
                                    ? <ActivityIndicator size="large" color="#00897B" animating={this.state.isLoading}/>
                                    : <ListView
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
                                        keyboardShouldPersistTaps="always"
                                        dataSource={this.state.dataSource}
                                        renderRow={(rowData) => this.renderRow(rowData)}/>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    async handelHeaderRightButtonPress(rowData) {
        await this.setState({valueName: rowData.ref, valueId: rowData.id });
        await this.props.navigation.state.params.returnDropDownData(this.state.valueName, this.state.valueId);
        this.props.navigation.goBack();
    }
}