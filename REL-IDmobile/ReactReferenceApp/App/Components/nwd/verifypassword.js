
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from './button';
import Margin from './margin';

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
        <Text style={Skin.nwd.welcometextstyle}>Welcome to New World CLUB</Text>
      <Margin
space={32}/>
   
  <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Enter Username'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={[Skin.nwd.textinput,{marginBottom:0}]}
                />



  <Button
  lable="Submit"
  onPress={this.checkuser.bind(this)}/>

     </View>
            );
  }




}

module.exports = First;