/*
 * a notification history screen
 * hear we add filter for notification history like start date, end date and sort by. 
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
import DatePicker from 'react-native-datepicker'
import ModalPicker from 'react-native-modal-picker'
import {Image, StyleSheet, Text, View, ListView, AppRegistry, TextInput, TouchableHighlight, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';

/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
  INSTANCES
 */
const onGetNotificationHistoryModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
let onGetNotificationHistorySubscription;

var dateFormat = require('dateformat');
var now = new Date();
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  list: {
    marginTop: 16,
  },
  date: {
    height: 48,
    width: 100,
    margin: 4,
    alignSelf: 'center',
    alignItems: 'center',
  },
  select: {
    borderRadius: 0,
    margin: 4,
    borderWidth: 1,
    height: 40,
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  device_alias: {
    color: Skin.colors.PRIMARY_TEXT,
    fontSize: 16,
    height: 48,
    backgroundColor: '#ebebeb'
  },
  amount: {
    fontSize: 22,
    color: '#000',
    opacity: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
var history = [
  {
    notification_uuid: "<NOTIFICATION_UUID>",
    status: "<ACTIVE/EXPIRED/UPDATED>",
    delivery_status: "NOTIFIED/PARTIALLY_NOTIFIED/FAILED_TO_NOTIFY",
    action_taken: "<Accepted/Rejected/NONE>",
    message: {
      "subject": "<subject_1>",
      "body": "<body_1>"
    },
    device_uuid: "<UUID_of_device_which_accepted_or_rejected_The_Notification>",
    device_alias: "<Name_of_device_which_accepted_or_rejected_The_Notification>",
    created_ts: "2016-02-09T12:24:16",
    updated_ts: "2016-03-09T12:24:15",
    expired_ts: "2016-06-09T12:24:15",
    enterprise_id: "<enterprise_id>"
  },
  {
    notification_uuid: "<NOTIFICATION_UUID>",
    status: "<ACTIVE/EXPIRED/UPDATED>",
    delivery_status: "NOTIFIED/PARTIALLY_NOTIFIED/FAILED_TO_NOTIFY",
    action_taken: "<Accepted/Rejected/NONE>",
    message: {
      "subject": "<subject_2>",
      "body": "<body_2>"
    },
    device_uuid: "<UUID_of_device_which_accepted_or_rejected_The_Notification>",
    device_alias: "<Name_of_device_which_accepted_or_rejected_The_Notification>",
    created_ts: "2016-02-09T12:24:15",
    updated_ts: "2016-03-09T12:24:15",
    expired_ts: "2016-06-09T12:24:15",
    enterprise_id: "<enterprise_id>"
  }
]
function compare(a, b) {
  if (a.created_ts < b.created_ts)
    return 1;
  if (a.created_ts > b.created_ts)
    return -1;
  if (a.created_ts == b.created_ts)
    return 0;
}
class Notifications_History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInitValue: "All",
      startdate: dateFormat(now, "isoDate"),
      enddate: dateFormat(now, "isoDate"),
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),

    };
  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    if (onGetNotificationHistorySubscription) {
      onGetNotificationHistorySubscription.remove();
      onGetNotificationHistorySubscription = null;
    }
    onGetNotificationHistorySubscription = onGetNotificationHistoryModuleEvt.addListener('onGetNotificationsHistory',
      this.onGetNotificationHistory.bind(this));
  }

  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
        if (Main.isConnected) {
      this.getNotificationHistory();
    } else {
      Alert.alert(
        '',
        'Please check your internet connection',
        [
          { text: 'OK', onPress: () => this.props.navigator.pop(0) }
        ]
      );
    }
    var data = history.sort(compare);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHistoryArrayToMap(data))
    });
  }

  //call getNotificationHistory api.
  getNotificationHistory(recordCount,startIndex,enterpriseID,startDate,endDate, notificationStatus, notificationActionTaken,keywordSearch,deviceID) {
    ReactRdna.getNotificationHistory(recordCount,startIndex,enterpriseID,startDate,endDate,notificationStatus,notificationActionTaken,keywordSearch,deviceID,  (response) => {
      console.log('-----NotificationHistory.getNotificationHistory.response ');
      console.log(response);
      alert("getNotificationHistory"+response[0].error);
      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      }
    });
  }
  //callback of getNotificationHistory api.
  onGetNotificationHistory(e) {
    alert("onGetNotificationHistory"+e.response);
  }
  /**
   * return sort by options
   */
  getSortByOptions() {
    let data = [
      {
        key: 'title',
        section: true,
        label: 'Sort By Options'
      },
      {
        key: 'ACTIVE',
        label: 'ACTIVE'
      },
      {
        key: 'EXPIRED',
        label: 'EXPIRED'
      },
      {
        key: 'UPDATE',
        label: 'UPDATE'
      }
    ];
    return data;
  }
  convertHistoryArrayToMap(data) {
    var historyCategoryMap = {}; // Create the blank map
    data.forEach(function (notification) {
      if (!historyCategoryMap[notification.created_ts]) {
        // Create an entry in the map for the category if it hasn't yet been created
        historyCategoryMap[notification.created_ts] = [];
      }
      historyCategoryMap[notification.created_ts].push(notification);
    });
    return historyCategoryMap;
  }
  /*
     This method is used to render the componenet with all its element.
   */
  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'Notification History',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
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
        <View style={styles.container}>
          <View style={{ height: 50, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <DatePicker
                style={styles.date}
                date={this.state.startdate}
                placeholder="Start Date"
                format="YYYY-MM-DD"
                iconSource=""
                minDate="2016-05-01"
                maxDate={dateFormat(now, "isoDate") }
                onDateChange={(date) => { this.setState({ startdate: date }) } }
                />
            </View>
            <View style={{ flex: 1 }}>
              <DatePicker
                style={styles.date}
                date={this.state.enddate}
                placeholder="End Date"
                format="YYYY-MM-DD"
                iconSource=""
                minDate={this.state.startdate}
                maxDate={dateFormat(now, "isoDate") }
                onDateChange={(date) => { this.setState({ enddate: date }) } }
                />
            </View>
            <View style={{ flex: 1 }}>
              <ModalPicker
                data={this.getSortByOptions() }
                selectStyle={styles.select}
                initValue={this.state.modalInitValue}
                onChange={(option) => {
                } } />
            </View>
          </View>
          <ListView
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.notification_history}
            renderSectionHeader={this.renderSectionHeader}
            />
        </View>
      </Main>
    );
  }


  /*
     This method return custom notification row.
   */
  notification_history(notification) {
      var bodyarray = notification.message.body.split("\n");
    return (
      <View style={{ width: Skin.SCREEN_WIDTH - 32, marginBottom: 8, marginLeft: 16, marginRight: 16, }}>
        <View style={Skin.notification.col}>

          <View style={Skin.notification.row}>
            <Text style={Skin.notification.subject}>
              {notification.message.subject}
            </Text>
            <Text style={Skin.notification.time}>
              date
            </Text>
          </View>

            <View style={{ backgroundColor: 'transparant', flex: 2, flexDirection: 'column' }}>
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
            </View>

          <View style={{ flexDirection: 'column', }}>
            <Text style={styles.device_alias}>
              {notification.device_alias}
            </Text>
          </View>
        </View>
      </View>
    )
  }
  /** 
   * Return section header row.
  */
  renderSectionHeader(sectionData, category) {
    return (
      <Text style={{ textAlign: 'left', color: '#000', opacity: 0.7, marginLeft: 16, alignItems: 'center', fontSize: 14, backgroundColor: 'transparant' }}>{category}</Text>
    )
  }
}

module.exports = Notifications_History;
