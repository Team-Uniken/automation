
/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;


/*
  CALLED
*/
var buildStyleInterpolator = require('buildStyleInterpolator');
var Main = require('./Main');
var MainAndroid = require('./MainAndroid');

var Otp = require('./challenges/Otp');
var SetQue = require('./challenges/SetQue');
var UserLogin = require('./challenges/UserLogin');
var PasswordVerification = require('./challenges/PasswordVerification');
var QuestionVerification = require('./challenges/questionVerification');
var DeviceBinding = require('./challenges/devbind');
var DeviceName = require('./challenges/devname');
var Constants = require('./Constants');
var Events = require('react-native-simple-events');
var Device = require('./device');
var ActivateNewDevice = require('./ActivateNewDevice');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var ConnectionProfile = require('./ConnectionProfile');
var Load = require('./Load');

import PasswordSet from './challenges/PasswordSet';
import Activation from './challenges/Activation';


/*
  Instantiaions
*/
var challengeJson;
var challengeJsonArr;
var currentIndex;
var totalChallengesCount;
var screenId;
var subscriptions;
var obj;
var stateNavigator;
var {
  Component,
  Text,
  Navigator,
  Dimensions,
  PixelRatio,
  Animated,
  AsyncStorage,
  DeviceEventEmitter,
  Platform,
} = React;


class TwoFactorAuthMachine extends React.Component {
  constructor(props) {
    super(props);
    console.log('---------- Machine param ');
  }

  componentDidMount() {
    screenId = 'UserLogin';// this.props.screenId;

    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
	                    }

  componentWillMount() {
    obj = this;
    currentIndex = 0;
    challengeJson = this.props.url.chlngJson;
    challengeJsonArr = challengeJson.chlng;
    console.log('------ challengeJson ' + JSON.stringify(challengeJson));
    console.log('------ challengeJsonArray ' + JSON.stringify(challengeJsonArr));
    console.log('------- current Element ' + JSON.stringify(challengeJsonArr[currentIndex]));
    subscriptions = DeviceEventEmitter.addListener('onCheckChallengeResponseStatus', this.onCheckChallengeResponseStatus.bind(this));
  }

  componentWillUnmount() {
    console.log('----- TwoFactorAuthMachine unmounted');
  }

  onCheckChallengeResponseStatus(e) {
    var res = JSON.parse(e.response);
    var statusCode = res.pArgs.response.StatusCode;
    if (res.errCode == 0) {
      if (statusCode == 100) {

        // Unregister All Events
        // We can also unregister in componentWillUnmount
        subscriptions.remove();
        Events.rm('showNextChallenge', 'showNextChallenge');
        if (res.pArgs.response.ResponseData) {
          var chlngJson = res.pArgs.response.ResponseData;
          var nextChlngName = chlngJson.chlng[0].chlng_name;

        // this.props.navigator.pop();
        // this.props.navigator.replace();
          if (chlngJson != null) {
            this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            this.props.navigator.push({ id: 'Machine', title: nextChlngName, url: { 'chlngJson': chlngJson, 'screenId': nextChlngName } });
          }
        } else {
          var pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => {});
          }
          this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          if(Platform === 'ios')
          this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
            else {
              this.props.navigator.push({ id: 'MainAndroid', title: 'DashBoard', url: '' });

            }
        }

      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      alert();
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

  renderScene(route, nav) {
    var id = route.id;
    console.log('---------- renderScene ' + id + ' url ' + route.url);

    var challengeOperation;
    if (route.url != undefined) {
      challengeOperation = route.url.chlngJson.challengeOperation;
    }

    if (id == 'checkuser') {
      return (<UserLogin navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'actcode') {
      return (<Activation navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'pass') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE)
        return (<PasswordVerification navigator={nav} url={route.url} title={route.title} />);
      else
        return (<PasswordSet navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'otp') {
      return (<Otp navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE)
        return (<QuestionVerification navigator={nav} url={route.url} title={route.title} />);
      else
        return (<SetQue navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'devname') {
      return (<DeviceName navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == 'devbind') {
      return (<DeviceBinding navigator={nav} url={route.url} title={route.title} />);
    } else if (id == 'ConnectionProfile') {
      return (<ConnectionProfile navigator={obj.props.navigator} url={route.url} title={route.title} />);
    }
  }

  render() {
    return (
      <Navigator
        ref={
          (ref) => this.stateNavigator = ref
        }
        renderScene={this.renderScene}
        initialRoute={
          { id: this.props.url.screenId, url: { 'chlngJson': this.getCurrentChallenge(), 'chlngsCount': challengeJsonArr.length, 'currentIndex': currentIndex + 1 }, title: this.props.title }
        }

        configureScene={
          (route) => {
            var config = Navigator.SceneConfigs.FloatFromRight;
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

  showNextChallenge(args) {
    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // alert(JSON.stringify(args));

    var i = challengeJsonArr.indexOf(currentIndex);
    challengeJsonArr[i] = args.response;

    currentIndex ++;
    if (obj.hasNextChallenge()) {
      // Show Next challenge screen
      var currentChlng = obj.getCurrentChallenge();
      obj.stateNavigator.push({ id: currentChlng.chlng_name, url: { 'chlngJson': currentChlng, 'chlngsCount': challengeJsonArr.length, 'currentIndex': currentIndex + 1 }, title: obj.props.title });
    } else {
      // Call checkChallenge
      obj.callCheckChallenge();
    }
  }

  hasNextChallenge() {
    return challengeJsonArr.length > currentIndex;
  }

  hasPreviousChallenge() {

  }

  showPreviousChallenge() {

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

  callCheckChallenge() {

    console.log('----- Main.dnaUserName ' + Main.dnaUserName);
    AsyncStorage.getItem('userId').then((value) => {

      ReactRdna.checkChallenges(JSON.stringify(challengeJson), value, (response) => {
        if (response[0].error == 0) {
          console.log('immediate response is' + response[0].error);
                                  // alert(response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
          alert(response[0].error);
        }

      });
    }).done();
  }
}



module.exports = TwoFactorAuthMachine;
