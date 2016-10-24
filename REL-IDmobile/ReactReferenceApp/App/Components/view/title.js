
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';

const {
  Text,
  View,
} = ReactNative;
const{Component} =  React;

class Tital extends Component {

  
  render() {
    return (
      <View style={Skin.layout1.title.container}>
        <Text style={Skin.layout1.title.button} onPress={this.props.onClose }>{Skin.icon.close}</Text>
        <Text style={Skin.layout1.title.base}>{this.props.children}</Text>
        <Text style={Skin.layout1.title.button}></Text>
      </View>
      );
  }
}

module.exports = Tital;
