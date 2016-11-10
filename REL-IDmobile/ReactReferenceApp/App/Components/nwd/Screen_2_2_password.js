'use strict';

/*
 ALWAYS NEED
 */
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';


/*
 CALLED
 */
import Main from '../Main';
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Events from 'react-native-simple-events';
import TouchID from 'react-native-touch-id';

import PasscodeAuth from 'react-native-passcode-auth';
import TouchId from 'react-native-smart-touch-id'
const reason = 'Please validate your Touch Id';
var constant = require('../Constants');
const dismissKeyboard = require('dismissKeyboard')

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
const {Text, TextInput, View, Animated, TouchableOpacity, InteractionManager, AsyncStorage, Platform, AlertIOS,ScrollView } = ReactNative;

const {Component} = React;


class PasswordVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPassword: '',
      showCloseButton: false
    };

    this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
  }

  onPasswordChange(event) {
    this.setState({
      inputPassword: event.nativeEvent.text
    });
  }

  checkPassword() {
    var pw = this.state.inputPassword;
    if (pw.length > 0) {
      Main.dnaPasswd = pw;
      AsyncStorage.setItem("RPasswd", pw);
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
      Events.trigger('showNextChallenge', {
        response: responseJson
      });
    } else {
      alert('Please enter password');
    }
  }

  onForgotPasswordClick() {
    Events.trigger("forgotPassowrd");
  }

  renderif(condition, code) {
    if (condition) {
      return code;
    }
  }

  componentDidMount(){
    dismissKeyboard();
  }



  //  <View style={Skin.layout0.wrap.container}>
  //       <View style={Skin.layout1.title.wrap}>
  //         {
  //           this.renderif(this.state.showCloseButton,
  //             <Title onClose={() => { } }></Title>
  //           )  
  //         }
  //       </View>
  //       <View style={Skin.layout0.top.container}>
  //         <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
  //           {Skin.icon.logo}
  //         </Text>
  //         <Text style={Skin.layout0.top.subtitle}>{Skin.text['2']['1'].subtitle}</Text>
  //       </View>
  //       <View style={Skin.layout0.bottom.container}>

  //         <Text style={Skin.layout0.top.attempt}>
  //           Attempt left {this.props.url.chlngJson.attempts_left}
  //         </Text>

  //         <Input
  //           ref='inputPassword'
  //           returnKeyType={ 'next' }
  //           secureTextEntry
  //           placeholder={Skin.text['2']['2'].textinput_placeholder }
  //           value={ this.state.inputPassword }
  //           onSubmitEditing={ this.checkPassword.bind(this) }
  //           onChange={ this.onPasswordChange.bind(this) }
  //           enablesReturnKeyAutomatically={true}
  //           autoFocus={true}
  //           autoCorrect={false}
  //           autoComplete={false}
  //           autoCapitalize={false}
  //           />

  //         <Button
  //           label={Skin.text['2']['1'].submit_button}
  //           onPress={ this.checkPassword.bind(this) }/>

  //         <Text style={Skin.baseline.text_link_no_underline}
  //           onPress={ this.onForgotPasswordClick }>Forgot your password?</Text>
  //       </View>
  //     </View>

  containerTouched(event) {
    dismissKeyboard();
    return false;
  }
 
     close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }
  render() {
    return (
      <View style={[Skin.layout1.wrap,{flex:1}]} onStartShouldSetResponder={this.containerTouched.bind(this)}>
      <View style={{ justifyContent: 'center' }}>
        <View style={Skin.layout1.title.wrap}>
             <Title onClose={() => {
      this.close();
      }}>
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
    );
  }
}

module.exports = PasswordVerification;
