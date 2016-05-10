
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-simple-modal';
import PickerAndroid from 'react-native-picker-android';

var React = require('react-native');

var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

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
  TouchableOpacity,
} = React;

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;

let LOCATION = {
Branch1: {
name: 'Branch1',
},
Branch2: {
name: 'Branch2',
},
Branch3: {
name: 'Branch3',
},
Branch4: {
name: 'Branch4',
},
Branch5: {
name: 'Branch5',
},
Branch6: {
name: 'Branc6',
},
Branch7: {
name: 'Branch7',
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
            <View style={styles.toolbarrow}>
            <Text
            style={{fontSize:22,color: '#2579a2',margin:12,fontWeight: 'bold', width:Dimensions.get('window').width-80,}}
            >{this.props.title}</Text>
            <TouchableHighlight
            onPress={()=>{
            
            this.props.navigator.pop();
            
            }}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <Text
            style={{textAlign: 'right',fontSize:24,color: '#2579a2',margin:12,}}
            >X</Text>
            </TouchableHighlight>
            </View>
            
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
            <Text style={styles.edittextstyle}>Select {make.name}</Text>
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
