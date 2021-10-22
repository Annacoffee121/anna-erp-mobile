import React, {Component} from 'react';
import {get, find, isEmpty} from 'lodash';
import {Right, Text, Thumbnail, List, Icon, ListItem, Left, Body, Content} from 'native-base';
import {Alert, View, TouchableHighlight, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
import PropTypes from './prop-types';
import DefaultProps from './default-props';
import CoreImagePicker from 'react-native-image-picker';
import {connect} from "react-redux";

class ImagePickerQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {
                added: [],
                removed: [],
                submitted: props.images
            },
            options: {
                title: props.libraryTitle,
                storageOptions: {
                    skipBackup: true,
                    path: props.storageName
                }
            },
        };
    };

    componentDidMount() {
        if (this.props.defaultImage) {
            this.setState({
                values: this.props.defaultImage
            })
        }
    }

    onSuccess(value) {
        let stateValues = this.state.values;
        stateValues.added.push(value);

        this.setState({values: stateValues});
        if (this.props.onChange) {
            this.props.onChange(stateValues);
        }
    }

    openCamera() {
        return CoreImagePicker.launchCamera(this.state.options, (response) => {
            this.onResponse(response);
        });
    }

    openLibrary() {
        return CoreImagePicker.launchImageLibrary(this.state.options, (response) => {
            this.onResponse(response);
        });
    }

    openBoth() {
        return CoreImagePicker.showImagePicker(this.state.options, (response) => {
            this.onResponse(response);
        });
    }

    onResponse(response) {
        if (!response.didCancel && !response.error && !response.customButton) {
            this.onSuccess({
                ...response,
            });
        }
    }

    openModePicker() {
        this.openBoth();
        // switch (this.props.mode) {
        //     case 'camera':
        //         return this.openCamera();
        //     case 'library':
        //         return this.openLibrary();
        //     case 'both':
        //         return this.openBoth();
        //     default:
        //         break;
        // }
    }

    removeImage(index, successCallback) {
        if (this.props.disabled) return;

        Alert.alert(
            this.props.configurations.imagesRemoveAlertTitle,
            this.props.configurations.imagesRemoveAlertDescription,
            [
                {text: this.props.configurations.imagesRemoveAlertCancelButtonText, style: 'cancel'},
                {
                    text: this.props.configurations.imagesRemoveAlertOKButtonText, onPress: () => {
                        successCallback(index)
                    }
                },
            ]
        );
    }

    removeAddedImages(index) {
        let stateValues = this.state.values;
        stateValues.added.splice(index, 1);

        this.setState({values: stateValues});
        if (!this.props.onSuccess) return;

        this.props.onSuccess(this.props.name, stateValues);
    }

    previewImages(values, successCallback) {
        return values.map((value, index) => (
            <TouchableHighlight key={index}
                                onPress={this.removeImage.bind(this, index, successCallback)}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                <Thumbnail
                    square
                    style={{margin: 5}}
                    resizeMode="cover"
                    size={width / 5}
                    source={{uri: value.uri}}
                />
            </TouchableHighlight>
        ));
    }

    chooseLogo() {
        return (

            <TouchableHighlight onPress={this.openModePicker.bind(this)}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon name="camera" size={30}/>
                    <Text style={{fontSize: 12}}> Choose Logo </Text>
                </View>
            </TouchableHighlight>

        )
    }

    preview() {
        if (!this.props.preview || isEmpty(this.state.values)) return null;
        return (
            <View style={{
                flex: 1,
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
            }}>{this.previewImages(this.state.values.added, this.removeAddedImages.bind(this))}</View>
        );
    }

    render() {
        return (
            <TouchableHighlight onPress={this.openModePicker.bind(this)}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                <View bounces={false}>
                    <View style={{
                        height: width / 5,
                        width: width / 4,
                        borderColor: '#909090',
                        borderWidth: 2,
                        alignItems: 'center',
                        marginBottom: 5,
                    }}>
                        {(isEmpty(this.state.values.added)) ? this.chooseLogo() : this.preview()}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

ImagePickerQuestion.propTypes = PropTypes;
ImagePickerQuestion.defaultProps = DefaultProps;

const mapStateToProps = (state) => ({
    configurations: state.system.configurations,
});

export default connect(mapStateToProps)(ImagePickerQuestion);