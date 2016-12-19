'use strict';

/*
 ALWAYS NEED
 */
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
/*
 CALLED
 */
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';
import dismissKeyboard from 'dismissKeyboard';

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer';

/*
 Instantiaions
 */
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  InteractionManager,
  AsyncStorage,
  StatusBar,
  Platform,
  ScrollView,
  BackAndroid,
} = ReactNative;

const {Component} = React;

export default class UpdatePasswordSet extends Component {
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
    /*
     this._props = {
     url: {
     chlngJson: {
     chlng_idx: 1,
     sub_challenge_index: 0,
     chlng_name: 'pass',
     chlng_type: 1,
     challengeOperation: 1,
     chlng_prompt: [[]],
     chlng_info: [
     {
     key: 'Response label',
     value: 'Password',
     }, {
     key: 'description',
     value: 'Enter password of length 8-10 characters',
     },
     ],
     chlng_resp: [
     {
     "challenge":"password",
     "response":"",
     }
     ],
     challenge_response_policy: [],
     chlng_response_validation: false,
     attempts_left: 3,
     },
     chlngsCount: 1,
     currentIndex: 1,
     },
     };
     */
  }

  componentWillMount() {
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

  validatePassword(textval) {
    // var passwordregex = /^[0-9]/;
    var passwordregex = /^(?=^.{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
    return passwordregex.test(textval);
  }

  onPasswordChange(event) {
    this.setState({ password: event.nativeEvent.text.trim() });
    this.state.password = event.nativeEvent.text.trim();
  }

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

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'Continue';
  }

  close() {
    if (this.props.mode === "forgotPassword") {
      Events.trigger('resetChallenge',null);
    } else {
      this.props.parentnav.pop();
    }

    BackAndroid.removeEventListener('hardwareBackPress', this.close);
    return true;
  }

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

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.close);
  }

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

module.exports = UpdatePasswordSet;
