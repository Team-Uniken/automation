'use strict';

/*
  NEEDED
*/
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';
import Main from '../Main';
import PatternLock from '../../Scenes/PatternLock'

import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer';
/*
  CALLED
*/
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

let activationResSubscription;

const {View, Text, TextInput, TouchableHighlight, DeviceEventEmitter, TouchableOpacity, Platform, Alert, AsyncStorage, } = ReactNative;

const {Component} = React;

let responseJson;


export default class DeviceName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: this.props.url.chlngJson.chlng_resp[0].response,
      pattern: false,
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
            } catch (e) { }
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
            } catch (e) { }
          }
        },
      ]
    );
  }

  componentDidMount() {
    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;

    if (!(this.state.deviceName) || this.state.deviceName.length <= 0) {
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
    this.setState({
      deviceName: event.nativeEvent.text
    });
  }


  setDeviceName() {
    const dName = this.state.deviceName;
    if (dName.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = dName;
      if (Platform.OS === "android") {
        try {
          AsyncStorage.getItem("setPattern").then((value) => {
            if (value === "true" && !this.isUserDataPresent) {
              // var chlngRes = { response: responseJson };
              // AsyncStorage.setItem("setPattern", "false");
              this.setState({
                pattern: true
              });
            } else {
              Events.trigger('showNextChallenge', {
                response: responseJson
              });
            }
          }).done();
        } catch (e) { }
      } else {
        Events.trigger('showNextChallenge', {
          response: responseJson
        });
      }
    } else {
      alert('Please enter device name ');
    }
    dismissKeyboard();
  }


  onVerifyTouchIdSupport() {
    TouchID.isSupported()
      .then(supported => {
        // Success code
        console.log('TouchID is supported.');
        this.OnTouchIdAlert();
      })
      .catch(error => {
        // Failure code
        this.setDeviceName(); //normal way
        console.log('TouchID is not supported.');
        console.log(error);
      });
  }

  OnTouchIdAlert() {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Message',
        'Do you want to enable touchId feature?',
        [
          {
            text: 'NO',
            onPress: () => {
              console.log('Cancel Pressed');
              AsyncStorage.setItem("userID", "empty");
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
    } else {

      //Show alert for pattern.
    }
  }

  onDeviceNameChangeText(event) {
    this.setState({
      deviceName: event.nativeEvent.text
    });
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

  decidePlatformAndShowAlert() {
    const dName = this.state.deviceName;
    if (dName.length > 0) {
      if (Platform.OS === 'ios') {
        if (Main.isTouchIdSet === "NO") {
          this.onVerifyTouchIdSupport();
        } else {
          this.setDeviceName();
        }
      } else {
        AsyncStorage.getItem("userData").then((userData) => {
          if (userData != null && userData != undefined) {
            this.isUserDataPresent = true;
            this.setDeviceName();
          } else {
            this.showSetPatternAlert();
          }
        });
      }
    } else {
      alert("Please enter device name");
    }
  }

  onCheckChallengeResponseStats(args) {
    // alert("In act checkResponse");
    activationResSubscription.remove();
    const res = JSON.parse(args.response);
    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      if (statusCode != 100) {
        // alert("removing data statusCode = "+  statusCode);
        let keys = ['userData', 'setPattern'];
        AsyncStorage.multiRemove(keys);
      }
    } else {
      // alert("removing data errorCode = " + res.errCode);
      let keys = ['userData', 'setPattern'];
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
    return (
      <View style={Skin.layout0.wrap.container}>
        <View style={ Skin.activationStyle.topGroup }>

          <Text style={Skin.layout0.top.subtitle}>Device Name</Text>
          <Text style={Skin.layout0.top.subtitle}>Set a nickname for this device: </Text>





          <Margin
            space={16}/>

          <View style={Skin.layout0.bottom.container}>
            <TextInput returnKeyType={ 'next' }
              autoCorrect={ false }
              keyboardType={ 'default' }
              placeholderTextColor={ Skin.PLACEHOLDER_TEXT_COLOR_RGB }
              style = {[Skin.baseline.textinput.base, this.props.styleInput]}
              value={ this.state.deviceName }
              ref={ 'deviceName' }
              placeholder={ 'Enter Device Nickname' }
              onChange={ this.onDeviceNameChange.bind(this) }
              onSubmitEditing={ this.setDeviceName.bind(this) }
              />

            <Margin
              space={16}/>
            <Button
              label= {this.btnText() }
              onPress={ this.decidePlatformAndShowAlert.bind(this) }/>
          </View>

        </View>
      </View>
    );
  }
}

module.exports = DeviceName;
