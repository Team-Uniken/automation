
import React from 'react-native';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var MAX_WIDTH = 300;
var MAX_HEIGHT = 600;
Skin.max = {
  width: (SCREEN_WIDTH > MAX_WIDTH) ? MAX_WIDTH : SCREEN_WIDTH,
  height: (SCREEN_HEIGHT > MAX_HEIGHT) ? MAX_HEIGHT : SCREEN_HEIGHT,
}

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




export default class Activation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
    };
  }

  onActivationCodeChange(event) {
    this.setState({ activatonCode: event.nativeEvent.text });
  }
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }
  checkActivationCode() {
    var vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    }
    else {
      alert('Please enter Verification Key');
    }
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
      <MainActivation>
        <View style={{marginTop:38}}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
          <Text style={Skin.activationStyle.info}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
        </View>

        <View style={Skin.activationStyle.input_wrap}>
          <View style={Skin.activationStyle.textinput_wrap}>
            <Text style={[Skin.activationStyle.textinput,Skin.activationStyle.textinput_lead]}>
              Verify:
            </Text>
            <Text style={[Skin.activationStyle.textinput]}>
              {this.props.url.chlngJson.chlng_resp[0].challenge}
            </Text>
          </View>
        </View>

        <View style={Skin.activationStyle.input_wrap}>
          <View style={Skin.activationStyle.textinput_wrap}>
            <Text style={[Skin.activationStyle.textinput,Skin.activationStyle.textinput_lead]}>
              Activate:
            </Text>
            <TextInput
              returnKeyType={'next'}
              autoCorrect={false}
              secureTextEntry={true}
              keyboardType={'default'}
              placeholder={'Username'}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              style={Skin.activationStyle.textinput}
              value={this.state.inputUsername}
              autoCorrect={false}
              ref='activatonCode'
              placeholder={'Code'}
              onChange={this.onActivationCodeChange.bind(this)}
            />
          </View>
        </View>

        <View style={Skin.activationStyle.input_wrap}>
          <TouchableHighlight
            style={Skin.activationStyle.button}
            underlayColor={'#082340'}
            onPress={this.checkActivationCode.bind(this)}
            activeOpacity={0.6}
          >
            <Text style={Skin.activationStyle.buttontext}>
              {this.btnText()}
            </Text>
          </TouchableHighlight>
        </View>
      </MainActivation>
    );
  }
}

