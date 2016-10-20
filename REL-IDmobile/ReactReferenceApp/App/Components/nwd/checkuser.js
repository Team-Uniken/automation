
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from './button';
import Margin from './margin';
import Input from './input';

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
   TextInput,
  TouchableOpacity,
} = ReactNative;
const{Component} =  React;



class First extends Component {
 
  checkuser() {
    alert("todo");
  }
  

  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Text style={Skin.nwd.topicon}>N</Text>
        <Text style={Skin.nwd.welcometextstyle}>Welcome to NWD</Text>
      <Margin
space={32}/>

<Input
 placeholder={'Enter Username'}
/>
   
 



  <Button
  lable="Submit"
  onPress={this.checkuser.bind(this)}/>

     </View>
            );
  }




}

module.exports = First;