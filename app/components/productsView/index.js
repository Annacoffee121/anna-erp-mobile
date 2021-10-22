import React from 'react';
import {View, Text} from 'react-native'
import styles from './style'
import {transformToCurrency} from "../../helpers/currencyFormatConverter";

export default ProductView = (props) => (
    <View>
        <Text style={styles.headerText}>{props.itemName}</Text>
        <Text style={{fontSize: 17}}>{props.itemTamilName}</Text>
        <View style={styles.headerDetail}>
            <Text style={styles.bodyText}>Allocated: {props.allocateQty}</Text>
            <Text style={styles.bodyText}>Sold: {props.soldQty}</Text>
            <Text style={styles.bodyText}>Available: {props.allocateQty - props.soldQty}</Text>
        </View>
        {
            props.packetPrice ?
                <Text style={styles.bodyText}>Packet price: {transformToCurrency(props.packetPrice)}</Text>
                : null
        }
    </View>
);