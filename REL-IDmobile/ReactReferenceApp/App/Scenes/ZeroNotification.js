/*
 * it shows Notifications
 */
'use strict';
/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import {StyleSheet, Text, ListView, TextInput, AsyncStorage, DeviceEventEmitter, TouchableHighlight, View, WebView, Alert, } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Modal from 'react-native-simple-modal';

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

/*
 *Sort notification row based on timestamp.
 */
function compare(a, b) {
  if (a.expiry_timestamp < b.expiry_timestamp)
    return 1;
  if (a.expiry_timestamp > b.expiry_timestamp)
    return -1;
  if (a.expiry_timestamp == b.expiry_timestamp)
    return 0;
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
            this.showalert(notification, btnLabel)
          }
        },
      ]
    )
  },

  showalert(notification, btnLabel) {
    for (var i = 0; i < notification.action.length; i++) {
      var data = notification.action[i];
      if (data.label == btnLabel) {
        obj.updateNotificationDetails(notification.notification_uuid, data.action);
        break;
      }
    }
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
    var timestamp = expiry_timestamp.split("EDT");
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
                  onPress={() => this.showalert(this.props.notification, this.props.notification.action[0].label) }
                  >
                  <View style={Skin.notification.text} >
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[0].label}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight style={Skin.notification.denybutton} onPress={() => this.showalert(this.props.notification, this.props.notification.action[1].label) }>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[1].label}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight style={Skin.notification.fraudbutton} onPress={() => this.showalertforReject(this.props.notification, this.props.notification.action[2].label) }>
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

                <TouchableHighlight style={Skin.notification.approvebutton} onPress={() => this.showalert(this.props.notification, this.props.notification.action[0].label) }>
                  <View style={Skin.notification.text}>
                    <Text style={Skin.notification.buttontext}>
                      {this.props.notification.action[0].label}
                    </Text>
                  </View>
                </TouchableHighlight>


                <TouchableHighlight style={Skin.notification.rejectbutton} onPress={() => this.showalertforReject(this.props.notification, this.props.notification.action[1].label) }>
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

    var data = this.renderListViewData(notification.sort(compare));
    this.state = {
      dataSource: ds.cloneWithRows(data),
      alertMsg: "",
      showAlert: false
    };
    this.selectedAlertOp = true;
  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
    obj = this;
    Events.on('showNotification', 'showNotification', this.showNotification);
    if (this.props.url != null) {
      NotificationObtianedResponse = this.props.url.data;
      this.onGetNotificationsDetails(NotificationObtianedResponse);
    } else {
      this.getMyNotifications();
    }
    if (onUpdateNotificationSubscription) {
      onUpdateNotificationSubscription.remove();
      onUpdateNotificationSubscription = null;
    }
    onUpdateNotificationSubscription = onUpdateNotificationModuleEvt.addListener('onUpdateNotification',
      this.onUpdateNotification.bind(this));
  }
  /*
This is life cycle method of the react native component.
This method is called when the component will Unmount.
*/
  componentWillUnmount() {
    Events.rm('showNotification', 'showNotification');
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
    var listViewScrollView = this.refs.listView.getScrollResponder();
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
          console.log('----- ----- response is not 0');
          if (NotificationObtianedResponse !== null && NotificationObtianedResponse !== undefined) {
            // If error occurred reload last response
            this.onGetNotificationsDetails(NotificationObtianedResponse);
          }
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
  //Send notification response
  updateNotificationDetails(notificationId, action) {
    console.log('----- NotificationMgmt.updateNotificationDetails');
    if (Main.isConnected) {
      ReactRdna.updateNotification(notificationId, action, (response) => {
        console.log('ReactRdna.updateNotificationDetails.response:');
        console.log(response);

        if (response[0].error !== 0) {
          console.log('----- ----- response is not 0');
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

        this.setState({ notification: noti });
        notification = noti;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.renderListViewData(notification.sort(compare))),
        });
      } else {
        this.showAlertModal("You have no pending notifications");
      }
    } else {
      console.log('Something went wrong');
    }
  }

  onUpdateNotification(e) {
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
          this.props.navigator.pop(0);
        }

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.renderListViewData(notification.sort(compare))),
        });

      } else {

        Alert.alert(
          'Alert',
          res.pArgs.response.StatusMsg,
          [
            { text: 'OK', onPress: () => this.getMyNotifications() }
          ]
        )

        // If error occurred reload devices list with previous response

      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
    }
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
    this.props.navigator.pop();
  }

  onAlertModalDismissed() {
    //Do nothing for right now
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
  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    //console.log('in render');
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'My Notifications',
          visible: true,
          tint: Skin.main.NAVBAR_TINT,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: this.props.navigator.pop,
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
        >

        <View style={{ flex: 1, backgroundColor: Skin.main.BACKGROUND_COLOR }}>
          <ListView
            ref="listView"
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow} />
        </View>

        <Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.showAlert}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => {
            if (this.selectedAlertOp) {
              this.selectedAlertOp = false;
              this.onAlertModalOk();
            } else {
              this.selectedAlertOp = false;
              this.onAlertModalDismissed();
            }
          } }>
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
            } }
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              OK
            </Text>
          </TouchableHighlight>
        </Modal>
      </Main>
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
  }
});

module.exports = NotificationMgmtScene;
