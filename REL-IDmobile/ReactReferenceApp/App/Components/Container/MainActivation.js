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
var constant = require('../Constants');
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

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  dismiss() {
    dismissKeyboard();
  }

  onGetCredentials(domainUrl) {
    this.state.baseUrl = domainUrl.response;
    this.open();
  }

  onGetpassword(e) {
    let uName = e.response;
    AsyncStorage.getItem(e.response).then((value) => {
      try {
        value = JSON.parse(value);
        ReactRdna.setCredentials(uName, value.RPasswd, true, (response) => {
          if (response) {
            console.log('immediate response is' + response[0].error);
          } else {
            console.log('immediate response is' + response[0].error);
          }
        });
        //                                                ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value.RPasswd, (response) => {
        //                                                                            if (response) {
        //                                                                            console.log('immediate response of encrypt data packet is is' + response[0].error);
        //                                                                            ReactRdna.setCredentials(uName,response[0].response,true,(response) => {
        //                                                                                                     if (response) {
        //                                                                                                     console.log('immediate response is'+response[0].error);
        //                                                                                                     }else{
        //                                                                                                     console.log('immediate response is'+response[0].error);
        //                                                                                                     }
        //                                                                                                     });
        //                                                                            } else {
        //                                                                            console.log('immediate response is' + response[0].response);
        //                                                                            }
        //                                                                            });
      } catch (e) { }
    }).done();
  }

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

  cancelCreds() {

    ReactRdna.setCredentials(this.state.userName, this.state.password, false, (response) => {
      if (response) {
        console.log('immediate response is' + response[0].error);
      } else {
        console.log('immediate response is' + response[0].error);
      }
    });
  }

  onUserChange(event) {
    var newstate = this.state;
    newstate.userName = event.nativeEvent.text;
    this.setState(newstate);
  }

  onPasswordChange(event) {
    var newstate = this.state;
    newstate.password = event.nativeEvent.text;
    this.setState(newstate);
  }

  componentDidMount() {
    obj = this;
    Events.on('hideLoader', 'hideLoader', this.hideLoader);
    Events.on('showLoader', 'showLoader', this.showLoader);
  }

  componentWillMount() {

    if (onGetCredentialSubscriptions) {
      onGetCredentialSubscriptions.remove();
    }
    if (onGetpasswordSubscriptions) {
      onGetpasswordSubscriptions.remove();
    }
    //    getCredentialSubscriptions  = DeviceEventEmitter.addListener(
    //                                                                 'onGetCredentials',
    //                                                                 this.onGetCredentialsStatus.bind(this)
    //                                                                 );
    //    passwordSubscriptions = DeviceEventEmitter.addListener('getpasswordSubscriptions',this.onpasswordSubscriptions.bind(this));


    onGetpasswordSubscriptions = onGetpasswordModuleEvt.addListener('onGetpassword',
      this.onGetpassword.bind(this));
    onGetCredentialSubscriptions = onGetCredentialsModuleEvt.addListener('onGetCredentials',
      this.onGetCredentials.bind.bind(this));



    if (constant.USER_SESSION === "YES") {
      this.setState({ isSettingButtonHide: 0 });
    } else {
      this.setState({ isSettingButtonHide: 1.0 });
    }
  }

  hideLoader(args) {
    console.log('\n in hideLoader of main activation');
    obj.hideLoaderView();
  }

  showLoader(args) {
    console.log('\n in hideLoader of main activation');
    obj.showLoaderView();
  }

  hideLoaderView() {
    console.log('\n in hide Loader view of main activation');
    this.setState({ visible: false });
    this.setState({ opacity: 1 });
    this.setState({ loadertext: 0 });
    this.setState({ isSettingButtonHide: 1 });
    console.log(this.state.visible);
  }

  showLoaderView() {
    console.log('\n in show Loader view of main activation');
    this.setState({ visible: true });
    this.setState({ opacity: 0 });
    this.setState({ loadertext: 1 });
    this.setState({ isSettingButtonHide: 0 });
    console.log(this.state.visible);
  }


  //   render() {
  //     console.log('\n\n\n  Main Activation render called again');
  // //    this.state.visible = this.props.visible;
  //     if(Platform.OS == "android"){
  //       return (
  //               <View style={Skin.activationStyle.container} onPress={this.dismiss}>
  //                 <StatusBar
  //                   backgroundColor={Skin.main.STATUS_BAR_BG}
  //                   barStyle={'light-content'}
  //                 />
  //                 <View style={Skin.activationStyle.bgbase} />
  //                 <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
  //                 <View style={Skin.activationStyle.bgcolorizer} />
  //                   <Text style={[Skin.activationStyle.loadertext,{opacity:0}]}>Processing...</Text>
  //                 <View style={[Skin.activationStyle.centering_wrap,{opacity:this.state.opacity}]}>
  //                   <View style={Skin.activationStyle.wrap}>
  //                     {this.props.children}
  //                   </View>
  //                 </View>
  //                 <TouchableHighlight
  //                   activeOpacity={1.0}
  //                   style={{
  //                     backgroundColor: Skin.login.CONNECTION_BUTTON_BG,
  //                     height: 50,
  //                     width: 50,
  //                     alignItems: 'center',
  //                     justifyContent: 'center',
  //                     borderTopRightRadius: 20,
  //                     opacity:this.state.isSettingButtonHide,
  //                   }}
  //                   underlayColor={Skin.login.CONNECTION_BUTTON_UNDERLAY}
  //                   onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
  //                 >
  //                   <View>
  //                     <Text
  //                       style={{
  //                         color: Skin.login.CONNECTION_BUTTON_ICON_COLOR,
  //                         fontSize: 30,
  //                       }}
  //                     >
  //                     {Skin.icon.settings}
  //                     </Text>

  //                   </View>
  //                 </TouchableHighlight>
  //                 <Loader visible={this.state.visible}/>
  //                 <Modal
  //                 style={styles.modalwrap}
  //                 overlayOpacity={0.75}
  //                 offset={100}
  //                 open={this.state.open}
  //                 modalDidOpen={() => console.log('modal did open')}
  //                 modalDidClose={() => {
  //                                        if(this.selectedDialogOp){
  //                                          this.selectedDialogOp = false;
  //                                          this.checkCreds();
  //                                        }
  //                                        else{
  //                                          this.selectedDialogOp = false;
  //                                          this.cancelCreds();
  //                                        }
  //                                    }}>
  //                 <View style={styles.modalTitleWrap}>
  //                 <Text style={styles.modalTitle}>
  //                 401 Authentication{'\n'}{this.state.baseUrl}
  //                 </Text>

  //                 <View style={styles.border}></View>

  //                 </View>
  //                 <TextInput
  //                 autoCorrect={false}
  //                 ref='userName'
  //                 style={styles.modalInput}
  //                 placeholder={'Enter username'}
  //                 value={this.state.userName}
  //                 onChange={this.onUserChange.bind(this)}
  //                 placeholderTextColor={Skin.colors.HINT_COLOR}
  //                  />
  //                 <TextInput
  //                 autoCorrect={false}
  //                 ref='password'
  //                 style={styles.modalInput}
  //                 secureTextEntry
  //                 placeholder={'Enter password'}
  //                 value={this.state.password}
  //                 onChange={this.onPasswordChange.bind(this)}
  //                 placeholderTextColor={Skin.colors.HINT_COLOR}
  //                 />
  //                 <View style={styles.border}></View>
  //                 <View style={{
  //                 flex: 1,
  //                 flexDirection: 'row'
  //                 }}>
  //                 <TouchableHighlight
  //                 onPress={() => {
  //                                   this.selectedDialogOp = false;
  //                                   this.setState({
  //                                               userName:'',
  //                                               password:'',
  //                                               open: false
  //                                               });
  //                                 }}
  //                 underlayColor={Skin.colors.REPPLE_COLOR}
  //                 style={styles.modalButton}>
  //                 <Text style={styles.modalButtonText}>
  //                 CANCEL
  //                 </Text>
  //                 </TouchableHighlight>
  //                 <TouchableHighlight
  //                 onPress={()=> {
  //                                selectedDialogOp = true;
  //                                this.close();
  //                               }}
  //                 underlayColor={Skin.colors.REPPLE_COLOR}
  //                 style={styles.modalButton}>
  //                 <Text style={styles.modalButtonText}>
  //                 SUBMIT
  //                 </Text>
  //                 </TouchableHighlight>
  //                 </View>
  //                 </Modal>
  //               </View>
  //           );
  //     }else if(Platform.OS == "ios"){
  //         return (
  //           <TouchableWithoutFeedback onPress={this.dismiss}>
  //             <View style={Skin.activationStyle.container}>
  //               <StatusBar
  //                 backgroundColor={Skin.main.STATUS_BAR_BG}
  //                 barStyle={'light-content'}
  //               />
  //               <View style={Skin.activationStyle.bgbase} />
  //               <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
  //               <View style={Skin.statusBarStyle.default}>
  //                 <StatusBar
  //                   barStyle="light-content"
  //                 />
  //               </View>
  //               <View style={Skin.activationStyle.bgcolorizer} />
  //                 <View style={[Skin.activationStyle.centering_wrap,{opacity:this.state.opacity}]}>
  //                 <View style={Skin.activationStyle.wrap}>
  //                   {this.props.children}
  //                 </View>
  //               </View>
  //               <TouchableHighlight
  //                 activeOpacity={1.0}
  //                 style={{
  //                   backgroundColor: Skin.login.CONNECTION_BUTTON_BG,
  //                   height: 50,
  //                   width: 50,
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                   borderTopRightRadius: 20,
  //                   opacity:this.state.isSettingButtonHide,
  //                 }}
  //                 underlayColor={Skin.login.CONNECTION_BUTTON_UNDERLAY}
  //                 onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
  //               >
  //                 <View >
  //                   <Text
  //                     style={{
  //                       color: Skin.login.CONNECTION_BUTTON_ICON_COLOR,
  //                       fontSize: 30,
  //                     }}
  //                   >
  //                   {Skin.icon.settings}
  //                   </Text>
  //                 </View>
  //               </TouchableHighlight>

  //                 <Loader visible={this.state.visible}/>

  //                 <Modal
  //                 style={styles.modalwrap}
  //                 overlayOpacity={0.75}
  //                 offset={100}
  //                 open={this.state.open}
  //                 modalDidOpen={() => console.log('modal did open')}
  //                 modalDidClose={() => {
  //                                        if(this.selectedDialogOp){
  //                                          this.selectedDialogOp = false;
  //                                          this.checkCreds();
  //                                        }
  //                                        else{
  //                                          this.selectedDialogOp = false;
  //                                          this.cancelCreds();
  //                                        }
  //                                    }}>
  //                 <View style={styles.modalTitleWrap}>
  //                 <Text style={styles.modalTitle}>
  //                 401 Authentication{'\n'}{this.state.baseUrl}
  //                 </Text>

  //                 <View style={styles.border}></View>
  //                 </View>
  //                 <TextInput
  //                 autoCorrect={false}
  //                 ref='userName'
  //                 style={styles.modalInput}
  //                 placeholder={'Enter username'}
  //                 value={this.state.userName}
  //                 onChange={this.onUserChange.bind(this)}
  //                 placeholderTextColor={Skin.colors.HINT_COLOR}
  //                  />
  //                 <TextInput
  //                 autoCorrect={false}
  //                 ref='password'
  //                 style={styles.modalInput}
  //                 secureTextEntry
  //                 placeholder={'Enter password'}
  //                 value={this.state.password}
  //                 onChange={this.onPasswordChange.bind(this)}
  //                 placeholderTextColor={Skin.colors.HINT_COLOR}
  //                 />
  //                 <View style={styles.border}></View>
  //                 <View style={{
  //                 flex: 1,
  //                 flexDirection: 'row'
  //                 }}>
  //                 <TouchableHighlight
  //                 onPress={() => {
  //                                   this.selectedDialogOp = false;
  //                                   this.setState({
  //                                               userName:'',
  //                                               password:'',
  //                                               open: false
  //                                               });
  //                               }}
  //                 underlayColor={Skin.colors.REPPLE_COLOR}
  //                 style={styles.modalButton}>
  //                 <Text style={styles.modalButtonText}>
  //                 CANCEL
  //                 </Text>
  //                 </TouchableHighlight>
  //                 <TouchableHighlight
  //                 onPress={()=> {
  //                                this.selectedDialogOp = true;
  //                                this.close();
  //                               }}
  //                 underlayColor={Skin.colors.REPPLE_COLOR}
  //                 style={styles.modalButton}>
  //                 <Text style={styles.modalButtonText}>
  //                 SUBMIT
  //                 </Text>
  //                 </TouchableHighlight>
  //                 </View>
  //                 </Modal>

  //             </View>

  //           </TouchableWithoutFeedback>
  //         );
  //     }
  //   }

  render() {
    console.log('\n\n\n  Main Activation render called again');
    //    this.state.visible = this.props.visible;
    if (Platform.OS == "android") {
      return (

        <TouchableWithoutFeedback onPress={this.dismiss}>
          <View style={Skin.activationStyle.container} onPress={this.dismiss}>


            <View style={[, { opacity: 1, height: Skin.SCREEN_HEIGHT, width: Skin.SCREEN_WIDTH }]}>
              {this.props.children}
            </View>

            <Loader visible={this.state.visible}/>
            <Modal
              style={styles.modalwrap}
              overlayOpacity={0.75}
              offset={100}
              open={this.state.open}
              modalDidOpen={() => console.log('modal did open') }
              modalDidClose={() => {
                if (this.selectedDialogOp) {
                  this.selectedDialogOp = false;
                  this.checkCreds();
                }
                else {
                  this.selectedDialogOp = false;
                  this.cancelCreds();
                }
              } }>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalTitle}>
                  401 Authentication{'\n'}{this.state.baseUrl}
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
                placeholderTextColor={Skin.colors.HINT_COLOR}
                />
              <TextInput
                autoCorrect={false}
                ref='password'
                style={styles.modalInput}
                secureTextEntry
                placeholder={'Enter password'}
                value={this.state.password}
                onChange={this.onPasswordChange.bind(this) }
                placeholderTextColor={Skin.colors.HINT_COLOR}
                />
              <View style={styles.border}></View>
              <View style={{
                flex: 1,
                flexDirection: 'row'
              }}>
                <TouchableHighlight
                  onPress={() => {
                    this.selectedDialogOp = false;
                    this.setState({
                      userName: '',
                      password: '',
                      open: false
                    });
                  } }
                  underlayColor={Skin.colors.REPPLE_COLOR}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    CANCEL
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    selectedDialogOp = true;
                    this.close();
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
    } else if (Platform.OS == "ios") {
      return (

        <TouchableWithoutFeedback onPress={this.dismiss}>
          <View style={Skin.activationStyle.container} onPress={this.dismiss}>


            <View style={[, { opacity: 1, height: Skin.SCREEN_HEIGHT, width: Skin.SCREEN_WIDTH }]}>
              {this.props.children}
            </View>

            <Loader visible={this.state.visible}/>
            <Modal
              style={styles.modalwrap}
              overlayOpacity={0.75}
              offset={100}
              open={this.state.open}
              modalDidOpen={() => console.log('modal did open') }
              modalDidClose={() => {
                if (this.selectedDialogOp) {
                  this.selectedDialogOp = false;
                  this.checkCreds();
                }
                else {
                  this.selectedDialogOp = false;
                  this.cancelCreds();
                }
              } }>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalTitle}>
                  401 Authentication{'\n'}{this.state.baseUrl}
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
                placeholderTextColor={Skin.colors.HINT_COLOR}
                />
              <TextInput
                autoCorrect={false}
                ref='password'
                style={styles.modalInput}
                secureTextEntry
                placeholder={'Enter password'}
                value={this.state.password}
                onChange={this.onPasswordChange.bind(this) }
                placeholderTextColor={Skin.colors.HINT_COLOR}
                />
              <View style={styles.border}></View>
              <View style={{
                flex: 1,
                flexDirection: 'row'
              }}>
                <TouchableHighlight
                  onPress={() => {
                    this.selectedDialogOp = false;
                    this.setState({
                      userName: '',
                      password: '',
                      open: false
                    });
                  } }
                  underlayColor={Skin.colors.REPPLE_COLOR}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    CANCEL
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    selectedDialogOp = true;
                    this.close();
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
}
const styles = StyleSheet.create({
  modalwrap: {
    height: 160,
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
    textAlign: 'left',
    color: Skin.colors.PRIMARY_TEXT,
    height: 35,
    fontSize: 16,

  },
  border: {
    height: 1,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
    marginBottom: 10,
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
