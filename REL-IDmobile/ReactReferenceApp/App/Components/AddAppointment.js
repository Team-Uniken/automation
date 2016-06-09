
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-simple-modal';
import PickerAndroid from 'react-native-picker-android';
var ToolBar = require('./ToolBar');
var Skin = require('../Skin');


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
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  PickerIOS,
  Dimensions,
  TouchableOpacity,
  StatusBar,
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


var message;




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

            <View style={Skin.customeStyle.maincontainer}>
            <StatusBar
                 backgroundColor={Skin.colors.STATUS_BAR_COLOR}
                 barStyle='light-content'/>
            <ToolBar navigator={this.props.navigator} title={this.props.title}/>
            <ScrollView >

            <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Date : </Text>
            <Text style={Skin.addappointment.edittextstyle}>{this.props.url.date}</Text>
            <Animated.View style={[Skin.addappointment.datestyle,{opacity:0}]}>
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

            <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Time : </Text>
            <Text style={Skin.addappointment.edittextstyle}>{this.props.url.time}</Text>
            <Animated.View style={[Skin.addappointment.datestyle,{opacity:0}]}>
            <DatePicker
            style={{width: 200}}
            date={this.state.time}
            mode="time"
            format="HH:mm"
            onDateChange={(time) => {this.setState({time: time})}}
            />

            </Animated.View>
            </View>
            <View style={Skin.addappointment.row}>
            <Text style={Skin.addappointment.textstyle}> Location : </Text>
            <TouchableOpacity onPress={() => this.open()}>
            <Text style={Skin.addappointment.edittextstyle}>{make.name}</Text>
            </TouchableOpacity>
            </View>


            <View style={Skin.addappointment.msgrow}>
            <Text style={Skin.addappointment.msgtextstyle}> Message : </Text>
            <View style={Skin.addappointment.border}>
            <TextInput
            returnKeyType={'next'}
            placeholder={'Enter Message'}
            placeholderTextColor={Skin.colors.HINT_COLOR}
            style={Skin.addappointment.input}
            multiline ={true}
            >
            </TextInput>
            </View>

            </View>


            <TouchableHighlight
              style={[Skin.customeStyle.roundcornerbutton]}
              underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
              activeOpacity={0.6}>
                <Text style={Skin.customeStyle.button}>{this.props.url.buttontext}</Text>
              </TouchableHighlight>



            </ScrollView >
            <Modal
            style={Skin.addappointment.branchstyle}
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
