import React from 'react';
import {Header, Left, Body, Right, Title, Button, Icon} from 'native-base';
import {Platform} from 'react-native';
import CoreDatePicker from 'react-native-datepicker'
import styles from './styles';

const LeftButton = (props) => (
    <Left style={{flex: 1}}>
        <Button transparent style={styles.menuIcon} onPress={props.leftButtonPress}>
            <Icon name='ios-search' style={styles.iconStyle}/>
        </Button>
    </Left>
);

const RightButton = (props) => (
    <Right style={{flex: 1}}>
        <Button transparent style={styles.menuIcon} onPress={props.rightButtonPress}>
            {
                !props.disableRightButton ?
                    <Icon name='ios-search' style={styles.iconStyle}/> : null
            }
        </Button>
    </Right>
);

const BodyContent = (props) => (
    <Body style={styles.bodyStyle}>
    <Button transparent style={styles.menuIcon} onPress={props.bodyLeftButtonPress}>
        <Icon name='ios-arrow-back' style={styles.iconStyle}/>
    </Button>
    <CoreDatePicker
        showIcon={false}
        style={styles.titleStyle}
        date={props.currentDate}
        confirmBtnText={'OK'}
        cancelBtnText={'Cancel'}
        onDateChange={props.dateChanged}
        mode={'date'}
        // maxDate={this.props.maxDate}
        // minDate={this.props.minDate}
        customStyles={{
            dateText:{color:'#FFF', fontSize:20},
            dateInput:{borderWidth: 0}
        }}
    />
    <Button transparent style={styles.menuIcon} onPress={props.bodyRightButtonPress}>
        <Icon name='ios-arrow-forward' style={styles.iconStyle}/>
    </Button>
    </Body>
);

export default ScreenHeader = (props) => (
    <Header style={[{backgroundColor: '#00897B'}, props.style]} androidStatusBarColor="#00897B"
            iosBarStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        <LeftButton {...props}/>
        <BodyContent {...props}/>
        <RightButton {...props}/>
    </Header>
);
