
import React from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';



var {
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  StatusBar,
  ScrollView,
} = React;




export default class PasswordSet extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      password : '',
      cPassword : '',
    };
  }

  componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
          this.refs.password.focus();
      });
  }

  setPassword(){
    var pw = this.state.password;
    var cpw = this.state.cPassword;

    if(pw.length>0){
      if(cpw.length>0){
        if(pw == cpw){
        responseJson = this.props.url.chlngJson;
        responseJson.chlng_resp[0].response = pw;
          Events.trigger('showNextChallenge', {response: responseJson});
        }
        else{
          alert('Password and Confirm Password do not match');
        }}else{alert('Please enter confirm password ');}
    }
    else{
      alert('Please enter password ');
    }
  }

  onPasswordChange(event){
    this.setState({password: event.nativeEvent.text});
  }

  onConfirmPasswordChange(event){
    this.setState({cPassword: event.nativeEvent.text});
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }

  render() {
/*
    this.props = {
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
    return (
      <View style={Skin.coreStyle.container}>
        <View style={Skin.loadStyle.bgbase} />
        <Image style={Skin.loadStyle.bgimage} source={require('image!bg')} />
        <View style={Skin.statusBarStyle.default}>
          <StatusBar
            barStyle="light-content"
          />
        </View>
        <View style={Skin.loadStyle.bgcolorizer} />

        <View style={Skin.activationStyle.centering_wrap}>
          <View style={Skin.activationStyle.wrap}>


              <View>
                <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
                <Text style={Skin.activationStyle.title}>Set Password</Text>
                <Text style={Skin.activationStyle.info}>Enter password of length 8-10 characters</Text>
              </View>

              <View style={Skin.activationStyle.input_wrap}>
                <View style={Skin.activationStyle.textinput_wrap}>
                  <TextInput
                    autoCorrect={false}
                    returnKeyType={'next'}
                    keyboardType={'default'}
                    ref='password'
                    placeholder={'Enter Password'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    style={Skin.activationStyle.textinput}
                    secureTextEntry={true}
                    onChange={this.onPasswordChange.bind(this)}
                    onSubmitEditing={this.refs.cPassword.focus()}
                  />
                </View>
              </View>

              <View style={Skin.activationStyle.input_wrap}>
                <View style={Skin.activationStyle.textinput_wrap}>
                  <TextInput
                    autoCorrect={false}
                    ref='cPassowrd'
                    returnKeyType={'next'}
                    keyboardType={'default'}
                    placeholder={'Confirm Password'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    style={Skin.activationStyle.textinput}
                    secureTextEntry={true}
                    onChange={this.onConfirmPasswordChange.bind(this)}
                    onSubmitEditing={this.setPassword}
                  />
                </View>
              </View>
              <View style={Skin.activationStyle.input_wrap}>
                <TouchableHighlight
                  style={Skin.activationStyle.button}
                  underlayColor={'#082340'}
                  onPress={this.setPassword.bind(this)}
                  activeOpacity={0.6}
                >
                  <Text style={Skin.activationStyle.buttontext}>
                    {this.btnText()}
                  </Text>
                </TouchableHighlight>
              </View>


          </View>
        </View>


      </View>
    );
  }
}

module.exports = PasswordSet;


