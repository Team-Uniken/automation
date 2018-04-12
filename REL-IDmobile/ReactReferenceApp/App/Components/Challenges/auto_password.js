/**
 *  set password screen comes in activation flow. 
 * allow you to set password and confirm it.
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';
import Util from "../Utils/Util";
import TouchID from 'react-native-touch-id';
import Config from 'react-native-config';
import { NavigationActions } from 'react-navigation';

/*
 Required for this js
 */
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Events from 'react-native-simple-events';
import dismissKeyboard from 'dismissKeyboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {View, Text, TextInput, TouchableHighlight, TouchableOpacity, InteractionManager, AsyncStorage, StatusBar, ScrollView, BackHandler, Alert } from 'react-native'


/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';
import LoginTypeButton from '../view/logintypebutton';


/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';




export default class AutoPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
    };
    this.authenticate = this.authenticate.bind(this);
    //this.authenticateAndroid = this.authenticateAndroid.bind(this);
    this.encrypytPasswdiOS = this.encrypytPasswdiOS.bind(this);
    this.gotoSetPasswordScreen = this.gotoSetPasswordScreen.bind(this);
  }
  /*
This is life cycle method of the react native component.
This method is called when the component will start to load
*/
  componentWillMount() {
    AsyncStorage.getItem('RUserId').then((value) => {
      this.setState({ Username: value });
    }).done();

    this.authenticate();
  }
  /*
    This is life cycle method of the react native component.
    This method is called when the component is Mounted/Loaded.
  */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
   

  }



  authenticate() {
    TouchID.authenticate('Set up TouchID to Log In')
      .then(success => {
        //AlertIOS.alert('Authenticated Successfully');
        this.encrypytPasswdiOS();
      })
      .catch(error => {
        console.log(error)
        //AlertIOS.alert(error.message);
        if(error.name === 'LAErrorUserCancel')
        this.gotoSetPasswordScreen();
        else
        this.authenticate();
      });
  }

  gotoSetPasswordScreen(){

    
    const resetActionshowFirstChallenge = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'StateMachine', params: {
              url: {
                chlngJson:this.props.url.chlngJson,
                screenId: this.props.url.chlngJson.chlng_name,
                currentIndex: this.props.url.currentIndex,
              }, title: this.props.url.chlngJson.chlng_name
            }
          })
        ]
      })
      this.props.navigator.dispatch(resetActionshowFirstChallenge);

  }

  encrypytPasswdiOS() {

    try {
       // Events.trigger('showLoader', true);
      Util.encryptText(Main.dnaUserName).then((data) => {
        let responseJson = this.props.url.chlngJson;
        responseJson.chlng_resp[0].response = data;
        
       
        Util.saveUserDataSecure("RPasswd",data).then((data) => {

          AsyncStorage.getItem(Main.dnaUserName).then((value) => {
            if (value) {
              value = JSON.parse(value);
              AsyncStorage.getItem(Main.dnaUserName).then((value) => {
                if (value) {
                  try {
                    value = JSON.parse(value);
                    AsyncStorage.setItem("isAutoPassword", 'true');
                    Util.saveUserDataSecure("ERPasswd", value.RPasswd).then((result) => {  
                    }).done();
                  } catch (e) {
                    Events.trigger('hideLoader', true);
                    this.gotoSetPasswordScreen();
                   }
                }
              }).done();
              //responseJson = this.props.url.chlngJson;
              Events.trigger('hideLoader', true);
              Events.trigger('showNextChallenge', { response: responseJson });
            }
          }).done();

        }).done();
      }
      );

    } catch (e) {
        Events.trigger('hideLoader', true);
        this.gotoSetPasswordScreen();
      //this.goToNextChallenge(result, index, isFirstChallenge);
    }   
  }
  /*
     This method is used to return the text Submit/Continue for submit button.
   */
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'Continue';
  }
  //showPreviousChallenge on press of cross icon.
  close() {
    this.gotoSetPasswordScreen();
  }



  /*
    This method is used to render the componenet with all its element.
  */
    render() {
        return (
            <MainActivation>
                <View style={Skin.layout0.wrap.container}>
                    <StatusBar
                        backgroundColor={Skin.main.STATUS_BAR_BG}
                        barStyle={'default'}
                    />
                    <View style={Skin.layout1.title.wrap}>
                        <Title onClose={() => {
                            this.close();
                        }}>
                            Set up Login
                        </Title>
                    </View>
                    <View style={[Skin.layout1.content.bottom.container,{justifyContent: 'center',alignItems: 'center'}]}>
                      
                    <View style={[{width: 100,height: 100,justifyContent: 'center',alignItems: 'center',marginBottom:70}]}>
                         <LoginTypeButton
                            label={Skin.icon['touchid']}
                             onPress={() => { this.authenticate(); }}
                            text={'Set up Login'} />
                            </View>
                     </View>
                </View>
            </MainActivation>
        );

    }
}

module.exports = AutoPassword;
