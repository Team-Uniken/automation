/**
 *  check status of entered user if everything is right it navigate it forword else return appropriate error message
 */

'use strict';

/*
 ALWAYS NEED
 */ 
import React, { Component, } from 'react';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import TouchID from 'react-native-touch-id';
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Config from 'react-native-config';
import Finger from 'react-native-touch-id-android'

import { Text, View, Animated, InteractionManager, AsyncStorage, Platform, BackHandler, StatusBar, KeyboardAvoidingView } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import Load from '../../Scenes/Load';
import Util from '../Utils/Util'
import MainActivation from '../Container/MainActivation';
const constant = require('../Utils/Constants');
/*
 Custome View
 */
import Button from '../view/button';
import Input from '../view/input';
import Title from '../view/title';

import { NavigationActions } from 'react-navigation';
/*
 INSTANCES
 */
let responseJson;
let obj;
let savedUserName;


class ActivationCodeNoQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      inputUsername: '',
      inputPassword: '',
      login_button_text: 'Login',
      loginAttempts: 5,
      passAttempts: 5,
//      challenge: this.props.url.chlngJson,
      failureMessage: '',
      isLoaderVisible: false,
      activatonCode: '',
    };
  }


  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    obj = this;
    constant.USER_SESSION = "NO";
    constant.USER_T0 = "NO";
//    console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));


    AsyncStorage.getItem('rememberuser').then((value) => {
      if (value == undefined || value == null || value === 'empty') {

      } else {
        if (this.props.navigator.state.params.url.reset) {
        } else {
          InteractionManager.runAfterInteractions(() => {
            obj.setState({ inputUsername: value }, () => {
              obj.checkUsername();
            });
          });
        }
      }
    });
  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    obj = this;
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }

  _verifyTouchIdSupport() {
    TouchID.isSupported()
      .then(supported => {
        // Success code
        console.log('TouchID is supported.');
        obj._verifyTouchId();
      })
      .catch(error => {
        console.log('TouchID is not supported.');
        console.log(error);
      });
  }
  //onTextchange method for Enter_User TextInput
  onUsernameChange(event) {
    this.setState({ inputUsername: event.nativeEvent.text });
  }

  /*
   This method is used to get the user entered value and submit the same as a challenge response.
   */
  checkActivationCode() {
    let vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      this.setState({ activatonCode: '' });
      this.state.isPoped = true;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Activation Code');
    }
  }

  onActivationCodeChange(e) {
    this.setState({ activatonCode: e.nativeEvent.text });
  }

  // clear text of inputBox
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  
  
  //use to clear twoFactorAuthMachine navigator
  close() {
    dismissKeyboard();
//    Events.trigger('closeStateMachine');
    let responseJson = this.props.url.chlngJson;
    Events.trigger('showPreviousChallenge');
//    this.props.navigator.navigate('WelcomeScreen',{url: {
//      "chlngJson": this.props.navigator.state.params.url.chlngJson,
//      "screenId": this.props.navigator.state.params.url.screenId
//      }})
  }
  /*
   This method is used to render the componenet with all its element.
   */
  render() {
    
    return (
      <MainActivation>
        <View style={Skin.layout0.wrap.container}>          
          <View style={[Skin.layout1.wrap, { flex: 1 }, { justifyContent: 'center', backgroundColor: 'transparent' }]}>
            <View style={[Skin.layout1.title.wrap, { position: 'absolute',top:0,  backgroundColor: 'transparent' }]}>
            <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
              <Title
                onClose={() => {
                  this.close();
                }}>
              </Title>
            </View>
            <View style={[Skin.layout0.wrap.container, { position: 'absolute', zIndex : 99, flex: 1, height:Skin.SCREEN_HEIGHT, top : 0,alignSelf:'center',  flexDirection: 'column', justifyContent: "center", alignItems: 'center', marginBottom: 0 },Platform.OS==="ios"?{paddingTop:20}:{}]}>
              <Text style={[Skin.layout0.top.icon]}>  
                {Skin.icon.logo}
              </Text>
              <Text style={Skin.layout0.top.subtitle}>
                {Skin.text['2']['1'].subtitle}
              </Text>
              <Text style={Skin.layout0.top.prompt}>
                {Skin.text['2']['1'].prompt}
              </Text>
              <Text style={Skin.layout0.top.subtitle}>
                Verify Code {this.props.url.chlngJson.chlng_resp[0].challenge}
              </Text>
              <Input
                ref='inputUsername'
                returnKeyType={'next'}
                keyboardType={'text'}
                placeholder={'Enter Activation Code'}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize={false}
                autoComplete={false}
                value={this.state.activatonCode}
                onSubmitEditing={this.checkActivationCode.bind(this)}
                onChange={this.onActivationCodeChange.bind(this)} />
              <Button
                label={Skin.text['2']['1'].submit_button}
                onPress={this.checkActivationCode.bind(this)} />
                <KeyboardSpacer/>
            </View>
            
          </View>
        </View>
      </MainActivation >
    );
  }
}

module.exports = ActivationCodeNoQR;



