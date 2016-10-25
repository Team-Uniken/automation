'use strict';

/*
  NEEDED
*/
import ReactNative from 'react-native';
import React from 'react';
import Skin from '../../Skin';
import Main from '../Main';
/*
  CALLED
*/
import MainActivation from '../MainActivation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Events from 'react-native-simple-events';
import OpenLinks from '../OpenLinks';

import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';

/*
  INSTANCED
 */
let responseJson;
const {Component} = React;
const {View, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, } = ReactNative;

export default class QuestionVerification extends Component {

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
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = scAns;
      Events.trigger('showNextChallenge', {
        response: responseJson,
      });
    } else {
      alert('Please enter Secret Answer');
    }
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }

  render() {
    // return (
    //   <MainActivation navigator={ this.props.navigator }>
    //     <View style={ Skin.activationStyle.topGroup }>
    //       <Text style={ Skin.activationStyle.counter }>
    //         { this.props.url.currentIndex }/
    //         { this.props.url.chlngsCount }
    //       </Text>
    //       <Text style={ Skin.activationStyle.title }>
    //         Secret Question
    //       </Text>
    //       <Text style={ Skin.activationStyle.info }>
    //         { this.props.url.chlngJson.attempts_left } Attempts Left
    //       </Text>
    //       <Text style={ Skin.activationStyle.info }>
    //         { this.props.url.chlngJson.chlng_resp[0].challenge }
    //       </Text>
    //       <View style={ Skin.activationStyle.input_wrap }>
    //         <View style={ Skin.activationStyle.textinput_wrap }>
    //           <TextInput autoCorrect={ false } ref={ 'answer' } placeholder={ 'Enter Secret Answer' } onChange={ this.onAnswerChange.bind(this) } returnKeyType={ 'next' }
    //             secureTextEntry={ true } keyboardType={ 'default' } placeholderTextColor={ Skin.PLACEHOLDER_TEXT_COLOR_RGB } style={ Skin.activationStyle.textinput } onSubmitEditing={ this.checkAnswer.bind(this) }
    //             />
    //         </View>
    //       </View>
    //       <Text style={ Skin.activationStyle.warning_text }>Attempts Left:
    //         { this.props.url.chlngJson.attempts_left }
    //       </Text>
    //       <View style={ Skin.activationStyle.input_wrap }>
    //         <TouchableOpacity style={ Skin.activationStyle.button } underlayColor={ Skin.login.BUTTON_UNDERLAY } onPress={ this.checkAnswer.bind(this) } activeOpacity={ 0.6 }>
    //           <Text style={ Skin.activationStyle.buttontext }>
    //             { this.btnText() }
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //     <OpenLinks />
    //   </MainActivation>
    // );

    return (
      <View style={Skin.layout1.wrap}>

        <View style={Skin.layout1.content.wrap}>
          <View style={Skin.layout0.top.container}>
            <Text style={[Skin.layout0.top.icon, Skin.font.ICON_FONT]}>
              {Skin.icon.logo}
            </Text>
            <Text style={Skin.layout0.top.subtitle}>Secret Question</Text>
          </View>
          <View style={Skin.layout0.bottom.container}>
           <Text style = {[Skin.baseline.textinput.base, this.props.styleInput]}>
            { this.props.url.chlngJson.chlng_resp[0].challenge }
            </Text>

            <Text style={Skin.layout0.top.attempt}>
              Attempt left {this.props.url.chlngJson.attempts_left}
            </Text>
            <TextInput
              autoCorrect={ false }
              ref={ 'answer' }
              placeholder={ 'Enter Secret Answer' }
              onChange={ this.onAnswerChange.bind(this) }
              returnKeyType={ 'next' }
              secureTextEntry={ true }
              keyboardType={ 'default' }
              placeholderTextColor={ Skin.PLACEHOLDER_TEXT_COLOR_RGB }
              style = {[Skin.baseline.textinput.base, this.props.styleInput]}
              onSubmitEditing={ this.checkAnswer.bind(this) }
              />

            <Margin
              space={16}/>
            <View style={Skin.layout0.bottom.container}>


              <Button
                label={Skin.text['2']['1'].submit_button}
                onPress={ this.checkAnswer.bind(this) }/>
            </View>




          </View>
        </View>
      </View>
    );
  }
}

module.exports = QuestionVerification;
