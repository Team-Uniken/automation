
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
	StyleSheet,
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
			<View style={Skin.customeStyle.maincontainer}>
		       <StatusBar
					 backgroundColor={Skin.colors.STATUS_BAR_COLOR}
		       barStyle='light-content'
		       />
					 <ToolBar navigator={this.props.navigator} title="Activation"/>
					 <ScrollView >
					 		<Text style={Skin.customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
         			<Text style={Skin.customeStyle.text2}>Verify and Activate</Text>
							<Text style={Skin.customeStyle.div}> </Text>
							<Text style={Skin.customeStyle.text3}>{this.props.url.chlngJson.chlng_resp[0].challenge}</Text>
							<Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_info[0].value}</Text>
							<Text style={[Skin.customeStyle.note,{width:200,marginLeft:Skin.SCREEN_WIDTH/2-100}]}>{this.props.url.chlngJson.chlng_info[2].value}</Text>
							<Text style={Skin.customeStyle.div}> </Text>
							<Text style={Skin.customeStyle.text2}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
							<View style={[Skin.customeStyle.roundcornerinput]} activeOpacity={0.6}>
							<KeyboardAwareScrollView>
		 					<TextInput
			 					autoCorrect={false}
			 					ref='activatonCode'
			 					placeholder={'Enter Activation Code'}
			 					placeholderTextColor={Skin.colors.HINT_COLOR}
			 					style={Skin.customeStyle.input}
			 					secureTextEntry={true}
			 					onChange={this.onActivationCodeChange.bind(this)}
		 					/>
							</KeyboardAwareScrollView>

		 				</View>
						<Text style={Skin.customeStyle.text1}>{this.props.url.chlngJson.attempts_left} Attempts Left</Text>
						<TouchableHighlight
		 					style={[Skin.customeStyle.roundcornerbutton]}
		 					onPress={this.checkActivationCode.bind(this)}
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
