
/*
 ALWAYS NEED
 */
'use strict';

var ReactNative = require('react-native');
var React = require('react');
import Skin from '../../Skin';
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var constant = require('../Constants');
import Config from 'react-native-config';

/*
 CALLED
 */
import Events from 'react-native-simple-events';
import Main from '../Main';
import Web from '../../Scenes/Web';

import MenuItem from '../view/menuitem';

var styles = Skin.loadStyle;

//var Menu = require('./Menu');
//var Web = require('./Web');
var {DeviceEventEmitter} = require('react-native');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
let chlngJson;
let nextChlngName;
var eventLogOff;
let onGetNotifications;
let eventGetPostLoginChallenges;
let challengeName;
let onGetAllChallengeEvent;
/*
 INSTANCES
 */
var {
  View,
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  Alert,
  ScrollView,
  Platform,
  IntentAndroid,
  InteractionManager,
} = ReactNative;

const {
  Component
} = React;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

var styles = Skin.controlStyle;
var Obj;
var securePortalUrl;

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    console.log(props);

    this.getPostLoginChallenges = this.getPostLoginChallenges.bind(this);
    this.logOff = this.logOff.bind(this);
    this.onLogOff = this.onLogOff.bind(this);
    this.showLogOffAlert = this.showLogOffAlert.bind(this);
    this.doNavigation = this.doNavigation.bind(this);
    //this.getMyNotifications();

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

  componentDidMount() {
    this.getAllChallenges();
    constant.USER_SESSION = "YES";
    AsyncStorage.setItem("isPwdSet", "empty");
    Obj = this;
    Events.on('cancelOperation', 'cancelOperation', this.cancelOperation);

    if (onGetNotifications) {
      onGetNotifications.remove();
    }
    onGetNotifications = DeviceEventEmitter.addListener(
      'onGetNotifications',
      this.onGetNotificationsDetails.bind(this)
    );
  }

  logOff() {
    if (eventLogOff) {
      eventLogOff.remove();
    }
    eventLogOff = DeviceEventEmitter.addListener('onLogOff', this.onLogOff);
    ReactRdna.logOff(Main.dnaUserName, (response) => {
      if (response) {
        console.log('immediate response is' + response[0].error);
      } else {
        console.log('immediate response is' + response[0].error);
      }
    });
  }

  onLogOff(e) {
    if (eventLogOff) {
      eventLogOff.remove();
    }

    console.log('immediate response is' + e.response);
    var responseJson = JSON.parse(e.response);
    if (responseJson.errCode == 0) {
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

  componentWillUnmount() {
    Events.rm('cancelOperation', 'cancelOperation');
  }

  cancelOperation(args) {
    Obj.props.toggleDrawer();
    var allScreens = Obj.props.navigator.getCurrentRoutes(0);
    for (var i = 0; i < allScreens.length; i++) {
      var screen = allScreens[i];
      if (screen.id == 'Main') {
        var mySelectedRoute = Obj.props.navigator.getCurrentRoutes()[i];
        Obj.props.navigator.popToRoute(mySelectedRoute);
        break;
      }
    }
  }

  onGetPostLoginChallenges(status) {
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

  onGetNotificationsDetails(e) {
    console.log('----- onGetNotificationsDetails');
    // NotificationObtianedResponse = e;
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        if (res.pArgs.response.ResponseData.notifications.length > 0) {
          var allScreens = this.props.navigator.getCurrentRoutes(0);

          for (var i = 0; i < allScreens.length; i++) {
            var screen = allScreens[i];
            if (screen.id == 'NotificationMgmt') {
              var mySelectedRoute = this.props.navigator.getCurrentRoutes()[i];
              mySelectedRoute.url = { "data": e };
              Events.trigger('showNotification', e);
              this.props.navigator.popToRoute(mySelectedRoute);
              return;
            }
          }
          InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: { "data": e } });
          });
        } else if (this.isNotificationScreenPresent() == 1) {
          Events.trigger('showNotification', e);
          Alert.alert(
            '',
            'You have no Pending notifications',
            [
              { text: 'OK', onPress: () => this.props.navigator.pop(0) }
            ]
          )

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
  }


  isNotificationScreenPresent() {
    var allScreens = this.props.navigator.getCurrentRoutes(0);
    var status = 0;
    for (var i = 0; i < allScreens.length; i++) {
      var screen = allScreens[i];
      if (screen.id == 'NotificationMgmt') {
        status = 1;
        return status;
      }
    }
    return status;
  }

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

        if (response[0].error !== 0) {
          console.log('----- ----- response is not 0');
          //                               if (NotificationObtianedResponse !== undefined) {
          //                               // If error occurred reload last response
          //
          //                                                              }
        }

      });
    } else {

      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => this.props.navigator.pop(0) }
        ]
      );
    }
  }

  getPostLoginChallenges(useCaseName, challengeToBeUpdated) {
    if (eventGetPostLoginChallenges) {
      eventGetPostLoginChallenges.remove();
    }

    eventGetPostLoginChallenges = DeviceEventEmitter.addListener(
      'onGetPostLoginChallenges',
      this.onGetPostLoginChallenges.bind(this)
    );
    challengeName = challengeToBeUpdated;
    console.log("onGetPostLoginChallenges ----- show loader");
    Events.trigger('showLoader', true);
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
    if (onGetAllChallengeEvent) {
      onGetAllChallengeEvent.remove();
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

      if (onGetAllChallengeEvent) {
        onGetAllChallengeEvent.remove();
      }

      onGetAllChallengeEvent = DeviceEventEmitter.addListener(
        'onGetAllChallengeStatus',
        this.onGetAllChallengeStatus.bind(this)
      );

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
    console.log('doNavigation:');
    //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 0));
    AsyncStorage.getItem('skipwelcome').then((value) => {
      if (value != null && value != undefined && value === "true") {
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

  popToLoadView() {
    this.props.navigator.replace({
      id: 'Load'
    });

  }

  renderIf(condition, jsx) {
    if (condition) {
      return jsx;
    }
  }

  getAllChallenges() {
    Events.trigger('showLoader', true);
    if (onGetAllChallengeEvent) {
      onGetAllChallengeEvent.remove();
    }
    onGetAllChallengeEvent = DeviceEventEmitter.addListener(
      'onGetAllChallengeStatus',
      this.onGetAllChallengeSettingStatus.bind(this)
    );

    ReactRdna.getAllChallenges(Main.dnaUserName, (response) => {
      if (response) {
        console.log('getAllChallenges immediate response is' + response[0].error);
      } else {
        console.log('s immediate response is' + response[0].error);
      }
    });
  }

  onGetAllChallengeSettingStatus(e) {
    if (onGetAllChallengeEvent) {
      onGetAllChallengeEvent.remove();
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
              this.props.navigator.push({ id: 'ComingSoon', title: 'Alerts', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.PROFILE_SETTINGS}
            lable="Profile & Settings"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'RegisterOptionScene', title: 'Profile & Settings', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.DEV_MANAGMENT}
            lable="Device Management"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'DeviceMgmt', title: 'Self Device Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.NOTIFICATIONS}
            lable="Notifications"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'NotificationMgmt', title: 'Notification Managment', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />

          {
            Main.enableUpdateSecqaOption &&
            [
              <MenuItem
                visibility={Config.CHANGEQUESTION}
                lable="Change Secret Question"
                onPress={() => { this.props.toggleDrawer(); this.getChallengesByName('secqa'); } }
                />
            ]
          }
          <MenuItem
            visibility={Config.CHANGEPASSWORD}
            lable="Change Password"
            onPress={() => { this.props.toggleDrawer(); this.getChallengesByName('pass'); } }
            />

          <MenuItem
            visibility={Config.HELP_SUPPORT}
            lable="Help & Support"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'ComingSoon', title: 'Help & Support', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.SECURE_PORTAL}
            lable="Secure Portal"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'SecureWebView', title: 'Secure Portal', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: 'http://54.179.148.241/demoapp/relid.html' });
            } }
            />
          <MenuItem
            visibility={Config.OPEN_PORTAL}
            lable="Open Portal"
            onPress={() => {
              this.props.toggleDrawer();
              var openSiteURL = 'https://www.google.co.in/'
              if (Platform.OS === 'android') {
                IntentAndroid.canOpenURL(openSiteURL, (supported) => {
                  if (!supported) {
                    console.log('Can\'t handle url: ' + openSiteURL);
                  } else {
                    IntentAndroid.openURL(openSiteURL);
                  }
                });
              }
              else {
                this.props.navigator.push({ id: 'WebView', title: 'Open Portal', sceneConfig: Navigator.SceneConfigs.PushFromRight, url: 'https://www.google.co.in/' });
              }
            }
            }
            />
          <MenuItem
            visibility={Config.SEND_APP_FEEDBACK}
            lable="Send App Feedback"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'ComingSoon', title: 'Send App Feedback', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.LEGAL_INFO}
            lable="Legal Info"
            onPress={() => {
              this.props.toggleDrawer();
              this.props.navigator.push({ id: 'ComingSoon', title: 'Legal Info', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
            } }
            />
          <MenuItem
            visibility={Config.LOGOUT}
            lable="Logout"
            onPress={this.showLogOffAlert.bind(this) }
            />
        </ScrollView>

      </View>
    )
  }
};

module.exports = ControlPanel
