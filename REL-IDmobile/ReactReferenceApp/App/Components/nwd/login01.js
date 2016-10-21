
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from '../view/button';
const {
  Text,
  View,
} = ReactNative;
const{Component} =  React;


class First extends Component {
  selectReg() {
    console.log('doNavigation:');
//    this.props.navigator.push({ id: "selectlogin",title: "nextChlngName", url: { "chlngJson": this.props.url.chlngJson, "screenId": this.props.url.screenId}});
    this.props.navigator.push({ id: "Machine", title: "nextChlngName", url: { "chlngJson": this.props.url.chlngJson, "screenId": this.props.url.screenId} });
  }
  
 register() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "register"});
  }
  

  render() {
    return (  
        <View style={Skin.nwd.container}>
    <Text style={Skin.nwd.topicon}>N</Text>
        <Text style={Skin.nwd.welcometextstyle}>Welcome to New World CLUB</Text>      
  <Button
  lable="I need to register"
  onPress={this.register.bind(this)}/>        
  <Button
  lable="I'm already a member"
   onPress={this.selectReg.bind(this)}/>
     </View>
            );
  }




}

module.exports = First;
