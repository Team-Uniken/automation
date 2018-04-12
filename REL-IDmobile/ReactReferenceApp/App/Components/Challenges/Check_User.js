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

import { Text, View, Animated, InteractionManager, AsyncStorage, Platform, BackHandler, StatusBar, KeyboardAvoidingView } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import Load from '../../Scenes/Load';
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


class UserLogin extends Component {
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
    };

    this.login = this.login.bind(this);
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
  checkUsername() {

    var un = this.state.inputUsername;
    if (Config.ENABLE_AUTO_PASSWORD === 'true') {

      AsyncStorage.getItem(un.trim()).then((value) => {
        if (value) {
          try {
            value = JSON.parse(value);
            this.state.rpass = value.RPasswd;
            if (value.ERPasswd && value.ERPasswd !== "empty") {
              if (Platform.OS === 'ios') {
              TouchID.isSupported()
                .then((supported) => {
                  // Success code
                  console.log('TouchID is supported.');
                  this.login();
                })
                .catch((error) => {
                  // Failure code
                  console.log(error);
                  alert("Please enable Touch ID from Setting");

                });
              }else{
                //android touch id and pattern changes need to done
                this.login();
              }
            } else {
              this.login();
            }
            // this.forceUpdate();
          } catch (e) { }
        } else {
            this.login();
        }
      }).done();

    } else {
      this.login();
    }
  }

  login(){
    this.state.progress = 0;
    var un = this.state.inputUsername;
    un = un.trim();

    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      AsyncStorage.setItem("RUserId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });
      this.setState({ inputUsername: '' });

    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        alert('Please enter a valid username');
      });
    }
  }

  // clear text of inputBox
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }
  
  
  //use to clear twoFactorAuthMachine navigator
  close() {
    dismissKeyboard();
//    Events.trigger('closeStateMachine');
    const resetActionshowFirstChallenge = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'WelcomeScreen',params:{url: {
              "chlngJson": this.props.navigator.state.params.url.chlngJson,
              "screenId": this.props.navigator.state.params.url.screenId
              },title:this.props.navigator.state.params.url.screenId}})
      ]
      })
    this.props.navigator.dispatch(resetActionshowFirstChallenge)
    
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
              <Input
                ref='inputUsername'
                returnKeyType={'next'}
                keyboardType={'email-address'}
                placeholder={'Enter Username/Email'}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize={false}
                autoComplete={false}
                value={this.state.inputUsername}
                onSubmitEditing={this.checkUsername.bind(this)}
                onChange={this.onUsernameChange.bind(this)} />
              <Button
                label={Skin.text['2']['1'].submit_button}
                onPress={this.checkUsername.bind(this)} />
                <KeyboardSpacer/>
            </View>
            
          </View>
        </View>
      </MainActivation >
    );
  }
}

module.exports = UserLogin;
