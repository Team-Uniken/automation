
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import hash from 'hash.js';
import Input from '../view/input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer';
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const {Keyboard, StatusBar, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TextInput, Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;
const {Component} = React;






class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      check: '',
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phoneNumber: '',
      value: this.props.value,
      randomMinValue: 1,
      randomMaxValue: 90,
      keyboardVisible: false,
    };

  }

  componentWillMount() {
    this.state.value = 0;
    this.state.randomMinValue = this.getRandomInt(5, 90);
    this.state.randomMaxValue = this.state.randomMinValue + 10;
    InteractionManager.runAfterInteractions(() => {
      this.refs.lastname.focus()
    });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

  }
  
  
  keyboardWillShow (e) {
    this.setState({
      keyboardVisible: true
    })
    //Alert.alert('yes')
  }
  
  keyboardWillHide (e) {
    this.setState({
      keyboardVisible: false
    })
  }  

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }


  selectCheckbox() {
    if (this.state.check.length == 0) {
      this.setState({ check: '\u2714' });
    } else {
      this.setState({ check: '' });
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
    this.setState({ phoneNumber: event.nativeEvent.text });
  }

  validateAndProcced() {



    if (this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.lastName.length > 0
        && this.state.confirmEmail.length > 0 && this.state.phoneNumber.length > 0) {

    } else {
      this.showMessage("Error", "All feilds are mandatory", false);
      return;
    }

    if (this.state.value > this.state.randomMinValue && this.state.value < this.state.randomMaxValue) {

    } else {
      this.showMessage("Error", "You are not human", false);
      return;
    }

    if (this.state.check.length > 0) {
      this.registerUser();
    } else {
      this.showMessage("Error", "Accept Term and Condition", false);
    }

  }


  registerUser() {

    AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
      currentProfile = JSON.parse(currentProfile);
      //var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";

      var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/addNewUser.htm";

      // USER_ID_STR, mandatory = true          // will be email Id
      // GROUP_NAME_STR, mandatory = true       // Hardcode
      // SECONDARY_GROUP_NAMES_STR, mandatory = false
      // EMAIL_ID_STR, mandatory = false          // sholud be there
      // MOB_NUM_ID_STR, mandatory = false        // sholud be there
      // IS_RELIDZERO_ENABLED, mandatory = true     // hardcode
      var userMap = {
        "userId": this.state.firstName + this.state.lastName,
        "groupName": "clientteam",
        "emailId": this.state.email,
        "mobNum": this.state.phoneNumber,
        "isRELIDZeroEnabled": "true",
        "username": "gmuser",
        "password": hash.sha256().update("uniken123$").digest('hex'),

      };
      RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
        console.log(response);
        if (response[0].error == 0) {
          var res = JSON.parse(response[0].response);
          if (res.isError === 'false') {
            showMessage("Activation Code Sent to", "\nPlease check the email for more instruction.", true);

          } else {
            alert(res.errorMessage);
          }
        } else {
          alert('Error');
        }

      })

    }).done();


  }

  showMessage(title, msg, press) {
    Alert.alert(
      title,
      msg, [
        {
          text: 'OK',
          //onPress: () => this.props.navigator.push({
          //  id: "ConnectionProfile"
          //})
          if(press) {
            this.props.navigator.pop();
          }
        },
      ]
    )
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render() {
    return (
      <View style={Skin.layout1.wrap}>
        <StatusBar
          style={Skin.layout1.statusbar}
                  backgroundColor={Skin.main.STATUS_BAR_BG}
                  barStyle={'default'}
                />
        <View style={Skin.layout1.title.wrap}>
          <Title>Registration</Title>
        </View>
        <ScrollView style={Skin.layout1.content.scrollwrap}>
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>
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
                  onChange={this.onFirstNameChange.bind(this)}
                  onSubmitEditing={() => {
                    this.refs.lastname.focus();
                  }}
                  />
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
                  onSubmitEditing={() => {
                    this.refs.email.focus();
                  }}
                  />
                <Input
                  placeholder={'Email'}
                  ref={'email'}
                  keyboardType={'email-address'}
                  returnKeyType={'next'}
                  enablesReturnKeyAutomatically={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoCapitalize={false}
                  onChange={this.onEmailChange.bind(this)}
                  onSubmitEditing={() => {
                    this.refs.confirmEmail.focus();
                  }}/>
                <Input
                  placeholder={'Confirm Email'}
                  ref={'confirmEmail'}
                  keyboardType={'email-address'}
                  enablesReturnKeyAutomatically={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoCapitalize={false}
                  onChange={this.onConfirmEmailChange.bind(this)}
                  onSubmitEditing={() => {
                    this.refs.phoneNumber.focus();
                  }}/>
                <Input
                  placeholder={'Phone Number'}
                  ref={'phoneNumber'}
                  keyboardType={'default'}
                  enablesReturnKeyAutomatically={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoCapitalize={false}
                  onChange={this.onPhoneNumberChange.bind(this)}/>
                <Text style={Skin.layout1.content.slider.text}>
                  Slide to prove your human
                </Text>
                <Slider
                  style={Skin.layout1.content.slider.base}
                  {...this.props}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={Skin.layout1.content.slider.minimumTrackTintColor}
                  maximumTrackTintColor={Skin.layout1.content.slider.maximumTrackTintColor}
                  onValueChange={(value) => this.setState({ value: value })} />
              <View style={{flexDirection:'row'}}>
                <CheckboxField
                  defaultColor={Skin.baseline.checkbox.defaultColor}
                  selectedColor={Skin.baseline.checkbox.selectedColor}
                  onSelect={this.selectCheckbox}
                  checkboxStyle={Skin.baseline.checkbox.base}
                  onSelect={this.selectCheckbox.bind(this)}>
                  <Text style={Skin.baseline.checkbox.checkColor}>
                    {this.state.check}
                  </Text>
                </CheckboxField>
                <Text onPress={() => Linking.openURL("https://www.google.com")}>
                  Terms and Conditions Link
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View 
          style={Skin.layout1.bottom.wrap}>
          <View style={Skin.layout1.bottom.container}>
            <Button
              label={Skin.text['1']['1'].submit_button}/>
          </View>
        </View>
        <KeyboardSpacer topSpacing={-55}/>

       
        
        {/*<TextInput
          //autoCorrect={false}
          //autoCapitalize={'none'}
          //keyboardType={this.props.keyboardType}
          //placeholder={this.props.placeholder}
          placeholderTextColor={Skin.baseline.textinput.placeholderTextColor} 
          //returnKeyType={this.props.returnKeyType}
          //secureTextEntry={this.props.secureTextEntry}
          //onChange={this.props.onChange}
          //onFocus={()=>{this.setFocus(true)}}
          //onBlur={this.setFocus(false).bind(this)}
          />
        <ScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={[Skin.layout1.wrap.scrollcontainer, {
                         backgroundColor: '#aecf00',
                         padding: 5,
                         height:50,
                         width: 300,
                       }]}>
            <Input
              placeholder={'First Name'}
              ref={'firstName'}
              keyboardType={'default'}
              onChange={this.onFirstNameChange.bind(this)} />
          {/*
            <Input
              style={Skin.baseline.textinput.base}
              placeholder={'Last Name'}
              ref={'lastName'}
              keyboardType={'default'}
              onChange={this.onLastNameChange.bind(this)}
              onSubmitEditing={() => {
                                 this.refs.email.focus();
                               }} />
            <Input
              style={Skin.baseline.textinput.base}
              placeholder={'Email'}
              ref={'email'}
              keyboardType={'email-address'}
              onChange={this.onEmailChange.bind(this)}
              onSubmitEditing={() => {
                                 this.refs.confirmEmail.focus();
                               }} />
            <Input
              style={Skin.baseline.textinput.base}
              placeholder={'Confirm Email'}
              ref={'confirmEmail'}
              keyboardType={'email-address'}
              onChange={this.onConfirmEmailChange.bind(this)}
              onSubmitEditing={() => {
                                 this.refs.phoneNumber.focus();
                               }} />
            <Input
              style={Skin.baseline.textinput.base}
              placeholder={'Phone Number'}
              ref={'phoneNumber'}
              keyboardType={'numeric'}
              onChange={this.onPhoneNumberChange.bind(this)}
              marginBottom={16} />
          </View>
          <Text style={styles.slidetext}>
            Slide to prove your human
          </Text>
          <Text style={styles.slidetext}>
            Select range from
            {this.state.randomMinValue} to
            {this.state.randomMaxValue}
          </Text>
          <Slider
            style={styles.slider}
            {...this.props}
            minimumValue={0}
            maximumValue={100}
            onValueChange={(value) => this.setState({ value: value })} />
          <Text>
            Value:
            {Math.floor(this.state.value)}
          </Text>
          <View>
            <CheckboxField
              defaultColor='tranprant'
              selectedColor="#247fd2"
              onSelect={this.selectCheckbox}
              checkboxStyle={styles.checkboxStyle}
              onSelect={this.selectCheckbox.bind(this)}
              labelSide="right">
              <Text style={{ color: '#f00' }}>
                {this.state.check}
              </Text>
            </CheckboxField>
            <Text onPress={() => Linking.openURL("https://www.google.com")}>
              Terms and Conditions Link
            </Text>
          </View>
          <Button
            lable="Submit"
            onPress={this.validateAndProcced.bind(this)} />
        </ScrollView>*/}
      </View> 
      );
  }
}

module.exports = Register;
