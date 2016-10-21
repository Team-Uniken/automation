
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import CheckBox from '../view/checkbox';
import Input from '../view/input';
import Margin from '../view/margin';



const {
  Text,
  View,
  ScrollView,
} = ReactNative;
const{Component} =  React;

class Register extends Component {

constructor(props){
    super(props);
    this.state = {
    device:'',
    touchid:'',
    wechat:'',
    rememberusername:'',
    welcomescreen:'',

    };
  }

  selectdevice() {
    if(this.state.device.length==0){
          this.setState({ device:'\u2714'});
    }else{
          this.setState({ device:''});
    }
    } 
     selecttouchid() {
    if(this.state.touchid.length==0){
          this.setState({ touchid:'\u2714'});
    }else{
          this.setState({ touchid:''});
    }
    } 
     selectwechat() {
    if(this.state.wechat.length==0){
          this.setState({ wechat:'\u2714'});
    }else{
          this.setState({ wechat:''});
    }
    } 
     selectrememberusername() {
    if(this.state.rememberusername.length==0){
          this.setState({ rememberusername:'\u2714'});
    }else{
          this.setState({ rememberusername:''});
    }
    } 
     selectwelcomescreen() {
    if(this.state.welcomescreen.length==0){
          this.setState({ welcomescreen:'\u2714'});
    }else{
          this.setState({ welcomescreen:''});
    }
    } 

  render() {
    return (  
        <View style={Skin.nwd.container}>
      <Title
      tital="Registration"></Title>
      <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      >
<View style={Skin.nwd.scrollcontainer}>

<View>
<CheckBox
value={this.state.device}
onSelect={this.selectdevice.bind(this)}
lable="Make Device Permanent"/>

<CheckBox
value={this.state.touchid}
onSelect={this.selecttouchid.bind(this)}
lable="Enable TouchID Login"/>           

<CheckBox
value={this.state.wechat}
onSelect={this.selectwechat.bind(this)}
lable="Enable WeChat Login"/>

<CheckBox
value={this.state.rememberusername}
onSelect={this.selectrememberusername.bind(this)}
lable="Remember Username"/>

<CheckBox
value={this.state.welcomescreen}
onSelect={this.selectwelcomescreen.bind(this)}
lable="Skip welcome screen"/>

</View>  

 <Margin
space={16}/>
<Text style={Skin.nwd.note}>Default Login Credential</Text>

<Input
 placeholder={'Device Name'}
/>
    <Margin
space={16}/>
 <Button
  lable="Submit"/>

</View>
      </ScrollView>
     </View>
            );
  }




}

module.exports = Register;
