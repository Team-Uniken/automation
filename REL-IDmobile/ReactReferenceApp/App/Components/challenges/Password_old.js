
/*
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var React = require('react-native');
var ToolBar = require('../ToolBar');
var SetQue = require('./SetQue');
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
	ScrollView,
	StatusBar,
} = React;

class Password extends React.Component{
	btnText(){
		if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
			return "Submit";
		}else{
			return "Continue";
		}}
  constructor(props){
    super(props);
    this.state = {
      password : '',
      cPassword : ''

    };
  }

  setPassword(){
    var pw = this.state.password;
    var cpw = this.state.cPassword;

    if(pw.length>0){
      if(cpw.length>0){
        if(pw == cpw){
        responseJson = this.props.url.chlngJson;
        responseJson.chlng_resp[0].response = pw;
          Events.trigger('showNextChallenge', {response: responseJson});
        }
        else{
          alert('Password and Confirm Password do not match');
        }}else{alert('Please enter confirm password ');}
    }
    else{
      alert('Please enter password ');
    }
  }

  onPasswordChange(event){
    this.setState({password: event.nativeEvent.text});
  }

  onConfirmPasswordChange(event){
    this.setState({cPassword: event.nativeEvent.text});
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
         <Text style={Skin.customeStyle.text2}>Set Access</Text>
<Text style={Skin.customeStyle.div}> </Text>
<Text style={Skin.customeStyle.text2}>Set Account Password</Text>
<View
		style={[Skin.customeStyle.roundcornerinput]}
		 activeOpacity={0.6}
		>
		<KeyboardAwareScrollView>
		<TextInput
			autoCorrect={false}
			ref='password'
			placeholder={'Enter Password'}
			placeholderTextColor={Skin.colors.HINT_COLOR}
			style={Skin.customeStyle.input}
			secureTextEntry={true}
			onChange={this.onPasswordChange.bind(this)}
		/>
		</KeyboardAwareScrollView>

		</View>

 <Text style={Skin.customeStyle.div}> </Text>

 <View
	 style={[Skin.customeStyle.roundcornerinput]}
		activeOpacity={0.6}
	 >
	 <KeyboardAwareScrollView>
	 <TextInput
		 autoCorrect={false}
		 ref='cPassowrd'
		 placeholder={'Confirm Password'}
		 placeholderTextColor={Skin.colors.HINT_COLOR}
		 style={Skin.customeStyle.input}
		 secureTextEntry={true}
		 onChange={this.onConfirmPasswordChange.bind(this)}
	 />
	 </KeyboardAwareScrollView>

	 </View>
	<Text style={[Skin.customeStyle.note,{width:200,marginLeft:Skin.SCREEN_WIDTH/2-100}]}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={Skin.customeStyle.div}> </Text>

<TouchableHighlight
		style={[Skin.customeStyle.roundcornerbutton]}
		onPress={this.setPassword.bind(this)}
		underlayColor={Skin.colors.BUTTON_UNDERLAY_COLOR}
		 activeOpacity={0.6}
		>
		<Text style={Skin.customeStyle.button}>{this.btnText()}</Text>
		</TouchableHighlight>
</ScrollView >
			</View>
		);
	}
};

module.exports = Password;
*/
