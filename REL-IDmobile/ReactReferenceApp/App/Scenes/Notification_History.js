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
import Config from 'react-native-config';

/*
 Required for this js
 */
import DatePicker from 'react-native-datepicker'
import ModalPicker from 'react-native-modal-picker'
import {Image, StyleSheet, Text, View, Keyboard, ListView, AppRegistry, TextInput, TouchableHighlight, Alert, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Modal from 'react-native-simple-modal';
import Events from 'react-native-simple-events';
import Util from "../Components/Utils/Util";

/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
import MainActivation from '../Components/Container/MainActivation';
import PageTitle from '../Components/view/pagetitle';
import { NavigationActions} from 'react-navigation';

/*
 Custome View
 */
import Search from '../Components/view/search';
/*
  INSTANCES
 */
const onGetNotificationHistoryModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
let onGetNotificationHistorySubscription;

var dateFormat = require('dateformat');
var now = new Date();

var Obj;
let isPageTitle = JSON.parse(Config.ENABLEPAGETITLE);

var HISTORY = {
  "session_id": "4XF8VD5VTNUV0AJJ7S229OPAVF0W8I6XANS55ZJQPO2BW3F8X1A21AE8AEC16AD4B06AC2A9D7D0259D033EE84FED3EAE9A9838FED365B5AABB04",
  "device_uuid": "18YJGCVJ52XPQOZB59KH3FFVCEME6URBW5RWFNF10KKCG68IC9",
  "timestamp": "2017-02-17T15:41:11IST",
  "uuid": "99301ddb-f42a-11e6-8719-9c2a70c87e2b",
  "data": {
    "notification_history_details": {
      "total_count": 3,
      "history": [
        {
          "notification_uuid": "e7b0190a-d48e-4a6d-b9f8-11c601831426",
          "status": "UPDATED",
          "delivery_status": "FAILED_TO_NOTIFY",
          "action_performed": "Approve",
          "message": {
            "subject": "LoginAttempt",
            "body": "WindowsNT10.0;WOW64\nCity,   Country(127.0.0.1)\nSite: NetBankingRetail\n"
          },
          "action_device_uuid": "18YJGCVJ52XPQOZB59KH3FFVCEME6URBW5RWFNF10KKCG68IC9",
          "device_alias": "<Device_Alias>",
          "create_ts": "2017-02-16T19: 15: 29IST",
          "update_ts": "2017-02-16T19: 15: 41IST",
          "expiry_timestamp": "2017-02-16T19: 18: 29IST",
          "enterprise_id": "UBS"
        },
        {
          "notification_uuid": "8ce9b3bd-fe9a-413c-8e59-113b6511d597",
          "status": "UPDATED",
          "delivery_status": "FAILED_TO_NOTIFY",
          "action_performed": "Approve",
          "message": {
            "subject": "LoginAttempt",
            "body": "WindowsNT10.0;WOW64\nCity,   Country(127.0.0.1)\nSite: NetBankingRetail\n"
          },
          "action_device_uuid": "18YJGCVJ52XPQOZB59KH3FFVCEME6URBW5RWFNF10KKCG68IC9",
          "device_alias": "<Device_Alias>",
          "create_ts": "2017-02-17T12: 12: 12IST",
          "update_ts": "2017-02-17T12: 12: 30IST",
          "expiry_timestamp": "2017-02-17T12: 15: 11IST",
          "enterprise_id": "UBS"
        },
        {
          "notification_uuid": "7546e2ef-07fb-4e89-93d6-b28536cc021b",
          "status": "EXPIRED",
          "delivery_status": "FAILED_TO_NOTIFY",
          "action_performed": "NONE",
          "message": {
            "subject": "LoginAttempt",
            "body": "WindowsNT10.0;WOW64\nCity,   Country(127.0.0.1)\nSite: NetBankingRetail\n"
          },
          "device_alias": "<Device_Alias>",
          "create_ts": "2017-02-17T12: 12: 55IST",
          "expiry_timestamp": "2017-02-17T12: 15: 55IST",
          "enterprise_id": "UBS"
        }
      ]
    },
    "status_code": 100,
    "message": "Success"
  },
  "node_name": "f9439096-f429-11e6-8719-9c2a70c87e2b:fa831577-f429-11e6-8719-9c2a70c87e2b"
};


var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
     paddingTop: 16,
     height:Skin.SCREEN_HEIGHT-107
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
    borderColor: '#bfbfbf',
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
    textAlign: 'left',
    textAlignVertical: 'center',
    width: Skin.SCREEN_WIDTH - 32,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#e0e0e0',
  },
  amount: {
    fontSize: 22,
    color: '#000',
    opacity: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  expired_update: {
    color: Skin.colors.PRIMARY_TEXT,
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  action_performed: {
    color: Skin.colors.PRIMARY_TEXT,
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  go: {
    color: '#000',
    fontSize: 16,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 40,
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
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
  }
});

function compare(a, b) {
  if (a.create_ts < b.create_ts)
    return 1;
  if (a.create_ts > b.create_ts)
    return -1;
  if (a.create_ts == b.create_ts)
    return 0;
}
class Notifications_History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInitValue: "All",
      search: '',
      startdate: '',
      enddate: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),
      selectedAction: '',
      alertMsg: "",
      showAlert: false
    };
    this.selectedAlertOp = true;
    this.showAlertModal = this.showAlertModal.bind(this);
    this.onAlertModalDismissed = this.onAlertModalDismissed.bind(this);
    this.onAlertModalOk = this.onAlertModalOk.bind(this);
    this.dismissAlertModal = this.dismissAlertModal.bind(this);
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
    Obj = this;
    if (Main.isConnected) {
      this.getNotificationHistory(10, 0, '', '', '', '', '', '', '');
    } else {
      // Alert.alert(
      //   '',
      //   'Please check your internet connection',
      //   [
      //     { text: 'OK', onPress: () => this.props.navigator.pop(0) }
      //   ]
      // );
    }
    //   this.renderHistory(HISTORY);
  }

  renderHistory(data) {
    // var history = data.data.notification_history_details.history
    var sorthistory = data.sort(compare);
    var dateAdd = this.addDate(sorthistory);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertHistoryArrayToMap(dateAdd))
    });
  }

  /**
   * add Date attribute in each item of History array
   */
  addDate(history) {
    history.forEach(function (h) {
      h.created_date = h.create_ts.split("T")[0];
    });
    return history;
  }
  //  var recordCount = "0";
  //  var startIndex = "1";
  //  var enterpriseID = "";
  //  var startDate = "";
  //  var endDate = "";
  //call getNotificationHistory api.

  getNotificationHistory(recordCount, startIndex, enterpriseID, startDate, endDate, notificationStatus, notificationActionTaken, keywordSearch, deviceID) {
    ReactRdna.getNotificationHistory(recordCount, enterpriseID, startIndex, startDate, endDate, notificationStatus, notificationActionTaken, keywordSearch, deviceID, (response) => {
      if (response[0].error === 0) {
        Events.trigger('showLoader', true);
        //   alert('getNotificationHistory response is' + response[0].error);
      } else {
        alert('immediate response is' + response[0].error);
      }
    });
  }



  //callback of getNotificationHistory api.
  onGetNotificationHistory(e) {
    Events.trigger('hideLoader', true);
    const res = JSON.parse(e.response);
    if (res.errCode == 0) {
      var ResponseObj = JSON.parse(e.response);
      if (ResponseObj.pArgs.response.ResponseData != undefined) {
        var count = ResponseObj.pArgs.response.ResponseData.total_count;
        if (count === 0) {
          if (this.state.showAlert === false) {
            this.showAlertModal("No record found");
          }
        } else {
          if (this.state.showAlert === true) {
            this.dismissAlertModal();
          }
          var ObtainedHistory = ResponseObj.pArgs.response.ResponseData.history;
          Obj.renderHistory(ObtainedHistory);
        }
      }
      else {
        if (this.state.showAlert === false) {
          this.showAlertModal("No record found");
        }
      }
    } else {
      setTimeout(() => {
       alert("onGetNotificationHistory errCode" + res.errCode);
      }, 100);
    }
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
        key: 'UPDATED',
        label: 'UPDATED'
      }
    ];
    return data;
  }
  convertHistoryArrayToMap(data) {
    var historyCategoryMap = {}; // Create the blank map
    data.forEach(function (notification) {
      if (!historyCategoryMap[notification.created_date]) {
        // Create an entry in the map for the category if it hasn't yet been created
        historyCategoryMap[notification.created_date] = [];
      }

      historyCategoryMap[notification.created_date].push(notification);
    });
    return historyCategoryMap;
  }
  /*
    onTextchange method for Access Code TextInput.
  */
  onSearchChange(event) {
    this.setState({ search: event.nativeEvent.text });
  }

  performesearch() {
    this.setState({ search: '' });
  }

  removeSpace(str) {
    return str.replace(/\s+/g, '');
  }

  goBack(){
    this.props.navigation.goBack();
    
  }
  
  componentWillUnmount(){
    this.props.navigation.state.params.onClose();
  }


  go() {
    if (this.state.startdate == '') {
      alert('Select Start Date.');
    } else if (this.state.enddate == '') {
      alert('Select End Date.');
    } else {
      alert('go');
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

  //return color code based on action
  highlightcolor(action_performed) {
    if (action_performed == 'Approve') {
      return '#92D050';
    } else if (action_performed == 'Rejected') {
      return '#800000';
    } else {
      return '#212121'
    }
  }

  /*
    render pagetitle
  */
  renderPageTitle(pageTitle){
        return(<PageTitle title={pageTitle}
        handler={this.goBack.bind(this)} isBadge={true}/>);
  }
  /*
     This method is used to render the componenet with all its element.
   */
  render() {
    return (
      <MainActivation
        disabled={true}>
        <Main
          drawerState={{
            open: false,
            disabled: true,
          }}
          defaultNav = {isPageTitle?false:true}
          navBar={{
            title: 'Notification History',
            visible: true,
            tint: Skin.colors.TEXT_COLOR,
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
          { isPageTitle && this.renderPageTitle('Notification History')}
          <View style={[styles.container, { backgroundColor: Skin.main.NOTIFICATION_LIST_BACKGROUND }]}>

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.notification_history}
              renderSectionHeader={this.renderSectionHeader}
              stickySectionHeadersEnabled = {false}
              />
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
      </MainActivation>
    );
  }



  /*
     This method return custom notification row.
   */
  notification_history(notification) {
    var bodyarray = notification.message.body.split("\n");
    var indents = [];
    if (notification.status == 'ACTIVE') {
      indents.push(
        null
      );
    } else if (notification.status == "EXPIRED") {
      indents.push(
        <View style={{ flexDirection: 'column', }}>
          <Text style={styles.expired_update}><Text style={{ fontWeight: 'bold' }}>Expired On: </Text>{Util.getFormatedDate(notification.expiry_timestamp)}
          </Text>
          <Text style={styles.action_performed}>Action performed: <Text style={{ color: Obj.highlightcolor(notification.action_performed) }}>{notification.action_performed}</Text>
          </Text>
        </View>
      );
    } else if (notification.status == "UPDATED") {
      indents.push(
        <View style={{ flexDirection: 'column', backgroundColor: 'f00' }}>
          <Text style={styles.expired_update}><Text style={{ fontWeight: 'bold' }}>Updated On: </Text>{Util.getFormatedDate(notification.update_ts)}
          </Text>
          <Text style={styles.action_performed}>Action performed: <Text style={{ color: Obj.highlightcolor(notification.action_performed) }}>{notification.action_performed}</Text>
          </Text>
        </View>
      );
    }


    return (
      <View style={{ width: Skin.SCREEN_WIDTH - 32, marginBottom: 8, marginLeft: 16, marginRight: 16, backgroundColor: '#fff' }}>
        <View style={[Skin.notification.historyrow, { marginBottom: 4 }]}>
          <Text style={Skin.notification.subject}>
            {notification.message.subject}
          </Text>
          <Text style={Skin.notification.time}>
            {Util.getFormatedDate(notification.create_ts)}
          </Text>
        </View>

        <View style={{ backgroundColor: 'transparent', flex: 2, flexDirection: 'column', marginBottom: 8 }}>
          <View style={Skin.notification.historyrow}>
            <Text style={Skin.notification.dot}>{"\u2022"}</Text>
            <Text style={Skin.notification.body}>
              {bodyarray[0]}
            </Text>
          </View>
          <View style={Skin.notification.historyrow}>
            <Text style={Skin.notification.dot}>{"\u2022"}</Text>
            <Text style={Skin.notification.body}>
              {bodyarray[1]}
            </Text>
          </View>
          <View style={Skin.notification.historyrow}>
            <Text style={Skin.notification.dot}>{"\u2022"}</Text>
            <Text style={Skin.notification.body}>
              {bodyarray[2]}
            </Text>
          </View>
        </View>
        {indents}
      </View>
    )
  }
  /** 
   * Return section header row.
  */
  renderSectionHeader(sectionData, category) {
    return (
      <Text style={{ textAlign: 'left', color: Config.THEME_COLOR, opacity: 1, marginLeft: 16, alignItems: 'center', fontSize: 14, backgroundColor: 'transparent' }}>{category}</Text>
    )
  }
}

module.exports = Notifications_History;



// filter row code
//          <View style={{ height: 50, flexDirection: 'row', marginLeft: 4, marginRight: 4 }}>
//             <View style={{ flex: 2 }}>
//               <DatePicker
//                 style={styles.date}
//                 date={this.state.startdate}
//                 placeholder="Start Date"
//                 format="YYYY-MM-DD"
//                 iconSource=""
//                 minDate="2016-05-01"
//                 maxDate={dateFormat(now, "isoDate") }
//                 onDateChange={(date) => { this.setState({ startdate: date }) } }
//                 />
//             </View>
//             <View style={{ flex: 2 }}>
//               <DatePicker
//                 style={styles.date}
//                 date={this.state.enddate}
//                 placeholder="End Date"
//                 format="YYYY-MM-DD"
//                 iconSource=""
//                 minDate={this.state.startdate}
//                 maxDate={dateFormat(now, "isoDate") }
//                 onDateChange={(date) => { this.setState({ enddate: date }) } }
//                 />
//             </View>
//             <View style={{ flex: 2 }}>
//               <ModalPicker
//                 data={this.getSortByOptions() }
//                 selectStyle={styles.select}
//                 initValue={this.state.modalInitValue}
//                 onChange={(option) => {
//                 } } />
//             </View>
//             <TouchableOpacity style={{ marginTop: 4, height: 40, width: 40, borderRadius: 0, borderWidth: 1, borderColor: '#bfbfbf', }}
//               underlayColor={Skin.baseline.button.underlayColor}
//               activeOpacity={Skin.baseline.button.activeOpacity}
//               onPress={() => {
//                 this.go();
//               } }
//               >
//               <Text style={styles.go}>GO</Text>
//             </TouchableOpacity>
//           </View>
