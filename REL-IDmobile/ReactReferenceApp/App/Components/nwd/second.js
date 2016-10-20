
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import LoginTypeButton from './logintypebutton';


const {
  Text,
  View,
} = ReactNative;
const{Component} =  React;

class Second extends Component {
  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Text style={Skin.nwd.topicon}>N</Text>
      <Text style={[Skin.nwd.welcometextstyle,{margin:0}]}>Welcome to New World CLUB</Text>
       <Text style={Skin.nwd.hint}>Select a login</Text>
       <View style={Skin.nwd.row}>
       <LoginTypeButton
       lable="T"
       text="TouchId"/>
      <LoginTypeButton
       lable="P"
       text="Password"/>
        <LoginTypeButton
       lable="W"
       text="WeChat"/>
 </View>
     </View>
            );
  }
}

module.exports = Second;