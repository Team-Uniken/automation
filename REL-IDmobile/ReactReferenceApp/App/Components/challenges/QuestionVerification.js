'use strict';

/*
  NEEDED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Events from 'react-native-simple-events';

/*
  INSTANCED
 */
let responseJson;
const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  StatusBar,
} = React;

export default class QuestionVerification extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sAnswer : '',
    };
  }

  btnText() {
    if (this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
      return 'Submit';
    }
    return 'Continue';
  }

  checkAnswer() {
    const scAns = this.state.sAnswer;
    if (scAns.length>0) {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = scAns;
      Events.trigger('showNextChallenge', {response: responseJson});
    } else {
      alert('Please enter Secret Answer');
    }
  }

  onAnswerChange(event) {
    this.setState({ sAnswer: event.nativeEvent.text });
  }

  render() {
    return (
      <Main>
        <ScrollView >
          <Text style={Skin.customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.customeStyle.text2}>Authentication</Text>
          <Text style={Skin.customeStyle.note}>Answer your secret question</Text>
          <Text style={Skin.customeStyle.div}> </Text>
          <Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
          <Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
          <Text style={Skin.customeStyle.div}> </Text>
          <Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
          <View
            style={[Skin.customeStyle.roundcornerinput]}
            activeOpacity={0.6}>
            <KeyboardAwareScrollView>
          <TextInput
            autoCorrect={false}
            ref='sAnswer'
            placeholder={'Enter your secret answer'}
            placeholderTextColor={'#8F8F8F'}
            style={Skin.customeStyle.input}
            onChange={this.onAnswerChange.bind(this)}/>
            </KeyboardAwareScrollView>

          </View>
          <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
          <Text style={Skin.customeStyle.div}> </Text>
          <TouchableHighlight
            style={[Skin.customeStyle.roundcornerbutton]}
            onPress={this.checkAnswer.bind(this)}
            underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
            activeOpacity={0.6}>
            <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
          </TouchableHighlight>
        </ScrollView>
      </Main>
    );
  }
};

module.exports = QuestionVerification;

