'use strict';

/*
 ALWAYS NEED
 */
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../Skin';
import Events from 'react-native-simple-events';

/*
 CALLED
 */
import TouchID from 'react-native-touch-id';
import MainActivation from '../Components/MainActivation';
import { DeviceEventEmitter } from 'react-native';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
import erelid from '../../erelid.json';
import TouchId from 'react-native-smart-touch-id'
import Web from './Web';
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
var PushNotification = require('react-native-push-notification');
//import Notification from 'react-native-system-notification';

const reason = 'Please validate your Touch Id';
/*
 Instantiaions
 */

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
let gotNotification = false;
let appalive = false;
let obj1;

console.log = function () { }

const {Text, View, Animated, InteractionManager, AppState, Image, AsyncStorage, Alert, Platform, BackAndroid, StatusBar,PushNotificationIOS, AppStateIOS, AlertIOS, StyleSheet, } = ReactNative;

const {Component} = React;

BackAndroid.addEventListener('hardwareBackPress', function () {
  return true;
});

/*
 Class Load
 */

class Load extends Component {
  constructor(props) {
    super(props);
    this.state = {
      r_opac_val: new Animated.Value(0),
      i_opac_val: new Animated.Value(0),
      d_opac_val: new Animated.Value(0),
      relid_text_opac: new Animated.Value(0),
      rid_top: new Animated.Value(150),
      r_text_opac: new Animated.Value(0),
      i_text_opac: new Animated.Value(0),
      d_text_opac: new Animated.Value(0),
      relid_opac_val: new Animated.Value(0),
    };
  }
  openRoute(route) {
    this.props.navigator.push(route);
  }


  //Push notification code


    closeStateMachine() {
    console.log('---------- closeStateMachine ' );
      var allScreens =obj1.props.navigator.getCurrentRoutes(-1);
      for(var i = 0; i < allScreens.length; i++){
        var screen = allScreens[i];
        if(screen.id === 'Screen_0_1_welcome'){
          var mySelectedRoute = obj1.props.navigator.getCurrentRoutes()[i];
          obj1.props.navigator.popToRoute(mySelectedRoute);
          return;
        }
      }
       obj1.props.navigator.push({
          id: "Screen_0_1_welcome",
          //id: "Screen_0_2_selectlogin",
          title: "nextChlngName",
          url: {
            "chlngJson": chlngJson,
            "screenId": nextChlngName
          }
        });
  }

  componentWillMount() {
    obj1=this;
        Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);

    console.log('test logs');
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', (token) => console.log('TOKEN', token))
      PushNotificationIOS.addEventListener('notification', this._onNotification);
      PushNotificationIOS.requestPermissions();
    } else {
      //Android push notification listeners to be added here.
    }
  }

  _onNotification(notification) {

    var allScreens = Obj.props.navigator.getCurrentRoutes(0);
    for (var i = 0; i < allScreens.length; i++) {
      var screen = allScreens[i];
      if (screen.id == 'Main') {
        console.log('-----getMyNotifications called when notication comes-----');
        gotNotification = true;
        Obj.getMyNotifications();
        break;
      } else {
        gotNotification = false;
      }
    }

    if (gotNotification == false) {
      AlertIOS.alert(
        '',
        notification.getMessage(), [{
          text: 'Dismiss',
          onPress: null,
        }]
      );
    }
  }
  //Push notification code Ends


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
        //                               if (NotificationObtianedResponse !== undefined) {
        //                               // If error occurred reload last response
        //
        //                                                              }
      }

    });
  }



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
          console.log('NOTIFICATION:', notification);
          gotNotification = true;

          if (appalive == true) {
            Obj.getMyNotifications();
          }

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
        senderID: "379127486882",

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

    if (onPauseCompletedListener !== undefined) {
      console.log("--------------- removing onPauseCompleted");
      onPauseCompletedListener.remove();
    }

    if (onResumeCompletedListener !== undefined) {
      onResumeCompletedListener.remove();
    }

    onPauseCompletedListener = DeviceEventEmitter.addListener('onPauseCompleted', function (e) {
      appalive = false;
      console.log('On Pause Completed:');
      console.log('immediate response is' + e.response);
      responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        console.log('Pause Successfull');
      } else {
        alert('Failed to Pause with Error ' + responseJson.errCode);
      }
    });

    onResumeCompletedListener = DeviceEventEmitter.addListener('onResumeCompleted', function (e) {
      console.log('On Resume Completed:');
      console.log('immediate response is' + e.response);
      responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        const pPort = responseJson.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
            Web.proxy = pPort;
            // AsyncStorage.setItem("Proxy",""+pPort);
        }
        appalive = true;
        console.log('Resume Successfull');
        if (gotNotification == true) {
          Obj.getMyNotifications();
          gotNotification = false;
        }

        var allScreens = Obj.props.navigator.getCurrentRoutes(0);
        for (var i = 0; i < allScreens.length; i++) {
          var screen = allScreens[i];
          if (screen.id == 'Main') {
            console.log('-----getMyNotifications called when notication comes-----');
            Obj.getMyNotifications();
            break;
          }
        }


        AsyncStorage.setItem("savedContext", "");
      } else {
        AsyncStorage.setItem("savedContext", "");
        alert('Failed to Resume with Error ' + responseJson.errCode + '. Please restart application.');

      }
    });

    onInitCompletedListener = DeviceEventEmitter.addListener('onInitializeCompleted', function (e) {
      onInitCompletedListener.remove();
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
        Obj.onInitCompleted();
        console.log('--------- onInitializeCompleted initCount ' + initCount);
      } else {
        initCount = initError;
        initErrorMsg = 'Unable to connect to server, please check the connection profile. Error code ' + responseJson.errCode;
        console.log('--------- onInitializeCompleted initCount ' + initCount);
        Obj.onInitCompleted();
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
          if (currentProfile != null || currentProfile.length > 0) {
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

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.r_opac_val, {
          toValue: 1,
          duration: 2000 * Skin.spd,
          delay: 1000 * Skin.spd,
        }),
        Animated.timing(this.state.r_text_opac, {
          toValue: 1,
          duration: 2000 * Skin.spd,
          delay: 1000 * Skin.spd,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.r_text_opac, {
          toValue: 0,
          duration: 500 * Skin.spd,
          delay: 1000 * Skin.spd,
        }),
        Animated.timing(this.state.i_opac_val, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
        Animated.timing(this.state.i_text_opac, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.i_text_opac, {
          toValue: 0,
          duration: 500 * Skin.spd,
          delay: 1000 * Skin.spd,
        }),
        Animated.timing(this.state.d_opac_val, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
        Animated.timing(this.state.d_text_opac, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.d_text_opac, {
          toValue: 0,
          duration: 500 * Skin.spd,
          delay: 1000 * Skin.spd,
        }),
        Animated.timing(this.state.relid_opac_val, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
        Animated.timing(this.state.relid_text_opac, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.relid_text_opac, {
          toValue: 1,
          duration: 500 * Skin.spd,
          delay: 1500 * Skin.spd,
        }),
      ])
    ]).start();


    InteractionManager.runAfterInteractions(() => {
      isRunAfterInteractions = true;
      Obj.onInitCompleted();
    });

  }
  _handleAppStateChange(currentAppState) {
        console.log('_handleAppStateChange');
        console.log(currentAppState);
    
        if (currentAppState == 'background') {
          console.log('App State Change background:');
    
          ReactRdna.pauseRuntime((response) => {
            if (response) {
              if (response[0].error == 0) {
                AsyncStorage.setItem("savedContext", response[0].response);
              }
              console.log('Immediate response is ' + response[0].error);
            } else {
              console.log('No response.');
            }
          })
        } else if (currentAppState == 'active') {
          console.log('App State Change active:');
          AsyncStorage.getItem("savedContext").then((value) => {
            if (value != null) {
              ReactRdna.resumeRuntime(value, null, (response) => {
                if (response) {
                  console.log('Immediate response is ' + response[0].error);
                } else {
                  console.log('No response.');
                }
              })
            }
          }).done();
        } else if (currentAppState === 'inactive') {
          console.log('App State Change Inactive');
        }
  }


  doInitialize() {
    this.newDoInitialize();
    //    AsyncStorage.getItem("passwd").then((value) => {
    //                                        if(value){
    //                                        if(value === "empty"){
    //                                        //PROCEED NORMAL WAY.
    //                                        this.newDoInitialize();
    //                                        }else{
    //                                        savedUserName = value;
    //                                        //SHOW FINGER PRINT ALERT AND PROCEED
    //                                        if(Platform.OS === 'ios'){
    //                                        console.log("ios touch");
    //                                        this._verifyTouchIdSupport();
    //                                        }else{
    //                                        this.newDoInitialize();
    //                                        };
    ////
    //                                        }
    //                                        }else{
    //                                        this.newDoInitialize();
    //                                        }
    //                                        }).done();
  }
  //  
  //  _isSupported = () => {
  //    TouchId.isSupported( (error) => {
  //                        if (error) {
  //                        Alert.alert('TouchId is not supported!')
  //                        } else {
  //                        this._trggerTouchId();
  //                        }
  //                        })
  //  }
  //  
  //  _trggerTouchId = () => {
  //    let description = 'Verify the existing mobile phone fingerprint using the home key'
  //    //let title       //fallback button title will be default as 'Enter Password'(localized)
  //    //let title = ""  //fallback button will be hidden
  //    //fallback button title will be 'Verify Password'(unlocalized)
  //    TouchId.verify( description, title, (error) => {
  //                   if (error) {
  //                   if(error.message == '-3') {
  //                   //fallback button is pressed
  //                   Alert.alert('errorCode: ' + error.message + ' verify failed, user wants to ' + title)
  //                   }
  //                   else {
  //                   Alert.alert('errorCode: ' + error.message + ' verify failed')
  //                   }
  //                   } else {
  //                   this.newDoInitialize();
  //                   }
  //                   })
  //  }
  //  
  //  _verifyTouchIdSupport(){
  //    TouchID.isSupported()
  //    .then(supported => {
  //          // Success code
  //          console.log('TouchID is supported.');
  //          this._verifyTouchId();
  //          })
  //    .catch(error => {
  //           // Failure code
  //           this.newDoInitialize()//normal way
  //           console.log('TouchID is not supported.');
  //           console.log(error);
  //           });
  //  }
  //  _verifyTouchId(){
  //    TouchID.authenticate(reason)
  //    .then(success => {
  //          // Success code
  //          console.log('in verify touchId');
  //          this.newDoInitialize();
  //          })
  //    .catch(error => {
  //           console.log(error)
  //           var er = error.name;
  //           
  //           if(er === LAErrorUserFallback){
  //           console.log("user clicked password");
  //                      fallbackAuth();
  //           }else{
  //           AlertIOS.alert(error.message);
  //           }
  //           });
  //    
  //  }
  //  
  //  fallbackAuth() {
  //    alert("infallback");
  //    console.log('in verify touchId fallback');
  //    this.newDoInitialize();
  //  }


  newDoInitialize() {
    initSuc = false;
    isRunAfterInteractions = false;
    initCount = 0;
    console.log('------------Initialize RDNA');
    var proxySettings; //= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
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
      // if(Number.isInteger(currentGatewayPort)){
      //   currentGatewayPort = Math.abs(currentGatewayPort);
      // }else{
      //   alert("Invalid gateway port");
      //   return;
      // }

      ReactRdna.initialize(currentAgentInfo, currentGatewayHost, currentGatewayPort, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, jsonProxySettings, (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
          // alert(response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
          // alert(response[0].error);
        }
      })
    });
  }


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
              onPress: () => this.props.navigator.push({
                id: "ConnectionProfile"
              })
            },
          ]
        )
      }
    }
  }

  doNavigation() {
    console.log('doNavigation:');
    AsyncStorage.getItem('skipwelcome').then((value) => {
      if (value === "true") {
        this.props.navigator.push({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
      } else {
        this.props.navigator.push({
          id: "Screen_0_1_welcome",
          //id: "Screen_0_2_selectlogin",
          title: "nextChlngName",
          url: {
            "chlngJson": chlngJson,
            "screenId": nextChlngName
          }
        });
      }

    }).done();




  }

  render() {
    console.log('************ Load Render');
    console.log(this.props.navigator.state);
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#000' />
        <Image
          source={require('../img/ic_welcome.png') }
          style={styles.bg} />
      </View>
    );
  }
}
var styles = StyleSheet.create({
  bg: {
    height: Skin.SCREEN_HEIGHT,
    width: Skin.SCREEN_WIDTH,
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

