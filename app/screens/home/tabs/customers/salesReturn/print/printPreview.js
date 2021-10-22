import React, {Component} from 'react';
import {View, Text} from 'react-native'
import {Container, Content} from 'native-base';
import styles from "./styles";
import ScreenHeader from '../../../../../../components/textHeader';
import moment from "moment/moment";
import {transformToCurrency} from "../../../../../../helpers/currencyFormatConverter";
import BluetoothSerial from 'react-native-bluetooth-serial'
import {buffer} from './view'
import Spinner from "../../../../../../components/spinner";
import {changeSalesReturnPrintStatus} from "../../../../../../services/order/printStatus";
// import {NavigationActions} from "react-navigation";
import {showMessage} from "../../../../../../helpers/toast";

export default class SalesReturnPrintPreview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            printData: null,
            companyDetails: null,
            customerData: null,
            isLoading: false
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            printData: state.params.printData,
            companyDetails: state.params.companyDetails,
            customerData: state.params.customerData,
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <ScreenHeader
                    name={'Print Preview'}
                    leftButtonValue='Back'
                    leftButtonPress={this.handelHeaderLeftButtonPress.bind(this)}
                    rightButtonValue='Print'
                    rightButtonPress={this.handelHeaderRightButtonPress.bind(this)}
                />
                <Content>
                    <Spinner visible={this.state.isLoading}
                             textContent={'Please wait... We are preparing your print!'}
                             textStyle={{color: '#00897B'}}
                             color={'#00897B'}/>
                    <View style={styles.content}>
                        {
                            this.state.printData ? this.renderBody() : null
                        }
                    </View>
                </Content>
            </Container>
        )
    }

    renderBody() {
        let printData = this.state.printData;
        let companyDetails = this.state.companyDetails;
        let customerData = this.state.customerData;
        const data = {
            companyName: companyDetails.name + ' - ' + companyDetails.city,
            printHeading: 'Sales Return',
            customer: {
                name: customerData.display_name ? customerData.display_name : '',
                addressL1: customerData.street_one ? customerData.street_one : 'street_one',
                addressL2: customerData.street_two ? customerData.street_two : 'street_two',
                addressL3: customerData.city ? customerData.city : 'city',
            },
            date: moment().format('YYYY-MM-DD h:mm:ss'),
            returnedItems: printData.items,
            returnTotal: printData.total,
            replacedItems: printData.return_products,
            resolutionData: printData.resolutions,
            resolutionTotal: calculateTotal(printData.resolutions),
        };
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{backgroundColor: '#FFF', width: 380, padding: 10}}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{data.companyName}</Text>
                    <Text style={{textAlign: 'center'}}>{data.printHeading}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer.name}</Text>
                    <Text
                        style={{textAlign: 'center'}}>{data.customer.addressL1 + ', ' + data.customer.addressL2}</Text>
                    <Text style={{textAlign: 'center'}}>{data.customer.addressL3}</Text>
                    <Text style={{textAlign: 'center'}}>{data.date}</Text>

                    {
                        this.renderReturnItem(data)
                    }
                    <Text style={{textAlign: 'center'}}>Thank Tou!!</Text>
                    <Text style={{textAlign: 'center'}}>Solution By: www.ceymplon.lk</Text>
                </View>
            </View>
        )
    }

    renderReturnItem(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Returned Items</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Items&Desc</Text>
                    <Text style={{width: '10.42%', fontWeight: 'bold'}}>Qty</Text>
                    <Text style={{width: '20.83%', textAlign: 'right', fontWeight: 'bold'}}>R.Rate</Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderReturnedItems(data.returnedItems)}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '65%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '35%'}}>{transformToCurrency(data.returnTotal)}</Text>
                </View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Resolutions</Text>
                {
                    data.replacedItems.length ? this.renderReplaceBody(data) : null
                }
                {this.renderResolutionDetails(data.resolutionData)}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '65%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '35%'}}>{transformToCurrency(data.resolutionTotal)}</Text>
                </View>
            </View>
        )
    }

    renderReplaceBody(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold'}}>Replaced</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Items&Desc</Text>
                    <Text style={{width: '10.42%', fontWeight: 'bold'}}>Qty</Text>
                    <Text style={{width: '20.83%', textAlign: 'right', fontWeight: 'bold'}}>Rate</Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderReplacedItems(data.replacedItems)}
            </View>
        )
    }

    renderReturnedItems(returnedItems) {
        return (
            <View>
                {
                    returnedItems.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{width: '43.74%'}}>{item.product_name}</Text>
                            <Text style={{width: '10.42%'}}>{item.qty}</Text>
                            <Text style={{width: '20.83%', textAlign: 'right'}}>
                                {transformToCurrency(item.returned_rate)}
                            </Text>
                            <Text style={{width: '25.01%', textAlign: 'right'}}>
                                {transformToCurrency(item.returned_amount)}
                            </Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    renderReplacedItems(replacedItems) {
        return (
            <View>
                {
                    replacedItems.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{width: '43.74%'}}>{item.product_name}</Text>
                            <Text style={{width: '10.42%'}}>{item.qty}</Text>
                            <Text style={{width: '20.83%', textAlign: 'right'}}>{transformToCurrency(item.rate)}</Text>
                            <Text
                                style={{width: '25.01%', textAlign: 'right'}}>{transformToCurrency(item.amount)}</Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    renderResolutionDetails(resolutions) {
        return (
            <View>
                {
                    resolutions.map((item, index) => (
                        <View key={index}>
                            {
                                item.type !== 'Replace' ?
                                    <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{width: '50%', fontWeight: 'bold'}}>{item.type}</Text>
                                        <Text style={{
                                            width: '50%',
                                            textAlign: 'right'
                                        }}>{transformToCurrency(item.amount)}</Text>
                                    </View> : null
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    handelHeaderLeftButtonPress() {
        this.props.navigation.goBack();
    }

    handelHeaderRightButtonPress() {
        if (this.state.printData.is_printed === 'Yes') return showMessage('Sorry, This bill is already printed');
        BluetoothSerial.write(buffer(this.state.printData, this.state.companyDetails, this.state.customerData));
        this.changeSalesReturnPrintStatus();
    }

    changeSalesReturnPrintStatus() {
        changeSalesReturnPrintStatus(this.state.printData.id, 'Yes').then((returnData) => {
            if (returnData) {
                this.setState({isLoading: false});
                this.props.navigation.pop(2)
                // const resetAction = NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({
                //             routeName: 'SalesReturnShow',
                //             params: {salesReturnId: this.state.printData.id}
                //         }),
                //     ]
                // });
                // this.props.navigation.dispatch(resetAction)
            }
        }).catch(error => console.warn(error, 'error'))
    }
}

// Payment Total Calculation function
function calculateTotal(data) {
    let total = 0;
    if (data) {
        data.map((value) => {
            total = total + value.amount
        });
    }
    return total;
}