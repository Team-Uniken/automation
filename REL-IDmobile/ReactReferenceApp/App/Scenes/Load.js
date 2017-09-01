/**
 * this is a first screen after index.
 * hear we do initialization and on it success we go to stateMachine which decide which challenge show first.
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
import Events from 'react-native-simple-events';
import Config from 'react-native-config';
import TouchID from 'react-native-touch-id';
import TouchId from 'react-native-smart-touch-id'
import Toast from 'react-native-simple-toast';
var PushNotification = require('react-native-push-notification');
import {Text, DeviceEventEmitter, View, NetInfo, Animated, InteractionManager, TouchableHighlight, AppState, Image, Easing, AsyncStorage, Alert, Platform, BackHandler, StatusBar, PushNotificationIOS, AppStateIOS, AlertIOS, StyleSheet, } from 'react-native'
import { NativeModules, NativeEventEmitter } from 'react-native'
import {Navigator} from 'react-native-deprecated-custom-components'


/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
import MainActivation from '../Components/Container/MainActivation';
import Setting from '../Components/view/setting';
import Version from '../Components/view/version';
import Web from './Web';
import {ClientBasedConfig} from '../Components/Utils/LocalConfig';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const Spinner = require('react-native-spinkit');



/*
  INSTANCES
 */
const reason = 'Please validate your Touch Id';
let initSuc = false;
let isRunAfterInteractions = false;
let initCount = 0;
let initSuccess = 2;
let initError = 3;
let Obj;
let responseJson;
let chlngJson;
let nextChlngName;
let initErrorMsg;
let onInitCompletedListener;
let onPauseCompletedListener;
let onResumeCompletedListener;
let savedUserName;
let appalive = false;
let obj1;
let onInitializeSubscription;
let onPauseCompletedSubscription;
let onResumeCompletedSubscription;
let onTerminateSubscription;
let onSessionTimeoutSubscription;
let appState;
let savedNotification;

const onPauseCompletedModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onResumeCompletedModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onInitializeCompletedModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onTerminateCompletedModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onSessionTimeoutModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)


/**
 * Return flavour specific connectionProfile and load image.
 */

var erelid = ClientBasedConfig.connectionProfile;
var welcome = ClientBasedConfig.img.welcome;
var sslCertificate = ClientBasedConfig.sslCertificate;

//disable console.log
//console.log = function () { }

BackHandler.addEventListener('hardwareBackPress', function () {
  return true;
});


class Load extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // r_opac_val: new Animated.Value(0),
      // i_opac_val: new Animated.Value(0),
      // d_opac_val: new Animated.Value(0),
      // relid_text_opac: new Animated.Value(0),
      // rid_top: new Animated.Value(150),
      // r_text_opac: new Animated.Value(0),
      // i_text_opac: new Animated.Value(0),
      // d_text_opac: new Animated.Value(0),
      // relid_opac_val: new Animated.Value(0),
      steps: new Animated.Value(0),
      value: 0,
      spinnerIsVisible: true,
      spinnerSize: 50,
      spinnnerType: 'ThreeBounce',
      animatedTextValue: new Animated.Value(0),
    };

    this.textRange = ['Checking device for issues', 'Verifying device identity', 'Verifying app identity'];
  }
  openRoute(route) {
    this.props.navigator.push(route);
  }
  //use to clear twoFactorAuthMachine navigator
  closeStateMachine() {
    console.log('---------- closeStateMachine ');
    var allScreens = obj1.props.navigator.getCurrentRoutes(-1);
    for (var i = allScreens.length - 1; i >= 0; i--) {
      var screen = allScreens[i];
      if (screen.id === 'Load') {
        var mySelectedRoute = obj1.props.navigator.getCurrentRoutes()[i];
        obj1.props.navigator.replace(mySelectedRoute);
        //return;
      }
    }

    obj1.props.navigator.resetTo({
      id: "Welcome_Screen",
      //id: "Select_Login",
      title: "nextChlngName",
      url: {
        "chlngJson": chlngJson,
        "screenId": nextChlngName
      }
    });
  }

  animate() {
    this.state.steps.addListener(({value}) => this.setState({ value: this.textRange[parseInt(value, 10)] }));
    Animated.sequence([

      Animated.timing(this.state.steps, {
        toValue: 5,
        duration: 6000
      }),

    ]).start();
  }

  sessionTimeOutAction() {
    setTimeout(() => {
      Toast.showWithGravity("Your session has been timed out", Toast.LONG, Toast.BOTTOM);
      Obj.doInitialize();
    }, 100);
  }

  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {

    Main.notificationId = null;
    obj1 = this;
    Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);
    console.log('test logs');
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', (token) => console.log('TOKEN', token))
      PushNotificationIOS.addEventListener('notification', this._onNotification);
      PushNotificationIOS.requestPermissions();
      PushNotificationIOS.getInitialNotification()
        .then((notification) => {

          // usually there is no notification; don't act in those scenarios
          if (!notification || notification === null || !notification.hasOwnProperty('_data')) {
            return;
          }
          Main.notificationId = notification._data.hiddenMessage;
        });
    } else {
      //Android push notification listeners to be added here.
    }
    NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange.bind());
    NetInfo.isConnected.fetch().done(this._handleConnectivityChange);
  }

  _handleConnectivityChange(isConnected) {

    if (__DEV__) {
      Main.isConnected = true;
    } else
      Main.isConnected = isConnected;
  }

  _onNotification(notification) {
    savedNotification = notification;
    Main.gotNotification = false;//for screen hide on notification make Main.gotNotification = true

    if (appState == 'inactive' || appState == 'background') {
      Main.notificationId = notification._data.hiddenMessage;
    }

    if (appalive == true || Config.ENABLE_PAUSE === "false") {
      var allScreens = Obj.props.navigator.getCurrentRoutes(0);
      var isMainScreen = false;
      for (var i = 0; i < allScreens.length; i++) {
        var screen = allScreens[i];
        if (screen.id == 'Main') {
          isMainScreen = true;
          console.log('-----getMyNotifications called when notication comes-----');
          Obj.getMyNotifications();
          break;
        }
      }
      if (isMainScreen == false) {
        Obj.showNotificationAlert(notification);
      }

    }
  }

  showNotificationAlert(notification) {
    var msg = "";
    if (Platform.OS === 'ios')
      msg = notification.getMessage();
    else
      msg = notification.message;
    setTimeout(() => {
      Alert.alert(
        '',
        msg, [{
          text: 'Dismiss',
          onPress: null,
        }]
      );
    }, 100);
  }

  //Call getNotifications api.
  getMyNotifications() {
    var recordCount = "0";
    var startIndex = "1";
    var enterpriseID = "";
    var startDate = "";
    var endDate = "";
    ReactRdna.getNotifications(recordCount, startIndex, enterpriseID, startDate, endDate, (response) => {

      console.log('----- NotificationMgmt.getMyNotifications.response ');
      console.log(response);
      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      }
 
    });
  }

  onSessionTimeout(e) {
    if (onSessionTimeoutSubscription) {
      console.log("--------------- removing onSessionTimeoutSubscription");
      onSessionTimeoutSubscription.remove();
      onSessionTimeoutSubscription = null;
    }

    Obj.sessionTimeOutAction();
  }

  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    Obj = this;
    //push messgage adnorid configure starts
    if (Platform.OS === 'android') {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          console.log('TOKEN:', token);
          ReactRdna.setDevToken(JSON.stringify(token));
        },
        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
           savedNotification = notification;
          if (notification.userInteraction == true) {
            Main.notificationId = notification.hiddenMessage;
          }

          Main.gotNotification = false;//for screen hide on notification make Main.gotNotification = true
          console.log('NOTIFICATION:', notification);
          // alert("calling getNotifications = " + (global.savedContext == null || global.savedContext==undefined));
          // if (global.savedContext == null || global.savedContext == undefined) {
          //   //alert("callnotification");
          //   Obj.getMyNotifications();
          // }

          if (appalive == true || Config.ENABLE_PAUSE === "false") {
            var allScreens = Obj.props.navigator.getCurrentRoutes(0);
            var isMainScreen = false;
            for (var i = 0; i < allScreens.length; i++) {
              var screen = allScreens[i];
              if (screen.id == 'Main') {
                isMainScreen = true;
                console.log('-----getMyNotifications called when notication comes-----');
                Obj.getMyNotifications();
                break;
              }
            }
            if (isMainScreen == false) {
              Obj.showNotificationAlert(notification);
            }

          }
          //else{
          // ReactRdna.resumeRuntime(global.savedContext, null, (response) => {
          //     if (response) {
          //       //Main.isPaused = false;
          //       console.log('Immediate response is ' + response[0].error);
          //     } else {
          //       console.log('No response.');
          //     }
          //   });
          //}

          // Obj.getMyNotifications();

          /**
                * Notification.create({ 
                subject:'RelidZeroTesting',
                message: 'test messg' }).then(function(notification) {
              console.log(notification);
              console.log(notification.message);
            });
                */
        },

        // ANDROID ONLY: (optional) GCM Sender ID.
        senderID: Config.GCM_SENDER_ID,

        /**
         *  // IOS ONLY (optional): default: all - Permissions to register.
         permissions: {
             alert: true,
             badge: true,
             sound: true
         },  
         */

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: true,
      });

    }
    //android push message configure Ends

    AppState.removeEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('change', this._handleAppStateChange);

    if (onPauseCompletedSubscription) {
      console.log("--------------- removing onPauseCompleted");
      onPauseCompletedSubscription.remove();
      onPauseCompletedSubscription = null;
    }

    if (onResumeCompletedSubscription) {
      onResumeCompletedSubscription.remove();
      onResumeCompletedSubscription = null;
    }

    if (onTerminateSubscription) {
      onTerminateSubscription.remove();
      onTerminateSubscription = null;
    }


    onPauseCompletedSubscription = onPauseCompletedModuleEvt.addListener('onPauseCompleted', function (e) {
      //    onPauseCompletedSubscription.remove();
      //    onPauseCompletedListener = DeviceEventEmitter.addListener('onPauseCompleted', function (e) {
      Events.trigger("showLoader", true);
      appalive = false;
      console.log('On Pause Completed:');
      console.log('immediate response is' + e.response);
      responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        if (AppState.currentState == 'active' && global.savedContext) {
          ReactRdna.resumeRuntime(global.savedContext, null, (response) => {
            if (response) {
              //Main.isPaused = false;
              console.log('Immediate response is ' + response[0].error);
            } else {
              console.log('No response.');
            }
          });
        }
        console.log('Pause Successfull');
      } else {
        setTimeout(() => {
          alert('Failed to Pause with Error ' + responseJson.errCode);
        }, 100);
      }
    });

    onTerminateSubscription = onTerminateCompletedModuleEvt.addListener('onTerminateCompleted', function (e) {

      //      Obj.doInitialize();
    });

    onResumeCompletedSubscription = onResumeCompletedModuleEvt.addListener('onResumeCompleted', function (e) {
      //    onResumeCompletedSubscription.remove();
      //    onResumeCompletedListener = DeviceEventEmitter.addListener('onResumeCompleted', function (e) {
      Events.trigger("hideLoader", true);
      console.log('On Resume Completed:');
      console.log('immediate response is' + e.response);
      responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        global.savedContext = null;
        const pPort = responseJson.pArgs.pxyDetails.port;
        if (pPort > 0) {
          RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
          global.proxy = pPort;
        }
        appalive = true;
        console.log('Resume Successfull');


        var allScreens = Obj.props.navigator.getCurrentRoutes(0);
        var isMainScreen = false;
        for (var i = 0; i < allScreens.length; i++) {
          var screen = allScreens[i];
          if (screen.id == 'Main') {
            isMainScreen = true;
            console.log('-----getMyNotifications called when notication comes-----');
            Obj.getMyNotifications();
            break;
          }
        }
        if (isMainScreen == false) {
          Obj.showNotificationAlert(savedNotification);
        }

        AsyncStorage.setItem("savedContext", "");
      } else {
        AsyncStorage.setItem("savedContext", "");
        setTimeout(() => {
          alert('Failed to Resume with Error ' + responseJson.errCode + '. Please restart application.');
        }, 100);
      }
    });


    if (onInitializeSubscription) {
      onInitializeSubscription.remove();
      onInitializeSubscription = null;
    }


    onInitializeSubscription = onInitializeCompletedModuleEvt.addListener('onInitializeCompleted', function (e) {
      //      if (onInitializeSubscription) {
      //        onInitializeSubscription.remove();
      //        onInitializeSubscription = null;
      //      }
      onSessionTimeoutSubscription = onSessionTimeoutModuleEvt.addListener('onSessionTimeout',
        Obj.onSessionTimeout.bind(Obj));
      AsyncStorage.setItem("savedContext", "");
      console.log('On Initialize Completed:');
      console.log('immediate response is' + e.response);
      responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        appalive = true;
        initCount = initSuccess;
        chlngJson = responseJson.pArgs.response.ResponseData;
        nextChlngName = chlngJson.chlng[0].chlng_name
        const pPort = responseJson.pArgs.pxyDetails.port;
        if (pPort > 0) {
          RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => {
          });
        }

        InteractionManager.runAfterInteractions(() => {
          isRunAfterInteractions = true;
          Obj.onInitCompleted();
        });
        console.log('--------- onInitializeCompleted initCount ' + initCount);
      } else {
        initCount = initError;
        initErrorMsg = 'Unable to connect to server, please check the connection profile. Error code ' + responseJson.errCode;
        console.log('--------- onInitializeCompleted initCount ' + initCount);
        InteractionManager.runAfterInteractions(() => {
          isRunAfterInteractions = true;
          Obj.onInitCompleted();
        });
      }
    });

    AsyncStorage.getItem('ConnectionProfiles', (err, profiles) => {
      console.log('get Item, Connection Profiles:');
      profiles = JSON.parse(profiles);
      console.log(profiles);
      if ((profiles == null) || (profiles.length == 0)) {
        console.log("NOT FOUND !!!!!!!!, hence import connection profiles now");

        var profileArray = erelid.Profiles;
        var relidArray = erelid.RelIds;

        for (let i = 0; i < profileArray.length; i++) {
          var RelIdName = profileArray[i].RelId;

          for (let j = 0; j < relidArray.length; j++) {
            if (RelIdName === relidArray[j].Name) {
              profileArray[i].RelId = relidArray[j].RelId;
              profileArray[i].imported = "true"
              profileArray[i].sslEnable = false
            }
          }
        }

        AsyncStorage.setItem('ConnectionProfiles', JSON.stringify(profileArray), () => {

          AsyncStorage.getItem('ConnectionProfiles', (err, importedProfiles) => {
            importedProfiles = JSON.parse(importedProfiles);

            AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(importedProfiles[0]), () => {
              this.doInitialize();

            });
          });
        });

      } else {

        AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
          currentProfile = JSON.parse(currentProfile);
          console.log(currentProfile);
          if (currentProfile != null && currentProfile != undefined) {
            this.doInitialize();
          } else {

            AsyncStorage.getItem('ConnectionProfiles', (err, importedProfiles) => {
              importedProfiles = JSON.parse(importedProfiles);

              AsyncStorage.setItem('CurrentConnectionProfile', JSON.stringify(importedProfiles[0]), () => {
                this.doInitialize();
              });
            });
          }
        });
      }
    });

    // Animated.sequence([
    //   Animated.parallel([
    //     Animated.timing(this.state.r_opac_val, {
    //       toValue: 1,
    //       duration: 2000 * Skin.spd,
    //       delay: 1000 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.r_text_opac, {
    //       toValue: 1,
    //       duration: 2000 * Skin.spd,
    //       delay: 1000 * Skin.spd,
    //     }),
    //   ]),
    //   Animated.parallel([
    //     Animated.timing(this.state.r_text_opac, {
    //       toValue: 0,
    //       duration: 500 * Skin.spd,
    //       delay: 1000 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.i_opac_val, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.i_text_opac, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //   ]),
    //   Animated.parallel([
    //     Animated.timing(this.state.i_text_opac, {
    //       toValue: 0,
    //       duration: 500 * Skin.spd,
    //       delay: 1000 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.d_opac_val, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.d_text_opac, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //   ]),
    //   Animated.parallel([
    //     Animated.timing(this.state.d_text_opac, {
    //       toValue: 0,
    //       duration: 500 * Skin.spd,
    //       delay: 1000 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.relid_opac_val, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //     Animated.timing(this.state.relid_text_opac, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //   ]),
    //   Animated.parallel([
    //     Animated.timing(this.state.relid_text_opac, {
    //       toValue: 1,
    //       duration: 500 * Skin.spd,
    //       delay: 1500 * Skin.spd,
    //     }),
    //   ])
    // ]).start();

    if (Config.ENABLESTARTUPANIMATION)
      this.animate();
  }
  /*
   This is life cycle method of the react native component.
   This method is called when app state get change like pause, resume
 */
  _handleAppStateChange(currentAppState) {
    console.log('_handleAppStateChange = ' + currentAppState);
    console.log(currentAppState);
    appState = currentAppState;

    if (currentAppState == 'background') {
      console.log('App State Change background:');
      if (Config.ENABLE_PAUSE === "true") {
        if (Main.isApiRunning == false) {
          ReactRdna.pauseRuntime((response) => {
            if (response) {
              if (response[0].error == 0) {
                // Main.isPaused = true;
                //AsyncStorage.setItem("savedContext", response[0].response);
                global.savedContext = response[0].response;
              }
              console.log('Immediate response is ' + response[0].error);
            } else {
              console.log('No response.');
            }
          });
        }
      }
    } else if (currentAppState == 'active') {
      console.log('App State Change active:');
      if (Config.ENABLE_PAUSE === "true") {
        // if (Main.isPaused === true) {
        // AsyncStorage.getItem("savedContext").then((value) => {
        if (global.savedContext != null && global.savedContext != undefined) {
          ReactRdna.resumeRuntime(global.savedContext, null, (response) => {
            if (response) {
              //Main.isPaused = false
              console.log('Immediate response is ' + response[0].error);
            } else {
              console.log('No response.');
            }
          });
        }
        // }).done();
        // }
      }
    } else if (currentAppState === 'inactive') {
      console.log('App State Change Inactive');
    }
  }

  //Perform RDNA.Initialize().
  doInitialize() {
    initSuc = false;
    isRunAfterInteractions = false;
    initCount = 0;
    console.log('------------Initialize RDNA');
    var proxySettings; //= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
    var sslDetails;
    var jsonProxySettings = JSON.stringify(proxySettings);
    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      console.log('Initialize RDNA - get Item CurrentConnectionProfile:');
      currentProfile = JSON.parse(currentProfile);
      let currentAgentInfo = currentProfile.RelId;
      let currentGatewayHost = currentProfile.Host;
      var currentGatewayPort = currentProfile.Port;
      if (Platform.OS === 'android') {
        currentGatewayPort = parseInt(currentGatewayPort);
      }
      Main.gatewayHost = currentGatewayHost;
      Main.gatewayPort = currentGatewayPort;

      sslCertificate.data.then((sslDetails) => {
        sslDetails = currentProfile.sslEnable ? JSON.stringify({ 'data': sslDetails, 'password': sslCertificate.password }) : null;
        ReactRdna.initialize(currentAgentInfo, currentGatewayHost, currentGatewayPort, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, jsonProxySettings, sslDetails, (response) => {
          if (response) {
            console.log('immediate response is' + response[0].error);
          } else {
            console.log('immediate response is' + response[0].error);
          }
        })
      });
    });
  }


  //callback of RDNA.initialize.
  onInitCompleted() {
    console.log('--------- onInitCompleted initCount ' + initCount + ' isRunAfterInteractions ' + isRunAfterInteractions);
    if (isRunAfterInteractions) {
      if (initCount === initSuccess) {
        Obj.doNavigation();
      } else if (initCount === initError) {
        Alert.alert(
          'Error',
          initErrorMsg, [
            {
              text: 'Connection Profiles',
              onPress: () => this.props.navigator.push({ id: 'ConnectionProfile', sceneConfig: Navigator.SceneConfigs.PushFromRight })
            },
          ],
          { cancelable: false }
        )
      }
    }
  }

  //perform screen navigation.
  doNavigation() {
    console.log('doNavigation:');
    if (Main.gotNotification === true) {
      AsyncStorage.getItem("userId").then((value) => {
        if (value) {
          if (value == "empty") {
            Main.gotNotification = false;
            AsyncStorage.getItem('skipwelcome').then((value) => {
              if (value === "true") {
                this.props.navigator.resetTo({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
              } else {
                this.props.navigator.resetTo({
                  id: "Welcome_Screen",
                  //id: "Select_Login",
                  title: "nextChlngName",
                  url: {
                    "chlngJson": chlngJson,
                    "screenId": nextChlngName
                  }
                });
              }
            }).done();
          } else {
            this.props.navigator.resetTo({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
          }
        } else {
          Main.gotNotification = false;
          AsyncStorage.getItem('skipwelcome').then((value) => {
            if (value === "true") {
              this.props.navigator.resetTo({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
            } else {
              this.props.navigator.resetTo({
                id: "Welcome_Screen",
                //id: "Select_Login",
                title: "nextChlngName",
                url: {
                  "chlngJson": chlngJson,
                  "screenId": nextChlngName
                }
              });
            }
          }).done();
        }
      }).done();
    } else {
      Main.gotNotification = false;
      AsyncStorage.getItem('skipwelcome').then((value) => {
        if (value === "true") {
          this.props.navigator.resetTo({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
        } else {
          this.props.navigator.resetTo({
            id: "Welcome_Screen",
            //id: "Select_Login",
            title: "nextChlngName",
            url: {
              "chlngJson": chlngJson,
              "screenId": nextChlngName
            }
          });
        }
      }).done();
    }
  }

  /*
      This method used to render starup animation
   */

  renderStartUpAnimation() {
    return ([<Spinner style={{ position: 'absolute', bottom: 50, alignSelf: 'center', zIndex: 5 }} isVisible={this.state.spinnerIsVisible} size={this.state.spinnerSize} type={this.state.spinnnerType} color={Skin.main.TITLE_COLOR}/>, <Text style={{
      position: 'absolute',
      bottom: 100,
      alignSelf: 'center',
      color: Skin.main.TITLE_COLOR,
      fontSize: 18,
      zIndex: 5,
    }}>{this.state.value}</Text>]);
  }

  /*
    This method is used to render the componenet with all its element.
  */
  render() {

    var currentTextValue = this.state.animatedTextValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Skin.main.STATUS_BAR_BG}/>

        {Config.ENABLESTARTUPANIMATION === 'true' && this.renderStartUpAnimation() }

        <Image
          source={welcome}
          style={styles.bg}>
        </Image>

        <Setting
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: 20,
          }}
          onPress={() => {
            this.props.navigator.push({ id: 'ConnectionProfile', sceneConfig: Navigator.SceneConfigs.PushFromRight })
            if (onInitializeSubscription) {
              onInitializeSubscription.remove();
              onInitializeSubscription = null;
            }
          } }/>
        <Version/>
      </View>
    );
  }
}
var styles = StyleSheet.create({
  bg: {
    height: Skin.SCREEN_HEIGHT,
    width: Skin.SCREEN_WIDTH,
    alignItems: 'center'
  },
  container: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: (Skin.SCREEN_HEIGHT - 100) / 2,
    bottom: 0,
    left: (Skin.SCREEN_WIDTH - 100) / 2,
    right: 0,
    width: 100,
    color: '#fff',
    fontSize: 100,
    height: 100,
  }
});


module.exports = Load;

