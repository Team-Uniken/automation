/*
 *Custome  Component which show only app version.
 *Visible in bottom Right corner.
 */

/*
 *ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View, Platform, TouchableHighlight, } from 'react-native';
import Config from 'react-native-config';

/*
 Use in this js
 */
import Skin from '../../Skin';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
import { isIphoneX } from 'react-native-iphone-x-helper'

class Setting extends Component {
  render() {
    return (
      <Text
        style={{
          color: Config.VERSION_COLOR,
          fontSize: 16,
          position: 'absolute',
          bottom: (isIphoneX()?20:0),
          right:0,
          width:50,
          height: 24,
          alignItems: 'center',
          textAlign: 'right',
          paddingRight: 5,
          justifyContent: 'center',
          backgroundColor:'transparent',
        }}
        >v{ReactRdna.AppVersion}</Text>

    );
  }
}
module.exports = Setting;
