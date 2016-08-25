'use strict';
//onGetNotifications
//onUpdateNotification
import React from 'react-native';
import Skin from '../Skin';


/*
  CALLED
*/
import Main from '../Components/Main';
import Constants from '../Components/Constants';
import Events from 'react-native-simple-events';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
  INSTANCED
 */
const {
  StyleSheet,
  Text,
  ListView,
  TextInput,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableHighlight,
  View,
  Alert,
} = React;
//let onUpdateDevice;
//let onGetDevice;
//let devicesList;
//let deviceHolderList;
//let devicesResponse;
let onGetNotifications;
let onUpdateNotification;
let notificationList;
let notificationHolderList;
let notificationResponse;
let NotificationObtianedResponse;
let obj;

var notification =  [];



function compare(a, b) {
  if (a.notification_uuid < b.notification_uuid)
    return -1;
  if (a.notification_uuid > b.notification_uuid)
    return 1;
  if (a.notification_uuid == b.notification_uuid)
    return 0;
}


var SampleRow = React.createClass({
                                  showalert(notification,btnLabel) {
                                  for(var i =0 ; i< notification.action.length;i++){
                                  var data = notification.action[i];
                                  if(data.label == btnLabel){
                                  obj.updateNotificationDetails(notification.notification_uuid,data.action);
                                  break;
                                  }
                                  
                                  }
                                  
                                  },
                                  render() {
                                  if(this.props.notification.action.length==3){
                                  return (
                                          <View style={Skin.notification.customerow}>
                                          
                                          <View style={Skin.notification.col}>
                                          <View style={Skin.notification.row}>
                                          <Text style={Skin.notification.subject}>
                                          {this.props.notification.message.subject}
                                          </Text>
                                          <Text style={Skin.notification.time}>
                                          {this.props.notification.expiry_timestamp}
                                          </Text>
                                          </View>
                                          <View style={Skin.notification.row}>
                                          <Text style={Skin.notification.body}>
                                          {this.props.notification.message.body}
                                          </Text>
                                          </View>
                                          <View style={Skin.notification.row}>
                                          
                                          <TouchableHighlight style={Skin.notification.confirmbutton}
                                          onPress={() => this.showalert(this.props.notification,this.props.notification.action[0].label)}
                                          >
                                          <View style={Skin.notification.text} >
                                          <Text style={Skin.notification.buttontext}>
                                          {this.props.notification.action[0].label}
                                          </Text>
                                          </View>
                                          </TouchableHighlight>
                                          
                                          <TouchableHighlight style={Skin.notification.denybutton} onPress={() => this.showalert(this.props.notification,this.props.notification.action[0].label)}>
                                          <View style={Skin.notification.text}>
                                          <Text style={Skin.notification.buttontext}>
                                          {this.props.notification.action[1].label}
                                          </Text>
                                          </View>
                                          </TouchableHighlight>
                                          
                                          <TouchableHighlight style={Skin.notification.fraudbutton} onPress={() => this.showalert(this.props.notification,this.props.notification.action[0].label)}>
                                          <View style={Skin.notification.text}>
                                          <Text style={Skin.notification.buttontext}>
                                          {this.props.notification.action[2].label}
                                          </Text> 
                                          </View>
                                          </TouchableHighlight>
                                          
                                          
                                          
                                          </View>
                                          </View>
                                          </View>
                                          );
                                  }else{
                                  return (
                                          <View style={Skin.notification.customerow}>
                                          
                                          <View style={Skin.notification.col}>
                                          <View style={Skin.notification.row}>
                                          <Text style={Skin.notification.subject}>
                                          {this.props.notification.message.subject}
                                          </Text>
                                          <Text style={Skin.notification.time}>
                                          {this.props.notification.expiry_timestamp}
                                          </Text>
                                          </View>
                                          <View style={Skin.notification.row}>
                                          <Text style={Skin.notification.body}>
                                          {this.props.notification.message.body}
                                          </Text>
                                          </View>
                                          
                                          <View style={Skin.notification.row}>
                                          
                                          <TouchableHighlight style={Skin.notification.approvebutton} onPress={() => this.showalert(this.props.notification,this.props.notification.action[0].label)}>
                                          <View style={Skin.notification.text}>
                                          <Text style={Skin.notification.buttontext}>
                                          {this.props.notification.action[0].label}
                                          </Text> 
                                          </View>
                                          </TouchableHighlight>
                                          
                                          
                                          <TouchableHighlight style={Skin.notification.rejectbutton} onPress={() => this.showalert(this.props.notification,this.props.notification.action[0].label)}>
                                          <View style={Skin.notification.text}>
                                          <Text style={Skin.notification.buttontext}>
                                          {this.props.notification.action[1].label}
                                          </Text> 
                                          </View>
                                          </TouchableHighlight>
                                          </View>
                                          </View>
                                          </View>
                                          );
                                  }
                                  }
                                  });


export default class NotificationMgmtScene extends React.Component {
  
  componentWillMount() {

    obj = this;

    Events.on('showNotification', 'showNotification', this.showNotification);
    if(this.props.url != null){
    NotificationObtianedResponse = this.props.url.data;
    this.onGetNotificationsDetails(NotificationObtianedResponse);
    }else{
      this.getMyNotifications();
    }
    if(onUpdateNotification){
      onUpdateNotification.remove();
    }
    onUpdateNotification = DeviceEventEmitter.addListener(
                                                        'onUpdateNotification',
                                                        this.onUpdateNotificationDetails.bind(this)
                                                        );

  }

  componentDidMount() {
     var listViewScrollView = this.refs.listView.getScrollResponder();
  }
  showNotification(args){
    obj.onGetNotificationsDetails(args);
  }
  getMyNotifications(){
    
    var recordCount = "-1";
    var startIndex = "0";
    var enterpriseID = "1234";
    var startDate = "12:08:16";
    var endDate = "18:08:16";
    ReactRdna.getNotifications(recordCount,startIndex,enterpriseID,startDate,endDate,(response)=>{
                               
                   console.log('----- NotificationMgmt.getMyNotifications.response ');
                   console.log(response);
                   
                   if (response[0].error !== 0) {
                     console.log('----- ----- response is not 0');
                       if (NotificationObtianedResponse !== undefined) {
                       // If error occurred reload last response
                                   this.onGetNotifications(NotificationObtianedResponse);
                       }
                   }
                   
             });
  }
  
  updateNotificationDetails(notificationId, action){
    console.log('----- NotificationMgmt.updateNotificationDetails');
   
    ReactRdna.updateNotification(notificationId, action, (response) => {
                                 console.log('ReactRdna.updateNotificationDetails.response:');
                                 console.log(response);
                                 
                                 if (response[0].error !== 0) {
                                 console.log('----- ----- response is not 0');
                                 if (NotificationObtianedResponse !== undefined) {
                                 console.log('----- ----- response is not 0');
                                 // If error occurred reload last response
                                 this.onGetNotifications(NotificationObtianedResponse);
                                 }
                                 }
                                 });
  }
  componentWillUnmount() {
    Events.rm('showNotification', 'showNotification');
      }

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
    this.setState({notification: noti});
      
      this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.renderListViewData(noti.sort(compare))),
                          });
    } else {
      alert('Something went wrong');
    }
  }


  onUpdateNotificationDetails(e) {
    const res = JSON.parse(e.response);
    
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        //this.props.navigator.pop();
       
      } else {
        alert(res.pArgs.response.StatusMsg);
        // If error occurred reload devices list with previous response
       
      }
    } else {
      alert('Something went wrong');
      // If error occurred reload devices list with previous response
         }
  }



  constructor(props) {
     super(props);
    obj = this;
    var ds = new ListView.DataSource({
                                             sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
                                             rowHasChanged: (r1, r2) => r1 !== r2

                                             });
    var data= this.renderListViewData(notification.sort(compare));
    this.state = {
    dataSource:  ds.cloneWithRows(data)
    };
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
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: 'Back',
            icon: 'x',
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
           
            <View style={Skin.customeStyle.maincontainer}>
            <ListView
            ref="listView"
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow} />
            </View>
      </Main>
    );
  }
}

module.exports = NotificationMgmtScene;
