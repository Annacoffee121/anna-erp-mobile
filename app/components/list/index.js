import React, {Component} from 'react';
import {List as ListView, ListItem, Text, Left, Body, Right, Icon,} from 'native-base';
import PropTypes from './prop-types';

export default class List extends Component<{}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListView dataArray={this.props.items}
                      removeClippedSubviews={false}
                      style={{backgroundColor:'#ffffff'}}
                      renderRow={this.renderRow.bind(this)}/>
        );
    }

    renderRow(item) {
        return (
            <ListItem onPress={this.handelRowPress.bind(this, item)}
                      style={{marginLeft:0}}>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
                <Right>
                    <Icon name="arrow-forward"/>
                </Right>
            </ListItem>
        );
    }

    handelRowPress(item) {
        if (typeof this.props.rowPress === 'undefined') return;
        this.props.rowPress(item);
    }
}

List.propTypes = PropTypes;