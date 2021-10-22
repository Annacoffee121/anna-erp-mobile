import React, {Component} from 'react';
import {View, Text, ListView, ActivityIndicator, RefreshControl, TextInput} from 'react-native'
import {ListItem} from 'native-base';
import styles from './styles'
import ScreenHeader from '../../../../../../components/textHeader'

const data = [{value: 'Product was damaged or defective'}, {value: 'Product no longer needed'}, {value: 'Product was expired'},
    {value: 'Product was not moving'}, {value: 'Product did not fit the customer’s expectations'}];

export default class SalesReturnReasonTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            searchText: '',
            isLoading: false,
        };
    }

    componentWillMount() {
        this.loadItems();
    }

    loadItems() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            refreshing: false,
            isLoading: false,
        })
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        const newData = data.filter(function (item) {
            const itemData = item.value.toUpperCase();
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
        return (
            <ListItem button onPress={() => {
                this.handelHeaderRightButtonPress(rowData)
            }}>
                <View>
                    <Text>{rowData.value}</Text>
                </View>
            </ListItem>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScreenHeader name='Sales Return Reason'
                              leftButtonValue='Cancel'
                              leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    // rightButtonValue='OK'
                    // rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <View style={{padding: 10}}>
                            <TextInput
                                value={this.state.valueName}
                                style={styles.textInputStyle}
                                onChangeText={value => this.SearchFilterFunction(value)}
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

    handelHeaderRightButtonPress(rowData) {
        this.props.navigation.state.params.returnReasonData(rowData.value);
        this.props.navigation.goBack();
    }
}