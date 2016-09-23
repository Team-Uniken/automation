'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';
import Main from '../Main';
import TouchID from 'react-native-touch-id';

/*
 CALLED
 */
import PatternLock from '../../Scenes/PatternLock'
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Events from 'react-native-simple-events';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
/*
 INSTANCES
 */
let responseJson;
let obj;
let savedpass;
let subscription;
const {
  Text,
  ScrollView,
  TextInput,
  View,
  Platform,
  Animated,
  TouchableHighlight,
  InteractionManager,
  AsyncStorage,
  Alert,
} = ReactNative;

const{
  Component
} =  React;


class PostLoginPasswordVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
    progress: 0,
    inputUsername: '',
    inputPassword: '',
    login_button_text: 'Login',
    loginAttempts: 5,
    passAttempts: 5,
    Challenge: this.props.url.chlngJson,
    failureMessage: '',
    };
  }
  
  componentDidMount() {
    obj = this;
  }

  onPasswordChange(event) {
    this.setState({ inputPassword: event.nativeEvent.text });
  }
  
  checkPassword() {
    var pw = this.state.inputPassword;
    if (pw.length > 0) {
     // alert(pw);
      Main.dnaPasswd = pw;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
     // alert("Response Json = "+ JSON.stringify(responseJson));
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Please enter password');
    }
  }
  
  render() {
        return (
          <MainActivation navigator={this.props.navigator}>
            <View style={{ height: Skin.SCREEN_HEIGHT - 100, justifyContent: 'center' }}>
              <View style={Skin.activationStyle.topGroup}>
                <Animated.View style={[Skin.loadStyle.rid_wrap]}>
                  <View style={Skin.loadStyle.rid_center}>
                    <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_r]}>g</Text>
                    <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_i]}>h</Text>
                    <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_d]}>i</Text>
                  </View>
                </Animated.View>

                <View style={[Skin.activationStyle.input_wrap, { marginTop: 60 }]}>
                  <View style={Skin.activationStyle.textinput_wrap}>
                    <TextInput
                      ref='inputPassword'
                      returnKeyType={'next'}
                      secureTextEntry
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      placeholder={'Password'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                      style={Skin.activationStyle.textinput}
                      value={this.state.inputPassword}
                      onSubmitEditing={this.checkPassword.bind(this) }
                      onChange={this.onPasswordChange.bind(this) }
                      />

                  </View>
                </View>
                <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
                <View style={Skin.activationStyle.input_wrap}>
                  <TouchableHighlight
                    style={Skin.activationStyle.button}
                    onPress={this.checkPassword.bind(this) }
                    underlayColor={'#082340'}
                    activeOpacity={0.6}
                    >
                    <Text style={Skin.activationStyle.buttontext}>
                      SUBMIT
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </MainActivation>
            );
  }
}

module.exports = PostLoginPasswordVerification;
