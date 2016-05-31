
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-simple-modal';
import PickerAndroid from 'react-native-picker-android';
var ToolBar = require('./ToolBar');

var React = require('react-native');
var Dimensions = require('Dimensions');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

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

var {
  Alert,
  Component,
  AppRegistry,
  View,
  Text,
  Navigator,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  PickerIOS,
  Dimensions,
  TouchableOpacity,
} = React;

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;

let LOCATION = {
Branch1: {
name: 'Goa',
},
Branch2: {
name: 'Mumbai',
},
Branch3: {
name: 'Pune',
},
Branch4: {
name: 'Nagpur',
},
Branch5: {
name: 'Nashik',
},
Branch6: {
name: 'New Delhi',
},
Branch7: {
name: 'Surat',
},
};

const DropDown = require('react-native-dropdown');
const {
  Select,
  Option,
  OptionList,
} = DropDown;
var MENU_HVR_COLOR = 'rgba(13, 23, 38, 1.0)';

var message;

var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               alignItems: 'center',
                               backgroundColor: 'rgba(8,26,60,0.9)'
                               },

                               toolbarrow: {
                               flexDirection:'row',
                               backgroundColor: '#fff',
                               width:Dimensions.get('window').width,
                               },
                               row: {
                               backgroundColor:'#122941',
                               justifyContent: 'center',
                               alignItems: 'center',
                               flexDirection:'row',
                               marginTop: 16,
                               height:48,
                               },
                               msgrow: {
                               backgroundColor:'#122941',
                               justifyContent: 'center',
                               flexDirection:'row',
                               marginTop: 16,
                               height:172,
                               },

                               col: {
                               width:Dimensions.get('window').width,
                               marginTop: 16,
                               flexDirection:'column'
                               },
                               textstyle:{
                               color: TEXT_COLOR,
                               justifyContent: 'center',
                               alignItems: 'center',
                               fontSize: 16,
                               width:100,
                               },
                               msgtextstyle:{
                               color: TEXT_COLOR,
                               justifyContent: 'center',
                               alignItems: 'center',
                               fontSize: 16,
                               marginTop:16,
                               width:100,


                               },
                               edittextstyle:{
                               color: TEXT_COLOR,
                               justifyContent: 'center',
                               alignItems: 'center',
                               fontSize: 16,
                               width:Dimensions.get('window').width-100,

                               },
                               input:{
                               color: TEXT_COLOR,
                               height:140,
                               fontSize: 16,
                               marginTop:0,
                               marginRight:8,
                               width:Dimensions.get('window').width-132,
                               textAlignVertical: 'top',
                               backgroundColor:'#122941',
                               },
                               border:{
                               borderWidth: 1,
                               marginTop:8,
                               marginRight:16,
                               borderColor: '#fff',
                               },

                               dropdown:{
                               fontSize: 16,
                               marginRight:16,
                               width:Dimensions.get('window').width-116,
                               textAlignVertical: 'top',

                               },

                               button: {
                               fontFamily: 'Century Gothic',
                               backgroundColor: 'transparent',
                               height: 48,
                               fontSize: 16,
                               marginTop: 12,
                               color: MIDBLUE,
                               },
                               buttonWrap: {
                               height:48,
                               margin:8,
                               width:100,
                               marginTop:16,
                               marginBottom:16,
                               marginLeft:Dimensions.get('window').width/2-50,
                               backgroundColor: 'rgba(255,255,255,1)',
                               alignItems: 'center',
                               },
                               datestyle: {
                               position: 'absolute',
                               top: 12,
                               bottom: 0,
                               left: 100,
                               right: 0,
                               width: Dimensions.get('window').width,
                               height: Dimensions.get('window').height,
                               },
                               branchstyle: {
                               backgroundColor: '#fff',

                               position: 'absolute',
                               top: 0,
                               bottom: 0,
                               left: 0,
                               right: 0,
                               width: Dimensions.get('window').width,
                               height: Dimensions.get('window').height,
                               },

                               selecteditemstyle: {
                               color: '#f00',
                               fontSize: 20,
                               width:Dimensions.get('window').width-116,
                               },


                               });



class AddAppointment extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    open: false,
    SelectedBranch: 'Branch3',
    modelIndex: 3,
    };
  }
  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  state = {
  date:this.props.url.date,
  time: this.props.url.time,
  location:this.props.url.location,

  }
  componentDidMount() {

    message = this.props.url.msg
  }

  open(){

    this.setState({open: true})
  }
  render() {
    let make = LOCATION[this.state.SelectedBranch];

    return (

            <View style={styles.container}>
            <View style={styles.navbar}>
            <TouchableHighlight
            style={[styles.navButton,styles.navLeft]}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <View style={styles.navButtonText}>
            </View>
            </TouchableHighlight>
            
            <Text style={styles.navTitle}>{this.props.title}</Text>
            
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
            <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>

            <ScrollView >
            <View style={styles.row}>
            <Text style={styles.textstyle}> Date : </Text>
            <View
            style={styles.dropdown} >
            <Text style={styles.edittextstyle}>{this.state.date}</Text>
            </View>
            <Animated.View style={[styles.datestyle,{opacity:0}]}>
            <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            format="YYYY-MM-DD"
            minDate="2016-05-03"
            maxDate="2018-12-31"
            onDateChange={(date) => {this.setState({date: date})}}
            />

            </Animated.View>
            </View>

            <View style={styles.row}>
            <Text style={styles.textstyle}> Time : </Text>
            <Text style={styles.edittextstyle}>{this.state.time}</Text>
            <Animated.View style={[styles.datestyle,{opacity:0}]}>
            <DatePicker
            style={{width: 200}}
            date={this.state.time}
            mode="time"
            format="HH:mm"
            onDateChange={(time) => {this.setState({time: time})}}
            />

            </Animated.View>
            </View>
            <View style={styles.row}>
            <Text style={styles.textstyle}> Location : </Text>
            <View
            style={styles.dropdown} >
            <TouchableOpacity onPress={() => this.open()}>
            <Text style={styles.edittextstyle}>{make.name}</Text>
            </TouchableOpacity>
            </View>
            </View>


            <View style={styles.msgrow}>
            <Text style={styles.msgtextstyle}> Message : </Text>
            <View style={styles.border}>
            <TextInput
            returnKeyType={'next'}
            placeholder={'Enter Message'}
            placeholderTextColor={'#dbdbdb'}
            style={styles.input}
            multiline ={true}
            >
            </TextInput>
            </View>

            </View>


            <View style={{flexDirection:'row',}}>
            <TouchableHighlight
            style={styles.buttonWrap}
            underlayColor='#C7C7C7'
            activeOpacity={1}
            onPress={()=>{
            }}
            >
            <Text style={styles.button}>
            {this.props.url.buttontext}</Text>
            </TouchableHighlight>

            </View>


            </ScrollView >
            <Modal
            style={styles.branchstyle}
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({open: false})}
            style={{alignItems: 'center'}}>
            <Picker
            selectedValue={this.state.SelectedBranch}
            onValueChange={(SelectedBranch) => this.setState({SelectedBranch, modelIndex: 0})}>
            {Object.keys(LOCATION).map((index) => (
                                                   <PickerItem
                                                   key={index}
                                                   value={index}
                                                   label={LOCATION[index].name}
                                                   />
                                                   ))}
            </Picker>
            </Modal>
            </View>

            );
  }
};

module.exports = AddAppointment;
