import React from 'react';
import {Header, Left, Body, Right, Title} from 'native-base';
import {Platform, TouchableHighlight, Text} from 'react-native';

const LeftButton = (props) => (

    <Left style={{flex: 1}}>
        <TouchableHighlight onPress={props.leftButtonPress}
                            underlayColor="transparent"
                            style={{width: 100, height:40, justifyContent:'center'}}
                            activeOpacity={0.5}>
            {
                !props.disableleftButton ?
                    <Text style={{fontSize: 15, color: '#FFF'}}>{props.leftButtonValue} </Text>
                    : <Text/>
            }
        </TouchableHighlight>
    </Left>
);

const RightButton = (props) => (
    <Right style={{flex: 1}}>
        <TouchableHighlight onPress={props.rightButtonPress}
                            underlayColor="transparent"
                            style={{width: 100, height:40, justifyContent:'center'}}
                            activeOpacity={0.5}>
            {
                !props.disableRightButton ?
                    <Text style={{fontSize: 15, textAlign: 'right', color: '#FFF'}}>{props.rightButtonValue} </Text>
                    : <Text/>
            }
        </TouchableHighlight>
    </Right>
);

const BodyContent = (props) => (
    <Body style={{flex: 3, alignItems: 'center'}}>
    <Title style={{color: '#FFF'}}>{props.name}</Title>
    </Body>
);

export default ScreenHeader = (props) => (
    <Header noShadow style={[{backgroundColor: '#00897B'}, props.style]} androidStatusBarColor="#00897B"
            iosBarStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <LeftButton {...props}/>
        <BodyContent {...props}/>
        {!props.loading ? <RightButton {...props}/> : <Right/>}
    </Header>
);
