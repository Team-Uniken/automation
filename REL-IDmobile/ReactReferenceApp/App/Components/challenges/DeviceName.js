'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
import PatternLock from '../../Scenes/PatternLock'

import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';
/*
  CALLED
*/
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

let activationResSubscription;

const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  DeviceEventEmitter,
  Platform,
  Alert,
  AsyncStorage,
} = React;

let responseJson;


export default class DeviceName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: this.props.url.chlngJson.chlng_resp[0].response,
      pattern:false,
    };

    this.setDeviceName = this.setDeviceName.bind(this);
    this.showPattern = this.showPattern.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.isUserDataPresent = false;  
}

  showPattern(chlngRes) {
    this.props.navigator.push({
      id: "Pattern",
      title: "Set Pattern",
      url: {
        data: chlngRes,
      },
      setPatternCallback: this.onSetPattern,
      mode: "set"
    });
  }

  showSetPatternAlert() {
      Alert.alert(
        'Message',
        'Do you want to enable pattern feature?',
        [
          {
            text: 'NO',
            onPress: () => {
              console.log('Cancel Pressed');
              try {
                AsyncStorage.setItem("setPattern", "false", () => {
                  this.setDeviceName();
                  Main.dnaPasswd = null;
                });
              }
              catch (e) { }
            }
          },
          {
            text: 'YES',
            onPress: () => {
              console.log('YES Pressed');
              try {
                AsyncStorage.setItem("setPattern", "true", () => {
                  this.setDeviceName();
                });
              }
              catch (e) { }
            }
          },
        ]
      );
   }

  componentDidMount() {
    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;

    if(!(this.state.deviceName) || this.state.deviceName.length <= 0 ){
      this.state.deviceName = "tempByApplication";
    }
    
    
//    if(Platform.OS == "ios"){
////      if(Main.isTouchVerified === "NO"){
//        this.decidePlatformAndShowAlert();
////      }else{
////        this.setDeviceName();
////      }
//    }
   
    }

  onDeviceNameChange(event) {
    this.setState({ deviceName: event.nativeEvent.text });
  }

 
  setDeviceName() {
    const dName = this.state.deviceName;
    if (dName.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = dName;
      if (Platform.OS === "android") {
        try {
          AsyncStorage.getItem("setPattern").then((value)=> {
            if (value === "true" && !this.isUserDataPresent) {
             // var chlngRes = { response: responseJson };
             // AsyncStorage.setItem("setPattern", "false");
              this.setState({
                pattern:true
              });
            } else {
               Events.trigger('showNextChallenge', { response: responseJson });
            }
          }).done();
        }
        catch (e) { }
      }
      else {
        Events.trigger('showNextChallenge', { response: responseJson });
      }
    } else {
      alert('Please enter device name ');
    }
    dismissKeyboard();
  }
  

  onVerifyTouchIdSupport(){
    TouchID.isSupported()
    .then(supported => {
          // Success code
          console.log('TouchID is supported.');
          this.OnTouchIdAlert();
          })
    .catch(error => {
           // Failure code
           this.setDeviceName();//normal way
           console.log('TouchID is not supported.');
           console.log(error);
           });
  }
  
  OnTouchIdAlert(){
      if(Platform.OS === 'ios'){
        Alert.alert(
                    'Message',
                    'Do you want to enable touchId feature?',
                    [
                     {
                     text: 'NO',
                     onPress: () => {console.log('Cancel Pressed');
                     AsyncStorage.setItem("userID","empty");
                     this.setDeviceName();
                     style: 'cancel'
                     }
                     
                     },
                     {
                     text: 'YES',
                     onPress: () => {
                      AsyncStorage.setItem("userId", Main.dnaUserName);
//                     ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", Main.dnaUserName, (response) => {
//                                          if (response) {
//                                          console.log('immediate response of encrypt data packet is is' + response[0].error);
//                                          // alert(response[0].error);
//                                          } else {
//                                          console.log('immediate response is' + response[0].response);
//                                          // alert(response[0].error);
//                                                 AsyncStorage.setItem("userId", response[0].response);
//                                          }
//                                          })
                     ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", Main.dnaPasswd, (response) => {
                                                 if (response) {
                                                 console.log('immediate response of encrypt data packet is is' + response[0].error);
                                                 AsyncStorage.setItem("passwd", response[0].response);
                                                 } else {
                                                 console.log('immediate response is' + response[0].response);
                                                 // alert(response[0].error);
                                                 
                                                 }
                                                 })
                     
                     this.setDeviceName();

                     }
                     },
                     ]
                    )
       }else{
       
       //Show alert for pattern.
       }
  }

  onDeviceNameChangeText(event) {
    this.setState({ deviceName: event.nativeEvent.text });
  }

  btnText() {
    console.log('------ devname ' +
      this.props.url.chlngJson.chlng_idx +
      this.props.url.chlngsCount
    );
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }
  
  decidePlatformAndShowAlert(){
    const dName = this.state.deviceName;
    if (dName.length > 0) {
        if(Platform.OS === 'ios'){
          if(Main.isTouchIdSet === "NO"){
            this.onVerifyTouchIdSupport();
          }else{
            this.setDeviceName();
          }
        } else {
          AsyncStorage.getItem("userData").then((userData)=>{
            if(userData!=null && userData!=undefined){
                this.isUserDataPresent = true;
                this.setDeviceName();
            }
            else{
                this.showSetPatternAlert();
            }
          });
        }
    }
    else{
      alert("Please enter device name");
    }
  }

  onCheckChallengeResponseStats(args){
    // alert("In act checkResponse");
     activationResSubscription.remove();
     const res = JSON.parse(args.response);
     if(res.errCode == 0){
        var statusCode = res.pArgs.response.StatusCode;
        if(statusCode!=100){
         // alert("removing data statusCode = "+  statusCode);
          let keys = ['userData','setPattern'];
          AsyncStorage.multiRemove(keys);
        }
     }else{
      // alert("removing data errorCode = " + res.errCode);
        let keys = ['userData','setPattern'];
        AsyncStorage.multiRemove(keys);
     }
  }
  
  onSetPattern(data) {
    activationResSubscription = DeviceEventEmitter.addListener(
        'onCheckChallengeResponseStatus',
        this.onCheckChallengeResponseStats.bind(this));
     Main.dnaPasswd = null;
     Events.trigger('showNextChallenge', data);
  }

  render() {
   if(this.state.pattern === false){
        return (
          <MainActivation navigator={this.props.navigator}>
            <View style={Skin.activationStyle.topGroup}>
              <Text style={Skin.activationStyle.counter}>
                {this.props.url.currentIndex}/{this.props.url.chlngsCount}
              </Text>
              <Text style={Skin.activationStyle.title}>Device Name</Text>
              <Text style={Skin.activationStyle.info}>
                Set a nickname for this device:
              </Text>
              <View style={Skin.activationStyle.input_wrap}>
                <View style={Skin.activationStyle.textinput_wrap}>
                  <TextInput
                    returnKeyType={'next'}
                    autoCorrect={false}
                    keyboardType={'default'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    style={Skin.activationStyle.textinput}
                    value={this.state.deviceName}
                    ref={'deviceName'}
                    placeholder={'Enter Device Nickname'}
                    onChange={this.onDeviceNameChange.bind(this)}
                    onSubmitEditing={this.setDeviceName.bind(this)}
                  />
                </View>
              </View>
              <View style={Skin.activationStyle.input_wrap}>
                <TouchableHighlight
                  onPress={this.decidePlatformAndShowAlert.bind(this)}
                  style={Skin.activationStyle.button}
                  activeOpacity={0.8}>
                  <Text style={Skin.activationStyle.buttontext}>
                    {this.btnText()}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </MainActivation>
        );
    }
    else if(this.state.pattern === true){
      return (<PatternLock navigator={this.props.navigator} 
              onSetPattern={this.onSetPattern} data={{ response: responseJson }}
              mode="set" />);
    }
  }
}

module.exports = DeviceName;
