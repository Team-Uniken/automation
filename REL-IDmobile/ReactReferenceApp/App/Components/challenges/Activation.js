'use strict';

/*
  ALWAYS NEED
*/
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  InteractionManager,
  Platform,
  AsyncStorage,
  StyleSheet,
  AlertIOS,
  
} = ReactNative;

var Obj;
const{
  Component
} =  React;

var Camera = require("react-native-camera");

export default class Activation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
    showCamera: true,
    cameraType: Camera.constants.Type.back,
    };
  }

  onActivationCodeChange(event) {
    this.setState({ activatonCode: event.nativeEvent.text });
  }
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }

  checkActivationCode() {
    let vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    }
    else {
      alert('Enter Activation Code');
    }
  }

  componentWillMount(){
    Obj =this;
    if(Platform.OS === "android"){
       let keys = ['userData','setPattern'];
       AsyncStorage.multiRemove(keys);
    }
  }

  componentDidMount() {
    this.refs['activatonCode'].focus();
  }
  
  scanQR() {
    var test = this._onSucess;
    Events.on('onQRScanSuccess', 'onQRScanSuccess', this.onQRScanSuccess);
    Events.on('onQRScanCancel', 'onQRScanCancel', this.onQRScanCancel);
    Events.trigger('scanQRCode', test);
  }

  onQRScanSuccess(result){
    Events.rm('onQRScanSuccess', 'onQRScanSuccess');
    Events.rm('onQRScanCancel', 'onQRScanCancel');
    if(result.length!=0){
      var res = JSON.parse(result);
      var vfKey = res.key;
      var aCode = res.value;
      var exp = res.expiry;
      var obtainedVfKey = Obj.props.url.chlngJson.chlng_resp[0].challenge;
      if(obtainedVfKey===vfKey){
        let responseJson = Obj.props.url.chlngJson;
        responseJson.chlng_resp[0].response = aCode;
        Events.trigger('hideLoader', true);
        Events.trigger('showNextChallenge', { response: responseJson });
      }else{
        Events.trigger('hideLoader', true);
        alert('Verification code does not match');
      }
    }else{
      Events.trigger('hideLoader', true);
      alert('Error to scan QR code ');
    }
  }
  
  onQRScanCancel(){
    Events.rm('onQRScanSuccess', 'onQRScanSuccess');
    Events.rm('onQRScanCancel', 'onQRScanCancel');
//    alert('You clicked Cancel');
  }

  render() {

   
    return (
      <MainActivation navigator={this.props.navigator}>
        <View style={Skin.activationStyle.topGroup}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>Activation</Text>
          <Text style={Skin.activationStyle.info}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
          
          <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
              <Text style={[Skin.activationStyle.textinput,Skin.activationStyle.textinput_lead]}>
                Verify:
              </Text>
              <Text style={[Skin.activationStyle.textinput]}>
                {this.props.url.chlngJson.chlng_resp[0].challenge}
              </Text>
            </View>
          </View>

          <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
              <Text style={[Skin.activationStyle.textinput,Skin.activationStyle.textinput_lead]}>
                Activate:
              </Text>
              <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                secureTextEntry={true}
                keyboardType={'default'}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                style={Skin.activationStyle.textinput}
                value={this.state.inputUsername}
                ref={'activatonCode'}
                placeholder={'Code'}
                onChange={this.onActivationCodeChange.bind(this)}
                onSubmitEditing={this.checkActivationCode.bind(this)}
              />
            </View>
          </View>
          <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
            
            <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
            style={Skin.activationStyle.button}
            underlayColor={'#082340'}
            onPress={this.scanQR.bind(this)}
            activeOpacity={0.6}
            >
            <Text style={Skin.activationStyle.buttontext}>
            {'Scan QRCode'}
            </Text>
            </TouchableHighlight>
            </View>

          <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
              style={Skin.activationStyle.button}
              underlayColor={'#082340'}
              onPress={this.checkActivationCode.bind(this)}
              activeOpacity={0.6}
            >
              <Text style={Skin.activationStyle.buttontext}>
                {this.btnText()}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </MainActivation>
    );
    }
}
var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               justifyContent: "center",
                               alignItems: "center",
                               backgroundColor: "transparent",
                               }
                               });
