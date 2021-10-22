import React, {Component} from 'react';
import {View, Text} from 'react-native'
import {Container, Content} from 'native-base';
import styles from "./styles";
import ScreenHeader from '../../../components/textHeader';
import moment from "moment/moment";
import {transformToCurrency} from "../../../helpers/currencyFormatConverter";
import BluetoothSerial from 'react-native-bluetooth-serial'
import {buffer} from './view'
import Spinner from "../../../components/spinner";
import {showMessage} from "../../../helpers/toast";

export default class DeliveryNotePreview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            printData: null,
            companyDetails: null,
            isLoading: false
        };
    }

    componentWillMount() {
        const {state} = this.props.navigation;
        this.setState({
            printData: state.params.printData,
            companyDetails: state.params.companyDetails,
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
        const data = {
            companyName: companyDetails.name + ' - ' + companyDetails.city,
            orderId: "Delivery Note",
            customer: {
                name: printData.customer.display_name ? printData.customer.display_name : '',
                addressL1: printData.customer.street_one ? printData.customer.street_one + ' ,' : '',
                addressL2: printData.customer.street_two ? printData.customer.street_two : '',
                addressL3: printData.customer.city ? printData.customer.city : '',
            },
            date: moment().format('YYYY-MM-DD h:mm:ss'),
            orderDate: printData.order_date,
            deliveryDate: printData.delivery_date,
            items: printData.order_items,
            subTotal: printData.sub_total,
            total: printData.total,
        };
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{backgroundColor: '#FFF', width: 380, padding: 10}}>
                    <Text style={{textAlign: 'center'}}>{data.orderId}</Text>
                    <Text style={{textAlign: 'center'}}>{data.date}</Text>
                    {
                        this.renderOrderDetails(data)
                    }
                    {/*<Text style={{textAlign: 'center'}}>Thank You!!</Text>*/}
                    {/*<Text style={{textAlign: 'center'}}>Hotline: 021-201-0000</Text>*/}
                    {/*<Text style={{textAlign: 'center'}}>Solution By: www.ceymplon.lk</Text>*/}
                </View>
            </View>
        )
    }

    renderOrderDetails(data) {
        return (
            <View>
                <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Order Details</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{width: '43.74%', fontWeight: 'bold'}}>Items&Desc</Text>
                    <Text style={{width: '10.42%', fontWeight: 'bold'}}>Qty</Text>
                    <Text style={{width: '20.83%', textAlign: 'right', fontWeight: 'bold'}}>Rate</Text>
                    <Text style={{width: '25.01%', textAlign: 'right', fontWeight: 'bold'}}>Amount</Text>
                </View>
                {this.renderOrderItems(data.items)}
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{textAlign: 'right', width: '25.01%'}}>{'-----------------------'}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'right', width: '74.99%', fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{textAlign: 'right', width: '25.01%', fontWeight: 'bold'}}>
                        {transformToCurrency(data.total)}
                    </Text>
                </View>
            </View>
        )
    }

    renderOrderItems(order) {
        return (
            <View>
                {
                    order.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{width: '43.74%'}}>{item.product_name}</Text>
                            <Text style={{width: '10.42%'}}>{item.quantity}</Text>
                            <Text style={{width: '20.83%', textAlign: 'right'}}>{transformToCurrency(item.rate)}</Text>
                            <Text
                                style={{width: '25.01%', textAlign: 'right'}}>{transformToCurrency(item.amount)}</Text>
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
        if (this.state.printData.is_order_printed === 'Yes') return showMessage('Sorry, This bill is already printed');
        BluetoothSerial.write(buffer(this.state.printData, this.state.companyDetails));
        setTimeout(() => {
            this.props.navigation.pop(2)
        }, 500)
    }
}