import React, {Component} from 'react';
import {View, Text, ListView, ActivityIndicator, RefreshControl} from 'react-native'
import {TextField} from 'react-native-material-textfield';
import {ListItem} from 'native-base'
import {connect} from "react-redux";
import {getStore} from "../../../actions/dropdown/index";

class StoreDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            storeText: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            storeData: [],
            isDropDown: false
        };
    }

    //Download store
    loadStore() {
        if (this.props.isConnected) {
            this.props.getStoreData().done(() => {
                this.setState({
                    storeData: this.props.store,
                    dataSource: this.state.dataSource.cloneWithRows(this.props.store),
                    isLoading: false,
                    refreshing: false,
                });
            });
        } else {
            alert('Your connection was interrupted')
        }
    }

    //Search Functions and View
    SearchFilterFunction(text) {
        const newData = this.state.storeData.filter(function (item) {
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
        this.loadStore();
    }

    renderRow(rowData) {
        return (
            <ListItem button onPress={() => {
                this.setState({storeText: rowData.name, isDropDown: false});
                this.props.onChange(rowData);
            }}>
                <View>
                    <Text>{rowData.name}</Text>
                </View>
            </ListItem>
        );
    }

    render() {
        return (
            <View>
                <TextField
                    label='Store'
                    value={this.props.value}
                    returnKeyType="next"
                    onFocus={() => {
                        this.props.onFocus();
                        this.setState({isDropDown: true});
                        if (!this.props.store) {
                            this.setState({isLoading: true});
                            this.loadStore()
                        } else {
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.props.store),
                                storeData: this.props.store,
                            });
                        }
                    }}
                    onBlur={() => {
                        this.setState({isDropDown: false});
                        this.props.onBlur();
                    }}
                    onChangeText={value => {
                        this.setState({storeText: value, isDropDown: true});
                        this.SearchFilterFunction(value);
                        this.props.onChange(value);
                    }}
                    tintColor={'#00897B'}
                    containerStyle={{width: '100%'}}
                    error={this.props.error}
                />
                {
                    this.state.isDropDown
                        ? this.state.isLoading
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
                            style={{height: 100}}
                            enableEmptySections={true}
                            keyboardShouldPersistTaps="always"
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this.renderRow(rowData)}/>
                        : null
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.system.isConnected,
    store: state.dropdowns.store,
});

const mapDispatchToProps = (dispatch) => ({
    getStoreData() {
        return dispatch(getStore());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreDropDown);