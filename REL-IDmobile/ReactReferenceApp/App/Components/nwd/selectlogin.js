
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
  password() {
    this.props.navigator.push({ id: "Machine", title: "nextChlngName", url: { "chlngJson": this.props.url.chlngJson, "screenId": this.props.url.screenId} });
  }
   touch() {
    alert("todo");
  }
   wechat() {
    alert("todo");
  }
  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Text style={Skin.nwd.topicon}>N</Text>
      <Text style={[Skin.nwd.welcometextstyle,{margin:0}]}>Welcome to New World CLUB</Text>
       <Text style={Skin.nwd.hint}>Select a login</Text>
       <View style={Skin.nwd.row1}>
       <LoginTypeButton
       lable="T"
        onPress={this.touch.bind(this)}
       text="TouchId"/>
      <LoginTypeButton
       lable="P"
       onPress={this.password.bind(this)}
       text="Password"/>
        <LoginTypeButton
       lable="W"
      onPress={this.wechat.bind(this)}
       text="WeChat"/>
 </View>
     </View>
            );
  }
}

module.exports = Second;