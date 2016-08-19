'use strict';

/*
 ALWAYS NEED
 */
import React from 'react-native';
import Skin from '../../Skin';


/*
 CALLED
 */
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Events from 'react-native-simple-events';

/*
 INSTANCES
 */
let responseJson;
let obj;
let savedpass;
const {
  Text,
  ScrollView,
  TextInput,
  View,
  Animated,
  TouchableHighlight,
  InteractionManager,
  AsyncStorage,
} = React;


class PasswordVerification extends React.Component {
  constructor(props) {
    super(props);
    /*
     this._props = {
     url: {
     chlngJson: {
     chlng_idx: 1,
     sub_challenge_index: 0,
     chlng_name: 'pass',
     chlng_type: 1,
     challengeOperation: 0,
     chlng_prompt: [[]],
     chlng_info: [
     {
     key: 'Prompt label',
     value: 'Verification Key',
     }, {
     key: 'Response label',
     value: 'Password',
     }, {
     key: 'Description',
     value: 'Enter password of length 8-10 characters',
     }, {
     key: 'Reading',
     value: 'Activation verification challenge',
     },
     ],
     chlng_resp: [
     {
     challenge: 'password',
     response: '',
     },
     ],
     challenge_response_policy: [],
     chlng_response_validation: false,
     attempts_left: 3,
     },
     },
     };
     */
    this.state = {
    progress: 0,
    inputUsername: '',
    inputPassword: '',
    login_button_text: 'Login',
    loginAttempts: 5,
    passAttempts: 5,
    Challenge: this.props.url.chlngJson,
    failureMessage: '',
    };
  }
  componentWillMount(){
    AsyncStorage.getItem("passwd").then((value) => {
                                        if(value){
                                        savedpass = value;
                                        
                                        }else{
                                        
                                        }
                                        }).done();
  }
  
  componentDidMount() {
    obj = this;
    InteractionManager.runAfterInteractions(() => {
                                            this.refs.inputPassword.focus();
                                            });
  }
  
  onPasswordChange(event) {
    this.setState({ inputPassword: event.nativeEvent.text });
  }
  
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }
  updateProgress() {
    setTimeout((function(){
                this.setState({ progress: this.state.progress + (0.4 * Skin.loadspd) });
                if (this.state.progress < 1) {
                this.updateProgress();
                } else {
                //console.log('complete');
                this.props.navigator.push({
                                          id: 'Main',
                                          });
                }
                }).bind(this), 5);
  }
  
  checkPassword() {
    const pw = this.state.inputPassword;
    if (pw.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Please enter password');
    }
  }
  
  checkPasswordSuccess() {
    this.refs.inputPassword.blur();
    this.state.progress = 0;
    this.updateProgress();
  }
  
  checkPasswordFailure() {
    this.clearText('inputPassword');
    this.setState({ failureMessage: 'Invalid Password' });
    InteractionManager.runAfterInteractions(() => {
                                            this.refs.inputPassword.focus();
                                            });
  }
  
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  
  render() {
    return (
            <MainActivation>
            <View style={Skin.activationStyle.topGroup}>
            <Animated.View style={[Skin.loadStyle.rid_wrap]}>
            <View style={Skin.loadStyle.rid_center}>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_r]}>g</Text>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_i]}>h</Text>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_d]}>i</Text>
            </View>
            </Animated.View>
            
            <View style={[Skin.activationStyle.input_wrap, { marginTop: 60 }]}>
            <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
            ref='inputPassword'
            returnKeyType={'next'}
            secureTextEntry
            autoCorrect={false}
            autoCapitalize={'none'}
            placeholder={'Password'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            style={Skin.activationStyle.textinput}
            value={this.state.inputPassword}
            onSubmitEditing={this.checkPassword.bind(this)}
            onChange={this.onPasswordChange.bind(this)}
            />
            
            </View>
            </View>
            <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
            style={Skin.activationStyle.button}
            onPress={this.checkPassword.bind(this)}
            underlayColor={'#082340'}
            activeOpacity={0.6}
            >
            <Text style={Skin.activationStyle.buttontext}>
            SUBMIT
            </Text>
            </TouchableHighlight>
            </View>
            </View>
            <OpenLinks />
            </MainActivation>
            );
  }
}

module.exports = PasswordVerification;
