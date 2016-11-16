
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';

const {
  Text,
  View,
  Platform,
} = ReactNative;
const {Component} = React;

class Title extends Component {  render() {
    if (this.props.close == 0) {
      return (
      <View style={[Skin.layout1.title.container,{marginTop: (Platform.OS === 'ios') ? 20 : 0,}]}>
          <Text style={[Skin.layout1.title.base,{width:Skin.SCREEN_WIDTH}]}>{this.props.children}</Text>
        </View>
      );
    }
    else {
      return (
      <View style={[Skin.layout1.title.container,{marginTop: (Platform.OS === 'ios') ? 20 : 0,}]}>
          <Text style={Skin.layout1.title.button} onPress={this.props.onClose }>{Skin.icon.close}</Text>
          <Text style={Skin.layout1.title.base}>{this.props.children}</Text>
          <Text style={Skin.layout1.title.button}></Text>
        </View>
      );
    }
  }

}


module.exports = Title;
