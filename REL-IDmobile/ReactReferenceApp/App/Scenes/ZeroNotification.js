/*
 * it shows Notifications
 */
'use strict';
/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import Config from 'react-native-config';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import moment from 'moment';
import { StyleSheet, Text, ListView, TextInput, AsyncStorage, DeviceEventEmitter, TouchableHighlight, View, WebView, Alert, Platform, AlertIOS, RefreshControl, BackHandler } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Modal from 'react-native-simple-modal';
import TouchID from 'react-native-touch-id';
import Util from "../Components/Utils/Util";
import PageTitle from '../Components/view/pagetitle';
import AndroidAuth from "../Components/view/AndroidTouch"
import NotificationCard from '../Components/view/notificationcard';
import { NavigationActions} from 'react-navigation';
const Spinner = require('react-native-spinkit');


/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
import Constants from '../Components/Utils/Constants';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onUpdateNotificationModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

/*
 INSTANCES
 */
const SCREEN_WIDTH = require('Dimensions').get('window').width;
let onGetNotifications;
let onUpdateNotification;
let notificationList;
let notificationHolderList;
let notificationResponse;
let NotificationObtianedResponse;
let obj;
var notification = [];
let onUpdateNotificationSubscription;
let isAdditionalAuthSupported = { pass: false, erpass: false, erPattern: false };
let isPageTitle = JSON.parse(Config.ENABLEPAGETITLE);

/*
 *Sort notification row based on timestamp.
 */
function compare(a, b) {
  // if (a.created_timestamp < b.created_timestamp)
  //   return 1;
  // if (a.created_timestamp > b.created_timestamp)
  //   return -1;
  // if (a.created_timestamp == b.created_timestamp)
  //   return 0;

//  return moment.utc(b.created_ts.replace('EDT','')).add(4, 'hours').local().toDate() - moment.utc(a.created_ts.replace('EDT','')).add(4, 'hours').local().toDate()
   return moment.utc(b.created_ts.replace('UTC','')).local().toDate() - moment.utc(a.created_ts.replace('UTC','')).local().toDate()
}

/*
 *Custome Notification row.
 */
var SampleRow = React.createClass({
  showalertforReject(notification, btnLabel) {
    Alert.alert(
      'Fraud Warning',
      'You\'ve rejected this transaction, would you like to flag it as fraud?',
      [
        {
          text: 'It\'s Fraud',
          onPress: () => {
            this.showalert(notification, btnLabel)
          }
        },
        {
          text: 'No',
          onPress: () => {
            this.showalert(notification, this.props.notification.action[1].label)
          }
        },
      ]
    )
  },

  showalert(notification, btnLabel) {
    obj.setState({
      showLoaderPageTitle: true
    });
    for (var i = 0; i < notification.action.length; i++) {
      var data = notification.action[i];
      if (data.label == btnLabel) {
        obj.setState({
          selectedNotificationId: notification.notification_uuid,
          selectedAction: data.action,
        }, () => {
          if (data.authlevel !== null && data.authlevel !== undefined) {
            if (data.authlevel == "1") {
              this.showModelForPassword();
            } else if (data.authlevel == "2") {
              if (Platform.OS === 'android') {
                if( isAdditionalAuthSupported.erpass )
                  this.showModelForTouchId();
                else if( isAdditionalAuthSupported.erPattern )
                  this.showComponentForPattern();              
              } else {
                this.showModelForTouchId();
              }
            } else {
              obj.updateNotificationDetails();
            }
          } else {
            obj.updateNotificationDetails();
          }
        });
        break;
      }
    }
  },

  showModelForPassword() {
    if (isAdditionalAuthSupported.pass === true) {
      obj.setState({
        showPasswordModel: true,
      });
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. User not logged in using password.');
    }
  },

  showModelForTouchId() {
    if (isAdditionalAuthSupported.erpass === true) {
      obj.authenticateWithTouchIDIfSupported();
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. TouchID is not enabled or supported.');
    }
  },

  showComponentForPattern() {
    if (isAdditionalAuthSupported.erpass === true) {
      obj.authenticateWithPattern();
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. Pattern is not enabled.');
    }
  },

  //Additional authentication not supported.
  showAlertAuthNotSuppoted(msg) {
    Alert.alert(
      '',
      msg,
      [
        {
          text: 'OK',
          onPress: () => {
//            obj.setState({ selectedAction: 'AUTH_UNSUPPORTED' });
        obj.setState({ selectedAction: 'AUTH_UNSUPPORTED',showTouchOrPattern:false });
            obj.updateNotificationDetails();
          }
        }
      ]
    );

  },



  render() {
    var body = this.props.notification.message.body;
    var bodyarray = body.split("\n");
    var amount = bodyarray[3];
    var font = 22;

    if (typeof amount == "undefined") {
      amount = '';
    } else {
      if (amount.length > 0 && amount.length <= 5) {

      } else if (amount.length > 5 && amount.length <= 6) {
        if (SCREEN_WIDTH <= 320) {
          font = 17;
        } else {
          font = 19;
        }
      } else if (amount.length >= 7 && amount.length <= 8) {
        if (SCREEN_WIDTH <= 320) {
          font = 14;
        } else {
          font = 17;
        }
      } else if (amount.length >= 8 && amount.length <= 10) {
        if (SCREEN_WIDTH <= 320) {
          font = 11;
        } else {
          font = 13;
        }
      } else {
        if (SCREEN_WIDTH <= 320) {
          font = 9;
        } else {
          font = 11;
        }
      }
    }


    var expiry_timestamp = this.props.notification.expiry_timestamp;
    var created_timestamp = this.props.notification.created_ts;
   // var timestamp = expiry_timestamp.split("EDT");
  var timestamp = expiry_timestamp.split("UTC");

    var finaltimestamp = timestamp[0].split("T");
    var date = finaltimestamp[0].split("-");
    var time = finaltimestamp[1].split(":");

    var year = date[0].substring(2, 4);

    var dateFormat = require('dateformat');//www.npmjs.com/package/dateformat
    var validdate = new Date();
    validdate.setFullYear(parseInt(date[0]));
    validdate.setMonth(parseInt(date[1]) - 1);  // months indexed as 0-11, substract 1
    validdate.setDate(parseInt(date[2]));
    validdate.setHours(parseInt(time[0]));
    validdate.setMinutes(parseInt(time[1]));
    validdate.setSeconds(parseInt(time[2]));


    if (this.props.notification.action.length == 3) {

      return (
        <View style={Skin.notification.customerow}>
          <View style={Skin.notification.col}>
            <View style={Skin.notification.row}>
              <Text style={Skin.notification.subject}>
                {this.props.notification.message.subject}
              </Text>
              <Text style={Skin.notification.time}>
                {date[1]}/{date[2]}/{year}
              </Text>
            </View>

            <View style={[Skin.notification.col, { marginTop: 4 }]}>

              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body}>
                  {bodyarray[0]}
                </Text>
              </View>
              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body}>
                  {bodyarray[1]}
                </Text>
              </View>
              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body}>
                  {bodyarray[2]}
                </Text>
              </View>
              <View style={Skin.notification.row}>
                <Text style={Skin.notification.bold}>
                  {amount}
                </Text>
              </View>
            </View>
            <View style={[Skin.notification.row, { marginTop: 8 }]}>

              <View style={Skin.notification.notificationButton}>

                <TouchableHighlight style={Skin.notification.confirmbutton}
                  onPress={() => this.showalert(this.props.notification, this.props.notification.action[0].label)}
                >
                  <View style={Skin.notification.text} >
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[0].label}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight style={Skin.notification.denybutton} onPress={() => this.showalert(this.props.notification, this.props.notification.action[1].label)}>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[1].label}
                    </Text>
                  </View> 
                </TouchableHighlight>

                <TouchableHighlight style={Skin.notification.fraudbutton} onPress={() => this.showalertforReject(this.props.notification, this.props.notification.action[2].label)}>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[2].label}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={Skin.notification.customerow}>

          <View style={Skin.notification.col}>
            <View style={Skin.notification.row}>
              <Text style={Skin.notification.subject}>
                {this.props.notification.message.subject}
              </Text>
              <Text style={Skin.notification.time}>
                {date[1]}/{date[2]}/{year}
              </Text>
            </View>

            <View style={[Skin.notification.col, { marginTop: 4 }]}>

              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body2}>
                  {bodyarray[0]}
                </Text>
              </View>
              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body2}>
                  {bodyarray[1]}
                </Text>
              </View>
              <View style={Skin.notification.row}>
                <Text style={Skin.notification.dot}>{"\u2022"}</Text>
                <Text style={Skin.notification.body2}>
                  {bodyarray[2]}
                </Text>
              </View>
            </View>

            <View style={[Skin.notification.row, { marginTop: 8 }]}>

              <View style={Skin.notification.notificationButton}>

                <TouchableHighlight style={Skin.notification.approvebutton} onPress={() => this.showalert(this.props.notification, this.props.notification.action[0].label)}>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[0].label}
                    </Text>
                  </View>
                </TouchableHighlight>


                <TouchableHighlight style={Skin.notification.rejectbutton} onPress={() => this.showalertforReject(this.props.notification, this.props.notification.action[1].label)}>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[1].label}
                    </Text>
                  </View> 
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
});


export default class NotificationMgmtScene extends Component {
  constructor(props) {
    super(props);
    obj = this;
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    notification = [];

    this.updateNotificationDetails = this.updateNotificationDetails.bind(this);
    this.getMyNotifications = this.getMyNotifications.bind(this);
    this.onGetNotificationsDetails = this.onGetNotificationsDetails.bind(this);
    this.showAlertModal = this.showAlertModal.bind(this);
    this.onAlertModalDismissed = this.onAlertModalDismissed.bind(this);
    this.onAlertModalOk = this.onAlertModalOk.bind(this);
    this.dismissAlertModal = this.dismissAlertModal.bind(this);
    this.onPatternUnlock = this.onPatternUnlock.bind(this);
    this.authenticateWithPattern = this.authenticateWithPattern.bind(this);
    this.authenticateWithTouchIDIfSupported = this.authenticateWithTouchIDIfSupported.bind(this);
    this.isAndroidTouchAvailable = this.isAndroidTouchAvailable.bind(this);
    this.androidAuth = this.androidAuth.bind(this);
    this.authenticateTouchID = this.authenticateTouchID.bind(this);
    this.onTouchIDAuthenticationDone = this.onTouchIDAuthenticationDone.bind(this);
    this.onNotificationAction = this.onNotificationAction.bind(this);
    this.onPatternClose = this.onPatternClose.bind(this);


    var data = this.renderListViewData(notification.sort(compare));
    this.state = {
      dataSource: ds.cloneWithRows(data),
      dataSourceSwap: null,
      alertMsg: "",
      showAlert: false,
      inputPassword: '',
      refreshUI: false,
      showPasswordModel: false,
      selectedNotificationId: '',
      showTouchOrPattern:false,
      showingOtherAlerts:false,
      showAndroidAuth : false,
      selectedAction: '',
      showLoader: false,
      refreshing: false,
      selectedlanguage: ""
    };
    this.selectedAlertOp = true;
  }

  checkPassword() {
    //Todo : cleanup
    // AsyncStorage.getItem(Main.dnaUserName).then((value) => {
    //   try {
    //     value = JSON.parse(value);
    //     const pw = this.state.inputPassword;
    //     if (pw === value.RPasswd) {
    //       //Call update notification
    //       obj.state.inputPassword='',
    //       this.updateNotificationDetails();
    //     } else {
    //       obj.state.inputPassword='',
    //       alert('Entered password does not match');
    //     }
    //   } catch (e) { }
    // }).done();

    Util.getUserDataSecure("RPasswd").then((decryptedRPasswd) => {
      const pw = this.state.inputPassword;
      if (pw === decryptedRPasswd) {
        //Call update notification
        obj.state.inputPassword = '',
          this.updateNotificationDetails();
      } else {
        obj.state.inputPassword = '',
          alert('Entered password does not match');
      }
    }).done();

    this.setState({ showPasswordModel: false });
  }

  onPasswordChange(event) {
    var newstate = this.state;
    newstate.inputPassword = event.nativeEvent.text;
    this.setState(newstate);
  }

  //navigate to pattern screen
  authenticateWithPattern() {
    // this.props.navigator.push({
    //   id: 'pattern',
    //   onUnlock: this.onPatternUnlock,
    //   onClose: null,
    //   operationMsg: 'Enter pattern',
    //   mode: 'verify'
    // });
    this.props.navigation.navigate('pattern',{url: {
      id: 'pattern',
      onUnlock: this.onPatternUnlock,
      onClose: null,
      operationMsg: 'Enter pattern',
      mode: 'verify'
      }})
  }
  
  onPatternClose(){
//    this.props.navigator.pop();
    nav.goBack();
    this.state.showTouchOrPattern = false;
  }


  //patten login callback.
  onPatternUnlock(nav, args) {
    this.state.showTouchOrPattern = false;
    nav.goBack();
    setTimeout(()=>{
      this.updateNotificationDetails();
      },100);

    
    //this.goBack();
  }

  isAndroidTouchAvailable() {
    Util.isAndroidTouchSensorAvailable()
      .then((success) => {   
        this.androidAuth();    
      })
      .catch((error) => {
        console.log('Handle rejected promise (' + error + ') here.');
      });
  }

  androidAuth() {    
    this.setState({ showAndroidAuth : true });
    Util.androidTouchAuth()
      .then((success) => {   
        this.setState({ showAndroidAuth : false });
        this.state.showTouchOrPattern =false;
        this.onTouchIDAuthenticationDone();
      })
      .catch((error) => {
        this.setState({ showAndroidAuth : false });
        this.state.showTouchOrPattern =false;
        console.log('Handle rejected android auth promise (' + error + ') here.');
      });
  }

  authenticateWithTouchIDIfSupported() {
    console.log(TouchID);
    if (Platform.OS === 'ios') {
    TouchID.isSupported()
      .then(this.authenticateTouchID)
      .catch(error => {
        Alert.alert(
          '',
          'Failed to get additional authentication. TouchID is not enabled or supported.',
          [
            {
              text: 'OK',
              onPress: () => {
                obj.setState({ selectedAction: 'AUTH_UNSUPPORTED' });
                this.updateNotificationDetails();
              }
            }
          ]
        );
      });
    }else {
      this.isAndroidTouchAvailable();
    }
  }

  authenticateTouchID() {
    return TouchID.authenticate("Authenticate with Touch ID")
      .then(success => {
        this.state.showTouchOrPattern =false;
        this.onTouchIDAuthenticationDone();
      })
      .catch(error => {
        console.log(error)
        this.state.showTouchOrPattern =false;
        AlertIOS.alert(error.message);
      });
  }

  onTouchIDAuthenticationDone() {
    Util.getUserDataSecure("ERPasswd").then((encryptedRPasswd) => {
      if (encryptedRPasswd) {
        Util.decryptText(encryptedRPasswd).then((RPasswd) => {
          if (RPasswd) {
            this.updateNotificationDetails();
          }
        }).done();
      }
    }).done();
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    obj.getMyNotifications();
  }


  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    obj = this;
    Events.on('showNotification', 'showNotification', this.showNotification);
    Events.on('updateSetting', 'updateSetting', this.updateSetting);
    Events.on('onNotificationAction', 'onNotificationAction', this.onNotificationAction);
    if (this.props.url != null) {
      NotificationObtianedResponse = this.props.url.data;
      this.onGetNotificationsDetails(NotificationObtianedResponse);
    }

    if (onUpdateNotificationSubscription) {
      onUpdateNotificationSubscription.remove();
      onUpdateNotificationSubscription = null;
    }
    onUpdateNotificationSubscription = onUpdateNotificationModuleEvt.addListener('onUpdateNotification',
      obj.onUpdateNotification.bind(obj));

    //Checks if RPasswd and ERPasswd exists and updates the isAdditionalAuthSupported flag.
    this.checkAdditionalAuthSupported();

  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component will Unmount.
   */
  componentWillUnmount() {
    Events.rm('showNotification', 'showNotification');
    Events.rm('updateSetting', 'updateSetting');
    Events.rm('onNotificationAction', 'onNotificationAction');
    if (onUpdateNotificationSubscription) {
      onUpdateNotificationSubscription.remove();
      onUpdateNotificationSubscription = null;
    }
  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      if( this.state.showAndroidAuth )
        this.setState({ showAndroidAuth : false });
      return true;
    }.bind(this));
    global.isNotificationScreenonTop = true;
    if (this.props.url == null) {
      this.getMyNotifications();
    }
  }
  /**
   *  show Notifications
   */
  showNotification(args) {
    obj.onGetNotificationsDetails(args);
  }

  /*
   method to check is their any notification.
   */
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
          this.setState({ refreshing: false });
          console.log('----- ----- response is not 0');
          if (NotificationObtianedResponse !== null && NotificationObtianedResponse !== undefined) {
            // If error occurred reload last response
            this.onGetNotificationsDetails(NotificationObtianedResponse);
          }

        }
      });
    } else {
      this.setState({ refreshing: false });
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => this.goBack() }
        ]
      );
    }
  }
  //Send notification response
  updateNotificationDetails() {
    console.log('----- NotificationMgmt.updateNotificationDetails');
    if (Main.isConnected) {
      if(this.state.showLoader===false)
      this.setState({ showLoader: true });

      ReactRdna.updateNotification(this.state.selectedNotificationId, this.state.selectedAction, (response) => {
        console.log('ReactRdna.updateNotificationDetails.response:');
        console.log(response);

        if (response[0].error !== 0) {
          console.log('----- ----- response is not 0');

          this.setState({ showLoader: false });
          Util.getErrorInfo(response[0].error, (error) => {

            if (error == 59) {
              /*
                59 -->>   RDNA_ERR_NOTF_SIGN_INTERNAL_FAILURE - Failure occurred when signing notification
              */
              setTimeout(() => {
                Alert.alert(
                  '',
                  'Error signing notification. Please wait application is uploading new certificate...', [{
                    text: 'OK',
                    onPress: () => {
                      //this.navigateToRegistration();
                    },
                    style: 'cancel',
                  }],
                  { cancelable: false }
                );
              }, 100);

            }
          });

          if (NotificationObtianedResponse !== null && NotificationObtianedResponse !== undefined) {

            console.log('----- ----- response is not 0');
            // If error occurred reload last response
            this.onGetNotificationsDetails(NotificationObtianedResponse);
          }
        }
      });
    }
    else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK' }
        ]
      );
    }
  }

  //callback of getNotifications.
  onGetNotificationsDetails(e) {
    if (this.state.refreshing)
      this.setState({ refreshing: false });

    console.log('----- onGetNotificationsDetails');
    NotificationObtianedResponse = e;
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      notificationList = res.pArgs.response.ResponseData;
      //      notificationHolderList = this.renderListViewData(notificationList.notifications);
      //      this.setState({
      //        dataSource: this.state.dataSource.cloneWithRows(notificationHolderList),
      //      });
      //      this.setState({deviceCount: notificationList.notifications.length });
      var noti = notificationList.notifications;

      if (noti.length > 0) {
        if (this.state.showAlert === true) {
          this.dismissAlertModal();
        }
      } else {
        // this.showAlertModal("You have no pending notifications");
      }
      notification = noti;
      //this.setState({ notification: noti }); 

      //logic for tapped notifiaction show first on screen
      notification = notification.sort(compare);
      if (Main.notificationId) {

        this.state.dataSource = this.state.dataSource.cloneWithRows(this.renderListViewData(notification));
        var arrayLength = notification.length;
        var isSelected = false;
        for (var i = 0; i < arrayLength; i++) {
          var tappedNotification = notification[i];
          if (tappedNotification.notification_uuid === Main.notificationId) {
            this.swapDataSource(tappedNotification);
            isSelected = true;
            break;
          }
        }
        Main.notificationId = null;
        if (!isSelected) {
          this.showNotificationWithinMinutes();
        }
      } else {
        this.showNotificationWithinMinutes();
      }
    } else {
      console.log('Something went wrong');
    }
  }

  showNotificationWithinMinutes() {
    if(this.state.showPasswordModel == false && this.state.showTouchOrPattern == false && this.state.showingOtherAlerts == false){

    var notifiactionObj = this.sortNotificationWithinMinutes(2, notification);
    if (notifiactionObj) {
      this.state.dataSource = this.state.dataSource.cloneWithRows(this.renderListViewData(notification));
      this.swapDataSource(notifiactionObj);
    } else {

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.renderListViewData(notification)),
      });
    }
    }else{
      this.state.dataSourceSwap = this.state.dataSource.cloneWithRows(this.renderListViewData(notification));
    }

  }

  onUpdateNotification(e) {
    this.setState({ showLoader: false });
    const res = JSON.parse(e.response);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        //this.props.navigator.pop();
        for (var i = 0; i < notification.length; i++) {
          var noti = notification[i];
          if (noti.notification_uuid === res.pArgs.response.ResponseData.notification_uuid) {
            notification.splice(i, 1);
            break;
          }
        }

        if (notification.length <= 0) {
//          this.props.navigator.pop(0);
          this.goBack();
        }
       this.showNotificationWithinMinutes();
      


      } else {

        setTimeout(() => {
          Alert.alert(
            'Alert',
            res.pArgs.response.StatusMsg,
            [
              { text: 'OK', onPress: () => this.getMyNotifications() }
              ],
            { cancelable: false }

          )
        }, 120);

        // If error occurred reload devices list with previous response

      }

    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }
    Events.trigger('updateBadge', notification.length);
    this.setState({ refreshUI: !this.state.refreshUI });
  }

  /*
    //Checks if RPasswd and ERPasswd exists and updates the isAdditionalAuthSupported flag.
  */

  checkAdditionalAuthSupported() {
    AsyncStorage.getItem(Main.dnaUserName).then((value) => {
      if (value != null && value != undefined) {
        try {
          value = JSON.parse(value);
          if (value.RPasswd) {
            isAdditionalAuthSupported.pass = true;
          } else {
            isAdditionalAuthSupported.pass = false;
          }

          if (value.ERPasswd && value.ERPasswd !== "empty") {
            isAdditionalAuthSupported.erpass = true;
          } else {
            isAdditionalAuthSupported.erpass = false;
          }

          if( value.ERPattern && value.ERPattern !== "empty" )
            isAdditionalAuthSupported.erPattern = true;
          else
            isAdditionalAuthSupported.erPattern = false;
        } catch (e) { 
          isAdditionalAuthSupported.erpass = false; 
          isAdditionalAuthSupported.pass = false; 
          isAdditionalAuthSupported.erPattern = false;}
      } else {
        isAdditionalAuthSupported.erpass = false;
        isAdditionalAuthSupported.pass = false;
        isAdditionalAuthSupported.erPattern = false;
      }
    });
  }

  /*
      This method call when Profile and Setting changed
   */
  updateSetting(e) {
    obj.checkAdditionalAuthSupported();
  }

  showAlertModal(msg) {
    this.setState({
      showAlert: true,
      alertMsg: msg
    });
  }

  dismissAlertModal() {
    this.selectedAlertOp = false;
    this.setState({
      showAlert: false
    });
  }

  onAlertModalOk() {
//    this.props.navigator.pop();
    this.goBack();
  }

  onAlertModalDismissed() {
    //Do nothing for right now
  }

  _renderMessage() {
    return (
      <View style={styles.listEmptyView}>
        <Text style={styles.listEmptyMessage}
          numberOfLines={2}>You have no {'\n'} pending notifications</Text>
      </View>
    )
  }

  goBack(){
    this.props.navigation.goBack();
    Events.trigger('getNoticiationHistory'); 
    global.isNotificationScreenonTop = false;

  }
  
  
  /*
    render pagetitle
  */
  renderPageTitle(pageTitle) {
    return (<PageTitle title={pageTitle}
      handler={this.goBack.bind(this)} isBadge={true} />);
  }


  sortNotificationWithinMinutes(minute,notifiactionArray){
    var millis = minute*60000;
    var currMill = Date.now();
    var millis2minsBefore = currMill - millis;
   if( notifiactionArray.length > 0){
       var notification = notifiactionArray[0];

       var date1 = new Date(millis2minsBefore);
     var testDateUtc = moment.utc(notification.created_ts.replace('UTC',''));
//       var testDateUtc = moment.utc(notification.created_ts.replace('EDT','')).add(4, 'hours');
       var localDate = moment(testDateUtc).local();
       var s = localDate.format("YYYY-MM-DDTHH:mm:ssZ");
       var newDateObj = new Date(s);
       var currNotificationTime = newDateObj.getTime()
       if(currNotificationTime>millis2minsBefore){
          return notification;
       }
   }
   return null;
  }

  renderListViewData(s) {
    const data = [];
    let index = -1;
    s.map((notification) => {
      index++;
      data.push({
        notification
      });
      return null;
    });
    return data;
  }

  renderRow(rowData) {
    return <SampleRow
      {...rowData}
      style={Skin.appointmentrow.row} />
  }

  renderNotificationCard(notificationData) {
    return <NotificationCard {...notificationData} style={Skin.appointmentrow.row} isAdditionalAuthSupported={isAdditionalAuthSupported} expand={this.view.expand} showButtons={this.view.showButtons} showHideButton={this.view.showHideButton} selectedlanguage={this.view.selectedlanguage}/>
  }

  onNotificationAction(bundle) {
    const { notification, btnLabel, action, selectedlanguage } = bundle;
    switch (action) {
      case "accept":
        this.showalert(notification, btnLabel);
        break;
      case "reject":
        this.showalert(notification, btnLabel);
        break;
      case "fraud":
        this.showalertforReject(notification, btnLabel);
        break;
      case "click":
        this.state.selectedlanguage = selectedlanguage;
        this.swapDataSource(notification);
        break;
      case "hide":
        this.restoreDataStore();
        break;
    }
  }
  
  swapDataSource(data) {
    var dataSource = this.state.dataSource;
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state.dataSource = ds.cloneWithRows([{ notification: data }]);
    this.setState({ dataSourceSwap: dataSource });
  }

  restoreDataStore() {
    var dataSourceSwap = this.state.dataSourceSwap;
    this.state.dataSourceSwap = null;
    this.setState({ dataSource: dataSourceSwap });
  }

  showalertforReject(notification, btnLabel) {
    this.state.showingOtherAlerts = true;
    Alert.alert(
      'Fraud Warning',
      'You\'ve rejected this transaction, would you like to flag it as fraud?',
      [
        {
          text: 'It\'s Fraud',
          onPress: () => {
            this.state.showingOtherAlerts = false;
            this.showalert(notification, btnLabel)
          }
        },
        {
          text: 'No',
          onPress: () => {
            this.state.showingOtherAlerts = false;
            this.showalert(notification, notification.action[1].label)
          }
        },
        ],
      {cancelable:false}
    )
  }

  showalert(notification, btnLabel) {
    for (var i = 0; i < notification.action.length; i++) {
      var data = notification.action[i];
      if (data.label == btnLabel) {
        this.setState({
          selectedNotificationId: notification.notification_uuid,
          selectedAction: data.action,
        }, () => {
          if (data.authlevel !== null && data.authlevel !== undefined) {
            if (data.authlevel == "1") {
              this.showModelForPassword();
            } else if (data.authlevel == "2") {
              if (Platform.OS === 'android') {
                if( isAdditionalAuthSupported.erpass )
                  this.showModelForTouchId();
                else 
                  this.showComponentForPattern();              
              } else {
                this.showModelForTouchId();
              }
            } else {
              this.updateNotificationDetails();
            }
          } else {
            this.updateNotificationDetails();
          }
        });
        break;
      }
    }
  }

  showModelForPassword() {
    if (isAdditionalAuthSupported.pass === true) {
      this.setState({
        showPasswordModel: true,
      });
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. User not logged in using password.');
    }
  }

  showModelForTouchId() {
    this.state.showTouchOrPattern = true;
    if (isAdditionalAuthSupported.erpass === true) {
      this.authenticateWithTouchIDIfSupported();
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. TouchID is not enabled or supported.');
    }
  }

  showComponentForPattern() {
    this.state.showTouchOrPattern = true;
    if (isAdditionalAuthSupported.erPattern === true) {
      this.authenticateWithPattern();
    } else {
      this.showAlertAuthNotSuppoted('Failed to get additional authentication. Pattern is not enabled.');
    }
  }

  //Additional authentication not supported.
  showAlertAuthNotSuppoted(msg) {
    Alert.alert(
      '',
      msg,
      [
        {
          text: 'OK',
          onPress: () => {
            this.setState({ selectedAction: 'AUTH_UNSUPPORTED',showTouchOrPattern:false });
            this.updateNotificationDetails();
          }
        }
      ]
    );
  }

  renderNotificationView(dataSource) {
    if (dataSource.getRowCount() == 1) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderNotificationCard.bind(
            {
              view: {
                selectedlanguage: this.state.selectedlanguage,
                expand: true,
                showButtons: true,
                showHideButton: Main.notificationCount > 1
              }
            })(dataSource.getRowData(0, 0))}
        </View>
      );
    } else {
      return <ListView
        ref="listView"
        automaticallyAdjustContentInsets={false}
        dataSource={dataSource}
        removeClippedSubviews={false}
        renderRow={this.renderNotificationCard.bind(
          {
            view: {
              selectedlanguage: this.state.selectedlanguage,
              expand: false,
              showButtons: false
            }
          })} />
    }
  }

  alertModal() {
    return (<Modal
      style={styles.modalwrap}
      overlayOpacity={0.75}
      offset={100}
      open={this.state.showAlert}
      modalDidOpen={() => console.log('modal did open')}
      modalDidClose={() => {
        if (this.selectedAlertOp) {
          this.selectedAlertOp = false;
          this.onAlertModalOk();
        } else {
          this.selectedAlertOp = false;
          this.onAlertModalDismissed();
        }
      }}>
      <View style={styles.modalTitleWrap}>
        <Text style={styles.modalTitle}>
          Alert
        </Text>
      </View>
      <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>
        {this.state.alertMsg}
      </Text>
      <View style={styles.border}></View>

      <TouchableHighlight
        onPress={() => {
          this.selectedAlertOp = true;
          this.setState({
            showAlert: false
          });
        }}
        underlayColor={Skin.colors.REPPLE_COLOR}
        style={styles.modalButton}>
        <Text style={styles.modalButtonText}>
          OK
        </Text>
      </TouchableHighlight>
    </Modal>);
  }

  checkPassModal() {
    return (<Modal
      style={styles.modalwrap}
      overlayOpacity={0.75}
      offset={100}
      open={this.state.showPasswordModel}
      modalDidOpen={() => console.log('modal did open')}
      modalDidClose={() => this.setState({
        showPasswordModel: false
      })}>
      <View style={styles.modalTitleWrap}>
        <Text style={styles.modalTitle}>
          Please enter your password
        </Text>
      </View>
      <TextInput
        autoCorrect={false}
        ref='inputPassword'
        label={'Enter Password'}
        style={styles.modalInput}
        placeholder={'Enter Password'}
        secureTextEntry={true}
        autoFocus={true}
        value={this.state.inputPassword}
        placeholderTextColor={Skin.colors.HINT_COLOR}
        onSubmitEditing={this.checkPassword.bind(this)}
        onChange={this.onPasswordChange.bind(this)}
        underlineColorAndroid={'transparent'} />
      <View style={styles.border}></View>

      <TouchableHighlight
        onPress={this.checkPassword.bind(this)}
        underlayColor={Skin.colors.REPPLE_COLOR}
        style={styles.modalButton}>
        <Text style={styles.modalButtonText}>
          Submit
        </Text>
      </TouchableHighlight>

    </Modal>);
  }


  loaderView() {
    if(this.state.showLoader === true){
      return(
      <View style={{position:'absolute',zIndex:5,height: Skin.SCREEN_HEIGHT,justifyContent:'center',alignItems:'center', width: Skin.SCREEN_WIDTH,backgroundColor:'transparent'}}> 
        <Spinner style={{zIndex: 5 }} isVisible={true} size={50} type="FadingCircleAlt" color={Skin.main.TITLE_COLOR}/>
      </View>
      );
    }
  }

  renderWithoutMain() {
    const listViewProportion = this.state.dataSource.getRowCount() == 0 ? 0.5 : 1
    return (<View style={{ flex: 1, backgroundColor: Skin.main.BACKGROUND_COLOR }}>

      <View style={{ flex: 1, backgroundColor: Skin.main.BACKGROUND_COLOR }}>

        <ListView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />
          }
          ref="listView"
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          removeClippedSubviews={false}
          renderRow={this.renderRow} />


      </View>
      {listViewProportion != 1 &&
        this._renderMessage()}
      {this.checkPassModal()}
      {this.alertModal()}
      {this.state.showAndroidAuth && <AndroidAuth/>}
    </View>);
  }

  renderWithMain() {

    return (<Main
      drawerState={{
        open: false,
        disabled: true,
      }}
      defaultNav={isPageTitle ? false : true}
      navBar={{
        title: 'My Notifications',
        visible: true,
        tint: Skin.main.NAVBAR_TINT,
        left: {
          text: 'Back',
          icon: '',
          iconStyle: {},
          textStyle: {},
          handler: this.goBack.bind(this),
        },
      }}
      bottomMenu={{ 
        visible: false, 
      }}
      navigator={this.props.navigator}
    >
      {isPageTitle && this.renderPageTitle(Main.notificationCount > 1 ? 'Notifications' : 'Notification')}
      {this.loaderView()}
      <View style={{ flex: 1, backgroundColor: Skin.main.NOTIFICATION_LIST_BACKGROUND }}>
        {this.renderNotificationView(this.state.dataSource) }
        {Main.notificationCount == 0 && this._renderMessage() }
        {Main.notificationCount == 0 &&
          <TouchableHighlight style={{ height: 40, width: Skin.SCREEN_WIDTH, justifyContent: 'center', marginTop: 5, backgroundColor: Skin.color.APPROVE_BUTTON_COLOR }}
            onPress={() => {
              //              this.props.navigator.replace({ id: 'Notification_History', title: 'Notification History', sceneConfig: Navigator.SceneConfigs.PushFromRight, });
              //      this.props.navigation.navigate('Notification_History',{title:'Notification History'},{...this.props.navigation.state.params})


              //      this.props.navigation.dispatch(
              //        {"type":"ReplaceCurrentScreen/RESET","index":0,"actions":[{"type":"Navigation/NAVIGATE","routeName":"Notification_History","params":{"url":"","title":"Notification History"}}]});
              //

              global.isNotificationScreenonTop = false;      
             
              this.props.navigation.dispatch({
                key: 'Notification_History',
                type: 'ReplaceCurrentScreen',
                routeName: 'Notification_History',
              });
              Events.trigger('getNoticiationHistory');
            } }>
            <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
              Notification History
            </Text>
          </TouchableHighlight>
        }
      </View>
      {this.checkPassModal()}
      {this.alertModal()}
      {this.state.showAndroidAuth && <AndroidAuth/>}
    </Main>);
  }

  /*
   This method is used to render the componenet with all its element.
   */
  render() {
    return (
      this.props.disableMain ? this.renderWithoutMain() : this.renderWithMain()
    );
  }
}

//Styles for alert modal
const styles = StyleSheet.create({
  modalwrap: {
    height: 150,
    flexDirection: 'column',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  modalTitleWrap: {
    justifyContent: 'center',
    flex: 1,
  },
  modalTitle: {
    color: Skin.colors.PRIMARY_TEXT,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  modalButton: {
    height: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  modalButtonText: {
    textAlign: 'center',
    color: '#268CFE', 
    fontSize: 16,
  },
  border: {
    height: 1,
    marginTop: 16,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  },

  modalInput: {
    textAlign: 'center',
    color: Skin.colors.PRIMARY_TEXT,
    height: 32,
    padding: 0,
    fontSize: 16,
    backgroundColor: null,
  },
  listEmptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'grey',
    fontSize: 18,
    textAlign: 'center'

  },
  listEmptyView: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: 80,
  }
});

module.exports = NotificationMgmtScene;
