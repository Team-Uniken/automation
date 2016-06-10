
import React from 'react-native';
import Skin from '../../Skin';

var Events = require('react-native-simple-events');
var SCREEN_WIDTH = require('Dimensions').get('window').width;

var {
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  StatusBar,
  ScrollView,
} = React;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



export default class Activation extends React.Component {
  btnText() {
    if (this._props.url.chlngJson.chlng_idx === this._props.url.chlngsCount) {
      return 'Submit';
    } else {
      return 'Continue';
    } }
  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
    };
  }

  checkActivationCode() {
    var vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      responseJson = this._props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    }
    else {
      alert('Please enter Verification Key');
    }
  }
  onActivationCodeChange(event) {
    this.setState({ activatonCode: event.nativeEvent.text });
  }

  render() {
    this._props = {
      url: {
        chlngJson: {
          chlng_idx: 1,
          sub_challenge_index: 0,
          chlng_name: 'actcode',
          chlng_type: 2,
          challengeOperation: 0,
          chlng_prompt: [
            ['2sm88b4'],
          ],
          chlng_info: [
            {
              key: 'Prompt label',
              value: 'Verification Key',
            }, {
              key: 'Response label',
              value: 'Activation Code',
            }, {
              key: 'Description',
              value: 'Match verification key and enter activation code',
            }, {
              key: 'Reading',
              value: 'Activation verification challenge',
            },
          ],
          chlng_resp: [
            {
              challenge: '2sm88b4',
            },
          ],
          challenge_response_policy: [],
          chlng_response_validation: false,
          attempts_left: 3,
        },
        chlngsCount: 1,
        currentIndex: 1,
      },
    };

    return (
      <View style={Skin.coreStyle.container}>
        <View style={Skin.loadStyle.bgbase} />
        <Image style={Skin.loadStyle.bgimage} source={require('image!bg')} />
        <View style={Skin.statusBarStyle.default}>
          <StatusBar
            barStyle="light-content"
          />
        </View>
        <View style={Skin.loadStyle.bgcolorizer} />
        <View style={Skin.logStyle.wrap}>
          <View style={Skin.logStyle.top_wrap}>
            <ScrollView >
              <Text style={Skin.activationStyle.text1}>{this._props.url.currentIndex}/{this._props.url.chlngsCount}</Text>
              <Text style={Skin.activationStyle.text2}>{this._props.url.chlngJson.chlng_info[0].value}</Text>
              <Text style={[Skin.activationStyle.note, { width: 200, marginLeft: Skin.SCREEN_WIDTH / 2 - 100 }]}>{this._props.url.chlngJson.chlng_info[2].value}</Text>
            </ScrollView>
          </View>
          <View style={Skin.logStyle.mid_wrap}>
            <View style={Skin.logStyle.input_wrap}>
              <View style={Skin.logStyle.textinput_wrap}>
                <Text style={Skin.logStyle.textinput}>
                  Verify:
                </Text>
                <Text style={Skin.logStyle.textinput}>
                  {this._props.url.chlngJson.chlng_resp[0].challenge}
                </Text>
              </View>
            </View>
            <View style={Skin.logStyle.input_wrap}>
              <View style={Skin.logStyle.textinput_wrap}>
                <Text
                  style={Skin.logStyle.textinput}
                >
                  Activate:
                </Text>
                <TextInput
                  ref="inputUsername"
                  returnKeyType={'next'}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  placeholder={'Username'}
                  placeholderTextColor={'rgba(255,255,255,0.7)'}
                  style={Skin.logStyle.textinput}
                  value={this.state.inputUsername}
                />
              </View>
            </View>
            <View style={Skin.logStyle.input_wrap}>
              <TouchableHighlight
                style={Skin.logStyle.button}
                underlayColor={'#082340'}
                onPress={this.checkActivationCode.bind(this)}
                activeOpacity={0.6}
              >
                <Text style={Skin.activationStyle.button}>
                  {this.btnText()}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={Skin.logStyle.bot_wrap}>
          </View>
        </View>
      </View>
    );
  }
}

/*

<View style={[Skin.activationStyle.roundcornerinput]} activeOpacity={0.6}>
                <KeyboardAwareScrollView>
                  <TextInput
                    autoCorrect={false}
                    ref="activatonCode"
                    placeholder={'Enter Activation Code'}
                    placeholderTextColor={Skin.colors.HINT_COLOR}
                    style={Skin.activationStyle.input}
                    secureTextEntry
                    onChange={this.onActivationCodeChange.bind(this)}
                  />
                </KeyboardAwareScrollView>
              </View>




      <View style={Skin.activationStyle.maincontainer}>
           <StatusBar
            backgroundColor={Skin.colors.STATUS_BAR_COLOR}
           barStyle='light-content'
           />
           <ToolBar navigator={this._props.navigator} title="Activation"/>
           <ScrollView >
              <Text style={Skin.activationStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
              <Text style={Skin.activationStyle.text2}>Verify and Activate</Text>
              <Text style={Skin.activationStyle.div}> </Text>
              <Text style={Skin.activationStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
              <Text style={Skin.activationStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
              <Text style={[Skin.activationStyle.note,{width:200,marginLeft:Skin.SCREEN_WIDTH/2-100}]}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
              <Text style={Skin.activationStyle.div}> </Text>
              <Text style={Skin.activationStyle.text2}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
              <View style={[Skin.activationStyle.roundcornerinput]} activeOpacity={0.6}>
              <KeyboardAwareScrollView>
              <TextInput
                autoCorrect={false}
                ref='activatonCode'
                placeholder={'Enter Activation Code'}
                placeholderTextColor={Skin.colors.HINT_COLOR}
                style={Skin.activationStyle.input}
                secureTextEntry={true}
                onChange={this.onActivationCodeChange.bind(this)}
              />
              </KeyboardAwareScrollView>

            </View>
            <Text style={Skin.activationStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
            <TouchableHighlight
              style={[Skin.activationStyle.roundcornerbutton]}
              onPress={this.checkActivationCode.bind(this)}
              underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
              activeOpacity={0.6}>
                <Text style={Skin.activationStyle.button}>{this.btnText()}</Text>
              </TouchableHighlight>
            </ScrollView >
      </View>

 */


Skin.activationStyle = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: '#000000',
    marginTop: 12,
    fontWeight: 'bold',
    width: SCREEN_WIDTH - 96,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title1: {
    fontSize: 22,
    color: '#000000',
    marginTop: 12,
    fontWeight: 'bold',
    width: SCREEN_WIDTH,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  remember: {
    color: '#000000',
    fontSize: 16,
    opacity: 0.7,
    margin: 16,
    width: SCREEN_WIDTH - 80,
  },
  images: {
    width: 24,
    height: 24,
    margin: 12,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
  },
  wrap: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
    width: 50,
    height: 50,
  },

  input: {
    textAlign: 'center',
    fontFamily: 'Century Gothic',
    fontSize: 16,
    height: 56,
    color: '#000',
    textAlignVertical: 'top',
    alignItems: 'center',
    opacity: 0.7,
  },
  roundcorner: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  roundcornerbutton: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 30,
    backgroundColor: '#000000',
  },
  roundcornerinput: {
    height: 48,
    width: 280,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: SCREEN_WIDTH / 2 - 140,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  note: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.4,
    width: SCREEN_WIDTH,
  },
  errortext: {
    textAlign: 'center',
    marginTop: 16,
    color: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    opacity: 0.7,
    width: SCREEN_WIDTH,
    height: 16,
  },
  text1: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    opacity: 0.7,
    width: SCREEN_WIDTH,
  },
  text2: {
    marginTop: 16,
    color: '#000000',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    opacity: 0.75,
    width: SCREEN_WIDTH,
  },
  text3: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    opacity: 0.9,
    width: SCREEN_WIDTH,
  },
  text4: {
    textAlign: 'center',
    marginTop: 16,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 34,
    width: SCREEN_WIDTH,
  },
  button: {
    textAlign: 'center',
    marginTop: 12,
    height: 48,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  div: {
    marginTop: 16,
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    height: 1,
    opacity: 0.6,
  },
  div1: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    height: 1,
    opacity: 0.6,
  },
});

