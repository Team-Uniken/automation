/**
 *  check status of entered user if everything is right it navigate it forword else return appropriate error message
 */

'use strict';

/*
 ALWAYS NEED
 */ 
import React, { Component, } from 'react';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Config from 'react-native-config';
import Finger from 'react-native-touch-id-android';

import { Text, View, Animated, InteractionManager, AsyncStorage, Platform, BackHandler, StatusBar, KeyboardAvoidingView } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import Load from '../../Scenes/Load';
import Util from '../Utils/Util'
import MainActivation from '../Container/MainActivation';
const constant = require('../Utils/Constants');
/*
 Custome View
 */
import Button from '../view/button';
import Input from '../view/input';
import Title from '../view/title';

import { NavigationActions } from 'react-navigation';
/*
 INSTANCES
 */
let responseJson;
let obj;
let savedUserName;


class ActivationCodeNoQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      inputUsername: '',
      inputPassword: '',
      login_button_text: 'Login',
      loginAttempts: 5,
      passAttempts: 5,
//      challenge: this.props.url.chlngJson,
      failureMessage: '',
      isLoaderVisible: false,
      activatonCode: '',
    };
  }


  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    obj = this;
  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    constant.USER_T0 = "YES";
    obj = this;
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }


  /*
   This method is used to get the user entered value and submit the same as a challenge response.
   */
  checkActivationCode() {
    dismissKeyboard();
    let vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      this.setState({ activatonCode: '' });
      this.state.isPoped = true;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Activation Code');
    }
  }

  onActivationCodeChange(e) {
    this.setState({ activatonCode: e.nativeEvent.text });
  }

  // clear text of inputBox
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  
  
  //use to clear twoFactorAuthMachine navigator
  close() {
    dismissKeyboard();
//    Events.trigger('closeStateMachine');
    let responseJson = this.props.url.chlngJson;
    Events.trigger('showPreviousChallenge');
//    this.props.navigator.navigate('WelcomeScreen',{url: {
//      "chlngJson": this.props.navigator.state.params.url.chlngJson,
//      "screenId": this.props.navigator.state.params.url.screenId
//      }})
  }
  /*
   This method is used to render the componenet with all its element.
   */
  render() {
    
    return <MainActivation>
        <View style={Skin.layout0.wrap.container}>
          <View style={[Skin.layout1.wrap, { flex: 1 }, { justifyContent: "center", backgroundColor: "transparent" }]}>
            <View style={[Skin.layout1.title.wrap, { position: "absolute", top: 0, backgroundColor: "transparent" }]}>
              <StatusBar style={Skin.layout1.statusbar} backgroundColor={Skin.main.STATUS_BAR_BG} barStyle={"default"} />
              <Title onClose={() => {
                  this.close();
                }} />
            </View>
            <View style={[Skin.layout0.wrap.container, { position: "absolute", zIndex: 99, flex: 1, height: Skin.SCREEN_HEIGHT, top: 0, alignSelf: "center", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: 0 }, Platform.OS === "ios" ? { paddingTop: 20 } : {}]}>
              <Text style={[Skin.layout0.top.icon]}>{Skin.icon.logo}</Text>
              <View >
                <Text style={[Skin.layout0.top.subtitle]}>
                  {Config.USERNAME_LABEL}
                </Text>
                <Text
                  style={[
                    Skin.layout0.top.subtitle,
                    { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR }
                  ]}
                >
                  {Main.dnaUserName}
                </Text>
              </View>
              <Text style={Skin.layout0.top.subtitle}>
                {Skin.text["2"]["1"].subtitle}
              </Text>
              <Text style={Skin.layout0.top.prompt}>
                {Skin.text["2"]["1"].prompt}
              </Text>
              <Text style={[Skin.layout0.top.subtitle,{marginBottom:10}]}>
                Verification Key :{" "}
                {this.props.url.chlngJson.chlng_resp[0].challenge}
              </Text>
              <Text
                style={[
                  Skin.layout0.top.attempt,
                  { marginBottom: 10, marginTop: 0 }
                ]}
              >
              Activation code has been sent {"\n"}on your registered mobile number.
              </Text>
              <Input ref="inputUsername" returnKeyType={"next"} keyboardType={"default"} placeholder={"Enter Activation Code"} autoFocus={true} autoCorrect={false} secureTextEntry={true} autoCapitalize={false} autoComplete={false} value={this.state.activatonCode} onSubmitEditing={this.checkActivationCode.bind(this)} onChange={this.onActivationCodeChange.bind(this)} />
              <Button label={Skin.text["2"]["1"].submit_button} onPress={this.checkActivationCode.bind(this)} />
              <Text
                style={[
                  
                  { marginBottom: 0, marginTop: -20 }
                ]}
              >
                Attempts left {this.props.url.chlngJson.attempts_left}
              </Text>
              <KeyboardSpacer topSpacing={100} />
            </View>
          </View>
        </View>
      </MainActivation>;
  }
}

module.exports = ActivationCodeNoQR;



