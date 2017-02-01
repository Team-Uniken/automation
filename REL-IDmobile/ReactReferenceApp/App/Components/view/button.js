/*
 *Custome Button component.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';


class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[Skin.baseline.button.base,this.props.style]}
        underlayColor={Skin.baseline.button.underlayColor}
        activeOpacity={Skin.baseline.button.activeOpacity}
        onPress={this.props.onPress}>
        <Text style={Skin.baseline.button.text}>
          {this.props.label}
        </Text>
      </TouchableOpacity>
      );
  }
}

module.exports = Button;