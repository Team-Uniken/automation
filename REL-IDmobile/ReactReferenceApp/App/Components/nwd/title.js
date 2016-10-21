
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Slider,
  ScrollView,
} = ReactNative;
const{Component} =  React;

var styles = StyleSheet.create({
   titalstyle:{
    width: Skin.SCREEN_WIDTH,
      textAlign: 'center',
    color:'#000',
    fontSize:24,
    margin:12,
    marginBottom:16,
  },
});




class Tital extends Component {

  render() {
    return (  
      <Text style={styles.titalstyle}>{this.props.tital}</Text>
         );
  }




}

module.exports = Tital;