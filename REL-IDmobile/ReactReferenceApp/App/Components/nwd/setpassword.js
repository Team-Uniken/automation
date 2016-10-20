
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Tital from './tital';
import Button from './button';
import Margin from './margin';
import Input from './input';

const {
  Text,
  View,
} = ReactNative;
const{Component} =  React;






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
  

               <Input
 placeholder={'Enter Password'}
 marginBottom={12}
/>
                <Input
 placeholder={'Confirm Password'}
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