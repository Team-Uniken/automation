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

/*
  Instantiaions
*/
let responseJson;
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} = React;

class Activation extends React.Component{


  constructor(props){
    super(props);
    this.state = {
      accessCode : ''

    };
  }
  componentDidMount() {

		}

  checkAccessCode(){
    var AcCode = this.state.accessCode;
    if(AcCode.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = AcCode;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Access Code');
    }
  }
  onAccessCodeChange(event){
    this.setState({accessCode: event.nativeEvent.text});
  }

btnText(){
	if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
		return "Submit";
	}else{
		return "Continue";
	}}


	render() {

		return (
      <MainActivation navigator={this.props.navigator}>
        <View style={{marginTop:38}}>
          <Text style={Skin.activationStyle.counter}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
          <Text style={Skin.activationStyle.title}>Access Code</Text>
          <Text style={Skin.activationStyle.info}>Enter the matching Access Code.</Text>
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
              secureTextEntry
              keyboardType={'default'}
               placeholderTextColor={Skin.PLACEHOLDER_TEXT_COLOR_RGB}
              style={Skin.activationStyle.textinput}
              value={this.state.inputUsername}
              ref={'accessCode'}
              placeholder={'Code'}
              onChange={this.onAccessCodeChange.bind(this)}
              onSubmitEditing={this.checkAccessCode.bind(this)}
            />
          </View>
        </View>
        <Text style={Skin.customeStyle.attempt}>Attempts Left {this.props.url.chlngJson.attempts_left}</Text>
        <View style={Skin.activationStyle.input_wrap}>
          <TouchableOpacity
            style={Skin.activationStyle.button}
            underlayColor={Skin.login.BUTTON_UNDERLAY}
            onPress={this.checkAccessCode.bind(this)}
            activeOpacity={0.6}
          >
            <Text style={Skin.activationStyle.buttontext}>
              {this.btnText()}
            </Text>
          </TouchableOpacity>
        </View>
      </MainActivation>

		);
	}
}

module.exports = Activation;
