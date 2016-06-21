'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import MainActivation from '../MainActivation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Events from 'react-native-simple-events';
import OpenLinks from '../OpenLinks';

/*
  INSTANCED
 */
let responseJson;
const {View, Text, TextInput, TouchableHighlight, ScrollView, } = React;

export default class QuestionVerification extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sAnswer: '',
    };
    this._props = {
      url: {
        chlngJson: {
          chlng_idx: 1,
          sub_challenge_index: 0,
          chlng_name: 'pass',
          chlng_type: 1,
          challengeOperation: 0,
          chlng_prompt: [[]],
          chlng_info: [
            {
              key: 'Prompt label',
              value: 'Verification Key',
            }, {
              key: 'Response label',
              value: 'Password',
            }, {
              key: 'Description',
              value: 'Enter password of length 8-10 characters',
            }, {
              key: 'Reading',
              value: 'Activation verification challenge',
            },
          ],
          chlng_resp: [
            {
              challenge: 'password',
              response: '',
            },
          ],
          challenge_response_policy: [],
          chlng_response_validation: false,
          attempts_left: 3,
        },
      },
    };
  }

  onAnswerChange(event) {
    this.setState({
      sAnswer: event.nativeEvent.text,
    });
  }

  checkAnswer() {
    const scAns = this.state.sAnswer;
    if (scAns.length > 0) {
      responseJson = this._props.url.chlngJson;
      responseJson.chlng_resp[0].response = scAns;
      Events.trigger('showNextChallenge', {
        response: responseJson,
      });
    } else {
      alert('Please enter Secret Answer');
    }
  }

  btnText() {
    if (this._props.url.chlngJson.chlng_idx === this._props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  render() {
    return (
      <MainActivation>
        <View
          style={Skin.activationStyle.topGroup}
        >
          <Text style={Skin.activationStyle.counter}>
            {this._props.url.currentIndex}/{this._props.url.chlngsCount}
          </Text>
          <Text style={Skin.activationStyle.title}>
            Secret Question
          </Text>
          <Text style={Skin.activationStyle.info}>
            {this._props.url.chlngJson.attempts_left} Attempts Left
          </Text>
          <Text style={Skin.activationStyle.info}>
            {this._props.url.chlngJson.chlng_resp[0].challenge}
          </Text>

          <View style={Skin.activationStyle.input_wrap}>
            <View style={Skin.activationStyle.textinput_wrap}>
              <TextInput
                autoCorrect={false}
                ref={'answer'}
                placeholder={'Enter Secret Answer'}
                placeholderTextColor={'#8F8F8F'}
                onChange={this.onAnswerChange.bind(this)}
                returnKeyType={'next'}
                secureTextEntry={true}
                keyboardType={'default'}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                style={Skin.activationStyle.textinput}
                onSubmitEditing={this.checkAnswer.bind(this)} />
            </View>
          </View>
          <View style={Skin.activationStyle.input_wrap}>
            <TouchableHighlight
              style={Skin.activationStyle.button}
              underlayColor={'#082340'}
              onPress={this.checkAnswer.bind(this)}
              activeOpacity={0.6}>
              <Text style={Skin.activationStyle.buttontext}>
                {this.btnText()}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <OpenLinks />
      </MainActivation>
      );
  }
}

module.exports = QuestionVerification;