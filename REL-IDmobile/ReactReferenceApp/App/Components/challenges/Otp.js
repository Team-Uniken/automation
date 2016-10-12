'use strict';

/*
  ALWAYS NEED
*/
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';

/*
  CALLED
*/
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

/*
  Instantiaions
*/
let responseJson;
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
} = ReactNative;

const{Component} =  React;
var Camera = require("react-native-camera");
var Obj;
class Activation extends Component{


  constructor(props){
    super(props);
    this.state = {
      accessCode : ''

    };
  }
  componentDidMount() {
    Obj = this;
		}

  checkAccessCode(){
    var AcCode = this.state.accessCode;
    if(AcCode.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = AcCode;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Access Code');
    }
  }
  onAccessCodeChange(event){
    this.setState({accessCode: event.nativeEvent.text});
  }

btnText(){
	if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
		return "Submit";
	}else{
		return "Continue";
	}}
  
  scanQR() {
    var test = this._onSucess;
    Events.on('onQRScanSuccess', 'onQRScanSuccess', this.onQRScanSuccess);
    Events.on('onQRScanCancel', 'onQRScanCancel', this.onQRScanCancel);
    Events.trigger('scanQRCode', '');
  }
  
  onQRScanSuccess(result){
    Events.rm('onQRScanSuccess', 'onQRScanSuccess');
    Events.rm('onQRScanCancel', 'onQRScanCancel');
    if(result.length!=0){
      var res = JSON.parse(result);
      var aCode = res.Access_Code;
      var aValue = res.Access_Value;
      var exp = res.expiry;
      var obtained_ACode = Obj.props.url.chlngJson.chlng_resp[0].challenge;
      if(obtained_ACode===aCode){
        let responseJson = Obj.props.url.chlngJson;
        responseJson.chlng_resp[0].response = aValue;
        Events.trigger('hideLoader', true);
        Events.trigger('showNextChallenge', { response: responseJson });
      }else{
        alert('Access code does not match');
      }
    }else{
      alert('Error to scan QR code ');
    }
  }
  
  onQRScanCancel(){
    Events.rm('onQRScanSuccess', 'onQRScanSuccess');
    Events.rm('onQRScanCancel', 'onQRScanCancel');
//    alert('You Clicked Cancel');
  }


	render() {

		return (
      <MainActivation navigator={this.props.navigator}>
        <View style={{marginTop:38}}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>Access Code</Text>
          <Text style={Skin.activationStyle.info}>Enter the matching Access Code.</Text>
        </View>

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
              secureTextEntry
              keyboardType={'default'}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              style={Skin.activationStyle.textinput}
              value={this.state.inputUsername}
              ref={'accessCode'}
              placeholder={'Code'}
              onChange={this.onAccessCodeChange.bind(this)}
              onSubmitEditing={this.checkAccessCode.bind(this)}
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
            onPress={this.checkAccessCode.bind(this)}
            activeOpacity={0.6}
          >
            <Text style={Skin.activationStyle.buttontext}>
              {this.btnText()}
            </Text>
          </TouchableHighlight>
        </View>
      </MainActivation>

		);
	}
}

module.exports = Activation;
