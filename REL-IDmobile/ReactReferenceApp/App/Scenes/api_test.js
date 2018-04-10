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

    this.serviceName='serv3_portF';
    this.ip = "99.99.99.99";
    this.port = 9999;
    this.serviceStringJson= "{\"serviceName\": \"serv3_portF\",\"targetHNIP\": \"99.99.99.99\",\"app_uuid\": \"415a4174-c0c3-4ee4-8931-04c5f325db0c\",\"accessServerName\": \"cluster1\",\"targetPort\": 9999,\"portInfo\": {\"isAutoStartedPort\": 0,\"isLocalhostOnly\": 1,\"isStarted\": 0,\"isPrivacyEnabled\": 1,\"portType\": 1,\"port\": 3652}}";
    this.cipherSalt= "";
    this.cipherSpect = "";
    this.plainText = "uniken";
    this.encryptDataPacketOutput = "";
    this.decryptDataPacketOutput = ""; 
    this.plainHttpRequest = "GET /docs/index.html HTTP/1.1\r\nHost: www.nowhere123.com\r\n\r\n";
    this.encryptHttpRequestOutput = "";
    this.decryptHttpResponseOutput = ""; 


  
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

    var obj = JSON.parse(msg);
    console.log(title + "---->" + obj[0].response);
    setTimeout(() => {

      Alert.alert(
        title,
        decodeURI(msg),
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
  ReactRdna.serviceAccessStart(this.serviceStringJson,(response)=>{
    this.showMessage('serviceAccessStart',JSON.stringify(response),false);
  });
 }

 serviceAccessStop(){
  ReactRdna.serviceAccessStop(this.serviceStringJson,(response)=>{
    this.showMessage('serviceAccessStop',JSON.stringify(response),false);
  });
 }

 serviceAccessStartAll(){
  ReactRdna.serviceAccessStartAll((response)=>{
    this.showMessage('serviceAccessStartAll',JSON.stringify(response),false);
  });
 }

 serviceAccessStopAll(){
  ReactRdna.serviceAccessStopAll((response)=>{
    this.showMessage('serviceAccessStopAll',JSON.stringify(response),false);
  });
 }
 getDefaultCipherSpec(){
  ReactRdna.getDefaultCipherSpec((response)=>{
    this.cipherSpect = response[0].response;
    this.showMessage('getDefaultCipherSpec',JSON.stringify(response),false);
  });
 }

 getDefaultCipherSalt(){
  ReactRdna.getDefaultCipherSalt((response)=>{
    this.cipherSalt = response[0].response;
    this.showMessage('getDefaultCipherSalt',JSON.stringify(response),false);
  });
 }

 encryptDataPacket(){
  ReactRdna.encryptDataPacket(( ReactRdna.PRIVACY_SCOPE_DEVICE | ReactRdna.PRIVACY_SCOPE_AGENT ) ,this.cipherSpect,this.cipherSalt,this.plainText,(response)=>{
    this.encryptDataPacketOutput = response[0].response;
    this.showMessage('encryptDataPacket',JSON.stringify(response),false);
  });
 }

 decryptDataPacket(){
  ReactRdna.decryptDataPacket(( ReactRdna.PRIVACY_SCOPE_DEVICE | ReactRdna.PRIVACY_SCOPE_AGENT ),this.cipherSpect,this.cipherSalt,this.encryptDataPacketOutput,(response)=>{
    this.decryptDataPacketOutput = response[0].response;
    this.showMessage('encryptDataPacket',JSON.stringify(response),false);
  });
}

  encryptHttpRequest(){
    ReactRdna.encryptHttpRequest(ReactRdna.PRIVACY_SCOPE_DEVICE,this.cipherSpect,this.cipherSalt,this.plainHttpRequest,(response)=>{
      this.encryptHttpRequestOutput = response[0].response;
      this.showMessage('encryptHttpRequest',JSON.stringify(response),false);
    });
   }
  
   decryptHttpResponse(){
    ReactRdna.decryptHttpResponse(ReactRdna.PRIVACY_SCOPE_DEVICE,this.cipherSpect,this.cipherSalt,this.encryptHttpRequestOutput,(response)=>{
      this.decryptHttpResponseOutput = response[0].response;
      this.showMessage('decryptHttpResponse',JSON.stringify(response),false);
    });
 }

 getSessionID(){
  ReactRdna.getSessionID((response)=>{
    this.showMessage('getSessionID',JSON.stringify(response),false);
  });
 }

 getAgentID(){
  ReactRdna.getAgentID((response)=>{
    this.showMessage('getAgentID',JSON.stringify(response),false);
  });
 }

 getDeviceID(){
  ReactRdna.getDeviceID((response)=>{
    this.showMessage('getDeviceID',JSON.stringify(response),false);
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
                   <Button
                  label='getDefaultCipherSpec'
                  onPress={this.getDefaultCipherSpec.bind(this) } />
                   <Button
                  label='getDefaultCipherSalt'
                  onPress={this.getDefaultCipherSalt.bind(this) } />

                  <Button
                  label='encryptDataPacket'
                  onPress={this.encryptDataPacket.bind(this) } />
                  <Button
                  label='decryptDataPacket'
                  onPress={this.decryptDataPacket.bind(this) } />
                   <Button
                  label='encryptHttpRequest'
                  onPress={this.encryptHttpRequest.bind(this) } />
                   <Button
                  label='decryptHttpResponse'
                  onPress={this.decryptHttpResponse.bind(this) } />

                   <Button
                  label='getSessionID'
                  onPress={this.getSessionID.bind(this) } />
                   <Button
                  label='getAgentID'
                  onPress={this.getAgentID.bind(this) } />
                   <Button
                  label='getDeviceID'
                  onPress={this.getDeviceID.bind(this) } />
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

