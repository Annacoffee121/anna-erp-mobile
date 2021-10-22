import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Divider, Icon} from 'react-native-elements'
import {Right} from "native-base";

export default ReturnItemView = (props) => (
    <View style={{flexDirection: 'row'}}>
        {
            props.count ?
                <View style={{width: '6%', backgroundColor: '#00897B', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{
                        fontSize: props.productFontSize ? props.productFontSize : 20,
                        color: '#FFF'
                    }}>{props.count}</Text>
                </View> : null
        }
        <View style={{
            backgroundColor: props.backgroundColor ? props.backgroundColor : '#dfe7e5',
            padding: 5,
            width: props.count ?  '94%' :'100%'
        }}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: props.productFontSize ? props.productFontSize : 20, width: '90%'}}>
                    {props.productName}
                </Text>
                {
                    !props.disableRemoveButton ?
                        <Right>
                            <TouchableOpacity onPress={props.removePress}>
                                <Icon
                                    name='remove'
                                    type='font-awesome'
                                    color={'#ca2c2c'}
                                    style={{width: '10%'}}/>
                            </TouchableOpacity>
                        </Right> : null
                }

            </View>
            {
                props.showSupportText ?
                    <Text>{props.secondText}</Text>
                    : null
            }
            {
                !props.disableFirstLine ?
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.leftTextView}>
                            <Text>{props.firstLeftItemOne}</Text>
                            <Text>{props.firstLeftItemTwo}</Text>
                        </View>
                        <Divider style={{backgroundColor: '#938570', width: 1, height: '80%'}}/>
                        <View style={styles.rightTextView}>
                            <Text>{props.firstRightItemOne}</Text>
                            <Text>{props.firstRightItemTwo}</Text>
                        </View>
                    </View>
                    : null
            }
            {
                !props.disableSecondLine ?
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.leftTextView}>
                            <Text>{props.secondLeftItemOne}</Text>
                            <Text>{props.secondLeftItemTwo}</Text>
                        </View>
                        <Divider style={{backgroundColor: '#938570', width: 1, height: '80%'}}/>
                        <View style={styles.rightTextView}>
                            <Text>{props.secondRightItemOne}</Text>
                            <Text>{props.secondRightItemTwo}</Text>
                        </View>
                    </View> : null
            }
        </View>
    </View>
);

const styles = StyleSheet.create({
    leftTextView: {
        flexDirection: 'row',
        width: '47%',
        marginRight: 10,
        justifyContent: 'space-between'
    },
    rightTextView: {
        flexDirection: 'row',
        width: '47%',
        marginLeft: 10,
        justifyContent: 'space-between'
    },
});