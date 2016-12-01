

import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
//import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import Checkbox from '../view/checkbox';
import Input from '../view/input';
import Margin from '../view/margin';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TouchID from 'react-native-touch-id';
import MainActivation from '../MainActivation';

const errors = {
  "LAErrorAuthenticationFailed": "Authentication was not successful because the user failed to provide valid credentials.",
  "LAErrorUserCancel": "Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.",
  "LAErrorUserFallback": "Authentication was canceled because the user tapped the fallback button (Enter Password).",
  "LAErrorSystemCancel": "Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.",
  "LAErrorPasscodeNotSet": "Authentication could not start because the passcode is not set on the device.",
  "LAErrorTouchIDNotAvailable": "Authentication could not start because Touch ID is not available on the device",
  "LAErrorTouchIDNotEnrolled": "Authentication could not start because Touch ID has no enrolled fingers.",
  "RCTTouchIDUnknownError": "Could not authenticate for an unknown reason.",
  "RCTTouchIDNotSupported": "Device does not support Touch ID."
};

let subscriptions;

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;


const {
  Text,
  View,
  ScrollView,
  StatusBar,
  DeviceEventEmitter,
  AsyncStorage,
  Alert,
  AlertIOS,
  Platform,
  BackAndroid,
} = ReactNative;
const {Component} = React;

var obj;
class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devbind: true,
       welcome: true,
      device: false,
      touchid: false,
      wechat: false,
      rememberusername: false,
      welcomescreen: false,
      pattern: false,
      facebook: false,
      refresh: false,
    };

    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.checkValidityOfAccessToken = this.checkValidityOfAccessToken.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.close = this.close.bind(this);
  }

  componentWillMount() {
    obj = this;
    var isCheck = false;
    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];
      if (chlng.chlng_prompt[0].length > 0) {
        var promts = JSON.parse(chlng.chlng_prompt[0]);

        if (promts.is_registered == false) {
          isCheck = true;
          break;
        }
      }
    }

    if (isCheck == false) {
      if (this.props.url.touchCred.isTouch == true) {
        this.doNavigateDashBoard();
      }
    }
  }

  close() {
    this.doNavigateDashBoard();
  }
  selectdevice() {
    if (this.state.device.length == 0) {
      this.setState({ device: true });
    } else {
      this.setState({ device: false });
    }
  }
  selecttouchid() {
    if (this.state.touchid === false) {
      this._clickHandler();
    } else {
      this.setState({ touchid: false });
      AsyncStorage.setItem("ERPasswd", "empty");
    }
  }

  selectpattern() {
    if (this.state.pattern === false) {
      this.doPatternSet();
    } else {
      this.setState({ pattern: false });
      AsyncStorage.setItem("ERPasswd", "empty");
    }
  }

  selectMakePermanent() {

  }

  selectskipwelcome() {
  if (this.state.welcome === false) {
      this.setState({ welcome: true });
    } else {
      this.setState({ welcome: false });
    }
  }

  selectfb() {
    if (this.state.wechat.length == 0) {
      this.doFacebookLogin();
    } else {
      this.setState({ wechat: '' });
      var temp = this.props.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;
      respo[0].challenge = " ";
      respo[0].response = " ";
    }
  }
  selectrememberusername() {
    if (this.state.rememberusername.length == 0) {
      this.setState({ rememberusername: '\u2714' });
    } else {
      this.setState({ rememberusername: '' });
    }
  }
  selectwelcomescreen() {
    if (this.state.welcomescreen.length == 0) {
      this.setState({ welcomescreen: '\u2714' });
    } else {
      this.setState({ welcomescreen: '' });
    }
  }

  onSetPattern(data) {
    this.props.navigator.pop();
    this.setState({ pattern: true });
  }

  onUpdateChallengeResponseStatus(e) {

    const res = JSON.parse(e.response);

    Events.trigger('hideLoader', true);


    //    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    subscriptions.remove();

    console.log(res);

    if (res.errCode == 0) {
      var statusCode = res.pArgs.response.StatusCode;
      console.log('UpdateAuthMachine - statusCode ' + statusCode);
      if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          console.log('UpdateAuthMachine - ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const chlngJson = res.pArgs.response.ResponseData;
          const nextChlngName = chlngJson.chlng[0].chlng_name;
          if (chlngJson != null) {
            console.log('UpdateAuthMachine - onCheckChallengeResponseStatus - chlngJson != null');
            //            //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
            //            this.props.navigator.push({
            //            id: 'UpdateMachine',
            //            title: nextChlngName,
            //            url: {
            //              chlngJson,
            //            screenId: nextChlngName,
            //              },
            //              });
          }
        } else {
          console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
          }
          // alert(res.pArgs.response.StatusMsg);

          // this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
          obj.doNavigateDashBoard();

        }
      } else {
        Alert.alert(
          'Error',
          res.pArgs.response.StatusMsg, [{
            text: 'OK',
            onPress: () => {
              var chlngJson;
              if (res.pArgs.response.ResponseData == null) {
                chlngJson = saveChallengeJson;
              } else {
                chlngJson = res.pArgs.response.ResponseData;
              }

              const currentChlng = challengeJsonArr[--currentIndex];
              for (var i = 0; i < chlngJson.chlng.length; i++) {
                var chlng = chlngJson.chlng[i];
                if (chlng.chlng_name === currentChlng.chlng_name) {

                } else {
                  chlngJson.chlng.splice(i, 1);
                  i--;
                }
              }

              const nextChlngName = chlngJson.chlng[0].chlng_name;
              if (chlngJson != null) {
                console.log('UpdateAuthMachine - onUpdateChallengeResponseStatus - chlngJson != null');
                //this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1, 1));
                this.props.navigator.push({
                  id: 'UpdateMachine',
                  title: nextChlngName,
                  url: {
                    chlngJson,
                    screenId: nextChlngName,
                  },
                });
              }


            },
            style: 'cancel',
          }]
        );
      }
    } else {
      console.log(e);
      alert('Internal system error occurred.' + res.errCode);
    }
  }

  doPatternSet() {
    this.props.navigator.push({
      id: 'pattern',
      onSetPattern: this.onSetPattern,
      mode: 'set'
    });
  }

  checkValidityOfAccessToken() {
    $this = this;
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        var callback = function (error, result) {
          if (error) {
            $this.doFacebookLogin();
          } else {
            $this.facebookResponseCallback(null, result)
          }
        }

        var config = {
          httpMethod: 'GET',
          version: 'v2.5',
          accessToken: data.accessToken.toString()
        }

        var request = new GraphRequest(
          '/me',
          config,
          callback
        );

        new GraphRequestManager().addRequest(request).start();
      }
      else {
        $this.doFacebookLogin();
      }
    });
  }

  //Facebook login code
  doFacebookLogin() {
   // Events.trigger('showLoader', true);
    $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          Events.trigger('hideLoader', true);
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {

            $this.profileRequestParams = {
              fields: {
                string: "id, name, email, first_name, last_name, gender"
              }
            }

            $this.profileRequestConfig = {
              httpMethod: 'GET',
              version: 'v2.5',
              parameters: $this.profileRequestParams,
              accessToken: data.accessToken.toString()
            }

            $this.profileRequest = new GraphRequest(
              '/me',
              $this.profileRequestConfig,
              $this.facebookResponseCallback,
            );

            new GraphRequestManager().addRequest($this.profileRequest).start();
          }).done();
        }
      },
      function (error) {
        Events.trigger('hideLoader', true);
      }).done();
  }


  //Facebook login code
  facebookResponseCallback(error, result) {
    Events.trigger('hideLoader', true);
    if (error) {
      return (result)
    } else {
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;

      this.setState({ facebook: true });

      var temp = this.props.url.chlngJson.chlng;
      var respo = temp[0].chlng_resp;

      var promts = JSON.parse(temp[0].chlng_prompt[0]);
      respo[0].challenge = promts.cred_type;
      respo[0].response = value;

      // this.props.tbacred.chlng_resp[0].challenge = key;
      //this.props.tbacred.chlng_resp[0].response = value;
      return (result)
    }
  }

  _clickHandler() {
    console.log(TouchID);
    TouchID.isSupported()
      .then(this.authenticate)
      .catch(error => {
        passcodeAuth();
      });
  }

  authenticate() {
    return TouchID.authenticate()
      .then(success => {
        //      AlertIOS.alert('Authenticated Successfully');
        obj.encrypytPasswdiOS();
      })
      .catch(error => {
        console.log(error)
        AlertIOS.alert(error.message);
      });
  }

  passcodeAuth() {
  }

  encrypytPasswdiOS() {

    if (Platform.OS === 'ios') {

      AsyncStorage.getItem('RPasswd').then((value) => {
        ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
          if (response) {
            console.log('immediate response of encrypt data packet is is' + response[0].error);
            AsyncStorage.setItem("ERPasswd", response[0].response);
            obj.setState({ touchid: true });
          } else {
            console.log('immediate response is' + response[0].response);
          }
        })

      }).done();
    }
  }


  doUpdate() {
    if (this.state.welcome == true) {
  AsyncStorage.setItem("skipwelcome", "true");
    }else{
  AsyncStorage.setItem("skipwelcome", "false");
    }



    if (this.state.facebook == true) {

      subscriptions = DeviceEventEmitter.addListener(
        'onUpdateChallengeStatus',
        this.onUpdateChallengeResponseStatus.bind(this)
      );


      AsyncStorage.getItem('userId').then((value) => {
        Events.trigger('showLoader', true);
        ReactRdna.updateChallenges(JSON.stringify(this.props.url.chlngJson), value, (response) => {
          if (response[0].error === 0) {
            console.log('immediate response is' + response[0].error);
          } else {
            Events.trigger('hideLoader', true);
            console.log('immediate response is' + response[0].error);
            alert(response[0].error);

          }
        });
      }).done();
    } else {
      this.doNavigateDashBoard();
    }
  }

  doNavigateDashBoard() {
    this.props.parentnav.push({ id: 'Main', title: 'DashBoard', url: '' });
  }

  selectCheckBox(args) {
    if (args === 'facebook') {
      if (this.state.facebook == false) {
        this.doFacebookLogin();
        //this.checkValidityOfAccessToken();
      } else {
        this.setState({ facebook: false });
        var temp = this.props.url.chlngJson.chlng;
        var respo = temp[0].chlng_resp;
        respo[0].challenge = " ";
        respo[0].response = " ";
      }
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      return true;
    }.bind(this));

  }

  render() {
    var indents = [];

    indents.push(
      <Checkbox
        onSelect={this.selectMakePermanent.bind(this) }
        selected={this.state.devbind}
        labelSide={"right"}
        >
        Make Device Permanent
      </Checkbox>
    );

    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];

      var promts;
      if (chlng.chlng_prompt[0].length > 0) {
        promts = JSON.parse(chlng.chlng_prompt[0]);

        if (promts.is_registered == false) {
          indents.push(
            <Checkbox
              onSelect={() => { this.selectCheckBox(promts.cred_type) } }
              selected={this.state[promts.cred_type]}
              labelSide={"right"}
              >
              {"Enable " + Skin.text['0']['2'].credTypes[promts.cred_type].label + " Login"}
            </Checkbox>
          );
          // <CheckBox
          // value={this.state[promts[0].credType]}
          // onSelect={() => { this.selectCheckBox(promts[0].credType) } }
          // lable={"Enable " + Skin.text['0']['2'].credTypes[promts[0].credType].label + " Login"} />);
        }
      }
    }

    if (this.props.url.touchCred.isTouch == false) {
      if (Platform.OS === 'android') {
        indents.push(
          <Checkbox
            onSelect={this.selectpattern.bind(this) }
            selected={this.state.pattern}
            labelSide={"right"}
            >
            Enable Pattern Login
          </Checkbox>
        );
        // <CheckBox
        // value={this.state.pattern}
        // onSelect={this.selectpattern.bind(this) }
        // lable="Enable Pattern Login"/>);
      } else {
        indents.push(
          <Checkbox
            onSelect={this.selecttouchid.bind(this) }
            selected={this.state.touchid}
            labelSide={"right"}
            >
            Enable TouchID Login
          </Checkbox>
        );

        // <CheckBox
        // value={this.state.touchid}
        // onSelect={this.selecttouchid.bind(this) }
        // lable="Enable TouchID Login"/>);
      }
    }
    indents.push(
      <Checkbox
        onSelect={this.selectskipwelcome.bind(this) }
        selected={this.state.welcome}
        labelSide={"right"}
        >
        Skip welcome screen
      </Checkbox>
    );
    return (
      <MainActivation>
        <View style={Skin.layout1.wrap}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'}
            />
          <View style={Skin.layout1.title.wrap}>
            <Title onClose={() => { this.close(); } }
              >Registration</Title>
          </View>
          <ScrollView style={Skin.layout1.content.scrollwrap}>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>
                {indents}
                <Margin
                  space={16}/>
              </View>
            </View>
          </ScrollView>
          <View
            style={Skin.layout1.bottom.wrap}>
            <View style={Skin.layout1.bottom.container}>
              <Button
                label={Skin.text['1']['1'].submit_button}
                onPress={this.doUpdate.bind(this) }
                />
            </View>
          </View>
          <KeyboardSpacer topSpacing={-55}/>
        </View >
      </MainActivation>
    );
  }
}

module.exports = Register;


