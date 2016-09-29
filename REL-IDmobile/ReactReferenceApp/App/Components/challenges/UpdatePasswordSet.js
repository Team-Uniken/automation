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
import PatternLock from '../../Scenes/PatternLock'
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
/*
 Instantiaions
 */
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  InteractionManager,
  DeviceEventEmitter,
  AsyncStorage,
  Platform,
  Alert,
} = ReactNative;

const{Component} = React;

let responseJson;
let updatePasswordSubscription;

export default class PasswordSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    password: '',
    cPassword: '',
    pattern:false,
    };

    this.onSetPattern = this.onSetPattern.bind(this);
    this.decidePlatformAndProceed = this.decidePlatformAndProceed.bind(this);
    this.encryptPasswordThenProceed = this.encryptPasswordThenProceed.bind(this);
    this.validateAndProceed = this.validateAndProceed.bind(this);
    this.isUserDataPresent = false;  
  }

  encryptPasswordThenProceed(){
     ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", Main.dnaPasswd, (response) => {
                                                 if (response) {
                                                 console.log('immediate response of encrypt data packet is is' + response[0].error);
                                                 AsyncStorage.setItem("passwd", response[0].response);
                                                 } else {
                                                 console.log('immediate response is' + response[0].response);
                                                 }
                                                 })
                     
    this.setPassword();
  }

   decidePlatformAndProceed(){
     if (Platform.OS === 'ios') {
         AsyncStorage.getItem("passwd").then((passwd)=>{
             if(passwd){
                this.encryptPasswordThenProceed();
             }
             else{
               this.setPassword();
             }
         }).done();
     } else {
       AsyncStorage.getItem("userData").then((userData) => {
         if (userData) {
           this.isUserDataPresent = true;
           this.setPassword();
         }
         else {
           this.isUserDataPresent = false;
           this.setPassword();
         }
       }).done();
     }
  }

  validateAndProceed(){
    const pw = this.state.password;
    const cpw = this.state.cPassword;
   
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
           Main.dnaPasswd = pw;
           this.decidePlatformAndProceed();
        } else {
          alert('Password and Confirm Password do not match');
        }
      } else {
        alert('Please enter confirm password ');
      }
    } else {
      alert('Please enter password ');
    }
  }

  onCheckChallengeResponseStats(args){
    // alert("In act checkResponse");
     updatePasswordSubscription.remove();
     const res = JSON.parse(args.response);
     if(res.errCode == 0){
        var statusCode = res.pArgs.response.StatusCode;
        if(statusCode!=100){
         // alert("removing data statusCode = "+  statusCode);
          let keys = ['userData','setPattern'];
          AsyncStorage.multiRemove(keys);
        }
     }else{
      // alert("removing data errorCode = " + res.errCode);
        let keys = ['userData','setPattern'];
        AsyncStorage.multiRemove(keys);
     }
  }

  onSetPattern(data) {
    updatePasswordSubscription = DeviceEventEmitter.addListener(
        'onCheckChallengeResponseStatus',
        this.onCheckChallengeResponseStats.bind(this));
     Main.dnaPasswd = null;
     Events.trigger('showNextChallenge', data);
  }

  componentDidMount() {
    Main.isTouchIdSet = "NO";
    InteractionManager.runAfterInteractions(() => {
                                            this.refs.password.focus();
                                            });
  }
  
  
  validatePassword(textval) {
   // var passwordregex = /^[0-9]/;
     var passwordregex = /^(?=^.{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
    return passwordregex.test(textval);
  }

  onPasswordChange(event) {
    this.setState({ password: event.nativeEvent.text });
  }
  
  onConfirmPasswordChange(event) {
    this.setState({ cPassword: event.nativeEvent.text });
  }
  
  gotoControlPanel(){
    Events.trigger('cancelOperation');
  }
  
  
  setPassword(){
    const pw = this.state.password;
    const cpw = this.state.cPassword;
    
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
          //  if(this.validatePassword(pw)){
          Main.dnaPasswd = pw;
          responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = pw;
          dismissKeyboard();

          if (Platform.OS === "android") {
            if (this.isUserDataPresent) {
              this.setState({
                pattern: true
              });
            } else {
              Events.trigger('showNextChallenge', { response: responseJson });
            }
          } else {
            Events.trigger('showNextChallenge', { response: responseJson });
          }
          // }else{
          // alert('Invalide Password');
          // }
        } else {
          alert('Password and Confirm Password do not match');
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
  
  render() {
    if(this.state.pattern === false){
    return (
            <MainActivation navigator={this.props.navigator}>
            <View style={Skin.activationStyle.topGroup}>
            
            <Text style={Skin.activationStyle.title}>Set Password</Text>
            <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
            autoCorrect={false}
            returnKeyType={'next'}
            keyboardType={'default'}
            ref={'password'}
            placeholder={'Enter Password'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            style={Skin.activationStyle.textinput}
            secureTextEntry={true}
            blurOnSubmit={false}
            onChange={this.onPasswordChange.bind(this)}
            onSubmitEditing={() => { this.refs.cPassword.focus(); }}
            />
            </View>
            </View>
            
            <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
            autoCorrect={false}
            ref={'cPassword'}
            returnKeyType={'next'}
            keyboardType={'default'}
            placeholder={'Confirm Password'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            style={Skin.activationStyle.textinput}
            secureTextEntry={true}
            onChange={this.onConfirmPasswordChange.bind(this)}
            onSubmitEditing={this.validateAndProceed}
            />
            </View>
            </View>
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
            style={Skin.activationStyle.button}
            underlayColor={'#082340'}
            onPress={this.validateAndProceed}
            activeOpacity={0.6}
            >
            <Text style={Skin.activationStyle.buttontext}>
            {this.btnText()}
            </Text>
            </TouchableHighlight>
            </View>
            </View>
            </MainActivation>
            );
    }
    else{
      return (<PatternLock navigator={this.props.navigator} 
              onSetPattern={this.onSetPattern} data={{ response: responseJson }}
              mode="set" />);
    }
  }
}

module.exports = PasswordSet;
