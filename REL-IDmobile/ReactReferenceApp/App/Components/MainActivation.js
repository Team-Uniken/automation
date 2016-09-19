
/*
  ALWAYS NEED
*/
'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import dismissKeyboard from 'react-native-dismiss-keyboard';
import Modal from 'react-native-simple-modal';
import Loader from './Loader';
import Events from 'react-native-simple-events';
import { InteractionManager } from "react-native";
var {DeviceEventEmitter} = require('react-native');
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var constant = require('./Constants');
/* 
  INSTANCES
*/
const {
  StatusBar,
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,

} = React;
let obj;
let getCredentialSubscriptions;
class MainActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    ColorProp:'rgba(255,255,255,1)',
    color:'#4fadd8',
    visible: this.props.visible,
     open: false,
      userName: '',
    password:'',
    baseUrl:'',
    isSettingButtonHide:1.0,
    };
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
  
  onGetCredentialsStatus(domainUrl)
  {
   
    this.open();
    this.setState({
                  baseUrl: domainUrl.response
                  });
  }
  checkCreds() {
    
    const user = this.state.userName;
    const pass = this.state.password;
    if(user.length > 0)
    {
      
    ReactRdna.setCredentials(this.state.userName,this.state.password,true,(response) => {
                     if (response) {
                     console.log('immediate response is'+response[0].error);
                     }else{
                     console.log('immediate response is'+response[0].error);
                     }
                     })
      this.close();
    }else{
      alert('Please enter valid data');
    }
  
  }
  
  cancelCreds(){
    
    ReactRdna.setCredentials(this.state.userName,this.state.password,true,(response) => {
                             if (response) {
                             console.log('immediate response is'+response[0].error);
                             }else{
                             console.log('immediate response is'+response[0].error);
                             }
                             })
    
     this.close();
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
    obj=this;
    Events.on('hideLoader', 'hideLoader', this.hideLoader);
    Events.on('showLoader', 'showLoader', this.showLoader);
  }
  
  componentWillMount(){
    
    if(getCredentialSubscriptions){
      getCredentialSubscriptions.remove();
    }
    getCredentialSubscriptions  = DeviceEventEmitter.addListener(
                                                                 'onGetCredentials',
                                                                 this.onGetCredentialsStatus.bind(this)
                                                                 );
   
      if(  constant.USER_SESSION === "YES"){
        this.setState({isSettingButtonHide: 0});
      }else{
        this.setState({isSettingButtonHide:1.0});
      }
    
    
  }
 
  
  hideLoader(args){
  console.log('\n in hideLoader of main activation');
  obj.hideLoaderView();
  }
  
  showLoader(args){
    console.log('\n in hideLoader of main activation');
    obj.showLoaderView();
  }
  
  hideLoaderView(){
  console.log('\n in hide Loader view of main activation');
  this.setState({visible: false});
    console.log(this.state.visible);
  }
  showLoaderView(){
    console.log('\n in show Loader view of main activation');
    this.setState({visible: true});
    console.log(this.state.visible);
  }
  

  render() {
    console.log('\n\n\n  Main Activation render called again');
//    this.state.visible = this.props.visible;
    if(Platform.OS == "android"){
      return (
         <TouchableWithoutFeedback onPress={this.dismiss}>
              <View style={Skin.activationStyle.container}>
                <StatusBar
                  backgroundColor={Skin.colors.DARK_PRIMARY}
                  barStyle={'light-content'}
                />
                <View style={Skin.activationStyle.bgbase} />
                <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
                <View style={Skin.activationStyle.bgcolorizer} />
                <View style={Skin.activationStyle.centering_wrap}>
                <ScrollView
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}>
                  <View style={Skin.activationStyle.wrap}>
                    {this.props.children}
                  </View>
                </ScrollView>
                </View>
                <TouchableHighlight
                  activeOpacity={1.0}
                  style={{
                    backgroundColor: 'white',
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 20,
                  }}
                  underlayColor={Skin.colors.DARK_PRIMARY}
                  onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
                >
                  <View>
                    <Text
                      style={{
                        color: Skin.colors.DARK_PRIMARY,
                        fontSize: 30,
                      }}
                    >
                    {Skin.icon.settings}
                    </Text>
              
                  </View>
                </TouchableHighlight>
                <Loader visible={this.state.visible}/>
              
              </View>
               </TouchableWithoutFeedback>
          );
    }else if(Platform.OS == "ios"){
        return (
          <TouchableWithoutFeedback onPress={this.dismiss}>
            <View style={Skin.activationStyle.container}>
              <StatusBar
                backgroundColor={Skin.colors.DARK_PRIMARY}
                barStyle={'light-content'}
              />
              <View style={Skin.activationStyle.bgbase} />
              <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
              <View style={Skin.statusBarStyle.default}>
                <StatusBar
                  barStyle="light-content"
                />
              </View>
              <View style={Skin.activationStyle.bgcolorizer} />
              <View style={Skin.activationStyle.centering_wrap}>
                <View style={Skin.activationStyle.wrap}>
                  {this.props.children}
                </View>
              </View>
              <TouchableHighlight
                activeOpacity={1.0}
                style={{
                  backgroundColor: 'white',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: 20,
                  opacity:this.state.isSettingButtonHide,
                }}
                underlayColor={Skin.colors.DARK_PRIMARY}
                onPress={() => this.props.navigator.push({ id: 'ConnectionProfile' })}
              >
                <View >
                  <Text
                    style={{
                      color: Skin.colors.DARK_PRIMARY,
                      fontSize: 30,
                    }}
                  >
                  {Skin.icon.settings}
                  </Text>
                </View>
              </TouchableHighlight>
                
                <Loader visible={this.state.visible}/>
              
                <Modal
                style={styles.modalwrap}
                overlayOpacity={0.75}
                offset={100}
                open={this.state.open}
                modalDidOpen={() => console.log('modal did open')}
                modalDidClose={() => this.setState({
                                                   open: false
                                                   })}>
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
                onChange={this.onUserChange.bind(this)}
                placeholderTextColor={Skin.colors.HINT_COLOR}
                 />
                <TextInput
                autoCorrect={false}
                ref='password'
                style={styles.modalInput}
                secureTextEntry
                placeholder={'Enter password'}
                value={this.state.password}
                onChange={this.onPasswordChange.bind(this)}
                placeholderTextColor={Skin.colors.HINT_COLOR}
                />
                <View style={styles.border}></View>
                <View style={{
                flex: 1,
                flexDirection: 'row'
                }}>
                <TouchableHighlight
                onPress={() => this.setState({
                                             userName:'',
                                             password:'',
                                             open: false
                                             }),this.cancelCreds.bind(this)}
                underlayColor={Skin.colors.REPPLE_COLOR}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                CANCEL
                </Text>
                </TouchableHighlight>
                <TouchableHighlight
                onPress={this.checkCreds.bind(this)}
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
                                 marginTop :10,
                                 
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
