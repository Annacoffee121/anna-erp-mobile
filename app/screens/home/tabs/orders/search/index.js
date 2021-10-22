import React, {Component} from 'react';
import {View, Text, ListView, ActivityIndicator, RefreshControl, TextInput} from 'react-native'
import {ListItem} from 'native-base';
import styles from './styles'
import ScreenHeader from '../../../../../components/textHeader'

export default class DropDownSearch extends Component {
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
        if (state.params.data && !state.params.route_id) {
            if (state.params.data.length > 0) {
                this.setState({
                    productData: state.params.data,
                    dataSource: this.state.dataSource.cloneWithRows(state.params.data),
                    isLoading: false
                })
            } else {
                let data = [{name: 'No results found', value: null}];
                this.setState({
                    productData: data,
                    dataSource: this.state.dataSource.cloneWithRows(data),
                    isLoading: false
                })
            }

        } else {
            this.loadItems();
        }
    }

    //Refresh or Download items
    loadItems() {
        const {system} = this.props.screenProps;
        const {state} = this.props.navigation;
        let id = state.params.route_id;
        let test = this;
        state.params.getData(id ? id : null).then(function (data) {
            test.setState({
                productData: data,
                dataSource: test.state.dataSource.cloneWithRows(data),
                isLoading: false,
                refreshing: false
            })
        });
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        const newData = this.state.productData.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.startsWith(textData)
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            searchText: text,
            isSearch: false
        })
    }

    // Refresh data
    handleRefresh() {
        this.setState({refreshing: true});
        this.loadItems();
    }

    renderRow(rowData) {
        const soldItem = rowData.sold_stock ? rowData.sold_stock : 0;
        const replacedItem = rowData.replaced_qty ? rowData.replaced_qty : 0;
        const sold_stock = soldItem + replacedItem;
        let color = rowData.stock_level === sold_stock ? '#f9e7eb' : '#FFF';
        return (
            <ListItem button
                      onPress={() => this.handelHeaderRightButtonPress(rowData)}
                      style={{backgroundColor: color, marginLeft: 10, marginRight: 10, marginBottom: 2, padding: 5}}>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <Text style={{width:'88%'}}>{rowData.name}</Text>
                        {
                            rowData.stock_level ?
                                <Text style={{width:'12%'}}># {rowData.stock_level - sold_stock}</Text> :
                                null
                        }
                    </View>
                    {
                        rowData.tamil_name ? <Text>{rowData.tamil_name}</Text> : null
                    }
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
                    // rightButtonValue='OK'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <View style={{padding: 10, flex:1}}>
                            <TextInput
                                value={this.state.valueName}
                                style={styles.textInputStyle}
                                onChangeText={value => {
                                    this.setState({valueName: value, valueId: null});
                                    this.SearchFilterFunction(value);
                                    // this.props.onChange(value);
                                }}
                                placeholder={' Type Here...'}
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
                                        // style={{height: 100}}
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
        await this.setState({valueName: rowData.name, valueId: rowData.id ? rowData.id : rowData.value});
        await this.props.navigation.state.params.returnDropDownData(this.state.valueName, this.state.valueId);
        this.props.navigation.goBack();
    }
}