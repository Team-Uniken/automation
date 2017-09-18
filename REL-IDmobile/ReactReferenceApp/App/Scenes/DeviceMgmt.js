/**
 * Device managment screen for edit device name and delete device(to make it temporary).
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
import Modal from 'react-native-simple-modal';
import {View, StyleSheet, Text, ListView, TextInput, AsyncStorage, DeviceEventEmitter, TouchableHighlight, TouchableOpacity, Alert, } from 'react-native'
import { SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import { NativeModules, NativeEventEmitter } from 'react-native';
import Config from 'react-native-config';



/*
 Use in this js
 */
import Main from '../Components/Container/Main';
import Constants from '../Components/Utils/Constants';
import Skin from '../Skin';
import PageTitle from '../Components/view/pagetitle';
import Util from "../Components/Utils/Util";
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
import { NavigationActions} from 'react-navigation';
/*
  INSTANCES
 */
const onGetRegistredDeviceDetailsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onUpdateDeviceDetailsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
let obj;

let onUpdateDeviceDetailsSubscription;
let onGetRegistredDeviceDetailsSubscription;
let devicesList;
let deviceHolderList;
let devicesResponse;
const FAKE_BOOK_DATA = [];
let isPageTitle = Config.ENABLEPAGETITLE;
const styles = StyleSheet.create({
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    marginTop: 8,
    padding: 10,
    alignItems: 'flex-start',
    borderBottomColor: Skin.colors.DIVIDER_COLOR,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  rowBack: {
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  modalwrap: {
    height: 130,
    flexDirection: 'column',
    borderRadius: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalButtonText: {
    textAlign: 'center',
  },
  modalInput: {
    textAlign: 'left',
    color: Skin.colors.PRIMARY_TEXT,
    height: 48,
    fontSize: 16,
  },
  border: {
    height: 1,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
    marginBottom: 10,
  },
  button: {
    height: 48,
    width: 48,
    opacity: 0.6,
    justifyContent: "center",
    marginTop: 4,
  },
  listViewWrap: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Skin.colors.BACK_GRAY,
    width: Skin.SCREEN_WIDTH,
    height: Skin.SCREEN_HEIGHT,
  },
  itemTitle: {
    color: Skin.colors.PRIMARY_TEXT,
    fontWeight: 'bold',
    flex: 1,
    paddingBottom: 5,
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
  },
  leftLabels: {
    flex: 1,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  rightLabels: {
    flex: 2.3,
  },
  msg:{
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop:5,
    color:'#5c6068',
  }
});

export default class DeviceMgmtScene extends Component {
  constructor(props) {
    super(props);
    obj = this;
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      open: false,
      inputDeviceName: '',
      selectedDeviceIndex: -1,
      dataSource: [],
      username: '',
      status: 'created',
      deviceCount: 0,
      currentDeviceId: null,
      logOffOnDelete:false,
    };

    this.onGetRegistredDeviceDetails = this.onGetRegistredDeviceDetails.bind(this);
    this.getRegisteredDeviceDetails = this.getRegisteredDeviceDetails.bind(this);
  }


  /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {

    if (onUpdateDeviceDetailsSubscription) {
      onUpdateDeviceDetailsSubscription.remove();
      onUpdateDeviceDetailsSubscription = null;
    }

    onUpdateDeviceDetailsSubscription = onUpdateDeviceDetailsModuleEvt.addListener('onUpdateDeviceDetails',
      this.onUpdateDeviceDetails.bind(this));
  }

  getCurrentDeviceId() {
    ReactRdna.getDeviceID((response) => {
      if (response[0].error == 0) {
        this.state.currentDeviceId = response[0].response;
      }
    });
  }

  /*
      This is life cycle method of the react native component.
      This method is called when the component is Mounted/Loaded.
    */
  componentDidMount() {
    if (Main.isConnected) {
      this.getCurrentDeviceId();
      this.getRegisteredDeviceDetails();
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
  //call getRegisteredDeviceDetails api.
  getRegisteredDeviceDetails() {
    if (onGetRegistredDeviceDetailsSubscription) {
      onGetRegistredDeviceDetailsSubscription.remove();
      onGetRegistredDeviceDetailsSubscription = null;
    }

    onGetRegistredDeviceDetailsSubscription = onGetRegistredDeviceDetailsModuleEvt.addListener('onGetRegistredDeviceDetails', this.onGetRegistredDeviceDetails);
    ReactRdna.getRegisteredDeviceDetails(Main.dnaUserName, (response) => {
      console.log('----- DeviceMgmt.getRegisteredDeviceDetails.response ');
      console.log(response);

      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
        if (devicesResponse !== undefined) {
          // If error occurred reload last response
          this.onGetRegistredDeviceDetails(devicesResponse);
        }
      }
    });
  }

  //callback of getRegisteredDeviceDetails api.
  onGetRegistredDeviceDetails(e) {
    console.log('----- onGetRegistredDeviceDetails');
    if (onGetRegistredDeviceDetailsSubscription) {
      onGetRegistredDeviceDetailsSubscription.remove();
      onGetRegistredDeviceDetailsSubscription = null;
    }
    devicesResponse = e;
    const res = JSON.parse(e.response);
    console.log(res);
    if (res.errCode === 0) {
      devicesList = res.pArgs.response.ResponseData;
      deviceHolderList = this.renderListViewData(devicesList.device);
      this.setState({
        dataSource: deviceHolderList,
      });
      this.setState({ deviceCount: devicesList.length });
    } else {
      console.log('Something went wrong');
    }
  }

  //callback of rdna updateDeviceDetails api.
  onUpdateDeviceDetails(e) {
    const res = JSON.parse(e.response);
    var logOff = this.state.logOffOnDelete;
    this.state.logOffOnDelete = false;
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        if(logOff === true)
          Events.trigger("logOff",null);
        else 
          this.getRegisteredDeviceDetails();
      } else {
        alert(res.pArgs.response.StatusMsg);
        // If error occurred reload devices list with previous response
        this.onGetRegistredDeviceDetails(devicesResponse);
      }
    } else {
      console.log('Something went wrong');
      // If error occurred reload devices list with previous response
      this.onGetRegistredDeviceDetails(devicesResponse);
    }
  }

  onEditPressed(rowData) {
    this.setState({
      inputDeviceName: rowData.device.devName,
      selectedDeviceIndex: rowData.index,
      open: true,
    });
  }

  isCurrentDevice(device) {
    if (device) {
      return this.state.currentDeviceId === device.devUUID
    } else
      return false;
  }

  onDeletePressed(deviceHolder) {
    console.log(deviceHolder);
    const device = deviceHolder.device;
    let status;
    var msg = 'Do you want to delete this device?';
    if (this.isCurrentDevice(device))
      msg = 'This is your current device. Your current session will be logged off by deleting this device. Do you want to proceed?';
    Alert.alert(
      '',
      msg,
      [
        { text: 'No', onPress: () => console.log("----- Cancel pressed") },
        { text: 'Yes', onPress: () => this.deleteDevice(deviceHolder) },
      ]
    );
  }

  onTextChange(text) {
    console.log('------------- changed text ${text}');
  }

  getDeviceStatus(device) {
    if (this.isDeviceDeleted(device)) {
      return Constants.DEVICE_QUEUED_DELETE;
    }
    return device.status;
  }

  deleteDevice(deviceHolder) {

    if (Main.isConnected) {
      const device = deviceHolder.device;
      this.toggleDeviceStatus(device);
      console.log('------- old ' + deviceHolderList[deviceHolder.index].device
        .status + ' new ' + device.status);
      obj.setState({
        dataSource: deviceHolderList,
      });
      
      if(this.isCurrentDevice(device))
        this.state.logOffOnDelete = true;
      this.updateDeviceDetails();
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

  isDeviceDeleted(device) {
    return device.status === Constants.DEVICE_DELETE;
  }
  //call rdna updateDeviceDetails api.
  updateDeviceDetails() {

    if (Main.isConnected) {
      console.log('----- DeviceMgmt.updateDeviceDetails');
      console.log('----- ----- devicesList: ' + JSON.stringify(devicesList));
      AsyncStorage.getItem('userId').then((value) => {
        ReactRdna.updateDeviceDetails(value, JSON.stringify(devicesList), (response) => {
          console.log('----- ----- AsyncStorage -> ReactRdna.updateDeviceDetails.response:');
          console.log(response);

          if (response[0].error !== 0) {
            console.log('----- ----- response is not 0');
            if (devicesResponse !== undefined) {
              console.log('----- ----- response is not 0');
              // If error occurred reload last response
              this.onGetRegistredDeviceDetails(devicesResponse);
            }
          }
        });
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

  renderListViewData(devices) {
    const data = [];
    let index = -1;
    devices.map((device) => {
      index++;
      data.push({
        device,
        index,
      });
    });
    return data;
  }

  toggleDeviceStatus(device) {
    const dev = device;
    if (this.isDeviceDeleted(device)) {
      dev.status = Constants.DEVICE_ACTIVE;
    } else {
      dev.status = Constants.DEVICE_DELETE;
    }
  }

  //onTextchange method for devicename TextInput
  onChangeDeviceName(event) {
    this.setState({ inputDeviceName: event.nativeEvent.text });
    console.log('device name ' + event.nativeEvent.text);
  }


  /**
   * Submits the new device details to the server
   * @return {[type]} [description]
   */
  onOkPressed() {
    this.setState({ open: false });
    console.log('----- DeviceMgmt.onOkPressed');
    console.log('----- ----- selectedDeviceIndex: ' + this.state.selectedDeviceIndex);

    const deviceHolder = deviceHolderList[this.state.selectedDeviceIndex];
    console.log("----- ----- deviceHolder: " + JSON.stringify(deviceHolder));

    if (deviceHolder.device.devName !== this.state.inputDeviceName) {
      deviceHolder.device.devName = this.state.inputDeviceName;
      deviceHolder.isDeviceUpdated = true;
      deviceHolder.device.status = Constants.DEVICE_UPDATE;

      console.log("----- ----- deviceHolderList: " + deviceHolderList[this.state.selectedDeviceIndex].device.devName);
      this.setState({
        dataSource: deviceHolderList,
      });
      console.log("----- ----- this.state.dataSource has been updated.");
      console.log(this.state.dataSource);
      this.updateDeviceDetails();
    }
  }

  renderHiddenRow(rowData, secId, rowId, rowMap) {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ () => {
          rowMap[`${secId}${rowId}`].closeRow();
          this.onEditPressed(rowData)
        } }>
										<Text style={styles.backTextWhite}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => {
          rowMap[`${secId}${rowId}`].closeRow();
          this.onDeletePressed(rowData)
        } }>
										<Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }
  /*
     This method is used to render the componenet with all its element.
   */
  renderRow(rowData, secId, rowId, rowMap) {
    const device = rowData.device;
    const devicename = device.devName;
    const status = this.getDeviceStatus(device);
    const createdTs = device.createdTs;
    const lastAccessedTs = device.lastAccessedTs;
    let deviceBinding;
    if (device.devBind === 0) {
      deviceBinding = 'Permanent';
    } else {
      deviceBinding = 'Temporary';
    }

    return (
      <View style={styles.rowFront}>
        <Text style={styles.itemTitle}>
          {devicename}
        </Text>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Status: </Text>
          <Text style={styles.rightLabels}>{status}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Created: </Text>
          <Text style={styles.rightLabels}>{Util.getFormatedDate(createdTs)}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Last Access: </Text>
          <Text style={styles.rightLabels}>{Util.getFormatedDate(lastAccessedTs)}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Binding: </Text>
          <Text style={styles.rightLabels}>{deviceBinding}</Text>
        </View>
      </View>
    );
  }

  /*
    render pagetitle
  */

  renderPageTitle(){
        return(<PageTitle title={'Connected Devices'}
        handler={this.goBack.bind(this)} isBadge={true}/>);
  }
  
  
  goBack(){
//    this.props.navigation.goBack();
    this.props.navigation.goBack();
    const ResetToDashboardScreen = NavigationActions.reset({
      
    index: 1,
    actions: [
      NavigationActions.navigate({routeName: 'DeviceMgmt'}),
      NavigationActions.navigate({routeName: 'DashBoard',params:{url: '',title:'DashBoard',navigator:this.props.navigation}})
      ]
      });
    this.props.navigation.dispatch(ResetToDashboardScreen)
    
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
            
        defaultNav = {isPageTitle?false:true}
        navBar={{
          title: 'Connected Devices',
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
        navigator={this.props.navigation}
        >

         { isPageTitle && this.renderPageTitle()}
        
        <View style={styles.listViewWrap}>
          <Text style={styles.msg}>Swipe to delete/edit devices</Text>
          <SwipeListView
            style={{ marginBottom: 1 }}
            dataSource={this.ds.cloneWithRows(this.state.dataSource) }
            renderRow={this.renderRow.bind(this) }
            renderHiddenRow = {this.renderHiddenRow.bind(this) }
            rightOpenValue={-150}
            disableRightSwipe={true}
            />
        </View>
        <Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.open}
          modalDidOpen={() => {
            //console.log('modal did open')
          } }
          modalDidClose={() => this.setState({ open: false }) }
          >
          <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
              Edit Device Name
            </Text>
          </View>
          <TextInput
            autoCorrect={false}
            ref={'devicename'}
            style={styles.modalInput}
            placeholder={'Enter Device Name'}
            value={this.state.inputDeviceName}
            placeholderTextColor={Skin.colors.HINT_COLOR}
            onChange={this.onChangeDeviceName.bind(this) }
            />
          <View style={styles.border}></View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight
              onPress={() => this.setState({ open: false }) }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}
              >
              <Text style={styles.modalButtonText}>
                CANCEL
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.onOkPressed.bind(this) }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}
              >
              <Text style={styles.modalButtonText}>
                SAVE
              </Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </Main>
    );
  }
}

module.exports = DeviceMgmtScene;
