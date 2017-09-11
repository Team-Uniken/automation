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

import { Text, View, Animated, InteractionManager, AsyncStorage, Platform, BackHandler, StatusBar } from 'react-native'

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import Load from '../../Scenes/Load';
import MainActivation from '../Container/MainActivation';
const constant = require('../Utils/Constants');
/*
 Custome View
 */
import Button from '../view/button';
import Input from '../view/input';
import Title from '../view/title';

/*
 INSTANCES
 */
let responseJson;
let obj;
let savedUserName;


class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      inputUsername: '',
      inputPassword: '',
      login_button_text: 'Login',
      loginAttempts: 5,
      passAttempts: 5,
      challenge: this.props.url.chlngJson,
      failureMessage: '',
      isLoaderVisible: false,
    };
  }


  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    obj = this;
    constant.USER_SESSION = "NO";
    constant.USER_T0 = "NO";
    console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));

    AsyncStorage.getItem('rememberuser').then((value) => {
      if (value == undefined || value == null || value === 'empty') {

      } else {
        if (this.props.url.reset) {
        } else {
          InteractionManager.runAfterInteractions(() => {
            obj.setState({ inputUsername: value }, () => {
              obj.checkUsername();
            });
          });
        }
      }
    });
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

  _verifyTouchIdSupport() {
    TouchID.isSupported()
      .then(supported => {
        // Success code
        console.log('TouchID is supported.');
        obj._verifyTouchId();
      })
      .catch(error => {
        console.log('TouchID is not supported.');
        console.log(error);
      });
  }
  //onTextchange method for Enter_User TextInput
  onUsernameChange(event) {
    this.setState({ inputUsername: event.nativeEvent.text });
  }

  /*
   This method is used to get the user entered value and submit the same as a challenge response.
   */
  checkUsername() {
    this.state.progress = 0;
    var un = this.state.inputUsername;
    un = un.trim();
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      AsyncStorage.setItem("RUserId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });
      this.setState({ inputUsername: '' });

    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a valid username');
      });
    }
  }

  // clear text of inputBox
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  //use to clear twoFactorAuthMachine navigator
  close() {
    dismissKeyboard();
    Events.trigger('closeStateMachine');
  }
  /*
   This method is used to render the componenet with all its element.
   */
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout0.wrap.container}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
          <View style={Skin.layout0.top.container}>
            <Title
              onClose={() => {
                this.close();
              }}>
            </Title>
            <Text style={[Skin.layout0.top.icon]}>
              {Skin.icon.logo}
            </Text>
            <Text style={Skin.layout0.top.subtitle}>
              {Skin.text['2']['1'].subtitle}
            </Text>
            <Text style={Skin.layout0.top.prompt}>
              {Skin.text['2']['1'].prompt}
            </Text>
          </View>

          <View style={[Skin.layout0.bottom.container, { justifyContent: "flex-start" }]}>
            <View style={[Skin.layout0.wrap.container,{justifyContent: "flex-start"}]}>
             <View style={[Skin.layout0.wrap.container, { maxHeight: 120 }]}>
              <Input
                ref='inputUsername'
                returnKeyType={'next'}
                keyboardType={'email-address'}
                placeholder={'Enter Username/Email'}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize={false}
                autoComplete={false}
                value={this.state.inputUsername}
                onSubmitEditing={this.checkUsername.bind(this)}
                onChange={this.onUsernameChange.bind(this)} />
              <Button
                label={Skin.text['2']['1'].submit_button}
                onPress={this.checkUsername.bind(this)} />
             </View>
            <KeyboardSpacer topSpacing={0} />
          </View>
        </View>
        </View>
      </MainActivation >
    );
  }
}




module.exports = UserLogin;
