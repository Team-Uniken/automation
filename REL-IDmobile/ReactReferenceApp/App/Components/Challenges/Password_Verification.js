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
    //dismissKeyboard();
    obj = this;
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));



  }
  /*
   onTextchange method for Password TextInput.
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
      //Util.saveUserDataSecure("RPasswd",pw).done();
      // AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ RPasswd: pw }), null);  Todo: To be removed after testing

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
      this.setState({ showCamera: false });
      Events.trigger('showPreviousChallenge');
    }
  }

  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <MainActivation>
        <View style={[Skin.layout1.wrap, { flex: 1 }]} onStartShouldSetResponder={this.containerTouched.bind(this) }>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />

            <View style={[ Skin.layout1.wrap, { flex: 1 },{justifyContent: 'center'} ]}>
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
              </Title>
            </View>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout0.top.container}>
                <Text style={[Skin.layout0.top.icon]}>
                  {Skin.icon.logo}
                </Text>
                <Text style={Skin.layout0.top.subtitle}>{Skin.text['2']['1'].subtitle}</Text>
                <Text style={[Skin.layout1.content.top.text, {marginBottom:8}]}>Your username is</Text>
                <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR,marginBottom:16 }]}>{Main.dnaUserName}</Text>
              </View>
              <View style={[Skin.layout0.bottom.container]}>        
                <Input
                  ref='inputPassword'
                  returnKeyType={ 'next' }
                  secureTextEntry
                  placeholder={Skin.text['2']['2'].textinput_placeholder }
                  value={ this.state.inputPassword }
                  onSubmitEditing={ this.checkPassword.bind(this) }
                  onChange={ this.onPasswordChange.bind(this) }
                  enablesReturnKeyAutomatically={true}
                  autoFocus={true}
                  autoCorrect={false}
                  autoComplete={false}
                  clearTextOnFocus={false}
                  autoCapitalize={false}
                  />                
                  <Text style={[Skin.layout0.top.attempt,{marginTop:0}]}>
                  Attempt left {this.props.url.chlngJson.attempts_left}
                </Text>
                <Button
                  label={Skin.text['2']['1'].submit_button}
                  onPress={ this.checkPassword.bind(this) }/>            
                <Text style={Skin.baseline.text_link_no_underline}
                  onPress={ this.onForgotPasswordClick }>Forgot your password?</Text>
              </View>
              <KeyboardAvoidingView  behavior='padding' keyboardVerticalOffset={40}/>
            </View>
          </View>
        </View>
      </MainActivation>
    );
  }
}

module.exports = PasswordVerification;
