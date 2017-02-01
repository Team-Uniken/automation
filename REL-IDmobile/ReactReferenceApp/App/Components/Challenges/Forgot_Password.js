/**
 *  Allow you to set new password. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {View, Text, TextInput, TouchableHighlight, TouchableOpacity, InteractionManager, AsyncStorage, StatusBar, Platform, ScrollView, BackAndroid, } from 'react-native'
import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';

/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';
import Main from '../Container/Main';

/*
 Custome View
 */
import Button from '../view/button';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCES
 */
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var obj;


export default class ForgatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      cPassword: '',
      userID: '',
      erpasswd: false,
    };

    this.close = this.close.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.onPatternClose = this.onPatternClose.bind(this);
    this.onPostForgotPassword = this.onPostForgotPassword.bind(this);
  }
 /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
      obj = this;
    AsyncStorage.getItem('RUserId').then((value) => {
      this.setState({ Username: value });
    }).done();

    AsyncStorage.getItem(Main.dnaUserName).then((value) => {
      if (value) {
        try {
          value = JSON.parse(value);
          if (value.ERPasswd && value.ERPasswd !== 'empty') {
            this.state.erpasswd = true;
          }
        }
        catch (e) { }
      }
    }).done();

     Events.on('onPostForgotPassword', 'onPostForgotPassword', this.onPostForgotPassword);
  }
 /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.close);
  }
  //To check password policy
  validatePassword(textval) {
    // var passwordregex = /^[0-9]/;
    var passwordregex = /^(?=^.{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
    return passwordregex.test(textval);
  }
  /*
    onTextchange method for Password TextInput
  */
  onPasswordChange(event) {
    this.setState({ password: event.nativeEvent.text.trim() });
    this.state.password = event.nativeEvent.text.trim();
  }
  /*onTextchange method for confirm password TextInput  */
  onConfirmPasswordChange(event) {
    this.setState({ cPassword: event.nativeEvent.text.trim() });
    this.state.cPassword = event.nativeEvent.text.trim();
  }

  onSetPattern(data) {
     Events.trigger('finishForgotPasswordFlow',null);
  }

  onPatternClose() {
    AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
     Events.trigger('finishForgotPasswordFlow',null);
  }

  onPostForgotPassword() {
    AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ RPasswd: this.state.password }), null).then((error) => {
      if (Platform.OS == 'ios' && this.state.erpasswd) {
        this.encrypytPasswdiOS();
         Events.trigger('finishForgotPasswordFlow',null);
      } else if (Platform.OS == 'android' && this.state.erpasswd) {
        this.props.navigator.push(
          {
            id: 'pattern',
            data: '',
            onSetPattern: this.onSetPattern,
            onClose: this.onPatternClose,
            mode: "set"
          });
      } else {
         Events.trigger('finishForgotPasswordFlow',null);
      }
    }).done();
  }
/*
    This method is used to get the users entered paswword and confirmPassword to check both are same,
     and submit the same as a challenge response.
  */
  setPassword() {
    const pw = this.state.password;
    const cpw = this.state.cPassword;
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
          //  if(this.validatePassword(pw)){
          dismissKeyboard();
          // Main.dnaPasswd = pw;
          let responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = pw;
          Events.trigger('showNextChallenge', { response: responseJson });
          // }else{
          // alert('Invalide Password');
          // }
        } else {
          alert('Password and Confirm Password do not match');
          this.setState({ password: "", cPassword: "" });
        }
      } else {
        alert('Please enter confirm password ');
      }
    } else {
      alert('Please enter password ');
    }
  }

  /*
    This method is used to return the tittle of Submit/Next button.
  */
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'Continue';
  }
  /*
    This method is used to handle the cancel button click or back button.
  */
  close() {
    if (this.props.mode === "forgotPassword") {
      Events.trigger('resetChallenge',null);
    } else {
      this.props.parentnav.pop();
    }

    BackAndroid.removeEventListener('hardwareBackPress', this.close);
    return true;
  }
 /**
   * Store encrypted password against user for ios. 
  */
  encrypytPasswdiOS() {

    if (Platform.OS === 'ios') {

      AsyncStorage.getItem(Main.dnaUserName).then((value) => {
        if (value) {
          try {
            value = JSON.parse(value);
            ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value.RPasswd, (response) => {
              if (response) {
                console.log('immediate response of encrypt data packet is is' + response[0].error);
                AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: response[0].response }));
                obj.setState({ touchid: true });
              } else {
                console.log('immediate response is' + response[0].response);
              }
            });
          } catch (e) { }
        }
      }).done();
    }
  }
  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout1.wrap}>
          <StatusBar
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'}
            />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => {
              this.close();
            } }>
              {this.props.mode === "forgotPassword" ? "Registration" : "Change Password"}
            </Title>
          </View>
          <ScrollView style={Skin.layout1.content.scrollwrap}>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>
                <View style={Skin.layout1.content.top.container}>
                  <Text style={[Skin.layout1.content.top.text, {}]}>Your username is</Text>
                  <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR }]}>{this.state.Username}</Text>
                  <Text style={[Skin.layout1.content.top.text, { marginBottom: 26 }]}>Set Your Password</Text>
                </View>
                <View style={Skin.layout1.content.bottom.container}>
                  <Input
                    returnKeyType={'next'}
                    keyboardType={'default'}
                    autoFocus={true}
                    autoCorrect={false}
                    autoComplete={false}
                    autoCapitalize={false}
                    ref={'password'}
                    placeholder={'Enter Password'}
                    value={this.state.password}
                    secureTextEntry={true}
                    blurOnSubmit={false}
                    onChange={this.onPasswordChange.bind(this) }
                    onSubmitEditing={() => { this.refs.cPassword.focus(); } }
                    marginBottom={12}
                    />

                  <Input
                    autoFocus={false}
                    autoComplete={false}
                    autoCorrect={false}
                    autoCapitalize={false}
                    returnKeyType={'done'}
                    secureTextEntry={true}
                    ref={'cPassword'}
                    value={this.state.cPassword}
                    keyboardType={'default'}
                    placeholder={'Confirm Password'}
                    onChange={this.onConfirmPasswordChange.bind(this) }
                    onSubmitEditing={this.setPassword.bind(this) }
                    />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={Skin.layout1.bottom.wrap}>
            <View style={Skin.layout1.bottom.container}>
              <Button style={Skin.layout1.bottom.button}
                onPress={this.setPassword.bind(this) }
                label={Skin.text['1']['1'].submit_button}/>
            </View>
          </View>
          <KeyboardSpacer topSpacing={-40}/>
        </View>
      </MainActivation>
    );

  }
}

module.exports = ForgatePassword;
