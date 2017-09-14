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
import {View, Text, BackHandler, StatusBar} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components'
import { NavigationActions} from 'react-navigation';

/*
 Use in this js
 */
import Skin from '../Skin';
import MainActivation from '../Components/Container/MainActivation';



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
    BackHandler.addEventListener('hardwareBackPress', function doNothing() { return true;})
  //  Events.on('closeStateMachine', 'closeStateMachine', this.closeStateMachine);
  }

//call on click of already a member to show next challenge(checkUser).
  selectReg() {
    console.log('doNavigation:');
//    this.props.navigation.navigate('StateMachine',{url: {
//      "chlngJson": this.props.navigation.state.params.url.chlngJson,
//      "screenId": this.props.navigation.state.params.url.screenId,
//      "currentIndex":0
//      }})
    
    const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'StateMachine',params:{url: {
        "chlngJson":this.props.navigation.state.params.url.chlngJson,
      "screenId": this.props.navigation.state.params.url.screenId,
      "currentIndex":0
        },title:''}})
      ]
      })
    this.props.navigation.dispatch(resetAction)
  }
  
//call on click of register to show SelfRegister screen.
  register() {
    console.log('doNavigation:');
    this.props.navigation.navigate('SelfRegisterScreen',{url: {
      "chlngJson": this.props.navigation.state.params.url.chlngJson,
      "screenId": "SelfRegister"
      }})
  }
/*
  This method is used to render the componenet with all its element.
*/
  render() {
    return (
      <MainActivation>
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
          onPress={() =>
//            this.props.navigator.push({ id: 'ConnectionProfile',sceneConfig: Navigator.SceneConfigs.PushFromRight })
              this.props.navigation.navigate('ConnectionProfileScreen')
          }/>
        </View>
       
      </View>
      </MainActivation>
      );
  }
}

module.exports = Welcome_Screen;

