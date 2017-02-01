/*
 *Custome Title Component.
 *it is a simple row with title text in middle and cross on left side.
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

/*
 Use in this js
 */
import Skin from '../../Skin';

class Title extends Component {
  render() {
    if (this.props.close == 0) {
      return (
        <View style={[Skin.layout1.title.container, { marginTop: (Platform.OS === 'ios') ? 20 : 0, }]}>
          <Text style={[Skin.layout1.title.base, { width: Skin.SCREEN_WIDTH }]}>{this.props.children}</Text>
        </View>
      );
    }
    else {
      return (
        <View style={[Skin.layout1.title.container, { marginTop: (Platform.OS === 'ios') ? 20 : 0, }]}>
          <TouchableHighlight
            style={Skin.layout1.title.crosshighlight}
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