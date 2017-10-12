
/**
 *  check status of entered user if everything is right it navigate it forword else return appropriate error message
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import GridView from 'react-native-grid-view';
import TouchID from 'react-native-touch-id';
import {Text, View, Platform, BackHandler, AsyncStorage, StatusBar} from 'react-native'
const FBSDK = require('react-native-fbsdk');

/*
 Use in this js
 */
import Skin from '../Skin';
import PasswordVerification from '../Components/Challenges/Password_Verification';
import MainActivation from '../Components/Container/MainActivation';
import Main from '../Components/Container/Main';
import Util from "../Components/Utils/Util";
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


/*
 Custome View
 */
import LoginTypeButton from '../Components/view/logintypebutton';
import Title from '../Components/view/title';
import Toast from 'react-native-simple-toast';
/*
  INSTANCES
 */
var obj;
const LOGIN_TYPE_PER_ROW = 3;

//Facebook login code
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} = FBSDK;



class SelectLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isRegistered: false,
      refresh: false,
      showPasswordVerify: false,
      isTouchIDPresent: false,
    }

    this.loginWith = this.loginWith.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.checkValidityOfAccessToken = this.checkValidityOfAccessToken.bind(this);
    this.fillAdditionalLoginOptions = this.fillAdditionalLoginOptions.bind(this);
    this.checkForRegisteredCredsAndShow = this.checkForRegisteredCredsAndShow.bind(this);
    this.doPatternLogin = this.doPatternLogin.bind(this);
    this.onPatternUnlock = this.onPatternUnlock.bind(this);
    this.goBackToSelectLogin = this.goBackToSelectLogin.bind(this);
    this.isTouchPresent = this.isTouchPresent.bind(this);
    this.goToPasswordWhenAdditonalAuthFails = this.goToPasswordWhenAdditonalAuthFails.bind(this);

    this.checkForRegisteredCredsAndShow();
    if (Platform.OS === 'ios') {
      this.isTouchPresent().done();
    }

  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
    obj = this;
  }
  /*
       This is life cycle method of the react native component.
       This method is called when the component is Mounted/Loaded.
     */
  componentDidMount() {
    var $this = this;
    AsyncStorage.getItem(Main.dnaUserName).then((userPrefs) => {
      if (userPrefs) {
        try {
          userPrefs = JSON.parse(userPrefs);
          if (userPrefs.defaultLogin &&
            userPrefs.defaultLogin !== 'facebook') {
            if (userPrefs.defaultLogin === 'pattern'
              || userPrefs.defaultLogin === 'touchid') {
              if (userPrefs.ERPasswd != null && userPrefs.ERPasswd !== 'empty') {

                $this.loginWith(userPrefs.defaultLogin);
              }
            } else {
              $this.loginWith(userPrefs.defaultLogin);
            }
          }
        }
        catch (e) { }
      }
    });

    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    }.bind(this));
  }

  //Facebook login code
  doFacebookLogin() {
    var $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function (result) {
        {
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
        }
      },
      function (error) {
        Events.trigger('hideLoader', true);
      }).done();
  }
  //push datasource to gridview depends on tbacred and depends on platform if android pattern else touch option will be added.
  fillAdditionalLoginOptions() {
    this.state.dataSource = [];
    if (this.props.tbacred) {
      for (var i = 0; i < this.props.tbacred.chlng_prompt[0].length; i++) {
        var prompt = JSON.parse(this.props.tbacred.chlng_prompt[0][i]);
        if (prompt.is_registered) {
          this.state.dataSource.push(prompt);
        }
      }
    }

    if (Platform.OS == 'android') {
      if (this.state.isRegistered) {
        if (this.state.dataSource) {
          this.state.dataSource.push({ cred_type: 'pattern', is_registered: true });
        }
      }
    } else {
      if (this.state.isRegistered) {
        if (this.state.dataSource) {
          this.state.dataSource.push({ cred_type: 'touchid', is_registered: true });
        }
      }
    }

    if (this.state.dataSource.length > 0) {
      this.state.dataSource.push({ cred_type: 'password', is_registered: true });
    }
  }

  /**
   * This method sets the isTouchIDPresent variable to true if touchId is supported on iOS and
   * false if not supported
   */
  isTouchPresent() {
    var $this = this;
    return new Promise(function (resolve, reject) {

      TouchID.isSupported()
        .then((supported) => {
          // Success code
          console.log('TouchID is supported.');
          $this.isTouchIDPresent = true;
          resolve("success");
        })
        .catch((error) => {
          // Failure code
          console.log(error);
          $this.isTouchIDPresent = false;
          $this.state.isRegistered = false;
          $this.fillAdditionalLoginOptions();
          $this.setState({ refresh: !$this.state.refresh });
          resolve("fails");
        });

    });

  }

  //check for registercred in database if ERPasswd is in database than isRegistered flag is set to true.
  async checkForRegisteredCredsAndShow(option) {
    var ret = false;
    await AsyncStorage.getItem(Main.dnaUserName).then((value) => {
      if (value) {
        try {
          value = JSON.parse(value);
          if (value.ERPasswd == null || value.ERPasswd === 'empty') {
            this.state.isRegistered = false;
            this.fillAdditionalLoginOptions();
            this.setState({ refresh: !this.state.refresh });
          }
          else {
            this.state.isRegistered = true;
            this.fillAdditionalLoginOptions();
            this.setState({ refresh: !this.state.refresh });
          }
        } catch (e) { }
      }
      else {
        this.fillAdditionalLoginOptions();
        this.setState({ refresh: !this.state.refresh });
      }
    }).done();

    return ret;
  }
  //check facebook accessToken is valid or not.
  checkValidityOfAccessToken() {
    Events.trigger('showLoader', true);
    var $this = this;
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        var callback = function (error, result) {
          if (error) {
            LoginManager.logOut();
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
  facebookResponseCallback(error, result) {
    if (error) {
      Events.trigger('hideLoader', true);
      return (result)
    } else {
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;
      this.props.tbacred.chlng_resp[0].challenge = key;
      this.props.tbacred.chlng_resp[0].response = value;
      Main.isOtherLogin = true;
      Events.trigger("showNextChallenge", "");
      return (result)
    }
  }
  //patten login callback.
  onPatternUnlock(nav, args) {
     Main.dnaPasswd = args.password;
    this.onDoPasswordCheckChallenge(args.password);
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
        obj.onTouchIDVerificationDone();
      })
      .catch(error => {
        console.log(error)
        AlertIOS.alert(error.message);
      });
  }

  onTouchIDVerificationDone() {
    //Todo:cleanup after test
    // AsyncStorage.getItem(Main.dnaUserName).then((value) => {
    //   try {
    //     value = JSON.parse(value);
    //     ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value.ERPasswd, (response) => {
    //       if (response) {
    //         console.log('immediate response of encrypt data packet is is' + response[0].error);
    //         obj.onDoPasswordCheckChallenge(response[0].response);
    //       } else {
    //         console.log('immediate response is' + response[0].response);
    //       }
    //     });
    //   } catch (e) { }
    // }).done();

    Util.getUserDataSecure("ERPasswd").then((encryptedRPasswd) => {
      if (encryptedRPasswd) {
        Util.decryptText(encryptedRPasswd).then((RPasswd) => {
          if (RPasswd) {
          if(RPasswd.length>0){
            Main.dnaPasswd = RPasswd;
            obj.onDoPasswordCheckChallenge(RPasswd);
          }else{
          Toast.showWithGravity("TouchID authentication failed. Please login with Password", Toast.SHORT, Toast.CENTER);
          this.goToPasswordWhenAdditonalAuthFails();
          }
          }else{
          
          }
        }).done();
      }else{
      Toast.showWithGravity("TouchID authentication failed. Please login with Password", Toast.SHORT, Toast.CENTER);
        this.goToPasswordWhenAdditonalAuthFails();
      }
    }).done();
  }
  //submit response in  challenge response and showNextChallenge
  onDoPasswordCheckChallenge(args) {
    // if (args.length > 0) {
    var responseJson = this.props.url.chlngJson;
    responseJson.chlng_resp[0].response = args;
    Events.trigger('showNextChallenge', {
      response: responseJson
    });
  }


  //navigate to pattern screen
  doPatternLogin() {
    // this.props.navigator.push({
    //   id: 'pattern',
    //   onUnlock: this.onPatternUnlock,
    //   onClose: null,
    //   mode: 'verify'
    // });
    this.props.navigator.navigate('pattern',{url: {
      id: 'pattern',
      onUnlock: this.onPatternUnlock,
      onClose: null,
      mode: 'verify'
      }})
  }

  //return logintypebutton depends on item supply.
  renderItem(item) {
    return (
      <View style={Skin.layout0.bottom.loginbutton.wrap}>
        <LoginTypeButton
          label={Skin.icon[item.cred_type]}
          onPress={() => { this.loginWith(item.cred_type); } }
          text={Skin.text['0']['2'].credTypes[item.cred_type].label} />
      </View>
    );
  }
  //navigate to screen depends on option selected.
  loginWith(credType) {
    // alert(credType);
    var type = Skin.text['0']['2'].credTypes;

    switch (credType) {
      case type.facebook.key:
        this.checkValidityOfAccessToken();
        break;
      case type.password.key:
        this.setState({
          showPasswordVerify: true,
        });
        break;
      case type.touchid.key:
        //        alert("todo:");
        this._clickHandler();
        break;
      case type.pattern.key:
        this.doPatternLogin();
        break;
      case type.wechat.key: 
        alert("todo:");
        break;
    }
  }
  //show previous challenge on click of cross button or android back button.
  close() {
    Events.trigger('showPreviousChallenge');
  }
  
  goToPasswordWhenAdditonalAuthFails(){
    AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: "empty" }), null).then((value)=>{
      });
    this.state.isRegistered = false;
    this.fillAdditionalLoginOptions();
  this.setState({ showPasswordVerify: true });

  }
  
  //call when get back from PasswordVerification screen.
  goBackToSelectLogin() {
    this.setState({ showPasswordVerify: false });
  }
  /*
  This method is used to render the componenet with all its element.
*/
  render() {
    if (this.state.dataSource && (this.state.dataSource.length > 0) && !this.state.showPasswordVerify) {
      return (
        <MainActivation>
          <View style={Skin.layout0.wrap.container}>
            <StatusBar
              style={Skin.layout1.statusbar}
              backgroundColor={Skin.main.STATUS_BAR_BG}
              barStyle={'default'} />
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
              </Title>
            </View>
            <View style={Skin.layout0.top.container}>
              <Text style={[Skin.layout0.top.icon]}>
                {Skin.icon.logo}
              </Text>
              <Text style={Skin.layout0.top.subtitle}>
                {Skin.text['0']['2'].subtitle}
              </Text>
              <Text style={[Skin.layout1.content.top.text, { marginBottom: 8 }]}>Your username is</Text>
              <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR, marginBottom: 16 }]}>{Main.dnaUserName}</Text>
              <Text style={Skin.layout0.top.prompt}>
                {Skin.text['0']['2'].prompt}
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <View style={Skin.layout0.bottom.container}>
              <GridView
                style={{ flex: 1 }}
                items={this.state.dataSource}
                itemsPerRow={LOGIN_TYPE_PER_ROW}
                renderItem={this.renderItem}
                />
            </View>
          </View>
        </MainActivation>
      );
    }
    else {

            return (<PasswordVerification navigator={this.props.navigator} url={this.props.url} title={this.props.title} onBack={this.state.dataSource.length > 0 ? this.goBackToSelectLogin : null}/>);
    }
  }
}

module.exports = SelectLogin;
