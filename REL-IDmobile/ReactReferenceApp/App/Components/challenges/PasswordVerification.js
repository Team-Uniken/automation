'use strict';

/*
 ALWAYS NEED
 */
import React from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
import TouchID from 'react-native-touch-id';
/*
 CALLED
 */
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
  TouchableOpacity,
  Alert,
} = React;


class PasswordVerification extends React.Component {
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
    };
  }
  
  componentDidMount() {
    obj = this;
    
    
    AsyncStorage.getItem("passwd").then((value) => {
                                        if(value){
                                        if(value == "empty"){
                                        //PROCEED NORMAL WAY.
                                        InteractionManager.runAfterInteractions(() => {
                                                                                this.refs.inputPassword.focus();
                                                                                });
                                        }else{
                                        
                                            if(Platform.OS == "ios"){
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
                                            else if(Platform.OS == "android"){
                                              this.state.inputPassword = value;
                                              this.checkPassword();
                                            }
                                        }
                                        }else{
                                        InteractionManager.runAfterInteractions(() => {
                                                                                this.refs.inputPassword.focus();
                                                                                });
                                        }
                                        
                                        }).done();
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
    AsyncStorage.getItem("UseTouchId").then((value) => {
                                            if(value === "NO"){
                                              this.checkPassword();
                                            }else{
                                                if(Platform.OS === 'ios'){
                                                  this.onVerifyTouchIdSupport();
                                                } else {
                                                //this.showSetPatternAlert();
                                                  this.checkPassword();
                                              }
                                            }
 
                                        }).done();
    }else{
      alert('Please enter password');
    }
  }
  
  
  checkPassword() {
    const pw = this.state.inputPassword;
    if (pw.length > 0) {
      Main.dnaPasswd = pw;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
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
  
  render() {
    return (
            <MainActivation navigator={this.props.navigator}>
            <View style={Skin.activationStyle.topGroup}>
                    <Animated.View style={[Skin.loadStyle.rid_wrap,{marginTop:70}]}>
                      <View style={Skin.loadStyle.rid_center}>
                        <Animated.Image source={require('../img/ubs.png')}
                          style={{width:120}} resizeMode={'contain'}
                        />
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
            placeholderTextColor={Skin.PLACEHOLDER_TEXT_COLOR_RGB}
            style={Skin.activationStyle.textinput}
            value={this.state.inputPassword}
            onSubmitEditing={this.decidePlatformAndShowAlert.bind(this)}
            onChange={this.onPasswordChange.bind(this)}
            />
            
            </View>
            </View>
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableOpacity
            style={Skin.activationStyle.button}
            onPress={this.decidePlatformAndShowAlert.bind(this)}
            underlayColor={Skin.login.BUTTON_UNDERLAY}
            activeOpacity={0.8}
            >
            <Text style={Skin.activationStyle.buttontext}>
            SUBMIT
            </Text>
            </TouchableOpacity>
            </View>
            </View>
            <Text style={Skin.activationStyle.warning_text}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
            <OpenLinks />
            </MainActivation>
            );
  }
}

module.exports = PasswordVerification;
