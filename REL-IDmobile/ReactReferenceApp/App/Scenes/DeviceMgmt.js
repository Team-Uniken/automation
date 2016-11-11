'use strict';


import React, { Component } from 'react';
import ReactNative, { View, StyleSheet,
  Text,
  ListView,
  TextInput,
  //  Dimensions,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableHighlight,
  TouchableOpacity,
  Alert, } from 'react-native'

import Skin from '../Skin';
import Modal from 'react-native-simple-modal';

/*
  CALLED
*/
import Main from '../Components/Main';
import Constants from '../Components/Constants';
import { SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
let obj;
let onUpdateDevice;
let onGetDevice;
let devicesList;
let deviceHolderList;
let devicesResponse;
const FAKE_BOOK_DATA = [];
const styles = StyleSheet.create({
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    padding: 10,
    alignItems: 'flex-start',
    borderBottomColor: Skin.colors.DIVIDER_COLOR,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  rowBack: {
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
    };
  }

  /**
   * Attaches listeners for the "get Devices" event and the "updated Device" evemt.
   * These listeners are in global scope.
   * @return {null}
   */
  componentWillMount() {
    onGetDevice = DeviceEventEmitter.addListener(
      'onGetRegistredDeviceDetails',
      this.onGetRegistredDeviceDetails.bind(this)
    );
    onUpdateDevice = DeviceEventEmitter.addListener(
      'onUpdateDeviceDetails',
      this.onUpdateDeviceDetails.bind(this)
    );
  }

  componentDidMount() {
    this.getRegisteredDeviceDetails();
  }

  getRegisteredDeviceDetails() {
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.getRegisteredDeviceDetails(value, (response) => {
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
    }).done();
  }

  /**
   * Parses the Device list when received from the async event in ComponentWIllMount
   * @param  {object} e event response
   * @return {null}
   */
  onGetRegistredDeviceDetails(e) {
    console.log('----- onGetRegistredDeviceDetails');
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
      alert('Something went wrong');
    }
  }

  onUpdateDeviceDetails(e) {
    const res = JSON.parse(e.response);
    const statusCode = res.pArgs.response.StatusCode;
    if (res.errCode === 0) {
      if (statusCode === 100) {
        this.getRegisteredDeviceDetails();
      } else {
        alert(res.pArgs.response.StatusMsg);
        // If error occurred reload devices list with previous response
        this.onGetRegistredDeviceDetails(devicesResponse);
      }
    } else {
      alert('Something went wrong');
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


  onDeletePressed(deviceHolder) {
    console.log(deviceHolder);
    const device = deviceHolder.device;
    let status;
    if (this.state.deviceCount <= 1) {
      alert('You cannot delete the last permanent device for this account.');
    } else {
      if (this.isDeviceDeleted(device)) {
        status = Constants.DEVICE_ACTIVE;
      } else {
        status = Constants.DEVICE_DELETE;
      }
      Alert.alert(
        '',
        'Do you want to change status to ' + status + ' ?',
        [
          { text: 'Cancel', onPress: () => console.log("----- Cancel pressed") },
          { text: 'OK', onPress: () => this.deleteDevice(deviceHolder) },
        ]
      );
    }
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
    const device = deviceHolder.device;
    this.toggleDeviceStatus(device);
    console.log('------- old ' + deviceHolderList[deviceHolder.index].device
      .status + ' new ' + device.status);
    obj.setState({
      dataSource: deviceHolderList,
    });

    this.updateDeviceDetails();
  }

  isDeviceDeleted(device) {
    return device.status === Constants.DEVICE_DELETE;
  }

  updateDeviceDetails() {
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
          <Text style={styles.rightLabels}>{createdTs}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Last Access: </Text>
          <Text style={styles.rightLabels}>{lastAccessedTs}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.leftLabels}>Binding: </Text>
          <Text style={styles.rightLabels}>{deviceBinding}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'Connected Devices',
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
        <View style={styles.listViewWrap}>
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
