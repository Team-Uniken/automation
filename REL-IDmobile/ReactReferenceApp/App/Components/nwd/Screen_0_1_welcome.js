
import React, { Component } from 'react';
import ReactNative, { View, Text,AsyncStorage, BackAndroid,StatusBar} from 'react-native'

import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from '../view/button';


const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const MAX_WIDTH = 300;
const MAX_HEIGHT = 600;
const VIEW_WIDTH = SCREEN_WIDTH - 50;
const SCREEN_HEIGHT_RATIO = 1;
let obj;
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

    closeStateMachine() {
    console.log('---------- closeStateMachine ' );
     // obj.props.navigator.pop();
      var allScreens =obj.props.navigator.getCurrentRoutes(-1);
      
      for(var i = 0; i < allScreens.length; i++){
        var screen = allScreens[i];
        if(screen.id === 'Screen_0_1_welcome'){
          var mySelectedRoute = obj.props.navigator.getCurrentRoutes()[i];
          obj.props.navigator.popToRoute(mySelectedRoute);
          return;
        }
      }
   
  }

  componentWillMount() {
    obj=this;
    Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);
  }

  //  componentDidMount() {
  //    BackAndroid.addEventListener('hardwareBackPress', function() {
  //     // this.props.navigator.pop();
  //    alert('working');
  //           return false;
  //       }.bind(this));
  // }
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

  }

  register() {
    console.log('doNavigation:');
    this.props.navigator.push({ id: "Screen_1_1_register" });
  }

  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
      <StatusBar
      style={Skin.layout1.statusbar}
      backgroundColor={Skin.main.STATUS_BAR_BG}
      barStyle={'default'} />
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
