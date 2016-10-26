'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, VibrationIOS, TextInput, TouchableHighlight, InteractionManager, Platform, AsyncStorage, AlertIOS, Keyboard, StatusBar, ScrollView, Alert, } from 'react-native';

//const {Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;


var Obj;

import Camera from 'react-native-camera';
import Events from 'react-native-simple-events';
import Skin from '../../Skin';
import MainActivation from '../MainActivation';


import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer';

var QRCodeScreen = React.createClass({

  getInitialState: function(props) {
    return {
      activatonCode: '',
      showCamera: true,
      cameraType: Camera.constants.Type.back,
    };
  },

  propTypes: {
    cancelButtonVisible: React.PropTypes.bool,
    cancelButtonTitle: React.PropTypes.string,
    onSucess: React.PropTypes.func,
    onCancel: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      cancelButtonVisible: true,
      cancelButtonTitle: 'Cancel',
      url: {
        chlngJson: {
          chlng_resp: [{
            challenge: 'ABCDEFG'
          }]
        }
      }
    };
  },

  _onBarCodeRead: function(result) {
    var $this = this;

    if (this.barCodeFlag) {
      this.barCodeFlag = false;

      setTimeout(function() {
        // $this.props.navigator.pop();

        //Events.trigger('onQRSuccess', result.data);
        $this.setState({ showCamera: false });
        Events.trigger('showLoader', true);
        $this.onQRScanSuccess(result.data);
      }, 1000);
    }
  },

  onActivationCodeChange: function(event) {
    this.setState({ activatonCode: event.nativeEvent.text });
  },

  btnText: function() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  },

  checkActivationCode: function() {
    let vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Activation Code');
    }
  },

  componentWillMount: function() {
    Obj = this;
  },

  componentDidMount: function() {
    // this.refs['activatonCode'].focus();
  },

  onQRScanSuccess: function(result) {
    var $this = this;
    if (result.length != 0) {
      var res = JSON.parse(result);
      var vfKey = res.key;
      var aCode = res.value;
      var exp = res.expiry;
      var obtainedVfKey = Obj.props.url.chlngJson.chlng_resp[0].challenge;
      if (obtainedVfKey === vfKey) {
        let responseJson = Obj.props.url.chlngJson;
        responseJson.chlng_resp[0].response = aCode;
        Events.trigger('showNextChallenge', {
          response: responseJson
        });
      } else {
        Events.trigger('hideLoader', true);

        alert('Verification code does not match');
        setTimeout(function() {
          $this.setState({ showCamera: true });
        }, 2000);
      }
    } else {
      Events.trigger('hideLoader', true);
      alert('Error to scan QR code ');
      setTimeout(function() {
        $this.setState({ showCamera: true });
      }, 2000);

    }
  },

  renderIf: function(condition, jsx) {
    if (condition) {
      return jsx;
    }
  },

  render: function() {
    var cancelButton = null;
    this.barCodeFlag = true;
    if (this.props.cancelButtonVisible) {
      cancelButton = <CancelButton
                       onPress={this._onPressCancel}
                       title={this.props.cancelButtonTitle} />;
    }

    var $this = this;

    // return (
    // <MainActivation navigator={this.props.navigator}>
    //   <View style={Skin.activationStyle.topGroup}>
    //     <Text style={Skin.activationStyle.title}>Activation</Text>

    //     <Text style={[Skin.activationStyle.input_wrap,{justifyContent:'center'},Skin.activationStyle.info]}>
    //       <Text>Step 1: Verify Code </Text>
    //       <Text style={{fontWeight: 'bold'}}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
    //       <Text style={Skin.activationStyle.info}>{'\nStep 2: Scan QR Code'}</Text>
    //     </Text>

    //     <View style={[Skin.activationStyle.input_wrap, { justifyContent: 'center' }]}>
    //       <View style={{ width: 200, height: 200, justifyContent: 'center',backgroundColor:'black' }}>
    //         { $this.renderIf($this.state.showCamera,
    //           <Camera onBarCodeRead={this._onBarCodeRead} style={styles.camera} type={Camera.constants.Type.back}>
    //              <View style={styles.rectangleContainer}>
    //                 <View style={styles.rectangle}/>
    //              </View>
    //            </Camera>)
    //         }
    //       </View>
    //     </View>

    // <View style={Skin.activationStyle.input_wrap}>
    //   <View style={Skin.activationStyle.textinput_wrap}>
    // <TextInput
    //   returnKeyType={'next'}
    //   autoCorrect={false}
    //   secureTextEntry={true}
    //   keyboardType={'default'}
    //   placeholderTextColor={'rgba(255,255,255,0.7)'}
    //   style={Skin.activationStyle.textinput}
    //   value={this.state.inputUsername}
    //   ref={'activatonCode'}
    //   placeholder={'or Enter Numeric Code'}
    //   onChange={this.onActivationCodeChange.bind(this)}
    //   onSubmitEditing={this.checkActivationCode.bind(this)}
    // />
    //   </View>
    // </View>
    // <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>

    // <View style={Skin.activationStyle.input_wrap}>
    //   <TouchableHighlight
    //     style={Skin.activationStyle.button}
    //     underlayColor={'#082340'}
    //     onPress={this.checkActivationCode.bind(this)}
    //     activeOpacity={0.6}
    //   >
    //     <Text style={Skin.activationStyle.buttontext}>
    //       {this.btnText()}
    //     </Text>
    //   </TouchableHighlight>
    // </View>
    //   </View>
    // </MainActivation>
    //  );
    return (
      <View style={Skin.layout1.wrap}>
        <StatusBar
          style={Skin.layout1.statusbar}
          backgroundColor={Skin.main.STATUS_BAR_BG}
          barStyle={'default'} />
        <View style={Skin.layout1.title.wrap}>
          <Title
          close={0}>
            Activation
          </Title>
        </View>
        <ScrollView
          style={Skin.layout1.content.scrollwrap}
          contentContainerStyle={{ flex: 1 }}>
          <View style={{
                         backgroundColor: '#000000',
                         flex: 1,
                         marginBottom: 12
                       }}>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>
                <Text style={[Skin.layout1.content.prompt, {
                               marginTop: 10
                             }]}>
                  Step 1: Verify Code {this.props.url.chlngJson.chlng_resp[0].challenge}
                </Text>
                <Text style={[Skin.layout1.content.prompt, {}]}>
                  Step 2: Scan QR Code
                </Text>
                <View style={Skin.layout1.content.cameraBox}>
                  <Margin space={16} />
                  {$this.renderIf($this.state.showCamera,
                     <Camera
                       onBarCodeRead={this._onBarCodeRead}
                       type={Camera.constants.Type.back}>
                       <View style={styles.rectangle} />
                     </Camera>)}
                </View>
                <View style={Skin.layout1.content.enterWrap}>
                  <Input
                    placeholder={'or Enter Numeric Code'}
                    ref={'activationCode'}
                    autoFocus={false}
                    autoCorrect={false}
                    autoComplete={false}
                    autoCapitalize={true}
                    secureTextEntry={true}
                    styleInput={[Skin.layout1.content.enterInput,{color:Skin.baseline.textinput.placeholderTextColor}]}
                    returnKeyType={"next"}
                    placeholderTextColor={Skin.baseline.textinput.placeholderTextColor}
                    onChange={this.onActivationCodeChange.bind(this)}
                    onSubmitEditing={this.checkActivationCode.bind(this)} />
                    
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={Skin.layout1.bottom.wrap}>
          <View style={Skin.layout1.bottom.container}>
            <Button
              label={Skin.text['1']['1'].submit_button}
              onPress={this.checkActivationCode.bind(this)} />
            <Text
              onPress={() => {
                         Alert.alert(
                           'Alert Title',
                           'My Alert Msg',
                           [
                             {
                               text: 'Ask me later',
                               onPress: () => console.log('Ask me later pressed')
                             },
                             {
                               text: 'Cancel',
                               onPress: () => console.log('Cancel Pressed'),
                               style: 'cancel'
                             },
                             {
                               text: 'OK',
                               onPress: () => console.log('OK Pressed')
                             },
                           ]
                         )
                       }}
              style={Skin.layout1.bottom.footertext}>
              Resend Activation Code
            </Text>
          </View>
        </View>
        <KeyboardSpacer topSpacing={-45} />
      </View>
      );

  },
});

var CancelButton = React.createClass({
  render: function() {
    return (
      <View style={styles.cancelButton}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={styles.cancelButtonText}>
            {this.props.title}
          </Text>
        </TouchableOpacity>
      </View>
      );
  },
});

var styles = StyleSheet.create({

  camera: {
    height: 200,
    width: 200,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 15,
    width: 100,
    bottom: 10,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0097CE',
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  }
});

module.exports = QRCodeScreen;