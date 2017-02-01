/**
 *  Show android native pattern view for set pattern or verify pattern.
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
import dismissKeyboard from 'dismissKeyboard';
import {View, TouchableHighlight, Text, Platform, AsyncStorage, } from 'react-native'

/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
import MainActivation from '../Components/Container/MainActivation';
import PatternView from '../Components/PatternView';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
  INSTANCES
 */
const MAX_ATTEMPTS = 4;
const MIN_DOTS = 4;

class PatternLock extends Component {

  constructor(props) {
    super(props);
    this.mode = this.props.mode;
    this.currentPattern = "";
    if (this.mode == "set") {
      this.state = {
        screen: "set",
        enable: true,
      };
    }
    else {
      this.state = {
        screen: "verify",
        enable: true,
        attempts: MAX_ATTEMPTS,
        countDown: 0,
      };
    }

    this.onDataEncrypted = this.onDataEncrypted.bind(this);
    this.onDataDecrypted = this.onDataDecrypted.bind(this);
    this.decryptUserData = this.decryptUserData.bind(this);
    this.encryptUserData = this.encryptUserData.bind(this);
    this.onGetPattern = this.onGetPattern.bind(this);
    this.tick = this.tick.bind(this);
    this.tickerEnd = this.tickerEnd.bind(this);
    if (this.mode == "verify")
      this.msg = "Attempts left " + MAX_ATTEMPTS;
    else {
      this.msg = "Pattern should atleast be of 4 dots";
    }
    this.operationMsg = "";
  }
/*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
    dismissKeyboard();
    if (this.mode === "verify") {
      this.operationMsg = "Provide pattern to login";
    }
    else if (this.mode === "set") {
      if (this.state.screen === "set") {
        this.operationMsg = "Provide unlock pattern";
      }
      else {
        this.operationMsg = "Confirm unlock pattern";
      }
    }
  }
  //call on click of submit button.
  onSubmit() {
    this.refs["patternView"].getPatternString();
  }
  /**
   * callback of getPatternString return in result pattern and size.
  */
  onGetPattern(result) {
    var pattern = result.pattern;
    var patternSize = result.size;

    if (!this.isEmpty(pattern)) {
      /**
       * in verify mode it perform decryptUserData
       */
      if (this.mode == "verify") {
        this.currentPattern = pattern;
        try {
          AsyncStorage.getItem("userData").then((data) => {
            try {
              if (data != null && data != undefined) {
                this.decryptUserData(data, pattern);
              }
            }
            catch (e) {
              console.log("unable to  get userData");
            }
          }).done();
        } catch (e) { }
      }

      if (this.mode == "set") {
           /**
          * in set mode it perform encryptUserData against user.
          */
        if (this.state.screen === "set") {
          if (patternSize >= MIN_DOTS) {
            this.currentPattern = pattern;
            this.refs["patternView"].clearPattern();
            this.operationMsg = "Confirm unlock pattern";
            this.setState({
              screen: "confirm",
            });
          }
          else {
            alert("Pattern should atleast be of 4 dots");
          }
        }
        else {
          if (this.state.screen === "confirm") {
            if (this.currentPattern === pattern) {
              this.encryptUserData(Main.dnaUserName, Main.dnaPasswd, pattern);
            }
            else {
              alert("Confirm pattern does not match");
            }
          }
        }
      }
    }
    else {
      alert("Pattern cannot be empty");
    }
  }


 /**
   * callback on encryptDataPacket
   */
  onDataEncrypted(status) {
    //alert(JSON.stringify(status));
    if (status.error == 0) {
      if (this.mode == "set") {
        try {
          AsyncStorage.setItem("userData", status.response);
          this.props.onSetPattern(this.props.data);
        }
        catch (error) {
          console.log("PatternLock -- unnable to save userData");
        }
      }
    }
  }
/**
 * callback on decryptDataPacket
 */
  onDataDecrypted(status) {
    if (status.error == 0) {
      if (this.mode === "verify") {
        var userDataStr = status.response;
        try {
          var userData = JSON.parse(userDataStr);

          if (userData.pattern === this.currentPattern) {
            this.msg = "";
            this.props.onUnlock(userData.userid, userData.password, this.props.data);
          }
          else {
            this.refs["patternView"].clearPattern();
            this.wrongAttempt();
          }
        }
        catch (e) {
          this.refs["patternView"].clearPattern();
          this.wrongAttempt();
        }
      }
    } else {
      this.refs["patternView"].clearPattern();
      this.wrongAttempt();
    }
  }
/**
   * perform encryptDataPacket 
   */
  encryptUserData(userid, password, pattern) {
    var data = {
      "userid": userid,
      "password": password,
      "pattern": pattern,
    };

    var dataStr = JSON.stringify(data);

    ReactRdna.encryptDataPacket(dataStr, pattern, this.onDataEncrypted);
  }
  /**
   * perform decryptDataPacket 
   */
  decryptUserData(data, pattern) {
    ReactRdna.decryptDataPacket(data, pattern, this.onDataDecrypted);
  }
 /**
   * check string is empty or not.
   */
  isEmpty(str) {
    return (!str || 0 === str.length);
  }
  /**
   * native method called when number of fail attempts ==4.
   * and wait for 60 seconds.
   */
  startTicker(duration, tickerFunction, tickerEndFunction) {
    var timeLeft = duration;
    var tickInterval, tickerTimeout;
    var flag = true;

    function tick() {
      if (flag) {
        tickerTimeout = setTimeout(tickerEnd, duration * 1000);
        flag = false;
      }

      timeLeft = timeLeft - 1;
      tickerFunction(timeLeft);
    }

    function tickerEnd() {
      clearInterval(tickInterval);
      clearTimeout(tickerTimeout);
      tickerEndFunction();
    }

    tickInterval = setInterval(tick, 1000);
  }
 /**
   * call if pattern is wrong.
   */
  wrongAttempt() {
    if (this.state.attempts <= 1) {
      alert("Max wrong attempts reached, try again in 60 seconds");
      this.refs["patternView"].disableInput();
      this.startTicker(60, this.tick, this.tickerEnd);
    }
    else {
      alert("Please enter a valid pattern");
      var attemptsLeft = this.state.attempts - 1;
      this.msg = "Attempts left " + attemptsLeft;
      this.setState({
        attempts: attemptsLeft
      });
    }
  }

  tick(timeLeft) {
    this.msg = "Try again in " + timeLeft + " seconds";
    this.setState({
      countDown: timeLeft
    });
  }

  tickerEnd() {
    this.msg = "Attempts left " + MAX_ATTEMPTS;
    this.setState({
      attempts: MAX_ATTEMPTS
    });

    this.refs["patternView"].enableInput();
  }

  setErrMsgUsingNativeProps(val) {
    this.refs["error"].setNativeProps({
      text: val
    });
  }
 /*
    This method is used to render the componenet with all its element.
  */
  render() {
    var submitBtnText = "Submit";
    if (this.mode == "set" && this.state.screen == "set") {
      submitBtnText = "Continue";
    }
    if (Platform.OS == "android") {
      return (
        <MainActivation navigator={this.props.navigator} style={{ backgroundColor: '#ffffff' }} scroll={false}>
          <View style={Skin.PatternLockStyle.patternLockParentContainer}>
            <View style={Skin.PatternLockStyle.patternLockChildContainer}>

              <Text style={Skin.PatternLockStyle.operationMsg}>{this.operationMsg}</Text>

              <PatternView
                ref="patternView"
                style={Skin.PatternLockStyle.patternlockview}
                enablePatternDetection={true}
                pathColor="#FFFFFF" circleColor="#FFFFFF" dotColor="#FFFFFF"
                gridRows='3' gridColumns='3' onGetPattern = {this.onGetPattern.bind(this) }/>

              <Text ref="error" style={Skin.PatternLockStyle.errorMsg}>{this.msg}</Text>

            </View>
          </View>
        </MainActivation>
      );
    }
    else {
      return (<View/>);
    }
  }
}

module.exports = PatternLock;
