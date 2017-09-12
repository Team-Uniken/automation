/** This class handles the Two Factor Authentication flow , hence TwoFactorAuthMachine.
    It handles the below listed flows :
      1)Activation
      2)Normal Login
      3)Secondary Device Login
      4)Forgot Password
    The main responsiblity of this class is to navigate to screens, 
    doing appropriate operation based on status and error codes returned in async callbacks,
    navigating the UI screens based on challenges, mode(normal,forgotPassowrd) and challengeOperations
    This class exposes some important Events , these events triggers the new flow or ends the flow based on use, please see the list below: 
       1)showNextChallenge - This event is triggered to show next challenge in challenge array on UI.
       2)showPreviousChallenge - This event is triggered to show previous challenge in challenge array on UI.
       3)showCurrentChallenge - This event is triggered to show current challenge (current challenge is detemined by currentIndex)
                                in challenge array on UI.
       4)resetChallenge - This event is triggered to reset the state of RDNA, this is triggered when you want 
                          to start the new flow without ending the current flow properly i.e when you get error. 
       5)forgotPassowrd - This event triggers the forgot password flow.
       6)onPostForgotPassword - This is event is triggered by TwoFactorAuthMachine when forgot password flow finishes.
       7)finishForgotPasswordFlow -  This event should be triggered when you are done with post operations (e.g update data, remove old data) of forgotPassoword flow to 
                                     allow TwoFactorAuthMachine to do cleanup and redirect to DashBoard. If onPostForgotPassword event is overriden then call this 
                                     event explicitly. 
    There are also some async callback methods which are called from Native Bridge through EventsEmitters, below is the list of callbacks:
       1)onCheckChallengeResponseStatus - This is method is called to give resposne of checkChallenge call of RDNA. 
       2)onForgotPasswordStatus - This is method is called to give resposne of forgotPassoword call of RDNA. 
       3)onGetAllChallengeStatus - This is method is called to give resposne of getAllChallenges call of RDNA. 
**/


'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React, { Component, } from 'react';
import Skin from '../../Skin';


/*
 CALLED
 */
import Main from '../Container/Main';
// Secondary Scenes

// SECURITY SCENES
//import SelfRegister from '../../Scenes/Self_Register';
import Activation from '../Challenges/Activation_Code';
import AccessCode from '../Challenges/Access_Code';
import PasswordSet from '../Challenges/SetPassword';
import Forgot_Password from '../Challenges/Forgot_Password';
import Otp from '../Challenges/Activation_Code';
import QuestionSet from '../Challenges/SetQuestion';
import QuestionVerification from '../Challenges/Question_Verification';
import UserLogin from '../Challenges/Check_User';
import DeviceBinding from '../Challenges/Device_Binding';
import DeviceName from '../Challenges/Device_Name';
import PasswordVerification from '../Challenges/Password_Verification';
import PatternLock from '../../Scenes/Screen_PatternLock';
import ScreenHider from '../Utils/ScreenHider';
import SelectLogin from '../../Scenes/Select_Login';
import Util from '../Utils/Util';


// COMPONENTS
import buildStyleInterpolator from 'buildStyleInterpolator';
import ConnectionProfile from '../../Scenes/ConnectionProfile';
import Events from 'react-native-simple-events';
import Constants from '../Utils/Constants';
import RegisterOption from '../../Scenes/Register_Options';
import Web from '../../Scenes/Web';
import TouchID from 'react-native-touch-id';
import { NativeModules, NativeEventEmitter } from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components'
import { NavigationActions} from 'react-navigation';


/*
 Instantiaions
 */
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
//let subscriptions;
let onGetAllChallengeStatusSubscription;
let onCheckChallengeResponseSubscription;
let onForgotPasswordStatusSubscription;
let obj;
let screenId;
let stepdone = false;
//let onGetAllChallengeEvent;
let mode = "normal";

const {
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  Platform,
  Text,
  InteractionManager
} = ReactNative;


const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onCheckChallengeResponseStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onGetAllChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onForgotPasswordStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)

class TwoFactorAuthMachine extends Component {

  constructor(props) {
    super(props);
    console.log('---------- Machine param ');
    this.onCheckChallengeResponseStatus = this.onCheckChallengeResponseStatus.bind(this);
    this.onForgotPasswordStatus = this.onForgotPasswordStatus.bind(this);
    this.onPostForgotPassword = this.onPostForgotPassword.bind(this);
    this.finishForgotPasswordFlow = this.finishForgotPasswordFlow.bind(this);
    this.initiateForgotPasswordFlow = this.initiateForgotPasswordFlow.bind(this);
    this.mode = mode;
    // this.renderScene = this.renderScene.bind(this);
    this.isTouchIDPresent = false;
    this.onGetAllChallengeStatus = this.onGetAllChallengeStatus.bind(this);
    this.isTouchPresent = this.isTouchPresent.bind(this);
    this.showFirstChallenge = this.showFirstChallenge.bind(this);
    this.canShowNextChallenge = this.canShowNextChallenge.bind(this);
    this.showNextChallenge = this.showNextChallenge.bind(this);
    this.resetChallenge = this.resetChallenge.bind(this);
  }

  /** 
   *   This is life cycle method of the react native component.
   *   This method is called when the component will start to load
   * Setting the initial state of machine and registering events
  */
  componentWillMount() {
    obj = this;
    if (Platform.OS === 'ios') {
      this.isTouchPresent();
    }

//    currentIndex = 0;
//    challengeJson = this.props.navigation.state.params.url.chlngJson;
//    if (saveChallengeJson == null) {
//      saveChallengeJson = this.props.navigation.state.params.url.chlngJson;
//    }
//    if (challengeJson.length == 0) {
//      challengeJson = saveChallengeJson;
//    }
//    challengeJsonArr = challengeJson.chlng;
    
    // console.log('------ challengeJson ' + JSON.stringify(challengeJson));
    // console.log('------ challengeJsonArray ' + JSON.stringify(challengeJsonArr));
    // console.log('------- current Element ' + JSON.stringify(challengeJsonArr[currentIndex]));

    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
    Events.on('showCurrentChallenge', 'showCurrentChallenge', this.showCurrentChallenge);
    Events.on('forgotPassowrd', 'forgotPassword', this.initiateForgotPasswordFlow);
    Events.on('resetChallenge', 'resetChallenge', this.resetChallenge);


    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }

    //    onGetAllChallengeEvent = DeviceEventEmitter.addListener(
    //      'onGetAllChallengeStatus',
    //      this.onGetAllChallengeStatus
    //    );
    onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
      this.onGetAllChallengeStatus.bind(this));
  }
  


  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
    Setting the initial screen to UserLogin
  */
  componentDidMount() {
    screenId = 'UserLogin';// this.props.screenId;
  }

  //Printing the logs of unmount.
  componentWillUnmount() {
    console.log('----- TwoFactorAuthMachine unmounted');
  }

  /*
    This is method is callback method, it is called to give resposne of checkChallenge call of RDNA.
    It is also called from onForgotPasswordStatus callback method as handling of both callbacks are same.
  */
  onCheckChallengeResponseStatus(e) {
    Main.isApiRunning = false;
    const res = JSON.parse(e.response);
    console.log("onCheckChallengeResponse ----- hide loader");
    Events.trigger('hideLoader', true);

    // Unregister All Events
    // We can also unregister in componentWillUnmount
    if (onCheckChallengeResponseSubscription) {
      onCheckChallengeResponseSubscription.remove();
      onCheckChallengeResponseSubscription = null;
    }
    Events.rm('showNextChallenge', 'showNextChallenge');
    Events.rm('showPreviousChallenge', 'showPreviousChallenge');
    Events.rm('showCurrentChallenge', 'showCurrentChallenge');
    Events.rm('resetChallenge', 'resetChallenge');

    console.log(res);


    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      console.log('TwoFactorAuthMachine - statusCode ' + statusCode);
      if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          //  obj.stateNavigator.immediatelyResetRouteStack(obj.stateNavigator.getCurrentRoutes().splice(-1, 0));
          
          
          currentIndex = 0;
          challengeJson = res.pArgs.response.ResponseData;
          if (saveChallengeJson == null) {
            saveChallengeJson = res.pArgs.response.ResponseData;
          }
          if (challengeJson.length == 0) {
            challengeJson = saveChallengeJson;
          }
          challengeJsonArr = challengeJson.chlng;
          
          console.log('TwoFactorAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;
          this.showFirstChallenge(chlngJson, 0);
        } else {
          console.log('TwoFactorAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
            global.proxy = pPort;
          }

          if (Constants.USER_T0 === 'YES') {
            AsyncStorage.getItem('userId').then((value) => {
              Events.trigger('showLoader', true);
              ReactRdna.getAllChallenges(value, (response) => {
                if (response) {
                  console.log('getAllChallenges immediate response is' + response[0].error);
                } else {
                  console.log('s immediate response is' + response[0].error);
                  Events.trigger('hideLoader', true);
                }
              })
            }).done();
          } else {
            if (this.mode === "forgotPassword") {
              Events.trigger('onPostForgotPassword', null);
            } else {
              if (Main.isOtherLogin === true) {
                Main.isOtherLogin = false;
              //  AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ RPasswd: "empty" }), null).then((error) => { }).done();
              }else{
                Util.saveUserDataSecure("RPasswd",Main.dnaPasswd).done();
              }
              Main.gotNotification = false;
//              this.props.navigator.resetTo({ id: 'Main', title: 'DashBoard', url: '' });
              if (onGetAllChallengeStatusSubscription) {
                onGetAllChallengeStatusSubscription.remove();
                onGetAllChallengeStatusSubscription = null;
              }
              this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard'})
            }
          }
        }
      } else {
        if (Main.isOtherLogin === true) {
          Main.isOtherLogin = false;
        }
         const chlngJson = res.pArgs.response.ResponseData;
      

        //Removing user preference when user is blocked or suspended 
        if (res.pArgs.response.StatusMsg.toLowerCase().includes("suspended") ||
          res.pArgs.response.StatusMsg.toLowerCase().includes("blocked") ||
          res.pArgs.response.StatusMsg.toLowerCase().includes("exhausted")) {
          AsyncStorage.setItem("skipwelcome", "false");
          AsyncStorage.setItem("rememberuser", "empty");
        }

        
        setTimeout(() => {

        Alert.alert(
          'Error',
          res.pArgs.response.StatusMsg, [{
            text: 'OK',
            onPress: () => {
              var chlngJson;

              Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
              if (res.pArgs.response.ResponseData != null && res.pArgs.response.ResponseData.chlng.length > 0) {
                chlngJson = res.pArgs.response.ResponseData;
                const nextChlngName = chlngJson.chlng[0].chlng_name;
                if (chlngJson != null) {
                  console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
                  //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//                  this.props.navigator.resetTo({
//                    id: 'Machine',
//                    title: nextChlngName,
//                    url: {
//                      chlngJson,
//                      screenId: nextChlngName,
//                    },
//                  });
            const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'StateMachine',params:{url: {
                chlngJson,
              screenId: nextChlngName,
                },title:nextChlngName}})
              ]
              })
            this.props.navigation.dispatch(resetAction)
                }
              }
              else {
                this.resetChallenge();
              }
            },
            style: 'cancel',
          }]
        );
                                              }, 100);
      }
    } else {
      if (Main.isOtherLogin === true) {
        Main.isOtherLogin = false;
      }
      console.log(e);
      //Show alert as errorCode is not 0 and call resetChallenge
      
       setTimeout(() => {
      Alert.alert(
        'Error',
        'Internal system error occurred.', [{
          text: 'OK',
          onPress: () => {
            Events.on('showNextChallenge', 'showNextChallenge', obj.showNextChallenge);
            obj.resetChallenge();
          },
          style: 'cancel',
        }]
      );
                   }, 100);
    }
  }


  /** 
   * This method is callback method ,It is called to give resposne of forgotPassoword call of RDNA. 
   */
  onForgotPasswordStatus(res) {
    if (onForgotPasswordStatusSubscription) {
      onForgotPasswordStatusSubscription.remove();
      onForgotPasswordStatusSubscription = null;
    }

    //Calling onCheckChallengeResponseStatus as handling is same
    this.onCheckChallengeResponseStatus(res);
  }

  /**
   * This method searches the  tbacred challenge in challengeJsonArr and returns it.
   */
  getTBACreds() {
    for (var i = 0; i < challengeJsonArr.length; i++) {
      if (challengeJsonArr[i].chlng_name === 'tbacred')
        return challengeJsonArr[i];
    }
    return null;
  }

  /**
   * This method sets the isTouchIDPresent variable to true if touchId is supported on iOS and 
   * false if not supported 
   */
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

  /**
   * This method is called to reset the state of RDNA, this is called when you want 
     to start the new flow without ending the current flow properly i.e when you get error.
     This method can also be called by triggering resetChallenge event. 
   */
  resetChallenge() {
    if (this.mode === "forgotPassword") {
      Events.rm('onPostForgotPassword', 'onPostForgotPassword');
      Events.rm('finishForgotPasswordFlow', 'finishForgotPasswordFlow');
    }
    mode = "normal"
    this.mode = mode;
    console.log("resetChallenge");
    ReactRdna.resetChallenge((response) => {
      if (response[0].error === 0) {
        /**
         * Pop to checkUser screen if exist in route stack or load the checkuser from initial saved challenge.
         */
        challengeJson = saveChallengeJson;
        currentIndex = 0;
        challengeJsonArr = saveChallengeJson.chlng;
        console.log('immediate response is' + response[0].error);
          var chlngJson1;
          chlngJson1 = saveChallengeJson;
          const nextChlngName = chlngJson1.chlng[0].chlng_name;
//          const chlngJson = chlngJson1.chlng[0];
      const chlngJson = saveChallengeJson;
          console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
          //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//          obj.stateNavigator.push({
//            id: nextChlngName,
//            title: nextChlngName,
//            url: {
//              reset: true,
//              chlngJson,
//              screenId: nextChlngName,
//            },
//          });
      
      const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: nextChlngName,params:{url: {
                                reset: true,
                                chlngJson,
                                screenId: nextChlngName,
                              },title:nextChlngName}})
        ]
        })
      this.props.navigation.dispatch(resetAction)
      

      
      } else {
        console.log('immediate response is' + response[0].error);
        alert(response[0].error);
      }
    });

  }


  /**
   * This method tells whether next challenge should be shown or skipped.
   * It returns the object with show flag and challenge.
   */
  canShowNextChallenge() {
    if (this.hasNextChallenge()) {
      var currChallenge = this.getCurrentChallenge();
      if (currChallenge.chlng_name === 'tbacred'
        || currChallenge.chlng_name === 'devbind'
        || currChallenge.chlng_name === 'devname'
      ) {
        if (currChallenge.chlng_name === 'devname') {
          var name = currChallenge.chlng_resp[0].response;
          if (name != null)
            AsyncStorage.setItem("devname", name);
        }
        return { show: false, challenge: currChallenge };
      }
      else {
        return { show: true, challenge: currChallenge };
      }
    }
    else {
      return { show: false, challenge: null };
    }
  }

  /**
   * This method is called to show next challenge in challenge array on UI.
   * This method can also be called by triggering showNextChallenge event
   */
  showNextChallenge(args) {
    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // alert(JSON.stringify(args));
    // alert("response = "+ JSON.stringify(args));

    //const i = challengeJsonArr.indexOf(currentIndex);
    //challengeJsonArr[i] = args.response;
    currentIndex++;
    var result = this.canShowNextChallenge();
    if (result.challenge) {
      if (result.show === false) {
        while ((result = this.canShowNextChallenge())
          && result.show === false
          && result.challenge
        ) {
          if (result.challenge.chlng_name === 'devbind') {
            result.challenge.chlng_resp[0].response = 'true';
          }

          currentIndex++;
        }

        if (result.challenge) {
          
          //old
//          this.stateNavigator.push({
//            id: result.challenge.chlng_name,
//            url: {
//              chlngJson: result.challenge,
//              chlngsCount: challengeJsonArr.length,
//              currentIndex: currentIndex + 1,
//            },
//            title: this.props.title,
//          });
          
          //Push
//          var name =result.challenge.chlng_name
//          this.props.navigation.navigate('StateMachine',{url: {
//          chlngJson: result.challenge,
//          chlngsCount: challengeJsonArr.length,
//          currentIndex: currentIndex + 1,
//          screenId: name
//            },title:name})
          
          //Reset
          var name =result.challenge.chlng_name
          const showNextChallengefor = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'StateMachine',params:{url: {
            chlngJson: result.challenge,
            chlngsCount: challengeJsonArr.length,
            currentIndex: currentIndex + 1,
              screenId: name
              },title:name}})
            ]
            })
          this.props.navigation.dispatch(showNextChallengefor)
        }
        else {
          this.callCheckChallenge();
        }
      } else {
        
        //old
//        this.stateNavigator.push({
//          id: result.challenge.chlng_name,
//          url: {
//            chlngJson: result.challenge,
//            chlngsCount: challengeJsonArr.length,
//            currentIndex: currentIndex + 1,
//          },
//          title: this.props.title,
//        });
        
        //push
//        var name =result.challenge.chlng_name
//        this.props.navigation.navigate('StateMachine',{url: {
//        chlngJson: result.challenge,
//        chlngsCount: challengeJsonArr.length,
//        currentIndex: currentIndex + 1,
//        screenId: name
//          },title:name})
        
        //reset
        var name =result.challenge.chlng_name
        const resetActionshowNextChallenge = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'StateMachine',params:{
          url: {
                        chlngJson: result.challenge,
                        chlngsCount: challengeJsonArr.length,
                        currentIndex: currentIndex + 1,
                        screenId: name
                      },
          title:name}})
          ]
          })
        this.props.navigation.dispatch(resetActionshowNextChallenge)
      }
    } else {
      // Call checkChallenge
      this.callCheckChallenge();
    }
  }

  /**
   * This is method is callback method, it is called to give resposne of getAllChallenges call of RDNA.
   * The status provides all challenges that can be updated by calling updateChallenge API.
   * This method parses the response and shows RegisterOption screen (i.e Registration screen for alternative login options) if challeges 
   * are provided in status else it navigates to Dashboard screen.
   */
  onGetAllChallengeStatus(e) {

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
                  if (value.ERPasswd && value.ERPasswd !== "empty") {
              
              const resetActionshowRegisterOption = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'StateMachine',params:{
                url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true, "isSupported": $this.isTouchIDPresent },screenId: 'RegisterOption' },
                title:'RegisterOption'}})
                ]
                })
              this.props.navigation.dispatch(resetActionshowRegisterOption)
//              this.props.navigation.navigate('RegisterOption',{url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true, "isSupported": $this.isTouchIDPresent } }})
              
//                    this.stateNavigator.push({ id: 'RegisterOption', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true, "isSupported": $this.isTouchIDPresent } } });

                  } else {
              const resetActionshowRegisterOption = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'StateMachine',params:{
                url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false, "isSupported": $this.isTouchIDPresent },screenId: 'RegisterOption' },
                title:'RegisterOption'}})
                ]
                })
              this.props.navigation.dispatch(resetActionshowRegisterOption)
//              this.props.navigation.navigate('RegisterOption',{url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false, "isSupported": $this.isTouchIDPresent } }})
//                    this.stateNavigator.push({ id: 'RegisterOption', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false, "isSupported": $this.isTouchIDPresent } } });
                  }
                } catch (e) { }
              }

            }).done();
          } else {
            Events.trigger('closeStateMachine');
            InteractionManager.runAfterInteractions(() => {
              Main.gotNotification = false;
//              this.props.navigator.resetTo({ id: 'Main', title: 'DashBoard', url: '' });
              if (onGetAllChallengeStatusSubscription) {
              onGetAllChallengeStatusSubscription.remove();
              onGetAllChallengeStatusSubscription = null;
              }
              this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard'})
            });
          }
        } else {
          Events.trigger('closeStateMachine');
          InteractionManager.runAfterInteractions(() => {
            Main.gotNotification = false;
//            this.props.navigator.resetTo({ id: 'Main', title: 'DashBoard', url: '' });
            if (onGetAllChallengeStatusSubscription) {
            onGetAllChallengeStatusSubscription.remove();
            onGetAllChallengeStatusSubscription = null;
            }
            this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard'})
          });
        }
      } else {
        //Removing user preference if user is blocked or suspended 
        if (res.pArgs.response.StatusMsg.toLowerCase().includes("suspended") ||
          res.pArgs.response.StatusMsg.toLowerCase().includes("blocked") ||
          res.pArgs.response.StatusMsg.toLowerCase().includes("exhausted")) {
          AsyncStorage.setItem("skipwelcome", "false");
          AsyncStorage.setItem("rememberuser", "empty");
        }
        setTimeout(() => {
          alert(res.pArgs.response.StatusMsg);
        }, 100);          
      }
    } else {
      console.log('Something went wrong');
    }
  }


  //render screen based on a id pass to it.
//  renderScene(route, nav) {
getComponentByName(route, nav) {
  const id = route.id;
  const ur = route.url;
    console.log('---------- renderScene ' + id + ' url ' + route.url);

    let challengeOperation;
    if (route.url !== undefined && !(route.url instanceof Array)) {
      if (route.url.chlngJson !== undefined)
        challengeOperation = route.url.chlngJson.challengeOperation;
    }

    if (id === 'checkuser') {
      if (Main.gotNotification === true) {
        return (<ScreenHider navigator={nav} url={route.url} title={route.title} />);
      } else {
        return (<UserLogin navigator={nav} url={route.url} title={route.title} />);
      }
    }
    else if (id === 'SelfRegister') {
      stepdone = false;
      return (<SelfRegister navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id === 'actcode') {
      stepdone = false;
      return (<Activation navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'pass') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        var tbacredChallenge = this.getTBACreds();
        return (<SelectLogin navigator={nav} url={route.url} title={route.title} tbacred={tbacredChallenge} />);
      } else {
        if (this.mode === "forgotPassword") {
          return (<Forgot_Password navigator={nav} parentnav={this.props.navigator} mode={this.mode} url={route.url} title={route.title} />);
        }

        return (<PasswordSet navigator={nav} url={route.url} title={route.title} />);
      }
    } else if (id === 'otp') {
      //Reseting default login prefs in case of secondary
      //var prefs = JSON.stringify({ defaultLogin: "none" });
      //AsyncStorage.mergeItem(Main.dnaUserName, prefs, null);
      return (<AccessCode navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        //Reseting default login prefs in case of secondary
        //var prefs = JSON.stringify({ defaultLogin: "none" });
        //AsyncStorage.mergeItem(Main.dnaUserName, prefs, null);
        return (<QuestionVerification navigator={nav} url={route.url} title={route.title} />);
        // }else if(stepdone==false){
        //   stepdone=true;
        // return (<Demo navigator={nav} url={route.url} title={route.title} />);
      }
      return (<QuestionSet navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'devname') {
      //return (<ScreenHider navigator={nav} url={route.url} title={route.title} />);
      return (<DeviceName navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'devbind') {
      //return (<ScreenHider navigator={nav} url={route.url} title={route.title} />);
      return (<DeviceBinding navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'ConnectionProfile') {
      return (<ConnectionProfile navigator={obj.props.navigator} url={route.url} title={route.title} />);
    } else if (id === 'RegisterOption') {
      return (<RegisterOption navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'pattern') {
      return (<PatternLock navigator={nav} mode={route.mode} data={route.data} onClose={route.onClose} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern} disableClose={route.disableClose}/>);
    }
    return (<Text></Text>);
  }

  render() {
    var sId = this.props.navigation.state.params.url.screenId;
    if(sId=='RegisterOption'){
      var params = {id:sId,
      url:{
      chlngJson: this.props.navigation.state.params.url.chlngJson,
      chlngsCount: challengeJsonArr.length,
      currentIndex: currentIndex + 1,
      touchCred:this.props.navigation.state.params.url.touchCred,
      }, title:this.props.navigation.state.params.url.screenId};
      
      return(this.getComponentByName(params,this.props.navigation))
    }else if(sId=='checkuser'){
          currentIndex = 0;
          challengeJson = this.props.navigation.state.params.url.chlngJson;
          if (saveChallengeJson == null) {
            saveChallengeJson = this.props.navigation.state.params.url.chlngJson;
          }
          if (challengeJson.length == 0) {
            challengeJson = saveChallengeJson;
          }
          challengeJsonArr = challengeJson.chlng;
      var params = {id:sId,
      url:{
      chlngJson: this.getCurrentChallenge(),
      chlngsCount: challengeJsonArr.length,
      currentIndex: currentIndex + 1,
      }, title:this.props.navigation.state.params.url.screenId};
      
      return(this.getComponentByName(params,this.props.navigation))
    
    }else{
    var params = {id:sId,
    url:{
    chlngJson: this.getCurrentChallenge(),
    chlngsCount: challengeJsonArr.length,
    currentIndex: currentIndex + 1,
    }, title:this.props.navigation.state.params.url.screenId};
    
    return(this.getComponentByName(params,this.props.navigation))
  }
  }
  /**
   * Returns true if next challenge exist based on currentIndex, else returns false 
   */
  hasNextChallenge() {
    return challengeJsonArr.length > currentIndex;
  }
  
  
  checkForPasswordChallenge(chlngJson){
    if(chlngJson!=null && chlngJson.chlng!=null){
      
      for(var i = 0; i<chlngJson.chlng.length; i++){
        if( chlngJson.chlng[i].chlng_name === 'pass'){
          return true;
        }
      }
         }
    return false;
   
  }

  getChallengeByChallengeName(name,challengeJson){
    console.log(challengeJson);
    var temp = challengeJson.chlng;
    for(var i =0;i<temp.length;i++){
     var currentChlng = temp[i]
      if(currentChlng.chlng_name === name){
        return currentChlng;
      }
    }
  }
  /**
   * Shows the first challenge screen, based on challenge array and startIndex.
   * If challenge at index startIndex is tbacred then it skips the tbacred challenge and shows the next.  
   */
  showFirstChallenge(chlngJson, startIndex) {
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
    Events.on('showCurrentChallenge', 'showCurrentChallenge', this.showCurrentChallenge);
    Events.on('forgotPassowrd', 'forgotPassword', this.initiateForgotPasswordFlow);
    Events.on('resetChallenge', 'resetChallenge', this.resetChallenge);
    if (chlngJson.chlng && chlngJson.chlng.length > startIndex) {
      const firstChlngName = chlngJson.chlng[startIndex].chlng_name;
      console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
      //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));

      if (firstChlngName === 'tbacred' || firstChlngName === 'devbind'
        || firstChlngName === 'devname') {
        this.showFirstChallenge(chlngJson, startIndex + 1);
      } else {
        
        const resetActionshowFirstChallenge = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'StateMachine',params:{url: {
            chlngJson,
          screenId: firstChlngName,
            },title:firstChlngName}})
          ]
          })
        this.props.navigation.dispatch(resetActionshowFirstChallenge)

      }
    }
  }

  //Todo : Remove if it is not used , as it returns null always
  hasPreviousChallenge() {
    return null;
  }

  /**
   * This method pops the current screen and decrements the currentIndex, if no more challenge
   * screen can be poped based on current index , it calls resetChallenge().
   */
  showPreviousChallenge() {
    console.log('---------- showPreviousChallenge ' + currentIndex);
    if (currentIndex > 0) {
      currentIndex--;
      obj.stateNavigator.pop();
    } else {
      obj.resetChallenge();
    }
  }

  /**
   * Shows current challenge based onn current index.
   * Todo : It needs review , as code seem to be buggy.
   */
  showCurrentChallenge(args) {
    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // alert(JSON.stringify(args));
    // alert("response = "+ JSON.stringify(args));
    const i = challengeJsonArr.indexOf(currentIndex);
    challengeJsonArr[i] = args.response;
    // currentIndex ++;
    if (obj.hasNextChallenge()) {
      // Show Next challenge screen
      const currentChlng = obj.getCurrentChallenge();
//      obj.stateNavigator.push({
//        id: currentChlng.chlng_name,
//        url: {
//          chlngJson: currentChlng,
//          chlngsCount: challengeJsonArr.length,
//          currentIndex: currentIndex + 1,
//        },
//        title: obj.props.title,
//      });
//      var name = currentChlng.chlng_name;
//      this.props.navigation.navigate(name,{url: {
//      chlngJson: currentChlng,
//      chlngsCount: challengeJsonArr.length,
//      currentIndex: currentIndex + 1,
//        }})
      var name = currentChlng.chlng_name;
      const resetActionshowNextChallenge = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'StateMachine',params:{
        url: {
        chlngJson: currentChlng,
        chlngsCount: challengeJsonArr.length,
        currentIndex: currentIndex + 1,
          screenId: name,
          },
        title:name}})
        ]
        })
      this.props.navigation.dispatch(resetActionshowNextChallenge)
    } else {
      // Call checkChallenge
      obj.callCheckChallenge();
    }
  }

  //Todo : Remove if not used, it needs review if its used
  start(json, nav) {
    challengeJson = json;
    currentIndex = 0;
  }

  //Todo : Remove if not used
  stop() {

  }

  /**
   * Returns current challenge based on currentIndex.
   */
  getCurrentChallenge() {
    return challengeJsonArr[currentIndex];
  }

  // Todo : Remove if not used
  getTotalChallenges() {

  }

  /**
   * This method is called by onPostForgotPassword event that is triggered by TwoFactorAuthMachine when forgot password flow finishes.
   * Override the onPostForgotPassword event to receive it in other screens and call finishForgotPasswordFlow() explicitly for cleanup.
   */
  onPostForgotPassword() {
    this.finishForgotPasswordFlow();
  }

  /**
   * This method is called by TwoFactorAuthMachine to perform cleanup of forgotPassoword flow and navigating to Dashboard.                                   allow TwoFactorAuthMachine to do cleanup and redirect to DashBoard. 
   * If onPostForgotPassword event is overriden then call this event explicitly. 
   */
  finishForgotPasswordFlow() {
    mode = "normal"
    this.mode = mode;
//    this.props.navigator.resetTo({ id: 'Main', title: 'DashBoard', url: '' });
    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard'})
    Events.rm('onPostForgotPassword', 'onPostForgotPassword');
    Events.rm('finishForgotPasswordFlow', 'finishForgotPasswordFlow');
  }

  /**
   * This method is called by forgotPassword event to initiate forgotPassword flow.
   */
  initiateForgotPasswordFlow() {

    if (Main.isConnected) {
      mode = "forgotPassword";
      this.mode = mode;
      Events.rm('forgotPassowrd', 'forgotPassword');
      //      onForgotPasswordSubscription = DeviceEventEmitter.addListener(
      //        'onForgotPasswordStatus',
      //        this.onForgotPasswordStatus
      //      );

      if (onForgotPasswordStatusSubscription) {
        onForgotPasswordStatusSubscription.remove();
        onForgotPasswordStatusSubscription = null;
      }

      onForgotPasswordStatusSubscription = onForgotPasswordStatusModuleEvt.addListener('onForgotPasswordStatus',
        this.onForgotPasswordStatus.bind(this));
      Events.on('onPostForgotPassword', 'onPostForgotPassword', this.onPostForgotPassword);
      Events.on('finishForgotPasswordFlow', 'finishForgotPasswordFlow', this.finishForgotPasswordFlow);
      console.log("initiateForgotPasswordFlow ----- show loader");
      Events.trigger('showLoader', true);
      ReactRdna.forgotPassword(Main.dnaUserName, (response) => {
        if (response[0].error === 0) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
          alert(response[0].error);
        }
      });

    } else {
      alert("Please check your internet connection");
    }
  }

  /**
   * This method is called by TwoFactorAuthMachine to submit the challenges with responses.
   * It calls checkChallenge of Native Bridge which inturn calls checkChallenge of RDNA. 
   */
  callCheckChallenge() {

    if (Main.isConnected) {
      if (onCheckChallengeResponseSubscription) {
        onCheckChallengeResponseSubscription.remove();
        onCheckChallengeResponseSubscription = null;
      }
      //      subscriptions = DeviceEventEmitter.addListener(
      //        'onCheckChallengeResponseStatus',
      //        this.onCheckChallengeResponseStatus
      //      );
      onCheckChallengeResponseSubscription = onCheckChallengeResponseStatusModuleEvt.addListener('onCheckChallengeResponseStatus',
        this.onCheckChallengeResponseStatus.bind(this));
      console.log("checkChallenge" + JSON.stringify(challengeJson));
      console.log("callCheckChallenge ----- show loader");
      Events.trigger('showLoader', true);
      console.log('----- Main.dnaUserName ' + Main.dnaUserName);
      AsyncStorage.getItem('userId').then((value) => {
        ReactRdna.checkChallenges(JSON.stringify(challengeJson), value, (response) => {
          if (response[0].error === 0) {
            console.log('immediate response is' + response[0].error);
            Main.isApiRunning = true;
          } else {
            console.log('immediate response is' + response[0].error);
            alert(response[0].error);
            Events.trigger('hideLoader', true);
          }
        });
      }).done();

    } else {
      alert("Please check your internet connection");
    }
  }
}



module.exports = TwoFactorAuthMachine;
