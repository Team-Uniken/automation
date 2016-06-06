var React = require('react-native');

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

  AsyncStorage,

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

var {DeviceEventEmitter} = require('react-native');

var FAKE_BOOK_DATA = [

                      ];



 var {height, width} = Dimensions.get('window');

var deviceListViewHeight = height-100;

var status;

var styles = StyleSheet.create({

                               container: {

                               flex: 1,

                               flexDirection: 'row',

                               marginRight:16,

                               },

                               bar:{

                               backgroundColor: MID_COL,

                               width: 20,

                               height:3,

                               marginTop:3,

                               },

                               navbar:{

                               backgroundColor: '#ffffff',

                               height: 65,

                               flexDirection: 'row',

                               padding: 10,

                               paddingTop:30

                               },

                               navTitle:{

                               flex:2,

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

                               height: Dimensions.get('window').height-150,

                               justifyContent: 'center',

                               backgroundColor: 'rgba(8,26,60,0.9)'

                               

                               },

                               buttonTextStyle: {

                               fontFamily: 'Century Gothic',

                               backgroundColor:'transparent',

                               flex:1,

                               fontSize: 16,

                               margin:1,

                               textAlign:'center',

                               textAlignVertical:'center',

                               color: '#FFF',

                               marginTop:16,

                               },

                               roundcorner: {

                               height: 50,

                               width: 280,

                               marginTop:16,

                               marginBottom:16,

                               marginLeft:Dimensions.get('window').width/2-140,

                               borderWidth: 1,

                               borderColor: "#fff",

                               backgroundColor: 'rgba(255,255,255,0.1)',

                               borderRadius:30,

                               },

                               container1: {

                               flex: 1,

                               flexDirection: 'row',

                               paddingTop:1,

                               paddingLeft:10

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

                               marginLeft:16,

                               marginRight:16,

                               color: "#555555"

                               },

                               button: {

                               height: 48,

                               width: 48,

                               opacity:0.4,

                               justifyContent: "center"

                               },



                               leftLabels:{textAlign: 'left',

                                            fontSize:16,

                                            color: TEXTCOLOR,

                                            width:160,

                                            margin:4,

                               },


                               rightLabels:{textAlign: 'left',

                                             fontSize:16,

                                             color: TEXTCOLOR,

                                             margin:4,

                               },

                               images: {

                                 width: 18,

                                 height: 18,

                                 margin:16,


                               },

                               customerow:

                               {

                               },

                               separator:

                               {

                                 height:2,

                                 margin:8,

                                 backgroundColor:TEXTCOLOR,

                               },

                               input: {

                                 fontFamily: 'Century Gothic',

                                 backgroundColor: 'rgba(255,255,255,0.1)',

                                 width:Dimensions.get('window').width-154,

                                 marginLeft:16,

                                 marginRight:8,

                                 height: 56,

                                 fontSize:16,

                                 color: 'rgba(255,255,255,1)',

                               },

                               listView:{margin:8,}

                               });



class Device extends Component {


  constructor(props) {

    super(props);
    obj = this;

    this.state = {

    dataSource: new ListView.DataSource({

                                        rowHasChanged: (row1, row2) => row1.guid !== row2.guid

                                        }),

      username: "",

    };

  }


  componentDidMount() {

   // alert(height);

    status = 'created';

    var books = FAKE_BOOK_DATA;

    this.setState({

                  dataSource: this.state.dataSource.cloneWithRows(books)

                  });

    AsyncStorage.getItem("userId").then((value) => {

        ReactRdna.getRegisteredDeviceDetails(value, (response) => { });

    }).done();

    

  }

  componentWillMount(){
    onGetDevice = DeviceEventEmitter.addListener('onGetRegistredDeviceDetails', this.onGetRegistredDeviceDetails.bind(this));
    onGetDevice = DeviceEventEmitter.addListener('onUpdateDeviceDetails', this.onUpdateDeviceDetails.bind(this));
  }

  onGetRegistredDeviceDetails(e){
    var res = JSON.parse(e.response);
    var statusCode= res.pArgs.response.StatusCode
    if(res.errCode == 0){
      //if (statusCode==100) {
        devicesList = res.pArgs.response.ResponseData;
        this.setState({

                  dataSource: this.state.dataSource.cloneWithRows(devicesList.device)

                  });
      //}else{
      //  alert(res.pArgs.response.StatusMsg);
      //}
    } else{
      alert("Something went wrong");
    }
  }

  onUpdateDeviceDetails(e){
    var res = JSON.parse(e.response);
    var statusCode= res.pArgs.response.StatusCode
    if(res.errCode == 0){
      if (statusCode==100) {
      } else{
        alert(res.pArgs.response.StatusMsg);
      }
    } else{
      alert("Something went wrong");
    }
  }

  submitButtonClick(){

    alert('button clicked');

  }

  render() {

    return (

      <View style={styles.maincontainer}>

            

            <View style={styles.navbar}>

            <TouchableHighlight

            style={[styles.navButton,styles.navLeft]}

            underlayColor={'#FFFFFF'}

            activeOpacity={0.6}

            >

            <View style={styles.navButtonText}>

            </View>

            </TouchableHighlight>

            

            <Text style={styles.navTitle}>Device</Text>

            

            <TouchableHighlight

            style={[styles.navButton,styles.navRight]}

            onPress={()=>{

            this.props.navigator.pop();

            }}

            underlayColor={'#FFFFFF'}

            activeOpacity={0.6}

            >

            <Text

            style={[styles.navButtonText,{textAlign: 'right',fontSize:22}]}

            >X</Text>

            </TouchableHighlight>

            </View>

            

            

             <View style={styles.DeviceListView}>

                  <ListView

                  dataSource={this.state.dataSource}

                  renderRow={this.renderBook.bind(this)}


                  />

            </View>

            <TouchableHighlight

            style={styles.roundcorner}

            onPress={this.submitButtonClick.bind(this)}

            underlayColor={'#082340'}

            activeOpacity={0.6}

            >

             <Text style={styles.buttonTextStyle}>Submit</Text>

            </TouchableHighlight>

      </View>


            );

  }

  onDeviceNameChange(event){
    this.setState({secQA: event.nativeEvent.text});
  }


  renderBook(book) {

console.log("------ renderBook");
    var devicename = book.devName;
    var status = book.status;
    var createdTs = book.createdTs;
    var lastAccessedTs = book.lastAccessedTs;
    var deviceBinding;
    if(book.devBind == 0)
      deviceBinding = "Permanent";
    else
      deviceBinding = "Temporary";

    return (

      <View style={styles.customerow}>


            <View style={styles.container}>

                <TextInput

                  placeholder="Device Name"

                  placeholderTextColor={'rgba(255,255,255,0.5)'}

                  style={styles.input}

                  onChangeText={(text) => book.devName = text }

                  value={devicename}

                 />

            <TouchableHighlight onPress={() => this.onEditPressed(book) } style={styles.button}>

              <Image source={require('image!edit')} style={styles.images} />

            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.onDeletePressed(book) } style={styles.button}>

              <Image source={require('image!delete')} style={styles.images} />

            </TouchableHighlight>

            </View>


            <View style={styles.container1}>

            <Text

            style={styles.leftLabels}

            >Status:</Text>

            <Text

            style={styles.rightLabels}
            >{status}</Text>

            </View>


            <View style={styles.container1}>

            <Text

            style={styles.leftLabels}

            >Created On:</Text>

            <Text

            style={styles.rightLabels}
            >{createdTs}</Text>

            </View>


            <View style={styles.container1}>

            <Text

            style={styles.leftLabels}

            >Last Login On:</Text>

            <Text

            style={styles.rightLabels}
            >{lastAccessedTs}</Text>

            </View>


            <View style={styles.container1}>

            <Text

            style={styles.leftLabels}

            >Last Login Status:</Text>

            <Text

            style={styles.rightLabels}

            >Success</Text>

            </View>


            <View style={styles.container1}>

            <Text

            style={styles.leftLabels}

            >Device Binding:</Text>

            <Text

            style={styles.rightLabels}>{deviceBinding}</Text>

            </View>

            <View style={styles.separator}/>

            </View>

            );

  }


  onEditPressed(book) {

    var title = book.volumeInfo.title;

    alert('Edit button of '+title);

  }


  onDeletePressed(book) {

    var title = book.volumeInfo.title;

    alert('Delete button of '+title);

  }

}

module.exports = Device;

