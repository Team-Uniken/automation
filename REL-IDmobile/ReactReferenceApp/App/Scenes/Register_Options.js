/*
 *Provide checkbox for nexttime login like with facebook, pattern, touchid.
 defaultLogin, rememberuser etc.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View, ScrollView, StatusBar, DeviceEventEmitter, AsyncStorage, Alert, AlertIOS, Platform, BackHandler, } from 'react-native';
import Events from 'react-native-simple-events';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import TouchID from 'react-native-touch-id';
import ModalPicker from 'react-native-modal-picker'
import { NativeModules, NativeEventEmitter } from 'react-native';

/*
 Use in this js
 */
import Skin from '../Skin';
import MainActivation from '../Components/Container/MainActivation';
import Main from '../Components/Container/Main';
import Util from "../Components/Utils/Util";
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onUpdateChallengeStatusModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);

/*
 Custome View
 */
import Title from '../Components/view/title';
import Button from '../Components/view/button';
import Checkbox from '../Components/view/checkbox';
import Input from '../Components/view/input';
import Margin from '../Components/view/margin';

/*
  INSTANCES
 */

let subscriptions;


//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;
var obj;
let onUpdateChallengeStatusSubscription;
class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devbind: true,
      welcome: false,
      device: false,
      touchid: false,
      wechat: false,
      rememberusername: false,
      welcomescreen: false,
      pattern: false,
      facebook: false,
      refresh: false,
      defaultLogin: "",
      modalInitValue: "Select Default Login",
      devname: "Device Name",
      devnameopacity: 0,
    };

    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.checkValidityOfAccessToken = this.checkValidityOfAccessToken.bind(this);
    this.onSetPattern = this.onSetPattern.bind(this);
    this.close = this.close.bind(this);
    this.saveDefaultLoginPrefs = this.saveDefaultLoginPrefs.bind(this);
  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {

    Events.trigger('hideLoader', true);
    AsyncStorage.getItem(Main.dnaUserName).then((userPrefs) => {
      if (userPrefs) {
        try {
          userPrefs = JSON.parse(userPrefs);
          this.setState({ modalInitValue: Skin.text['0']['2'].credTypes[userPrefs.defaultLogin].label });
        }
        catch (e) { }
      }
    });


    AsyncStorage.getItem('skipwelcome').then((value) => {
      if (value == null || value == undefined) {
        this.setState({ welcomescreen: '\u2714' });
        this.setState({ welcome: true });
        // Setting skipwelcome to default true if user prefs not found
        AsyncStorage.setItem("skipwelcome", "true");
      }else if(value === "true") {
        this.setState({ welcomescreen: '\u2714' });
        this.setState({ welcome: true });
      }
      else {
        this.setState({ welcomescreen: '' });
        this.setState({ welcome: false });
      }
    }).done();

    obj = this;
    AsyncStorage.getItem('devname').then((value) => {
      if (value != null) {
        this.setState({ devname: value });
        this.setState({ devnameopacity: 1 });
      } else {
        this.setState({ devnameopacity: 0 });
      }
    }).done();
    AsyncStorage.getItem('rememberuser').then((value) => {
      if (value == null || value === 'empty') {
        obj.setState({ rememberusername: '' });
      } else {
        obj.setState({ rememberusername: '\u2714' });
      }
    });
  }
  //on press of close button it navigate to dashboard without saveing the recent change.
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
      if (this.state.defaultLogin === 'touchid') {
        this.state.defaultLogin = "none"
        this.setState({ modalInitValue: null }, () => {
          this.setState({ modalInitValue: "Select Default Login" });
        });
      }

      this.setState({ touchid: false });
      AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
    }
  }

  selectpattern() {
    if (this.state.pattern === false) {
      this.doPatternSet();
    } else {
      if (this.state.defaultLogin === 'pattern') {
        this.state.defaultLogin = "none"
        this.setState({ modalInitValue: null }, () => {
          this.setState({ modalInitValue: "Select Default Login" });
        });
      }
      this.setState({ pattern: false });
      AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null);
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

      AsyncStorage.getItem('userId').then((value) => {
        AsyncStorage.setItem("rememberuser", value);

      });
    } else {
      this.setState({ rememberusername: '' });
      AsyncStorage.setItem("rememberuser", 'empty');
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

  getLoginOptions() {
    let index = 0;

    let data = [
      {
        key: 'title',
        section: true,
        label: 'Default Login Options'
      },
      {
        key: 'none',
        label: 'None'
      },
      Skin.text['0']['2'].credTypes['password']
    ];

    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];

      var promts;
      if (chlng.chlng_prompt[0].length > 0) {
        var promtsArr = chlng.chlng_prompt[0];
        for (var j = 0; j < promtsArr.length; j++) {
          promts = JSON.parse(promtsArr[j]);
          if (promts.is_registered == true) {
            data.push({
              key: promts.cred_type, label: Skin.text['0']['2'].credTypes[promts.cred_type].label
            });
          } else {
            if (this.state[promts.cred_type] === true) {
              data.push(Skin.text['0']['2'].credTypes[promts.cred_type]);
            }

          }

        }
      }
    }

    if (this.props.url.touchCred.isTouch == true) {
      if (Platform.OS === 'android') {
        data.push(Skin.text['0']['2'].credTypes['pattern']);
      } else {
        data.push(Skin.text['0']['2'].credTypes['touchid']);
      }
    } else if (this.state.pattern) {
      data.push(Skin.text['0']['2'].credTypes['pattern']);
    } else if (this.state.touchid) {
      data.push(Skin.text['0']['2'].credTypes['touchid']);
    }
    return data
  }

  changeDefaultLogin(option) {
    this.setState({ defaultLogin: option.key })
  }

  saveDefaultLoginPrefs() {
    if (this.state.defaultLogin) {
      var data = JSON.stringify({ defaultLogin: this.state.defaultLogin });
      AsyncStorage.mergeItem(Main.dnaUserName, data, null);
    }
  }

  onUpdateChallengeStatus(e) {

    const res = JSON.parse(e.response);

    Events.trigger('hideLoader', true);


    //    Events.trigger('hideLoader', true);
    // Unregister All Events
    // We can also unregister in componentWillUnmount
    if (onUpdateChallengeStatusSubscription) {
      onUpdateChallengeStatusSubscription.remove();
      onUpdateChallengeStatusSubscription = null;
    }

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

          }
        } else {
          console.log('UpdateAuthMachine - else ResponseData ' + JSON.stringify(res.pArgs.response.ResponseData));
          const pPort = res.pArgs.pxyDetails.port;
          if (pPort > 0) {
            RDNARequestUtility.setHttpProxyHost('127.0.0.1', pPort, (response) => { });
          }
          this.saveDefaultLoginPrefs();
          obj.doNavigateDashBoard();

        }
      } else {
        setTimeout(() => {
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
                console.log('UpdateAuthMachine - onUpdateChallengeStatus - chlngJson != null');
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
        }, 100);           
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

    var $this = this;
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
    var $this = this;
    LoginManager.logOut();
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
        //AlertIOS.alert('Authenticated Successfully');
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
      AsyncStorage.getItem(Main.dnaUserName).then((value) => {
        if (value) {
          try {
            value = JSON.parse(value);
            //Todo : cleanup
            // ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value.RPasswd, (response) => {
            //   if (response) {
            //     console.log('immediate response of encrypt data packet is is' + response[0].error);
            //     AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: response[0].response }), null);
            //     obj.setState({ touchid: true });
            //   } else {
            //     console.log('immediate response is' + response[0].response);
            //   }
            // });

            Util.saveUserDataSecure("ERPasswd", value.RPasswd).then((result) => {
              obj.setState({ touchid: true });
            }).done();
          } catch (e) { }
        }
      }).done();
    }
  }

  doUpdate() {
    if (this.state.welcome == true) {
      AsyncStorage.setItem("skipwelcome", "true");
    } else {
      AsyncStorage.setItem("skipwelcome", "false");
    }

    if (this.state.facebook == true) {

      if (onUpdateChallengeStatusSubscription) {
        onUpdateChallengeStatusSubscription.remove();
        onUpdateChallengeStatusSubscription = null;
      }

      onUpdateChallengeStatusSubscription = onUpdateChallengeStatusModuleEvt.addListener('onUpdateChallengeStatus',
        this.onUpdateChallengeStatus.bind(this));


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
      this.saveDefaultLoginPrefs();
      this.doNavigateDashBoard();
    }
  }

  doNavigateDashBoard() {
//    this.props.parentnav.resetTo({ id: 'Main', title: 'DashBoard', url: '' });
    this.props.navigator.navigate('DashBoard',{url: '',title:'DashBoard'})
  }

  selectCheckBox(args) {
    if (args === 'facebook') {
      if (this.state.facebook == false) {
        this.doFacebookLogin();
        //this.checkValidityOfAccessToken();
      } else {
        if (this.state.defaultLogin === 'facebook') {
          this.state.defaultLogin = "none"
          this.setState({ modalInitValue: null }, () => {
            this.setState({ modalInitValue: "Select Default Login" });
          });
        }

        this.setState({ facebook: false });
        var temp = this.props.url.chlngJson.chlng;
        var respo = temp[0].chlng_resp;
        respo[0].challenge = " ";
        respo[0].response = " ";
      }
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    }.bind(this));

  }

  render() {
    var indents = [];

    // Commented to hide make Permanent checkbox as suggested by James
    // indents.push(
    //   <Checkbox
    //     onSelect={this.selectMakePermanent.bind(this) }
    //     selected={this.state.devbind}
    //     labelSide={"right"}
    //     >
    //     Make Device Permanent
    //   </Checkbox>
    // );

    for (var i = 0; i < this.props.url.chlngJson.chlng.length; i++) {
      var chlng = this.props.url.chlngJson.chlng[i];

      var promts;
      if (chlng.chlng_prompt[0].length > 0) {
        var promtsArr = chlng.chlng_prompt[0];
        for (var j = 0; j < promtsArr.length; j++) {
          promts = JSON.parse(promtsArr[j]);
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
        if (this.props.url.touchCred.isSupported == true) {
          indents.push(
            <Checkbox
              onSelect={this.selecttouchid.bind(this) }
              selected={this.state.touchid}
              labelSide={"right"}
              >
              Enable TouchID Login
            </Checkbox>
          );
        }

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

    indents.push(
      <Checkbox
        onSelect={this.selectrememberusername.bind(this) }
        selected={this.state.rememberusername}
        labelSide={"right"}
        >
        Remember Username
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
                  space={4}/>
                <Text style={Skin.layout0.smalltext}>
                  Default Login Credential
                </Text>
                <ModalPicker
                  data={this.getLoginOptions() }
                  style={Skin.baseline.select.base}
                  selectStyle={Skin.baseline.select.select}
                  selectTextStyle={Skin.baseline.select.selectText}
                  initValue={this.state.modalInitValue}
                  onChange={(option) => {
                    this.changeDefaultLogin(option)
                  } } />
                <Margin
                  space={4}/>
                <Text style={[Skin.layout0.smalltext, { opacity: this.state.devnameopacity }]}>
                  Device Name
                </Text>
                <Text  style={[Skin.layout0.devname, { opacity: this.state.devnameopacity }]}>
                  {this.state.devname}
                </Text>
                <Margin
                  space={8}/>
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


