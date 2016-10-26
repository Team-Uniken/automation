
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {Text, View, TouchableOpacity, } = ReactNative;
const {Component} = React;

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