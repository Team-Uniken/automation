/**
 *  Password verification screen. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNative, { Text, TextInput, View, Animated, TouchableOpacity, InteractionManager, AsyncStorage, Platform, AlertIOS, ScrollView, BackHandler, StatusBar, KeyboardAvoidingView } from 'react-native'
const dismissKeyboard = require('dismissKeyboard')

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';
import OpenLinks from '../OpenLinks';
import Util from "../Utils/Util";

/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCES
 */
let responseJson;
let chlngJson;
let nextChlngName;
let obj;


class VerifyAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPassword: '',
      showCloseButton: false
    };
    this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
  }
  /*
This is life cycle method of the react native component.
This method is called when the component is Mounted/Loaded.
*/
  componentDidMount() {
    obj = this;
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }
  
  /*
    This method is used to get the users entered value and submit the same as a challenge response.
  */
 checkVerify() {
   
    //   responseJson = this.props.url.chlngJson//this.props.url.chlngJson;
    //   responseJson.chlng_resp[0].response = pw;
    //   Events.trigger('showNextChallenge', {
    //     response: responseJson
    //   });

    var responseJson = this.props.url.chlngJson;
       
    responseJson.chlng_resp[0].response = 'true';
    Events.trigger('showNextChallenge', { response: responseJson });
            
     
    
  }
  //trigger the event forgotPassowrd to call forgotPassowrd api.
  onForgotPasswordClick() {
    Events.trigger("forgotPassowrd");
  }


  containerTouched(event) {
    dismissKeyboard();
    return false;
  }
  //show previous challenge on click of cross button or android back button /or/ onBack came in props .
  close() {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
      let responseJson = this.props.url.chlngJson;
      Events.trigger('showPreviousChallenge');
    }
  }

  /*
    This method is used to render the componenet with all its element.
  */
    render() {
        return (
            <MainActivation>
                <View style={[Skin.layout0.wrap.container, { flex: 1 }]} onStartShouldSetResponder={this.containerTouched.bind(this)}>
                    <StatusBar
                        style={Skin.layout1.statusbar}
                        backgroundColor={Skin.main.STATUS_BAR_BG}
                        barStyle={'default'} />


                    <View style={[Skin.layout1.wrap, { flex: 1 }, { justifyContent: 'center' }]}>
                        <View style={Skin.layout1.title.wrap}>
                            <Title onClose={() => {
                                this.close();
                            }}>Enroll Device
              </Title>
                        </View>
                        <View style={Skin.layout1.content.wrap}>
                            <View style={Skin.layout0.top.container}>
                                <Text style={[Skin.layout0.top.icon]}>
                                    {Skin.icon.logo}
                                </Text>
                                <Text style={[Skin.layout1.content.top.text, { marginBottom: 8 }]}>Your username is</Text>
                                <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR, marginBottom: 20 }]}>swapnil.gavali@uniken.com</Text>
                                <Text style={[Skin.layout1.content.top.text, { marginBottom: 8, fontSize: 18 }]}>Please approve enrollment of this {"\n"} device on your previously enrolled device</Text>
                            </View>
                            <View style={[Skin.layout0.bottom.container, { marginTop: 20 }]}>

                                <Button
                                    label='Proceed'
                                    style={{ marginBottom: 50 }}
                                    onPress={this.checkVerify.bind(this)} />

                                <Text style={[Skin.layout1.content.top.text, { marginBottom: 8, fontSize: 15 }]}>Don't have your enrolled device?</Text>
                                <Text style={[Skin.baseline.text_link_no_underline, { fontSize: 15 }]}
                                    onPress={this.onForgotPasswordClick}>Click here to enroll device by verifying your identity</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </MainActivation>
        );
    }
}

module.exports = VerifyAuth;
