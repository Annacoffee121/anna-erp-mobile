import React from 'react';
import {View, Text} from 'react-native'
import styles from './style'
import {transformToCurrency} from "../../helpers/currencyFormatConverter";

export default OrderView = (props) => (
    <View>
        <View style={styles.headerDetail}>
            <Text style={styles.headerText}>{props.customerName}</Text>
            {
                !props.disableAmount ?
                    <Text style={styles.headerText}>{transformToCurrency(props.invoiceAmount)}</Text>
                    : null
            }
        </View>
        <Text>{props.tamilName}</Text>
        <View style={styles.headerDetail}>
            <Text style={styles.bodyText}>{props.orderNumber}</Text>
            <Text style={{fontSize: 16, color: props.statusColor}}>{props.invoiceStatus}</Text>
        </View>
        <View style={styles.headerDetail}>
            <Text>{props.orderDate}</Text>
            {
                props.due_amount ? <Text style={{color: '#f23734'}}>{props.due_amount}</Text> : null
            }
            <Text style={{color: '#f23734'}}>{props.syncStatus ? 'Not_Sync' : null}</Text>
        </View>
    </View>
);