'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, Platform, BackAndroid, PermissionsAndroid } from 'react-native';

//const {Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;

import Camera from 'react-native-camera';
import Events from 'react-native-simple-events';
import Skin from '../../Skin';
import MainActivation from '../MainActivation';
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer'
class Activation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
      showCamera: true,
      barCodeFlag: true,
      cameraPermission: false,
      cameraType: Camera.constants.Type.back,
    }
    //this.barCodeFlag = true;
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this.checkCameraPermission = this.checkCameraPermission.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
  // this.barCodeScanFlag = true;
  }

  componentDidMount() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      this.checkCameraPermission();
    }
    BackAndroid.addEventListener('hardwareBackPress', function() {
      this.close();
      return true;
    }.bind(this));
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'NWD App Camera Permission',
          'message': 'NWD App needs access to your camera ' +
            'so you can scan the QR Code.'
        }
      )
      if (granted) {
        this.setState({
          cameraPermission: granted,
          showCamera: false
        }, () => {
          this.setState({ showCamera: true });
        });
        console.log("You can use the camera")
      } else {
        console.log("Camera permission denied")
      }
    } catch ( err ) {
      console.warn(err)
    }
  }

  checkCameraPermission() {
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.CAMERA)
      .then(response => {
        //response is an object mapping type to permission
        if (response) {
          this.setState({ cameraPermission: response, });
        } else {
          this.requestCameraPermission();
        }
      });
  }

  _onBarCodeRead(result) {
    if (this.state.barCodeFlag === true) {
      this.state.barCodeFlag = false;
      this.onQRScanSuccess(result.data);
    }
  }

  onActivationCodeChange(e) {
    this.setState({ activatonCode: e.nativeEvent.text });
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
      this. hideCamera();
      this.setState({ activatonCode:'' });
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Activation Code');
    }
  }
  
  hideCamera(){
    if(Platform.OS === 'android'){
     this.setState({ showCamera: false });
    }
  }
  

  onQRScanSuccess(result) {
    var $this = this;
    if (result.length != 0) {
      var res;
      try {
        res = JSON.parse(result);

        if ("key" in res && "value" in res) {
        } else {
          alert('Invalid QR code');
          setTimeout(function() {
            $this.state.barCodeFlag = true;
          }, 2000);
          return;
        }

      } catch ( e ) {
        alert('Invalid QR code');
        setTimeout(function() {
          $this.state.barCodeFlag = true;
        }, 2000);
        return;
      }
      var vfKey = res.key;
      var aCode = res.value;
      var exp = res.expiry;
      var obtainedVfKey = this.props.url.chlngJson.chlng_resp[0].challenge;
      if (obtainedVfKey === vfKey) {
        // alert("QR scan success");
        // Events.trigger('showLoader',true);
        if(Platform.OS === 'android'){
          $this. hideCamera();
        }
        let responseJson = $this.props.url.chlngJson;
        $this.barCodeFlag = false;

        $this.setState({ activatonCode:'' });
        responseJson.chlng_resp[0].response = aCode;
        setTimeout(() => {
          Events.trigger('showNextChallenge', {
            response: responseJson
          });
        }, 1000);
      } else {
        //  Events.trigger('hideLoader', true);

        alert('Verification code does not match');
        // this.barCodeFlag = true;
        setTimeout(function() {
          $this.state.barCodeFlag = true;
        }, 2000);
      }
    } else {
      // Events.trigger('hideLoader', true);
      alert('Invalid QR code');
      setTimeout(function() {
        $this.state.barCodeFlag = true;
      }, 2000);
      //  setTimeout(function() {
      //   $this.setState({ showCamera: true });
      //   }, 2000);

    }
  }

  renderIf(condition, jsx) {
    if (condition) {
      return jsx;
    }
  }

  close() {

    let responseJson = this.props.url.chlngJson;
      this. hideCamera();
    Events.trigger('showPreviousChallenge');
  /*
      Alert.alert('clicked')
      console.log('navigator')
      console.log(this.props)
      //this.props.navigator.pop()
      console.log('doNavigation:');
      this.props.navigator.push({
        id: "Screen_0_1_welcome",
        //id: "Screen_0_2_selectlogin",
        title: "nextChlngName",
        url: {
          "chlngJson": chlngJson,
          "screenId": nextChlngName
        }
      });
  */
  }

  render() {

    return (
<<<<<<< HEAD
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
              {this.renderIf(this.state.showCamera,
                <Camera
                  captureAudio={false}           
                  onBarCodeRead={this._onBarCodeRead}
                  type={Camera.constants.Type.back}
                  aspect={Camera.constants.Aspect.fill}
                  style={Skin.layout1.content.camera.wrap}>
                  <View style={Skin.layout1.content.container}>
                    <Text style={[Skin.layout1.content.camera.prompt, {
                      marginTop: 10
                    }]}>
                      {"Step 1: Verify Code " +
                        this.props.url.chlngJson.chlng_resp[0].challenge}
                    </Text>
                    <Text style={Skin.layout1.content.camera.prompt}>
                      Step 2: Scan QR Code
                    </Text>
                    <View style={Skin.layout1.content.camera.boxwrap}>
                      <View style={Skin.layout1.content.camera.box} />
                    </View>
                 
                  </View>
                </Camera>
              ) }
            <View style={Skin.layout1.content.enterWrap}>
            <Input
            placeholder={'or Enter Numeric Code'}
            ref={'activationCode'}
            autoFocus={false}
            autoCorrect={false}
            autoComplete={false}
            autoCapitalize={true}
            secureTextEntry={true}
            styleInput={Skin.layout1.content.code.input}
            returnKeyType={"next"}
            placeholderTextColor={Skin.layout1.content.code.placeholderTextColor}
            onChange={this.onActivationCodeChange.bind(this) }
            onSubmitEditing={this.checkActivationCode.bind(this) } />
            </View>
            </View>
=======
      <MainActivation>
        <View style={Skin.layout1.wrap}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => {
                              this.close();
                            }}>
              Activation
            </Title>
>>>>>>> feature/deals3
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
                {this.renderIf(this.state.showCamera,
                   <Camera
                     onBarCodeRead={this._onBarCodeRead}
                     type={Camera.constants.Type.back}
                     aspect={Camera.constants.Aspect.fill}
                     style={Skin.layout1.content.camera.wrap}>
                     <View style={Skin.layout1.content.container}>
                       <Text style={[Skin.layout1.content.camera.prompt, {
                                      marginTop: 10
                                    }]}>
                         {"Step 1: Verify Code " +
                          this.props.url.chlngJson.chlng_resp[0].challenge}
                       </Text>
                       <Text style={Skin.layout1.content.camera.prompt}>
                         Step 2: Scan QR Code
                       </Text>
                       <View style={Skin.layout1.content.camera.boxwrap}>
                         <View style={Skin.layout1.content.camera.box} />
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
                           styleInput={Skin.layout1.content.code.input}
                           returnKeyType={"next"}
                           placeholderTextColor={Skin.layout1.content.code.placeholderTextColor}
                           onChange={this.onActivationCodeChange.bind(this)}
                           onSubmitEditing={this.checkActivationCode.bind(this)} />
                       </View>
                     </View>
                   </Camera>
                 )}
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
                             'Message',
                             'Feature coming soon',
                             [{text: 'OK',onPress: () => console.log('OK Pressed')},]
                           )
                         }}
                style={Skin.layout1.bottom.footertext}>
                Resend Activation Code
              </Text>
            </View>
          </View>
          <KeyboardSpacer topSpacing={-45} />
        </View>
      </MainActivation>
      );
  }
}


Activation.propTypes = {
  onSucess: React.PropTypes.func,
  onCancel: React.PropTypes.func,
}

Activation.getDefaultProps = {
  url: {
    chlngJson: {
      chlng_resp: [{
        challenge: 'ABCDEFG'
      }]
    }
  }
}

module.exports = Activation;


