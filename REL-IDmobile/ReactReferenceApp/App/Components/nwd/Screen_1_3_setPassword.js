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
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
  StatusBar,
  ScrollView,
} = ReactNative;

const {Component} = React;

export default class PasswordSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
    password: '',
    cPassword: '',
    userID:'',
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
  componentWillMount() {
    
    AsyncStorage.getItem('RUserId').then((value) => {
      this.setState({ Username: value });
      }).done();
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
  
  setPassword() {
    const pw = this.state.password;
    const cpw = this.state.cPassword;
    
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
          //  if(this.validatePassword(pw)){
          Main.dnaPasswd = pw;
          AsyncStorage.setItem("RPasswd", pw);
          let responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = pw;
          dismissKeyboard();
          Events.trigger('showNextChallenge', { response: responseJson });
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

     close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }
  
  render() {
    
    
    return (
      <View style={Skin.layout1.wrap}>
      <StatusBar
      backgroundColor={Skin.main.STATUS_BAR_BG}
      barStyle={'default'}
      />
      <View style={Skin.layout1.title.wrap}>
           <Title onClose={() => {
      this.close();
      }}>
      Registration
      </Title>
      </View>
      <ScrollView style={Skin.layout1.content.scrollwrap}>
      <View style={Skin.layout1.content.wrap}>
      <View style={Skin.layout1.content.container}>
      <View style={Skin.layout1.content.top.container}>
      <Text style={[Skin.layout1.content.top.text, {}]}>Your Username is</Text>
      <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR }]}>{this.state.Username}</Text>
      <Text style={[Skin.layout1.content.top.text, { marginBottom: 26 }]}>Set Your Password</Text>
      </View>
      <View style={Skin.layout1.content.bottom.container}>
      
      <Input
      returnKeyType={'next'}
      keyboardType={'default'}
      autoFocus={true}
      autoCorrect={false}
      autoComplete={false}
      autoCapitalize={false}
      ref={'password'}
      placeholder={'Enter Password'}
      secureTextEntry={true}
      blurOnSubmit={false}
      onChange={this.onPasswordChange.bind(this) }
      onSubmitEditing={() => { this.refs.cPassword.focus(); } }
      marginBottom={12}
      />
      
      <Input
      autoFocus={false}
      autoComplete={false}
      autoCorrect={false}
      autoCapitalize={false}
      returnKeyType={'done'}
      secureTextEntry={true}
      ref={'cPassword'}
      keyboardType={'default'}
      placeholder={'Confirm Password'}
      onChange={this.onConfirmPasswordChange.bind(this) }
      onSubmitEditing={this.setPassword.bind(this) }
      
      />
      </View>
      </View>
      </View>
      </ScrollView>
      <View style={Skin.layout1.bottom.wrap}>
      <View style={Skin.layout1.bottom.container}>
      <Button style={Skin.layout1.bottom.button}
      onPress={this.setPassword.bind(this) }
      label={Skin.text['1']['1'].submit_button}/>
      </View>
      </View>
      <KeyboardSpacer topSpacing={-40}/>
      </View>
      );
    
  }
}

module.exports = PasswordSet;
