'use strict';

/*
 ALWAYS NEED
 */
import React from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
/*
 CALLED
 */
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';
import dismissKeyboard from 'dismissKeyboard';
/*
 Instantiaions
 */
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  InteractionManager,
  AsyncStorage,
} = React;


export default class PasswordSet extends React.Component {
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
                                            this.refs.password.focus();
                                            });
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
          Main.dnaPasswd = pw;
          let responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = pw;
          dismissKeyboard();
          Events.trigger('showNextChallenge', {response: responseJson});
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
            <MainActivation navigator={this.props.navigator}>
            <View style={Skin.activationStyle.topGroup}>
            <Text style={Skin.activationStyle.counter}>
            {this.props.url.currentIndex}/{this.props.url.chlngsCount}
            </Text>
            <Text style={Skin.activationStyle.title}>Set Password</Text>
            <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
            autoCorrect={false}
            returnKeyType={'next'}
            keyboardType={'default'}
            ref={'password'}
            placeholder={'Enter Password'}
            placeholderTextColor={Skin.PLACEHOLDER_TEXT_COLOR_RGB}
            style={Skin.activationStyle.textinput}
            secureTextEntry={true}
            blurOnSubmit={false}
            onChange={this.onPasswordChange.bind(this)}
            onSubmitEditing={() => { this.refs.cPassword.focus(); }}
            />
            </View>
            </View>
            
            <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
            autoCorrect={false}
            ref={'cPassword'}
            returnKeyType={'next'}
            keyboardType={'default'}
            placeholder={'Confirm Password'}
            placeholderTextColor={Skin.PLACEHOLDER_TEXT_COLOR_RGB}
            style={Skin.activationStyle.textinput}
            secureTextEntry={true}
            onChange={this.onConfirmPasswordChange.bind(this)}
            onSubmitEditing={this.setPassword.bind(this)}
            />
            </View>
            </View>
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
            style={Skin.activationStyle.button}
            underlayColor={Skin.login.BUTTON_UNDERLAY}
            onPress={this.setPassword.bind(this)}
            activeOpacity={0.6}
            >
            <Text style={Skin.activationStyle.buttontext}>
            {this.btnText()}
            </Text>
            </TouchableHighlight>
            </View>
            </View>
            </MainActivation>
            );
  }
}

module.exports = PasswordSet;
