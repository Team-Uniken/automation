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
import Main from '../Container/Main';

// Secondary Scenes

// SECURITY SCENES
// SECURITY SCENES

import PatternLock from '../../Scenes/Screen_PatternLock';
import SelectLogin from '../../Scenes/Select_Login';
import AccessCode from '../Challenges/Access_Code';
import Activation from '../Challenges/Activation_Code';
import PasswordSet from '../Challenges/SetPassword';
import PostLoginAccessCode from '../PostLogin/Screen_PostLogin_Otp';
import QuestionSet from '../Challenges/SetQuestion';
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
import { NativeModules, NativeEventEmitter } from 'react-native'

const onCheckChallengeResponseStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)
const onGetAllChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule)


//   onGetAllChallengeStatus                                                                                              );
/*
  Instantiaions
*/
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
//let subscriptions;
let challengeName;
let onGetAllChallengeStatusSubscription;
let onCheckChallengeResponseSubscription;
//let onGetAllChallengeEvent;
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


class PostLoginAuthMachine extends Component {
  constructor(props) {
    super(props);
    console.log('---------- PostLoginAuthMachine param ');
    this.stateNavigator = null;
    this.showNextChallenge = this.showNextChallenge.bind(this);
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

    if (onCheckChallengeResponseSubscription) {
      onCheckChallengeResponseSubscription.remove();
      onCheckChallengeResponseSubscription = null;
    }

    onCheckChallengeResponseSubscription = onCheckChallengeResponseStatusModuleEvt.addListener('onCheckChallengeResponseStatus',
      this.onCheckChallengeResponseStatus.bind(this)
    );

    if (onGetAllChallengeStatusSubscription) {
      onGetAllChallengeStatusSubscription.remove();
      onGetAllChallengeStatusSubscription = null;
    }
    onGetAllChallengeStatusSubscription = onGetAllChallengeStatusModuleEvt.addListener('onGetAllChallengeStatus',
      this.onGetAllChallengeStatus.bind(this));
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
  }
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
     Setting the initial screen to UserLogin
   */
  componentDidMount() {
    screenId = 'UserLogin';
  }
  //Printing the logs of unmount.
  componentWillUnmount() {
    console.log('----- PostLoginAuthMachine unmounted');
  }

  /*
      This is method is callback method, it is called to give resposne of checkChallenge call of RDNA.
    */
  onCheckChallengeResponseStatus(e) {
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
    console.log(res);

    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      console.log('PostLoginAuthMachine - statusCode ' + statusCode);
      if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          console.log('PostLoginAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;
          const nextChlngName = chlngJson.chlng[0].chlng_name;
          if (chlngJson != null) {
            console.log('PostLoginAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            this.props.navigator.push({
              id: 'PostLoginAuthMachine',
              title: "nextChlngName",
              url: {
                "chlngJson": chlngJson,
                "screenId": nextChlngName,
              },
              challengesToBeUpdated: [challengeName],
            });
          }
        } else {
          console.log('PostLoginAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          this.getChallengesByName(this.props.challengesToBeUpdated[0]);
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

              const nextChlngName = chlngJson.chlng[0].chlng_name;
              if (chlngJson != null) {
                console.log('PostLoginAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');

                this.props.navigator.push({
                  id: 'PostLoginAuthMachine',
                  title: nextChlngName,
                  url: {
                    chlngJson,
                    screenId: nextChlngName,
                    challengesToBeUpdated: [challengeName],
                  },
                });
              }
            },
            style: 'cancel',
            }],
          { cancelable: false }
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
    // alert(JSON.stringify(args));
    // alert("response = "+ JSON.stringify(args));
    const i = challengeJsonArr.indexOf(currentIndex);
    challengeJsonArr[i] = args.response;
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
      obj.callCheckChallenge();
    }
  }


  //render screen based on a id pass to it.
  renderScene(route, nav) {
    obj.stateNavigator = nav;
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
        return (<PostLoginPasswordVerification navigator={nav} url={route.url} title={route.title} />);
      }
      return (<PasswordSet navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'otp') {
      return (<PostLoginAccessCode navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        return (<PostLoginQuestionVerification navigator={nav} url={route.url} title={route.title} />);
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
    }
    return (<Text>Error</Text>);
  }

  render() {
    return (
      <Navigator
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
          this.props.navigator.push({ id: "UpdateMachine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
        }
        else {
          setTimeout(() => {
           alert("Challenge not configured");
          }, 100);
          this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
        }
      } else {
        if (res.pArgs.response.StatusMsg.toLowerCase().includes("suspended") ||
          res.pArgs.response.StatusMsg.toLowerCase().includes("blocked")) {
          AsyncStorage.setItem("skipwelcome", "false");
          AsyncStorage.setItem("rememberuser", "empty");
        }
        setTimeout(() => {
         alert(res.pArgs.response.StatusMsg);
        }, 100);
      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }

  }
  //get perticular challenge by challege name from challege array.
  getChallengesByName(chlngName) {
    challengeName = chlngName;
    Events.trigger('showLoader', true);
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.getAllChallenges(value, (response) => {
        if (response) {
          console.log('getAllChallenges immediate response is' + response[0].error);
        } else {
          console.log('s immediate response is' + response[0].error);
        }
      })
    }).done();
  }
  /**
    * This method is called by TwoFactorAuthMachine to submit the challenges with responses.
    * It calls checkChallenge of Native Bridge which inturn calls checkChallenge of RDNA. 
    */
  callCheckChallenge() {
    if (Main.isConnected) {

      console.log("onCheckChallengeResponse ----- show loader");
      Events.trigger('showLoader', true);
      console.log('----- Main.dnaUserName ' + Main.dnaUserName);
      AsyncStorage.getItem('userId').then((value) => {
        ReactRdna.checkChallenges(JSON.stringify(challengeJson), value, (response) => {
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
}


module.exports = PostLoginAuthMachine;
