
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






class Activation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  
  validateAndProcced() {

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
          <Title
            onClose={()=>{this.close();}}
            >Activation</Title>
        </View>
        <ScrollView style={Skin.layout1.content.scrollwrap} contentContainerStyle={{flex:1}}>
          <View style={{backgroundColor: '#000000', flex: 1, marginBottom:12}}>
          
            <View style={Skin.layout1.content.wrap}>
              <View style={Skin.layout1.content.container}>  
                <Text style={[Skin.layout1.content.prompt,{marginTop:10}]}>Step 1: Verify Code ABCDEFG</Text>              
                <Text style={[Skin.layout1.content.prompt,{}]}>Step 2: Scan QR Code</Text>
                <View style={Skin.layout1.content.cameraBox}></View>
                <View style={Skin.layout1.content.enterWrap}>
                  <Input
                    placeholder={'or Enter Numeric Code'}
                    ref={'activationCode'}
                    autoFocus={false}
                    autoCorrect={false}
                    autoComplete={false}
                    autoCapitalize={true}
                    styleInput={Skin.layout1.content.enterInput}
                    returnKeyType = {"next"}
                    placeholderTextColor={Skin.baseline.textinput.placeholderTextColor} 
                    />
                </View>
              </View>
            </View>
          
          </View>
        </ScrollView>
        <View
          style={Skin.layout1.bottom.wrap}>
          <View style={Skin.layout1.bottom.container}>
            <Button
              label={Skin.text['1']['1'].submit_button}
              onPress={this.validateAndProcced.bind(this)}/>
            <Text 
              onPress={()=>{
                Alert.alert(
                  'Alert Title',
                  'My Alert Msg',
                  [
                    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]
                )
              }}
              style={Skin.layout1.bottom.footertext}
              >
              Resend Activation Code
              </Text>
          </View>
        </View>
        <KeyboardSpacer topSpacing={-45}/>
      </View>
    );
  }
}

module.exports = Activation;
