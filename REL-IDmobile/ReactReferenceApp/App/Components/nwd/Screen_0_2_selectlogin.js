
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import LoginTypeButton from '../view/logintypebutton';
import PasswordVerification from './Screen_2_2_password';
import GridView from 'react-native-grid-view';


const {Text, View,Platform } = ReactNative;
const {Component} = React;

//Facebook login code
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;


const LOGIN_TYPE_PER_ROW = 3;

class SelectLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showPasswordVerify: false,
    }

    if (this.props.tbacred) {
      this.state.dataSource = this.props.tbacred.chlng_prompt[0];
    }

    this.loginWith = this.loginWith.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.facebookResponseCallback = this.facebookResponseCallback.bind(this);
    this.fillAdditionalLoginOptions = this.fillAdditionalLoginOptions.bind(this);

    this.fillAdditionalLoginOptions();
  }

  touch() {
    alert("todo");
  }

  wechat() {
    alert("todo");
  }

  componentWillMount() {
    
  }
  
  //Facebook login code
  doFacebookLogin() {
    $this = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result, error) => {
        {
          if (result.isCancelled) {
            alert('Login cancelled');
          } else {
            alert('Login success with permissions: '
              + result.grantedPermissions.toString());
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
    if(Platform.OS == 'android'){
      if(isRegistered('pattern')){
        if(this.state.dataSource){
          this.state.dataSource.push({credType:'pattern',isRegistered:true});
        }
      }
    }else{
      if(isRegistered('touchid')){
        if(this.state.dataSource){
          this.state.dataSource.push({credType:'touchid',isRegistered:true});
        }
      }
    }
  }

  isRegistered(option){
     return true;
  }

  //Facebook login code
  facebookResponseCallback(error, result) {
    if (error) {
      alert(result);
      return (result)
    } else {
      alert(result);
      //fill response in challenge
      var key = Skin.text['0']['2'].credTypes.facebook.key;
      var value = result.id;
      this.props.tbacred.chlng_resp[0].challenge = key;
      this.props.tbacred.chlng_resp[0].response = value;
      return (result)
    }
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
          label={Skin.icon[item.credType]}
          onPress={() => { this.loginWith(item.credType); } }
          text={Skin.text['0']['2'].credTypes[item.credType].label} />
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
        alert("todo:");
        break;
      case type.pattern.key:
         alert("todo");
         break;
      case type.wechat.key:
        alert("todo:");
        break;
    }
  }

  render() {
    if (this.dataSource && (this.state.dataSource.length > 0) && !this.state.showPasswordVerify){
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
