'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
/*
  CALLED
*/
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';
import TouchID from 'react-native-touch-id';
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
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
    };
  }

  componentDidMount() {
//    this.setDeviceName();
//    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;
  }

  onDeviceNameChange(event) {
    this.setState({ deviceName: event.nativeEvent.text });
  }

  setDeviceName() {
    const dName = this.state.deviceName;
    if (dName.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = dName;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Please enter Device Name ');
    }
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
    if(Platform.OS === 'ios'){
      this.onVerifyTouchIdSupport();
    }else{
      this.setDeviceName();
    }
  }


  render() {
    return (
      <MainActivation>
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
              activeOpacity={0.8}
            >
              <Text style={Skin.activationStyle.buttontext}>
                {this.btnText()}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </MainActivation>
    );
  }
}

module.exports = DeviceName;
