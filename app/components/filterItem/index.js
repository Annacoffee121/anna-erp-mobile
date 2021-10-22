import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import {Icon, Divider} from 'react-native-elements'
import {Left, Right} from 'native-base'

export default FilterItemView = (props) => (
    <TouchableOpacity onPress={props.itemPressed}>
        <View style={{alignItems: 'center', flexDirection: 'row', padding:10}}>
            <Icon
                name='md-filing'
                type='ionicon'
                size={30}
                color={props.iconColor}/>
            <Text style={{marginLeft: 20, fontSize:18, color:props.iconColor}}>{props.value}</Text>
        </View>
        <Divider style={{backgroundColor: '#b0b0b0', marginTop: 6}}/>
    </TouchableOpacity>
);