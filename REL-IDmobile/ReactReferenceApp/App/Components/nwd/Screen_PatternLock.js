'use strict';

/*
  ALWAYS NEED
*/
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Main from '../Main';
import MainActivation from '../../Components/MainActivation';

import PatternView from '../PatternView';
import dismissKeyboard from 'dismissKeyboard';
import Title from '../view/title';
import Events from 'react-native-simple-events';

const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

const {
  View,
  TouchableHighlight,
  Text,
  Platform,
  AsyncStorage,
  StatusBar,
  BackAndroid
} = ReactNative;

const {
  Component
} = React;

const MAX_ATTEMPTS = 4;
const MIN_DOTS = 4;

class PatternLock extends Component {

  constructor(props) {
    super(props);
    this.mode = this.props.mode;
    this.clearTimers = null;
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
    this.startTicker = this.startTicker.bind(this);
    this.tick = this.tick.bind(this);
    this.tickerEnd = this.tickerEnd.bind(this);
    if (this.mode == "verify")
      this.msg = "Attempts left " + MAX_ATTEMPTS;
    else {
      this.msg = "Pattern should atleast be of 4 dots";
    }
    this.operationMsg = "";
  }

  componentWillMount() {
    dismissKeyboard();
    if (this.mode === "verify") {
      if (this.props.operationMsg)
        this.operationMsg = this.props.operationMsg;
      else
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

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }

  onSubmit() {
    this.refs["patternView"].getPatternString();
  }

  onGetPattern(result) {
    var pattern = result.pattern;
    var patternSize = result.size;

    if (!this.isEmpty(pattern)) {
      if (this.mode == "verify") {
        this.currentPattern = pattern;
        try {
          AsyncStorage.getItem(Main.dnaUserName).then((data) => {
            try {
              if (data) {
                data = JSON.parse(data);
                if (data.ERPasswd) {
                  this.decryptUserData(data.ERPasswd, pattern);
                }
              }
            }
            catch (e) {
              console.log("unable to  get userData");
            }
          }).done();
        } catch (e) { }
      }

      if (this.mode == "set") {
        if (this.state.screen === "set") {
          if (patternSize >= MIN_DOTS) {
            if (this.props.disableConfirmation === true) {
              this.currentPattern = pattern;
              AsyncStorage.getItem(Main.dnaUserName).then((value) => {
                if (value) {
                  try {
                    value = JSON.parse(value);
                    this.encryptUserData(null, value.RPasswd, pattern);
                  } catch (e) { }
                }
              }).done();
            }
            else {
              this.currentPattern = pattern;
              this.refs["patternView"].clearPattern();
              this.operationMsg = "Confirm unlock pattern";
              this.state.screen = "confirm";
              this.setState({
                screen: "confirm",
              });
            }
          }
          else {
            alert("Pattern should atleast be of 4 dots");
          }
        }
        else {
          if (this.state.screen === "confirm") {
            if (this.currentPattern === pattern) {
              AsyncStorage.getItem(Main.dnaUserName).then((value) => {
                if (value) {
                  try {
                    value = JSON.parse(value);
                    this.encryptUserData(null, value.RPasswd, pattern);
                  } catch (e) { }
                }
              }).done();
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



  onDataEncrypted(status) {
    //alert(JSON.stringify(status));
    if (status.error == 0) {
      if (this.mode == "set") {
        try {
          AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ ERPasswd: status.response }), null);
          this.props.onSetPattern(this.props.data);
        }
        catch (error) {
          console.log("PatternLock -- unnable to save userData");
        }
      }
    }
    else{
      this.state.screen = "set";
      alert("Could not register pattern");
      this.close();
    }
  }

  onDataDecrypted(status) {
    if (status.error == 0) {
      if (this.mode === "verify") {
        var userDataStr = status.response;
        //alert("Password: " + userDataStr);
        //try{
        //var userData = JSON.parse(userDataStr);

        // if(userData.pattern === this.currentPattern){
        // alert("pattern matched");
        this.msg = "";
        var resp = {
          password: userDataStr,
          data: this.props.data
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
    } else {
      this.refs["patternView"].clearPattern();
      this.wrongAttempt();
    }
  }

  encryptUserData(userid, password, pattern) {
    //  var data = {
    //    "userid":userid,
    //    "password":password,
    //    "pattern":pattern,   
    //  };

    //  var dataStr = JSON.stringify(data);

    ReactRdna.encryptDataPacket(password, pattern, this.onDataEncrypted);
  }

  decryptUserData(data, pattern) {
    ReactRdna.decryptDataPacket(data, pattern, this.onDataDecrypted);
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  startTicker(duration, tickerFunction, tickerEndFunction) {
    var timeLeft = duration;
    var tickInterval, tickerTimeout;
    var flag = true;
    var now = null;

    function tick() {
      if (flag) {
        tickerTimeout = setTimeout(tickerEnd, duration * 1000);
        flag = false;
      }

      var temp = null;
      if (now != null) {
        temp = Date.now();
        //alert((temp - now));
        var timeDiff = (temp - now)
        if (timeDiff > 1500) {
          clearTimeout(tickerTimeout);
          timeLeft = timeLeft - Math.round(timeDiff / 1000);
          tickerTimeout = setTimeout(tickerEnd, (timeLeft * 1000));
        }
      }

      now = temp == null ? Date.now() : temp;

      timeLeft = timeLeft - 1;
      tickerFunction(timeLeft);
    }

    function clearTimers() {
      clearInterval(tickInterval);
      clearTimeout(tickerTimeout);
    }

    function tickerEnd() {
      clearTimers();
      tickerEndFunction();
    }

    this.clearTimers = clearTimers;

    tickInterval = setInterval(tick, 1000);
  }

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

  close() {
    this.refs["patternView"].clearPattern();
    if (this.mode === "verify") {
      if (this.clearTimers) {
        this.clearTimers();
      }

      if (this.props.onClose)
        this.props.onClose();
      else
        this.props.navigator.pop();
    } else {
      if (this.state.screen === "set") {
        if (this.props.onClose)
          this.props.onClose();
        else
          this.props.navigator.pop();
      } else if (this.state.screen === "confirm") {
        this.state.screen = "set";
        this.setState({ screen: "set" });
      }
    }
  }

  componentWillUpdate() {
    if (this.mode === "set") {
      if (this.state.screen === "set") {
        this.operationMsg = "Provide unlock pattern";
      }
      else {
        this.operationMsg = "Confirm unlock pattern";
      }
    }
  }

  render() {
    var submitBtnText = "Submit";
    if (this.mode == "set" && this.state.screen == "set") {
      submitBtnText = "Continue";
    }

    if (Platform.OS == "android") {
      return (
        <View style={[Skin.layout1.wrap, { flex: 1 }]}>
          <StatusBar
            style={Skin.layout1.statusbar}
            backgroundColor={Skin.main.STATUS_BAR_BG}
            barStyle={'default'} />
          <View style={{ justifyContent: 'center' }}>
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
              </Title>
            </View>
          </View>
          <View style={Skin.layout1.content.wrap}>
            <View style={Skin.layout1.content.container}>
              <View style={Skin.layout1.content.top.container}>
                <View style={Skin.PatternLockStyle.patternLockParentContainer}>
                  <View style={Skin.PatternLockStyle.patternLockChildContainer}>
                    <Text style={[Skin.layout1.content.top.text, { marginBottom: 8 }]}>Your username is</Text>
                    <Text style={[Skin.layout1.content.top.text, { fontSize: 18, color: Skin.colors.BUTTON_BG_COLOR, marginBottom: 16 }]}>{Main.dnaUserName}</Text>

                    <Text style={Skin.layout0.top.subtitle}>{this.operationMsg}</Text>

                    <PatternView
                      ref="patternView"
                      style={Skin.PatternLockStyle.patternlockview}
                      enablePatternDetection={true}
                      pathColor="#929292" circleColor="#d92a2e" dotColor="#929292"
                      gridRows='3' gridColumns='3' onGetPattern = {this.onGetPattern.bind(this) }/>

                    <Text ref="error" style={Skin.PatternLockStyle.errorMsg}>{this.msg}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
    else {
      return (<View/>);
    }
  }
}

module.exports = PatternLock;
