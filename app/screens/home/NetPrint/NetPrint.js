import React, {PureComponent} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Text, TextInput, View} from "react-native";
import {Container, Content} from "native-base";
import ScreenHeader from "../../../components/textHeader";
import styles from "./styles";
import {Button} from "react-native-elements";
import Spinner from "../../../components/spinner";
import {addOrUpdatePrinter, getNetPrinter} from "../../../actions/netPrint/NetPrinterAction";
import NetPrinterAPI from "../../../helpers/NetPrinterAPI";
import {ID} from "../../../helpers/createId";
import {showMessage} from "../../../helpers/toast";

const screenHeaderDefaultProps = {
    name: "Printer Details",
    leftButtonValue: "Back",
    leftButtonPress: () => {},
    rightButtonValue: undefined,
    rightButtonPress: undefined,
    style: {},
}

class NetPrint extends PureComponent {

    state = {
        isLoading: true,
        id: null,
        ip: '192.168.1.150',
        port: '631',
        printerReady: false,
        printer: {},
    }

    componentDidMount() {
        const {getNetPrinter, onMount} = this.props;
        getNetPrinter();

        if (onMount) onMount();

        NetPrinterAPI.init().then(() => {
            this.setState({isLoading: false});
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const {printer} = this.props;
        if (printer && printer !== prevProps.printer) {
            this.setState({
                isLoading: false,
                printer: printer,
            });

            this.deviceConnect(printer);
        }
    }

    onValueChange = (type) => (value) => {
        this.setState({[type]: value});
    }

    changeLoading = (isLoading, func) => {
        this.setState({isLoading}, func);
    };

    deviceConnect = (printer, successCallback, errorCallback) => {
        this.changeLoading(true, () => {
            NetPrinterAPI.connectPrinter(printer.ip, printer.port * 1).then(() => {
                if (successCallback) successCallback();

                this.setState({printerReady: true});
                this.changeLoading(false);
            }).catch((error) => {
                console.warn(error);

                if (errorCallback) errorCallback();
                this.changeLoading(false);
            });
        });
    };

    connectToPrinter = () => {
        const {ip, port, printer} = this.state;
        const {addOrUpdatePrinter} = this.props;

        this.deviceConnect({ip, port}, () => {
            showMessage("Printer Found!");
            addOrUpdatePrinter({id: printer.id || ID().toString(), ip, port: port * 1});

        }, () => {
            showMessage("Printer Connection failed!");
        });
    };

    printDocument = () => {
        const {onPrintPress} = this.props;

        if (onPrintPress) onPrintPress();
    }

    render() {
        const {
            screenHeader,
            loadingText,
            isLoading: propLoading,
        } = this.props;

        const {isLoading, ip, port, printerReady, printer} = this.state;

        return (
            <Container style={styles.container}>
                <ScreenHeader {...screenHeaderDefaultProps} {...screenHeader}/>

                <Spinner visible={propLoading || isLoading}
                         textContent={loadingText}
                         textStyle={{color: '#00897B'}}
                         color={'#00897B'}/>

                <Content style={styles.content}>
                    <View style={styles.contentView}>
                        <View>
                            <Text style={styles.label}>Ip address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={ip}
                                    placeholderTextColor="rgba(0, 139, 139, 0.4)"
                                    placeholder={'192.168.1.150'}
                                    keyboardType="decimal-pad"
                                    onChangeText={this.onValueChange('ip')}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={styles.label}>Port</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    keyboardType={"number-pad"}
                                    style={styles.input}
                                    value={port}
                                    placeholderTextColor="rgba(0, 139, 139, 0.4)"
                                    placeholder={'9100'}
                                    onChangeText={this.onValueChange('port')}
                                />
                            </View>
                        </View>

                        <View style={styles.content}>
                            <Button
                                disabled={{ip: printer?.ip, port: printer?.port} === {ip, port}}
                                onPress={this.connectToPrinter}
                                backgroundColor={'#00897B'}
                                icon={{name: 'ios-print', type: 'ionicon'}}
                                title='Connect to Printer'/>
                        </View>
                    </View>
                </Content>

                <View style={styles.content}>
                    <View>
                        <Button
                            raised
                            disabled={!printerReady}
                            onPress={this.printDocument}
                            backgroundColor={'#00897B'}
                            icon={{name: 'ios-print', type: 'ionicon'}}
                            title='PRINT'/>
                    </View>
                </View>
            </Container>
        );
    }
}

NetPrint.propTypes = {
    screenHeader: PropTypes.object,
};

NetPrint.defaultProps = {
    screenHeader: screenHeaderDefaultProps,
}

const mapStateToProps = function (state) {
    return {
        loadingText: state.system.configurations.loginScreenLoaderText,
        printer: state.printer.printer,
    };
}

export default connect(mapStateToProps, {
    getNetPrinter,
    addOrUpdatePrinter,
})(NetPrint);
