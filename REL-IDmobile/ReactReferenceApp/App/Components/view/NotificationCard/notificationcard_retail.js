/*
 * it shows Notifications
 */
"use strict";
/*
 ALWAYS NEED
 */
import React, { Component } from "react";
import ReactNative from "react-native";

/*
 Required for this js
 */
import Events from "react-native-simple-events";
import {
  StyleSheet,
  Text,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  Alert,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { NativeModules, NativeEventEmitter } from "react-native";
import Modal from "react-native-simple-modal";
import TouchID from "react-native-touch-id";
import Util from "../../Utils/Util";
import Config from "react-native-config";
import { Card } from "react-native-elements";
/*
 Use in this js
 */
import Skin from "../../../Skin";

/*
 INSTANCES
 */
const SCREEN_WIDTH = require("Dimensions").get("window").width;
const NotificationAction = {
  ACCEPT: "accept",
  REJECT: "reject",
  FRAUD: "fraud",
  CLICK: "click",
  HIDE: "hide",
  CHANGELANG: "changelang"
};

export default class NotificationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: this.props.notification.body,
      parseMessage: "",
      // acceptLabel : "",
      //  rejectLabel : "",
      //  fraudLabel : "",
      subject: "",
      //  languageKey : "",
      //  selectedlanguage : this.props.selectedlanguage,   //Deprecated
      isAirlinesMsg: false,
      isAirlinesBookingMsg: false,
      isOfferAcceptedAndCheckedInMsg: false,
      isCheckedInMsg: false,
      selectedLanguageBodyObjectIndex: 0
    };
    this.updateNotificationData();
    //this.convertUnicode = this.convertUnicode.bind(this);
  }
  componentDidMount() {
    // this.updateNotificationData();
  }

  componentDidUpdate() {
    //if(this.state.selectedlanguage != this.props.selectedlanguage)
    //this.state.selectedlanguage =  "Deutsch";
    //this.updateNotificationData();
  }

  componentWillReceiveProps(nextProps) {
    /*if(this.state.selectedlanguage == "") {
            this.state.mainMsg = nextProps.notification.message.body;
            if( Util.isJSON(this.state.mainMsg) ){       
                var mainMesg = JSON.parse(this.state.mainMsg);   
                this.state.languageKey = Object.keys(JSON.parse(this.state.mainMsg).lng);
                var lng = this.state.languageKey[0];            
                this.state.selectedlanguage = lng;
                this.state.subject = mainMesg.lng[lng].subject;
                this.state.acceptLabel = mainMesg.lng[lng].Accept;
                this.state.rejectLabel = mainMesg.lng[lng].Reject;
                if ( this.props.notification.action.length == 3 ) this.state.fraudLabel = mainMesg.lng[lng].Fraud;
                this.state.parseMessage = mainMesg.lng[lng].body;
            }else  {
                this.state.languageKey = [];
                this.singleLanguageMessage();
            }
        }*/

    // if(this.state.selectedlanguage == "") {
    this.state.body = nextProps.notification.body;
    var body = this.state.body; //Util.parseJSON(this.state.body);
    if (body && Array.isArray(body)) {
      if (nextProps.selectedLanguageBodyObjectIndex < body.length)
        this.state.selectedLanguageBodyObjectIndex =
          nextProps.selectedLanguageBodyObjectIndex;
      else this.state.selectedLanguageBodyObjectIndex = 0;

      //var mainMesg = JSON.parse(this.state.mainMsg);
      //this.state.languageKey = Object.keys(JSON.parse(this.state.mainMsg).lng);
      //var lng = this.state.languageKey[0];
      var selectedLanguageBodyObject =
        body[this.state.selectedLanguageBodyObjectIndex];
      // this.state.selectedlanguage = selectedLanguageBodyObject.lng;
      this.state.subject = Util.convertUnicode(selectedLanguageBodyObject.subject);
      // this.state.acceptLabel = mainMesg.lng[lng].Accept;
      // this.state.rejectLabel = mainMesg.lng[lng].Reject;
      // if ( this.props.notification.action.length == 3 ) this.state.fraudLabel = mainMesg.lng[lng].Fraud;
      this.state.parseMessage = Util.convertUnicode(selectedLanguageBodyObject.message);

      this.state.isAirlinesMsg = false;
      this.state.isAirlinesBookingMsg = false;
      this.state.isOfferAcceptedAndCheckedInMsg = false;
      this.state.isCheckedInMsg = false;

      if (body[0].subject === "Check In for CAL2411") {
        this.state.isAirlinesMsg = true;
      } else if (body[0].subject === "New Flight Reservation") {
        this.state.isAirlinesBookingMsg = true;
      } else if (body[0].subject === "Offer Accepted and Checked In") {
        this.state.isOfferAcceptedAndCheckedInMsg = true;
      } else if (body[0].subject === "Checked In") {
        this.state.isCheckedInMsg = true;
      }
    }

    // else  {
    //     this.state.languageKey = [];
    //     this.singleLanguageMessage();
    // }
    //}
  }

  updateNotificationData() {
    /* if(Util.isJSON(this.state.mainMsg) ){       
             this.state.languageKey = Object.keys(JSON.parse(this.state.mainMsg).lng);
             if( !Util.isEmpty(this.props.selectedlanguage) ) this.changeLanguage(this.props.selectedlanguage);
             else this.changeLanguage(this.state.languageKey[0]);
         }else{
             this.singleLanguageMessage(); 
         } */

    var body = this.state.body; //Util.parseJSON(this.state.body)
    if (body && Array.isArray(body)) {
      //this.state.languageKey = Object.keys(JSON.parse(this.state.mainMsg).lng);
      if (this.props.selectedLanguageBodyObjectIndex < body.length)
        this.changeLanguage(this.props.selectedLanguageBodyObjectIndex);
      else this.changeLanguage(0);

      this.state.isAirlinesMsg = false;
      this.state.isAirlinesBookingMsg = false;
      this.state.isOfferAcceptedAndCheckedInMsg = false;
      this.state.isCheckedInMsg = false;

      if (body[0].subject === "Check In for CAL2411") {
        this.state.isAirlinesMsg = true;
      } else if (body[0].subject === "New Flight Reservation") {
        this.state.isAirlinesBookingMsg = true;
      } else if (body[0].subject === "Offer Accepted and Checked In") {
        this.state.isOfferAcceptedAndCheckedInMsg = true;
      } else if (body[0].subject === "Checked In") {
        this.state.isCheckedInMsg = true;
      }

      // if(this.props.selectedLanguageBodyObjectIndex)
      // else this.changeLanguage(0);
    }

    // else{
    //     this.singleLanguageMessage();
    // }
  }

  // onNotificationLanguageChanged(){
  //     if( !this.props.showHideButton ) this.takeAction(null, null, NotificationAction.HIDE);
  // }

  takeAction(notification, btnLabel, action) {
    var bundle = {
      notification: notification,
      btnLabel: btnLabel,
      action: action,
      selectedLanguageBodyObjectIndex: this.state
        .selectedLanguageBodyObjectIndex //Todo :  update the key in onNotificationAction in ZeroNotification.js from selectedLanguage to selectedLanguageObjectIndex
    };
    Events.trigger("onNotificationAction", bundle);
  }

  //Deprecated
  /*singleLanguageMessage(){
        this.state.parseMessage = this.state.mainMsg;
        this.state.subject = this.props.notification.message.subject;
        this.state.acceptLabel = this.props.notification.action[0].label;
        this.state.rejectLabel = this.props.notification.action[1].label;
        if ( this.props.notification.action.length == 3 ) this.state.fraudLabel = this.props.notification.action[2].label;
    }*/

  changeLanguage(selectedLanguageBodyObjectIndex) {
    /*var mainMesg = JSON.parse(this.state.mainMsg);
        for ( let i = 0; i < this.state.languageKey.length; i++ ){
            if ( lng === this.state.languageKey[i] ) {
                this.state.selectedlanguage = lng;
                this.state.subject = mainMesg.lng[lng].subject;
                this.state.acceptLabel = mainMesg.lng[lng].Accept;
                this.state.rejectLabel = mainMesg.lng[lng].Reject;
                if ( this.props.notification.action.length == 3 ) this.state.fraudLabel = mainMesg.lng[lng].Fraud;
                this.state.parseMessage = mainMesg.lng[lng].body;
                this.setState({ parseMessage: mainMesg.lng[lng].body });
                break;
            }
        }*/

    var body = this.state.body; // Util.parseJSON(this.state.body);
    if (body && Array.isArray(body)) {
      //      for (let i = 0; i < body.length; i++){
      // if (selectedLanguageBodyObjectIndex === i) {
      var selectedLanguageBodyObject = body[selectedLanguageBodyObjectIndex];
      //  this.state.selectedlanguage = selectedLanguageBodyObject.lng;
      this.state.subject = Util.convertUnicode(selectedLanguageBodyObject.subject);
      //this.state.acceptLabel = mainMesg.lng[lng].Accept;
      //this.state.rejectLabel = mainMesg.lng[lng].Reject;
      //if (this.props.notification.action.length == 3) this.state.fraudLabel = mainMesg.lng[lng].Fraud;
      this.state.parseMessage = Util.convertUnicode(selectedLanguageBodyObject.message);
      this.state.selectedLanguageBodyObjectIndex = selectedLanguageBodyObjectIndex;
      this.setState({ parseMessage: selectedLanguageBodyObject.message });
      // break;
      // }
      // }
    }
  }

  render() {
    var bodyValue = this.state.parseMessage;
    var bodyarray = bodyValue.split("\n");
    var amount = bodyarray[3];
    var font = 22;

    var bulletList = [];
    var count;
    if (this.state.isAirlinesMsg) {
      count = bodyarray.length >= 4 ? 4 : bodyarray.length;
    } else if (
      this.state.isCheckedInMsg ||
      this.state.isOfferAcceptedAndCheckedInMsg
    ) {
      count = bodyarray.length >= 5 ? 5 : bodyarray.length;
    } else {
      count = bodyarray.length;
    }
    for (let i = 0; i < count; i++) {
      var bodyStr = bodyarray[i];
      bodyStr = Util.replaceString("<br/>", "\n", bodyStr);
      bulletList.push(
        <View key={i}>
          <View
            style={[style.row, { width: SCREEN_WIDTH - 62, paddingRight: 10 }]}
          >
            <Text style={style.dot}>{"\u2022"}</Text>
            <Text style={style.body}>{bodyStr}</Text>
          </View>
        </View>
      );
    }

    var lngButtons = [];
    /* for (let i = 0; i < this.state.languageKey.length && this.state.languageKey.length > 1; i++ ){
               lngButtons.push(
                   <TouchableHighlight style={[ this.state.selectedlanguage === this.state.languageKey[i] ? {backgroundColor : Skin.color.APPROVE_BUTTON_COLOR } : {backgroundColor : 'grey' }, {  height: 20, marginBottom: 5, marginTop: 5, marginRight: 5, alignSelf: 'center',  borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center' }]}
                                           onPress={() => {  
                                               this.changeLanguage(this.state.languageKey[i]); 
                                               //this.onNotificationLanguageChanged(); 
                                           } }>
                           <Text style={{color: Skin.color.WHITE, marginRight: 10, marginLeft: 10}}>
                           {this.state.languageKey[i]}
                           </Text>
                   </TouchableHighlight>
               )
         }*/

    //252E8B

    if (
      this.state.isAirlinesMsg ||
      this.state.isAirlinesBookingMsg ||
      this.state.isOfferAcceptedAndCheckedInMsg ||
      this.state.isCheckedInMsg
    ) {
      var body = this.state.body; //Util.parseJSON(this.state.body);
      for (let i = 0; body && i < body.length && body.length > 1; i++) {
        lngButtons.push(
          <TouchableHighlight
            style={[
              this.state.selectedLanguageBodyObjectIndex === i
                ? { backgroundColor: "#252E8B" }
                : { backgroundColor: "#315dce" },
              {
                height: 20,
                marginBottom: 10,
                marginRight: 5,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                alignItems: "center"
              }
            ]}
            onPress={() => {
              this.changeLanguage(i);
              this.takeAction(
                this.props.notification,
                null,
                NotificationAction.CHANGELANG
              );
              //this.onNotificationLanguageChanged();
            }}
          >
            <Text
              style={{
                color: Skin.color.WHITE,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              {body[i].lng}
            </Text>
          </TouchableHighlight>
        );
      }
    } else {
      var body = this.state.body; //Util.parseJSON(this.state.body);
      for (let i = 0; body && i < body.length && body.length > 1; i++) {
        lngButtons.push(
          <TouchableHighlight
            style={[
              this.state.selectedLanguageBodyObjectIndex === i
                ? { backgroundColor: Skin.color.APPROVE_BUTTON_COLOR }
                : { backgroundColor: "grey" },
              {
                height: 20,
                marginBottom: 10,
                marginRight: 5,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                alignItems: "center"
              }
            ]}
            onPress={() => {
              this.changeLanguage(i);
              this.takeAction(
                this.props.notification,
                null,
                NotificationAction.CHANGELANG
              );
              //this.onNotificationLanguageChanged();
            }}
          >
            <Text
              style={{
                color: Skin.color.WHITE,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              {body[i].lng}
            </Text>
          </TouchableHighlight>
        );
      }
    }

    if (typeof amount == "undefined") {
      amount = "";
    } else {
      if (amount.length > 0 && amount.length <= 5) {
      } else if (amount.length > 5 && amount.length <= 6) {
        if (SCREEN_WIDTH <= 320) {
          font = 17;
        } else {
          font = 19;
        }
      } else if (amount.length >= 7 && amount.length <= 8) {
        if (SCREEN_WIDTH <= 320) {
          font = 14;
        } else {
          font = 17;
        }
      } else if (amount.length >= 8 && amount.length <= 10) {
        if (SCREEN_WIDTH <= 320) {
          font = 11;
        } else {
          font = 13;
        }
      } else {
        if (SCREEN_WIDTH <= 320) {
          font = 9;
        } else {
          font = 11;
        }
      }
    }

    var expiry_timestamp = this.props.notification.expiry_timestamp;
    var timestamp = expiry_timestamp.split("EDT");
    var finaltimestamp = timestamp[0].split("T");
    var date = finaltimestamp[0].split("-");
    var time = finaltimestamp[1].split(":");

    var year = date[0].substring(2, 4);

    var dateFormat = require("dateformat"); //www.npmjs.com/package/dateformat
    var validdate = new Date();
    validdate.setFullYear(parseInt(date[0]));
    validdate.setMonth(parseInt(date[1]) - 1); // months indexed as 0-11, substract 1
    validdate.setDate(parseInt(date[2]));
    validdate.setHours(parseInt(time[0]));
    validdate.setMinutes(parseInt(time[1]));
    validdate.setSeconds(parseInt(time[2]));

    /*

                                <View style={[style.col, { marginTop: 4 }]}>

                                    { bulletList }
              
                                    <View style={style.row}>
                                        <Text style={style.bold}>
                                            {amount}
                                        </Text>
                                    </View>
                                </View>
        */

    //Todo : this.props.notification.action or this.props.notification.actions

    if (
      (this.state.isCheckedInMsg ||
        this.state.isOfferAcceptedAndCheckedInMsg) &&
      this.props.isAirlines
    ) {
      //var departureFrom, departureTime, arrivalTo, arrivalTime, seatNumber, upgraded, title1, title2, window, windowData, arrInfo, info;

      try {
        var msg = bodyarray[0]; //this.state.isCheckedInMsg?"Thank you for checking in.":"Thank you for accepting your personalized upgrade offer. Your upgrade is confirmed and your credit card on file was charged.";
        var flightNoMsg = bodyarray[1];
        var departureFrom = bodyarray[2].split(":")[1].split("on")[0];
        var departureTime = bodyarray[2].split(":")[1].split("on")[1];
        var arrivalTo = bodyarray[3].split(":")[1].split("on")[0];
        var arrivalTime = bodyarray[3].split(":")[1].split("on")[1];
        var seatNumber = bodyarray[4].split(":")[1].trim(); //this.state.isCheckedInMsg?"24A":"6A";
        var window = bodyarray[5]; //this.state.isCheckedInMsg?"Window Economy":"Window Business";
        var boardingPassMsg = bodyarray[6];
        var boardingPassButtonLabel = bodyarray[7];

        /*
                departureFrom = bodyarray[0].split(":")[1].split("on")[0];
                departureTime = bodyarray[0].split(":")[1].split("on")[1];
                arrivalTo = bodyarray[1].split(":")[1].split("on")[0];
                arrivalTime = bodyarray[1].split(":")[1].split("on")[1];
                seatNumber = bodyarray[3].match(/\(.* (.*)\)/)[1];
                upgraded = bodyarray[3].split(":")[1];

                title1 = bodyarray[4];
                title2 = bodyarray[5];
                //var title3 = bodyarray[6];
                window = bodyarray[6];
                windowData = bodyarray[7];
                arrInfo = this.state.subject.split(" ");
                info = arrInfo[arrInfo.length - 1];*/
      } catch (e) {
        alert(e);
      }

      return (
        <View style={{ flex: 1, backgroundColor: "#ecf0f1" }}>
          <ScrollView
            style={[
              style.container_notification,
              { backgroundColor: "transparent" }
            ]}
            contentContainer={{ flex: 1, backgroundColor: "transparent" }}
          >
            <TouchableWithoutFeedback>
              <View style={style.container_notification}>
                <Card
                  style={style.upgrade}
                  title=""
                  containerStyle={{ margin: 10 }}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <View style={[style.user, { flex: 1 }]}>
                      <Text
                        style={[
                          style.upd_text,
                          { flex: 1, textAlign: "center" }
                        ]}
                      >
                        {
                          msg /*"Thank you for checking in"/*"Thank you for accepting your personalized upgrade offer. Your upgrade is confirmed and your credit card on file was charged"/*upgraded*/
                        }
                      </Text>
                    </View>
                  </View>
                </Card>

                <Card
                  style={style.upgrade}
                  title={flightNoMsg}
                  containerStyle={{ margin: 10 }}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <View key={1} style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        {departureFrom}
                      </Text>
                      <Image
                        style={[style.image, { alignSelf: "center" }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                      />
                      <Text
                        style={[
                          style.name,
                          { marginRight: 3, width: 90, textAlign: "center" }
                        ]}
                      >
                        {departureTime}
                      </Text>
                    </View>

                    <View style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        {arrivalTo}
                      </Text>
                      <Image
                        style={[style.image, { alignSelf: "center" }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                      />
                      <Text
                        style={[
                          style.name,
                          { marginRight: 3, width: 90, textAlign: "center" }
                        ]}
                      >
                        {arrivalTime}
                      </Text>
                    </View>

                    <View style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        {seatNumber}
                      </Text>
                      {this.state.isCheckedInMsg && (
                        <Image
                          style={[style.image, { alignSelf: "center" }]}
                          resizeMode="cover"
                          source={require("../../../img/search.png")}
                        />
                      )}
                      {this.state.isOfferAcceptedAndCheckedInMsg && (
                        <Image
                          style={[style.image, { alignSelf: "center" }]}
                          resizeMode="cover"
                          source={require("../../../img/search.png")}
                        />
                      )}
                      <Text
                        style={[style.name, { width: 70, textAlign: "center" }]}
                      >
                        {window}
                      </Text>
                    </View>
                  </View>
                </Card>

                <Card
                  style={style.upgrade}
                  title=""
                  containerStyle={{ margin: 10 }}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <View style={style.user}>
                      <Text style={[style.upd_text]}>
                        {
                          boardingPassMsg /*"Your boarding pass is available under the 'Boarding Pass' tab in the app"*/
                        }
                      </Text>
                    </View>
                  </View>

                  <View style={[style.cards, { alignSelf: "center" }]}>
                    <TouchableHighlight
                      style={[
                        {
                          width: "100%",
                          marginLeft: 0,
                          marginTop: 20,
                          backgroundColor: "#252E8B",
                          alignItems: "center",
                          justifyContent: "center"
                        }
                      ]}
                      onPress={() => {
                         this.takeAction(this.props.notification, this.props.notification.actions[0].label, this.props.notification.actions[0].action)
                      }}
                    >
                      <Text
                        style={{
                          color: Skin.color.WHITE,
                          marginRight: 10,
                          marginLeft: 10,
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10
                        }}
                      >
                        {
                          body[this.state.selectedLanguageBodyObjectIndex].label[this.props.notification.actions[0].label]/*"Show Me My Boarding Pass"*/
                        }
                      </Text>
                    </TouchableHighlight>
                  </View>
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          <View style={style.lngRow}>{lngButtons}</View>
          {this.props.showHideButton && (
            <TouchableHighlight
              style={{
                height: 20,
                marginBottom: 10,
                width: 40,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "grey",
                alignItems: "center"
              }}
              onPress={() => {
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.HIDE
                );
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "normal",
                  fontFamily: Skin.font.ICON_FONT,
                  transform: [{ rotate: "270deg" }]
                }}
              >
                {Skin.icon.forward}
              </Text>
            </TouchableHighlight>
          )}
        </View>
      );
    } else if (this.state.isAirlinesMsg && this.props.isAirlines) {
      var departureFrom,
        departureTime,
        arrivalTo,
        arrivalTime,
        seatNumber,
        upgraded,
        title1,
        title2,
        window,
        windowData,
        arrInfo,
        info;

      try {
        departureFrom = bodyarray[0].split(":")[1].split("on")[0].trim();
        departureTime = bodyarray[0].split(":")[1].split("on")[1].trim();
        arrivalTo = bodyarray[1].split(":")[1].split("on")[0].trim();
        arrivalTime = bodyarray[1].split(":")[1].split("on")[1].trim();
        seatNumber = bodyarray[3].match(/\(.* (.*)\)/)[1].trim();
        upgraded = bodyarray[3].split(":")[1].trim();

        title1 = bodyarray[4].trim();
        title2 = bodyarray[5].trim();
        //var title3 = bodyarray[6];
        window = bodyarray[6].trim();
        windowData = bodyarray[7];
        arrInfo = this.state.subject.split(" ");
        info = arrInfo[arrInfo.length - 1].trim();
      } catch (e) {
        alert(e);
      }

      return (
        <View style={{ flex: 1, backgroundColor: "#ecf0f1" }}>
          <ScrollView
            style={[
              style.container_notification,
              { backgroundColor: "transparent" }
            ]}
            contentContainer={{ flex: 1, backgroundColor: "transparent" }}
          >
            <TouchableWithoutFeedback>
              <View style={style.container_notification}>
                <Text style={style.paragraph}>{this.state.subject}</Text>
                <Card
                  style={style.upgrade}
                  title=""
                  containerStyle={{ margin: 10 }}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <View key={1} style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        {departureFrom}
                      </Text>
                      <Image
                        style={[style.image, { alignSelf: "center" }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                      />
                      <Text
                        style={[
                          style.name,
                          { marginRight: 3, width: 90, textAlign: "center" }
                        ]}
                      >
                        {departureTime}
                      </Text>
                    </View>

                    <View style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        {arrivalTo}
                      </Text>
                      <Image
                        style={[style.image, { alignSelf: "center" }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                      />
                      <Text
                        style={[
                          style.name,
                          { marginRight: 3, width: 90, textAlign: "center" }
                        ]}
                      >
                        {arrivalTime}
                      </Text>
                    </View>

                    <View style={style.user}>
                      <Text style={[style.upd_text, { textAlign: "center" }]}>
                        24A
                      </Text>
                      <Image
                        style={[style.image, { alignSelf: "center" }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                      />
                      <Text
                        style={[style.name, { width: 70, textAlign: "center" }]}
                      >
                        {window}
                      </Text>
                    </View>
                  </View>
                </Card>

                <Card
                  style={style.upgrade}
                  containerStyle={{ margin: 10 }}
                  title={title1}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <View style={[style.user, { flex: 1, alignSelf: 'center', marginRight: 20 }]}>
                      <Image
                         style={[style.image, { alignSelf: 'center' }]}
                        resizeMode="cover"
                        source={require("../../../img/search.png")}
                        />
                      <Text style={[style.upd_text, { alignSelf: 'center' }]}>SEAT:{seatNumber}{'\n'}</Text>
                    </View>

                    <View style={style.user}>
                      <Text style={[style.upd_text, { width: 200 }]}>
                        {upgraded}
                      </Text>
                      <TouchableHighlight
                        style={[
                          {
                            marginTop: 5,
                            backgroundColor: "#252E8B",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 40
                          }
                        ]}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[1].label,
                            this.props.notification.actions[1].action
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: Skin.color.WHITE,
                            marginRight: 10,
                            alignSelf: "center",
                            textAlign: "center",
                            marginLeft: 10,
                            width: 180
                          }}
                        >
                          {
                            body[this.state.selectedLanguageBodyObjectIndex]
                              .label[this.props.notification.actions[1].label]
                          }
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Card>

                <Card
                  style={style.upgrade}
                  title={title2}
                  containerStyle={{ margin: 10 }}
                  titleStyle={style.titleStyle}
                >
                  <View style={style.cards}>
                    <TouchableHighlight
                      style={[
                        {
                          width: "46%",
                          marginLeft: 0,
                          backgroundColor: "#252E8B",
                          justifyContent: "center"
                        }
                      ]}
                      onPress={() => {
                        this.takeAction(
                          this.props.notification,
                          this.props.notification.actions[0].label,
                          this.props.notification.actions[0].action
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: Skin.color.WHITE,
                          marginRight: 10,
                          alignSelf: "center",
                          marginLeft: 10,
                          padding: 10
                        }}
                      >
                        {
                          body[this.state.selectedLanguageBodyObjectIndex]
                            .label[this.props.notification.actions[0].label]
                        }
                      </Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={[
                        {
                          width: "46%",
                          marginLeft: 0,
                          backgroundColor: "#252E8B",
                          alignItems: "center",
                          justifyContent: "center"
                        }
                      ]}
                      onPress={() => {
                        this.takeAction(
                          this.props.notification,
                          this.props.notification.actions[2].label,
                          this.props.notification.actions[2].action
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: Skin.color.WHITE,
                          marginRight: 10,
                          marginLeft: 10,
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10
                        }}
                      >
                        {
                          body[this.state.selectedLanguageBodyObjectIndex]
                            .label[this.props.notification.actions[2].label]
                        }
                      </Text>
                    </TouchableHighlight>
                  </View>
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          <View style={style.lngRow}>{lngButtons}</View>
          {this.props.showHideButton && (
            <TouchableHighlight
              style={{
                height: 20,
                marginBottom: 10,
                width: 40,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "grey",
                alignItems: "center"
              }}
              onPress={() => {
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.HIDE
                );
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "normal",
                  fontFamily: Skin.font.ICON_FONT,
                  transform: [{ rotate: "270deg" }]
                }}
              >
                {Skin.icon.forward}
              </Text>
            </TouchableHighlight>
          )}
        </View>
      );
    } else if (this.state.isAirlinesBookingMsg && this.props.isAirlines) {
      var departureFrom, departureTime, arrivalTo, arrivalTime, window;

      try {
        departureFrom = bodyarray[0].split(":")[1].split("on")[0].trim();
        departureTime = bodyarray[0].split(":")[1].split("on")[1].trim();
        arrivalTo = bodyarray[1].split(":")[1].split("on")[0].trim();
        arrivalTime = bodyarray[1].split(":")[1].split("on")[1].trim();

        //var title3 = bodyarray[6];
        //window = bodyarray[6];
      } catch (e) {
        alert(e);
      }

      return (
        <View style={{ flex: 1, backgroundColor: "#ecf0f1" }}>
          <ScrollView
            style={[style.container_notification]}
            contentContainer={{ flex: 1, backgroundColor: "transparent" }}
          >
            <View style={style.container_notification}>
              <Text style={style.paragraph}>{this.state.subject}</Text>
              <Card
                style={style.upgrade}
                title=""
                containerStyle={{ margin: 10 }}
                titleStyle={style.titleStyle}
              >
                <View style={style.cards}>
                  <View key={1} style={style.user}>
                    <Text style={[style.upd_text,{textAlign:'center'}]}>{departureFrom}</Text>
                    <Image
                      style={[style.image, { alignSelf: "center" }]}
                      resizeMode="cover"
                      source={require("../../../img/search.png")}
                    />
                    <Text style={[style.name, { marginRight: 3, width: 90,textAlign: "center" }]}>
                      {departureTime}
                    </Text>
                  </View>

                  <View style={style.user}>
                    <Text style={[style.upd_text, { textAlign: "center" }]}>{arrivalTo}</Text>
                    <Image
                      style={[style.image, { alignSelf: "center" }]}
                      resizeMode="cover"
                      source={require("../../../img/search.png")}
                    />
                    <Text style={[style.name, { marginRight: 3, width: 90,textAlign: "center" }]}>
                      {arrivalTime}
                    </Text>
                  </View>

                  <View style={style.user}>
                    <Text style={[style.upd_text, { textAlign: "center" }]}>24A</Text>
                    <Image
                      style={[style.image, { alignSelf: "center" }]}
                      resizeMode="cover"
                      source={require("../../../img/search.png")}
                    />
                    <Text style={[style.name, { width: 70,textAlign: "center" }]}>
                      Window Economy
                    </Text>
                  </View>
                </View>
              </Card>

              <Card
                style={style.upgrade}
                containerStyle={{ margin: 10 }}
                title={title1}
                titleStyle={style.titleStyle}
              >
                <View style={style.cards}>
                  <View style={style.user}>
                    <Text style={[style.upd_text]}>{bodyarray[2]}</Text>
                    <Text style={[style.upd_text]} />
                    <Text style={[style.upd_text]}>{bodyarray[3]}</Text>
                  </View>
                </View>
              </Card>
            </View>
          </ScrollView>

          {/* {this.props.expand && <View style={{ flex: 1 }} />} */}

          {this.props.showButtons && (
            <View style={[style.row, { marginTop: 8 }]}>
              <View style={[style.notificationButtonHorizontal,{marginRight:10,marginLeft:10}]}>
                <TouchableHighlight
                  style={style.confirmbutton}
                  onPress={() => {
                    this.takeAction(
                      this.props.notification,
                      this.props.notification.actions[0].label,
                      this.props.notification.actions[0].action
                    );
                  }}
                >
                  <View style={style.text}>
                    <Text style={style.buttontext}>
                      {
                        body[this.state.selectedLanguageBodyObjectIndex].label[
                          this.props.notification.actions[0].label
                        ]
                      }
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={style.denybutton}
                  onPress={() => {
                    this.takeAction(
                      this.props.notification,
                      this.props.notification.actions[1].label,
                      this.props.notification.actions[1].action
                    );
                  }}
                >
                  <View style={style.text}>
                    <Text style={style.buttontext}>
                      {
                        body[this.state.selectedLanguageBodyObjectIndex].label[
                          this.props.notification.actions[1].label
                        ]
                      }
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={style.fraudbutton}
                  onPress={() => {
                    this.takeAction(
                      this.props.notification,
                      this.props.notification.actions[2].label,
                      this.props.notification.actions[2].action
                    );
                  }}
                >
                  <View style={style.text}>
                    <Text style={style.buttontext}>
                      {
                        body[this.state.selectedLanguageBodyObjectIndex].label[
                          this.props.notification.actions[2].label
                        ]
                      }
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          )}
          <View style={style.lngRow}>
            {lngButtons}
            {/* <TouchableHighlight style={[ this.state.selectedlanguage === "en" ? {backgroundColor : Skin.color.APPROVE_BUTTON_COLOR } : {backgroundColor : 'grey' }, {  height: 20, marginBottom: 5, marginTop: 5, marginRight: 5, alignSelf: 'center',  borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center' }]}
                                        onPress={() => {  this.state.languageKey[0] } }>
                                        <Text style={{color: Skin.color.WHITE, marginRight: 10, marginLeft: 10}}>
                                            English
                                        </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[ this.state.selectedlanguage === "gr" ? {backgroundColor : Skin.color.APPROVE_BUTTON_COLOR } : {backgroundColor : 'grey' }, {  height: 20, marginBottom: 5, marginTop: 5, marginRight: 5, alignSelf: 'center',  borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center' }]}
                                        onPress={() => {  this.state.languageKey[1] } }>
                                        <Text style={{color: Skin.color.WHITE, marginRight: 10, marginLeft: 10}}>
                                            Deutsch
                                        </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[ this.state.selectedlanguage === "fr" ? {backgroundColor : Skin.color.APPROVE_BUTTON_COLOR } : {backgroundColor : 'grey' }, {  height: 20, marginBottom: 5, marginTop: 5, marginRight: 5, alignSelf: 'center',  borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, alignItems: 'center' }]}
                                        onPress={() => {  this.state.languageKey[2] } }>
                                        <Text style={{color: Skin.color.WHITE, marginRight: 10, marginLeft: 10}}>
                                            Français
                                        </Text>
                                    </TouchableHighlight> */}
          </View>
          {this.props.showHideButton && (
            <TouchableHighlight
              style={{
                height: 20,
                marginBottom: 10,
                width: 40,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "grey",
                alignItems: "center"
              }}
              onPress={() => {
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.HIDE
                );
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "normal",
                  fontFamily: Skin.font.ICON_FONT,
                  transform: [{ rotate: "270deg" }]
                }}
              >
                {Skin.icon.forward}
              </Text>
            </TouchableHighlight>
          )}
        </View>
      );
    } else if (this.props.notification.actions.length == 3) {
      return (
        <View style={[{ flex: 1 }]}>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              if (!this.props.showButtons)
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.CLICK
                );
            }}
          >
            <View
              style={[
                style.customerow,
                this.props.expand && !this.props.showHideButton
                  ? { marginBottom: 10 }
                  : {},
                !this.props.showButtons ? { paddingBottom: 8 } : {}
              ]}
            >
              <View style={[style.col, { flex: 1 }]}>
                <View style={style.row}>
                  <Text style={style.subject}>{this.state.subject}</Text>
                  <Text style={style.time}>
                    {Util.getFormatedDate(this.props.notification.create_ts)}
                  </Text>
                </View>

                <View style={[style.col, { marginTop: 4, flex: 500 }]}>
                  {bulletList}
                </View>

                {this.props.expand && <View style={{ flex: 1 }} />}

                {this.props.showButtons && (
                  <View style={[style.row, { marginTop: 8 }]}>
                    <View style={style.notificationButtonHorizontal}>
                      <TouchableHighlight
                        style={style.confirmbutton}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[0].label,
                            this.props.notification.actions[0].action
                          );
                        }}
                      >
                        <View style={style.text}>
                          <Text style={style.buttontext}>
                            {
                              body[this.state.selectedLanguageBodyObjectIndex]
                                .label[this.props.notification.actions[0].label]
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={style.denybutton}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[1].label,
                            this.props.notification.actions[1].action
                          );
                        }}
                      >
                        <View style={style.text}>
                          <Text style={style.buttontext}>
                            {
                              body[this.state.selectedLanguageBodyObjectIndex]
                                .label[this.props.notification.actions[1].label]
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={style.fraudbutton}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[2].label,
                            this.props.notification.actions[2].action
                          );
                        }}
                      >
                        <View style={style.text}>
                          <Text style={style.buttontext}>
                            {
                              body[this.state.selectedLanguageBodyObjectIndex]
                                .label[this.props.notification.actions[2].label]
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                )}
                {!this.props.isAirlines && (
                  <View style={style.lngRow}>{lngButtons}</View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>

          {this.props.isAirlines && (
            <View style={style.lngRow}>{lngButtons}</View>
          )}
          {this.props.showHideButton && (
            <TouchableHighlight
              style={{
                height: 20,
                marginBottom: 10,
                width: 40,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "grey",
                alignItems: "center"
              }}
              onPress={() => {
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.HIDE
                );
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "normal",
                  fontFamily: Skin.font.ICON_FONT,
                  transform: [{ rotate: "270deg" }]
                }}
              >
                {Skin.icon.forward}
              </Text>
            </TouchableHighlight>
          )}
        </View>
      );
    } else {
      return (
        <View style={[{ flex: 1 }]}>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              if (!this.props.showButtons)
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.CLICK
                );
            }}
          >
            <View
              style={[
                style.customerow,
                this.props.expand && !this.props.showHideButton
                  ? { marginBottom: 10 }
                  : {},
                !this.props.showButtons ? { paddingBottom: 8 } : {}
              ]}
            >
              <View style={[style.col, { flex: 1 }]}>
                <View style={style.row}>
                  <Text style={style.subject}>{this.state.subject}</Text>
                  <Text style={style.time}>
                    {Util.getFormatedDate(this.props.notification.create_ts)}
                  </Text>
                </View>

                <View style={[style.col, { marginTop: 4 }]}>{bulletList}</View>

                {this.props.expand && <View style={{ flex: 1 }} />}

                {this.props.showButtons && (
                  <View style={[style.row, { marginTop: 8 }]}>
                    <View style={style.notificationButtonHorizontal}>
                      <TouchableHighlight
                        style={style.approvebutton}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[0].label,
                            this.props.notification.actions[0].action
                          );
                        }}
                      >
                        <View style={style.text}>
                          <Text style={style.buttontext}>
                            {
                              body[this.state.selectedLanguageBodyObjectIndex]
                                .label[this.props.notification.actions[0].label]
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={style.rejectbutton}
                        onPress={() => {
                          this.takeAction(
                            this.props.notification,
                            this.props.notification.actions[1].label,
                            this.props.notification.actions[1].action
                          );
                        }}
                      >
                        <View style={style.text}>
                          <Text style={style.buttontext}>
                            {
                              body[this.state.selectedLanguageBodyObjectIndex]
                                .label[this.props.notification.actions[1].label]
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                )}
                {!this.props.isAirlines && (
                  <View style={style.lngRow}>{lngButtons}</View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {this.props.isAirlines && (
            <View style={style.lngRow}>{lngButtons}</View>
          )}
          {this.props.showHideButton && (
            <TouchableHighlight
              style={{
                height: 20,
                marginBottom: 10,
                width: 40,
                alignSelf: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: "grey",
                alignItems: "center"
              }}
              onPress={() => {
                this.takeAction(
                  this.props.notification,
                  null,
                  NotificationAction.HIDE
                );
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "normal",
                  fontFamily: Skin.font.ICON_FONT,
                  transform: [{ rotate: "270deg" }]
                }}
              >
                {Skin.icon.forward}
              </Text>
            </TouchableHighlight>
          )}
        </View>
      );
    }
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
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    alignSelf: "center"
  },
  lngRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10
  },
  rowMultiLang: {
    flexDirection: "row"
  },
  col: {
    flexDirection: "column"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    height: 200,
    width: 300
  },
  notificationButtonHorizontal: {
    backgroundColor: "transparent",
    height: 50,
    flex: 1,
    flexDirection: "row",
    marginBottom: 10
  },
  notificationButtonVertical: {
    backgroundColor: "transparent",
    height: 100,
    flex: 1,
    flexDirection: "column"
  },
  amountrow: {
    flexDirection: "row",
    width: SCREEN_WIDTH - 32
  },
  text: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: Skin.BLACK_TEXT_COLOR,
    width: 188,
    flex: 3,
    textAlign: "left",
    opacity: 1,
    backgroundColor: "transparent"
  },
  time: {
    fontSize: 16,
    color: Skin.BLACK_TEXT_COLOR,
    textAlign: "right",
    opacity: 0.6,
    flex: 2,
    backgroundColor: "transparent"
    //width: SCREEN_WIDTH - 230,
  },
  body: {
    fontSize: 16,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  dot: {
    fontSize: 16,
    width: 15,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  body2: {
    fontSize: 16,
    marginRight: 32,
    width: SCREEN_WIDTH - 71,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 0.6
  },
  bold: {
    fontSize: 22,
    width: SCREEN_WIDTH - 32 - 48,
    color: Skin.BLACK_TEXT_COLOR,
    opacity: 1,
    textAlign: "right",
    fontWeight: "bold"
  },
  amountContainer: {
    justifyContent: "flex-end",
    flex: 3
  },
  htmlstyle: {
    fontSize: 20,
    color: Skin.BLACK_TEXT_COLOR,
    width: SCREEN_WIDTH - 32,
    opacity: 1
  },

  buttontext: {
    fontSize: SCREEN_WIDTH <= 320 ? 18 : 20,
    color: Skin.color.WHITE,
    textAlign: "center",
    opacity: 1
  },
  confirmbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.APPROVE_BUTTON_COLOR
  },
  denybutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.REJECT_BUTTON_COLOR
  },
  fraudbutton: {
    /* width:(SCREEN_WIDTH-32)/3,
         
         height:56,*/
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.FRAUD_BUTTON_COLOR
  },
  approvebutton: {
    /* width:(SCREEN_WIDTH-32)/2,
         height:56, */
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.APPROVE_BUTTON_COLOR
  },
  rejectbutton: {
    /*width:(SCREEN_WIDTH-32)/2,
        height:56, */
    flex: 1,
    margin: 2,
    backgroundColor: Skin.color.REJECT_BUTTON_COLOR
  },
  upd_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e"
  },
  container_notification: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#ecf0f1"
  },

  cards: {
    flexDirection: "row",
    color: "#34495e",
    justifyContent: "space-between"
  },
  name: {
    color: "#34495e",
    fontSize: 14
  },
  paragraph: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  upgrade: {
    flexDirection: "row",
    color: "#34495e",
    fontSize: 8,
    margin: 5,
    justifyContent: "space-between"
  },
  titleStyle: {
    fontSize: 14
  },
  langimage: {
    marginLeft: 30
  },
  image: {
    height: 50,
    width: 50
  }
});
