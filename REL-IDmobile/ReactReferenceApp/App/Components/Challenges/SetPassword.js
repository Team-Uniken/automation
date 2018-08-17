/**
 *  set password screen comes in activation flow. 
 * allow you to set password and confirm it.
 */
'use strict';

/*
 ALWAYS NEED
 */ 
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';
import Util from "../Utils/Util";
import Config from 'react-native-config';
import PasswordPolicyModal from '../view/passwordPolicyModal'


/*
 Required for this js
 */
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {View, Text, TextInput, TouchableHighlight, TouchableOpacity, InteractionManager, AsyncStorage, StatusBar, ScrollView, BackHandler, Alert } from 'react-native'


/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';


/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import PolicyChecker from '../Utils/PolicyChecker';




export default class PasswordSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      cPassword: '',
      userID: '',
      showPasswordPolicy:false
    };

    this.passwordPolicy = `<html><head></head><body><ul><li>Password length must be between 8 and 16</li><li>It must contain atleast a number, an upper case character, a lower case character, and a special character</li><li>It can have only two repetition for a particular character</li><li>It should not be in ascending order eg: abcd or 1234 </li><li>It should not contain your username</li><li>Special character '#' is not allowed</li></ul></body></html>`;
    this.passwordPolicyChecker = new PolicyChecker(this.getPasswordPolicy());
    if(this.passwordPolicyChecker.isPolicyParseSuccessfull && this.passwordPolicyChecker.policy.msg)
      this.passwordPolicy = this.passwordPolicyChecker.policy.msg;
  }
  /*
This is life cycle method of the react native component.
This method is called when the component will start to load
*/
  componentWillMount() {
    AsyncStorage.getItem('RUserId').then((value) => {
      this.setState({ Username: value });
    }).done();
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
    this.refs.cPassword.focus();

  }

  getPasswordPolicy() {
    //Uncomment below for local testing - this is demo policy
    //return `maxL=16||minL=8||minDg=1||minUc=1||minLc=1||minSc=1||Repetition=2||SeqCheck=ASC||charsNotAllowed=#||userIdCheck=true||msg=<html><head></head><body><ul><li>Password length must be between 8 and 16</li><li>It must contain atleast a number, an upper case character, a lower case character, and a special character</li><li>It can have only two repetition for a particular character</li><li>It should not be in ascending order eg: abcd or 1234 </li><li>It should not contain your username</li><li>Special character '#' is not allowed</li></ul></body></html>`;

    if (this.props.url.chlngJson.chlng_info &&
      this.props.url.chlngJson.chlng_info.length > 0) {
      var infoArr=this.props.url.chlngJson.chlng_info;
      for (var i = 0; i < infoArr.length; i++) {
        var info = infoArr[i];
        if (info.key === "PasswordPolicy" && info.value && info.value.length > 0){
          return info.value;
        }
      }

      return null;
    }
  }

  //To check password policy
  validatePassword(textval) {
    if(this.passwordPolicyChecker.isPolicyParseSuccessfull){
        //alert(this.passwordPolicyChecker.policy);
        return this.passwordPolicyChecker.validateCreds(Main.dnaUserName,textval).success;
    }else{
      if (textval.toUpperCase().search(Main.dnaUserName.toUpperCase()) >= 0) {
        return false;
      }
      var passwordregex = /^(?=^.{8,16}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
      return passwordregex.test(textval);
    }
  }

  /*
    onTextchange method for Password TextInput
  */
  onPasswordChange(event) {
    this.setState({ password: event.nativeEvent.text.trim() });
    this.state.password = event.nativeEvent.text.trim();
  }
  /*onTextchange method for confirm password TextInput  */
  onConfirmPasswordChange(event) {
    this.setState({ cPassword: event.nativeEvent.text.trim() });
    this.state.cPassword = event.nativeEvent.text.trim();
  }
  /*
      This method is used to get the users entered paswword and confirmPassword to check both are same,
       and submit the same as a challenge response.
    */
  setPassword() {
    const pw = this.state.password;
    const cpw = this.state.cPassword;
    if (pw.length > 0) {
      if (cpw.length > 0) {
        if (pw === cpw) {
          if (this.validatePassword(pw)) {
            Main.dnaPasswd = pw;
            //AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ RPasswd: pw }), null); Todo: to be removed after test
            Util.saveUserDataSecure("RPasswd", pw).done();
            let responseJson = this.props.url.chlngJson;
            responseJson.chlng_resp[0].response = pw;
            AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
            AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPattern: "empty" }), null);
            dismissKeyboard();
            //AsyncStorage.setItem("isAutoPassword", 'false'); 
            Util.saveUserData("isAutoPassword", 'false');
            Util.saveUserData("isAutoPasswordPattern  ", 'false');
            Events.trigger('showNextChallenge', { response: responseJson });
          } else {
           /* var msg =  'Password should be of minimum 8 characters long with atleast 1 uppercase, 1 lowercase character, 1 numeric digit and 1 special character.Make sure user-id should not be part of the password.';

            if(this.passwordPolicyChecker.isPolicyParseSuccessfull && this.passwordPolicyChecker.policy.msg)
                msg = this.passwordPolicyChecker.policy.msg;
          */
            
            this.setState({showPasswordPolicy:true});
                /*Alert.alert(
              'Password Policy',
              msg,
              [
                { text: 'OK' }
              ]
            );*/
          }
        } else {
          alert('Password and Confirm Password do not match');
          this.setState({ password: "", cPassword: "" });
          this.refs.password.focus();
        }
      } else {
        alert('Please enter confirm password ');
      }
    } else {
      alert('Please enter password ');
      this.refs.password.focus();
    }
  }
  /*
     This method is used to return the text Submit/Continue for submit button.
   */
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'Continue';
  }
  //showPreviousChallenge on press of cross icon.
  close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }

  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout0.wrap.container}>
          <StatusBar
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'}
            />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => {
              this.close();
            } }>
              Registration
            </Title>
          </View>

          <ScrollView style={Skin.layout1.content.scrollwrap} keyboardShouldPersistTaps={true}>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>
                <View style={Skin.layout1.content.top.container}>
                  <Text style={[Skin.layout1.content.top.text, {}]}> {Config.USERNAME_LABEL}</Text>
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
                    value={this.state.password}
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
                    value={this.state.cPassword}
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
                  <Text style={[Skin.layout1.bottom.footertext, {marginBottom : 20}]}
                  onPress={ ()=>{this.setState({showPasswordPolicy:true})} }>Password Policy</Text> 
            </View>
          </View>
          <KeyboardSpacer topSpacing={50}/>
        </View>
        <PasswordPolicyModal html={this.passwordPolicy} show={this.state.showPasswordPolicy} 
            onAlertModalDismissed={()=>{
              this.setState({showPasswordPolicy:false})
            }}
            
            onAlertModalOk={()=>{
              this.setState({showPasswordPolicy:false})
            }}
            />
      </MainActivation>
    );

  }
}

module.exports = PasswordSet;
