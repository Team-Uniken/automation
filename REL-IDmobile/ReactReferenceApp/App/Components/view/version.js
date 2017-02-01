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

class Setting extends Component {
  render() {
    return (
      <Text
        style={{
          color: Config.VERSION_COLOR,
          fontSize: 16,
          position: 'absolute',
          bottom: 0,
          right:0,
          width:36,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >v{ReactRdna.AppVersion}</Text>

    );
  }
}
module.exports = Setting;