var React = require('react-native');
var constant = require('./Constants');
import Modal from 'react-native-simple-modal';
import TextField from 'react-native-md-textinput';
var Skin = require('../Skin');
var ToolBar = require('./ToolBar');

var {
    Image,
    StyleSheet,
    Text,
    View,
    Component,
    ListView,
    AppRegistry,
    TextInput,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    StatusBar,
} = React;


var ToolBar = require('./ToolBar');
var TEXTCOLOR = '#A9A9A9';
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
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
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var onGetDevice, onDeviceUp;
var obj;
var devicesList;
var deviceHolderList;

var {
    DeviceEventEmitter
} = require('react-native');

var FAKE_BOOK_DATA = [
          {
            "devUUID": "2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7",
            "devName": "test41_Android_Nexus 6_060916145904",
            "status": "Active",
            "lastAccessedTs": "2016-06-09T15:02:22IST",
            "createdTs": "2016-06-09T15:02:22IST",
            "devBind": 0
          },
          {
            "devUUID": "2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7",
            "devName": "test41_Android_Nexus 6_060916145904",
            "status": "Active",
            "lastAccessedTs": "2016-06-09T15:02:22IST",
            "createdTs": "2016-06-09T15:02:22IST",
            "devBind": 0
          },
          {
            "devUUID": "2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7",
            "devName": "test41_Android_Nexus 6_060916145904",
            "status": "Active",
            "lastAccessedTs": "2016-06-09T15:02:22IST",
            "createdTs": "2016-06-09T15:02:22IST",
            "devBind": 0
          },
          {
            "devUUID": "2WKVOLK4GH0Z5KI9JN3MZXO1IMVQNRB1H9V5FFMRSS8ONZTJB7",
            "devName": "test41_Android_Nexus 6_060916145904",
            "status": "Active",
            "lastAccessedTs": "2016-06-09T15:02:22IST",
            "createdTs": "2016-06-09T15:02:22IST",
            "devBind": 0
          }];

var {
    height,
    width
} = Dimensions.get('window');
var deviceListViewHeight = height - 100;
var status;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 16,
    },

    bar: {
        backgroundColor: MID_COL,
        width: 20,
        height: 3,
        marginTop: 3,
    },

    navbar: {
        backgroundColor: '#ffffff',
        height: 65,
        flexDirection: 'row',
        padding: 10,
        paddingTop: 30
    },

    navTitle: {
        flex: 2,
        fontFamily: CORE_FONT,
        textAlign: 'center',
        // color: MID_COL,
        fontSize: 20,
    },

    maincontainer: {
        flex: 1,
        backgroundColor: 'rgba(8,26,60,0.9)'
    },

    DeviceListView: {
        height: Dimensions.get('window').height - 150,
        justifyContent: 'center',
        backgroundColor: 'rgba(8,26,60,0.9)'
    },

    buttonTextStyle: {
        fontFamily: 'Century Gothic',
        backgroundColor: 'transparent',
        flex: 1,
        fontSize: 16,

        margin: 1,

        textAlign: 'center',

        textAlignVertical: 'center',

        color: '#FFF',

        marginTop: 16,

    },

    roundcorner: {

        height: 50,

        width: 280,

        marginTop: 16,

        marginBottom: 16,

        marginLeft: Dimensions.get('window').width / 2 - 140,

        borderWidth: 1,

        borderColor: "#fff",

        backgroundColor: 'rgba(255,255,255,0.1)',

        borderRadius: 30,

    },

    container1: {

        flex: 1,

        flexDirection: 'row',

        paddingTop: 1,

        paddingLeft: 10

    },

    thumbnail: {

        width: 53,

        height: 81,

        marginRight: 10

    },


    formInput: {

        height: 48,

        flex: 1,

        fontSize: 16,

        marginLeft: 16,

        marginRight: 16,

        color: "#555555"

    },

    button: {

        height: 48,

        width: 48,

        opacity: 0.4,

        justifyContent: "center"

    },



    leftLabels: {
        textAlign: 'left',

        fontSize: 16,

        color: TEXTCOLOR,

        width: 160,

        margin: 4,

    },


    rightLabels: {
        textAlign: 'left',

        fontSize: 16,

        color: TEXTCOLOR,

        margin: 4,

    },

    images: {

        width: 18,

        height: 18,

        margin: 16,


    },

    customerow:

    {

    },

    separator:

    {

        height: 2,

        margin: 8,

        backgroundColor: TEXTCOLOR,

    },

    input: {

        fontFamily: 'Century Gothic',

        backgroundColor: 'rgba(255,255,255,0.1)',

        width: Dimensions.get('window').width - 154,

        marginLeft: 16,

        marginRight: 8,

        textAlign:'center',
        textAlignVertical:'center',

justifyContent:'center',
        height: 56,

        fontSize: 20,

        color: 'rgba(255,255,255,1)',

    },

    listView: {
        margin: 8,
    }

});



class Device extends Component {


    constructor(props) {

        super(props);
        obj = this;

        this.state = {
          open: false,

            dataSource: new ListView.DataSource({

                rowHasChanged: (r1, r2) => r1 !== r2

            }),

            username: "",

        };

    }


    componentDidMount() {

        // alert(height);

        status = 'created';

        deviceHolderList = this.renderListViewData(FAKE_BOOK_DATA);

        this.setState({

            dataSource: this.state.dataSource.cloneWithRows(deviceHolderList)

        });

        // AsyncStorage.getItem("userId").then((value) => {
        //
        //     ReactRdna.getRegisteredDeviceDetails(value, (response) => {});
        //
        // }).done();



    }

    componentWillMount() {
        onGetDevice = DeviceEventEmitter.addListener('onGetRegistredDeviceDetails', this.onGetRegistredDeviceDetails.bind(this));
        onGetDevice = DeviceEventEmitter.addListener('onUpdateDeviceDetails', this.onUpdateDeviceDetails.bind(this));
    }

    onGetRegistredDeviceDetails(e) {
        var res = JSON.parse(e.response);
        var statusCode = res.pArgs.response.StatusCode
        if (res.errCode == 0) {
            //if (statusCode==100) {
            devicesList = res.pArgs.response.ResponseData;
            deviceHolderList = this.renderListViewData(devicesList.device);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(deviceHolderList)
            });
            //}else{
            //  alert(res.pArgs.response.StatusMsg);
            //}
        } else {
            alert("Something went wrong");
        }
    }

    onUpdateDeviceDetails(e) {
        var res = JSON.parse(e.response);
        var statusCode = res.pArgs.response.StatusCode
        if (res.errCode == 0) {
            if (statusCode == 100) {
              this.props.navigator.pop();
            } else {
                alert(res.pArgs.response.StatusMsg);
            }
        } else {
            alert("Something went wrong");
        }
    }

    renderListViewData(devices) {
      var data = [];
      var sectionIds = [];
      var index = -1;

      devices.map((device) => {
        index++;
        data.push({"device":device, "index":index});
      });

      return data;
    }

    renderDeviceHolderData(devicesHolder) {
      var data = [];
      var index = -1;

      devicesHolder.map((deviceHolder) => {
        index++;
        data.push({"device":deviceHolder.device, "index":index});
      });

      return data;
    }

    submitButtonClick() {

        //alert('button clicked');

        AsyncStorage.getItem("userId").then((value) => {
            ReactRdna.updateDeviceDetails(value, JSON.stringify(devicesList), (response) => {});
        }).done()

    }

    render() {

        return (


            <
            View style = {
                styles.maincontainer
            } >

            <StatusBar
            backgroundColor={Skin.colors.STATUS_BAR_COLOR}
            barStyle='light-content'/>
            <ToolBar navigator={this.props.navigator} title="Device"/>



            <
            View style = {
                styles.DeviceListView
            } >

            <
            ListView

            dataSource = {
                this.state.dataSource
            }

            renderRow = {
                this.renderBook.bind(this)
            }


            />

            <
            /View>

            <
            TouchableHighlight

            style = {
                styles.roundcorner
            }

            onPress = {
                this.submitButtonClick.bind(this)
            }

            underlayColor = {
                '#082340'
            }

            activeOpacity = {
                0.6
            }

            >

            <
            Text style = {
                styles.buttonTextStyle
            } > Submit < /Text>

            <
            /TouchableHighlight>
            <Modal
            style={Skin.ConnectionProfile.branchstyle}
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({open: false})}
            >
              <Text style={[Skin.customeStyle.text3,{textAlign:'left',marginTop:0,marginLeft:4}]}>Device</Text>
              <TextField
              autoCorrect={false}
                label={'Enter device name'}
                labelColor={Skin.colors.HINT_COLOR}
                highlightColor={'transparent'}
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
            onPress={() => this.setState({open: false})}
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={{height:48,width:70}}>
            <Text style={[Skin.customeStyle.text1,{width:70,color:'#007ECE',opacity:1}]}>OK</Text>
            </TouchableHighlight>
            </View>
            </Modal>
            <
            /View>


        );

    }

    onDeviceNameChange(event) {
        this.setState({
            secQA: event.nativeEvent.text
        });
    }

    getDeviceStatus(device){
      if(this.isDeviceDeleted(device))
          return constant.DEVICE_QUEUED_DELETE
        else
          return device.status;
    }

    toggleDeviceStatus(device){
      if(this.isDeviceDeleted(device))
        device.status = constant.DEVICE_ACTIVE;
      else
        device.status = constant.DEVICE_DELETE;
    }

    isDeviceDeleted(device){
      return device.status == constant.DEVICE_DELETE;
    }

    renderBook(deviceHolder) {
        var device = deviceHolder.device;
        console.log("------ renderBook");
        var devicename = device.devName;
        var status = this.getDeviceStatus(device);
        var createdTs = device.createdTs;
        var lastAccessedTs = device.lastAccessedTs;
        var deviceBinding;
        if (device.devBind == 0)
            deviceBinding = "Permanent";
        else
            deviceBinding = "Temporary";

        return (

            <
            View style = {
                styles.customerow
            } >


            <
            View style = {
                styles.container
            } >

            <Text style = {
                styles.input}>{devicename}</Text>

            <
            TouchableHighlight onPress = {
                () => this.onEditPressed(deviceHolder)
            }
            style = {
                styles.button
            } >

            <
            Image source = {
                require('image!edit')
            }
            style = {
                styles.images
            }
            />

            <
            /TouchableHighlight>

            <
            TouchableHighlight onPress = {
                () => this.onDeletePressed(deviceHolder)
            }
            style = {
                styles.button
            } >

            <
            Image source = {
                require('image!delete')
            }
            style = {
                styles.images
            }
            />

            <
            /TouchableHighlight>

            <
            /View>


            <
            View style = {
                styles.container1
            } >

            <
            Text

            style = {
                styles.leftLabels
            }

            >
            Status: < /Text>

            <
            Text

            style = {
                styles.rightLabels
            } > {
                status
            } < /Text>

            <
            /View>


            <
            View style = {
                styles.container1
            } >

            <
            Text

            style = {
                styles.leftLabels
            }

            >
            Created On: < /Text>

            <
            Text

            style = {
                styles.rightLabels
            } > {
                createdTs
            } < /Text>

            <
            /View>


            <
            View style = {
                styles.container1
            } >

            <
            Text

            style = {
                styles.leftLabels
            }

            >
            Last Login On: < /Text>

            <
            Text

            style = {
                styles.rightLabels
            } > {
                lastAccessedTs
            } < /Text>

            <
            /View>


            <
            View style = {
                styles.container1
            } >

            <
            Text

            style = {
                styles.leftLabels
            }

            >
            Last Login Status: < /Text>

            <
            Text

            style = {
                styles.rightLabels
            }

            >
            Success < /Text>

            <
            /View>


            <
            View style = {
                styles.container1
            } >

            <
            Text

            style = {
                styles.leftLabels
            }

            >
            Device Binding: < /Text>

            <
            Text

            style = {
                styles.rightLabels
            } > {
                deviceBinding
            } < /Text>

            <
            /View>

            <
            View style = {
                styles.separator
            }
            />

            <
            /View>

        );

    }


    onEditPressed(device) {

        var title = device.devName;
        this.setState({open: true})
        // alert('Edit button of ' + title);

    }


    onDeletePressed(deviceHolder) {

        var device = deviceHolder.device;

        var title = device.devName;
        var status;
         if(this.isDeviceDeleted(device))
          status = constant.DEVICE_ACTIVE;
         else
          status = constant.DEVICE_DELETE;

        //alert('Delete button of ' + title);

        Alert.alert(
                '',
                'Do you want to change status to '+ status + ' ?',
                [
                 {text: 'Cancel', onPress: () => console.log("----- Cancel pressed") },
                 {text: 'OK', onPress: () => this.deleteDevice(deviceHolder) },
                 ]
                )

    }

    onTextChange(text){
      console.log('------------- changed text ' + text);
    }

    deleteDevice(deviceHolder){
      var device = deviceHolder.device;
      this.toggleDeviceStatus(device);
      //deviceHolderList.splice(deviceHolder.index, 1, {"device":device, "index":deviceHolder.index});
      console.log("------- old " + deviceHolderList[deviceHolder.index].device.status + " new " + device.status);
      deviceHolderList = obj.renderDeviceHolderData(deviceHolderList);
      obj.setState({
                dataSource: this.state.dataSource.cloneWithRows(deviceHolderList)
            });
    }

}


module.exports = Device;
