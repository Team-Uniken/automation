/**
 *  Question's answer verification screen. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Events from 'react-native-simple-events';
import {View, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, BackAndroid, } from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer';


/*
 Use in this js
 */
import Skin from '../../Skin';
import Main from '../Container/Main';
import MainActivation from '../Container/MainActivation';


/*
 Custome View
 */
import Button from '../view/button';
import Margin from '../view/margin';
import Input from '../view/input';
import Title from '../view/title';


/*
  INSTANCED
 */
let responseJson;



export default class QuestionVerification extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sAnswer: '',
    };
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
   onTextchange method for Answer TextInput
   */
  onAnswerChange(event) {
    this.setState({
      sAnswer: event.nativeEvent.text,
    });
  }
  /*
    This method is used to get the users entered value and submit the same as a challenge response.
  */
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
  /*
     This method is used to return the text Submit/Continue for submit button.
   */
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'Submit';
    }
    return 'Continue';
  }
  /*
     This method is used to handle the cancel button click or back button.
   */
  close() {
    let responseJson = this.props.url.chlngJson;
    this.setState({ showCamera: false });
    Events.trigger('showPreviousChallenge');
  }
  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <MainActivation>
        <View style={Skin.layout1.content.wrap}>

          <View style={Skin.layout0.top.container}>
            <Title onClose={() => {
              this.close();
            } }>
            </Title>
            <Text style={[Skin.layout0.top.icon]}>
              {Skin.icon.logo}
            </Text>
            <Text style={Skin.layout0.top.subtitle}>Secret Question</Text>
          </View>
          <Text style = {[Skin.baseline.textinput.base, this.props.styleInput]}>
            { this.props.url.chlngJson.chlng_resp[0].challenge }
          </Text>
          <View style={Skin.layout0.bottom.container}>
            <Text style={Skin.layout0.top.attempt}>
              Attempt left {this.props.url.chlngJson.attempts_left}
            </Text>

            <Input
              autoCorrect={false}
              ref='answer'
              placeholder={ 'Enter Secret Answer' }
              onChange={ this.onAnswerChange.bind(this) }
              returnKeyType={ 'next' }
              secureTextEntry={ true }
              keyboardType={ 'default' }
              onSubmitEditing={ this.checkAnswer.bind(this) }
              autoFocus={true}
              />
            <KeyboardSpacer topSpacing={-30}/>
            <Margin
              space={16}/>
            <View style={Skin.layout0.bottom.container}>
              <Button
                label={Skin.text['2']['1'].submit_button}
                onPress={ this.checkAnswer.bind(this) }/>
            </View>
          </View>
        </View>
      </MainActivation>
    );
  }
}

module.exports = QuestionVerification;
