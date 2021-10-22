import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import {Icon, Divider, Avatar} from 'react-native-elements'
import {Right} from 'native-base'

export default ContactView = (props) => (
    <View>
        <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Avatar
                medium
                rounded
                title={titleName(props.displayName, props.lastName)}
                onPress={props.avatarPressed}
                activeOpacity={0.7}
            />
            <View style={{marginLeft: 20, justifyContent: 'center',}}>
                    <Text style={{fontSize:15}}>{props.displayName}</Text>
                    <Text style={{fontSize:15}}>{props.tamilName}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize:15}}>{props.salutation}</Text>
                    <Text style={{marginLeft: 3,fontSize:15}}>{props.firstName}</Text>
                    <Text style={{marginLeft: 5,fontSize:15}}>{props.lastName}</Text>
                </View>
            </View>
            <Right>
                {
                    !props.disableRemoveButton ?
                        <TouchableOpacity onPress={props.removeButtonPress}>
                            <Icon
                                name='remove-circle-outline'
                                color='#ff391c'
                            />
                        </TouchableOpacity> : null
                }

            </Right>
        </View>
        {
            !props.disableDivider ? <Divider style={{backgroundColor: '#dedede', marginTop: 6}}/> : null
        }

    </View>
);

function titleName(f, l) {
    return f.charAt(0) + l.charAt(0);
}