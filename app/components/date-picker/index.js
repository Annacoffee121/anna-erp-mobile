import React, {Component} from 'react';
import CoreDatePicker from 'react-native-datepicker'
import {TextField} from 'react-native-material-textfield';
import {View} from 'react-native';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocus: true
        };
    }

    render() {
        return (
            <View style={{flexDirection: 'row', width: this.props.width ? this.props.width : '100%'}}>
                <TextField
                    label={this.props.label}
                    value={this.props.value}
                    returnKeyType="next"
                    onChangeText={value => {
                        this.props.onChange(value);
                    }}
                    tintColor={'#00897B'}
                    containerStyle={{width: '82%'}}
                    error={this.props.error}
                    editable={this.props.editable}
                />
                {
                    this.state.isFocus
                        ? this.renderDatePicker()
                        : null
                }

            </View>
        )
    }

    renderDatePicker() {
        return (
            <CoreDatePicker
                showIcon={true}
                hideText={true}
                date={this.props.value}
                confirmBtnText={'OK'}
                cancelBtnText={'Cancel'}
                onDateChange={this.props.dateChanged}
                mode={'date'}
                disabled={this.props.disableDatePicker}
                // maxDate={this.props.maxDate}
                // minDate={this.props.minDate}
                // customStyles={{
                //     dateText:{color:'#000', fontSize:20},
                //     dateInput:{borderWidth: 0}
                // }}
                // customStyles={{dateIcon: {width:30, height:30,}}}
                style={{
                    width: '18%', justifyContent: 'flex-end',
                    alignItems: 'center', marginLeft: 5
                }}
            />
        )
    }
}