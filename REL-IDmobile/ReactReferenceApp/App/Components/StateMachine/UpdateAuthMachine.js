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


/*
 Instantiaions
 */
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
//let subscriptions;
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

class UpdateAuthMachine extends Component {
  constructor(props) {
    super(props);
    console.log('---------- Update Machine param ');
//    this.renderScene = this.renderScene.bind(this);
    this.onPostUpdate = this.onPostUpdate.bind(this);
    this.closeUpdateMachine = this.closeUpdateMachine.bind(this);
    this.onPostUpdate = this.onPostUpdate.bind(this);
    this.closeUpdateMachine = this.closeUpdateMachine.bind(this);
//    this.isTouchPresent = this.isTouchPresent.bind(this);
    this.showFirstChallenge = this.showFirstChallenge.bind(this);
    this.canShowNextChallenge = this.canShowNextChallenge.bind(this);
    this.showNextChallenge = this.showNextChallenge.bind(this);
//    this.resetChallenge = this.resetChallenge.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  /**
   *   This is life cycle method of the react native component.
   *   This method is called when the component will start to load
   * Setting the initial state of machine and registering events
   */
  componentWillMount() {
    obj = this;
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
    if (onUpdateChallengeStatusSubscription) {
      onUpdateChallengeStatusSubscription.remove();
      onUpdateChallengeStatusSubscription = null;
    }
    onUpdateChallengeStatusSubscription = onUpdateChallengeStatusModuleEvt.addListener('onUpdateChallengeStatus',
      this.onUpdateChallengeStatus.bind(this));
    Events.on('onPostUpdate', 'onPostUpdate', this.onPostUpdate);
    Events.on('closeUpdateMachine', 'closeUpdateMachine', this.closeUpdateMachine);
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
//    this.props.navigator.popToTop();
    this.props.navigation.goBack();
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
  onUpdateChallengeStatus(e) {
    const res = JSON.parse(e.response);
    
    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    if (onUpdateChallengeStatusSubscription) {
      onUpdateChallengeStatusSubscription.remove();
      onUpdateChallengeStatusSubscription = null;
    }
    Events.rm('showNextChallenge', 'showNextChallenge');
    Events.rm('showPreviousChallenge', 'showPreviousChallenge');
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
            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//            this.props.navigator.push({
//            id: 'UpdateMachine',
//            title: nextChlngName,
//            url: {
//              chlngJson,
//            screenId: nextChlngName,
//              },
//              });
            this.showFirstChallenge(chlngJson, 0);
          }
        } else {
          console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
//          const pPort = res.pArgs.pxyDetails.port;
//          if (pPort > 0) {
//            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
//          }
          setTimeout(() => {
            alert(res.pArgs.response.StatusMsg);
            }, 100);
          //this.props.navigator.popToRoute({ id: 'Main', title: 'DashBoard', url: '' });
          Events.trigger('onPostUpdate', null);
        }
      } else {
        
        if (Main.isOtherLogin === true) {
          Main.isOtherLogin = false;
        }
        const chlngJson = res.pArgs.response.ResponseData;
        
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
              if (res.pArgs.response.ResponseData == null) {
              chlngJson = saveChallengeJson;
              } else {
              chlngJson = res.pArgs.response.ResponseData;
              }
              
              const currentChlng = challengeJsonArr[currentIndex];
              
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
//              this.props.navigator.push({
//              id: 'UpdateMachine',
//              title: nextChlngName,
//              url: {
//                chlngJson,
//              screenId: nextChlngName,
//                },
//                });
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
              },
            style: 'cancel',
              }]
            );
          }, 100);
      }
    } else {
      console.log(e);
      setTimeout(() => {
        alert('Internal system error occurred.' + res.errCode);
        }, 100);
    }
  }
  /**
   * This method is called to show next challenge in challenge array on UI.
   * This method can also be called by triggering showNextChallenge event
   */
  showNextChallenge(args) {
//    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
//    // const i = challengeJsonArr.indexOf(currentIndex);
//    // challengeJsonArr[i] = args.response;
//    currentIndex++;
//    if (obj.hasNextChallenge()) {
//      // Show Next challenge screen
//      const currentChlng = obj.getCurrentChallenge();
//      obj.stateNavigator.push({
//      id: currentChlng.chlng_name,
//      url: {
//      chlngJson: currentChlng,
//      chlngsCount: challengeJsonArr.length,
//      currentIndex: currentIndex + 1,
//        },
//      title: obj.props.title,
//        });
//    } else {
//      // Call checkChallenge
//      obj.callUpdateChallenge();
//      currentIndex--;
//    }
    
    currentIndex++;
    var result = obj.canShowNextChallenge();
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
        
        if (result.challenge) {var name =result.challenge.chlng_name
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
          obj.callUpdateChallenge();
        }
      } else {
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
      obj.callUpdateChallenge();
    }
  }
  //render screen based on a id pass to it.
  getComponentByName(route, nav) {
    
    const ur = route.url;
    const id = route.id;
    
    let challengeOperation;
    if (route.url !== undefined) {
      challengeOperation = route.url.chlngJson.challengeOperation;
    }
    
    if (id === 'checkuser') {
      return (<UserLogin navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'actcode') {
      return (<Activation navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'pass') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        //return (<PasswordVerification navigator={nav} url={route.url} title={route.title} />);
      }
      else {
        return (<UpdatePasswordSet navigator={nav} parentnav={this.props.navigator} url={route.url} title={route.title} />);
      }
    } else if (id === 'otp') {
      return (<Otp navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        //return (<QuestionVerification navigator={nav} url={route.url} title={route.title} />);
      }
      else {
        return (<UpdateQuestionSet navigator={nav} parentnav={this.props.navigator} url={route.url} title={route.title} />);
      }
    } else if (id === 'devname') {
      //return (<ScreenHider navigator={nav} url={route.url} title={route.title} />);
      return (<DeviceName navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'devbind') {
      //return (<ScreenHider navigator={nav} url={route.url} title={route.title} />);
      return (<DeviceBinding navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'ConnectionProfile') {
      return (<ConnectionProfile navigator={obj.props.navigator} url={route.url} title={route.title} />);
    } else if (id === 'pattern') {
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
//    Events.on('forgotPassowrd', 'forgotPassword', this.initiateForgotPasswordFlow);
//    Events.on('resetChallenge', 'resetChallenge', this.resetChallenge);
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
   * Returns true if next challenge exist based on currentIndex, else returns false
   */
  hasNextChallenge() {
    return challengeJsonArr.length > currentIndex;
  }
  /**
   * This method pops the current screen and decrements the currentIndex,
   */
  hasPreviousChallenge() {
    return null;
  }
  /**
   * This method pops the current screen and decrements the currentIndex,
   */
  showPreviousChallenge() {
    console.log('---------- showPreviousChallenge ' + currentIndex);
    if (currentIndex > 0) {
      currentIndex--;
      obj.stateNavigator.pop();
    }
  }
  
  /**
   * Returns current challenge based on currentIndex.
   */
  getCurrentChallenge() {
    return challengeJsonArr[currentIndex];
  }
  
  /**
   * This method is called by UpdateAuthMachine to submit the challenges with responses.
   * It calls updateChallenges of Native Bridge which inturn calls updateChallenges of RDNA.
   */
  callUpdateChallenge() {
    if (Main.isConnected) {
      
      Events.trigger('showLoader', true);
      console.log('----- Main.dnaUserName ' + Main.dnaUserName);
      AsyncStorage.getItem('userId').then((value) => {
        ReactRdna.updateChallenges(JSON.stringify(challengeJson), value, (response) => {
          if (response[0].error === 0) {
          console.log('immediate response is' + response[0].error);
          } else {
          console.log('immediate response is' + response[0].error);
          alert(response[0].error);
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
