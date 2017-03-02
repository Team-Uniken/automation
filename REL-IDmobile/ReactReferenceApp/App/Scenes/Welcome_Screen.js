/*
 *A welcome screen which give you two option self Register or already member.
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
import Events from 'react-native-simple-events';
import Config from 'react-native-config';
import {View, Text, Navigator, BackAndroid, StatusBar} from 'react-native';


/*
 Use in this js
 */
import Skin from '../Skin';



/*
 Custome View
 */
import Button from '../Components/view/button';
import Setting from '../Components/view/setting';


/*
  INSTANCES
 */
let obj;


class Welcome_Screen extends Component {
 /*
  This is life cycle method of the react native component.
  This method is called when the component will start to load
  */
  componentWillMount() {
    obj=this;
  //  Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);
  }

//call on click of already a member to show next challenge(checkUser).
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
//call on click of register to show SelfRegister screen.
  register() {
    console.log('doNavigation:');
    this.props.navigator.push({
                              id: "Machine",
                              //id: "Select_Login",
                              title: "SelfRegister",
                              url: {
                              "chlngJson": this.props.url.chlngJson,
                              "screenId": "SelfRegister"
                              }
                              });
  }
/*
  This method is used to render the componenet with all its element.
*/
  render() {
    return (
      <View style={Skin.layout0.wrap.container}>
      <StatusBar
      style={Skin.layout1.statusbar}
      backgroundColor={Skin.main.STATUS_BAR_BG}
      barStyle={'default'} />
        <View style={Skin.layout0.top.container}>
       
          <Text style={[Skin.layout0.top.icon]}>
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

module.exports = Welcome_Screen;

