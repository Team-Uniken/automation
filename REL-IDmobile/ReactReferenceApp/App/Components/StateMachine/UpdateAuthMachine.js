'use strict';

/*
  ALWAYS NEED
*/
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';


/*
  CALLED
*/

// Secondary Scenes

// SECURITY SCENES
import PatternLock from '../../Scenes/Screen_PatternLock';
import SelectLogin from '../../Scenes/Select_Login';
import AccessCode from '../Challenges/Access_Code';
import Activation from '../Challenges/Activation_Code';
import UpdatePasswordSet from '../PostLogin/Update_Password_Dashboard';
import UpdateQuestionSet from '../PostLogin/Update_Question_Dashboard';
import PostLoginQuestionVerification from '../PostLogin/PostLogin_Question_Verification';
import UserLogin from '../Challenges/Check_User';
import DeviceBinding from '../Challenges/Device_Binding';
import DeviceName from '../Challenges/Device_Name';
import PostLoginPasswordVerification from '../PostLogin/Screen_PostLogin_password';
import ScreenHider from '../Utils/ScreenHider';

// COMPONENTS
import buildStyleInterpolator from 'buildStyleInterpolator';
import ConnectionProfile from '../../Scenes/ConnectionProfile';
import Events from 'react-native-simple-events';
import Constants from '../Utils/Constants';
import { NativeModules, NativeEventEmitter } from 'react-native';
var Main = require('../Container/Main');
import {Navigator} from 'react-native-deprecated-custom-components'
import { NavigationActions} from 'react-navigation';
import Util from '../Utils/Util';
/*
  Instantiaions
*/
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
//let subscriptions;
let onCheckChallengeResponseSubscription;
let onUpdateChallengeStatusSubscription
let obj;
let screenId;
const {
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  Platform,
} = ReactNative;


const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onUpdateChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onCheckChallengeResponseStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
class UpdateAuthMachine extends Component {
  constructor(props) {
    super(props);
    console.log('---------- Update Machine param ');
//    this.renderScene = this.renderScene.bind(this);
    this.onPostUpdate = this.onPostUpdate.bind(this);
    this.closeUpdateMachine = this.closeUpdateMachine.bind(this);
    this.isTouchPresent = this.isTouchPresent.bind(this);
    this.showFirstChallenge = this.showFirstChallenge.bind(this);
    this.canShowNextChallenge = this.canShowNextChallenge.bind(this);
    this.showNextChallenge = this.showNextChallenge.bind(this);
    this.resetChallenge = this.resetChallenge.bind(this);
    this.goBack = this.goBack.bind(this);
    this.mode = "mode";
  }
  /** 
    *   This is life cycle method of the react native component.
    *   This method is called when the component will start to load
    * Setting the initial state of machine and registering events
   */
  componentWillMount() {
//    obj = this;
//    currentIndex = 0;
//    challengeJson = this.props.url.chlngJson;
//    if (saveChallengeJson == null) {
//      saveChallengeJson = this.props.url.chlngJson;
//    }
//    if (challengeJson.length == 0) {
//      challengeJson = saveChallengeJson;
//    }
//    challengeJsonArr = challengeJson.chlng;
//    console.log('------ challengeJson ' + JSON.stringify(challengeJson));
//    console.log('------ challengeJsonArray ' + JSON.stringify(challengeJsonArr));
//    console.log('------- current Element ' + JSON.stringify(challengeJsonArr[currentIndex]));
//    if (onUpdateChallengeStatusSubscription) {
//      onUpdateChallengeStatusSubscription.remove();
//      onUpdateChallengeStatusSubscription = null;
//    }
//    onUpdateChallengeStatusSubscription = onUpdateChallengeStatusModuleEvt.addListener('onUpdateChallengeStatus',
//      this.onUpdateChallengeStatus.bind(this));
//    Events.on('onPostUpdate', 'onPostUpdate', this.onPostUpdate);
//    Events.on('closeUpdateMachine', 'closeUpdateMachine', this.closeUpdateMachine);
//    
    
    obj = this;
    if (Platform.OS === 'ios') {
      this.isTouchPresent();
    }
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
    Events.on('showCurrentChallenge', 'showCurrentChallenge', this.showCurrentChallenge);
    Events.on('forgotPassowrd', 'forgotPassword', this.initiateForgotPasswordFlow);
    Events.on('resetChallenge', 'resetChallenge', this.resetChallenge);
    
    
//    if (onGetAllChallengeStatusSubscription) {
//      onGetAllChallengeStatusSubscription.remove();
//      onGetAllChallengeStatusSubscription = null;
//    }
    
    //    onGetAllChallengeEvent = DeviceEventEmitter.addListener(
    //      'onGetAllChallengeStatus',
    //      this.onGetAllChallengeStatus
    //    );
//    onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
//      this.onGetAllChallengeStatus.bind(this));
  }
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
     Setting the initial screen to UserLogin
   */
  componentDidMount() {
    screenId = 'Main';
    // this.props.screenId;
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
  }
  //Printing the logs of unmount.
  componentWillUnmount() {
    console.log('----- UpdateAuthMachine unmounted');
  }

  onPostUpdate() {
    this.closeUpdateMachine();
  }

  closeUpdateMachine() {
    this.props.navigator.popToTop();
    Events.rm('onPostUpdate', 'onPostUpdate');
    Events.rm('closeUpdateMachine', 'closeUpdateMachine');
    if (onUpdateChallengeStatusSubscription) {
      onUpdateChallengeStatusSubscription.remove();
      onUpdateChallengeStatusSubscription = null;
    }
  }
  /*
     This is method is callback method, it is called to give resposne of updateChallenges call of RDNA.
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
//              if (onGetAllChallengeStatusSubscription) {
//                onGetAllChallengeStatusSubscription.remove();
//                onGetAllChallengeStatusSubscription = null;
//              }
              //              this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard',navigator:this.props.navigator})
//              const navigateToDashboard = NavigationActions.reset({
//              index: 0,
//              actions: [
//                NavigationActions.navigate({ routeName: 'DashBoard',params:{url: '',title:'DashBoard',navigator:this.props.navigator}})
//                ]
//                })
//              this.props.navigation.dispatch(navigateToDashboard)
              this.goBack();
              
//              const ResetToDashboardScreen = NavigationActions.reset({
//                
//              index: 1,
//              actions: [
//                NavigationActions.navigate({routeName: 'UpdateMachine',params:{{...props}}}),
//                NavigationActions.navigate({routeName: 'DashBoard',params:{url: '',title:'DashBoard',navigator:this.props.navigation}})
//                ]
//                });
//              this.props.navigation.dispatch(ResetToDashboardScreen)
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
                NavigationActions.navigate({ routeName: 'UpdateMachine',params:{url: {
                  chlngJson,
                screenId: nextChlngName,
                currentIndex:0
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

  isTouchPresent() {
//    var $this = this;
//    TouchID.isSupported()
//    .then((supported) => {
//      // Success code
//      console.log('TouchID is supported.');
//      $this.isTouchIDPresent = true;
//      })
//    .catch((error) => {
//      // Failure code
//      console.log(error);
//      $this.isTouchIDPresent = false;
//      });
    return false;
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
        NavigationActions.navigate({ routeName: 'UpdateMachine',params:{url: {
        reset: true,
          chlngJson,
        screenId: nextChlngName,
        currentIndex:0,
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
          //          this.props.navigation.navigate('UpdateMachine',{url: {
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
            NavigationActions.navigate({ routeName: 'UpdateMachine',params:{url: {
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
        //        this.props.navigation.navigate('UpdateMachine',{url: {
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
          NavigationActions.navigate({ routeName: 'UpdateMachine',params:{
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

  
  
  getComponentByName(route, nav) {
    
    const ur = route.url;
    const id = route.id;
    console.log('---------- renderScene ' + id + ' url ' + route.url);

    let challengeOperation;
    if (route.url !== undefined) {
      challengeOperation = route.url.chlngJson.challengeOperation;
    }
    if (id === 'pass') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        //return (<PasswordVerification navigator={nav} url={route.url} title={route.title} />);
      }
      else {
        return (<UpdatePasswordSet navigator={nav} parentnav={this.props.navigator} url={route.url} title={route.title} />);
      }
    }else if (id === 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        //return (<QuestionVerification navigator={nav} url={route.url} title={route.title} />);
             }
          else {
             return (<UpdateQuestionSet navigator={nav} parentnav={this.props.navigator} url={route.url} title={route.title} />);
              }
       }
      else if (id === 'pattern') {
      return (<PatternLock navigator={this.props.navigator} mode="set" data={route.data} onClose={route.onClose} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern} disableClose={route.disableClose}/>);
    }
    return (<Text>Error</Text>);
  }

    render() {
      challengeJsonArr = this.props.navigation.state.params.url.chlngJson.chlng;
      challengeJson = this.props.navigation.state.params.url.chlngJson;
          if (saveChallengeJson == null) {
            saveChallengeJson = this.props.navigation.state.params.url.chlngJson;
          }
          if (challengeJson.length == 0) {
            challengeJson = saveChallengeJson;
          }
      var sId = this.props.navigation.state.params.url.screenId;
      currentIndex = this.props.navigation.state.params.url.currentIndex;
      
        var params = {id:sId,
        url:{
        chlngJson: this.getCurrentChallenge(),
        chlngsCount: challengeJsonArr.length,
        currentIndex: currentIndex + 1,
        }, title:this.props.navigation.state.params.url.screenId};
        
        return(this.getComponentByName(params,this.props.navigation))
      
    }
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
              NavigationActions.navigate({ routeName: 'UpdateMachine',params:{url: {
                chlngJson,
              screenId: firstChlngName,
              currentIndex:startIndex,
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
      console.log('---------- showPreviousChallenge ' + currentIndex + JSON.stringify(challengeJson));
      if (currentIndex > 0) {
        currentIndex--;
        //      obj.stateNavigator.pop();
        obj.showFirstChallenge(challengeJson,currentIndex)
        
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
          NavigationActions.navigate({ routeName: 'UpdateMachine',params:{
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
//      if (onGetAllChallengeStatusSubscription) {
//        onGetAllChallengeStatusSubscription.remove();
//        onGetAllChallengeStatusSubscription = null;
//      }
      //    this.props.navigation.navigate('DashBoard',{url: '',title:'DashBoard',navigator:this.props.navigator})
//      const navigateToDashboard = NavigationActions.reset({
//      index: 0,
//      actions: [
//        NavigationActions.navigate({ routeName: 'DashBoard',params:{url: '',title:'DashBoard',navigator:this.props.navigator}})
//        ]
//        })
//      this.props.navigation.dispatch(navigateToDashboard)
      
      
//      const ResetToDashboardScreen = NavigationActions.reset({
//        
//      index: 1,
//      actions: [
//        NavigationActions.navigate({routeName: 'UpdateMachine',params:{url: '',title:'DashBoard',navigator:this.props.navigation}}),
//        NavigationActions.navigate({routeName: 'DashBoard',params:{url: '',title:'DashBoard',navigator:this.props.navigation}})
//        ]
//        });
//      this.props.navigation.dispatch(ResetToDashboardScreen)
//      
//      Events.rm('onPostForgotPassword', 'onPostForgotPassword');
//      Events.rm('finishForgotPasswordFlow', 'finishForgotPasswordFlow');
      this.goBack();
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
  
  goBack(){
    this.props.navigation.goBack();
    
  }
  

  }


module.exports = UpdateAuthMachine;
