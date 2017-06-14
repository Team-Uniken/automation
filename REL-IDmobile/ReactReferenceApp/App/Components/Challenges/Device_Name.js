/**
 * allow user to set its device name. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {View, Text, TextInput, TouchableHighlight, StatusBar, DeviceEventEmitter, TouchableOpacity, Platform, Alert, AsyncStorage, BackHandler, } from 'react-native'
import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';

/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';
import Main from '../Container/Main';
import PatternLock from '../../Scenes/PatternLock'

/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCES
 */
let activationResSubscription;
let responseJson;


export default class DeviceName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: this.props.url.chlngJson.chlng_resp[0].response,
    };

    this.setDeviceName = this.setDeviceName.bind(this);
  }
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
    this.state.deviceName = this.props.url.chlngJson.chlng_resp[0].response;
    if (!(this.state.deviceName) || this.state.deviceName.length <= 0) {
      this.state.deviceName = "tempByApplication";
    }
  }
  //onTextchange method for DeviceNmae TextInput
  onDeviceNameChange(event) {
    this.setState({
      deviceName: event.nativeEvent.text
    });
  }
  /*
    This method is used to get the user entered value and submit the same as a challenge response.
  */
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

  /*
     This method is used to return the text Submit/Continue for submit button.
   */
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
  //showPreviousChallenge on press of cross icon.
  close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }

  /*
  This method is used to render the componenet with all its element.
*/
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout1.wrap}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => {
              this.close();
            } }>
              Device Name
            </Title>
          </View>

          <View
            style={{ height: Skin.SCREEN_HEIGHT - 100, justifyContent: 'center', }}>
            <View style={ Skin.activationStyle.topGroup }>
              <Text style={Skin.layout0.top.subtitle}>Set a nickname for this device </Text>

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
      </MainActivation>
    );
  }
}

module.exports = DeviceName;
