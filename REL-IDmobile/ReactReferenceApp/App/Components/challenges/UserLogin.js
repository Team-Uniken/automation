'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../../Skin';


/*
  CALLED
*/
import Main from '../Main';
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';


/*
	INSTANCES
*/
let responseJson;
let chlngJson;
let nextChlngName;
let obj;
let statusMessage;
const {
  Text,
  TextInput,
  View,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  InteractionManager,
  AsyncStorage,
  Image,
} = React;
const ConnectionProfile = require('../ConnectionProfile');


class UserLogin extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      r_opac_val: new Animated.Value(0),
      i_opac_val: new Animated.Value(0),
      d_opac_val: new Animated.Value(0),
      relid_text_opac: new Animated.Value(0),
      rid_top: new Animated.Value(253),
      r_text_opac: new Animated.Value(0),
      i_text_opac: new Animated.Value(0),
      d_text_opac: new Animated.Value(0),
      relid_opac_val: new Animated.Value(0),
      logWrapOpac: new Animated.Value(0),
      logWarnOpac: new Animated.Value(0),
      progWrapOpac: new Animated.Value(0),
      progress: 0,
      inputUsername: '',
      inputPassword: '',
      login_button_text: 'Login',
      loginAttempts: 5,
      passAttempts: 5,
      Challenge:this.props.url.chlngJson,
      failureMessage: '',
    };
  }


  openRoute(route) {
    this.props.navigator.push(route);
  }


  onCheckChallengeResponseStatus(e) {
      var res = JSON.parse(e.response);
      var statusCode = res.pArgs.response.StatusCode
      if (statusCode == 100) {
          chlngJson = res.pArgs.response.ResponseData;
          //This is important, hardcoding is done for testing purpose
          // var temp = JSON.parse(chlngJson);
          // nextChlngName = temp.chlng[0].chlng_name
          nextChlngName = 'PasswordVerification';
          obj.checkUsernameSuccess();
      } else {
          statusMessage = res.pArgs.response.StatusMsg;
          obj.checkUsernameFailure();
      };
  }


  componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
          this.refs.inputUsername.focus();
      });
  }


  componentWillMount() {
      console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));
  }


  updateProgress() {
      setTimeout((function() {
          this.setState({ progress: this.state.progress + (0.4 * LoadSpd) });
          if (this.state.progress < 1) {
              this.updateProgress();
          } else {
              console.log('complete');
              // this.props.navigator.push(
              //  {id: "PasswordVerification",title:nextChlngName,url:chlngJson}
              // );
          }
      }).bind(this), 5);
  }


  onUsernameChange(event) {
      this.setState({ inputUsername: event.nativeEvent.text });
  }

  checkUsername() {
      this.state.progress = 0;
      var un = this.state.inputUsername;

      if (un.length > 0) {
          AsyncStorage.setItem("userId", un);
          Main.dnaUserName = un;
          responseJson = this.props.url.chlngJson;
          responseJson.chlng_resp[0].response = un;
          Events.trigger('showNextChallenge', { response: responseJson });
          // this.updateProgress();
      } else {
          dismissKeyboard();
          InteractionManager.runAfterInteractions(() => {
            alert('Please enter a Username');
          });
      }
  }


  checkUsernameSuccess(){
    InteractionManager.runAfterInteractions(() => {
        this.props.navigator.push(
          {id: "Activation",title:nextChlngName,url:chlngJson}
        );
      });
  }


  checkUsernameFailure() {
      this.state.progress = 0;
      Animated.sequence([
          Animated.timing(this.state.logWrapOpac, {
              toValue: 1,
              duration: 1 * 0.1,
              delay: 0 * Skin.spd
          }),
          Animated.timing(this.state.progWrapOpac, {
              toValue: 0,
              duration: 500 * Skin.spd,
              delay: 0 * Skin.spd
          })
      ]).start();
      this.clearText('inputUsername')
      this.setState({ failureMessage: statusMessage });
      Animated.sequence([
          Animated.timing(this.state.logWarnOpac, {
              toValue: 1,
              duration: 500 * Skin.spd,
              delay: 0 * Skin.spd
          })
      ]).start();
      this.refs.inputUsername.focus();

  }


  getProgress(offset) {
      var progress = this.state.progress + offset;
      return progress;
  }


  clearText(fieldName) {
      this.refs[fieldName].setNativeProps({ text: '' });
  }

  render() {
    return (
      <MainActivation navigator={this.props.navigator}>
        <Animated.View style={[Skin.loadStyle.rid_wrap,{marginTop:70}]}>
          <View style={Skin.loadStyle.rid_center}>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_r]}>g</Text>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_i]}>h</Text>
            <Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_d]}>i</Text>
          </View>
        </Animated.View>

        <View style={[Skin.activationStyle.input_wrap,{marginTop:60}]}>
          <View style={Skin.activationStyle.textinput_wrap}>
            <TextInput
              ref='inputUsername'
              returnKeyType={'next'}
              autoCorrect={false}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              placeholder={'Username'}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              style={Skin.activationStyle.textinput}
              value={this.state.inputUsername}
              onSubmitEditing={this.checkUsername.bind(this)}
              onChange={this.onUsernameChange.bind(this)}
            />
          </View>
        </View>

        <View style={Skin.activationStyle.input_wrap}>
          <TouchableOpacity
            style={Skin.activationStyle.button}
            onPress={this.checkUsername.bind(this)}
            underlayColor={'#082340'}
            activeOpacity={0.8}
          >
            <Text style={Skin.activationStyle.buttontext}>
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>

        <OpenLinks />

      </MainActivation>
    );
  }
}

module.exports = UserLogin;
