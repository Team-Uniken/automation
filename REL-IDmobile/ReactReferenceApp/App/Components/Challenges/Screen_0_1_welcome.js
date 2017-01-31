
import React, { Component } from 'react';
import ReactNative, { View, Text,Navigator, BackAndroid,StatusBar} from 'react-native'

import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import Button from '../view/button';
import Config from 'react-native-config';

import Setting from '../view/setting';






class First extends Component {

  //   closeStateMachine() {
  //   console.log('---------- closeStateMachine ' );
  //    // obj.props.navigator.pop();
  //     var allScreens =obj.props.navigator.getCurrentRoutes(-1);
      
  //     for(var i = 0; i < allScreens.length; i++){
  //       var screen = allScreens[i];
  //       if(screen.id === 'Screen_0_1_welcome'){
  //         var mySelectedRoute = obj.props.navigator.getCurrentRoutes()[i];
  //         obj.props.navigator.popToRoute(mySelectedRoute);
  //         return;
  //       }
  //     }
   
  // }

  componentWillMount() {
    obj=this;
  //  Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);
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
//    this.props.navigator.push({ id: "Screen_1_1_register" });
    
//    this.props.navigator.push({
//                              id: "Screen_1_1_register",
//                              title: "nextChlngName",
//                              url: {
//                              "chlngJson": this.props.url.chlngJson,
//                              "screenId": this.props.url.screenId
//                              }
//                              });
    
    this.props.navigator.push({
                              id: "Machine",
                              //id: "Screen_0_2_selectlogin",
                              title: "SelfRegister",
                              url: {
                              "chlngJson": this.props.url.chlngJson,
                              "screenId": "SelfRegister"
                              }
                              });
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
                <Setting
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: 20,
          }}
          onPress={() => this.props.navigator.push({ id: 'ConnectionProfile',sceneConfig: Navigator.SceneConfigs.PushFromRight }) }/>
        </View>
       
      </View>
      );
  }
}

module.exports = First;

