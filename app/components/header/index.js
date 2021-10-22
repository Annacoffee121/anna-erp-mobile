import React from 'react';
import {Header, Left, Body, Right, Title, Button, Icon} from 'native-base';
import {Platform} from 'react-native';

const LeftButton = (props) => (
    <Left style={{flex: 1}}>
        <Button transparent onPress={props.leftButtonPress}>
            {
                !props.disableLeftButton ?
                    <Icon name={props.leftButtonIcon ?
                        props.leftButtonIcon : 'menu'}
                          style={{color: '#FFF', fontSize: props.leftIconSize}}/> : null
            }
        </Button>
    </Left>
);

const RightButton = (props) => (
    <Right style={{flex: 1}}>
        <Button transparent onPress={props.rightButtonPress}>
            {
                !props.disableRightButton ?
                    <Icon name={props.rightButtonIcon ?
                        props.rightButtonIcon : 'refresh'}
                          style={{color: '#FFF', fontSize: props.rightIconSize}}/> : null
            }
        </Button>
    </Right>
);

const BodyContent = (props) => (
    <Body style={{flex: 1, alignItems: 'center'}}>
    <Title style={{color: '#FFF',}}>{props.name}</Title>
    </Body>
);

export default ScreenHeader = (props) => (
    <Header style={[{backgroundColor: '#00897B'}, props.style]} androidStatusBarColor="#00897B"
            iosBarStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <LeftButton {...props}/>
        <BodyContent {...props}/>
        {!props.loading ? <RightButton {...props}/> : <Right/>}
    </Header>
);
