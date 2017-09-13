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
    this.renderScene = this.renderScene.bind(this);
    this.onPostUpdate = this.onPostUpdate.bind(this);
    this.closeUpdateMachine = this.closeUpdateMachine.bind(this);
  }
  /** 
    *   This is life cycle method of the react native component.
    *   This method is called when the component will start to load
    * Setting the initial state of machine and registering events
   */
  componentWillMount() {
    obj = this;
    currentIndex = 0;
    challengeJson = this.props.url.chlngJson;
    if (saveChallengeJson == null) {
      saveChallengeJson = this.props.url.chlngJson;
    }
    if (challengeJson.length == 0) {
      challengeJson = saveChallengeJson;
    }
    challengeJsonArr = challengeJson.chlng;
    console.log('------ challengeJson ' + JSON.stringify(challengeJson));
    console.log('------ challengeJsonArray ' + JSON.stringify(challengeJsonArr));
    console.log('------- current Element ' + JSON.stringify(challengeJsonArr[currentIndex]));
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
            this.props.navigator.push({
              id: 'UpdateMachine',
              title: nextChlngName,
              url: {
                chlngJson,
                screenId: nextChlngName,
              },
            });
          }
        } else {
          console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
          }
          setTimeout(() => {
             alert(res.pArgs.response.StatusMsg);
          }, 100);
          //this.props.navigator.popToRoute({ id: 'Main', title: 'DashBoard', url: '' });
          Events.trigger('onPostUpdate', null);
        }
      } else {
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
    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // const i = challengeJsonArr.indexOf(currentIndex);
    // challengeJsonArr[i] = args.response;
    currentIndex++;
    if (obj.hasNextChallenge()) {
      // Show Next challenge screen
      const currentChlng = obj.getCurrentChallenge();
      obj.stateNavigator.push({
        id: currentChlng.chlng_name,
        url: {
          chlngJson: currentChlng,
          chlngsCount: challengeJsonArr.length,
          currentIndex: currentIndex + 1,
        },
        title: obj.props.title,
      });
    } else {
      // Call checkChallenge
      obj.callUpdateChallenge();
      currentIndex--;
    }
  }
  //render screen based on a id pass to it.
  renderScene(route, nav) {
    const id = route.id;
    console.log('---------- renderScene ' + id + ' url ' + route.url);

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
    } else if (id === 'pattern') {p
      return (<PatternLock navigator={this.props.navigator} mode="set" data={route.data} onClose={route.onClose} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern} disableClose={route.disableClose}/>);
    }
    return (<Text>Error</Text>);
  }

  render() {
    return (
      <Navigator
        ref={(ref) => { this.stateNavigator = ref; return ref; } }
        renderScene={this.renderScene}
        initialRoute={{
          id: this.props.url.screenId,
          url: {
            chlngJson: this.getCurrentChallenge(),
            chlngsCount: challengeJsonArr.length,
            currentIndex: currentIndex + 1,
          },
          title: this.props.title,
        }}
        configureScene={
          (route) => {
            let config = Navigator.SceneConfigs.FloatFromRight;
            config = {
              // Rebound spring parameters when transitioning FROM this scene
              springFriction: 26,
              springTension: 200,

              // Velocity to start at when transitioning without gesture
              defaultTransitionVelocity: 1.5,

              // Animation interpolators for horizontal transitioning:
              animationInterpolators: {
                into: buildStyleInterpolator(Skin.transforms.FromTheRight),
                out: buildStyleInterpolator(Skin.transforms.ToTheLeft),
              },
            };
            return config;
          }
        }
        />
    );
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
            //alert(response[0].error);
          }
        });
      }).done();
    } else {
      alert("Please check your internet connection");
    }
  }
}
module.exports = UpdateAuthMachine;
