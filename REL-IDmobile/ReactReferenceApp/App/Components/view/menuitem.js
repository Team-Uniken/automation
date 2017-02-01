/*
 *Custome MenuItem Component used in control panel.
 *return component if visibility property is true else return null.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View, TouchableHighlight,} from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';

/*
  INSTANCES
 */
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