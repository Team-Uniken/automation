/**
 *  Show Access key and you have to enter access code to activate new device. 
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';

/*
 Required for this js
 */
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, PermissionsAndroid, Platform, BackAndroid, TouchableHighlight, AlertIOS, Linking } from 'react-native';
import Camera from 'react-native-camera';
import Events from 'react-native-simple-events'; 
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from 'react-native-simple-modal';
var dismissKeyboard = require('react-native-dismiss-keyboard');


/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCES
 */
var obj;
const CAMERA_REF = "camera";

class AccessCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessCode: '',
      showCamera: false,
      barCodeFlag: true,
      cameraPermission: false,
      cameraType: Camera.constants.Type.back,
      isPoped: false,
      camHeight: null,
      initCamHeightIsSet: false,
      alertMsg: "",
      showAlert: false,
    }
    this.selectedAlertOp = true;
    //this.barCodeFlag = true;
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this.checkCameraPermission = this.checkCameraPermission.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.checkAccessCode = this.checkAccessCode.bind(this);

    this.showAlertModal = this.showAlertModal.bind(this);
    this.onAlertModalDismissed = this.onAlertModalDismissed.bind(this);
    this.onAlertModalOk = this.onAlertModalOk.bind(this);
    this.dismissAlertModal = this.dismissAlertModal.bind(this);
    // this.barCodeScanFlag = true;
  }


  /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
    obj = this;
    if (Platform.OS === 'ios'){
      ReactRdna.checkDeviceAuthorizationStatus((err, isAuthorized)=>{
                                               if (isAuthorized) {
                                               this.setState({showCamera: true});
                                               } else {
                                               this.setState({showCamera: false});
                                               AlertIOS.alert(
                                                              "Camera Access Denied",
                                                              "Go to Settings / Privacy / Camera and enable access for this app",
                                                              [{
                                                               text:"OK",
                                                               onPress:()=>{
                                                               //                                                                       Events.trigger('showPreviousChallenge');
                                                               Linking.canOpenURL('app-settings:').then(supported => {
                                                                                                        if (!supported) {
                                                                                                        console.log('Can\'t handle settings url');
                                                                                                        } else {
                                                                                                        return Linking.openURL('app-settings:');
                                                                                                        }
                                                                                                        }).catch(err => console.error('An error occurred', err));
                                                               }
                                                               }]
                                                              );
                                               }
                                               });
      
    }


    if (Platform.OS === 'android') {
      if (Platform.Version >= 23)
        this.state.showCamera = false;
      else
        this.state.showCamera = true;
    }
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
    if (Platform.OS === 'android' && Platform.Version >= 23)
      this.checkCameraPermission();
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component is Updated.
  */
  componentWillUpdate() {
    var allScreens = this.props.navigator.getCurrentRoutes(0);
    if (allScreens[allScreens.length - 1].id == 'otp') {
      if (this.state.isPoped) {
        obj.state.barCodeFlag = true;
        this.state.showCamera = true;
        dismissKeyboard();
      }
    }
  }

  componentDidUpdate() {
    var allScreens = this.props.navigator.getCurrentRoutes(0);
    if (allScreens[allScreens.length - 1].id == 'otp') {
      if (this.state.isPoped) {
        if (this.state.showCamera) {
          this.refs[CAMERA_REF].setCameraMode("on");
        }

        this.state.isPoped = false;
      }
    }
  }

  /*
    This method is used to request the camera permission from the user.
  */
  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': Skin.CLIENT_TITLE_TEXT + ' App Camera Permission',
          'message': Skin.CLIENT_TITLE_TEXT + ' App needs access to your camera ' +
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
  /*
    This method is used to request the camera permission from the user.
  */
  checkCameraPermission() {
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.CAMERA)
      .then(response => {
        //response is an object mapping type to permission
        if (response) {
          this.setState({
            showCamera: true,
            cameraPermission: response,
          });
        } else {
          this.requestCameraPermission();
        }
      });
  }
  /*
    This method is a callback obtained after the QRCode has been scan.
  */
  _onBarCodeRead(result) {
    if (obj.state.barCodeFlag === true) {
      obj.state.barCodeFlag = false;
      obj.onQRScanSuccess(result.data);
    }
  }
  /*
    onTextchange method for Access Code TextInput.
  */
  onAccessCodeChange(e) {
    this.setState({ accessCode: e.nativeEvent.text });
  }
  /*
     This method is used to return the text Submit/Continue for submit button.
   */
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }
  /*
    This method is used to get the users entered/Scanned QR code value and submit the same as a challenge response.
    For Empty Access code, Alert dailogue is dispalyed to user.
  */
  checkAccessCode() {
    let vkey = this.state.accessCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      this.setState({ accessCode: '' });
      this.state.isPoped = true;
      if (this.state.showCamera) {
        this.refs[CAMERA_REF].setCameraMode("off");
      }
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      alert('Enter Access Code');
    }
  }
  /*
    This method is a called from a QRCode scan callback, and checks for
    the Access key obtined is same as the key which is obtained in the challenge.
    If the values are mateched, it submit the Access code as a challenge response.
    For Invalid verification key, Alert dailogue is dispalyed to user.
  */
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

        // $this.hideCamera();
        let responseJson = $this.props.url.chlngJson;
        obj.state.barCodeFlag = false;
        if ($this.state.showAlert === true) {
          $this.dismissAlertModal();
        }
        responseJson.chlng_resp[0].response = aCode;
        this.setState({ accessCode: '' });
        this.state.isPoped = true;
        if (this.state.showCamera) {
          this.refs[CAMERA_REF].setCameraMode("off");
        }
        setTimeout(() => {
          Events.trigger('showNextChallenge', {
            response: responseJson
          });
        }, 1000);
      } else {
        $this.showAlertModal("Verification code does not match");
        //alert('Verification code does not match');
        setTimeout(function () {
          obj.state.barCodeFlag = true;
        }, 2000);
      }
    } else {
      alert('Invalid QR code');
      setTimeout(function () {
        obj.state.barCodeFlag = true;
      }, 2000);
    }
  }
  /*
    This method is used to render the JSX elements.
  */
  renderIf(condition, jsx) {
    if (condition) {
      return jsx;
    }
  }
  //show previous challenge on click of cross button or android back button.
  close() {
    if (this.state.showCamera) {
      this.refs[CAMERA_REF].setCameraMode("off");
      this.hideCamera();
    }
    let responseJson = this.props.url.chlngJson;
    //this.hideCamera();
    Events.trigger('showPreviousChallenge');
  }
  /*
    This method is used to hide the camera which was used to scan QR code.
  */
  hideCamera() {
    if (Platform.OS === 'android') {
      this.setState({ showCamera: false });
    }
  }


  /*
    This is a utility method used to set the camera cordinates.
  */
  measureView(event) {
    console.log('event peroperties: ', event);
    if (this.state.initCamHeightIsSet === false) {
      this.state.initCamHeightIsSet = true;
      this.setState({
        camHeight: event.nativeEvent.layout.height
      });
    }
  }

  /*
   Alert actions methods
   */
  showAlertModal(msg) {
    this.setState({
      showAlert: true,
      alertMsg: msg
    });
  }

  dismissAlertModal() {
    this.selectedAlertOp = false;
    this.setState({
      showAlert: false
    });
  }

  onAlertModalOk() {
    //this.props.navigator.pop();
  }

  onAlertModalDismissed() {
    //Do nothing for right now
  }


  /*
    This method is used to render the componenet with all its element.
  */
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
              <Text style={[Skin.layout1.content.camera.prompt, {
                position: 'absolute',
                top: 20,
                zIndex: 1,
                width: Skin.SCREEN_WIDTH,
                backgroundColor: 'transparent'
              }]}>
                {"Step 1: Verify Code " + this.props.url.chlngJson.chlng_resp[0].challenge + "\nStep 2: Scan QR Code"}
              </Text>

              <View style={[Skin.layout1.content.wrap, { flex: 1, zIndex: 0 }]}>

                {this.renderIf(this.state.showCamera,
                  <Camera
                    ref={CAMERA_REF}
                    captureAudio={false}
                    onLayout={(event) => this.measureView(event) }
                    onBarCodeRead={this._onBarCodeRead}
                    type={Camera.constants.Type.back}
                    aspect={Camera.constants.Aspect.fill}
                    style={[Skin.layout1.content.camera.wrap, this.state.camHeight != null ? { height: this.state.camHeight } : {}]}>
                    <View style={{ flex: 20 }}/>
                    <View style={[Skin.layout1.content.camera.box, { flex: 60, width: Skin.SCREEN_WIDTH - 100 }]}>
                    </View>
                    <View style={{ flex: 20 }}/>
                  </Camera>
                ) }

              </View>
              <View style={[{ width: Skin.SCREEN_WIDTH, position: 'absolute', alignItems: 'center', justifyContent: 'center', bottom: 0 }]}>
                <Input
                  placeholder={'or Enter Numeric Code'}
                  ref={'accessCode'}
                  autoFocus={false}
                  autoCorrect={false}
                  autoComplete={false}
                  autoCapitalize={true}
                  secureTextEntry={true}
                  value={this.state.accessCode}
                  styleInputView={[{ width: Skin.SCREEN_WIDTH - 104 }]}
                  styleInput={Skin.layout1.content.code.input}
                  returnKeyType={"next"}
                  placeholderTextColor={Skin.layout1.content.code.placeholderTextColor}
                  onChange={this.onAccessCodeChange.bind(this) }
                  onSubmitEditing={this.checkAccessCode} />
              </View>
            </View>
          </ScrollView>
          <View style={Skin.layout1.bottom.wrap}>
            <View style={Skin.layout1.bottom.container}>
              <Text style={[Skin.layout0.top.attempt, { marginBottom: 4, marginTop: 0 }]}>
                Attempt left {this.props.url.chlngJson.attempts_left}
              </Text>
              <Button
                label={Skin.text['1']['1'].submit_button}
                onPress={() => {
                  dismissKeyboard();
                  this.checkAccessCode();
                } }/>
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
          <KeyboardSpacer topSpacing={-55} />
        </View>
        <Modal
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.showAlert}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => {
            if (this.selectedAlertOp) {
              this.selectedAlertOp = false;
              this.onAlertModalOk();
            } else {
              this.selectedAlertOp = false;
              this.onAlertModalDismissed();
            }
          } }>
          <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
              Alert
            </Text>
          </View>
          <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>
            {this.state.alertMsg}
          </Text>
          <View style={styles.border}></View>

          <TouchableHighlight
            onPress={() => {
              this.selectedAlertOp = true;
              this.setState({
                showAlert: false
              });
            } }
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              OK
            </Text>
          </TouchableHighlight>
        </Modal>
      </MainActivation>
    );
  }
}

//Styles for alert modal
const styles = StyleSheet.create({
  modalwrap: {
    height: 150,
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
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  modalButton: {
    height: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  modalButtonText: {
    textAlign: 'center',
    color: '#268CFE',
    fontSize: 16,
  },
  border: {
    height: 1,
    marginTop: 16,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  },

  modalInput: {
    textAlign: 'center',
    color: Skin.colors.PRIMARY_TEXT,
    height: 32,
    padding: 0,
    fontSize: 16,
    backgroundColor: null,
  }
});


module.exports = AccessCode;


