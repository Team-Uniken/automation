'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';
import Constants from '../Components/Constants';
import Swipeout from 'react-native-swipeout';

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

const {
  StyleSheet,
  Component,
  Text,
  ListView,
  Dimensions,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableHighlight,
  View,
} = React;

let obj;
let onUpdateDevice;
let onGetDevice;
let devicseList;
/*
var TEXTCOLOR = '#A9A9A9';
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF';
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var MID_COL = '#2579A2';
var LIGHT_COL = '#50ADDC';
var DARK_COL = '#10253F';
var Spd = 0.1;
var LoadSpd = 0.2;
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var onGetDevice, onDeviceUp;

var devicesList;
var deviceHolderList;
var {
  DeviceEventEmitter,
} = require('react-native');

*/
const FAKE_BOOK_DATA = [{
  devUUID: '2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7',
  devName: 'test41_Android_Nexus 6_060916145904',
  status: 'Active',
  lastAccessedTs: '2016-06-09T15:02:22IST',
  createdTs: '2016-06-09T15:02:22IST',
  devBind: 0,
}, {
  devUUID: '2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7',
  devName: 'test41_Android_Nexus 6_060916145904',
  status: 'Active',
  lastAccessedTs: '2016-06-09T15:02:22IST',
  createdTs: '2016-06-09T15:02:22IST',
  devBind: 0,
}, {
  devUUID: '2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7',
  devName: 'test41_Android_Nexus 6_060916145904',
  status: 'Active',
  lastAccessedTs: '2016-06-09T15:02:22IST',
  createdTs: '2016-06-09T15:02:22IST',
  devBind: 0,
}, {
  devUUID: '2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7',
  devName: 'test41_Android_Nexus 6_060916145904',
  status: 'Active',
  lastAccessedTs: '2016-06-09T15:02:22IST',
  createdTs: '2016-06-09T15:02:22IST',
  devBind: 0,
}];

/*
FAKE_BOOK_DATA = [];
var {
  height,
  width,
} = Dimensions.get('window');
var deviceListViewHeight = height - 100;
var status;
*/

const styles = StyleSheet.create({
  listViewWrap: {
    flex:1,
    justifyContent: 'center',
    backgroundColor: Skin.colors.BACK_GRAY,
  },
  itemWrap:{
    padding:10,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  itemTitle:{
    color: Skin.colors.PRIMARY_TEXT,
    fontWeight: 'bold',
    flex:1,
    paddingBottom:5,
  },
  itemRow:{
    flex: 1,
    flexDirection: 'row',
  },
  leftLabels:{
    flex: 1,
    textAlign:'left',
    fontStyle: 'italic',
  },
  rightLabels:{
    flex: 2.3,
  }
});

class DeviceMgmtScene extends Component {
  constructor(props) {
    super(props);
    obj = this;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      username: '',
      status: 'created',
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


  /**
   * Inserts FAKE data for list
   * When running, asynchronously sets the data for devices that have been pulled for that userid
   * @return {null}
   */
  componentDidMount() {
    const deviceHolderList = this.renderListViewData(FAKE_BOOK_DATA);
    let newstate = this.state;
    newstate.dataSource = this.state.dataSource.cloneWithRows(deviceHolderList);
    this.setState(newstate);
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.getRegisteredDeviceDetails(value, (response) => {
        console.log('Get Device response: ')
        console.log(response);
      });
    }).done();
  }


  /**
   * Parses the Device list when received from the async event in ComponentWIllMount
   * @param  {object} e event response
   * @return {null}
   */
  onGetRegistredDeviceDetails(e) {
    const res = JSON.parse(e.response);
    if (res.errCode === 0) {
      const devicesList = res.pArgs.response.ResponseData;
      const deviceHolderList = this.renderListViewData(devicesList.device);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(deviceHolderList),
      });
    } else {
      alert('Something went wrong');
    }
  }

  onUpdateDeviceDetails(e) {
    const res = JSON.parse(e.response);
    const statusCode = res.pArgs.response.StatusCode;
    if (res.errCode === 0) {
      if (statusCode === 100) {
        this.props.navigator.pop();
      } else {
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      alert('Something went wrong');
    }
  }

  onDeviceNameChange(event) {
    const newstate = this.state;
    newstate.secQA = event.nativeEvent.text;
    this.setState(newstate);
  }

  onEditPressed(rowData) {
    const title = rowData.devName;
    alert("Edit button of " + title);
  }

  onDeletePressed(deviceHolder) {
    const device = deviceHolder.device;
    let status;
    if (this.isDeviceDeleted(device)) status = Constants.DEVICE_ACTIVE;
    else status = Constants.DEVICE_DELETE;
    // alert('Delete button of ' + title);
    alert('', 'Do you want to change status to ${status}?', [{
      text: 'Cancel',
      onPress: () => console.log('----- Cancel pressed'),
    }, {
      text: 'OK',
      onPress: () => this.deleteDevice(deviceHolder),
    }]);
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
    var device = deviceHolder.device;
    this.toggleDeviceStatus(device);
    // deviceHolderList.splice(deviceHolder.index, 1, {"device":device, "index":deviceHolder.index});
    console.log('------- old ' + deviceHolderList[deviceHolder.index].device
      .status + ' new ' + device.status);
    deviceHolderList = obj.renderDeviceHolderData(deviceHolderList);
    obj.setState({
      dataSource: this.state.dataSource.cloneWithRows(
        deviceHolderList),
    });
  }

  isDeviceDeleted(device) {
    return device.status == Constants.DEVICE_DELETE;
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
/*
  renderDeviceHolderData(devicesHolder) {
    var data = [];
    var index = -1;
    devicesHolder.map((deviceHolder) => {
      index++;
      data.push({
        'device': deviceHolder.device,
        'index': index
      });
    });
    return data;
  }
*/
  submitButtonClick() {
    // alert('button clicked');
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.updateDeviceDetails(
        value,
        JSON.stringify(devicesList),
        (response) => {
          console.log('----- submitButtonClick: ReactRdna.updateDeviceDetails.response')
          console.log(response);
        });
    }).done();
  }


  renderRow(rowData) {
    console.log('in renderRow');
    const device = rowData.device;
    console.log('------ renderBook');
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
        onPress: () => {console.log(device); this.onEditPressed(device)}
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        color: 'white',
        onPress: () => {console.log(device); this.onDeletePressed(device)}
      },
    ];
    return (
      <Swipeout
        right={swipeoutBtns}
        autoClose={true}
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
    console.log('in render');
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
      </Main>
    );
  }
}

module.exports = DeviceMgmtScene;