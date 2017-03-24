/**
 *  use to edit/update regisert option . 
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View, ScrollView, StatusBar, DeviceEventEmitter, AsyncStorage, Alert, AlertIOS, Platform, InteractionManager, BackAndroid, } from 'react-native';
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TouchID from 'react-native-touch-id';
import ModalPicker from 'react-native-modal-picker'
import { NativeModules, NativeEventEmitter } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';
import Main from '../Container/Main';
import Util from "../Utils/Util";



/*
 Custom View
 */
import Title from '../view/title';
import Button from '../view/button';
import Checkbox from '../view/checkbox';
import Input from '../view/input';
import Margin from '../view/margin';

/*
  INSTANCES
 */
let subscriptions;
let onGetRegistredDeviceDetailsSubscription;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onGetAllChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onUpdateChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onGetRegistredDeviceDetailsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;



var obj;
let onGetAllChallengeStatusSubscription;
let onUpdateChallengeStatusSubscription;

class RegisterOptionScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devbind: true,
      welcome: false,
      device: false,
      touchid: false,
      wechat: false,
      rememberusername: false,
      welcomescreen: false,
      pattern: false,
      facebook: false,
      refresh: false,
      defaultLogin: "",
      modalInitValue: "Select Default Login",
      devname: "Device Name",
      devnameopacity: 0,
      devid: 0,
      url: null,
      showOptions: false,
      initTouchAndPatternState: true,
      initFacebookState: true,
      isFacebookRegisteredWithServer: false,
      initDefaultLoginValue: true,
      open: false,
      rpass: null,
    };

    this.isTouchIDPresent = true;
    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.checkValidityOfAccessToken = this.checkValidityOfAccessToken.bind(this);
    this.onGetAllChallengeStatus = this.onGetAllChallengeStatus.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.close = this.close.bind(this);
    this.saveDefaultLoginPrefs = this.saveDefaultLoginPrefs.bind(this);
    this.renderIf = this.renderIf.bind(this);
    this.isTouchPresent = this.isTouchPresent.bind(this);
    this.getDeviceUUID = this.getDeviceUUID.bind(this);
    this.getRegisteredDeviceDetails = this.getRegisteredDeviceDetails.bind(this);
    this.onGetRegistredDeviceDetails = this.onGetRegistredDeviceDetails.bind(this);
  }

  /*
This is life cycle method of the react native component.
This method is called when the component will start to load
*/
  componentWillMount() {
    if (Platform.OS === "ios")
      this.isTouchPresent();

    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
      this.onGetAllChallengeStatus.bind(this));
    obj = this;

    this.getDeviceUUID();
  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component is Mounted/Loaded.
*/
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      return true;
    }.bind(this));
    InteractionManager.runAfterInteractions(() => {
      if (Main.isConnected) {
        Events.trigger('showLoader', true);
        ReactRdna.getAllChallenges(Main.dnaUserName, (response) => {
          if (response) {
            console.log('getAllChallenges immediate response is' + response[0].error);
          } else {
            console.log('s immediate response is' + response[0].error);
            Events.trigger('hideLoader', true);
          }
        });
      } else {
        Alert.alert(
          '',
          'Please check your internet connection',
          [
            { text: 'OK', onPress: () => this.props.navigator.pop(0) }
          ]
        );
      }


      AsyncStorage.getItem(Main.dnaUserName).then((userPrefs) => {
        if (userPrefs) {
          try {
            userPrefs = JSON.parse(userPrefs);
            this.state.defaultLogin = userPrefs.defaultLogin;
            this.setState({ modalInitValue: Skin.text['0']['2'].credTypes[userPrefs.defaultLogin].label });
          }
          catch (e) { }
        }
      });

      AsyncStorage.getItem('skipwelcome').then((value) => {
        if (value === "false" || value == null || value == undefined) {
          this.setState({ welcomescreen: '' });
          this.setState({ welcome: false });
        } else {
          this.setState({ welcomescreen: '\u2714' });
          this.setState({ welcome: true });
        }
      }).done();


      AsyncStorage.getItem('devname').then((value) => {
        if (value != null) {
          this.setState({ devname: value });
          this.setState({ devnameopacity: 1 });
        } else {
          this.setState({ devnameopacity: 0 });
        }
      }).done();


      AsyncStorage.getItem('rememberuser').then((value) => {
        if (value == null || value === 'empty') {
          obj.setState({ rememberusername: '' });
        } else {
          obj.setState({ rememberusername: '\u2714' });
        }
      });
    });
  }

  getDeviceUUID() {
    ReactRdna.getDeviceID((response) => {
      console.log(response);
      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      }
      else {
        this.state.devid = response[0].response;
        this.getRegisteredDeviceDetails();
      }
    });
  }

  //call getRegisteredDeviceDetails api.
  getRegisteredDeviceDetails() {
    if (onGetRegistredDeviceDetailsSubscription) {
      onGetRegistredDeviceDetailsSubscription.remove();
      onGetRegistredDeviceDetailsSubscription = null;
    }

    onGetRegistredDeviceDetailsSubscription = onGetRegistredDeviceDetailsModuleEvt.addListener('onGetRegistredDeviceDetails', this.onGetRegistredDeviceDetails);

    ReactRdna.getRegisteredDeviceDetails(Main.dnaUserName, (response) => {
      console.log('----- DeviceMgmt.getRegisteredDeviceDetails.response ');
      console.log(response);

      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      }
    });
  }

  //callback of getRegisteredDeviceDetails api.
  onGetRegistredDeviceDetails(e) {
    console.log('----- onGetRegistredDeviceDetails');
    if (onGetRegistredDeviceDetailsSubscription) {
      onGetRegistredDeviceDetailsSubscription.remove();
      onGetRegistredDeviceDetailsSubscription = null;
    }
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      var statusCode = res.pArgs.response.StatusCode;
      var deviceData = res.pArgs.response.ResponseData;
      if (deviceData && deviceData.device) {
        for (var i = 0; i < deviceData.device.length; i++) {
          var device = deviceData.device[i];
          if (device) {
            if (this.state.devid === device.devUUID) {
              var devName = device.devName;
              if (devName && devName.trim() !== "") {
                AsyncStorage.setItem("devname", devName).then(()=>{
                   this.state.devname = devName;
                   this.setState({ devname: devName, devnameopacity: 1 });
                });
              }
            }
          }
        }
      }
      //deviceHolderList = this.renderListViewData(devicesList.device);
    } else {
      console.log('Something went wrong');
    }
  }

  //Callback of getAllChallenges
  onGetAllChallengeStatus(e) {
    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    var $this = this;
    Events.trigger('hideLoader', true);
    this.state.showOptions = true;
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        var arrTba = new Array();
        const chlngJson = res.pArgs.response.ResponseData;
        for (var i = 0; i < chlngJson.chlng.length; i++) {
          if (chlngJson.chlng[i].chlng_name === 'secqa') {
            Main.enableUpdateSecqaOption = true;
          }

          if (chlngJson.chlng[i].chlng_name === 'tbacred')
            arrTba.push(chlngJson.chlng[i]);
        }

        if (typeof arrTba != 'undefined' && arrTba instanceof Array) {

          if (arrTba.length > 0) {
            AsyncStorage.getItem(Main.dnaUserName).then((value) => {
              if (value) {
                try {
                  value = JSON.parse(value);
                  this.state.rpass = value.RPasswd;
                  if (value.ERPasswd && value.ERPasswd !== "empty") {
                    this.state.url = { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true, "isSupported": $this.isTouchIDPresent } };
                    this.setState({ url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true, "isSupported": $this.isTouchIDPresent } } });
                  } else {

                    this.state.url = { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false, "isSupported": $this.isTouchIDPresent } };
                    this.setState({ url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false, "isSupported": $this.isTouchIDPresent } } });
                  }

                  // this.forceUpdate();
                } catch (e) { }
              }
            }).done();
          } else {
            this.props.navigator.pop();
          }
        } else {
          this.props.navigator.pop();
        }
      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }
  }

  //check device touchid feature supported or not
  isTouchPresent() {
    var $this = this;
    TouchID.isSupported()
      .then((supported) => {
        // Success code
        console.log('TouchID is supported.');
        $this.isTouchIDPresent = true;
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        $this.isTouchIDPresent = false;
      });
  }


  //back to dashboard on click of cross button or android back button.
  close() {
    this.doNavigateDashBoard();
  }

  //call when we cllck on touchid option
  selecttouchid() {
    if (this.state.touchid === false) {
      this._clickHandler();
    } else {
      if (this.state.defaultLogin === 'touchid') {
        this.state.defaultLogin = "none"
        this.setState({ modalInitValue: null }, () => {
          this.setState({ modalInitValue: "Select Default Login" });
        });
      }
      this.setState({ touchid: false });
      AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
    }
  }
  //call when we cllck on pattern option
  selectpattern() {
    if (this.state.pattern === false) {
      this.doPatternSet();
    } else {
      if (this.state.defaultLogin === 'pattern') {
        this.state.defaultLogin = "none"
        this.setState({ modalInitValue: null }, () => {
          this.setState({ modalInitValue: "Select Default Login" });
        });
      }

      this.setState({ pattern: false });
      AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
    }
  }

  selectMakePermanent() {

  }
  //call when we cllck on skipwelcome option
  selectskipwelcome() {
    if (this.state.welcome === false) {
      this.setState({ welcome: true });
    } else {
      this.setState({ welcome: false });
    }
  }
  //call when we cllck on facebook option
  selectfb() {
    if (this.state.wechat.length == 0) {
      this.doFacebookLogin();
    } else {
      this.setState({ wechat: '' });
      var temp = this.state.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;
      respo[0].challenge = " ";
      respo[0].response = " ";
    }
  }
  //call when we cllck on rememberuser option
  selectrememberusername() {
    if (this.state.rememberusername.length == 0) {
      this.setState({ rememberusername: '\u2714' });
      AsyncStorage.getItem('userId').then((value) => {
        AsyncStorage.setItem("rememberuser", value);
      });
    } else {
      this.setState({ rememberusername: '' });
      AsyncStorage.setItem("rememberuser", 'empty');
    }
  }

  // callback of pattern screen
  onSetPattern(data) {
    this.props.navigator.pop();
    this.setState({ pattern: true });
  }

  //show all login option and defaultLogin option
  getLoginOptions() {
    let index = 0;
    let data = [
      {
        key: 'title',
        section: true,
        label: 'Default Login Options'
      },
      {
        key: 'none',
        label: 'None'
      },
      Skin.text['0']['2'].credTypes['password']
    ];

    if (this.state.url) {
      for (var i = 0; i < this.state.url.chlngJson.chlng.length; i++) {
        var chlng = this.state.url.chlngJson.chlng[i];

        var promts;
        if (chlng.chlng_prompt[0].length > 0) {
          var promtsArr = chlng.chlng_prompt[0];
          for (var j = 0; j < promtsArr.length; j++) {
            promts = JSON.parse(promtsArr[j]);

            if (promts.is_registered == true && this.state.initDefaultLoginValue == true) {
              data.push({
                key: promts.cred_type, label: Skin.text['0']['2'].credTypes[promts.cred_type].label
              });
              this.state.initDefaultLoginValue = false;
            } else {
              if (this.state[promts.cred_type] === true) {
                data.push(Skin.text['0']['2'].credTypes[promts.cred_type]);
              }
            }
          }
        }
      }

      if (this.state.rpass !== "empty" && (this.state.rpass != null || this.state.rpass != undefined)) {
        if (Platform.OS === 'android') {
          if (this.state.pattern) {
            data.push(Skin.text['0']['2'].credTypes['pattern']);
          }
        } else {
          if (this.state.touchid) {
            data.push(Skin.text['0']['2'].credTypes['touchid']);
          }
        }
      }
    }
    return data
  }

  //call when we change defaultLogin option
  changeDefaultLogin(option) {
    this.state.defaultLogin = option.key;
    this.setState({ defaultLogin: option.key })
  }

  //call to save defaultLogin option 
  saveDefaultLoginPrefs() {
    if (this.state.defaultLogin) {
      var data = JSON.stringify({ defaultLogin: this.state.defaultLogin });
      AsyncStorage.mergeItem(Main.dnaUserName, data, null);
    }
  }

  onUpdateChallengeStatus(e) {
    const res = JSON.parse(e.response);
    Events.trigger('hideLoader', true);


    //    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    if (onUpdateChallengeStatusSubscription) {
      onUpdateChallengeStatusSubscription.remove();
      onUpdateChallengeStatusSubscription = null;
    }
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
          // alert(res.pArgs.response.StatusMsg);

          // this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          this.saveDefaultLoginPrefs();
          obj.doNavigateDashBoard();

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
                console.log('UpdateAuthMachine - onUpdateChallengeStatus - chlngJson != null');
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

  //navigate to pattern screen
  doPatternSet() {
    this.props.navigator.push({
      id: 'pattern',
      onSetPattern: this.onSetPattern,
      mode: 'set'
    });
  }

  checkValidityOfAccessToken() {
    var $this = this;
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        var callback = function (error, result) {
          if (error) {
            $this.doFacebookLogin();
          } else {
            $this.facebookResponseCallback(null, result)
          }
        }

        var config = {
          httpMethod: 'GET',
          version: 'v2.5',
          accessToken: data.accessToken.toString()
        }

        var request = new GraphRequest(
          '/me',
          config,
          callback
        );

        new GraphRequestManager().addRequest(request).start();
      }
      else {
        $this.doFacebookLogin();
      }
    });
  }

  //Facebook login code
  doFacebookLogin() {
    // Events.trigger('showLoader', true);
    var $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          Events.trigger('hideLoader', true);
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
      },
      function (error) {
        Events.trigger('hideLoader', true);
      }).done();
  }


  //Facebook login code
  facebookResponseCallback(error, result) {
    Events.trigger('hideLoader', true);
    if (error) {
      return (result)
    } else {
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;

      this.setState({ facebook: true });

      var temp = this.state.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;

      var promts = JSON.parse(temp[0].chlng_prompt[0]);
      respo[0].challenge = promts.cred_type;
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
        //AlertIOS.alert('Authenticated Successfully');
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
      AsyncStorage.getItem(Main.dnaUserName).then((value) => {
        if (value) {
          try {
            value = JSON.parse(value);
            //Todo: cleanup
            // ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value.RPasswd, (response) => {
            //   if (response) {
            //     console.log('immediate response of encrypt data packet is is' + response[0].error);
            //     AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: response[0].response }), null);
            //     obj.setState({ touchid: true });
            //   } else {
            //     console.log('immediate response is' + response[0].response);
            //   }
            // });

            Util.saveUserDataSecure("ERPasswd",value.RPasswd).then((result)=>{
              obj.setState({ touchid: true });
            }).done();
            
          } catch (e) { }
        }
      }).done();
    }
  }


  doUpdate() {
    if (this.state.welcome == true) {
      AsyncStorage.setItem("skipwelcome", "true");
    } else {
      AsyncStorage.setItem("skipwelcome", "false");
    }

    if (this.state.facebook != this.state.isFacebookRegisteredWithServer) {

      if (Main.isConnected) {
        //        subscriptions = DeviceEventEmitter.addListener(
        //          'onUpdateChallengeStatus',
        //          this.onUpdateChallengeResponseStatus.bind(this)
        //        );

        if (onUpdateChallengeStatusSubscription) {
          onUpdateChallengeStatusSubscription.remove();
          onUpdateChallengeStatusSubscription = null;
        }
        //        
        onUpdateChallengeStatusSubscription = onUpdateChallengeStatusModuleEvt.addListener('onUpdateChallengeStatus',
          this.onUpdateChallengeStatus.bind(this));


        AsyncStorage.getItem('userId').then((value) => {
          Events.trigger('showLoader', true);
          ReactRdna.updateChallenges(JSON.stringify(this.state.url.chlngJson), value, (response) => {
            if (response[0].error === 0) {
              console.log('immediate response is' + response[0].error);
            } else {
              Events.trigger('hideLoader', true);
              console.log('immediate response is' + response[0].error);
              alert(response[0].error);

            }
          });
        }).done();
      } else {

        Alert.alert(
          '',
          'Please check your internet connection',
          [
            { text: 'OK' }
          ]
        );
      }

    } else {
      this.saveDefaultLoginPrefs();
      this.doNavigateDashBoard();
    }
  }
  // navigate to dashboard
  doNavigateDashBoard() {
    this.props.navigator.popToTop();
  }

  selectCheckBox(args) {
    if (args === 'facebook') {
      if (this.state.facebook == false) {
        this.doFacebookLogin();
        //this.checkValidityOfAccessToken();
      } else {
        this.state.facebook = false;
        if (this.state.defaultLogin === 'facebook') {
          this.state.defaultLogin = "none"
          this.setState({ modalInitValue: null }, () => {
            this.setState({ modalInitValue: "Select Default Login" });
          });
        }

        this.setState({ facebook: false });
        var temp = this.state.url.chlngJson.chlng;
        var respo = temp[0].chlng_resp;
        respo[0].challenge = " ";
        respo[0].response = " ";
      }
    }
  }

  renderIf(condition, elements) {
    if (condition) {
      return elements;
    }
  }

  render() {
    if (this.state.url) {
      var indents = [];

      // Commented to hide make Permanent checkbox as suggested by James
      // indents.push(
      //   <Checkbox
      //     onSelect={this.selectMakePermanent.bind(this) }
      //     selected={this.state.devbind}
      //     labelSide={"right"}
      //     >
      //     Make Device Permanent
      //   </Checkbox>
      // );

      for (var i = 0; i < this.state.url.chlngJson.chlng.length; i++) {
        var chlng = this.state.url.chlngJson.chlng[i];

        var promts;
        if (chlng.chlng_prompt[0].length > 0) {
          var promtsArr = chlng.chlng_prompt[0];
          for (var j = 0; j < promtsArr.length; j++) {
            promts = JSON.parse(promtsArr[j]);



            if (this.state.initFacebookState === true) {
              this.state[promts.cred_type] = promts.is_registered;
              this.state.isFacebookRegisteredWithServer = promts.is_registered;
              this.state.initFacebookState = false;
            }

            indents.push(
              <Checkbox
                onSelect={() => { this.selectCheckBox(promts.cred_type) } }
                selected={this.state[promts.cred_type]}
                labelSide={"right"}
                >
                {"Enable " + Skin.text['0']['2'].credTypes[promts.cred_type].label + " Login"}
              </Checkbox>
            );
            // <CheckBox
            // value={this.state[promts[0].credType]}
            // onSelect={() => { this.selectCheckBox(promts[0].credType) } }
            // lable={"Enable " + Skin.text['0']['2'].credTypes[promts[0].credType].label + " Login"} />);
          }
        }
      }

      if (this.state.initTouchAndPatternState) {
        this.state.pattern = this.state.url.touchCred.isTouch;
        this.state.touchid = this.state.url.touchCred.isTouch;
        this.state.initTouchAndPatternState = false;
      }
      
      if (this.state.rpass !== "empty" && (this.state.rpass != null || this.state.rpass != undefined)) {
        if (Platform.OS === 'android') {
          indents.push(
            <Checkbox
              onSelect={this.selectpattern.bind(this) }
              selected={this.state.pattern}
              labelSide={"right"}
              >
              Enable Pattern Login
            </Checkbox>
          );
          // <CheckBox
          // value={this.state.pattern}
          // onSelect={this.selectpattern.bind(this) }
          // lable="Enable Pattern Login"/>);
        } else {
          if (this.isTouchIDPresent === true) {
            indents.push(
              <Checkbox
                onSelect={this.selecttouchid.bind(this) }
                selected={this.state.touchid}
                labelSide={"right"}
                >
                Enable TouchID Login
              </Checkbox>
            );
          }

          // <CheckBox
          // value={this.state.touchid}
          // onSelect={this.selecttouchid.bind(this) }
          // lable="Enable TouchID Login"/>);
        }
      }

      indents.push(
        <Checkbox
          onSelect={this.selectskipwelcome.bind(this) }
          selected={this.state.welcome}
          labelSide={"right"}
          >
          Skip welcome screen
        </Checkbox>
      );

      indents.push(
        <Checkbox
          onSelect={this.selectrememberusername.bind(this) }
          selected={this.state.rememberusername}
          labelSide={"right"}
          >
          Remember Username
        </Checkbox>
      );
    }

    return (
      <Main
        ref={'main'}
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'Profile & Settings',
          visible: true,
          tint: Skin.main.NAVBAR_TINT,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: this.props.navigator.pop,
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
        >
        <View style={{ flex: 1, backgroundColor: Skin.main.BACKGROUND_COLOR }}>
          <MainActivation>
            {this.renderIf(this.state.showOptions,
              <View style={[Skin.layout1.wrap, { marginTop: 20 }]}>
                <ScrollView style={Skin.layout1.content.scrollwrap}>
                  <View style={Skin.layout1.content.wrap}>
                    <View style={Skin.layout1.content.container}>
                      {indents}
                      <Margin
                        space={4}/>
                      <Text style={Skin.layout0.smalltext}>
                        Default Login Credential
                      </Text>
                      <ModalPicker
                        data={this.getLoginOptions() }
                        style={Skin.baseline.select.base}
                        selectStyle={Skin.baseline.select.select}
                        selectTextStyle={Skin.baseline.select.selectText}
                        initValue={this.state.modalInitValue}
                        onChange={(option) => {
                          this.changeDefaultLogin(option)
                        } } />
                      <Margin
                        space={4}/>
                      <Text style={[Skin.layout0.smalltext, { opacity: this.state.devnameopacity }]}>
                        Device Name
                      </Text>
                      <Text  style={[Skin.layout0.devname, { opacity: this.state.devnameopacity }]}>
                        {this.state.devname}
                      </Text>
                      <Margin
                        space={8}/>
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
            ) }
          </MainActivation>
        </View>
      </Main>
    );
  }
}

module.exports = RegisterOptionScene;


