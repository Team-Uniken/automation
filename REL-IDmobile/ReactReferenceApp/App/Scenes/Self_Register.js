/*
 *Simple self registration screen.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import Modal from 'react-native-simple-modal';
import hash from 'hash.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Keyboard, StatusBar, StyleSheet, Text, View, BackHandler, TouchableHighlight, Platform, TouchableOpacity, WebView, TextInput, Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, NetInfo, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../Skin';
import WebViewAndroid from '../android_native_modules/nativewebview';
import Main from '../Components/Container/Main';
import MainActivation from '../Components/Container/MainActivation';
import Util from '../Components/Utils/Util'
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

/*
 Custome View
 */
import Title from '../Components/view/title';
import Button from '../Components/view/button';
import Checkbox from '../Components/view/checkbox';
import Input from '../Components/view/input';


/*
  INSTANCES
 */
var obj;
var responseJson;




class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      check: false,
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phoneNumber: '',
      value: this.props.value,
      resetSlider: false,
      keyboardVisible: false,
    };

    this.close = this.close.bind(this);
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component will start to load
    */
  componentWillMount() {
    obj = this;
    this.state.value = 0;
    InteractionManager.runAfterInteractions(() => {
      this.refs.firstname.focus()
    });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }


  keyboardWillShow(e) {
    this.setState({ keyboardVisible: true })
    //Alert.alert('yes')
  }

  keyboardWillHide(e) {
    this.setState({ keyboardVisible: false })
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  //use to change checkbox UI from checked to uncheck or uncheck to check.
  selectCheckbox() {
    if (!this.state.check) {
      this.setState({ check: true });
    } else {
      this.setState({ check: false });
    }
  }

  //onTextchange method for FirstName TextInput
  onFirstNameChange(event) {
    this.setState({ firstName: event.nativeEvent.text });
  }
  //onTextchange method for LastName TextInput
  onLastNameChange(event) {
    this.setState({ lastName: event.nativeEvent.text });
  }
  //onTextchange method for Email TextInput
  onEmailChange(event) {
    this.setState({ email: event.nativeEvent.text });
  }
  //onTextchange method for ConfirmEmail TextInput
  onConfirmEmailChange(event) {
    this.setState({ confirmEmail: event.nativeEvent.text });
  }
  //onTextchange method for PhoneNumber TextInput
  onPhoneNumberChange(event) {
    if (obj.validatePhoneNumber(event.nativeEvent.text) && event.nativeEvent.text.length <= 10)
      this.setState({ phoneNumber: event.nativeEvent.text });
    else {
      if (event.nativeEvent.text.length == 0)
        this.setState({ phoneNumber: event.nativeEvent.text });
      this.setState.phoneNumber = this.setState.phoneNumber;
    }
  }

  //use to clear twoFactorAuthMachine navigator
  close() {
    dismissKeyboard();
    Events.trigger('closeStateMachine');
  }
  //check entered email is valid or not
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  //check entered phoneNumber is valid or not
  validatePhoneNumber(phone) {
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    var reg = /^\d+$/;
    // return regex.test(phone)
    return reg.test(phone)
  }

  // check all fields are filled with valid data to call registerUser.
  validateAndProcced() {
    if (!(this.state.firstName.trim().length > 0 && this.state.lastName.trim().length > 0 && this.state.email.trim().length > 0
      && this.state.confirmEmail.trim().length > 0 && this.state.phoneNumber.trim().length > 0)) {
      this.showMessage("Error", "All fields are mandatory", false);
      return;
    } else if (!this.validateEmail(this.state.email)) {
      this.showMessage("Error", "Enter valid Email ID", false);
      return;
    } else if (!(this.state.email === this.state.confirmEmail)) {
      this.showMessage("Error", "Entered emails do not match", false);
      return;
    } else if (this.state.value < 90) {
      this.showMessage("Error", "Please move the slider to the right.", false);
      return;
    } else if (this.state.check) {
      if (Main.isConnected) {
        this.registerUser();
      } else {
        this.showMessage("Error", "Please check your internet connection", false);
      }

    } else {
      this.showMessage("Error", "Accept Terms and Conditions", false);
    }
  }

  //RegisterUser on currentProfile.
  registerUser() {
    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      currentProfile = JSON.parse(currentProfile);
      //var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";

      var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/addNewUser.htm";
      console.log("---Register ---baseUrl =" + baseUrl)

      // USER_ID_STR, mandatory = true          // will be email Id
      // GROUP_NAME_STR, mandatory = true       // Hardcode
      // SECONDARY_GROUP_NAMES_STR, mandatory = false
      // EMAIL_ID_STR, mandatory = false          // sholud be there
      // MOB_NUM_ID_STR, mandatory = false        // sholud be there
      // IS_RELIDZERO_ENABLED, mandatory = true     // hardcode
      var userMap = {
        "firstName": this.state.firstName.trim(),
        "lastName": this.state.lastName.trim(),
        "userId": this.state.email.trim(),
        "groupName": "group1",
        "emailId": this.state.email.trim(),
        "mobNum": this.state.phoneNumber.trim(),
        "isRELIDZeroEnabled": "true",
        "username": "sruser",
        "password": "1e99b14aa45d6add97271f8e06adacda4e521ad98a4ed18e38cfb0715e7841d2",
      };

      console.log("---Register ---Usermap =" + JSON.stringify(userMap));
      Events.trigger('showLoader', true);

      var postData = Util.convertToPostData(userMap);
      var contentType = JSON.stringify({ "Content-Type": "application/x-www-form-urlencoded" });
      ReactRdna.openHttpConnection(ReactRdna.RDNA_HTTP_POST, baseUrl, contentType, postData, (response) => {
        // RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
        console.log(response);
        Events.trigger('hideLoader', true);
        if (response[0].error == 0) {
          var res;
          try {
            res = JSON.parse(response[0].response.httpResponse.body);
          } catch (e) {
            obj.showMessage("Error", "Invalid response.Please try again", false);
            this.setState({ value: true, value: 0 }, () => {
              this.state.resetSlider = false;
            });
            return;
          }
          if (res.isError == false) {
            obj.showMessage("Activation Code Sent to", this.state.confirmEmail + "\nPlease check the email for more instruction.", true);
          } else {

            setTimeout(() => {
              alert(res.errorMessage);
            }, 100);
            this.setState({ resetSlider: true, value: 0 }, () => {
              this.state.resetSlider = false;
            });
          }
        } else {
          setTimeout(() => {
            alert("Service not available");
          }, 100);
          this.setState({ resetSlider: true, value: 0 }, () => {
            this.state.resetSlider = false;
          });
        }
      });

    }).done();
  }

  //show alert dailog with msg and title pass to it
  showMessage(title, msg, press) {
    setTimeout(() => {

      Alert.alert(
        title,
        msg,
        [{
          text: 'OK',
          onPress: () => {
            if (press) {
              //            obj.props.navigator.pop();
              obj.checkUsername();

            }

          }
        }],
        { cancelable: false }
      )
    }, 100);
  }
  /*
     This method is used to get the confirmEmail and submit the same as a challenge response and call showNextChallenge.
   */
  checkUsername() {
    this.state.progress = 0;
    var un = this.state.confirmEmail;
    if (un.length > 0) {
      savedUserName = un;
      AsyncStorage.setItem("userId", un);
      AsyncStorage.setItem("RUserId", un);
      Main.dnaUserName = un;
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = un;
      Events.trigger('showNextChallenge', { response: responseJson });
    } else {
      dismissKeyboard();
      AsyncStorage.setItem("userId", "empty");
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          alert('Please enter a valid username');
        }, 100);
      });
    }
  }

  //Return platform specific webView to term and Conditions Page.
  getWebView() {
    if (Platform.OS === 'ios') {
      return (
        <WebView
          automaticallyAdjustContentInsets={false}
          source={{ uri: 'http://api.relid.uniken.com/' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          //          onNavigationStateChange={this.onNavigationStateChange.bind(this) }
          onLoad={() => { console.log('loaded') } }
          scalesPageToFit={true}
          scrollEnabled={true}
          />
      );
    } else {
      return (
        <WebViewAndroid
          style={{ height: 200 }}
          automaticallyAdjustContentInsets={false}
          source={{ uri: 'http://api.relid.uniken.com/' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onLoad={() => { console.log('loaded') } }
          scalesPageToFit={false}
          scrollEnabled={true}
          javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
          />
      );
    }
  }

  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <View style={[Skin.layout1.wrap, { flex: 1 }]}>
        <MainActivation>
          <View style={Skin.layout1.wrap}>
            <StatusBar
              style={Skin.layout1.statusbar}
              backgroundColor={Skin.main.STATUS_BAR_BG}
              barStyle={'default'} />
            <View style={Skin.layout1.title.wrap}>
              <Title onClose={() => {
                this.close();
              } }>
                Registration
              </Title>
            </View>
            <ScrollView style={Skin.layout1.content.scrollwrap} keyboardShouldPersistTaps={true}>
              <View style={Skin.layout1.content.wrap}>
                <View style={Skin.layout1.content.container}>
                  <View>
                    <Input
                      placeholder={'First Name'}
                      ref={'firstname'}
                      keyboardType={'default'}
                      returnKeyType={'next'}
                      enablesReturnKeyAutomatically={true}
                      autoFocus={true}
                      autoCorrect={false}
                      autoComplete={false}
                      autoCapitalize={true}
                      onChange={this.onFirstNameChange.bind(this) }
                      onSubmitEditing={() => {
                        this.refs.lastname.focus();
                      } } />
                    <Input
                      placeholder={'Last Name'}
                      ref={'lastname'}
                      keyboardType={'default'}
                      returnKeyType={'next'}
                      enablesReturnKeyAutomatically={true}
                      autoFocus={false}
                      autoCorrect={false}
                      autoComplete={false}
                      autoCapitalize={true}
                      onChange={this.onLastNameChange.bind(this) }
                      onSubmitEditing={() => {
                        this.refs.email.focus();
                      } } />
                    <Input
                      placeholder={'Email'}
                      ref={'email'}
                      keyboardType={'email-address'}
                      returnKeyType={'next'}
                      enablesReturnKeyAutomatically={true}
                      autoFocus={false}
                      autoCorrect={false}
                      autoCapitalize={false}
                      autoComplete={false}
                      onChange={this.onEmailChange.bind(this) }
                      onSubmitEditing={() => {
                        this.refs.confirmEmail.focus();
                      } } />
                    <Input
                      placeholder={'Confirm Email'}
                      ref={'confirmEmail'}
                      keyboardType={'email-address'}
                      returnKeyType={'next'}
                      enablesReturnKeyAutomatically={true}
                      autoFocus={false}
                      autoCorrect={false}
                      autoCapitalize={false}
                      autoComplete={false}
                      onChange={this.onConfirmEmailChange.bind(this) }
                      onSubmitEditing={() => {
                        this.refs.phoneNumber.focus();
                      } } />
                    <Input
                      placeholder={'Phone Number'}
                      ref={'phoneNumber'}
                      keyboardType={'phone-pad'}
                      enablesReturnKeyAutomatically={true}
                      autoFocus={false}
                      autoCorrect={false}
                      autoCapitalize={false}
                      autoComplete={false}
                      returnKeyType={"done"}
                      value={this.state.phoneNumber}
                      onChange={this.onPhoneNumberChange.bind(this) } />

                    <Text style={Skin.layout1.content.slider.text}>
                      Slide to prove you{"'"}re human
                    </Text>
                    <Slider
                      ref={'slider'}
                      style={Skin.layout1.content.slider.base}
                      {...this.props}
                      minimumValue={0}
                      maximumValue={100}
                      value={this.state.value}
                      minimumTrackTintColor={Skin.layout1.content.slider.minimumTrackTintColor}
                      maximumTrackTintColor={Skin.layout1.content.slider.maximumTrackTintColor}
                      onSlidingComplete={(value) => this.setState({ value: value }) }/>
                    <Checkbox
                      onSelect={this.selectCheckbox.bind(this) }
                      selected={this.state.check}
                      labelSide={"right"}
                      labelStyle={{
                        color: Skin.colors.BUTTON_BG_COLOR,
                        textDecorationLine: 'underline',
                      }}
                      onLabelPress={() => this.setState({
                        open: true
                      }) }>
                      Terms and Conditions
                    </Checkbox>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={Skin.layout1.bottom.wrap}>
              <View style={Skin.layout1.bottom.container}>
                <Button
                  label={Skin.text['1']['1'].submit_button}
                  onPress={this.validateAndProcced.bind(this) } />
              </View>
            </View>
            <KeyboardSpacer topSpacing={-55} />
          </View>
        </MainActivation>
        <Modal
          style={Skin.layout1.termandcondition}
          offset={0}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => this.setState({
            open: false
          }) }>

          <View style={{ backgroundColor: Skin.colors.BACK_GRAY, flex: 1 }}>
            {this.getWebView() }
          </View>
        </Modal>
      </View>
    );
  }
}

module.exports = Register;

