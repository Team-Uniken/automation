'use strict';

/*
  ALWAYS NEED
*/
import React from 'react-native';
import Skin from '../../Skin';

/*
  CALLED
*/
import Events from 'react-native-simple-events';
import MainActivation from '../MainActivation';

const {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  InteractionManager,
} = React;


export default class Activation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activatonCode: '',
    };
    /*
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
  */
  }

  onActivationCodeChange(event) {
    this.setState({ activatonCode: event.nativeEvent.text });
    //console.log(event.nativeEvent.text);
  }
  btnText() {
    if (this.props.url.chlngJson.chlng_idx === this.props.url.chlngsCount) {
      return 'SUBMIT';
    }
    return 'NEXT';
  }
  checkActivationCode() {
    //console.log(this);
    let vkey = this.state.activatonCode;
    if (vkey.length > 0) {
      let responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', { response: responseJson });
    }
    else {
      alert('Please enter Verification Key');
    }
  }

  componentDidMount() {

      InteractionManager.runAfterInteractions(() => {
          this.refs.activatonCode.focus();
      });
  }

  render() {
   
    return (
      <MainActivation>
        <View style={Skin.activationStyle.topGroup}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
          <Text style={Skin.activationStyle.info}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
          
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
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                style={Skin.activationStyle.textinput}
                value={this.state.inputUsername}
                ref={'activatonCode'}
                placeholder={'Code'}
                onChange={this.onActivationCodeChange.bind(this)}
                onSubmitEditing={this.checkActivationCode.bind(this)}
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
        </View>
      </MainActivation>
    );
  }
}
