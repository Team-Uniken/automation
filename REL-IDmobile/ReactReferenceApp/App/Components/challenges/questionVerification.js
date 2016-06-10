var React = require('react-native');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';
var ToolBar = require('../ToolBar');
var Events = require('react-native-simple-events');
var {customeStyle, styles} = require("../MainStyleSheet");

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet,
  Dimensions,
	ScrollView,
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
			<View style={styles.Container}>
			<ToolBar navigator={this.props.navigator} title="Login"/>
			<ScrollView >
			<Text style={customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
      <Text style={customeStyle.text2}>Authentication</Text>
			<Text style={customeStyle.note}>Answer your secret question</Text>
			<Text style={customeStyle.div}> </Text>
			<Text style={customeStyle.text3}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
			<Text style={customeStyle.text2}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
			<Text style={customeStyle.div}> </Text>
			<Text style={customeStyle.text3}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
      <View
      	style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
       	activeOpacity={0.6}>
      <TextInput
        autoCorrect={false}
				ref='sAnswer'
        placeholder={'Enter your secret answer'}
        placeholderTextColor={'#8F8F8F'}
        style={customeStyle.input}
				onChange={this.onAnswerChange.bind(this)}/>
      </View>
			<Text style={customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
      <Text style={customeStyle.div}> </Text>
			<TouchableHighlight
	      style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
				onPress={this.checkAnswer.bind(this)}
	     	underlayColor={'#f00'}
	     	activeOpacity={0.6}>
	      <Text style={customeStyle.button}>{this.btnText()}</Text>
	    </TouchableHighlight>
			</ScrollView >
			</View>
		);
	}
};

module.exports = Activation;
