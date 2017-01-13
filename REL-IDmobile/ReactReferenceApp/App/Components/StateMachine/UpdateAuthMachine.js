'use strict';

/*
  ALWAYS NEED
*/
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';


/*
  CALLED
*/

// Secondary Scenes

// SECURITY SCENES
import PatternLock from '../Challenges/Screen_PatternLock';
import SelectLogin from '../Challenges/Screen_0_2_selectlogin';
import AccessCode from '../Challenges/Screen_Otp';
import Activation from '../Challenges/Screen_1_2_activation';
import UpdatePasswordSet from '../PostLogin/Screen_Update_Password_Dashboard';
import PostLoginAccessCode from '../PostLogin/Screen_PostLogin_Otp';
import UpdateQuestionSet from '../PostLogin/Screen_Update_Question_Dashboard';
import PostLoginQuestionVerification from '../PostLogin/Screen_PostLogin_Question_Verification';
import UserLogin from '../Challenges/Screen_2_1_username';
import DeviceBinding from '../Challenges/Screen_Device_Binding';
import DeviceName from '../Challenges/Screen_Device_Name';
import PostLoginPasswordVerification from '../PostLogin/Screen_PostLogin_password';
import ScreenHider from '../Utils/ScreenHider';

// COMPONENTS
import buildStyleInterpolator from 'buildStyleInterpolator';
import ConnectionProfile from '../../Scenes/ConnectionProfile';
import Events from 'react-native-simple-events';
import Constants from '../Constants';

var Main = require('../Main');

/*
  Instantiaions
*/
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
let subscriptions;
let obj;
let screenId;
const {
  Navigator,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  Platform,
} = ReactNative;

const {Component} = React;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


class UpdateAuthMachine extends Component {
  constructor(props) {
    super(props);
    console.log('---------- Update Machine param ');
    this.renderScene = this.renderScene.bind(this);
    this.onPostUpdate = this.onPostUpdate.bind(this);
    this.closeUpdateMachine = this.closeUpdateMachine.bind(this);
  }

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
    if(subscriptions){
      subscriptions.remove();
    }
    subscriptions = DeviceEventEmitter.addListener(
      'onUpdateChallengeStatus',
      this.onUpdateChallengeResponseStatus.bind(this)
    );
    Events.on('onPostUpdate', 'onPostUpdate', this.onPostUpdate);
    Events.on('closeUpdateMachine', 'closeUpdateMachine', this.closeUpdateMachine);
  }

  onPostUpdate(){
     this.closeUpdateMachine();
  }

  closeUpdateMachine(){
    this.props.navigator.popToTop();
    Events.rm('onPostUpdate', 'onPostUpdate');
    Events.rm('closeUpdateMachine', 'closeUpdateMachine');
    if(subscriptions){
      subscriptions.remove();
    }
  }

  componentDidMount() {
    screenId = 'Main';
    // this.props.screenId;
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
  }

  componentWillUnmount() {
    console.log('----- UpdateAuthMachine unmounted');
  }

  onErrorOccured(response) {
    console.log("-------- Error occurred ");
    if (response.ResponseData) {
      let chlngJson = response.ResponseData;
      console.log("-------- Error occurred JSON " + JSON.stringify(chlngJson));
      let nextChlngName = chlngJson.chlng[0].chlng_name;
      if (chlngJson != null) {
        console.log('UpdateAuthMachine - onErrorOccured - chlngJson != null');
        //obj.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
        obj.props.navigator.push({
          id: 'UpdateMachine',
          title: nextChlngName,
          url: {
            chlngJson,
            screenId: nextChlngName,
          },
        });
      }
    }
  }

  onUpdateChallengeResponseStatus(e) {
    const res = JSON.parse(e.response);

    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    subscriptions.remove();
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
          alert(res.pArgs.response.StatusMsg);
          //this.props.navigator.popToRoute({ id: 'Main', title: 'DashBoard', url: '' });
          Events.trigger('onPostUpdate',null);
        }
      } else {
        if(res.pArgs.response.StatusMsg.toLowerCase().includes("suspended") || 
           res.pArgs.response.StatusMsg.toLowerCase().includes("blocked")){
          AsyncStorage.setItem("skipwelcome", "false");
          AsyncStorage.setItem("rememberuser", "empty");
        }

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


  /**
   public static final String CHLNG_CHECK_USER       = "checkuser";
   public static final String CHLNG_ACTIVATION_CODE  = "actcode";
   public static final String CHLNG_SEC_QA           = "secqa";
   public static final String CHLNG_PASS             = "pass";
   public static final String CHLNG_DEV_BIND         = "devbind";
   public static final String CHLNG_DEV_NAME         = "devname";
   public static final String CHLNG_OTP              = "otp";
   public static final String CHLNG_SECONDARY_SEC_QA = "secondarySecqa";
   **/


  showNextChallenge(args) {

    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // alert(JSON.stringify(args));

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
      obj.callUpdateChallenge();
    }
  }

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
    } else if (id === 'pattern') {
      return (<PatternLock navigator={this.props.navigator} mode="set" data={route.data} onClose={route.onClose} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern}/>);
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

  hasNextChallenge() {
    return challengeJsonArr.length > currentIndex;
  }

  hasPreviousChallenge() {
    return null;
  }

  showPreviousChallenge() {
    console.log('---------- showPreviousChallenge ' + currentIndex);
    if (currentIndex > 0) {
      currentIndex--;
      obj.stateNavigator.pop();
    }
  }

  showCurrentChallenge() {

  }

  start(json, nav) {
    challengeJson = json;
    currentIndex = 0;
  }

  stop() {

  }

  getCurrentChallenge() {
    return challengeJsonArr[currentIndex];
  }

  getTotalChallenges() {

  }

  callUpdateChallenge() {
    if(Main.isConnected){

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
  }else{
    alert("Please check your internet connection");
  }
  }
}


module.exports = UpdateAuthMachine;
