
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Tital from './tital';
import Button from './button';
import Margin from './margin';

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

     slidetext:{
    width: Skin.SCREEN_WIDTH,
      textAlign: 'center',
    color:'#000',
    fontSize:16,
  },
    slider:{
    width: 250,
  },
     labelStyle: {
        flex: 1
    },
    checkboxStyle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#f00',
        borderRadius: 5,

    } 
});




class Register extends Component {

constructor(props){
    super(props);
    this.state = {
    check:'',

    };
  }

  selectCheckbox() {
    if(this.state.check.length==0){
          this.setState({ check:'\u2714'});
    }else{
          this.setState({ check:''});
    }
    } 

  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Tital
      tital="Registration"></Tital>

      <Margin
space={16}/>

 <Text style={Skin.nwd.headertext}>Your username is{"\n"}<Text style={Skin.nwd.note}>abc *******lnn@gmail.com</Text>{"\n"}Set Account Password</Text>

      <Margin
space={32}/>

    <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Enter Password'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />   

  <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Confirm Password'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />
<Margin
space={32}/>

  <Button
  lable="Submit"/>

     </View>
            );
  }




}

module.exports = Register;