
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} = ReactNative;
const {Component} = React;
var styles = Skin.controlStyle;


class MenuItem extends Component {
  render() {
    if (this.props.visibility== 'true') {
      return (
        <View>
          <View style={styles.menuBorder}></View>
          <TouchableHighlight
            onPress={this.props.onPress}
            style={styles.touch}
            >
            <Text style={styles.menuItem}>{this.props.lable}</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (null);
    }

  }
}

module.exports = MenuItem;