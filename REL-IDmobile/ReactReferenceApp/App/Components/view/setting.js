
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Config from 'react-native-config';


const {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} = ReactNative;
const {Component} = React;


class Setting extends Component {
  render() {
    if (Config.CONNECTION_PROFILE == 'true') {
    return (
      <TouchableHighlight
        activeOpacity={1.0}
        style={[this.props.style]}
        underlayColor={Skin.colors.DARK_PRIMARY}
        onPress={this.props.onPress}          >
        <View>
          <Text
            style={{
              color: '#FFF',
              fontSize: 30,
              fontWeight: 'bold',
            }}
            >
              {Skin.icon.settings}
          </Text>
        </View>
      </TouchableHighlight>
      );
    }else{
      return(null);
    }
  }
}

module.exports = Setting;