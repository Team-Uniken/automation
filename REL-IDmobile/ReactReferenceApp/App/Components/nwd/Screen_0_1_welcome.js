
import React, { Component } from 'react';
import ReactNative, { View, Text, } from 'react-native'

import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from '../view/button';


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const MAX_WIDTH = 300;
const MAX_HEIGHT = 600;
const VIEW_WIDTH = SCREEN_WIDTH - 50;
const SCREEN_HEIGHT_RATIO = 1;
if (SCREEN_HEIGHT <= 426) {
  SCREEN_HEIGHT_RATIO = 0.5
} else if (SCREEN_HEIGHT <= 470) {
  SCREEN_HEIGHT_RATIO = 1
} else if (SCREEN_HEIGHT < 640) {
  SCREEN_HEIGHT_RATIO = 1.5
} else {
  SCREEN_HEIGHT_RATIO = 2
}


class First extends Component {
  selectReg() {
    console.log('doNavigation:');
    this.props.navigator.push({
      id: "Machine",
      title: "nextChlngName",
      url: {
        "chlngJson": this.props.url.chlngJson,
        "screenId": this.props.url.screenId
      }
    });
  /*
  this.props.navigator.push({
    id: "Machine",
    title: "nextChlngName",
    url: {
      "chlngJson": this.props.url.chlngJson,
      "screenId": this.props.url.screenId
    }
  });
  */
  }

  register() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "Screen_1_1_register" });
  }

  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
        <View style={Skin.layout0.top.container}>
          <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
            {Skin.icon.logo}
          </Text>
          <Text style={Skin.layout0.top.subtitle}>
            {Skin.text['0']['1'].subtitle}
          </Text>
          <Text style={Skin.layout0.top.prompt}>
            {Skin.text['0']['1'].prompt}
          </Text>
        </View>
        <View style={Skin.layout0.bottom.container}>
          <Button
            label={Skin.text['0']['1'].need_to_register_button}
            onPress={this.register.bind(this)} />
          <Button
            label={Skin.text['0']['1'].already_member}
            onPress={this.selectReg.bind(this)} />
        </View>
      </View>
      );
  }
}

module.exports = First;