
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import CheckBox from '../view/checkbox';
import Input from '../view/input';
import Margin from '../view/margin';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TouchID from 'react-native-touch-id';

const errors = {
  "LAErrorAuthenticationFailed": "Authentication was not successful because the user failed to provide valid credentials.",
  "LAErrorUserCancel": "Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.",
  "LAErrorUserFallback": "Authentication was canceled because the user tapped the fallback button (Enter Password).",
  "LAErrorSystemCancel": "Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.",
  "LAErrorPasscodeNotSet": "Authentication could not start because the passcode is not set on the device.",
  "LAErrorTouchIDNotAvailable": "Authentication could not start because Touch ID is not available on the device",
  "LAErrorTouchIDNotEnrolled": "Authentication could not start because Touch ID has no enrolled fingers.",
  "RCTTouchIDUnknownError": "Could not authenticate for an unknown reason.",
  "RCTTouchIDNotSupported": "Device does not support Touch ID."
};

let subscriptions;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;


const {
  Text,
  View,
  ScrollView,
  StatusBar,
  DeviceEventEmitter,
  AsyncStorage,
  Alert,
  AlertIOS,
  Platform,
} = ReactNative;
const {Component} = React;

var obj;
class Register extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
    device: '',
    touchid: '',
    wechat: '',
    rememberusername: '',
    welcomescreen: '',
    pattern:'',
    };
    
    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
  }
  
  
  
  
  
  componentWillMount() {
    obj = this;
  }
  
  selectdevice() {
    if (this.state.device.length == 0) {
      this.setState({ device: '\u2714' });
    } else {
      this.setState({ device: '' });
    }
  }
  selecttouchid() {
    if (this.state.touchid.length == 0) {
      this._clickHandler();
    } else {
      this.setState({ touchid: '' });
      AsyncStorage.setItem("RPasswd", "empty");
    }
  }
  
  selectpattern() {
    if (this.state.pattern.length == 0) {
      this.doPatternSet();
    } else {
      this.setState({ pattern: '' });
       AsyncStorage.setItem("RPasswd", "empty");
    }
  }
  selectfb() {
    if (this.state.wechat.length == 0) {
      
      this.doFacebookLogin();
    } else {
      this.setState({ wechat: '' });
      var temp = this.props.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;
      respo[0].challenge = " ";
      respo[0].response = " ";
    }
  }
  selectrememberusername() {
    if (this.state.rememberusername.length == 0) {
      this.setState({ rememberusername: '\u2714' });
    } else {
      this.setState({ rememberusername: '' });
    }
  }
  selectwelcomescreen() {
    if (this.state.welcomescreen.length == 0) {
      this.setState({ welcomescreen: '\u2714' });
    } else {
      this.setState({ welcomescreen: '' });
    }
  }
  
  onSetPattern(data) {
    this.props.navigator.pop();
    this.setState({ pattern: '\u2714' });
  }
  
  onUpdateChallengeResponseStatus(e) {
    const res = JSON.parse(e.response);
    
    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    subscriptions.remove();
    
    console.log(res);
    
    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      console.log('UpdateAuthMachine - statusCode ' + statusCode);
      if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          console.log('UpdateAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;
          const nextChlngName = chlngJson.chlng[0].chlng_name;
          if (chlngJson != null) {
            console.log('UpdateAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
            //            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            //            this.props.navigator.push({
            //            id: 'UpdateMachine',
            //            title: nextChlngName,
            //            url: {
            //              chlngJson,
            //            screenId: nextChlngName,
            //              },
            //              });
          }
        } else {
          console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
          }
          alert(res.pArgs.response.StatusMsg);
          
          this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
          
        }
      } else {
        Alert.alert(
          'Error',
          res.pArgs.response.StatusMsg, [{
          text: 'OK',
          onPress: () => {
            var chlngJson;
            if (res.pArgs.response.ResponseData == null) {
            chlngJson = saveChallengeJson;
            } else {
            chlngJson = res.pArgs.response.ResponseData;
            }
            
            
            const currentChlng = challengeJsonArr[--currentIndex];
            for (var i = 0; i < chlngJson.chlng.length; i++) {
            var chlng = chlngJson.chlng[i];
            if (chlng.chlng_name === currentChlng.chlng_name) {
            
            } else {
            chlngJson.chlng.splice(i, 1);
            i--;
            }
            }
            
            
            
            
            const nextChlngName = chlngJson.chlng[0].chlng_name;
            if (chlngJson != null) {
            console.log('UpdateAuthMachine - onUpdateChallengeResponseStatus - chlngJson != null');
            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            this.props.navigator.push({
            id: 'UpdateMachine',
            title: nextChlngName,
            url: {
              chlngJson,
            screenId: nextChlngName,
              },
              });
            }
            
            
            },
          style: 'cancel',
            }]
          );
      }
    } else {
      console.log(e);
      alert('Internal system error occurred.' + res.errCode);
    }
  }
  
  doPatternSet() {
    this.props.navigator.push({
    id: 'pattern',
    onSetPattern: this.onSetPattern,
    mode: 'set'
      });
  }
  
  //Facebook login code
  doFacebookLogin() {
    $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result, error) => {
      {
      if (result.isCancelled) {
      alert('Login cancelled');
      } else {
      alert('Login success with permissions: '
        + result.grantedPermissions.toString());
      AccessToken.getCurrentAccessToken().then((data) => {
        $this.profileRequestParams = {
      fields: {
      string: "id, name, email, first_name, last_name, gender"
        }
        }
        
        $this.profileRequestConfig = {
      httpMethod: 'GET',
      version: 'v2.5',
      parameters: $this.profileRequestParams,
      accessToken: data.accessToken.toString()
        }
        
        $this.profileRequest = new GraphRequest(
          '/me',
          $this.profileRequestConfig,
          $this.facebookResponseCallback,
          );
        
        new GraphRequestManager().addRequest($this.profileRequest).start();
        }).done();
      }
      }
      }).done();
  }
  
  
  //Facebook login code
  facebookResponseCallback(error, result) {
    if (error) {
      alert(result);
      return (result)
    } else {
      alert(result);
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;
      this.setState({ wechat: '\u2714' });
      
      
      var temp = this.props.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;
      respo[0].challenge = "FB";
      respo[0].response = value;
      
      // this.props.tbacred.chlng_resp[0].challenge = key;
      //this.props.tbacred.chlng_resp[0].response = value;
      return (result)
    }
  }
  
  _clickHandler() {
    console.log(TouchID);
    TouchID.isSupported()
    .then(this.authenticate)
    .catch(error => {
      passcodeAuth();
      });
  }

  
  authenticate() {
    return TouchID.authenticate()
    .then(success => {
//      AlertIOS.alert('Authenticated Successfully');
      obj.encrypytPasswdiOS();
      })
    .catch(error => {
      console.log(error)
      AlertIOS.alert(error.message);
      });
  }
  
   passcodeAuth() {
    alert('in passcode touch not supported');
  }

  encrypytPasswdiOS() {
    
    if (Platform.OS === 'ios') {
    
    AsyncStorage.getItem('RPasswd').then((value) => {
        ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
          if (response) {
          console.log('immediate response of encrypt data packet is is' + response[0].error);
          AsyncStorage.setItem("RPasswd", response[0].response);
          obj.setState({ touchid: '\u2714' });
          } else {
          console.log('immediate response is' + response[0].response);
          }
          })
        
        }).done();
    }
  }
  
  
  doUpdate() {
    
    subscriptions = DeviceEventEmitter.addListener(
      'onUpdateChallengeStatus',
      this.onUpdateChallengeResponseStatus.bind(this)
      );
    
    
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.updateChallenges(JSON.stringify(this.props.url.chlngJson), value, (response) => {
        if (response[0].error === 0) {
        console.log('immediate response is' + response[0].error);
        } else {
        console.log('immediate response is' + response[0].error);
        alert(response[0].error);
        }
        });
      }).done();
  }
  
  render() {
    //     return (
    //         <View style={Skin.nwd.container}>
    //       <Title
    //       tital="Registration"></Title>
    //       <ScrollView
    //       scrollEnabled={true}
    //       showsVerticalScrollIndicator={false}
    //       >
    // <View style={Skin.nwd.scrollcontainer}>
    
    // <View>
    
    
    // </View>
    //       </ScrollView>
    //      </View>
    //             );
    
    return (
      <View style={Skin.layout1.wrap}>
      <StatusBar
      style={Skin.layout1.statusbar}
      backgroundColor={Skin.main.STATUS_BAR_BG}
      barStyle={'default'}
      />
      <View style={Skin.layout1.title.wrap}>
      <Title
      >Registration</Title>
      </View>
      <ScrollView style={Skin.layout1.content.scrollwrap}>
      <View style={Skin.layout1.content.wrap}>
      <View style={Skin.layout1.content.container}>
      <View>
      {
      // <CheckBox
      //       value={this.state.device}
      //       onSelect={this.selectdevice.bind(this) }
      //       lable="Make Device Permanent"/>
      }
      
      <CheckBox
      value={this.state.touchid}
      onSelect={this.selecttouchid.bind(this) }
      lable="Enable TouchID Login"/>
      
      <CheckBox
      value={this.state.pattern}
      onSelect={this.selectpattern.bind(this) }
      lable="Enable Pattern Login"/>
      
      <CheckBox
      value={this.state.wechat}
      onSelect={this.selectfb.bind(this) }
      lable="Enable FaceBook Login"/>
      
      {
      // <CheckBox
      //       value={this.state.rememberusername}
      //       onSelect={this.selectrememberusername.bind(this) }
      //       lable="Remember Username"/>
      
      // <CheckBox
      //       value={this.state.welcomescreen}
      //       onSelect={this.selectwelcomescreen.bind(this) }
      //       lable="Skip welcome screen"/>
      }
      
      
      </View>
      
      <Margin
      space={16}/>
      {
      // <Text >Default Login Credential</Text>
      
      // <Input
      //       placeholder={'Device Name'}
      //       />
      }
      
      
      </View>
      </View>
      </ScrollView>
      <View
      style={Skin.layout1.bottom.wrap}>
      <View style={Skin.layout1.bottom.container}>
      <Button
      label={Skin.text['1']['1'].submit_button}
      onPress={this.doUpdate.bind(this) }
      />
      </View>
      </View>
      <KeyboardSpacer topSpacing={-55}/>
      </View >
      );
  }
  
  
  
  
}

module.exports = Register;
