/*
 * it will show drawer menu option.
 * and on click to any item it perform respective opration
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';


import { ClientBasedConfig } from '../Utils/LocalConfig';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import Config from 'react-native-config';

import { View, Text, StyleSheet, TouchableHighlight, AsyncStorage, Alert, ScrollView, Platform, Linking, InteractionManager, DeviceEventEmitter } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Communications from 'react-native-communications';
var dismissKeyboard = require('react-native-dismiss-keyboard');

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import Web from '../../Scenes/Web';
var constant = require('../Utils/Constants');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
import { NavigationActions} from 'react-navigation';



/*
 Custome View
 */
import MenuItem from '../view/menuitem';



/*
  INSTANCES
 */
let chlngJson;
let nextChlngName;
var eventLogOff;
let onGetNotificationsSubscription;
let onGetPostLoginChallengesSubscription;
let challengeName;
let onGetAllChallengeEvent;
let onGetAllChallengeStatusSubscription;
let onLogOffSubscription;
let onTerminateSubscription;
let onGetConfigSubscription;

var styles = Skin.controlStyle;
var securePortalUrl;
var isAutoPassword;

const onGetAllChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onLogOffModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onGetPostLoginChallengesModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onGetNotificationsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onTerminateModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onGetConfigModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.getPostLoginChallenges = this.getPostLoginChallenges.bind(this);
    this.logOff = this.logOff.bind(this);
    this.terminate = this.terminate.bind(this);
    this.onLogOff = this.onLogOff.bind(this);
    this.showLogOffAlert = this.showLogOffAlert.bind(this);
    this.showTerminateAlert = this.showTerminateAlert.bind(this);
    this.doNavigation = this.doNavigation.bind(this);
    this.onTerminate = this.onTerminate.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.onGetConfig = this.onGetConfig.bind(this);
    this.testConfig = this.testConfig.bind(this);
    this.showNoticiationScreen = this.showNoticiationScreen.bind(this);
    this.cancelOperation = this.cancelOperation.bind(this);
    //this.getMyNotifications();
    Events.on('getConfiguration', 'getConfiguration', this.getConfig);
  }

  showLogOffAlert() {

    Alert.alert(
      '',
      'Do you want to log-off',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        {
          text: 'OK', onPress: this.logOff
        },
      ]
    );
  }

  showTerminateAlert() {

    Alert.alert(
      '',
      'Do you want to Exit',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        {
          text: 'OK', onPress: this.terminate
        },
      ]
    );
  }


  componentWillMount() {
    global.isNotificationScreenonTop = false;
    if (onGetNotificationsSubscription) {
      onGetNotificationsSubscription.remove();
      onGetNotificationsSubscription = null;
    }

   
    isAutoPassword = false;
    AsyncStorage.getItem('isAutoPassword').then((userPrefs) => {
      if (userPrefs) {
        try {      
          if (userPrefs=== 'true'){
            isAutoPassword = false;
          }else{
            isAutoPassword = true;
          }
        }
        catch (e) { }
      }else{
        isAutoPassword = true;
      }
    });

    onGetNotificationsSubscription = onGetNotificationsModuleEvt.addListener('onGetNotifications',
      this.onGetNotifications.bind(this));
      
    Events.on('showNoticiationScreen', 'showNoticiationScreen', this.showNoticiationScreen);
  }
  componentDidMount() {
    Events.on('logOff', 'logOff', this.logOff);
    //This getAllChallenges call was only for updating menu options
    this.getAllChallenges();
    constant.USER_SESSION = "YES";
    AsyncStorage.setItem("isPwdSet", "empty");
    Events.on('cancelOperation', 'cancelOperation', this.cancelOperation);
  }

  componentWillUnmount() {
    Events.rm('cancelOperation', 'cancelOperation');
    Events.rm('logOff', 'logOff');
  }

  logOff() {
    if (onLogOffSubscription) {
      onLogOffSubscription.remove();
      onLogOffSubscription = null;
    }
    //    eventLogOff = DeviceEventEmitter.addListener('onLogOff', this.onLogOff);
    if (Main.isConnected) {
      onLogOffSubscription = onLogOffModuleEvt.addListener('onLogOff', this.onLogOff.bind(this));
      ReactRdna.logOff(Main.dnaUserName, (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      });
    }
    else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => { } }
        ]
      );
    }
  }

  onLogOff(e) {
    if (onLogOffSubscription) {
      onLogOffSubscription.remove();
      onLogOffSubscription = null;
    }

    console.log('immediate response is' + e.response);
    var responseJson = JSON.parse(e.response);
    if (responseJson.errCode == 0) {
      global.isLoggedIn = false;
      console.log('LogOff Successfull');
      chlngJson = responseJson.pArgs.response.ResponseData;
      nextChlngName = chlngJson.chlng[0].chlng_name
      const pPort = responseJson.pArgs.pxyDetails.port;
      if (pPort > 0) {
        RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
        Web.proxy = pPort;
      }
      this.doNavigation();
    } else {
      alert('Failed to Log-Off with Error ' + responseJson.errCode);
    }
  }


  terminate() {
    if (onTerminateSubscription) {
      onTerminateSubscription.remove();
      onTerminateSubscription = null;
    }
    //    eventLogOff = DeviceEventEmitter.addListener('onLogOff', this.onLogOff);
    if (Main.isConnected) {
      onTerminateSubscription = onTerminateModuleEvt.addListener('onTerminateCompleted', this.onTerminate);
      ReactRdna.terminate((response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      });
    }
    else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => { } }
        ]
      );
    }
  }

  getConfig(e) {

    if (onGetConfigSubscription) {
      onGetConfigSubscription.remove();
      onGetConfigSubscription = null;
    }
    //    eventLogOff = DeviceEventEmitter.addListener('onLogOff', this.onLogOff);
    if (Main.isConnected) {
      Events.trigger('showLoader', true);
      onGetConfigSubscription = onGetConfigModuleEvt.addListener('onConfigReceived', this.onGetConfig);
      ReactRdna.getConfig(JSON.stringify({ chlng: 'all' }), (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
        if (response[0].error != 0) {
          Events.trigger('hideLoader', true);
        }
      });
    }
    else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => { } }
        ]
      );
    }
  }

  testConfig() {

    if (onGetConfigSubscription) {
      onGetConfigSubscription.remove();
      onGetConfigSubscription = null;
    }
    //    eventLogOff = DeviceEventEmitter.addListener('onLogOff', this.onLogOff);
    if (Main.isConnected) {
      onGetConfigSubscription = onGetConfigModuleEvt.addListener('onConfigReceived', this.onGetConfig);
      ReactRdna.testConfig(JSON.stringify(JSON.stringify({ chlng: 'all' })), (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      });
    }
    else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => { } }
        ]
      );
    }
  }

  onTerminate(e) {
    if (onTerminateSubscription) {
      onTerminateSubscription.remove();
      onTerminateSubscription = null;
    }
    console.log('immediate response is' + e.response);
    var responseJson = JSON.parse(e.response);
    if (responseJson.errCode == 0) {
      ReactRdna.exitApp();
    } else {
      alert('Failed to exit with Error ' + responseJson.errCode);
    }
  }

  onGetConfig(e) {
    Events.trigger('hideLoader', true);
    if (onGetConfigSubscription) {
      onGetConfigSubscription.remove();
      onGetConfigSubscription = null;
    }
    console.log('immediate response is' + e.response);
    var responseJson = JSON.parse(e.response);
    if (responseJson.errCode == 0) {
      if (Config.GETCONFIG==="true"){
        alert(e.response);
      }
        
      Events.trigger('onGetConfig', responseJson.pArgs.response.ResponseData);
    } else {
      alert('Failed to get config with Error ' + responseJson.errCode);
    }
  }



  cancelOperation(args) {
    this.props.toggleDrawer();
    var allScreens = this.props.navigator.getCurrentRoutes(0);
    for (var i = 0; i < allScreens.length; i++) {
      var screen = allScreens[i];
      if (screen.id == 'Main') {
        var mySelectedRoute = this.props.navigator.getCurrentRoutes()[i];
        this.props.navigator.popToRoute(mySelectedRoute);
        break;
      }
    }
  }

  onGetPostLoginChallenges(status) {

    if (onGetPostLoginChallengesSubscription) {
      onGetPostLoginChallengesSubscription.remove();
      onGetPostLoginChallengesSubscription = null;
    }

    Events.trigger('hideLoader', true);
    const res = JSON.parse(status.response);
    console.log(res);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        if (res.pArgs.response.ResponseData) {
          console.log('PostLoginAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;
          if (chlngJson != null) {
            const nextChlngName = chlngJson.chlng[0].chlng_name;
            console.log('PostLoginAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            this.props.navigator.push({
              id: 'PostLoginAuthMachine',
              title: nextChlngName,
              url: {
                "chlngJson": chlngJson,
                "screenId": nextChlngName,
              },
              challengesToBeUpdated: [challengeName],
            });
          }
        }
      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }
  }

  onGetNotifications(e) {
    console.log('----- onGetNotifications');
    InteractionManager.runAfterInteractions(() => {
      //    if (onGetNotificationsSubscription) {
      //      onGetNotificationsSubscription.remove();
      //      onGetNotificationsSubscription = null;
      //    }
      // NotificationObtianedResponse = e;
      const res = JSON.parse(e.response);
      console.log(res);
      if (res.errCode === 0) {
        const statusCode = res.pArgs.response.StatusCode;
        if (statusCode === 100) {

          var count = res.pArgs.response.ResponseData.notifications.length;
          Events.trigger('updateBadge', count);
          Main.notificationCount = count;

          if (res.pArgs.response.ResponseData.notifications.length > 0) {
            //            var allScreens = this.props.navigator.getCurrentRoutes(0);
            //            for (var i = 0; i < allScreens.length; i++) {
            //              var screen = allScreens[i];
            //              if (screen.id == 'NotificationMgmt') {
            //                var mySelectedRoute = this.props.navigator.getCurrentRoutes()[i];
            //                mySelectedRoute.url = { "data": e };
            //                Events.trigger('showNotification', e);
            //                this.props.navigator.popToRoute(mySelectedRoute);
            //                return;
            //              }
            //            }
            if (global.isNotificationScreenonTop === true) {
              Events.trigger('showNotification', e);
              return;
            }
          dismissKeyboard();

            //InteractionManager.runAfterInteractions(() => {
            //              this.props.navigator.push({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: { "data": e } });
            this.props.navigator.navigate('NotificationMgmt', { url: { "data": e } })

            //});
          } else if (global.isNotificationScreenonTop === true) {
            Events.trigger('showNotification', e);
          }
        } else {
          if (res.pArgs.response.StatusMsg == 'User not active or present') {
            console.log('User not active or present');
          } else if (res.pArgs.response.StatusMsg == 'User is not active or is not present') {
            console.log('User is not active or is not present');
          }
          else
            alert(res.pArgs.response.StatusMsg);
        }
      } else {
        console.log('Something went wrong');
        // If error occurred reload devices list with previous response
      }
    });
  }


//   isNotificationScreenPresent() {
//      return global.isNotificationScreenonTop;
// //    var allScreens = this.props.navigator.getCurrentRoutes(0);
// //    var status = 0;
// //    for (var i = 0; i < allScreens.length; i++) {
// //      var screen = allScreens[i];
// //      if (screen.id == 'NotificationMgmt') {
// //        status = 1;
// //        return status;
// //      }
// //    }
// //    return status;
//   }

  getMyNotifications() {
    if (Main.isConnected) {
      var recordCount = "0";
      var startIndex = "1";
      var enterpriseID = "";
      var startDate = "";
      var endDate = "";
      ReactRdna.getNotifications(recordCount, startIndex, enterpriseID, startDate, endDate, (response) => {
        console.log('----- NotificationMgmt.getMyNotifications.response ');
        console.log(response);
        if (response[0].error!== 0) {
          console.log('----- ----- response is not 0');
        }
      });
    } else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => {}}
        ]
      );
    }
  }

  showNoticiationScreen(){
    this.getMyNotifications();
    if(Main.isConnected){
      if(global.isNotificationScreenonTop === false){
        InteractionManager.runAfterInteractions(() => {
  //              if(this.props.navigator.getCurrentRoutes(0).length > 1)
  //                 this.props.navigator.replace({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight,  });
  //              else
  //                 this.props.navigator.push({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight,  });
          this.props.navigator.navigate('NotificationMgmt',{title:'Notification Managment'});         
              });
      }
    }
  }

  getPostLoginChallenges(useCaseName, challengeToBeUpdated) {
    if (onGetPostLoginChallengesSubscription) {
      onGetPostLoginChallengesSubscription.remove();
      onGetPostLoginChallengesSubscription = null;
    }

    //    eventGetPostLoginChallenges = DeviceEventEmitter.addListener(
    //      'onGetPostLoginChallenges',
    //      this.onGetPostLoginChallenges.bind(this)
    //    );

    onGetPostLoginChallengesSubscription = onGetPostLoginChallengesModuleEvt.addListener('onGetPostLoginChallenges',
      this.onGetPostLoginChallenges.bind(this));
    challengeName = challengeToBeUpdated;
    console.log("onGetPostLoginChallenges ----- show loader");
    //    Events.trigger('showLoader', true);
    console.log('----- Main.dnaUserName ' + Main.dnaUserName);
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.getPostLoginChallenges(value, useCaseName, (response) => {
        if (response[0].error === 0) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
          alert(response[0].error);
        }
      });
    }).done();
  }

  onGetAllChallengeStatus(e) {
    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    Events.trigger('hideLoader', true);
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {

        const chlngJson = res.pArgs.response.ResponseData;

        //var arrChlng = chlngJson.chlng;
        var selectedChlng;
        var status = 0;
        for (var i = 0; i < chlngJson.chlng.length; i++) {
          var chlng = chlngJson.chlng[i];
          if (chlng.chlng_name === challengeName) {

          } else {
            chlngJson.chlng.splice(i, 1);
            i--;
          }
        }

        console.log("PostAuth ------ getAllChallenges ---  " + JSON.stringify(chlngJson));
        if (chlngJson.chlng.length > 0) {
          const nextChlngName = chlngJson.chlng[0].chlng_name;
//          this.props.navigator.push({ id: "UpdateMachine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
//          this.props.navigator.navigate('Update_Password_Dashboard',{title:'Secure Portal',url: 'http://' + Main.gatewayHost + '/demoapp/relid.html'})
          if(nextChlngName === "pass"){
            this.props.navigator.navigate('UpdateMachine',{url: { "chlngJson": chlngJson, "screenId": nextChlngName,currentIndex:0 }})
          }else{
            this.props.navigator.navigate('UpdateMachine',{url: { "chlngJson": chlngJson, "screenId": nextChlngName ,currentIndex:0}})
          }
        }
        else {
          alert("Challenge not configured");
        }
      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }
  }

  getChallengesByName(chlngName) {
    if (Main.isConnected) {

      if (onGetAllChallengeStatusSubscription) {
        onGetAllChallengeStatusSubscription.remove();
        onGetAllChallengeStatusSubscription = null;
      }

      //      onGetAllChallengeEvent = DeviceEventEmitter.addListener(
      //        'onGetAllChallengeStatus',
      //        this.onGetAllChallengeStatus.bind(this)
      //      );
      onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
        this.onGetAllChallengeStatus.bind(this));

      challengeName = chlngName;
      //      Events.trigger('showLoader', true);
      AsyncStorage.getItem('userId').then((value) => {
        ReactRdna.getAllChallenges(value, (response) => {
          if (response) {
            console.log('getAllChallenges immediate response is' + response[0].error);
          } else {
            console.log('s immediate response is' + response[0].error);
          }
        })
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
  }

  doNavigation() {
    if (onGetNotificationsSubscription) {
      onGetNotificationsSubscription.remove();
      onGetNotificationsSubscription = null;
    }
    console.log('doNavigation:');
    //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 0));
    AsyncStorage.getItem('skipwelcome').then((value) => {
      if (value != null && value != undefined && value === "true") {
      
//        this.props.navigator.resetTo({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
      
      
      const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'StateMachine',params:{url: {
          chlngJson,
        screenId: nextChlngName,
        currentIndex:0,
          },title:nextChlngName}})
        ]
        })
      this.props.navigator.dispatch(resetAction)
      
      } else {
//        this.props.navigator.resetTo({
//          id: "Welcome_Screen",
//          //id: "Select_Login",
//          title: "nextChlngName",
//          url: {
//            "chlngJson": chlngJson,
//            "screenId": nextChlngName
//          }
//        });
      const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'WelcomeScreen',params:{url: {
          chlngJson,
        screenId: nextChlngName,
        currentIndex:0,
          },title:nextChlngName}})
        ]
        })
      this.props.navigator.dispatch(resetAction)
      }
    }).done();
  }


  popToLoadView() {
//    this.props.navigator.replace({
//      id: 'Load'
//    });
    const resetToLoad = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Load',params:{url: '',title:''}})
      ]
      })
    this.props.navigator.dispatch(resetToLoad)
  }

  renderIf(condition, jsx) {
    if (condition) {
      return jsx;
    }
  }


  //This getAllChallenges method is only for updating menu options
  getAllChallenges() {
    //    Events.trigger('showLoader', true);

    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    //    onGetAllChallengeEvent = DeviceEventEmitter.addListener(
    //      'onGetAllChallengeStatus',
    //      this.onGetAllChallengeSettingStatus.bind(this)
    //    );
    onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
      this.onGetAllChallengeSettingStatus.bind(this));

    ReactRdna.getAllChallenges(Main.dnaUserName, (response) => {
      if (response) {
        console.log('getAllChallenges immediate response is' + response[0].error);
      } else {
        console.log('s immediate response is' + response[0].error);
      }
    });
  }

  onGetAllChallengeSettingStatus(e) {

    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }

    var $this = this;
    Events.trigger('hideLoader', true);
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        const chlngJson = res.pArgs.response.ResponseData;
        for (var i = 0; i < chlngJson.chlng.length; i++) {
          if (chlngJson.chlng[i].chlng_name === 'secqa') {
            Main.enableUpdateSecqaOption = true;
          }
        }
      }
    } else {
      console.log('Something went wrong');
    }

    //Calling reset challenge as we are not going to call update imidiately after this.
    //This getAllChallenges call was only for updating menu options
    ReactRdna.resetChallenge((response) => {/*do nothing*/ });
  }


  // onGetAllChallengeSettingStatus(e) {
  //   if (onGetAllChallengeEvent) {
  //     onGetAllChallengeEvent.remove();
  //   }
  //   var $this = this;
  //   Events.trigger('hideLoader', true);
  //   const res = JSON.parse(e.response);
  //   console.log(res);
  //   if (res.errCode === 0) {
  //     const statusCode = res.pArgs.response.StatusCode;
  //     if (statusCode === 100) {
  //       var arrTba = new Array();
  //       const chlngJson = res.pArgs.response.ResponseData;
  //       for (var i = 0; i < chlngJson.chlng.length; i++) {
  //         if (chlngJson.chlng[i].chlng_name === 'secqa') {
  //           Main.enableUpdateSecqaOption = true;
  //         }

  //         if (chlngJson.chlng[i].chlng_name === 'tbacred')
  //           arrTba.push(chlngJson.chlng[i]);
  //       }
  //       if (typeof arrTba != 'undefined' && arrTba instanceof Array) {
  //         if (arrTba.length > 0) {
  //           AsyncStorage.getItem(Main.dnaUserName).then((value) => {
  //             if (value) {
  //               try {
  //                 value = JSON.parse(value);
  //                 if (value.ERPasswd && value.ERPasswd !== "empty") {
  //                   Obj.props.navigator.push({ id: 'RegisterOptionScene', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true } }, sceneConfig: Navigator.SceneConfigs.PushFromRight });
  //                 } else {
  //                   if (Platform.OS === "android") {
  //                     Obj.props.navigator.push({ id: 'RegisterOptionScene', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false } }, sceneConfig: Navigator.SceneConfigs.PushFromRight });
  //                   } else {
  //                     Obj.props.navigator.push({ id: 'RegisterOptionScene', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": $this.isTouchIDPresent } }, sceneConfig: Navigator.SceneConfigs.PushFromRight });
  //                   }
  //                 }
  //               } catch (e) { }
  //             }

  //           }).done();
  //         } else {
  //           Events.trigger('closeStateMachine');
  //           InteractionManager.runAfterInteractions(() => {
  //             // this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
  //           });
  //         }
  //       } else {
  //         Events.trigger('closeStateMachine');
  //         InteractionManager.runAfterInteractions(() => {
  //           //this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
  //         });
  //       }
  //     } else {
  //       alert(res.pArgs.response.StatusMsg);
  //     }
  //   } else {
  //     console.log('Something went wrong');
  //     // If error occurred reload devices list with previous response
  //   }

  // }

  render() {


    // <TouchableHighlight onPress={()=>{this.props.toggleDrawer();this.props.navigator.push({id: 'ActivateNewDevice', title:'Activate New Device',sceneConfig:Navigator.SceneConfigs.PushFromRight,});}}  style={styles.touch}><Text style={styles.menuItem}>Activate New Device</Text>
    // </TouchableHighlight><View style={styles.menuBorder}></View>


    //  <TouchableHighlight onPress={()=>{this.getPostLoginChallenges('verifyChallenge','secqa');}}  style={styles.touch}><Text style={styles.menuItem}>Change Secret Question</Text>
    // </TouchableHighlight><View style={styles.menuBorder}></View>

    // <TouchableHighlight onPress={()=>{this.getPostLoginChallenges('verifyChallenge','pass');}}  style={styles.touch}><Text style={styles.menuItem}>Change Pin</Text>
    // </TouchableHighlight><View style={styles.menuBorder}></View>


    return (
      <View style={styles.container}>
        <Text style={styles.controlHeader}>{Skin.admin.MENU_TITLE}</Text>
        <ScrollView>
          <MenuItem
            visibility={Config.ALERTS}
            lable="Alerts"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'ComingSoon', title: 'Alerts', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
              this.props.navigator.navigate('ComingSoon',{title:'Alerts'})
            }}
          />
          <MenuItem
            visibility={Config.PROFILE_SETTINGS}
            lable="Profile & Settings"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'RegisterOptionScene', title: 'Profile & Settings', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('RegisterOptionScene',{title:'Profile & Settings'})
            }}
          />
          <MenuItem
            visibility={Config.DEV_MANAGMENT}
            lable="Device Management"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'DeviceMgmt', title: 'Self Device Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('DeviceMgmt',{title:'Self Device Managment'})
            }}
          />
          <MenuItem
            visibility={Config.NOTIFICATIONS}
            lable="Notifications"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('NotificationMgmt',{title:'Notification Managment'})
            }}
          />
          <MenuItem
            visibility={Config.NOTIFICATION_HISTORY}
            lable="Notification History"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'Notification_History', title: 'Notification History', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('Notification_History',{title:'Notification History'})
            }}
          />
          {
            Main.enableUpdateSecqaOption &&
            [
              <MenuItem
                visibility={Config.CHANGEQUESTION}
                lable="Change Secret Question"
                onPress={() => {
              this.props.toggleDrawer(); this.getChallengesByName('secqa');
              }}
              />
            ]
          }

          {
            isAutoPassword &&
            [
              <MenuItem
            visibility={Config.CHANGEPASSWORD}
            lable="Change Password"
            onPress={() => { this.props.toggleDrawer(); this.getChallengesByName('pass'); }}
          />
            ]
          }

          <MenuItem
            visibility={Config.HELP_SUPPORT}
            lable="Help & Support"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'ComingSoon', title: 'Help & Support', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('ComingSoon',{title:'Help & Support'})
            }}
          />
          <MenuItem
            visibility={Config.SECURE_PORTAL}
            lable="Secure Portal"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'SecureWebView', title: 'Secure Portal', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: 'http://' + Main.gatewayHost + '/demoapp/relid.html' });
      this.props.navigator.navigate('SecureWebView',{title:'Secure Portal',url: 'http://' + Main.gatewayHost + '/demoapp/relid.html'})

            }}
          />
          <MenuItem
            visibility={Config.OPEN_PORTAL}
            lable="Open Portal"
            onPress={() => {
              this.props.toggleDrawer();
              var openSiteURL = 'https://www.google.co.in/'
              if (Platform.OS === 'android') {
                Linking.canOpenURL(openSiteURL).then((supported) => {
                  if (!supported) {
                    console.log('Can\'t handle url: ' + openSiteURL);
                  } else {
                    Linking.openURL(openSiteURL);
                  }
                });
              }
              else {
                //this.props.navigator.push({ id: 'WebView', title: 'Open Portal', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: 'https://www.google.co.in/' });
                Communications.web('https://www.google.co.in/');
              }
            }
            }
          />
          <MenuItem
            visibility={Config.SEND_APP_FEEDBACK}
            lable="Send App Feedback"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'ComingSoon', title: 'Send App Feedback', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('ComingSoon',{title:'Send App Feedback'})
            }}
          />
          <MenuItem
            visibility={Config.LEGAL_INFO}
            lable="Legal Info"
            onPress={() => {
              this.props.toggleDrawer();
//              this.props.navigator.push({ id: 'ComingSoon', title: 'Legal Info', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
      this.props.navigator.navigate('ComingSoon',{title:'Legal Info'})
            }}
          />
          <MenuItem
            visibility={Config.GETCONFIG}
            lable="Config"
            onPress={() => {
              this.getConfig();
              this.props.toggleDrawer();
            }}
          />
          <MenuItem
            visibility={Config.TESTCONFIG}
            lable="ConfigWithTerminate"
            onPress={() => {
              this.testConfig();
              this.props.toggleDrawer();
            }}
          />
          <MenuItem
            visibility={Config.LOGOUT}
            lable="Logout"
            onPress={this.showLogOffAlert}
          />
          <MenuItem
            visibility={Config.EXIT}
            lable="Exit"
            onPress={this.showTerminateAlert}
          />
        </ScrollView>

      </View>
    )
  }
};

module.exports = ControlPanel
