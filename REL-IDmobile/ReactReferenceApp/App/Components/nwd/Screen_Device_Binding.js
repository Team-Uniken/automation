'use strict';

/*
  NEEDED
*/
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';

/*
  CALLED
*/
import MainActivation from '../MainActivation';
import Events from 'react-native-simple-events';

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let check = true;
let responseJson;
const {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  AsyncStorage,
  StatusBar,
} = ReactNative;

const {
  Component
} = React;

export default class DeviceBinding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opa: new Animated.Value(0),
      type: 'Permanent',
      icon: Skin.icon.permanent,
    };
    /*
    this._props = {
      url: {
        chlngJson: {
          chlng_idx: 3,
          sub_challenge_index: 0,
          chlng_name: 'devbind',
          chlng_type: 1,
          challengeOperation: 1,
          chlng_prompt: [[]],
          chlng_info: [{
            key: 'Response label',
            value: 'Dev Bind',
          }, {
            key: 'description',
            value: 'Select to make device permanent.',
          }],
          chlng_resp: [{
            challenge: 'devbind',
            response: '',
          }],
          challenge_response_policy: [],
          chlng_response_validation: false,
          attempts_left: 3,
        },
        chlngsCount: 4,
        currentIndex: 3,
      },
    };
    */
  }

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

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }
 close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }
  render() {
    console.log(JSON.stringify(this.props.url));
    return (
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
            <Text style={[Skin.activationStyle.info,{color:Skin.BLACK_TEXT_COLOR}]}>
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

    );
  }
}
/*

        <Animated.View style={[Skin.customeStyle.wrap, { opacity: 1 }]}>
          <TouchableHighlight
            underlayColor={'transparent'}
          >
            <Image source={require('image!uncheck')} style={Skin.customeStyle.images} />
          </TouchableHighlight>
        </Animated.View>
        <Animated.View style={[Skin.customeStyle.wrap,{opacity: this.state.opa}]}>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={this.check.bind(this)}
          >
            <Image source={require('image!check')} style={Skin.customeStyle.images} />
          </TouchableHighlight>
        </Animated.View>
        <Text style={Skin.customeStyle.text2}>{this.state.type}</Text>
        <TouchableHighlight
          style={[Skin.customeStyle.roundcornerbutton]}
          onPress={this.setDeviceBinding.bind(this)}
          underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
          activeOpacity={0.6}
        >
          <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
        </TouchableHighlight>
 */
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
