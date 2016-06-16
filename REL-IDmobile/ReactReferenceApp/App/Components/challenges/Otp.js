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
  TouchableHighlight,
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
      <MainActivation>
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
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              style={Skin.activationStyle.textinput}
              value={this.state.inputUsername}
              autoCorrect={false}
              ref={'accessCode'}
              placeholder={'Code'}
              onChange={this.onAccessCodeChange.bind(this)}
              onSubmitEditing={this.checkAccessCode.bind(this)}
            />
          </View>
        </View>

        <View style={Skin.activationStyle.input_wrap}>
          <TouchableHighlight
            style={Skin.activationStyle.button}
            underlayColor={'#082340'}
            onPress={this.checkAccessCode.bind(this)}
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
};

module.exports = Activation;

/*
      

      <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.chlng_idx}/{this.props.url.chlngsCount}</Text>
         <Text style={Skin.customeStyle.text2}>Set Access</Text>
<Text style={Skin.customeStyle.div}> </Text>
<Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
<Text style={Skin.customeStyle.text2}>Verification Key</Text>
<Text style={Skin.customeStyle.note}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={Skin.customeStyle.div}> </Text>
<Text style={Skin.customeStyle.text2}>Access Code</Text>
<Text style={Skin.customeStyle.div}> </Text>



      <View
      style={[Skin.customeStyle.roundcornerinput]}
       activeOpacity={0.6}
      >
      <KeyboardAwareScrollView>

      <TextInput
        autoCorrect={false}
        ref='accessCode'
        placeholder={'Enter Access Code'}
        placeholderTextColor={'#8F8F8F'}
        style={Skin.customeStyle.input}
        secureTextEntry={true}
        onChange={this.onAccessCodeChange.bind(this)}
      />
      </KeyboardAwareScrollView>

      </View>


 <Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
 <Text style={Skin.customeStyle.div}> </Text>


 <TouchableHighlight
     style={[Skin.customeStyle.roundcornerbutton]}
     onPress={this.checkAccessCode.bind(this)}
     underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
      activeOpacity={0.6}
     >
     <Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
     </TouchableHighlight>

</ScrollView >
      </View>
 */
