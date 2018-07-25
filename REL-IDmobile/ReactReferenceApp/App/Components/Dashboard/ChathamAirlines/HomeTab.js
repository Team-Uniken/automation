/*
 * it shows Notifications
 */
'use strict';
/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import moment from 'moment';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import { StyleSheet, Text, TextInput, AsyncStorage, TouchableHighlight, TouchableWithoutFeedback, View, Alert, Platform, Image,ScrollView } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Modal from 'react-native-simple-modal';
import TouchID from 'react-native-touch-id';
import Util from "../../Utils/Util";
import Main from '../../Container/Main';
/*
 Use in this js
 */
import Skin from '../../../Skin';

/*
 INSTANCES
 */
const SCREEN_WIDTH = require('Dimensions').get('window').width;
const NotificationAction = {
    ACCEPT: "accept",
    REJECT: "reject",
    FRAUD: "fraud",
    CLICK: "click",
    HIDE: "hide",
    CHANGELANG: "changelang"
}

export default class NotificationCard extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                parseMessage: "",
            }

    }
    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {

    }


    render() {

        var today = new Date();
        var currentDate = moment(Date(today)).format('DD/MM/YYYY');
        var nextDate = moment(today, "DD-MM-YYYY").add(1, 'days').format('DD/MM/YYYY');
        return (

            <View style={{
                flex: 1,
                backgroundColor: Skin.main.BACKGROUND_COLOR,

            }}>

                { <Image style={{
                                  height:"100%",
                                  width:"100%",
                                   position:'absolute',
                                   resizeMode:'stretch'
                                  
                                
                                }}
                                    source={require('../../../img/download.jpeg')} /> }

                <View>
                    <View style={style.titleView}>
                        <Text style={style.title}
                            numberOfLines={5}>Welcome Back,</Text>
                        <Text style={[style.title, { color: Skin.BUTTON_BG_COLOR }]}
                            numberOfLines={5}>{Main.dnaUserName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginRight: 10, marginLeft: 10 }}>
                        <View style={{ flex: 1, height: 50, justifyContent: 'center' }} >

                          


                        </View>
                        <View style={{ height: 0, marginLeft: 30 }} >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[style.headerTitle, {
                                    width: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }]}
                                >Status level</Text>
                                <Image style={{
                                    height: 30,
                                    width: 30,
                                }}
                                    source={require('../../../img/gold_small.png')} />

                            </View>
                            <View style={{ height: 50, justifyContent: 'center', marginTop: 0 }} >
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                    <Text style={style.headerTitle}
                                    >Miles Balance</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        textAlign: 'left',
                                        marginLeft: 10,
                                        backgroundColor: 'transparent'


                                    }}
                                    >141,030</Text>
                                </View>
                            </View>

                        </View>

                    </View>

  <Text style={[style.headerTitle, {

justifyContent: 'center',
alignItems: 'center',
fontWeight: 'bold',
marginLeft:10

}]}
>Upcoming Reservation</Text>
<View style={{ height: 0.5, backgroundColor: 'grey',margin:10 }} />

                   

                      <ScrollView>                  
                    <View style={{ width: 350, padding: 10, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 12, marginBottom: 5, backgroundColor: 'transparent' }}>{currentDate}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10,backgroundColor: 'transparent' }}>{"Confirmation : 3453222434"}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={style.viewBox}>
                                <View>
                                    <Text style={{ fontSize: 11, alignSelf: 'center', marginBottom: 3 }}>Departure</Text>
                                    <Text style={{ fontSize: 11, alignSelf: 'center', marginBottom: 3 }}>{currentDate}</Text>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5 }}>EWR</Text>
                                </View>
                            </View>
                            <View style={{ width: 20, height: 20, marginLeft: 15, marginRight: 15 }}>
                                <Text style={{ fontSize: 20, alignSelf: 'center', fontFamily: Skin.font.LOGO_FONT, color: Skin.THEME_COLOR }}>
                                    {Skin.icon.logo}
                                </Text>
                            </View>
                            <View style={style.viewBox}>
                                <View>
                                    <Text style={{ fontSize: 11, alignSelf: 'center', marginBottom: 3 }}>Arrival</Text>
                                    <Text style={{ fontSize: 11, alignSelf: 'center', marginBottom: 3 }}>{nextDate}</Text>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5 }}>DUB</Text>
                                </View>
                            </View>
                        </View>
                    </View>

 <View style={{ height: 0.5, backgroundColor: 'grey',margin:10 }} />

                 



 </ScrollView>    





                </View>
            </View>

        );
    }
}


const style = StyleSheet.create({
    customerow: {
        backgroundColor: Skin.color.WHITE,
        flex: 1,
        paddingTop: 8,
        paddingRight: 8,
        paddingLeft: 8,
        marginTop: 20,
        width: SCREEN_WIDTH - 32,
        alignSelf: 'center'
    },

    title: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
    titleView: {
        height: 50,
        margin: 10,
        backgroundColor: 'transparent'
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },

    viewBox: {
        width: 80,
        height: 80, backgroundColor: 'grey', padding: 5, justifyContent: 'center', borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5, borderTopRightRadius: 5,
        borderBottomRightRadius: 5, borderColor: Skin.THEME_COLOR, backgroundColor: "transparent", borderWidth: 1

    },
    row: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    lngRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    rowMultiLang: {
        flexDirection: 'row',
    },
    col: {
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        height: 200,
        width: 300
    },
    notificationButton: {
        backgroundColor: 'transparent',
        height: 50,
        flex: 1,
        flexDirection: 'row',
    },
    amountrow: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 32,
    },
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subject: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Skin.BLACK_TEXT_COLOR,
        width: 188,
        flex: 3,
        textAlign: 'left',
        opacity: 1,
        backgroundColor: 'transparent',
    },
    time: {
        fontSize: 16,
        color: Skin.BLACK_TEXT_COLOR,
        textAlign: 'right',
        opacity: 0.6,
        flex: 2,
        backgroundColor: 'transparent',
        //width: SCREEN_WIDTH - 230,
    },
    body: {
        fontSize: 16,
        color: Skin.BLACK_TEXT_COLOR,
        opacity: 0.6,
    },
    dot: {
        fontSize: 16,
        width: 15,
        color: Skin.BLACK_TEXT_COLOR,
        opacity: 0.6,
    },
    body2: {
        fontSize: 16,
        marginRight: 32,
        width: SCREEN_WIDTH - 71,
        color: Skin.BLACK_TEXT_COLOR,
        opacity: 0.6,
    },
    bold: {
        fontSize: 22,
        width: SCREEN_WIDTH - 32 - 48,
        color: Skin.BLACK_TEXT_COLOR,
        opacity: 1,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    amountContainer: {
        justifyContent: 'flex-end',
        flex: 3,
    },
    htmlstyle: {
        fontSize: 20,
        color: Skin.BLACK_TEXT_COLOR,
        width: SCREEN_WIDTH - 32,
        opacity: 1,
    },

    buttontext: {
        fontSize: SCREEN_WIDTH <= 320 ? 18 : 20,
        color: Skin.color.WHITE,
        textAlign: 'center',
        opacity: 1,
    },
    confirmbutton: {
        /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
        flex: 1,
        margin: 2,
        backgroundColor: Skin.color.APPROVE_BUTTON_COLOR,
    },
    denybutton: {
        /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
        flex: 1,
        margin: 2,
        backgroundColor: Skin.color.REJECT_BUTTON_COLOR,
    },
    fraudbutton: {
        /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
        flex: 1,
        margin: 2,
        backgroundColor: Skin.color.FRAUD_BUTTON_COLOR,
    },
    approvebutton: {
        /* width:(SCREEN_WIDTH-32)/2,
         height:56, */
        flex: 1,
        margin: 2,
        backgroundColor: Skin.color.APPROVE_BUTTON_COLOR,
    },
    rejectbutton: {
        /*width:(SCREEN_WIDTH-32)/2,
        height:56, */
        flex: 1,
        margin: 2,
        backgroundColor: Skin.color.REJECT_BUTTON_COLOR,
    },
});
