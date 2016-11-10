'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';


/*
 CALLED
 */
import Main from './Main';
// Secondary Scenes

// SECURITY SCENES
import Activation from './nwd/Screen_1_2_activation';
import AccessCode from './nwd/Screen_Otp';
import PasswordSet from './nwd/Screen_1_3_setPassword';
import UpdatePasswordSet from './challenges/UpdatePasswordSet';
import Otp from './nwd/Screen_1_2_activation';
import QuestionSet from './nwd/Screen_Question_Set';
import QuestionVerification from './nwd/Screen_Question_Verification';
import UserLogin from './nwd/Screen_2_1_username';
import DeviceBinding from './nwd/Screen_Device_Binding';
import DeviceName from './nwd/Screen_Device_Name';
import PasswordVerification from './nwd/Screen_2_2_password';
import PatternLock from './nwd/Screen_PatternLock';
import ScreenHider from './challenges/ScreenHider';
import SelectLogin from './nwd/Screen_0_2_selectlogin';


// COMPONENTS
import buildStyleInterpolator from 'buildStyleInterpolator';
import ConnectionProfile from '../Scenes/ConnectionProfile';
import Events from 'react-native-simple-events';
import Constants from './Constants';
import Demo from './demo';
import RegisterOption from './nwd/Screen_1_4_registerOptions';
import Web from '../Scenes/Web';
import TouchID from 'react-native-touch-id';

/*
 Instantiaions
 */
let saveChallengeJson;
let challengeJson;
let challengeJsonArr;
let currentIndex;
let subscriptions;
let onForgotPasswordSubscription;
let obj;
let screenId;
let stepdone = false;
let onGetAllChallengeEvent;

const {
  Navigator,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  Platform,
  Text
} = ReactNative;

const {Component} = React;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


class TwoFactorAuthMachine extends Component {
  constructor(props) {
    super(props);
    console.log('---------- Machine param ');
    this.onCheckChallengeResponseStatus = this.onCheckChallengeResponseStatus.bind(this);
    this.initiateForgotPasswordFlow = this.initiateForgotPasswordFlow.bind(this);
    this.mode = "normal";
    this.renderScene = this.renderScene.bind(this);
    this.isTouchIDPresent = false;
    this.onGetAllChallengeStatus = this.onGetAllChallengeStatus.bind(this);
    this.isTouchPresent = this.isTouchPresent.bind(this);
    
  }

  componentWillMount() {
    obj = this;
    if (Platform.OS === 'ios') {
      this.isTouchPresent();
    }

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
    subscriptions = DeviceEventEmitter.addListener(
      'onCheckChallengeResponseStatus',
      this.onCheckChallengeResponseStatus
    );

    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
    Events.on('showCurrentChallenge', 'showCurrentChallenge', this.showCurrentChallenge);
    Events.on('forgotPassowrd', 'forgotPassword', this.initiateForgotPasswordFlow);
    


    if (onGetAllChallengeEvent) {
      onGetAllChallengeEvent.remove();
    }

    onGetAllChallengeEvent = DeviceEventEmitter.addListener(
      'onGetAllChallengeStatus',
      this.onGetAllChallengeStatus
    );

  }

  componentDidMount() {
    screenId = 'UserLogin';// this.props.screenId;
    //  Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge);
    //  Events.on('showPreviousChallenge', 'showPreviousChallenge', this.showPreviousChallenge);
  }

  componentWillUnmount() {
    console.log('----- TwoFactorAuthMachine unmounted');
  }

  onErrorOccured(response) {
    console.log("-------- Error occurred ");
    if (response.ResponseData) {
      let chlngJson = response.ResponseData;
      console.log("-------- Error occurred JSON " + JSON.stringify(chlngJson));
      let nextChlngName = chlngJson.chlng[0].chlng_name;
      if (chlngJson != null) {
        console.log('TwoFactorAuthMachine - onErrorOccured - chlngJson != null');
        //obj.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
        obj.props.navigator.push({
          id: 'Machine',
          title: nextChlngName,
          url: {
            chlngJson,
            screenId: nextChlngName,
          },
        });
      }
    }
  }

  onCheckChallengeResponseStatus(e) {
    const res = JSON.parse(e.response);
    console.log("onCheckChallengeResponse ----- hide loader");
    Events.trigger('hideLoader', true);

    // Unregister All Events
    // We can also unregister in componentWillUnmount
    subscriptions.remove();
    Events.rm('showNextChallenge', 'showNextChallenge');
    Events.rm('showPreviousChallenge', 'showPreviousChallenge');
    Events.rm('showCurrentChallenge', 'showCurrentChallenge');

    console.log(res);

    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      console.log('TwoFactorAuthMachine - statusCode ' + statusCode);
      if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          console.log('TwoFactorAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;

          const nextChlngName = chlngJson.chlng[0].chlng_name;
          if (chlngJson != null) {
            console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));

            if (nextChlngName === 'tbacred') {
              this.showNextChallenge(null);
            } else {
              this.props.navigator.push({
                id: 'Machine',
                title: nextChlngName,
                url: {
                  chlngJson,
                  screenId: nextChlngName,
                },
              });
            }
          }
        } else {
          console.log('TwoFactorAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
            Web.proxy = pPort;
            // AsyncStorage.setItem("Proxy",""+pPort);
          }
          this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          //this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
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
      } else {

        AsyncStorage.getItem("isPwdSet").then((flag) => {
          if (flag === "YES") {
            AsyncStorage.setItem("passwd", "empty");

          }

        }).done();

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
                console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
                //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
                this.props.navigator.push({
                  id: 'Machine',
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

  onForgotPasswordStatus(res) {
    if (onForgotPasswordSubscription) {
      onForgotPasswordSubscription.remove();
    }

    this.onCheckChallengeResponseStatus(e);
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

  getTBACreds() {
    //added for testing
    //   var tbacred= {chlng_name:'tbacred',chlng_idx:1,chlng_info:[{key:'Label',value:'AdditionalAuthentication'}],attempts_left:3,max_attempts_count:0,chlng_resp:[{challenge:"",response:""}],chlng_type:2,chlng_prompt:[[{credType:'touchid',isRegistered:false},{credType:'facebook',isRegistered:false},{credType:'password',isRegistered:false},{credType:'wechat',isRegistered:false}]],chlng_response_validation:false,challenge_response_policy:[],chlng_cipher_spec:["MD5"],chlng_cipher_salt:"",sub_chlng_count:1,chlngs_per_batch:1};
    //   return tbacred;
    //alert(challengeJsonArr.length);

    //Uncomment this when server is ready
    for (var i = 0; i < challengeJsonArr.length; i++) {
      if (challengeJsonArr[i].chlng_name === 'tbacred')
        return challengeJsonArr[i];
    }

    return null;
  }

  isTouchPresent() {
    var $this = this;
    TouchID.isSupported()
      .then((supported) => {
        // Success code
        console.log('TouchID is supported.');
        $this.isTouchIDPresent = false;
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        $this.isTouchIDPresent = true;
      });
  }

  resetChallenge(){
    console.log("resetChallenge");
      ReactRdna.resetChallenge((response) => {
        if (response[0].error === 0) {
        challengeJson = saveChallengeJson;
        currentIndex = 0;
        challengeJsonArr = saveChallengeJson.chlng;
        console.log('immediate response is' + response[0].error);
        var allScreens = obj.stateNavigator.getCurrentRoutes(0);
        
        for(var i = 0; i < allScreens.length; i++){
        var screen = allScreens[i];
        if(screen.id === 'checkuser'){
        var mySelectedRoute = this.props.navigator.getCurrentRoutes()[i];
        obj.stateNavigator.popToRoute(mySelectedRoute);
        return;
        }
              var chlngJson1;
              chlngJson1 = saveChallengeJson;
              const nextChlngName = chlngJson1.chlng[0].chlng_name;
              const chlngJson = chlngJson1.chlng[0];
                console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
                //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
                 obj.stateNavigator.push({
                  id:nextChlngName,
                  title: nextChlngName,
                  url: {
                    chlngJson,
                    screenId: nextChlngName,
                  },
                });
        
        
        }
        } else {
        console.log('immediate response is' + response[0].error);
        alert(response[0].error);
        }
        });
    
  }
  showNextChallenge(args) {
    console.log('----- showNextChallenge jsonResponse ' + JSON.stringify(args));
    // alert(JSON.stringify(args));
    // alert("response = "+ JSON.stringify(args));
    const i = challengeJsonArr.indexOf(currentIndex);
    if (challengeJsonArr[currentIndex] && (challengeJsonArr[currentIndex].chlng_name === 'tbacred')) {
      currentIndex++;
      if (obj.hasNextChallenge()) {
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
        obj.callCheckChallenge();
      }
    }
    else {
      challengeJsonArr[i] = args.response;
      currentIndex++;
      if (obj.hasNextChallenge()) {
        // Show Next challenge screen
        var currentChlng = obj.getCurrentChallenge();
        //alert(currentChlng.chlng_name);
        if (currentChlng.chlng_name === 'tbacred') {
          currentIndex++;
          if (obj.hasNextChallenge()) {
            currentChlng = obj.getCurrentChallenge();

            obj.stateNavigator.push({
              id: currentChlng.chlng_name,
              url: {
                chlngJson: currentChlng,
                chlngsCount: challengeJsonArr.length,
                currentIndex: currentIndex + 1,
              },
              title: obj.props.title,
            });
          }
          else {
            obj.callCheckChallenge();
          }
        } else {

          obj.stateNavigator.push({
            id: currentChlng.chlng_name,
            url: {
              chlngJson: currentChlng,
              chlngsCount: challengeJsonArr.length,
              currentIndex: currentIndex + 1,
            },
            title: obj.props.title,
          });
        }
      } else {
        // Call checkChallenge
        obj.callCheckChallenge();
      }
    }
  }


  onGetAllChallengeStatus(e) {
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
          if (chlngJson.chlng[i].chlng_name === 'tbacred')
            arrTba.push(chlngJson.chlng[i]);
        }
        if (typeof arrTba != 'undefined' && arrTba instanceof Array) {

          if (arrTba.length > 0) {


            AsyncStorage.getItem('ERPasswd').then((value) => {

              if (value) {
                this.stateNavigator.push({ id: 'RegisterOption', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": true } } });
              } else {
                if (Platform.OS === "android") {
                  this.stateNavigator.push({ id: 'RegisterOption', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": false } } });
                } else {
                  this.stateNavigator.push({ id: 'RegisterOption', title: 'RegisterOption', url: { chlngJson: { "chlng": arrTba }, touchCred: { "isTouch": $this.isTouchIDPresent } } });
                }
              }

            }).done();




          } else {
            this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
          }
        } else {
          this.props.navigator.push({ id: 'Main', title: 'DashBoard', url: '' });
        }

        //        //var arrChlng = chlngJson.chlng;
        //        var selectedChlng;
        //        var status = 0;
        //        for(var i = 0; i < chlngJson.chlng.length; i++){
        //          var chlng = chlngJson.chlng[i];
        //          if(chlng.chlng_name === challengeName){
        //
        //          }else{
        //            chlngJson.chlng.splice(i, 1);
        //            i--;
        //          }
        //        }
        //
        //        const nextChlngName = chlngJson.chlng[0].chlng_name;
        //        this.props.navigator.push({ id: "UpdateMachine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });

      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      alert('Something went wrong');
      // If error occurred reload devices list with previous response
    }

  }


  renderScene(route, nav) {
    const id = route.id;
    console.log('---------- renderScene ' + id + ' url ' + route.url);

    let challengeOperation;
    if (route.url !== undefined && !(route.url instanceof Array)) {
      if (route.url.chlngJson !== undefined)
        challengeOperation = route.url.chlngJson.challengeOperation;
    }

    if (id === 'checkuser') {
      return (<UserLogin navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'actcode') {
      stepdone = false;
      return (<Activation navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'pass') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
        var tbacredChallenge = this.getTBACreds();
        return (<SelectLogin navigator={nav} url={route.url} title={route.title} tbacred ={tbacredChallenge}/>);
      } else if (challengeOperation == 1) {
        return (<PasswordSet navigator={nav} url={route.url} title={route.title} />);
      }
      else {
        return (<UpdatePasswordSet navigator={nav} url={route.url} title={route.title} />);
      }
    } else if (id === 'otp') {
      return (<AccessCode navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'secqa' || id == 'secondarySecqa') {
      if (challengeOperation == Constants.CHLNG_VERIFICATION_MODE) {
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
      return (<RegisterOption navigator={nav} parentnav={obj.props.navigator} url={route.url} title={route.title} />);
    } else if (id === 'pattern') {
      return (<PatternLock navigator={nav} mode={route.mode} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern}/>);
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
    } else {
//      var chlngJson;
//      chlngJson = saveChallengeJson;
//      const nextChlngName = chlngJson.chlng[0].chlng_name;
//        console.log('TwoFactorAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
//        //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
//         obj.stateNavigator.push({
//          id:nextChlngName,
//          title: nextChlngName,
//          url: {
//            chlngJson,
//            screenId: nextChlngName,
//          },
//        });
      
      obj.resetChallenge();
    }
  }

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

  initiateForgotPasswordFlow() {
    this.mode = "forgotPassword";
    Events.rm('forgotPassowrd', 'forgotPassword');
    onForgotPasswordSubscription = DeviceEventEmitter.addListener(
      'onForgotPasswordStatus',
      this.onCheckChallengeResponseStatus
    );
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
  }

  callCheckChallenge() {
    console.log("checkChallenge" + JSON.stringify(challengeJson));
    console.log("callCheckChallenge ----- show loader");
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
  }
}


module.exports = TwoFactorAuthMachine;
