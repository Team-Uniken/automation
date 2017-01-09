'use strict';

import React, { Component, PropTypes } from 'react';
import Skin from '../../Skin';
import Main from '../Main';
import Load from '../../Scenes/Load';
import MainActivation from '../MainActivation';
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';
import TouchID from 'react-native-touch-id';
import { Text, View, Animated, InteractionManager, AsyncStorage, Platform, BackAndroid, StatusBar } from 'react-native'
import Button from '../view/button';
import Input from '../view/input';
import Title from '../view/title';

const constant = require('../Constants');
let responseJson;
let chlngJson;
let nextChlngName;
let obj;
let statusMessage;
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



  componentWillMount() {
    obj = this;
    constant.USER_SESSION = "NO";
    constant.USER_T0 = "NO";

    // AsyncStorage.setItem("isPwdSet", "empty");
    // if (Platform.OS == "android") {
    //   try {
    //     AsyncStorage.getItem("userData").then((value) => {
    //       if (value) {
    //         this.setState({ pattern: true, });

    //         Main.isPatternEnabled = true;
    //       } else {
    //         Main.isPatternEnabled = false;
    //       }
    //     }).done();
    //   } catch ( e ) {}
    // } else {
    //   this.locked = false;
    // }

    console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));

    AsyncStorage.getItem('rememberuser').then((value) => {
      if (value == undefined || value == null || value === 'empty') {

      } else {
        if (this.props.url.reset) {
        } else {
          obj.setState({ inputUsername: value });
          obj.checkUsername();
        }
      }
    });
  }

  componentDidMount() {
    obj = this;
    BackAndroid.addEventListener('hardwareBackPress', function() {
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

  onUsernameChange(event) {
    this.setState({ inputUsername: event.nativeEvent.text });
  }

  checkUsername() {
    this.state.progress = 0;
    let un = this.state.inputUsername;
    //    this.setState({ isLoaderVisible: true});
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      AsyncStorage.setItem("RUserId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });

    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a valid username');
      });
    }
  }

  checkUsernameSuccess() {
    Main.dnaUserName = savedUserName;
    InteractionManager.runAfterInteractions(() => {
      this.props.navigator.push(
        { id: "Activation",title: nextChlngName,url: chlngJson }
      );
    });
  }

  checkUsernameFailure() {
    console.log('\n\nin checkUsernameFailure');
    this.setState({ isLoaderVisible: false });
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
    this.setState({ failureMessage: statusMessage });
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
    this.refs[fieldName].setNativeProps({ text: '' });
  }

  close() {
    Events.trigger('closeStateMachine');
  }
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
            <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
              {Skin.icon.logo}
            </Text>
            <Text style={Skin.layout0.top.subtitle}>
              {Skin.text['2']['1'].subtitle}
            </Text>
            <Text style={Skin.layout0.top.prompt}>
              {Skin.text['2']['1'].prompt}
            </Text>
          </View>
          <View style={Skin.layout0.bottom.container}>
            <Input
              ref='inputUsername'
              returnKeyType={'next'}
              keyboardType={'email-address'}
              placeholder={'Enter e-mail'}
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
        </View>
      </MainActivation>
      );
  }
}

UserLogin.propTypes = {
  url: PropTypes.Object,
  navigator: PropTypes.Array,
}

UserLogin.getDefaultProps = {
  url: {
    chlngJson: {
      chlng_resp: [{
        challenge: 'ABCDEFG'
      }]
    }
  },
  navigator: []
}


module.exports = UserLogin;