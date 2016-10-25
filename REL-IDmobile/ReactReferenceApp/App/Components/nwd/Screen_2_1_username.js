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
let obj;
let statusMessage;
let savedUserName;
const {Text, TextInput, View, Animated, TouchableOpacity, InteractionManager, AsyncStorage, Platform, AlertIOS, } = ReactNative;

const {Component} = React;


class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      r_opac_val: new Animated.Value(0),
      i_opac_val: new Animated.Value(0),
      d_opac_val: new Animated.Value(0),
      relid_text_opac: new Animated.Value(0),
      rid_top: new Animated.Value(253),
      r_text_opac: new Animated.Value(0),
      i_text_opac: new Animated.Value(0),
      d_text_opac: new Animated.Value(0),
      relid_opac_val: new Animated.Value(0),
      logWrapOpac: new Animated.Value(0),
      logWarnOpac: new Animated.Value(0),
      progWrapOpac: new Animated.Value(0),
      progress: 0,
      inputUsername: '',
      inputPassword: '',
      login_button_text: 'Login',
      loginAttempts: 5,
      passAttempts: 5,
      Challenge: this.props.url.chlngJson,
      failureMessage: '',
      isLoaderVisible: false,
    };
  }

  componentDidMount() {
    obj = this;
  }

  componentWillMount() {
    constant.USER_SESSION = "NO";
  }

  onUsernameChange(event) {
    this.setState({
      inputUsername: event.nativeEvent.text
    });
  }

  checkUsername() {
    this.state.progress = 0;
    var un = this.state.inputUsername;
    //    this.setState({ isLoaderVisible: true});
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', {
        response: responseJson
      });
    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a valid username');
      });
    }
  }

  checkUsernameFailure() {
    console.log('\n\nin checkUsernameFailure');
    this.setState({
      isLoaderVisible: false
    });
    this.state.progress = 0;
    Animated.sequence([
      Animated.timing(this.state.logWrapOpac, {
        toValue: 1,
        duration: 1 * 0.1,
        delay: 0 * Skin.spd
      }),
      Animated.timing(this.state.progWrapOpac, {
        toValue: 0,
        duration: 500 * Skin.spd,
        delay: 0 * Skin.spd
      })
    ]).start();
    this.clearText('inputUsername')
    this.setState({
      failureMessage: statusMessage
    });
    Animated.sequence([
      Animated.timing(this.state.logWarnOpac, {
        toValue: 1,
        duration: 500 * Skin.spd,
        delay: 0 * Skin.spd
      })
    ]).start();
    this.refs.inputUsername.focus();

  }


  getProgress(offset) {
    var progress = this.state.progress + offset;
    return progress;
  }


  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({
      text: ''
    });
  }

  render() {
    // return (
    //     <View style={Skin.layout1.wrap}>
    //   <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
    //         {Skin.icon.logo}
    //       </Text>
    //   <Text style={Skin.layout0.top.subtitle}>{Skin.text['2']['1'].subtitle}</Text>
    //   <Margin
    //   space={32}/>
    //   <View>
    //   <Input
    //   ref='inputUsername'
    //   returnKeyType={ 'next' }
    //   keyboardType={ 'email-address' }
    //   placeholder={ 'Username' }
    //   value={ this.state.inputUsername }
    //   onSubmitEditing={ this.checkUsername.bind(this) }
    //   onChange={ this.onUsernameChange.bind(this) }
    //   />
    //   </View>
    //   <Button
    //   lable="Submit"
    //   onPress={ this.checkUsername.bind(this) }/>
    //  </View>
    //   );
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
      ref='inputUsername'
      returnKeyType={ 'next' }
      keyboardType={ 'email-address' }
      placeholder={ 'Username' }
      value={ this.state.inputUsername }
      onSubmitEditing={ this.checkUsername.bind(this) }
      onChange={ this.onUsernameChange.bind(this) }
      />
      <Button
      label={Skin.text['2']['1'].submit_button}
      onPress={ this.checkUsername.bind(this) }/>         
        </View>
      </View>
      );
    }
}

module.exports = UserLogin;
