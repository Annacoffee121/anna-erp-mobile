import React from 'react';
import { Text, View} from 'react-native';

export default DashboardCustomerText = (props) => (
    <View style={{flexDirection: 'row', alignItems: 'center', width:'70%'}}>
        <Text style={{fontWeight: 'bold', color:'#FFF', width:'70%'}}>{props.leftValue}</Text>
        <Text style={{textAlign: 'right', color:'#FFF', width:'30%'}}>{props.rightValue}</Text>
    </View>
);
