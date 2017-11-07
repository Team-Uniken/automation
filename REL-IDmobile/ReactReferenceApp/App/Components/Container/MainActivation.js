/**
 *  this js is act as a container.which contain common functions use in all screen like
 *  Spinner Loder, hide keyboard on screen touch,401 popup etc
 * this screen use in challenges screen
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Modal from 'react-native-simple-modal';
import Events from 'react-native-simple-events';
import { StatusBar, View, Image, Text, Platform, ScrollView, TouchableHighlight, InteractionManager, TouchableWithoutFeedback, StyleSheet, TextInput, AsyncStorage, DeviceEventEmitter, NetInfo, } from 'react-native'
import dismissKeyboard from 'react-native-dismiss-keyboard';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Loader from '../Utils/Loader';
import Main from './Main';
import Util from "../Utils/Util";
var constant = require('../Utils/Constants');
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

import { NativeModules, NativeEventEmitter } from 'react-native';
const onGetpasswordModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);
const onGetCredentialsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

/*
  INSTANCED
 */
let obj;
let onGetCredentialSubscriptions;
let onGetpasswordSubscriptions;


class MainActivation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ColorProp: 'rgba(255,255,255,1)',
      color: '#4fadd8',
      visible: this.props.visible,
      opacity: 1,
      loadertext: 0,
      open: false,
      userName: '',
      password: '',
      baseUrl: '',
      isSettingButtonHide: 1.0,
    };

    this.cancelCreds = this.cancelCreds.bind(this);
    this.checkCreds = this.checkCreds.bind(this);
   this.selectedDialogOp = false;
    this.scrollEnabled = true;
    if (this.props.scroll != null && this.props.scroll != undefined) {
      this.scrollEnabled = this.props.scroll;
    }
    console.log('\nMain Activation in constructor');
    console.log(this.state.visible);
  }
  /*
   This is life cycle method of the react native component.
   This method is called when the component will start to load
   */
  componentWillMount() {
    if (onGetCredentialSubscriptions) {
      onGetCredentialSubscriptions.remove();
      onGetCredentialSubscriptions = null;
    }
    if (onGetpasswordSubscriptions) {
      onGetpasswordSubscriptions.remove();
      onGetpasswordSubscriptions = null;
    }
    onGetpasswordSubscriptions = onGetpasswordModuleEvt.addListener('onGetpassword',
      this.onGetpassword.bind(this));
    onGetCredentialSubscriptions = onGetCredentialsModuleEvt.addListener('onGetCredentials',
      this.onGetCredentials.bind(this));
    if (constant.USER_SESSION === "YES") {
      this.setState({ isSettingButtonHide: 0 });
    } else {
      this.setState({ isSettingButtonHide: 1.0 });
    }
  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component is Mounted/Loaded.
*/
  componentDidMount() {
    obj = this;
    Events.on('hideLoader', 'hideLoader', this.hideLoader);
    Events.on('showLoader', 'showLoader', this.showLoader);
  }

 componentWillUnmount(){
    if (onGetCredentialSubscriptions) {
      onGetCredentialSubscriptions.remove();
      onGetCredentialSubscriptions = null;
    }
    if (onGetpasswordSubscriptions) {
      onGetpasswordSubscriptions.remove();
      onGetpasswordSubscriptions = null;
    }
  }

  //to open 401 dialog 
  open() {
    obj.setState({
      open: true
    });
  }
  //to close 401 dialog 
  close() {
    obj.setState({
      open: false
    });
  }
  
  validate(){
    const user = this.state.userName;
    const pass = this.state.password;
    if (user.length != 0) {
      this.close();
    }else{
      alert('Please enter valid data');
    }
    
  }
  
  //to close keyboard
  dismiss() {
    dismissKeyboard();
  }
  //call to get 401 credential for domainUrl
  onGetCredentials(domainUrl) {
    obj.state.baseUrl = domainUrl.response;
    obj.open();
  }

  //to get stored password and call setCredentials  method
  onGetpassword(e) {
    let uName = e.response;
    AsyncStorage.getItem(e.response).then((value) => {
                                          if(value){
        value = JSON.parse(value);
        Util.decryptText(value.RPasswd).then((decryptedRPasswd)=>{
          ReactRdna.setCredentials(uName,decryptedRPasswd, true, (response) => {
            if (response) {
              console.log('immediate response is' + response[0].error);
            } else {
              console.log('immediate response is' + response[0].error);
            }
          });
        }).catch((error)=>{
                    ReactRdna.setCredentials(uName,"", true, (response) => {
                                                                          if (response) {
                                                                          console.log('immediate response is' + response[0].error);
                                                                          } else {
                                                                          console.log('immediate response is' + response[0].error);
                                                                          }
                                                                          });
                                                 
                                                 }).done();
                                          }else{
                                          ReactRdna.setCredentials(uName,"", true, (response) => {
                                                                   if (response) {
                                                                   console.log('immediate response is' + response[0].error);
                                                                   } else {
                                                                   console.log('immediate response is' + response[0].error);
                                                                   }
                                                                   });

                                          }
    }).done();
  }

  //get user name and password from 401 dialog and call setCredentials
  checkCreds() {
    const user = this.state.userName;
    const pass = this.state.password;
    if (user.length > 0) {
      ReactRdna.setCredentials(this.state.userName, this.state.password, true, (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      });
    } else {
      alert('Please enter valid data');
    }
  }
  //call when we close 401 dialog
  cancelCreds() {
    ReactRdna.setCredentials(this.state.userName, this.state.password, false, (response) => {
      if (response) {
        console.log('immediate response is' + response[0].error);
      } else {
        console.log('immediate response is' + response[0].error);
      }
    });
  }
  //onTextchange method for username TextInput
  onUserChange(event) {
    var newstate = this.state;
    newstate.userName = event.nativeEvent.text;
    this.setState(newstate);
  }
  //onTextchange method for password TextInput
  onPasswordChange(event) {
    var newstate = this.state;
    newstate.password = event.nativeEvent.text;
    this.setState(newstate);
  }

//Hide spinner progress view
  hideLoader(args) {
    console.log('\n in hideLoader of main activation');
    obj.hideLoaderView();
  }
//Show spinner progress view
  showLoader(args) {
    console.log('\n in hideLoader of main activation');
    obj.showLoaderView();
  }
//Hide spinner progress view
  hideLoaderView() {
    console.log('\n in hide Loader view of main activation');
    obj.setState({ visible: false });
    obj.setState({ opacity: 1 });
    obj.setState({ loadertext: 0 });
    obj.setState({ isSettingButtonHide: 1 });
    console.log(obj.state.visible);
  }
//Show spinner progress view
  showLoaderView() {
    console.log('\n in show Loader view of main activation');
    this.setState({ visible: true });
    this.setState({ opacity: 0 });
    this.setState({ loadertext: 1 });
    this.setState({ isSettingButtonHide: 0 });
    console.log(this.state.visible);
  }



/*
  This method is used to render the componenet with all its element.
*/
  render() {
    console.log('\n\n\n  Main Activation render called again');
    //    this.state.visible = this.props.visible;
  
      return (
        <TouchableWithoutFeedback onPress={this.dismiss}
              disabled={this.props.disabled}>
          <View style={Skin.activationStyle.container} onPress={this.dismiss} >


            <View style={[, { opacity: 1, height: Skin.SCREEN_HEIGHT, width: Skin.SCREEN_WIDTH },this.props.style?this.props.style:{}]}>
              {this.props.children}
            </View>

            <Loader visible={this.state.visible}/>
              <Modal
              onPress={() => {
              this.setState({ userName: '', password: '', open: false });this.cancelCreds();
              } }
              style={styles.modalwrap}
              overlayOpacity={0.75}
              offset={100}
              open={this.state.open}
              modalDidOpen={() => console.log('modal did open') }
              modalDidClose={() => {
              if (this.selectedDialogOp) {
              this.selectedDialogOp = false;
              this.checkCreds();
              } else {
              this.selectedDialogOp = false;
              this.setState({ userName: '', password: '', open: false });
              this.cancelCreds();
              }
              } }>
              <View style={styles.modalTitleWrap}>
              <Text style={styles.modalTitle}>
              401 Authentication
              {'\n'}
              {this.state.baseUrl}
              </Text>
              <View style={styles.border}></View>
              </View>
              <TextInput
              autoCorrect={false}
              ref='userName'
              style={styles.modalInput}
              placeholder={'Enter username'}
              value={this.state.userName}
              onChange={this.onUserChange.bind(this) }
              placeholderTextColor={Skin.colors.HINT_COLOR} />
              <View style={styles.underline}></View>
              <TextInput
              autoCorrect={false}
              ref='password'
              style={styles.modalInput}
              secureTextEntry
              placeholder={'Enter password'}
              value={this.state.password}
              onChange={this.onPasswordChange.bind(this) }
              placeholderTextColor={Skin.colors.HINT_COLOR} />
              <View style={styles.underline}></View>
              <View style={{
              flex: 1,
              flexDirection: 'row'
              }}>
              <TouchableHighlight
              onPress={() => {
              this.selectedDialogOp = false;
              this.setState({ userName: '', password: '', open: false });
              } }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
              CANCEL
              </Text>
              </TouchableHighlight>
              <TouchableHighlight
              onPress={() => {
              this.selectedDialogOp = true;
              this.validate();
              } }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
              SUBMIT
              </Text>
              </TouchableHighlight>
              </View>
              </Modal>

          </View>
        </TouchableWithoutFeedback>
      );
    

  }
}
const styles = StyleSheet.create({
                                 modalwrap: {
                                 height: 180,
                                 flexDirection: 'column',
                                 borderRadius: 15,
                                 backgroundColor: '#fff',
                                 },
                                 modalTitleWrap: {
                                 justifyContent: 'center',
                                 flex: 1,
                                 },
                                 modalTitle: {
                                 color: Skin.colors.PRIMARY_TEXT,
                                 textAlign: 'center',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 fontSize: 18,
                                 fontWeight: 'bold',
                                 backgroundColor: 'transparent',
                                 marginTop: 10,
                                 
                                 },
                                 modalButton: {
                                 flex: 1,
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 padding: 10,
                                 },
                                 modalButtonText: {
                                 textAlign: 'center',
                                 },
                                 modalInput: {
                                 textAlign: 'center',
                                 color: Skin.colors.PRIMARY_TEXT,
                                 height: 38,
                                 fontSize: 16,
                                 backgroundColor: null
                                 
                                 },
                                 border: {
                                 height: 1,
                                 marginBottom: 16,
                                 backgroundColor: Skin.colors.DIVIDER_COLOR,
                                 },
                                 underline: {
                                 height: 2,
                                 backgroundColor: Skin.colors.DIVIDER_COLOR,
                                 },
                                 DeviceListView: {
                                 justifyContent: 'center',
                                 backgroundColor: 'transparent',
                                 },
                                 button: {
                                 height: 48,
                                 width: 48,
                                 opacity: 0.6,
                                 justifyContent: "center",
                                 marginTop: 4,
                                 },
                                 images: {
                                 width: 18,
                                 height: 18,
                                 margin: 16,
                                 },
                                 customerow: {
                                 flexDirection: 'row',
                                 height: 56,
                                 backgroundColor: 'transparent',
                                 },
                                 });

module.exports = MainActivation;
