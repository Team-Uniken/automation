
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
import Title from '../view/title';
import Button from '../view/button';
import hash from 'hash.js';
import Input from '../view/input';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
const {StatusBar, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TextInput, Slider, ScrollView, InteractionManager, Alert, AsyncStorage, Linking, } = ReactNative;
const {Component} = React;

class setPassword extends Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={Skin.layout1.wrap}>
        <StatusBar
                  backgroundColor={Skin.main.STATUS_BAR_BG}
                  barStyle={'default'}
                />
        <View style={Skin.layout1.title.wrap}>
          <Title>Registration</Title>
        </View>
        <ScrollView style={Skin.layout1.content.scrollwrap}>
          <View style={Skin.layout1.content.wrap}>
            <View style={Skin.layout1.content.container}>
              <View style={Skin.layout1.content.top.container}>
                <Text style={[Skin.layout1.content.top.text,{}]}>Your Username is</Text>
                <Text style={[Skin.layout1.content.top.text,{fontSize:18,color:Skin.colors.BUTTON_BG_COLOR}]}>abs********lmn@gmail.com</Text>
                <Text style={[Skin.layout1.content.top.text,{marginBottom:26}]}>Set Your Password</Text>
              </View>
              <View style={Skin.layout1.content.bottom.container}>
                <Input
                placeholder={'Enter Password'}
                ref={'password'}
                keyboardType={'default'}
                autoFocus={true}
                autoCorrect={false}
                autoComplete={false}
                autoCapitalize={false}
                returnKeyType={'next'}
                secureTextEntry={true}
                //onChange={this.onPasswordChange.bind(this)}
                //onSubmitEditing={() => {
                  //this.refs.confirmPassword.focus();
                //}}
                />
                <Input
                placeholder={'Confirm Password'}
                ref={'confirmPassword'}
                keyboardType={'default'}
                autoFocus={false}
                autoComplete={false}
                autoCorrect={false}
                autoCapitalize={false}
                returnKeyType={'done'}
                secureTextEntry={true}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={Skin.layout1.bottom.wrap}>
          <View style={Skin.layout1.bottom.container}>
            <Button style={Skin.layout1.bottom.button}
              label={Skin.text['1']['1'].submit_button}/>
          </View>
        </View>
        <KeyboardSpacer topSpacing={-40}/>
      </View>
    );
  }
}

module.exports = setPassword;
