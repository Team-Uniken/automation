
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Tital from './tital';
import Button from './button';


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
<View style={Skin.nwd.scrollcontainer}>
<View>


           
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
      <Text style={Skin.nwd.check_text}>Make Device Permanent</Text>
  </View>

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
      <Text style={Skin.nwd.check_text}>Enable TouchID Login</Text>
  </View>
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
      <Text style={Skin.nwd.check_text}>Enable WeChat Login</Text>
  </View>
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
      <Text style={Skin.nwd.check_text}>Remember Username</Text>
  </View>
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
      <Text style={Skin.nwd.check_text}>Skip welcome screen</Text>
  </View>
</View>  

<Text style={Skin.nwd.note}>Default Login Credential</Text>

    <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={'Device Name'}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={Skin.nwd.textinput}
                />
 <Button
  lable="Submit"/>

</View>
      </ScrollView>
     </View>
            );
  }




}

module.exports = Register;