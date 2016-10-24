'use strict';

/*
 ALWAYS NEED
 */
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
/*
 CALLED
 */
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';
import dismissKeyboard from 'dismissKeyboard';

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
/*
 Instantiaions
 */
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  InteractionManager,
  AsyncStorage,
} = ReactNative;

const{Component} = React;

export default class PasswordSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
    password: '',
    cPassword: '',
    };
    /*
     this._props = {
     url: {
     chlngJson: {
     chlng_idx: 1,
     sub_challenge_index: 0,
     chlng_name: 'pass',
     chlng_type: 1,
     challengeOperation: 1,
     chlng_prompt: [[]],
     chlng_info: [
     {
     key: 'Response label',
     value: 'Password',
     }, {
     key: 'description',
     value: 'Enter password of length 8-10 characters',
     },
     ],
     chlng_resp: [
     {
     "challenge":"password",
     "response":"",
     }
     ],
     challenge_response_policy: [],
     chlng_response_validation: false,
     attempts_left: 3,
     },
     chlngsCount: 1,
     currentIndex: 1,
     },
     };
     */
  }
  
  componentDidMount() {
    Main.isTouchIdSet = "NO";
    InteractionManager.runAfterInteractions(() => {
                                           // this.refs.password.focus();
                                            });
  }
  
  
  validatePassword(textval) {
   // var passwordregex = /^[0-9]/;
     var passwordregex = /^(?=^.{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
    return passwordregex.test(textval);
  }

  onPasswordChange(event) {
    this.setState({ password: event.nativeEvent.text });
  }
  
  onConfirmPasswordChange(event) {
    this.setState({ cPassword: event.nativeEvent.text });
  }
  
  setPassword(){
    const pw = this.state.password;
    const cpw = this.state.cPassword;
    
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
         //  if(this.validatePassword(pw)){
          Main.dnaPasswd = pw;
          let responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = pw;
          dismissKeyboard();
          Events.trigger('showNextChallenge', {response: responseJson});
          // }else{
          // alert('Invalide Password');
          // }
        } else {
          alert('Password and Confirm Password do not match');
        }
      } else {
        alert('Please enter confirm password ');
      }
    } else {
      alert('Please enter password ');
    }
  }
  
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'Continue';
  }
  
  render() {
    
    return (
      <View style={Skin.nwd.container}>
      <Title
      tital="Registration"></Title>
      <Margin
      space={16}/>
      <Text style={Skin.nwd.headertext}>Your username is{"\n"}<Text style={Skin.nwd.note}>abc *******lnn@gmail.com</Text>{"\n"}Set Account Password</Text>
      <Margin
      space={32}/>
      <View>
      <Input
      returnKeyType={'next'}
      keyboardType={'default'}
      ref={'password'}
      placeholder={'Enter Password'}
      secureTextEntry={true}
      blurOnSubmit={false}
      onChange={this.onPasswordChange.bind(this)}
      onSubmitEditing={() => { this.refs.cPassword.focus(); }}
      marginBottom={12}
      />
      <Input
      placeholder={'Confirm Password'}
      ref={'cPassword'}
      returnKeyType={'next'}
      keyboardType={'default'}
      secureTextEntry={true}
      onChange={this.onConfirmPasswordChange.bind(this)}
      onSubmitEditing={this.setPassword.bind(this)}
      />
      </View>
      <Margin
      space={32}/>
      <Button
      onPress={this.setPassword.bind(this)}
      lable= {this.btnText()}/>
      </View>
      );

     }
}

module.exports = PasswordSet;
