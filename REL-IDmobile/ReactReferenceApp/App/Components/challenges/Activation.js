'use strict';

/*
  ALWAYS NEED
*/
import React from 'react';
import ReactNative from 'react-native';
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
<<<<<<< HEAD
  Platform,
  AsyncStorage,
} = ReactNative;
=======
  TouchableOpacity,
} = React;
>>>>>>> demo/ubs


const{
  Component
} =  React;

export default class Activation extends Component {

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
      alert('Enter Activation Code');
    }
  }

  componentWillMount(){
    if(Platform.OS === "android"){
       let keys = ['userData','setPattern'];
       AsyncStorage.multiRemove(keys);
    }
  }

  componentDidMount() {
    this.refs['activatonCode'].focus();
  }

  render() {
   
    return (
      <MainActivation navigator={this.props.navigator}>
        <View style={Skin.activationStyle.topGroup}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>Activation</Text>
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
                placeholderTextColor={Skin.PLACEHOLDER_TEXT_COLOR_RGB}
                style={Skin.activationStyle.textinput}
                value={this.state.inputUsername}
                ref={'activatonCode'}
                placeholder={'Code'}
                onChange={this.onActivationCodeChange.bind(this)}
                onSubmitEditing={this.checkActivationCode.bind(this)}
              />
            </View>
          </View>
            <Text style={Skin.activationStyle.warning_text}>Attempts Left : {this.props.url.chlngJson.attempts_left}</Text>

          <View style={Skin.activationStyle.input_wrap}>
            <TouchableOpacity
              style={Skin.activationStyle.button}
              underlayColor={Skin.login.BUTTON_UNDERLAY}
              onPress={this.checkActivationCode.bind(this)}
              activeOpacity={0.6}
            >
              <Text style={Skin.activationStyle.buttontext}>
                {this.btnText()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </MainActivation>
    );
  }
}
