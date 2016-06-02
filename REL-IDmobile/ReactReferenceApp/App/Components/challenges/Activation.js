

var React = require('react-native');
var {customeStyle, styles} = require("../MainStyleSheet");
var ToolBar = require('../ToolBar');
var Password = require('./Password');
var Events = require('react-native-simple-events');


var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet,
  Dimensions,
	StatusBar,
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
      activatonCode : ''
    };
  }

  checkActivationCode(){
    var vkey = this.state.activatonCode;
    if(vkey.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = vkey;
      Events.trigger('showNextChallenge', {response: responseJson});
    }
    else{
      alert('Please enter Verification Key');
    }
  }
  onActivationCodeChange(event){
    this.setState({activatonCode: event.nativeEvent.text});
  }

	render() {
		return (
			<View style={customeStyle.maincontainer}>
		       <StatusBar
		       backgroundColor='#1976d2'
		       barStyle='light-content'
		       />
					 <ToolBar navigator={this.props.navigator} title="Activation"/>
					 <ScrollView >
					 		<Text style={customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
         			<Text style={customeStyle.text2}>Verify and Activate</Text>
							<Text style={customeStyle.div}> </Text>
							<Text style={customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
							<Text style={customeStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
							<Text style={customeStyle.note}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
							<Text style={customeStyle.div}> </Text>
							<Text style={customeStyle.text2}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
							<View style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]} activeOpacity={0.6}>
		 					<TextInput
			 					autoCorrect={false}
			 					ref='activatonCode'
			 					placeholder={'Enter Activation Code'}
			 					placeholderTextColor={'#8F8F8F'}
			 					style={customeStyle.input}
			 					secureTextEntry={true}
			 					onChange={this.onActivationCodeChange.bind(this)}
		 					/>
		 				</View>
						<Text style={customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
						<TouchableHighlight
		 					style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
		 					onPress={this.checkActivationCode.bind(this)}
							underlayColor={'#1976d2'}
							activeOpacity={0.6}>
		 						<Text style={customeStyle.button}>{this.btnText()}</Text>
		 					</TouchableHighlight>
						</ScrollView >
			</View>
		);
	}
};
module.exports = Activation;
