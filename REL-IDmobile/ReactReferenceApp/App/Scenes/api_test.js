/*
 *Simple self registration screen.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import Modal from 'react-native-simple-modal';
import hash from 'hash.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Keyboard, StatusBar, StyleSheet, Text, View, BackHandler, TouchableHighlight, Platform, TouchableOpacity, WebView, TextInput, Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, NetInfo, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../Skin';
import WebViewAndroid from '../android_native_modules/nativewebview';
import Main from '../Components/Container/Main';
import MainActivation from '../Components/Container/MainActivation';
import Util from '../Components/Utils/Util'
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
 Custome View
 */
import Title from '../Components/view/title';
import Button from '../Components/view/button';
import Checkbox from '../Components/view/checkbox';
import Input from '../Components/view/input';

import { NavigationActions } from 'react-navigation'
/*
  INSTANCES
 */
var obj;
var responseJson;




class ApiTest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      check: false,
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phoneNumber: '',
      value: this.props.value,
      resetSlider: false,
      keyboardVisible: false,
    };

    this.sessionId = null;
   // this.close = this.close.bind(this);
    //this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
    this.showMessage = this.showMessage.bind(this);

    this.serviceName='test';
    this.ip = "10.0.0.21";
    this.port = 8080;
    this.serviceStringJson= '{}';
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component will start to load
    */
  componentWillMount() {
    obj = this;
    this.state.value = 0;
    InteractionManager.runAfterInteractions(() => {
     // this.refs.firstname.focus();
    });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    



    ReactRdna.getSessionID((response)=>{
      if(response[0].error ==0){
        this.sessionId = response[0].response;
      }
    });
  }


  keyboardWillShow(e) {
    this.setState({ keyboardVisible: true })
    //Alert.alert('yes')
  }

  keyboardWillHide(e) {
    this.setState({ keyboardVisible: false })
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  
  //show alert dailog with msg and title pass to it
  showMessage(title, msg, press) {
    setTimeout(() => {

      Alert.alert(
        title,
        msg,
        [{
          text: 'OK',
          onPress: () => {
            if (press) {
              //            obj.props.navigator.pop();
              obj.checkUsername();

            }

          }
        }],
        { cancelable: false }
      )
    }, 100);
  }
  /*
     This method is used to get the confirmEmail and submit the same as a challenge response and call showNextChallenge.
   */
  checkUsername() {
    this.state.progress = 0;
    var un = this.state.confirmEmail;
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      AsyncStorage.setItem("RUserId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          alert('Please enter a valid username');
        }, 100);
      });
    }
  }

  //Return platform specific webView to term and Conditions Page.
  getWebView() {
    if (Platform.OS === 'ios') {
      return (
        <WebView
          automaticallyAdjustContentInsets={false}
          source={{ uri: 'http://api.relid.uniken.com/' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          //          onNavigationStateChange={this.onNavigationStateChange.bind(this) }
          onLoad={() => { console.log('loaded') } }
          scalesPageToFit={true}
          scrollEnabled={true}
          />
      );
    } else {
      return (
        <WebViewAndroid
          style={{ height: 200 }}
          automaticallyAdjustContentInsets={false}
          source={{ uri: 'http://api.relid.uniken.com/' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onLoad={() => { console.log('loaded') } }
          scalesPageToFit={false}
          scrollEnabled={true}
          javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
          />
      );
    }
  }

  /*
    This method is used to render the componenet with all its element.
  */

 getServiceByServiceName(){
  ReactRdna.getServiceByServiceName(this.serviceName, (response) => {
   this.showMessage('getServiceByServiceName',JSON.stringify(response),false);
  });
 }

 getServiceByTargetCoordinate(){

  ReactRdna.getServiceByTargetCoordinate(this.ip, this.port,(response)=>{
    this.showMessage('getServiceByTargetCoordinate',JSON.stringify(response),false);
  });

 }

 getAllServices(){

  ReactRdna.getAllServices((response)=>{
      this.showMessage('getAllServices',JSON.stringify(response),false);
    });
 }

 serviceAccessStart(){
  ReactRdna.getAllServices(this.serviceStringJson,(response)=>{
    this.showMessage('serviceAccessStart',JSON.stringify(response),false);
  });
 }

 serviceAccessStop(){
  ReactRdna.serviceAccessStop(this.serviceStringJson,(response)=>{
    this.showMessage('serviceAccessStop',JSON.stringify(response),false);
  });
 }

 serviceAccessStartAll(){
  ReactRdna.serviceAccessStartAll((reponse)=>{
    this.showMessage('serviceAccessStartAll',JSON.stringify(respnse),false);
  });
 }

 serviceAccessStopAll(){
  ReactRdna.serviceAccessStopAll((reponse)=>{
    this.showMessage('serviceAccessStopAll',JSON.stringify(respnse),false);
  });
 }

  render() {
    return (
      <View style={[Skin.layout0.wrap.container, { flex: 1 }]}>
        <MainActivation>
          <View style={Skin.layout1.wrap}>
            <StatusBar
              style={Skin.layout1.statusbar}
              backgroundColor={Skin.main.STATUS_BAR_BG}
              barStyle={'default'} />
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
                Api Tester
              </Title>
            </View>
            <ScrollView style={Skin.layout1.content.scrollwrap} keyboardShouldPersistTaps={true} >
              <View style={Skin.layout1.content.wrap}>
                <View style={Skin.layout1.content.container}>
                  <View>
                  <Button
                  label='getServiceByServiceName'
                  onPress={this.getServiceByServiceName.bind(this) } />
                  <Button
                  label='getServiceByTargetCoordinate'
                  onPress={this.getServiceByTargetCoordinate.bind(this) } />
                  <Button
                  label='getAllServices'
                  onPress={this.getAllServices.bind(this) } />
                   <Button
                  label='serviceAccessStart'
                  onPress={this.serviceAccessStart.bind(this) } />
                   <Button
                  label='serviceAccessStop'
                  onPress={this.serviceAccessStop.bind(this) } />
                   <Button
                  label='serviceAccessStartAll'
                  onPress={this.serviceAccessStartAll.bind(this) } />
                   <Button
                  label='serviceAccessStopAll'
                  onPress={this.serviceAccessStopAll.bind(this) } />
                  </View>
                </View>
              </View>
            </ScrollView>
      <KeyboardSpacer/>
     
      
          </View>
        </MainActivation>
        <Modal
          style={Skin.layout1.termandcondition}
          offset={0}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => this.setState({
            open: false
          }) }>

          <View style={{ backgroundColor: Skin.colors.BACK_GRAY, flex: 1 }}>
            {this.getWebView() }
          </View>
        </Modal>
      </View>
    );
  }
}

module.exports = ApiTest;

