//

// import React from 'react';
// import ReactNative from 'react-native';
// import Skin from '../../Skin';
// import Events from 'react-native-simple-events';
// import Title from '../view/title';
// import Button from '../view/button';
// import Checkbox from '../view/checkbox';
// import Input from '../view/input';
// import Margin from '../view/margin';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import TouchID from 'react-native-touch-id';
// import ModalPicker from 'react-native-modal-picker'

// const errors = {
//   "LAErrorAuthenticationFailed": "Authentication was not successful because the user failed to provide valid credentials.",
//   "LAErrorUserCancel": "Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.",
//   "LAErrorUserFallback": "Authentication was canceled because the user tapped the fallback button (Enter Password).",
//   "LAErrorSystemCancel": "Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.",
//   "LAErrorPasscodeNotSet": "Authentication could not start because the passcode is not set on the device.",
//   "LAErrorTouchIDNotAvailable": "Authentication could not start because Touch ID is not available on the device",
//   "LAErrorTouchIDNotEnrolled": "Authentication could not start because Touch ID has no enrolled fingers.",
//   "RCTTouchIDUnknownError": "Could not authenticate for an unknown reason.",
//   "RCTTouchIDNotSupported": "Device does not support Touch ID."
// };


// let subscriptions;

// const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
// const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

// //Facebook login code
// const FBSDK = require('react-native-fbsdk');
// const {LoginButton, LoginManager, GraphRequest, GraphRequestManager, AccessToken} = FBSDK;


// const {Text, TextInput, View, ScrollView, StatusBar, DeviceEventEmitter, AsyncStorage, Alert, AlertIOS, Platform, } = ReactNative;
// const {Component} = React;

// var obj;
// class Register extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       device: true,
//       touchid: false,
//       wechat: false,
//       rememberusername: true,
//       welcomescreen: true,
//       //pattern: '',
//       facebook: false,
//       refresh: '',
//       deviceName: '',
//       defaultLogin: '',
//     };

//     this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
//     this.onSetPattern = this.onSetPattern.bind(this);
//     this.close = this.close.bind(this);
//   }





//   componentWillMount() {

//     if (typeof this.props.url !== 'undefined') {
//       obj = this;
//       for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
//         var chlng = this.props.url.chlngJson.chlng[i];
//         var promts = chlng.chlng_prompt[0];

//         if (promts[0].isRegistered == true) {
//           if (this.props.url.touchCred.isTouch == false) {
//             this.props.parentnav.push({
//               id: 'Main',
//               title: 'DashBoard',
//               url: ''
//             });
//             break;
//           }
//         }
//       }
//     }
//   }

//   close() {
//     this.props.navigator.pop();
//   }
//   selectdevice() {
//     if (this.state.device.length == 0) {
//       this.setState({ device: '\u2714' });
//     } else {
//       this.setState({ device: '' });
//     }
//   }
//   selecttouchid() {
//     if (this.state.touchid) {
//       this._clickHandler();
//       /******
//       THis need to be a callback based onsuccess
//       ******/
//       this.setState({ touchid: true });

//     } else {
//       AsyncStorage.setItem("RPasswd", "empty");
//       this.setState({ touchid: false });
//     }
//   }

//   /*
//     selectpattern() {
//       if (this.state.pattern.length == 0) {
//         this.doPatternSet();
//       } else {
//         this.setState({ pattern: '' });
//         AsyncStorage.setItem("RPasswd", "empty");
//       }
//     }
//   */
//   selectfb() {
//     if (this.state.facebook) {
//       this.setState({ facebook: false });
//     } else {
//       this.doFacebookLogin();
//       /******
//       THis need to be a callback based onsuccess
//       ******/
//       this.setState({ facebook: true });
//     /*
//     var temp = this.props.url.chlngJson.chlng;
//     var respo = temp[0].chlng_resp;
//     respo[0].challenge = " ";
//     respo[0].response = " ";
//     */
//     }
//   }

//   selectrememberusername() {
//     this.setState({
//       rememberusername: !this.state.rememberusername
//     });
//   }
//   selectwelcomescreen() {
//     this.setState({ welcomescreen: !this.state.welcomescreen });
//   }



//   getLoginOptions() {
//     let index = 0;
//     let data = [
//       {
//         key: 'title',
//         section: true,
//         label: 'Default Login Options'
//       },
//       {
//         key: '',
//         label: 'None'
//       },
//       {
//         key: 'password',
//         label: 'Password'
//       }
//     ];

//     if (this.state.facebook) {
//       data.push({ key: 'facebook',label: 'Facebook' })
//     }
//     if (this.state.touchid) {
//       data.push({ key: 'touchid',label: 'TouchID' })
//     }
//     if (this.state.wechat) {
//       data.push({ key: 'wechat',label: 'WeChat' })
//     }
//     return data
//   }
//   changeDefaultLogin(option) {
//     this.setState({ defaultLogin: option.key })
//   }










//   onDeviceNameChange(event) {
//     this.setState({ deviceName: event.nativeEvent.text });
//   }

//   setDeviceName() {
//     const dName = this.state.deviceName;
//     if (dName.length > 0) {
//       responseJson = this.props.url.chlngJson;
//       responseJson.chlng_resp[0].response = dName;
//       Events.trigger('showNextChallenge', { response: responseJson });
//     } else {
//       alert('Please enter device name ');
//     }
//     dismissKeyboard();
//   }

//   onDeviceNameChangeText(event) {
//     this.setState({ deviceName: event.nativeEvent.text });
//   }






//   onSetPattern(data) {
//     this.props.navigator.pop();
//     this.setState({ pattern: '\u2714' });
//   }

//   onUpdateChallengeResponseStatus(e) {
//     const res = JSON.parse(e.response);

//     Events.trigger('hideLoader', true);
//     // Unregister All Events
//     // We can also unregister in componentWillUnmount
//     subscriptions.remove();

//     console.log(res);

//     if (res.errCode == 0) {
//       var statusCode = res.pArgs.response.StatusCode;
//       console.log('UpdateAuthMachine - statusCode ' + statusCode);
//       if (statusCode == 100) {
//         if (res.pArgs.response.ResponseData) {
//           console.log('UpdateAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
//           const chlngJson = res.pArgs.response.ResponseData;
//           const nextChlngName = chlngJson.chlng[0].chlng_name;
//           if (chlngJson != null) {
//             console.log('UpdateAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
//           //            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//           //            this.props.navigator.push({
//           //            id: 'UpdateMachine',
//           //            title: nextChlngName,
//           //            url: {
//           //              chlngJson,
//           //            screenId: nextChlngName,
//           //              },
//           //              });
//           }
//         } else {
//           console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
//           const pPort = res.pArgs.pxyDetails.port;
//           if (pPort > 0) {
//             RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => {
//             });
//           }
//           alert(res.pArgs.response.StatusMsg);

//           this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//           this.props.navigator.push({
//             id: 'Main',
//             title: 'DashBoard',
//             url: ''
//           });

//         }
//       } else {
//         Alert.alert(
//           'Error',
//           res.pArgs.response.StatusMsg, [{
//             text: 'OK',
//             onPress: () => {
//               var chlngJson;
//               if (res.pArgs.response.ResponseData == null) {
//                 chlngJson = saveChallengeJson;
//               } else {
//                 chlngJson = res.pArgs.response.ResponseData;
//               }


//               const currentChlng = challengeJsonArr[--currentIndex];
//               for (var i = 0; i < chlngJson.chlng.length; i++) {
//                 var chlng = chlngJson.chlng[i];
//                 if (chlng.chlng_name === currentChlng.chlng_name) {

//                 } else {
//                   chlngJson.chlng.splice(i, 1);
//                   i--;
//                 }
//               }




//               const nextChlngName = chlngJson.chlng[0].chlng_name;
//               if (chlngJson != null) {
//                 console.log('UpdateAuthMachine - onUpdateChallengeResponseStatus - chlngJson != null');
//                 //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//                 this.props.navigator.push({
//                   id: 'UpdateMachine',
//                   title: nextChlngName,
//                   url: {
//                     chlngJson,
//                     screenId: nextChlngName,
//                   },
//                 });
//               }


//             },
//             style: 'cancel',
//           }]
//         );
//       }
//     } else {
//       console.log(e);
//       alert('Internal system error occurred.' + res.errCode);
//     }
//   }

//   doPatternSet() {
//     this.props.navigator.push({
//       id: 'pattern',
//       onSetPattern: this.onSetPattern,
//       mode: 'set'
//     });
//   }

//   //Facebook login code
//   doFacebookLogin() {
//     $this = this;
//     LoginManager.logInWithReadPermissions(['public_profile']).then(
//       (result, error) => {
//         {
//         if (result.isCancelled) {
//           alert('Login cancelled');
//         } else {
//           alert('Login success with permissions: '
//             + result.grantedPermissions.toString());
//           AccessToken.getCurrentAccessToken().then((data) => {
//             $this.profileRequestParams = {
//               fields: {
//                 string: "id, name, email, first_name, last_name, gender"
//               }
//             }

//             $this.profileRequestConfig = {
//               httpMethod: 'GET',
//               version: 'v2.5',
//               parameters: $this.profileRequestParams,
//               accessToken: data.accessToken.toString()
//             }

//             $this.profileRequest = new GraphRequest(
//               '/me',
//               $this.profileRequestConfig,
//               $this.facebookResponseCallback,
//             );

//             new GraphRequestManager().addRequest($this.profileRequest).start();
//           }).done();
//         }
//         }
//       }).done();
//   }


//   //Facebook login code
//   facebookResponseCallback(error, result) {
//     if (error) {
//       alert(result);
//       return (result)
//     } else {
//       alert(result);
//       //fill response in challenge
//       var key = Skin.text['0']['2'].credTypes.facebook.key;
//       var value = result.id;
//       this.setState({ facebook: '\u2714' });


//       var temp = this.props.url.chlngJson.chlng;
//       var respo = temp[0].chlng_resp;
//       respo[0].challenge = "FB";
//       respo[0].response = value;

//       // this.props.tbacred.chlng_resp[0].challenge = key;
//       //this.props.tbacred.chlng_resp[0].response = value;
//       return (result)
//     }
//   }

//   _clickHandler() {
//     console.log(TouchID);
//     TouchID.isSupported()
//       .then(this.authenticate)
//       .catch(error => {
//         passcodeAuth();
//       });
//   }


//   authenticate() {
//     return TouchID.authenticate()
//       .then(success => {
//         //      AlertIOS.alert('Authenticated Successfully');
//         obj.encrypytPasswdiOS();
//       })
//       .catch(error => {
//         console.log(error)
//         AlertIOS.alert(error.message);
//       });
//   }

//   passcodeAuth() {
//     alert('in passcode touch not supported');
//   }

//   encrypytPasswdiOS() {

//     if (Platform.OS === 'ios') {

//       AsyncStorage.getItem('RPasswd').then((value) => {
//         ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
//           if (response) {
//             console.log('immediate response of encrypt data packet is is' + response[0].error);
//             AsyncStorage.setItem("ERPasswd", response[0].response);
//             obj.setState({ touchid: '\u2714' });
//           } else {
//             console.log('immediate response is' + response[0].response);
//           }
//         })

//       }).done();
//     }
//   }


//   doUpdate() {

//     subscriptions = DeviceEventEmitter.addListener(
//       'onUpdateChallengeStatus',
//       this.onUpdateChallengeResponseStatus.bind(this)
//     );

//     AsyncStorage.getItem('userId').then((value) => {
//       ReactRdna.updateChallenges(JSON.stringify(this.props.url.chlngJson), value, (response) => {
//         if (response[0].error === 0) {
//           console.log('immediate response is' + response[0].error);
//         } else {
//           console.log('immediate response is' + response[0].error);
//           alert(response[0].error);
//         }
//       });
//     }).done();
//   }

//   /*
//   var indents = [];
//     for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
//       var chlng = this.props.url.chlngJson.chlng[i];
//       var promts =chlng.chlng_prompt[0];

//       if(promts[0].isRegistered == false){
//         indents.push(<CheckBox
//           value={this.state[promts[0].credType]}
//           onSelect={() => {this.selectCheckBox(promts[0].credType)} }
//           lable={"Enable "+Skin.text['0']['2'].credTypes[promts[0].credType].label+" Login"} />);

//       }

//     }

//     if(this.props.url.touchCred.isTouch == true){
//       if(Platform.OS === 'android'){
//       indents.push( <CheckBox
//         value={this.state.pattern}
//         onSelect={this.selectpattern.bind(this) }
//         lable="Enable Pattern Login"/>);
//       }else{
//       indents.push( <CheckBox
//         value={this.state.touchid}
//         onSelect={this.selecttouchid.bind(this) }
//         lable="Enable TouchID Login"/>);

//       }
//     */



//   render() {
//     return (
//       <View style={Skin.layout1.wrap}>
//         <StatusBar
//           style={Skin.layout1.statusbar}
//           backgroundColor={Skin.main.STATUS_BAR_BG}
//           barStyle={'default'} />
//         <View style={Skin.layout1.title.wrap}>
//           <Title onClose={() => {
//                             this.close();
//                           }}>
//             Settings
//           </Title>
//         </View>
//         <ScrollView style={Skin.layout1.content.scrollwrap}>
//           <View style={Skin.layout1.content.wrap}>
//             <View style={Skin.layout1.content.container}>
//               <Checkbox
//                 onSelect={this.selectdevice.bind(this)}
//                 selected={this.state.device}
//                 labelSide={"right"}>
//                 Make Device Permanent
//               </Checkbox>
//               <Checkbox
//                 onSelect={this.selecttouchid.bind(this)}
//                 selected={this.state.touchid}
//                 labelSide={"right"}>
//                 Enable TouchID Login
//               </Checkbox>
//               <Checkbox
//                 onSelect={this.selectfb.bind(this)}
//                 selected={this.state.facebook}
//                 labelSide={"right"}>
//                 Enable Facebook Login
//               </Checkbox>
//               <Checkbox
//                 onSelect={this.selectrememberusername.bind(this)}
//                 selected={this.state.rememberusername}
//                 labelSide={"right"}>
//                 Remember Username
//               </Checkbox>
//               <Checkbox
//                 onSelect={this.selectwelcomescreen.bind(this)}
//                 selected={this.state.welcomescreen}
//                 labelSide={"right"}>
//                 Skip Welcome Screen
//               </Checkbox>
//               <Input
//                 ref='inputDeviceName'
//                 returnKeyType={'done'}
//                 keyboardType={'default'}
//                 placeholder={'Device Name'}
//                 value={this.state.inputDeviceName}
//                 onChange={this.onDeviceNameChange.bind(this)} />
//               <ModalPicker
//                 data={this.getLoginOptions()}
//                 style={Skin.baseline.select.base}
//                 selectStyle={Skin.baseline.select.select}
//                 selectTextStyle={Skin.baseline.select.selectText}
//                 initValue="Select Default Login"
//                 onChange={(option) => {
//                             this.changeDefaultLogin(option)
//                           }} />
//             </View>
//           </View>
//         </ScrollView>
//         <View style={Skin.layout1.bottom.wrap}>
//           <View style={Skin.layout1.bottom.container}>
//             <Button
//               label={Skin.text['1']['4'].submit_button}
//               onPress={this.doUpdate.bind(this)} />
//           </View>
//         </View>
//         <KeyboardSpacer topSpacing={-55} />
//       </View>
//     )
//   }
// }

// module.exports = Register;



import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
//import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import Checkbox from '../view/checkbox';
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
      device: false,
      touchid:false,
      wechat: false,
      rememberusername: false,
      welcomescreen:false,
      pattern: false,
      facebook:false,
      refresh: false,
    };

    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.close = this.close.bind(this);
  }

  componentWillMount() {
    obj = this;

    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];
      var promts = chlng.chlng_prompt[0];

      if (promts[0].isRegistered == true) {
        if (this.props.url.touchCred.isTouch == false) {
          this.props.parentnav.push({ id: 'Main', title: 'DashBoard', url: '' });
          break;
        }
      }

    }
  }

  close() {
    this.props.parentnav.push({ id: 'Main', title: 'DashBoard', url: '' });
  }
  selectdevice() {
    if (this.state.device.length == 0) {
      this.setState({ device: true });
    } else {
      this.setState({ device: false });
    }
  }
  selecttouchid() {
    if (this.state.touchid === false) {
      this._clickHandler();
    } else {
      this.setState({ touchid: false });
      AsyncStorage.setItem("RPasswd", "empty");
    }
  }

  selectpattern() {
    if (this.state.pattern === false) {
      this.doPatternSet();
    } else {
      this.setState({ pattern: false });
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
    this.setState({ pattern: true });
  }

  onUpdateChallengeResponseStatus(e) {
    const res = JSON.parse(e.response);

//    Events.trigger('hideLoader', true);
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

          } else {
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
      return (result)
    } else {
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;
      this.setState({ facebook: true });

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
  }

  encrypytPasswdiOS() {

    if (Platform.OS === 'ios') {

      AsyncStorage.getItem('RPasswd').then((value) => {
        ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
          if (response) {
            console.log('immediate response of encrypt data packet is is' + response[0].error);
            AsyncStorage.setItem("ERPasswd", response[0].response);
            obj.setState({ touchid: true });
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


  selectCheckBox(args) {
    if (args === 'facebook') {
      if (this.state.facebook == false) {
        this.doFacebookLogin();
      } else {
        this.setState({ facebook: false });
        var temp = this.props.url.chlngJson.chlng;
        var respo = temp[0].chlng_resp;
        respo[0].challenge = " ";
        respo[0].response = " ";
      }
    }
  }

  render() {
    var indents = [];
    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];
      var promts = chlng.chlng_prompt[0];

      if (promts[0].isRegistered == false) {
        indents.push(
              <Checkbox
                 onSelect={() => { this.selectCheckBox(promts[0].credType) }}
                 selected={this.state[promts[0].credType]}
                 labelSide={"right"}
                 lable={"Enable " + Skin.text['0']['2'].credTypes[promts[0].credType].label + " Login"}>
               </Checkbox>
        );
          // <CheckBox
          // value={this.state[promts[0].credType]}
          // onSelect={() => { this.selectCheckBox(promts[0].credType) } }
          // lable={"Enable " + Skin.text['0']['2'].credTypes[promts[0].credType].label + " Login"} />);
      }
    }

    if (this.props.url.touchCred.isTouch == true) {
      if (Platform.OS === 'android') {
        indents.push(
          <Checkbox
                 onSelect={this.selectpattern.bind(this) }
                 selected={this.state.pattern}
                 labelSide={"right"}
                 lable="Enable Pattern Login">
               </Checkbox>
        );
          // <CheckBox
          // value={this.state.pattern}
          // onSelect={this.selectpattern.bind(this) }
          // lable="Enable Pattern Login"/>);
      } else {
        indents.push(
          <Checkbox
                 onSelect={this.selecttouchid.bind(this) }
                 selected={this.state.touchid}
                 labelSide={"right"}
                 lable="Enable TouchID Login">
               </Checkbox>
        );
          
          // <CheckBox
          // value={this.state.touchid}
          // onSelect={this.selecttouchid.bind(this) }
          // lable="Enable TouchID Login"/>);
      }
    }

    return (
      <View style={Skin.layout1.wrap}>
        <StatusBar
          style={Skin.layout1.statusbar}
          backgroundColor={Skin.main.STATUS_BAR_BG}
          barStyle={'default'}
          />
        <View style={Skin.layout1.title.wrap}>
          <Title onClose={() => { this.close(); } }
            >Registration</Title>
        </View>
        <ScrollView style={Skin.layout1.content.scrollwrap}>
          <View style={Skin.layout1.content.wrap}>
            <View style={Skin.layout1.content.container}>
              {indents}
              <Margin
                space={16}/>
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

