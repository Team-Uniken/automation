'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../Skin';
import Main from '../Components/Main';
import MainActivation from '../Components/MainActivation';

import PatternView from '../Components/PatternView';

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

const {
    View,
    TouchableHighlight,
    Text,
    Platform,
    AsyncStorage,
} = React;


class PatternLock extends React.Component {

  constructor(props) {
    super(props);
    this.mode = this.props.mode;
    this.currentPattern = "";
    if(this.mode == "set"){
      this.state =  {
        screen:"set",
        invalidPattern:false,
      };
    }
    else{
      this.state = {
        screen:"verify",
        invalidPattern:false,
      };
    }

    this.onDataEncrypted=this.onDataEncrypted.bind(this);
    this.onDataDecrypted=this.onDataDecrypted.bind(this);
    this.decryptUserData =this.decryptUserData.bind(this);
    this.encryptUserData = this.encryptUserData.bind(this);
    this.onGetPattern = this.onGetPattern.bind(this);
    this.msg = "";
  }

  componentDidMount() {

  }
   
  onSubmit(){
      this.refs["patternView"].getPatternString();
  }

  onGetPattern(result){
    var pattern = result.pattern;
  
    if(this.mode == "verify"){
      this.currentPattern = pattern;
      try{
        AsyncStorage.getItem("userData").then((data)=> {
          try{
            if(data!=null && data!=undefined){
              this.decryptUserData(data,pattern);
            }
          }
          catch(e){
            console.log("unable to  get userData");
          }
        }).done();
      }catch(e){}
    }
  
    if(this.mode == "set"){
       if(this.state.screen === "set"){
          this.currentPattern = pattern;
          this.refs["patternView"].clearPattern();
          this.setState({
            screen: "confirm",
          });
       }
       else{
         if(this.state.screen === "confirm"){
            if(this.currentPattern === pattern){
              this.encryptUserData(Main.dnaUserName,Main.dnaPasswd,pattern);
            }
         }
       }
    }
  }

  onDataEncrypted(status){
     if(status.error == 0){
       if(this.mode == "set"){
          try{
             AsyncStorage.setItem("userData",status.response);
             this.props.onSetPattern(this.props.data);
          }
          catch(error){
              console.log("PatternLock -- unnable to save userData");
          }
       }
     }
  }

  onDataDecrypted(status){
     if(status.error == 0){
       if(this.mode === "verify"){
          var userDataStr = status.response;
          try{
            var userData = JSON.parse(userDataStr);

            if(userData.pattern === this.currentPattern){
              // alert("pattern matched");
              this.setState({
                invalidPattern:false
              });
              this.props.onUnlock(userData.userid,userData.password,this.props.data);
            }
            else{
              this.setState({
                 invalidPattern:true
              });
            }
          }
          catch(e){
            this.setState({
                 invalidPattern:true
            });
          }
       }
     }else{
      // alert("Sorry, something went wrong");
     }
  }

  encryptUserData(userid,password,pattern){
     var data = {
       "userid":userid,
       "password":password,
       "pattern":pattern,   
     };

     var dataStr = JSON.stringify(data);
     
     ReactRdna.encryptDataPacket(dataStr,pattern,this.onDataEncrypted);
  }

  decryptUserData(data,pattern){
    ReactRdna.decryptDataPacket(data,pattern,this.onDataDecrypted);
  }

  render() {
    var submitBtnText = "Submit";
     this.msg = "Enter Pattern";
    if(this.mode == "set" && this.state.screen == "set"){
      submitBtnText = "Continue";
    }
    else if(this.mode == "set" && this.state.screen == "confirm"){
      this.msg = "Confirm Pattern";
    }
    else{}

    if(this.state.invalidPattern == true){
      this.msg = "Invalid Pattern";
    }

    if(Platform.OS == "android"){
      return (
      <MainActivation>
        <View>
          <PatternView 
          ref="patternView"
          style={Skin.PatternLockStyle.patternlockview} 
          pathColor="#FFFFFF" circleColor="#FFFFFF" dotColor="#FFFFFF" 
          gridRows='3' gridColumns='3' onGetPattern = {this.onGetPattern.bind(this)}/>

        <Text style={Skin.PatternLockStyle.attempt}>{this.msg}</Text>

            <TouchableHighlight
                onPress={this.onSubmit.bind(this)}
                underlayColor={Skin.colors.REPPLE_COLOR}
                style={Skin.activationStyle.button}>
                <Text style={Skin.activationStyle.buttontext}>
                  {submitBtnText}
                </Text>
              </TouchableHighlight>
        </View>
      </MainActivation>
      );
    }
    else{
      return (<View/>);
    }
  }
}


module.exports = PatternLock;