import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import {Icon, Divider, Avatar} from 'react-native-elements'
import {Right} from 'native-base'
import {transformToCurrency} from "../../helpers/currencyFormatConverter";
import styles from "./styles";

export default PaymentView = (props) => (
    <View>
        <TouchableOpacity onPress={props.paymentPressed} style={styles.itemMainView}>
            <View style={{width: 200}}>
                <Text>Mode: {props.mode === "Customer Credit" ? "Return" : props.mode}</Text>
                <Text>Type: {props.type}</Text>
                {
                    (props.mode === 'Cash' || props.mode === 'Customer Credit')
                        ? null
                        : <Text># {props.paymentDetails}</Text>
                }
            </View>
            <Right>
                <View>
                    <Text style={styles.blackText}>{transformToCurrency(props.amount)}</Text>
                    <Text style={{color: '#f23734'}}>{props.syncStatus ? 'Not_Sync' : null}</Text>
                </View>
            </Right>
            <Right>
                <View style={styles.iconView}>
                    {
                        !props.disableRefundButton ?
                            <TouchableOpacity onPress={props.refundButtonPress} style={{marginRight: 5}}>
                                <Icon
                                    name='edit'
                                    color={'#00897B'}
                                    type='font-awesome'
                                />
                            </TouchableOpacity> : null
                    }
                    {
                        !props.disableRemoveButton ?
                            <TouchableOpacity onPress={props.removeButtonPress}>
                                <Icon
                                    name='print'
                                    color={'#00897B'}
                                />
                            </TouchableOpacity> : null
                    }
                </View>

            </Right>
        </TouchableOpacity>
        {
            !props.disableDivider ? <Divider style={{backgroundColor: '#dedede', marginTop: 10}}/> : null
        }

    </View>
);
