/**
 *  verify password for post login authentication. 
 */

'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React, { Component, } from 'react';

/*
 Required for this js
 */
import {Text, TextInput, View, Animated, TouchableOpacity, InteractionManager, AsyncStorage, Platform, AlertIOS, ScrollView, BackAndroid, StatusBar } from 'react-native';
import Events from 'react-native-simple-events';
import TouchID from 'react-native-touch-id';
import TouchId from 'react-native-smart-touch-id'

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';
import OpenLinks from '../OpenLinks';
import Util from "../Utils/Util";
/*
 Custom View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCES
 */

var constant = require('../Utils/Constants');
const dismissKeyboard = require('dismissKeyboard')


let responseJson;
let chlngJson;



class PasswordVerification extends Component {
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
    dismissKeyboard();
    BackAndroid.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }
  /*
   onTextchange method for password TextInput.
 */
  onPasswordChange(event) {
    this.setState({
      inputPassword: event.nativeEvent.text
    });
  }
  /*
    This method is used to get the users entered value and submit the same as a challenge response.
  */
  checkPassword() {
    var pw = this.state.inputPassword;
    if (pw.length > 0) {
      Main.dnaPasswd = pw;
      //AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ RPasswd: pw }), null); Todo : to be removed after test
      Util.saveUserDataSecure("RPasswd",pw);
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
      Events.trigger('showNextChallenge', {
        response: responseJson
      });
    } else {
      alert('Please enter password');
    }
  }
  //trigger the event forgotPassowrd to call forgotPassowrd api.
  onForgotPasswordClick() {
    Events.trigger("forgotPassowrd");
  }

  renderif(condition, code) {
    if (condition) {
      return code;
    }
  }

  containerTouched(event) {
    dismissKeyboard();
    return false;
  }
  //show previous challenge on click of cross button or android back button /or/ onBack came in props .
  close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }

  render() {
    return (
      <MainActivation>
        <View style={[Skin.layout1.wrap, { flex: 1 }]} onStartShouldSetResponder={this.containerTouched.bind(this) }>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />

          <View style={{ justifyContent: 'center' }}>
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
              </Title>
            </View>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout0.top.container}>
                <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
                  {Skin.icon.logo}
                </Text>
                <Text style={Skin.layout0.top.subtitle}>{Skin.text['2']['1'].subtitle}</Text>
              </View>
              <View style={Skin.layout0.bottom.container}>

                <Text style={Skin.layout0.top.attempt}>
                  Attempt left {this.props.url.chlngJson.attempts_left}
                </Text>

                <Input
                  ref='inputPassword'
                  returnKeyType={ 'next' }
                  secureTextEntry
                  placeholder={Skin.text['2']['2'].textinput_placeholder }
                  value={ this.state.inputPassword }
                  onSubmitEditing={ this.checkPassword.bind(this) }
                  onChange={ this.onPasswordChange.bind(this) }
                  enablesReturnKeyAutomatically={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoComplete={false}
                  autoCapitalize={false}
                  />

                <Button
                  label={Skin.text['2']['1'].submit_button}
                  onPress={ this.checkPassword.bind(this) }/>

                <Text style={Skin.baseline.text_link_no_underline}
                  onPress={ this.onForgotPasswordClick }>Forgot your password?</Text>
              </View>
            </View>
          </View>
        </View>
      </MainActivation>
    );
  }
}

module.exports = PasswordVerification;
