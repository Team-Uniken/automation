
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
 
  verifypassword() {
    alert("todo");
  }
  

  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Text style={Skin.nwd.topicon}>N</Text>
        <Text style={Skin.nwd.welcometextstyle}>Welcome to NWD</Text>
      <Margin
space={32}/>
   <Text   style={[Skin.nwd.note,{textAlign: 'center'}]}>Attempt left 3</Text>
<Input
 placeholder={'Enter Password'}
/>
  <Button
  lable="Submit"
  onPress={this.verifypassword.bind(this)}/>
  <Text style={[Skin.nwd.note,{textAlign: 'center',marginTop:8}]}>Forgot your username/password?</Text>
     </View>
            );
  }




}

module.exports = First;