import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import {Icon, Divider} from 'react-native-elements'
import {Left, Right} from 'native-base'
import {transformToCurrency} from "../../helpers/currencyFormatConverter";

export default OrderItemView = (props) => (
    <View>
        <TouchableOpacity onPress={props.itemPress}>
            <View style={{flexDirection: 'row'}}>
                <View style={{width: '10%', justifyContent: 'center'}}>
                    <Text style={{fontSize: 15}}>{props.id}</Text>
                </View>
                <View style={{justifyContent: 'center', width: '80%'}}>
                    <Text style={{fontSize: 20}}>{props.itemName}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Left><Text style={{fontSize: 15}}>Qty: {props.quantity}</Text></Left>
                        <Right><Text style={{fontSize: 15}}>Rate: {transformToCurrency(props.rate)}</Text></Right>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {/*<Left><Text style={{fontSize: 15}}>U.Type: {props.uType}</Text></Left>*/}
                        <Right><Text style={{fontSize: 15}}>Amount: {transformToCurrency(props.amount)}</Text></Right>
                    </View>
                </View>
                <View style={{width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        !props.disableRemoveButton ?
                            <TouchableOpacity onPress={props.removeButtonPress}>
                                <Icon
                                    name='remove-circle-outline'
                                    color='#ff391c'
                                />
                            </TouchableOpacity> : null
                    }

                </View>
            </View>
        </TouchableOpacity>
        {
            !props.disableDivider ? <Divider style={{backgroundColor: '#dedede', marginTop: 6}}/> : null
        }

    </View>
);