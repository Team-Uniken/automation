

var React = require('react-native');
var ToolBar = require('../ToolBar');
var SetQue = require('./SetQue');
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
			<View   style={{flex:1,backgroundColor:'#fff'}}>
		      <StatusBar
		      backgroundColor='#1976d2'
		      barStyle='light-content'
		      />
								<ToolBar navigator={this.props.navigator} title="Activation"/>
			<ScrollView >

			<Text style={customeStyle.text1}>{this.props.url.currentIndex}/{this.props.url.chlngsCount}</Text>
         <Text style={customeStyle.text2}>Set Access</Text>
<Text style={customeStyle.div}> </Text>
<Text style={customeStyle.text2}>Set Account Password</Text>
<View
		style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
		 activeOpacity={0.6}
		>
		<TextInput
			autoCorrect={false}
			ref='password'
			placeholder={'Enter Password'}
			placeholderTextColor={'#8F8F8F'}
			style={customeStyle.input}
			secureTextEntry={true}
			onChange={this.onPasswordChange.bind(this)}
		/>
		</View>

 <Text style={customeStyle.div}> </Text>

 <View
	 style={[customeStyle.roundcorner,{backgroundColor:'#fff',borderColor:'#2196F3'}]}
		activeOpacity={0.6}
	 >
	 <TextInput
		 autoCorrect={false}
		 ref='cPassowrd'
		 placeholder={'Confirm Password'}
		 placeholderTextColor={'#8F8F8F'}
		 style={customeStyle.input}
		 secureTextEntry={true}
		 onChange={this.onConfirmPasswordChange.bind(this)}
	 />
	 </View>
	<Text style={customeStyle.note}>{this.props.url.chlngJson.chlng_info[1].value}</Text>
<Text style={customeStyle.div}> </Text>

<TouchableHighlight
		style={[customeStyle.roundcorner,{backgroundColor:'#2196F3'}]}
		onPress={this.setPassword.bind(this)}
		 underlayColor={'#1976d2'}
		 activeOpacity={0.6}
		>
		<Text style={customeStyle.button}>{this.btnText()}</Text>
		</TouchableHighlight>
</ScrollView >
			</View>
		);
	}
};

module.exports = Password;
