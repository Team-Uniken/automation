/*
 *Custome Title Component.
 *it is a simple row with title text in middle and cross on left side.
 */

/*
 *ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'

/*
 Required for this js
 */
import {Text, View, Platform, TouchableHighlight, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';

class Title extends Component {
  render() {
    if (this.props.close == 0) {
      return (
        <View style={[Skin.layout1.title.container, { marginTop: (Platform.OS === 'ios') ? (isIphoneX()?44:20) : 0,backgroundColor:'transparent' }]}>
          <Text style={[Skin.layout1.title.base, { width: Skin.SCREEN_WIDTH,backgroundColor:'transparent' }]}>{this.props.children}</Text>
        </View>
      );
    }
    else {
      return (
        <View style={[Skin.layout1.title.container, { marginTop: (Platform.OS === 'ios') ? (isIphoneX()?44:20) : 0, backgroundColor:'transparent'}]}>
          <TouchableHighlight
            style={[Skin.layout1.title.crosshighlight,{backgroundColor:'transparent'}]}
            onPress={this.props.onClose }
            underlayColor={Skin.colors.REPPLE_COLOR}>
            <Text style={Skin.layout1.title.button}>{Skin.icon.close}</Text>
          </TouchableHighlight>
          <Text style={Skin.layout1.title.base}>{this.props.children}</Text>
          <Text style={Skin.layout1.title.button}></Text>
        </View>
      );
    }
  }
}
module.exports = Title;