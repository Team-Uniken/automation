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
  Alert,Swipeout,} from 'react-native'

import Skin from '../Skin';
import Modal from 'react-native-simple-modal';

/*
  CALLED
*/
import Main from '../Components/Main';
import Constants from '../Components/Constants';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;





let obj;
let onUpdateDevice;
let onGetDevice;
let devicesList;
let deviceHolderList;
let devicesResponse;
const FAKE_BOOK_DATA = [];
const styles = StyleSheet.create({
  modalwrap: {
    height: 130,
    flexDirection: 'column',
    borderRadius: 15,
  },
  modalTitleWrap:{
    justifyContent: 'center',
    flex:1,
  },
  modalTitle:{
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
  modalInput:{
    textAlign: 'left',
    color: Skin.colors.PRIMARY_TEXT,
    height: 48,
    fontSize:16,
  },
  border:{
    height: 1,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
    marginBottom: 10,
  },
  DeviceListView: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    height: 48,
    width: 48,
    opacity: 0.6,
    justifyContent: "center",
    marginTop: 4,
  },
  images: {
    width: 18,
    height: 18,
    margin: 16,
  },
  customerow: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'transparent',
  },
  listViewWrap: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Skin.colors.BACK_GRAY,
    width: Skin.SCREEN_WIDTH,
    height: Skin.SCREEN_HEIGHT,
  },
  itemWrap: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
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
    this.state = {
      open: false,
      inputDeviceName: '',
      selectedDeviceIndex: -1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
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
    /*
    DeviceEventEmitter.addListener(
      'onGetRegistredDeviceDetails',
      this.onGetRegistredDeviceDetails.bind(this)
    );
    DeviceEventEmitter.addListener(
      'onUpdateDeviceDetails',
      this.onUpdateDeviceDetails.bind(this)
    );
    */
  }


  /**
   * Inserts FAKE data for list
   * When running, asynchronously sets the data for devices that have been pulled for that userid
   * @return {null}
   */
  componentDidMount() {
    //devicesList = FAKE_BOOK_DATA;
    //deviceHolderList = this.renderListViewData(FAKE_BOOK_DATA);
    //const newstate = this.state;
    //newstate.dataSource = this.state.dataSource.cloneWithRows(deviceHolderList);
    //this.setState(newstate);
    this.getRegisteredDeviceDetails();
  }

  getRegisteredDeviceDetails(){
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
        dataSource: this.state.dataSource.cloneWithRows(deviceHolderList),
      });
      this.setState({deviceCount: devicesList.length });
    } else {
      alert('Something went wrong');
    }
  }


  onUpdateDeviceDetails(e) {
    const res = JSON.parse(e.response);
    const statusCode = res.pArgs.response.StatusCode;
    if (res.errCode === 0) {
      if (statusCode === 100) {
        //this.props.navigator.pop();
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

/*
  onDeviceNameChange(event) {
    //this.setState({ secQA: event.nativeEvent.text });
  }
*/

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
          {text: 'Cancel', onPress: () => console.log("----- Cancel pressed") },
          {text: 'OK', onPress: () => this.deleteDevice(deviceHolder) },
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
    // deviceHolderList.splice(deviceHolder.index, 1, {"device":device, "index":deviceHolder.index});
    console.log('------- old ' + deviceHolderList[deviceHolder.index].device
      .status + ' new ' + device.status);
    deviceHolderList = obj.renderDeviceHolderData(deviceHolderList);
    obj.setState({
      dataSource: this.state.dataSource.cloneWithRows(
        deviceHolderList),
    });

    this.updateDeviceDetails();
  }

  isDeviceDeleted(device) {
    return device.status === Constants.DEVICE_DELETE;
  }


  updateDeviceDetails(){
    console.log('----- DeviceMgmt.updateDeviceDetails');
    console.log('----- ----- devicesList: '+JSON.stringify(devicesList));
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
      return null;
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


  onChangeDeviceName(event){
    this.setState({inputDeviceName: event.nativeEvent.text});
    console.log('device name '+event.nativeEvent.text);
  }


  /**
   * Submits the new device details to the server
   * @return {[type]} [description]
   */
  onOkPressed(){
    this.setState({open: false});
    console.log('----- DeviceMgmt.onOkPressed');
    console.log('----- ----- selectedDeviceIndex: ' + this.state.selectedDeviceIndex);

    const deviceHolder = deviceHolderList[this.state.selectedDeviceIndex];
    console.log("----- ----- deviceHolder: " + JSON.stringify(deviceHolder));

    if (deviceHolder.device.devName !== this.state.inputDeviceName) {
      deviceHolder.device.devName = this.state.inputDeviceName;
      deviceHolder.isDeviceUpdated = true;
      deviceHolder.device.status = Constants.DEVICE_UPDATE;

      console.log("----- ----- deviceHolderList: " + deviceHolderList[this.state.selectedDeviceIndex].device.devName);
      deviceHolderList = obj.renderDeviceHolderData(deviceHolderList);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(deviceHolderList),
      });
      console.log("----- ----- this.state.dataSource has been updated.");
      console.log(this.state.dataSource);
      this.updateDeviceDetails();
    }

  }

  renderDeviceHolderData(devicesHolder) {
    // var data = [];
    // var index = -1;
    // devicesHolder.map((deviceHolder) => {
    //   index++;
    //   data.push({
    //     'device': deviceHolder.device,
    //     'index': index
    //   });
    // });
    return devicesHolder;
  }


  renderRow(rowData) {
    // console.log('in renderRow');
    const device = rowData.device;
    // console.log('------ renderBook');
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
    let swipeoutBtns = [
      {
        text: 'Edit',
        color: 'white',
        onPress: () => {
          // console.log(device);
          this.onEditPressed(rowData);
        },
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        color: 'white',
        onPress: () => {
          // console.log(device);
          this.onDeletePressed(rowData);
        },
      },
    ];
    return (
      <Swipeout
        right={swipeoutBtns}
        autoClose
        style={styles.swipeout}
      >
        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>
            {devicename}
          </Text>
          <View style={styles.itemRow}>
            <Text style={styles.leftLabels}>Status:</Text>
            <Text style={styles.rightLabels}>{status}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.leftLabels}>Created:</Text>
            <Text style={styles.rightLabels}>{createdTs}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.leftLabels}>Last Access:</Text>
            <Text style={styles.rightLabels}>{lastAccessedTs}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.leftLabels}>Binding:</Text>
            <Text style={styles.rightLabels}>{deviceBinding}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: Skin.colors.DIVIDER_COLOR }}/>
      </Swipeout>
    );
  }

  renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
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
          title: 'Connected Devices',
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
        <View style={styles.listViewWrap}>
          <ListView style={styles.listView}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
          />
        </View>
        <Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.open}
          modalDidOpen={() => {
            //console.log('modal did open')
          }}
          modalDidClose={() => this.setState({open: false})}
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
            onChange={this.onChangeDeviceName.bind(this)}
          />
          <View style={styles.border}></View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight
              onPress={() => this.setState({open: false})}
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                CANCEL
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.onOkPressed.bind(this)}
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


/*
          <Modal
            style={Skin.ConnectionProfile.branchstyle}
            overlayOpacity={0.75}
            offset={100}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({open: false})}
          >
          <Text style={[Skin.customeStyle.text3,{textAlign:'left',marginTop:0,marginLeft:4}]}>Edit Device Name </Text>
            <TextInput
              autoCorrect={false}
              placeholder={'Enter device name'}
              value={this.state.inputDeviceName}
              onChange={this.onChangeDeviceName.bind(this)}
              style={{height:40,textAlignVertical:'top'}}
            />
            <View style={Skin.ConnectionProfile.customerow}>
              <TouchableHighlight
                onPress={() => this.setState({open: false})}
                underlayColor={Skin.colors.REPPLE_COLOR}
                style={{height:48,width:70,marginLeft:100}}
              >
                <Text style={[Skin.customeStyle.text1,{width:70,opacity:1}]}>CANCEL</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.onOkPressed.bind(this)}
                underlayColor={Skin.colors.REPPLE_COLOR}
                style={{height:48,width:70}}
              >
                <Text style={[Skin.customeStyle.text1,{width:70,color:'#007ECE',opacity:1}]}>OK</Text>
              </TouchableHighlight>
            </View>
        </Modal>

        */
