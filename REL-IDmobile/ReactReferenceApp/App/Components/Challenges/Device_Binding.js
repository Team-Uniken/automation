/**
 *  Use to make device temporary or permanent default is permanent. 
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
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {View, Text, TouchableHighlight, TouchableOpacity, Image, Animated, StyleSheet, AsyncStorage, StatusBar, BackAndroid, } from 'react-native'

/*
 Use in this js
 */
import Skin from '../../Skin';
import MainActivation from '../Container/MainActivation';

/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';



/*
  INSTANCES
 */
let check = true;
let responseJson;



export default class DeviceBinding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opa: new Animated.Value(0),
      type: 'Permanent',
      icon: Skin.icon.permanent,
    };
  }

  //call on submit button click 
  //submit challenge response and call showNextChallenge.
  setDeviceBinding() {
    let flag;
    if (check) {
      flag = 'true';
    } else {
      flag = 'false';
    }

    responseJson = this.props.url.chlngJson;
    responseJson.chlng_resp[0].response = flag;
    Events.trigger('showNextChallenge', { response: responseJson });
  }
  //call each time when we change device status.
  check() {
    if (check === false) {
      check = true;
      this.setState({ type: 'Permanent' });
      this.setState({ icon: Skin.icon.permanent });
      Animated.sequence([
        Animated.timing(this.state.opa, {
          toValue: 1,
          duration: 100 * 0.8,
          delay: 100 * 0.8,
        }),
      ]).start();
    } else {
      check = false;
      this.setState({ type: 'Temporary' });
      this.setState({ icon: Skin.icon.temporary });
      Animated.sequence([
        Animated.timing(this.state.opa, {
          toValue: 0,
          duration: 100 * 0.8,
          delay: 100 * 0.8,
        }),
      ]).start();
    }
  }
  //return text Submit or Continue based on chlng_idx and chlngsCount if current challenge is last in challenge array it return Submit else return Continue
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }
  //showPreviousChallenge on press of cross icon.
  close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }
/*
  This is life cycle method of the react native component.
  This method is called when the component is Mounted/Loaded.
*/ 
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function () {
      this.close();
      return true;
    }.bind(this));
  }
   /*
    This method is used to render the componenet with all its element.
  */
  render() {
    console.log(JSON.stringify(this.props.url));
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
              Device Binding
            </Title>
          </View>
          <View
            style={{ height: Skin.SCREEN_HEIGHT - 100, justifyContent: 'center', }}>
            <View>
              <Text style={Skin.layout0.top.subtitle}>Remember Device</Text>
              <Text style={[Skin.activationStyle.info, { color: Skin.BLACK_TEXT_COLOR }]}>
                Tap icon to change your setting
              </Text>
              <Animated.View style={styles.animWrap}>
                <TouchableHighlight
                  style={styles.touch}
                  onPress={this.check.bind(this) }
                  underlayColor={'transparent'}
                  >
                  <Text style={styles.icon}>{this.state.icon}</Text>
                </TouchableHighlight>
              </Animated.View>
              <Text style={Skin.layout0.top.subtitle}>{this.state.type}</Text>


              <View style={Skin.layout0.bottom.container}>
                <Button
                  label= {this.btnText() }
                  onPress={this.setDeviceBinding.bind(this) }/>
              </View>
            </View>
          </View>
        </View>
      </MainActivation>
    );
  }
}

module.exports = DeviceBinding;

const styles = StyleSheet.create({
  animWrap: {

  },
  touch: {
    backgroundColor: 'transparent',
  },
  icon: {
    fontFamily: Skin.font.ICON_FONT,
    textAlign: 'center',
    fontSize: 200,
    color: Skin.BUTTON_BG_COLOR,
  },
  type: {
    fontSize: 30,
    color: Skin.DEV_BIND_TYPE_TEXT_COLOR_RGB,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
