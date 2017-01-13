
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Config from 'react-native-config';

const {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} = ReactNative;
const {Component} = React;
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
