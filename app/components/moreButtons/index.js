import React from 'react';
import {Text, View} from 'react-native'
import {Divider} from 'react-native-elements'

export default CollectionView = (props) => (
    <View style={{flexDirection: 'row', padding: 10}}>
        <View style={{width: '48%', flexDirection: 'row', marginRight: 5, alignItems: 'center'}}>
            <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>{props.leftVaueOne}</Text>
            <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>{props.rightVaueOne}</Text>
        </View>
        <Divider style={{backgroundColor: '#b0b0b0', height: '100%', width: 1}}/>
        <View style={{width: '48%', flexDirection: 'row', marginLeft: 5, alignItems: 'center'}}>
            <Text style={{fontSize: 18, width: '50%', textAlign: 'left'}}>{props.leftVaueTwo}</Text>
            <Text style={{fontSize: 18, width: '50%', textAlign: 'right', color: '#000'}}>{props.rightVaueTwo}</Text>
        </View>
    </View>
);