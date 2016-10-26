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

const {View, Text, TextInput, TouchableHighlight, StatusBar, DeviceEventEmitter, TouchableOpacity, Platform, Alert, AsyncStorage, } = ReactNative;

const {Component} = React;

let responseJson;


export default class DeviceName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: this.props.url.chlngJson.chlng_resp[0].response,
    };

    this.setDeviceName = this.setDeviceName.bind(this);
  }

  componentDidMount() {
    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;

    if (!(this.state.deviceName) || this.state.deviceName.length <= 0) {
      this.state.deviceName = "tempByApplication";
    }
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
      Events.trigger('showNextChallenge', {
        response: responseJson
      });
    } else {
      alert('Please enter device name ');
    }
    dismissKeyboard();
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

  render() {
    return (
      <View style={Skin.layout1.wrap}>
        <StatusBar
          style={Skin.layout1.statusbar}
          backgroundColor={Skin.main.STATUS_BAR_BG}
          barStyle={'default'} />
        <View style={Skin.layout1.title.wrap}>
          <Title
            close={0}>
            Device Name
          </Title>
        </View>

        <View
          style={{ height: Skin.SCREEN_HEIGHT - 100, justifyContent: 'center',}}>
          <View style={ Skin.activationStyle.topGroup }>
            <Text style={Skin.layout0.top.subtitle}>Set a nickname for this device: </Text>

            <Margin
              space={16}/>

            <View style={Skin.layout0.bottom.container}>
              <View>
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
              </View>

              <Margin
                space={16}/>
              <Button
                label= {this.btnText() }
                onPress={ this.setDeviceName.bind(this) }/>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = DeviceName;
