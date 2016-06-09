import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var React = require('react-native');
var ToolBar = require('../ToolBar');
var Password = require('./Password');
var Events = require('react-native-simple-events');
var Skin = require('../../Skin');

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	ScrollView,
	StatusBar,
} = React;

class Activation extends React.Component{
	btnText(){
		if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
			return "Submit";
		}else{
			return "Continue";
		}}
  constructor(props){
    super(props);
    this.state = {
      sAnswer : ''
    };
  }
  checkAnswer(){
    var scAns = this.state.sAnswer;
    if(scAns.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = scAns;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Secret Answer');
    }
  }
  onAnswerChange(event){
    this.setState({sAnswer: event.nativeEvent.text});
  }
	render() {
		return (
			<View style={Skin.customeStyle.maincontainer}>
			<StatusBar
			backgroundColor={Skin.colors.STATUS_BAR_COLOR}
			barStyle='light-content'
			/>
			<ToolBar navigator={this.props.navigator} title="Login"/>
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
			</ScrollView >
			</View>
		);
	}
};

module.exports = Activation;
