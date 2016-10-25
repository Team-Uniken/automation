'use strict';

/*
  ALWAYS NEED
*/
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Main from '../../Components/Main';
import MainActivation from '../../Components/MainActivation';

import PatternView from '../PatternView';
import dismissKeyboard from 'dismissKeyboard';

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

const {
    View,
    TouchableHighlight,
    Text,
    Platform,
    AsyncStorage,
} = ReactNative;

const{
  Component
} = React;

const MAX_ATTEMPTS = 4;
const MIN_DOTS = 4;

class PatternLock extends Component {

  constructor(props) {
    super(props);
    this.mode = this.props.mode;
    this.currentPattern = "";
    if(this.mode == "set"){
      this.state =  {
        screen:"set",
        enable:true,
      };
    }
    else{
      this.state = {
        screen:"verify",
        enable:true,
        attempts:MAX_ATTEMPTS,
        countDown:0,
      };
    }

    this.onDataEncrypted=this.onDataEncrypted.bind(this);
    this.onDataDecrypted=this.onDataDecrypted.bind(this);
    this.decryptUserData =this.decryptUserData.bind(this);
    this.encryptUserData = this.encryptUserData.bind(this);
    this.onGetPattern = this.onGetPattern.bind(this);
    this.tick = this.tick.bind(this);
    this.tickerEnd = this.tickerEnd.bind(this);
    if(this.mode == "verify")
       this.msg = "Attempts left " + MAX_ATTEMPTS;
    else{
       this.msg = "Pattern should atleast be of 4 dots";
    }
    this.operationMsg = "";
  }

  componentWillMount() {
     dismissKeyboard();
     if(this.mode === "verify"){
       this.operationMsg = "Provide pattern to login";
     }
     else if(this.mode === "set"){
       if(this.state.screen === "set"){
          this.operationMsg = "Provide unlock pattern";
       }
       else{
          this.operationMsg = "Confirm unlock pattern";
       }
     }
  }
   
  onSubmit(){
      this.refs["patternView"].getPatternString();
  }

  onGetPattern(result){
    var pattern = result.pattern;
    var patternSize = result.size;

    if(!this.isEmpty(pattern)){
        if(this.mode == "verify"){
          this.currentPattern = pattern;
          try{
            AsyncStorage.getItem("ERPasswd").then((data)=> {
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
            if(patternSize >= MIN_DOTS){
              this.currentPattern = pattern;
              this.refs["patternView"].clearPattern();
              this.operationMsg = "Confirm unlock pattern";
              this.setState({
                screen: "confirm",
              });
            }
            else{
              alert("Pattern should atleast be of 4 dots");
            }
          }
          else{
            if(this.state.screen === "confirm"){
                if(this.currentPattern === pattern){
                  AsyncStorage.getItem('RPasswd').then((value) => {
                      this.encryptUserData(null,Main.dnaPasswd,pattern);
                  }).done();
                }
                else{
                  alert("Confirm pattern does not match");
                }
            }
          }
        }
    }
    else{
      alert("Pattern cannot be empty");
    }
  }



  onDataEncrypted(status){
    //alert(JSON.stringify(status));
     if(status.error == 0){
       if(this.mode == "set"){
          try{
             AsyncStorage.setItem("ERPasswd",status.response);
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
          //alert("Password: " + userDataStr);
          //try{
            //var userData = JSON.parse(userDataStr);

           // if(userData.pattern === this.currentPattern){
              // alert("pattern matched");
              this.msg ="";
              var resp = {
                password:userDataStr,
                data:this.props.data
              }

              this.props.onUnlock(resp);
           // }
            //else{
             // this.refs["patternView"].clearPattern();
             // this.wrongAttempt();
            //}
         // }
          // catch(e){
          //   this.refs["patternView"].clearPattern();
          //   this.wrongAttempt();
          // }
       }
     }else{
       this.refs["patternView"].clearPattern();
       this.wrongAttempt();
     }
  }

  encryptUserData(userid,password,pattern){
    //  var data = {
    //    "userid":userid,
    //    "password":password,
    //    "pattern":pattern,   
    //  };

    //  var dataStr = JSON.stringify(data);
     
     ReactRdna.encryptDataPacket(password,pattern,this.onDataEncrypted);
  }

  decryptUserData(data,pattern){
    ReactRdna.decryptDataPacket(data,pattern,this.onDataDecrypted);
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  startTimer(duration,tickerFunction,tickerEndFunction) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        tickerFunction(seconds,minutes);

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
            tickerEndFunction();
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
  }

  startTicker(duration,tickerFunction,tickerEndFunction){
    var timeLeft = duration;
    var tickInterval,tickerTimeout;
    var flag = true;

    function tick(){
      if(flag){
        tickerTimeout = setTimeout(tickerEnd,duration*1000);
        flag = false;
      }

      timeLeft = timeLeft - 1;
      tickerFunction(timeLeft);
    }

    function tickerEnd(){
      clearInterval(tickInterval);
      clearTimeout(tickerTimeout);
      tickerEndFunction();
    }
     
    tickInterval = setInterval(tick,1000);
  }

  wrongAttempt(){
    if(this.state.attempts <= 1){
      alert("Max wrong attempts reached, try again in 60 seconds");
      this.refs["patternView"].disableInput();
      this.startTicker(60,this.tick,this.tickerEnd);
    }
    else{
      alert("Please enter a valid pattern");
      var attemptsLeft = this.state.attempts - 1;
      this.msg = "Attempts left " + attemptsLeft;
      this.setState({
        attempts:attemptsLeft
      });
    }
  }

  tick(timeLeft){
     this.msg = "Try again in " + timeLeft + " seconds";
     this.setState({
       countDown:timeLeft
     }); 
  }

  tickerEnd(){
    this.msg = "Attempts left " + MAX_ATTEMPTS;
    this.setState({
       attempts:MAX_ATTEMPTS
    });

    this.refs["patternView"].enableInput();
  }

  setErrMsgUsingNativeProps(val){
    this.refs["error"].setNativeProps({
      text:val
    });
  }

  render() {
    var submitBtnText = "Submit";
    if(this.mode == "set" && this.state.screen == "set"){
      submitBtnText = "Continue";
    }

    // if(this.state.invalidPattern == true){
    //   this.msg = "Invalid Pattern";
    // }

    //<Text style={Skin.PatternLockStyle.errorMsg}>{this.msg}</Text>

      //  <TouchableHighlight
      //         onPress={this.onSubmit.bind(this)}
      //         underlayColor={Skin.colors.REPPLE_COLOR}
      //         style={Skin.PatternLockStyle.button}>
      //         <Text style={Skin.activationStyle.buttontext}>
      //           {submitBtnText}
      //         </Text>
      //       </TouchableHighlight>

      // {this.mode === "set"?<TouchableHighlight
      //          onPress={this.onSubmit.bind(this)}
      //          underlayColor={Skin.colors.REPPLE_COLOR}
      //          style={Skin.PatternLockStyle.button}>
      //          <Text style={Skin.activationStyle.buttontext}>
      //            {submitBtnText}
      //          </Text>
      //         </TouchableHighlight>:{}}

    if(Platform.OS == "android"){
      return (
        <View style={Skin.PatternLockStyle.patternLockParentContainer}>
          <View style={Skin.PatternLockStyle.patternLockChildContainer}>
            
            <Text style={Skin.layout0.top.subtitle}>{this.operationMsg}</Text>

            <PatternView 
            ref="patternView"
            style={Skin.PatternLockStyle.patternlockview}
            enablePatternDetection={true}  
            pathColor="#929292" circleColor="#d92a2e" dotColor="#929292" 
            gridRows='3' gridColumns='3' onGetPattern = {this.onGetPattern.bind(this)}/>

            <Text ref="error" style={Skin.layout0.top.attempt}>{this.msg}</Text>
              
          </View>
        </View>
      );
    }
    else{
      return (<View/>);
    }
  }
}

module.exports = PatternLock;
