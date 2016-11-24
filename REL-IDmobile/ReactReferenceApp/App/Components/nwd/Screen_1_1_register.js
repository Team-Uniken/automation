
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Modal from 'react-native-simple-modal';
import WebViewAndroid from '../../android_native_modules/nativewebview';


import Title from '../view/title';
import Button from '../view/button';
import Checkbox from '../view/checkbox';
import hash from 'hash.js';
import Input from '../view/input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MainActivation from '../MainActivation';
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const {Keyboard, StatusBar, StyleSheet, Text, View, BackAndroid, TouchableHighlight, Platform, TouchableOpacity, WebView, TextInput, Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;
const {Component} = React;


var obj;



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
      randomMinValue: 1,
      randomMaxValue: 90,
      keyboardVisible: false,
    };

    this.close = this.close.bind(this);
  }



  //  componentDidMount() {
  //    BackAndroid.addEventListener('hardwareBackPress', function() {
  //          this.close();
  //           return true;
  //       }.bind(this));
  // }

  componentWillMount() {
    obj = this;
    this.state.value = 0;
    this.state.randomMinValue = this.getRandomInt(5, 90);
    this.state.randomMaxValue = this.state.randomMinValue + 10;
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


  selectCheckbox() {
    if (!this.state.check) {
      this.setState({ check: true });
    } else {
      this.setState({ check: false });
    }
  }


  onFirstNameChange(event) {
    this.setState({ firstName: event.nativeEvent.text });
  }

  onLastNameChange(event) {
    this.setState({ lastName: event.nativeEvent.text });
  }

  onEmailChange(event) {
    this.setState({ email: event.nativeEvent.text });
  }

  onConfirmEmailChange(event) {
    this.setState({ confirmEmail: event.nativeEvent.text });
  }

  onPhoneNumberChange(event) {

    if (obj.validatePhoneNumber(event.nativeEvent.text) && event.nativeEvent.text.length <= 10)
      this.setState({ phoneNumber: event.nativeEvent.text });
    else {
      if (event.nativeEvent.text.length == 0)
        this.setState({ phoneNumber: event.nativeEvent.text });
      this.setState.phoneNumber = this.setState.phoneNumber;
    }
  }


  close() {
    if (this.state.open) {
      this.setState({
        open: false
      });
    } else {
      this.props.navigator.pop();
    }

  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  validatePhoneNumber(phone) {
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    var reg = /^\d+$/;
    // return regex.test(phone)
    return reg.test(phone)
  }


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
      this.registerUser();
    } else {
      this.showMessage("Error", "Accept Terms and Conditions", false);
    }
  }


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
        "username": "gmuser",
        "password": hash.sha256().update("uniken123$").digest('hex'),
      };

      console.log("---Register ---Usermap =" + JSON.stringify(userMap));
      Events.trigger('showLoader', true);
      RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
        console.log(response);
        Events.trigger('hideLoader', true);
        if (response[0].error == 0) {
          var res;
          try {
            res = JSON.parse(response[0].response);
          } catch (e) {
            obj.showMessage("Error", "Invalid response.Please try again", false);
            this.setState({ resetSlider: true, value: 0 }, () => {
              this.state.resetSlider = false;
            });
            return;
          }
          if (res.isError == false) {
            obj.showMessage("Activation Code Sent to", this.state.confirmEmail + "\nPlease check the email for more instruction.", true);
          } else {
            alert(res.errorMessage);
            this.setState({ resetSlider: true, value: 0 }, () => {
              this.state.resetSlider = false;
            });
          }
        } else {
          alert('Please try again');
          this.setState({ resetSlider: true, value: 0 }, () => {
            this.state.resetSlider = false;
          });
        }

      })

    }).done();


  }

  showMessage(title, msg, press) {
    Alert.alert(
      title,
      msg,
      [{
        text: 'OK',
        onPress: () => {
          if (press) {
            obj.props.navigator.pop();
          }

        }
      }]
    )
  }

  getWebView() {
    if (Platform.OS === 'ios') {
      return (
        <WebView
          automaticallyAdjustContentInsets={false}
          source={{ uri: 'http://api.relid.uniken.com/' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange.bind(this) }
          onLoad={() => { console.log('loaded') } }
          scalesPageToFit={true}
             scrollEnabled={true}
          />
      );
    } else {
      return (
        <WebViewAndroid
        style={{height: 200}}
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

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render() {
    return (
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
          <ScrollView style={Skin.layout1.content.scrollwrap}>
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
                    keyboardType={'numbers-and-punctuation'}
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
                    value={this.state.resetSlider ? 0 : null}
                    minimumTrackTintColor={Skin.layout1.content.slider.minimumTrackTintColor}
                    maximumTrackTintColor={Skin.layout1.content.slider.maximumTrackTintColor}
                    onValueChange={(value) => this.setState({ value: value }) } />
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
      </MainActivation>
    );
  }
}

module.exports = Register;

