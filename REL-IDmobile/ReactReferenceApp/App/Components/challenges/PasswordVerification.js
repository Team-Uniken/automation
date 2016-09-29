'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';
import Main from '../Main';
import TouchID from 'react-native-touch-id';
//import Machine1 from '../TwoFactorAuthMachine';

/*
 CALLED
 */
import PatternLock from '../../Scenes/PatternLock'
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Link from '../Link';
import Events from 'react-native-simple-events';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
/*
 INSTANCES
 */
let responseJson;
let obj;
let savedpass;
let subscription;
let chlngJson;
let nextChlngName;
const {
  Text,
  ScrollView,
  TextInput,
  View,
  Platform,
  Animated,
  DeviceEventEmitter,
  TouchableHighlight,
  InteractionManager,
  AsyncStorage,
  Alert,
} = ReactNative;

const{Component} =  React;


class PasswordVerification extends Component {
  constructor(props) {
    super(props);
    /*
     this._props = {
     url: {
     chlngJson: {
     chlng_idx: 1,
     sub_challenge_index: 0,
     chlng_name: 'pass',
     chlng_type: 1,
     challengeOperation: 0,
     chlng_prompt: [[]],
     chlng_info: [
     {
     key: 'Prompt label',
     value: 'Verification Key',
     }, {
     key: 'Response label',
     value: 'Password',
     }, {
     key: 'Description',
     value: 'Enter password of length 8-10 characters',
     }, {
     key: 'Reading',
     value: 'Activation verification challenge',
     },
     ],
     chlng_resp: [
     {
     challenge: 'password',
     response: '',
     },
     ],
     challenge_response_policy: [],
     chlng_response_validation: false,
     attempts_left: 3,
     },
     },
     };
     */
    this.state = {
    progress: 0,
    inputUsername: '',
    inputPassword: '',
    login_button_text: 'Login',
    loginAttempts: 5,
    passAttempts: 5,
    Challenge: this.props.url.chlngJson,
    failureMessage: '',
    pattern : false,
    };
    
    this.onSetPattern = this.onSetPattern.bind(this);
    this.onCheckChallengeResponseStat.bind(this);
    this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
  }
  
  componentWillMount(){
    // if(Platform.OS === "android"){
    //       if(Main.dnaPasswd != null && Main.dnaPasswd != undefined){
    //           this.state.inputPassword = Main.dnaPasswd;
    //           this.checkPassword();
    //       }
    //       else{
    //         InteractionManager.runAfterInteractions(() => {
    //             this.refs.inputPassword.focus();
    //         });
    //       }
    // } 
  }

  componentDidMount() {
    obj = this;
    
    if(Platform.OS === "ios"){
        AsyncStorage.getItem("passwd").then((value) => {
                                            if(value){
                                                if(value == "empty"){
                                                //PROCEED NORMAL WAY.
                                                InteractionManager.runAfterInteractions(() => {
                                                                                        this.refs.inputPassword.focus();
                                                                                        });
                                                }else{
                                                    if(Main.isTouchVerified === "YES"){
                                                            ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
                                                                                        if (response) {
                                                                                        console.log('immediate response of encrypt data packet is is' + response[0].error);
                                                                                        this.state.inputPassword = response[0].response;
                                                                                        this.checkPassword();
                                                                                        } else {
                                                                                        console.log('immediate response is' + response[0].response);
                                                                                        // alert(response[0].error);
                                                                                        
                                                                                        }
                                                                                        });
                                                      }else{
                                                        InteractionManager.runAfterInteractions(() => {
                                                                                              this.refs.inputPassword.focus();
                                                                                              });
                                                      }
                                                }
                                            }else{
                                               InteractionManager.runAfterInteractions(() => {
                                                                                    this.refs.inputPassword.focus();
                                                                                    });
                                            }
                                            
                                            }).done();
    }
    else if (Platform.OS === "android") {

      if (subscription) {
        subscription.remove();
      }
      
      subscription = DeviceEventEmitter.addListener(
        'onCheckChallengeResponseStatus',
        this.onCheckChallengeResponseStat
      );

      if (Main.isPatternEnabled && Main.dnaPasswd != null && Main.dnaPasswd != undefined) {
        this.state.inputPassword = Main.dnaPasswd;
        this.checkPassword();
      }
      else {
        Main.dnaPasswd = null;
        InteractionManager.runAfterInteractions(() => {
          this.refs.inputPassword.focus();
        });
      }
    } 
  }
  
 
  onSetPattern(data){
    if(subscription){
      subscription.remove();
    }
    subscription = DeviceEventEmitter.addListener(
      'onCheckChallengeResponseStatus',
      this.onCheckChallengeResponseStat
    );
    //alert("onSetPattern");

    // this.setState({
    //   pattern:false,
    // });
    this.checkPassword();
    Main.dnaPasswd = null;
  }

  onCheckChallengeResponseStat(args){
     //Events.trigger('hideLoader', true);
    // alert("In pass checkResponse");
     if(subscription){
       subscription.remove();
     }
     const res = JSON.parse(args.response);
     if(res.errCode == 0){
        var statusCode = res.pArgs.response.StatusCode;
        if(statusCode!=100){
         // alert("removing data statusCode = "+  statusCode)
         if(Platform.OS === "android"){
          let keys = ['userData','setPattern'];
          AsyncStorage.multiRemove(keys);
          Main.dnaPasswd = null;
         }
         else{
           //IOS code here
         }
        }
     }else{
      // alert("removing data errorCode = " + res.errCode);
      if(Platform.OS === "android"){
        let keys = ['userData','setPattern'];
        AsyncStorage.multiRemove(keys);
      }
      else{
        //IOS code here
      }
     }
  }

  onPasswordChange(event) {
    this.setState({ inputPassword: event.nativeEvent.text });
  }
  
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  updateProgress() {
    setTimeout((function(){
                this.setState({ progress: this.state.progress + (0.4 * Skin.loadspd) });
                if (this.state.progress < 1) {
                this.updateProgress();
                } else {
                //console.log('complete');
                this.props.navigator.push({
                                          id: 'Main',
                                          });
                }
                }).bind(this), 5);
  }
  
  
  onVerifyTouchIdSupport(){
    TouchID.isSupported()
    .then(supported => {
          // Success code
          console.log('TouchID is supported.');
          this.OnTouchIdAlert();
          })
    .catch(error => {
           // Failure code
           this.checkPassword();//normal way
           console.log('TouchID is not supported.');
           console.log(error);
           });
  }
  
  OnTouchIdAlert(){
    if(Platform.OS === 'ios'){
      Alert.alert(
                  'Message',
                  'Do you want to enable touchId feature?',
                  [
                   {
                   text: 'NO',
                   onPress: () => {console.log('Cancel Pressed');
                              AsyncStorage.setItem("userID","empty");
                              AsyncStorage.setItem("UseTouchId","NO");
                              this.checkPassword();
                              style: 'cancel'
                   }
                   
                   },
                   {
                   text: 'YES',
                   onPress: () => {
                                    AsyncStorage.setItem("UseTouchId","YES");
                                    AsyncStorage.setItem("userId", Main.dnaUserName);
                                    ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", this.state.inputPassword, (response) => {
                                               if (response) {
                                                        console.log('immediate response of encrypt data packet is is' + response[0].error);
                                                        AsyncStorage.setItem("passwd", response[0].response);
                                               } else {
                                                        console.log('immediate response is' + response[0].response);
                                                        // alert(response[0].error);
                                               
                                               }
                                               })
                   
                        this.checkPassword();
                   
                      }
                    },
                   ]
                  )
    }else{
      
      //Show alert for pattern.
    }
  }
  
  decidePlatformAndShowAlert(){
    const pw = this.state.inputPassword;
    if (pw.length > 0) {
      if(Platform.OS === "android"){
        AsyncStorage.getItem("setPattern").then((flag) => {
          if(flag === "false"){
            //alert("setPattern = false");
            this.checkPassword();
            Main.dnaPasswd = null;
          }
          else{
            this.showSetPatternAlert();
          }
        }).done(); 
      }else{
          AsyncStorage.getItem("UseTouchId").then((value) => {
                                                  if(value === "NO"){
                                                    this.checkPassword();
                                                  }else{
                                                      if(Platform.OS === 'ios'){
                                                        this.onVerifyTouchIdSupport();
                                                      } 
                                                  }
      
                                              }).done();
      }
    }else{
      alert('Please enter password');
    }
  }

  showSetPatternAlert() {
      Alert.alert(
        'Message',
        'Do you want to enable pattern feature?',
        [
          {
            text: 'NO',
            onPress: () => {
              console.log('Cancel Pressed');
              try {
                AsyncStorage.setItem("setPattern", "false", () => {
                  this.checkPassword();
                  Main.dnaPasswd = null;
                });
              }
              catch (e) { }
            }
          },
          {
            text: 'YES',
            onPress: () => {
              console.log('YES Pressed');
              try {
                AsyncStorage.setItem("setPattern", "true", () => {
                  Main.dnaPasswd = this.state.inputPassword;
                  this.setState({
                    pattern:true
                  });
                });
              }
              catch (e) { }
            }
          },
        ]
      );
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
  
  checkPasswordSuccess() {
    this.refs.inputPassword.blur();
    this.state.progress = 0;
    this.updateProgress();
  }
  
  checkPasswordFailure() {
    this.clearText('inputPassword');
    this.setState({ failureMessage: 'Invalid Password' });
    InteractionManager.runAfterInteractions(() => {
                                            this.refs.inputPassword.focus();
                                            });
  }
  
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }

  onForgotPasswordClick(){
    Events.trigger("forgotPassowrd");
  }
  
  render() {
    if(this.state.pattern === false){
        return (
            <MainActivation navigator={this.props.navigator}>
            <View style={Skin.activationStyle.topGroup}>
            <Animated.View style={[Skin.loadStyle.rid_wrap]}>
            <View style={[Skin.loadStyle.rid_center,{marginTop:60*(Skin.SCREEN_HEIGHT/1000)}]}>
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
            onSubmitEditing={this.decidePlatformAndShowAlert.bind(this)}
            onChange={this.onPasswordChange.bind(this)}
            />
            
            </View>
            </View>
            <Text style={Skin.linkStyle.text} onPress={this.onForgotPasswordClick}>Forgot Password ?</Text>
            <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
            style={Skin.activationStyle.button}
            onPress={this.decidePlatformAndShowAlert.bind(this)}
            underlayColor={'#082340'}
            activeOpacity={0.6}
            >
            <Text style={Skin.activationStyle.buttontext}>
            SUBMIT
            </Text>
            </TouchableHighlight>
            </View>
            </View>
            <OpenLinks />
            </MainActivation>
            );
    } else{
      return (<PatternLock navigator={this.props.navigator} title="Verify Pattern"  
              onSetPattern={this.onSetPattern} mode="set" />);
    }
  }
}

module.exports = PasswordVerification;
