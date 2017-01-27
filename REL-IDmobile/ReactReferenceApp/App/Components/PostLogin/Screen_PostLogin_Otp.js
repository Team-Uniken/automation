'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, PermissionsAndroid,Platform,BackAndroid } from 'react-native';

//const {Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;

import Camera from 'react-native-camera';
import Events from 'react-native-simple-events';
import Skin from '../../Skin';
import MainActivation from '../MainActivation';
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer';

var obj;
class AccessCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessCode: '',
      showCamera: true,
      barCodeFlag: true,
      cameraPermission: false,
      cameraType: Camera.constants.Type.back,
      isPoped:false,
    }
    //this.barCodeFlag = true;
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this.checkCameraPermission = this.checkCameraPermission.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    // this.barCodeScanFlag = true;
  }
  
  componentWillMount(){
    obj = this;
     if (Platform.OS === 'android' && Platform.Version >= 23){
        this.state.showCamera = false;
     }
  }

  componentDidMount() {
     BackAndroid.addEventListener('hardwareBackPress', function() {
            this.close();
            return true;
        }.bind(this));
    if (Platform.OS === 'android' && Platform.Version >= 23)
      this.checkCameraPermission();
  }

  componentWillUpdate(){
    if(this.state.isPoped){
       this.state.showCamera = true;
      this.state.isPoped = false;
    }
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': Skin.CLIENT_TITLE_TEXT+' App Camera Permission',
          'message': Skin.CLIENT_TITLE_TEXT+' App needs access to your camera ' +
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
    } catch (err) {
      console.warn(err)
    }
  }

  checkCameraPermission() {
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.CAMERA)
      .then((response) => {
        //response is an object mapping type to permission
        if (response) {
                 
          this.setState({
            showCamera:true,
            cameraPermission: response,
          });
        } else {
          this.requestCameraPermission();
        }
      });
  }

  _onBarCodeRead(result) {
    if (obj.state.barCodeFlag === true) {
      obj.state.barCodeFlag = false;
      obj.onQRScanSuccess(result.data);
    }
  }

  onAccessCodeChange(e) {
    this.setState({ accessCode: e.nativeEvent.text });
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }
  
  

  checkAccessCode() {
    let vkey = this.state.accessCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      this.setState({ accessCode: '' });
      this. hideCamera();
      responseJson.chlng_resp[0].response = vkey;
      this.state.isPoped = true;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Access Code');
    }
  }

  onQRScanSuccess(result) {
    var $this = this;
    if (result.length != 0) {
      var res;
      try {
        res = JSON.parse(result);

        if ("key" in res && "value" in res) { }
        else {
          alert('Invalid QR code');
          setTimeout(function () {
            obj.state.barCodeFlag = true;
          }, 2000);
          return;
        }

      } catch (e) {
        alert('Invalid QR code');
        setTimeout(function () {
          obj.state.barCodeFlag = true;
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

        $this. hideCamera();
        let responseJson = $this.props.url.chlngJson;
        obj.state.barCodeFlag = false;


        responseJson.chlng_resp[0].response = aCode;
        $this.setState({ accessCode: '' });
        setTimeout(() => {
          Events.trigger('showNextChallenge', {
            response: responseJson
          });
        }, 1000);
      } else {
        //  Events.trigger('hideLoader', true);

        alert('Verification code does not match');
        // this.barCodeFlag = true;
        setTimeout(function () {
          obj.state.barCodeFlag = true;
        }, 2000);
      }
    } else {
      // Events.trigger('hideLoader', true);
      alert('Invalid QR code');
      setTimeout(function () {
        obj.state.barCodeFlag = true;
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
  }
  
  hideCamera(){
    if(Platform.OS === 'android'){
    this.setState({ showCamera: false });
    }
  }

  render() {

    return (
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
            Access Code
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
                      {"Step 1: Verify Code " + this.props.url.chlngJson.chlng_resp[0].challenge}
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
            ref={'accessCode'}
            autoFocus={false}
            autoCorrect={false}
            autoComplete={false}
            autoCapitalize={true}
            secureTextEntry={true}
            value={this.state.accessCode}
            styleInput={Skin.layout1.content.code.input}
            returnKeyType={"next"}
            placeholderTextColor={Skin.layout1.content.code.placeholderTextColor}
            onChange={this.onAccessCodeChange.bind(this) }
            onSubmitEditing={this.checkAccessCode.bind(this) } />
            </View>
            </View>
          </View>
        </ScrollView>
        <View style={Skin.layout1.bottom.wrap}>
          <View style={Skin.layout1.bottom.container}>
            <Button
              label={Skin.text['1']['1'].submit_button}
              onPress={this.checkAccessCode.bind(this) } />
            <Text
              onPress={() => {
                Alert.alert(
                  'Message',
                  'Feature coming soon',
                  [

                    {
                      text: 'OK',
                      onPress: () => console.log('OK Pressed')
                    },
                  ]
                )
              } }
              style={Skin.layout1.bottom.footertext}>
              Resend Access Code
            </Text>
          </View>
        </View>
        <KeyboardSpacer topSpacing={-45} />
      </View>
        </MainActivation>
    );
  }
}


AccessCode.propTypes = {
  onSucess: React.PropTypes.func,
  onCancel: React.PropTypes.func,
}

AccessCode.getDefaultProps = {
  url: {
    chlngJson: {
      chlng_resp: [{
        challenge: 'ABCDEFG'
      }]
    }
  }
}

module.exports = AccessCode;


