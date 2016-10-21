
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from './title';
import Button from './button';
import hash from 'hash.js';
import Input from './input';

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Slider,
  ScrollView,
  InteractionManager,
  Alert,
  AsyncStorage,
} = ReactNative;
const{Component} =  React;

var styles = StyleSheet.create({
  
slidetext:{
width: Skin.SCREEN_WIDTH,
textAlign: 'center',
color:'#000',
fontSize:16,
  },
slider:{
width: Skin.VIEW_WIDTH,
  },
labelStyle: {
flex: 1
  },
checkboxStyle: {
width: 24,
height: 24,
borderWidth: 2,
borderColor: '#f00',
borderRadius: 5,
  
  }
  });




class Register extends Component {
  
  constructor(props){
    super(props);
    this.state = {
    check:'',
    firstName:'',
    lastName:'',
    email:'',
    confirmEmail:'',
    phoneNumber:'',
      
      
    };
  }
  
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //this.refs.firstName.focus();
      });
  }
  
  
  selectCheckbox() {
    if(this.state.check.length==0){
      this.setState({ check:'\u2714'});
    }else{
      this.setState({ check:''});
    }
  }
  
  
  onFirstNameChange(event) {
    this.setState({ firstName: event.nativeEvent.text });
  }
  
  onLastNameChange(event) {
    this.setState({ lastName: event.nativeEvent.text });
  }
  
  onEmailChange(event) {
    this.setState({ email: event.nativeEvent.text });
  }
  
  onConfirmEmailChange(event) {
    this.setState({ confirmEmail: event.nativeEvent.text });
  }
  
  onPhoneNumberChange(event) {
    this.setState({ phoneNumber: event.nativeEvent.text });
  }
  
  validateAndProcced(){
    
    if(this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.lastName.length > 0
      && this.state.confirmEmail.length > 0  && this.state.phoneNumber.length > 0){
        
      }else{
        this.showMessage("Error","All feilds are mandatory",false);
        return;
      }
    
    if(this.state.check.length > 0){
      this.registerUser();
    }else{
      this.showMessage("Error","Accept Term and Condition",false);
    }
    
  }
  
  
  registerUser(){
    
    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      currentProfile = JSON.parse(currentProfile);
      //var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";
      
      var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/addNewUser.htm";
      
      //                                                             USER_ID_STR, mandatory = true					// will be email Id
      //                                                             GROUP_NAME_STR, mandatory = true				// Hardcode
      //                                                             SECONDARY_GROUP_NAMES_STR, mandatory = false
      //                                                             EMAIL_ID_STR, mandatory = false					// sholud be there
      //                                                             MOB_NUM_ID_STR, mandatory = false				// sholud be there
      //                                                             IS_RELIDZERO_ENABLED, mandatory = true			// hardcode
      var userMap = {"userId":this.state.firstName+this.state.lastName,
      "groupName":"core-dev",
      "emailId":this.state.email,
      "mobNum":this.state.phoneNumber,
      "isRELIDZeroEnabled":"true",
      "username":"gmuser",
      "password":hash.sha256().update("uniken123$").digest('hex'),
      
      };
      RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
        console.log(response);
        if(response[0].error==0){
        var res = JSON.parse(response[0].response);
        if(res.isError === 'false'){
        showMessage("Activation Code Sent to","\nPlease check the email for more instruction.",true);
        
        }else{
        alert(res.errorMessage);
        }
        }else{
        alert('Error');
        }
        
        })
      
      }).done();
    
    
  }
  
  showMessage(title,msg,press){
    Alert.alert(
      title,
      msg, [
        {
      text: 'OK',
        //                               onPress: () => this.props.navigator.push({
        //                                                                        id: "ConnectionProfile"
        //                                                                        })
        if(press){
        this.props.navigator.pop();
        }
        },
        ]
      )
  }
  
  
  render() {
    return (
      <View style={Skin.nwd.container}>
      <Title
      tital="Registration"></Title>
      <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      >
      <View style={Skin.nwd.scrollcontainer}>
      <View >
      <Input
      placeholder={'First Name'}
      ref={'firstName'}
      keyboardType={'default'}
      onChange={this.onLastNameChange.bind(this)}
      onSubmitEditing={() => { this.refs.email.focus(); }}
      marginBottom={8}
      />
      
      <Input
      placeholder={'Last Name'}
      ref={'lastName'}
      keyboardType={'default'}
      onChange={this.onLastNameChange.bind(this)}
      onSubmitEditing={() => { this.refs.email.focus(); }}
      marginBottom={8}
      />
      
      <Input
      placeholder={'Email'}
      ref={'email'}
      keyboardType={'email-address'}
      onChange={this.onEmailChange.bind(this)}
      onSubmitEditing={() => { this.refs.confirmEmail.focus(); }}
      marginBottom={8}
      />
      <Input
      placeholder={'Confirm Email'}
      ref={'confirmEmail'}
      keyboardType={'email-address'}
      onChange={this.onConfirmEmailChange.bind(this)}
      onSubmitEditing={() => { this.refs.phoneNumber.focus(); }}
      marginBottom={8}
      />
      
      <Input
      placeholder={'Phone Number'}
      ref={'phoneNumber'}
      keyboardType={'numeric'}
      onChange={this.onPhoneNumberChange.bind(this)}
      marginBottom={16}
      />
      </View>
      
      <Text style={styles.slidetext}>Slide to prove your human</Text>
      <Slider style={styles.slider}/>
      
      <View style={[Skin.nwd.row,{height:48}]}>
      
      <CheckboxField
      defaultColor='tranprant'
      selectedColor="#247fd2"
      onSelect={this.selectCheckbox}
      checkboxStyle={styles.checkboxStyle}
      onSelect={this.selectCheckbox.bind(this)}
      labelSide="right">
      <Text style={{ color: '#f00' }}>{this.state.check}</Text>
      </CheckboxField>
      <Text style={Skin.nwd.check_text_condition}>Terms and Conditions Link </Text>
      
      </View>
      <Button
      lable="Submit"
      onPress={this.validateAndProcced.bind(this)}/>
      
      </View>
      </ScrollView>
      </View>
      );
  }
  
  
  
  
}

module.exports = Register;
