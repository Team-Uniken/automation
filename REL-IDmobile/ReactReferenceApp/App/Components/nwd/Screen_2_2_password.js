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
import dismissKeyboard from 'dismissKeyboard';
import PatternLock from '../../Scenes/PatternLock'
import TouchID from 'react-native-touch-id';

import PasscodeAuth from 'react-native-passcode-auth';
import TouchId from 'react-native-smart-touch-id'
const reason = 'Please validate your Touch Id';
var constant = require('../Constants');

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
/*
  INSTANCES
 */
let responseJson;
let chlngJson;
let nextChlngName;
const {Text, TextInput, View, Animated, TouchableOpacity, InteractionManager, AsyncStorage, Platform, AlertIOS, } = ReactNative;

const {Component} = React;


class PasswordVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPassword: '',
    };
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
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
      Events.trigger('showNextChallenge', {
        response: responseJson
      });
    } else {
      alert('Please enter password');
    }
  }

  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
        <View style={Skin.layout0.top.container}>
          <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
            {Skin.icon.logo}
          </Text>
          <Text style={Skin.layout0.top.subtitle}>{Skin.text['2']['1'].subtitle}</Text>
          <Text style={Skin.layout0.top.prompt}>
            {Skin.text['2']['1'].prompt}
          </Text>
        </View>
        <View style={Skin.layout0.bottom.container}>

          <Input
            ref='inputPassword'
            returnKeyType={ 'next' }
            keyboardType={ 'email-address' }
            secureTextEntry
            placeholder={Skin.text['2']['2'].textinput_placeholder }
            value={ this.state.inputPassword }
            onSubmitEditing={ this.checkPassword.bind(this) }
            onChange={ this.onPasswordChange.bind(this) }
            />
            
          <Button
            label={Skin.text['2']['1'].submit_button}
            onPress={ this.checkPassword.bind(this) }/>
        </View>
      </View>
    );
  }
}

module.exports = PasswordVerification;