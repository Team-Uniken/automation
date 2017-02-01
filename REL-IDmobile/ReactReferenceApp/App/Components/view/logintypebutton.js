/**
 *  return a custom button with text and icon depends on props.
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
import {Text, View, TouchableOpacity, } from 'react-native'
/*
 Use in this js
 */
import Skin from '../../Skin';

class LoginTypeButton extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={[Skin.baseline.button.base, Skin.layout0.bottom.loginbutton.base,{justifyContent:'center',alignItems:'center'}]}
          underlayColor={Skin.baseline.underlayColor}
          onPress={this.props.onPress}
          activeOpacity={Skin.baseline.activeOpacity}>
          <Text style={[Skin.layout0.bottom.loginbutton.icon,{textAlign:'center',textAlignVertical:'center'}]}>
            {this.props.label}
          </Text>
        </TouchableOpacity>
        <Text style={Skin.layout0.bottom.loginbutton.subtitle}>
          {this.props.text}
        </Text>
      </View>
      );
  }
}

module.exports = LoginTypeButton;