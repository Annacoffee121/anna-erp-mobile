import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './style'
import {
    View,
    Text,
    Modal,
    ActivityIndicator,
} from 'react-native';

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

export default class Spinner extends Component {

    constructor(props) {
        super(props);
        this.state = { visible: this.props.visible, textContent: this.props.textContent };
    }

    static propTypes = {
        visible: PropTypes.bool,
        cancelable: PropTypes.bool,
        textContent: PropTypes.string,
        animation: PropTypes.oneOf(ANIMATION),
        color: PropTypes.string,
        size: PropTypes.oneOf(SIZES),
        overlayColor: PropTypes.string
    };

    static defaultProps = {
        visible: false,
        cancelable: false,
        textContent: '',
        animation: 'none',
        color: 'white',
        size: 'large', // 'normal',
        overlayColor: 'rgba(0, 0, 0, 0.1)'
    };

    close() {
        this.setState({ visible: false });
    }

    componentWillReceiveProps(nextProps) {
        const { visible, textContent } = nextProps;
        this.setState({ visible, textContent });
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    _renderDefaultContent() {
        return (
            <View style={styles.spinnerBackground}>
                <ActivityIndicator
                    color={this.props.color}
                    size={this.props.size}
                    style={{ flex: 1 }}
                />
                <View style={styles.spinnerTextContainer}>
                    <Text style={[styles.spinnerTextContent, this.props.textStyle]}>{this.state.textContent}</Text>
                </View>
            </View>
        );
    }

    _renderSpinner() {
        const { visible } = this.state;

        if (!visible)
            return null;

        const spinner = (
            <View style={[
                styles.spinnerContainer,
                { backgroundColor: this.props.overlayColor }
            ]} key={`spinner_${Date.now()}`}>
                {this.props.children ? this.props.children : this._renderDefaultContent()}
            </View>
        );

        return (
            <Modal
                animationType={this.props.animation}
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={visible}>
                {spinner}
            </Modal>
        );

    }

    render() {
        return this._renderSpinner();
    }
}