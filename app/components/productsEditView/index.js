import React from 'react';
import {View, Text, TextInput} from 'react-native'
import styles from './style'

export default ProductsEditView = (props) => (
    <View style={{width: '100%'}}>
        <Text style={{fontSize: 20, color: '#000'}}>{props.name}</Text>
        <Text style={{fontSize: 15, color: '#999'}}>{props.tamilName}</Text>
        <View style={styles.containerStyle}>
            <View style={[styles.text, {borderColor: '#5cb4ff'}]}>
                <Text style={{fontSize: 13, color: '#999'}}>Allocated</Text>
                <Text style={{fontSize: 20, color: '#999'}}>{props.allocated}</Text>
            </View>
            <View style={[styles.text, {borderColor: '#7bff07'}]}>
                <Text style={{fontSize: 13, color: '#999'}}>Sold</Text>
                <Text style={{fontSize: 20, color: '#999'}}>{props.totalSold}</Text>
            </View>
            <View style={[styles.text, {borderColor: '#eb7964'}]}>
                <Text style={{fontSize: 13, color: '#999'}}>Balance</Text>
                <Text style={{fontSize: 20, color: '#999'}}>{props.balance}</Text>
            </View>
            <View style={[styles.text, {borderColor: '#00897B'}]}>
                <Text style={{fontSize: 13, color: '#00897B'}}>A.Balance</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    keyboardType={"number-pad"}
                />
            </View>
        </View>
    </View>
);