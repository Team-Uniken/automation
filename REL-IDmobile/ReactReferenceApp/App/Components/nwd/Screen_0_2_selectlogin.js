
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import LoginTypeButton from '../view/logintypebutton';
import PasswordVerification from './Screen_2_2_password';
import GridView from 'react-native-grid-view';
import TouchID from 'react-native-touch-id';

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

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

const {Text, View,Platform,
  AsyncStorage, } = ReactNative;
const {Component} = React;

var obj;
//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
  
} = FBSDK;


const LOGIN_TYPE_PER_ROW = 3;

class SelectLogin extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
    dataSource: [],
    isRegistered:false,
    refresh:false,
    showPasswordVerify: false,
    }
    
    this.loginWith = this.loginWith.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.fillAdditionalLoginOptions = this.fillAdditionalLoginOptions.bind(this);
    this.checkForRegisteredCredsAndShow = this.checkForRegisteredCredsAndShow.bind(this);
    this.doPatternLogin = this.doPatternLogin.bind(this);
    this.onPatternUnlock =this.onPatternUnlock.bind(this);
    
    this.checkForRegisteredCredsAndShow();
  }
  
  componentWillMount() {
    obj = this;
  }
  
  //Facebook login code
  doFacebookLogin() {
    $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result, error) => {
      {
      if (result.isCancelled) {
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
      }).done();
  }
  
  fillAdditionalLoginOptions(){
    this.state.dataSource=[];
    if(this.props.tbacred){
      for(var i = 0;i<this.props.tbacred.chlng_prompt[0].length;i++){
        var prompt = JSON.parse(this.props.tbacred.chlng_prompt[0][i]);
        if(prompt.is_registered){
          this.state.dataSource.push(prompt);
        }
      }
    }
     
   
    if(Platform.OS == 'android'){
      if(this.state.isRegistered){
        if(this.state.dataSource){
          this.state.dataSource.push({cred_type:'pattern',is_registered:true});
        }
      }
    }else{
      if(this.state.isRegistered){
        if(this.state.dataSource){
          this.state.dataSource.push({cred_type:'touchid',is_registered:true});
        }
      }
    }

    if(this.state.dataSource.length > 0){
      this.state.dataSource.push({cred_type:'password',is_registered:true});
    }
  }
  
  async checkForRegisteredCredsAndShow(option){
    var ret = false;
    await AsyncStorage.getItem('ERPasswd').then((value) => {
      if(value==null || value === 'empty'){
        this.state.isRegistered =false;
        this.fillAdditionalLoginOptions();
        this.setState({refresh:!this.state.refresh});
      }
      else{
        this.state.isRegistered =true;
        this.fillAdditionalLoginOptions();
        this.setState({refresh:!this.state.refresh});
      }
    }).done();
   
    return ret;
  }
  
  //Facebook login code
  facebookResponseCallback(error, result) {
    if (error) {
      return (result)
    } else {
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;
      this.props.tbacred.chlng_resp[0].challenge = key;
      this.props.tbacred.chlng_resp[0].response = value;
      Events.trigger("showNextChallenge",null);
      return (result)
    }
  }
  
  onPatternUnlock(args){
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

  
  
  onTouchIDVerificationDone(){
     AsyncStorage.getItem('ERPasswd').then((value) => {
    ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, "com.uniken.PushNotificationTest", value, (response) => {
      if (response) {
      console.log('immediate response of encrypt data packet is is' + response[0].error);
      obj.onDoPasswordCheckChallenge(response[0].response);
      } else {
      console.log('immediate response is' + response[0].response);
      }
      });
       }).done();
    
  }
  
  onDoPasswordCheckChallenge(args){
    if (args.length > 0) {
      var responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = args;
      Events.trigger('showNextChallenge', {
      response: responseJson
        });
    } else {
      alert('Please enter password');
    }
  
  
  }
  
  
  
  doPatternLogin(){
    this.props.navigator.push({
    id: 'pattern',
    onUnlock:this.onPatternUnlock,
    mode:'verify'
      });
  }
  
  // <View style={Skin.layout0.bottom.loginbutton.wrap}>
  //               <LoginTypeButton
  //                 label={Skin.icon.touchid}
  //                 onPress={this.touch.bind(this) }
  //                 text="TouchId" />
  //               <LoginTypeButton
  //                 label={Skin.icon.password}
  //                 onPress={this.password.bind(this) }
  //                 text="Password" />
  //               <LoginTypeButton
  //                 label={Skin.icon.wechat}
  //                 onPress={this.wechat.bind(this) }
  //                 text="WeChat" />
  //             </View>
  //             <View style={Skin.layout0.bottom.loginbutton.wrap}>
  //               <LoginTypeButton
  //                 label={Skin.icon.facebook}
  //                 onPress={this.touch.bind(this) }
  //                 text="Facebook" />
  //             </View>
  
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
  
  loginWith(credType) {
    // alert(credType);
    var type = Skin.text['0']['2'].credTypes;
    
    switch (credType) {
      case type.facebook.key:
        this.doFacebookLogin();
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
  
  render() {
    if (this.state.dataSource && (this.state.dataSource.length > 0) && !this.state.showPasswordVerify){
      return (
        <View style={Skin.layout0.wrap.container}>
        <View style={Skin.layout0.top.container}>
        <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
        {Skin.icon.logo}
        </Text>
        <Text style={Skin.layout0.top.subtitle}>
        {Skin.text['0']['2'].subtitle}
        </Text>
        <Text style={Skin.layout0.top.prompt}>
        {Skin.text['0']['2'].prompt}
        </Text>
        </View>
        <View style={Skin.layout0.bottom.container}>
        <GridView
        items={this.state.dataSource}
        itemsPerRow={LOGIN_TYPE_PER_ROW}
        renderItem={this.renderItem}
        />
        </View>
        </View>
        );
    }
    else {
      return (<PasswordVerification navigator={this.props.navigator} url={this.props.url} title={this.props.title} />);
    }
  }
}

module.exports = SelectLogin;
