/*
 *Custome Setting Component.
 *Visible in bottom left corner.
 *it is configured from config file. if in config file CONNECTION_PROFILE option is set true then it will be visible else is return null.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View, TouchableHighlight, } from 'react-native';
import Config from 'react-native-config';

/*
 Use in this js
 */
import Skin from '../../Skin';



class Setting extends Component {
  render() {
    if (Config.CONNECTION_PROFILE == 'true') {
      return (
        <TouchableHighlight
          activeOpacity={1.0}
          style={[this.props.style]}
          underlayColor='#fff'
          onPress={this.props.onPress}>
          <View>
            <Text
              style={{
                color: '#99A3A4',
                fontSize: 30,
                fontWeight: 'bold',
              }}
              >
              {Skin.icon.settings}
            </Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (null);
    }
  }
}

module.exports = Setting;