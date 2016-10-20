
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Tital from './tital';

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
  container: {
    flex: 1,
    alignItems:'center',
  }, 
  scrollcontainer: {
    flex: 1,
    alignItems:'center',
    marginBottom:32,
  },
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
        <View style={styles.container}>
      <Tital
      tital="Registration"></Tital>
      <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      >
<View style={styles.scrollcontainer}>
              
   <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'First Name'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />
    <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Last Name'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />   

  <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Email'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />


  <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Confirm Email'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />
  <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Phone Number'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />
      <Text style={styles.slidetext}>Slide to prove your human</Text>
  <Slider style={styles.slider}/>

  <View style={Skin.nwd.row}>

 <CheckboxField
                defaultColor='tranprant'
                selectedColor="#247fd2"
                  onSelect={this.selectCheckbox}
                checkboxStyle={styles.checkboxStyle}
                 onSelect={this.selectCheckbox.bind(this)}
                labelSide="right">
                <Text style={{ color: '#f00' }}>{this.state.check}</Text>
            </CheckboxField>
      <Text style={Skin.nwd.check_text_condition}>Terms and Conditions Link </Text>

  </View>

<TouchableOpacity
                style={Skin.nwd.button}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                >
                <Text style={Skin.nwd.buttontext}>
                 Submit
                </Text>
                </TouchableOpacity>

</View>
      </ScrollView>
     </View>
            );
  }




}

module.exports = Register;