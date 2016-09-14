'use strict';

/*
 ALWAYS NEED
 */
import React from 'react-native';
import Skin from '../../Skin';


/*
 CALLED
 */
import Main from '../Main';
import MainActivation from '../MainActivation';
import OpenLinks from '../OpenLinks';
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';
import PatternLock from '../../Scenes/PatternLock'
import TouchID from 'react-native-touch-id';
import PasscodeAuth from 'react-native-passcode-auth';
import TouchId from 'react-native-smart-touch-id'
const reason = 'Please validate your Touch Id';
/*
	INSTANCES
 */
let responseJson;
let chlngJson;
let nextChlngName;
let obj;
let statusMessage;
let savedUserName;
const {
  Text,
  TextInput,
  View,
  Animated,
  TouchableOpacity,
  InteractionManager,
  AsyncStorage,
  Platform,
  AlertIOS,
} = React;


class UserLogin extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    r_opac_val: new Animated.Value(0),
    i_opac_val: new Animated.Value(0),
    d_opac_val: new Animated.Value(0),
    relid_text_opac: new Animated.Value(0),
    rid_top: new Animated.Value(253),
    r_text_opac: new Animated.Value(0),
    i_text_opac: new Animated.Value(0),
    d_text_opac: new Animated.Value(0),
    relid_opac_val: new Animated.Value(0),
    logWrapOpac: new Animated.Value(0),
    logWarnOpac: new Animated.Value(0),
    progWrapOpac: new Animated.Value(0),
    progress: 0,
    inputUsername: '',
    inputPassword: '',
    login_button_text: 'Login',
    loginAttempts: 5,
    passAttempts: 5,
    Challenge:this.props.url.chlngJson,
    failureMessage: '',
    pattern:false,
    isLoaderVisible:false,

    };

    this.locked = true;

   // this.verifyPattern = this.verifyPattern.bind(this);
    this.onUnlock = this.onUnlock.bind(this);
  }
  
  
  openRoute(route) {
    this.props.navigator.push(route);
  }
  
  
  onCheckChallengeResponseStatus(e) {
    var res = JSON.parse(e.response);
    var statusCode = res.pArgs.response.StatusCode
    if (statusCode == 100) {
      chlngJson = res.pArgs.response.ResponseData;
      //This is important, hardcoding is done for testing purpose
      // var temp = JSON.parse(chlngJson);
      // nextChlngName = temp.chlng[0].chlng_name
      nextChlngName = 'PasswordVerification';
      obj.checkUsernameSuccess();
    } else {
      statusMessage = res.pArgs.response.StatusMsg;
      obj.checkUsernameFailure();
    };
  }

  componentDidUpdate(){
    if(Platform.OS == "android" && this.locked == false){
        AsyncStorage.getItem("passwd").then((value) => {
                                              if(value){
                                                if(value === "empty"){
                                                    console.log("user empty");
                                                }else{
                                                  AsyncStorage.getItem("userId").then((value) => {
                                                    savedUserName = value;
                                                    obj.state.inputUsername = savedUserName;
                                                    obj.checkUsername();
                                                  }).done();
                                                }
                                              }else{
                                                      console.log("no value in async storage");
                                                      InteractionManager.runAfterInteractions(() => {
                                                                                              this.refs.inputUsername.focus();
                                                                                              });                                            
                                            }
                                            }).done();
    }
  }
  
  componentDidMount() {
    obj = this;
     Main.isTouchVerified = "NO";
    if(this.locked === false){
        AsyncStorage.getItem("passwd").then((value) => {
                                              if(value){
                                                if(value === "empty"){
                                                    console.log("user empty");
                                                }else{
                                                  AsyncStorage.getItem("userId").then((value) => {
                                                    savedUserName = value;
                                                    if(Platform.OS === 'ios'){
                                                      console.log("ios touch");
                                                      this._verifyTouchIdSupport();
                                                    }else if(Platform.OS === "android"){
                                                      obj.state.inputUsername = savedUserName;
                                                      obj.checkUsername();
                                                    };
                                                  }).done();
                                                }
                                              }else{
                                                      console.log("no value in async storage");
                                                      InteractionManager.runAfterInteractions(() => {
                                                                                              this.refs.inputUsername.focus();
                                                                                              });
                                            
                                            }
                                            }).done();
    
    }
  }
  
  
  componentWillMount() {
      if(Platform.OS == "android"){
                  try{
                    AsyncStorage.getItem("userData").then((value)=>{
                      if(value!=null && value!=undefined){ 
                      //  var chlngJson = { id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } };  
                        this.setState({
                          pattern:true,
                        });
                        //this.verifyPattern(chlngJson);
                      }
                    }).done();
                  }
                  catch(e){}
       }else{
         this.locked =false;
       }

    console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));
  }
  
  
  
  _verifyTouchIdSupport(){
    TouchID.isSupported()
    .then(supported => {
          // Success code
          console.log('TouchID is supported.');
          obj._verifyTouchId();
          })
    .catch(error => {
           console.log('TouchID is not supported.');
           console.log(error);
           });
  }
  
  _verifyTouchId(){
    TouchID.authenticate(reason)
    .then(success => {
          // Success code
          Main.isTouchVerified = "YES";
          console.log('in verify touchId');
          obj.state.inputUsername = savedUserName;
          obj.checkUsername();
          })
    .catch(error => {
           console.log(error)
           var er = error.name;
           Main.isTouchVerified = "NO";
           if(er === "LAErrorUserFallback"){
           console.log("user clicked password");
           obj.state.inputUsername = savedUserName;
           obj.checkUsername();
//           fallbackAuth();
           }else{
           AlertIOS.alert(error.message);
           }
           });
    
  }
  
  fallbackAuth() {
    alert("infallback");
    console.log('in verify touchId fallback');
    Main.isTouchVerified = "NO";
  }

  
  
  updateProgress() {
    setTimeout((function() {
                this.setState({ progress: this.state.progress + (0.4 * LoadSpd) });
                if (this.state.progress < 1) {
                this.updateProgress();
                } else {
                console.log('complete');
                // this.props.navigator.push(
                //  {id: "PasswordVerification",title:nextChlngName,url:chlngJson}
                // );
                }
                }).bind(this), 5);
  }
  
  
  onUsernameChange(event) {
    this.setState({ inputUsername: event.nativeEvent.text });
  }
  
  checkUsername() {
    this.state.progress = 0;
    var un = this.state.inputUsername;
//    this.setState({ isLoaderVisible: true});
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });
      // this.updateProgress();
    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
                                              alert('Please enter a valid username');
                                              });
    }
  }
  
  
  checkUsernameSuccess(){
    Main.dnaUserName = savedUserName;
    InteractionManager.runAfterInteractions(() => {
                                            this.props.navigator.push(
                                                                      {id: "Activation",title:nextChlngName,url:chlngJson}
                                                                      );
                                            });
  }
  
  
  checkUsernameFailure() {
        console.log('\n\nin checkUsernameFailure');
    this.setState({ isLoaderVisible: false});
    this.state.progress = 0;
    Animated.sequence([
                       Animated.timing(this.state.logWrapOpac, {
                                       toValue: 1,
                                       duration: 1 * 0.1,
                                       delay: 0 * Skin.spd
                                       }),
                       Animated.timing(this.state.progWrapOpac, {
                                       toValue: 0,
                                       duration: 500 * Skin.spd,
                                       delay: 0 * Skin.spd
                                       })
                       ]).start();
    this.clearText('inputUsername')
    this.setState({ failureMessage: statusMessage });
    Animated.sequence([
                       Animated.timing(this.state.logWarnOpac, {
                                       toValue: 1,
                                       duration: 500 * Skin.spd,
                                       delay: 0 * Skin.spd
                                       })
                       ]).start();
    this.refs.inputUsername.focus();
    
  }
  
  
  getProgress(offset) {
    var progress = this.state.progress + offset;
    return progress;
  }
  
  
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({ text: '' });
  }

  // verifyPattern(chlngJson){
  //   this.props.navigator.push({
  //     id: "Pattern",
  //     title: "Verify Pattern",
  //     url: {
  //       data: chlngJson,
  //     },
  //     unlockCallback: this.onUnlock,
  //     mode: "verify"
  //   });
  // }

  onUnlock(userid,password,data){
    this.locked =false;
    var thisRef = this;
    AsyncStorage.setItem("userId",userid,()=>{
      AsyncStorage.setItem("passwd",password,()=>{
          thisRef.setState({
              pattern:false,
          });
      });
    });
  }
  
  render() {
    if(this.state.pattern === false){
      var fla = this.state.isLoaderVisible;
      console.log('\n\n\n is Loader == ', fla);
        return (
                
                <MainActivation
                navigator={this.props.navigator}>
               
                  <View style={Skin.activationStyle.topGroup}>
                    <Animated.View style={[Skin.loadStyle.rid_wrap,{marginTop:70}]}>
                      <View style={Skin.loadStyle.rid_center}>
                        <Animated.Image source={require('../img/ubs.png')}
                          style={{width:120}} resizeMode={'contain'}
                        />
                      </View>
                    </Animated.View>
                  
                  <View style={[Skin.activationStyle.input_wrap,{marginTop:60}]}>
                    <View style={Skin.activationStyle.textinput_wrap}>
                      <TextInput
                        ref='inputUsername'
                        returnKeyType={'next'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        placeholder={'Username'}
                        placeholderTextColor={'rgba('+Skin.login.PLACEHOLDER_TEXT_COLOR_RGB +', '+Skin.login.PLACEHOLDER_TEXT_OPACITY+')'}
                        style={Skin.activationStyle.textinput}
                        value={this.state.inputUsername}
                        onSubmitEditing={this.checkUsername.bind(this)}
                        onChange={this.onUsernameChange.bind(this)}
                      />
                    </View>
                  </View>
                  <View style={Skin.activationStyle.input_wrap}>
                    <TouchableOpacity
                    style={Skin.activationStyle.button}
                    onPress={this.checkUsername.bind(this)}
                    underlayColor={Skin.login.BUTTON_UNDERLAY}
                    activeOpacity={0.8}
                    >
                    <Text style={Skin.activationStyle.buttontext}>
                    LOGIN
                    </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={Skin.activationStyle.warning_text}></Text>
                <OpenLinks />
                </MainActivation>
                );
    }
    else{
      return (<PatternLock navigator={this.props.navigator} title="Verify Pattern"  
              onUnlock={this.onUnlock} mode="verify" />);
    }
  }
}

module.exports = UserLogin;
