
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} = ReactNative;
const {Component} = React;


class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={Skin.baseline.button.base}
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