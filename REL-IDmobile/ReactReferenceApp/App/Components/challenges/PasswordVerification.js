'use strict';

/*
  ALWAYS NEED
*/

var React = require('react-native');
var Skin = require('../../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Main = require('../Main');
var Web = require('../Web');
var OpenLinks = require('../OpenLinks')
var ToolBar = require('../ToolBarWithoutCross');
var Events = require('react-native-simple-events');
var Platform = require("react-native").Platform;
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
var {DeviceEventEmitter} = require('react-native');
var ProgressBar = require('react-native-progress-bar');
import Spinner from 'react-native-loading-spinner-overlay';

/*
	INSTANCES
*/
var total=0.3;
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var responseJson;
var chlngJson;
var nextChlngName;
var InvalideUsername;
var FailureStatusMessage;
var obj;
var PROXY_PORT = "@ReactRefApp:proxyKey";
var statusMessage;
var {
	AppRegistry,
	Component,
	Easing,
	Image,
	ListView,
	StyleSheet,
	Text,
	TextInput,
	View,
	StatusBar,
	Animated,
	TouchableOpacity,
	TouchableHighlight,
	InteractionManager,
	ScrollView,
	Platform,
  	AsyncStorage,
	Dimensions,
} = React;





class PasswordVerification extends React.Component{
	btnText(){
		if(this.props.url.chlngJson.chlng_idx===this.props.url.chlngsCount){
			return "Submit";
		}else{
			return "Continue";
		}}
	constructor(props){
		super(props);
		this.state = {
			progress: 0,
			inputUsername: '',
			inputPassword: '',
			login_button_text: 'Login',
			loginAttempts: 5,
			passAttempts: 5,
			Challenge:this.props.url.chlngJson,
			failureMessage : ''

		};
	}
	componentDidMount() {

		obj = this;
/*		Animated.sequence([
			Animated.timing(this.state.passWrapOpac, {
				toValue: 1,
				duration: 100 * Skin.Spd,
				delay: 0 * Spd
				}
			)
			]).start();
*/
		//InteractionManager.runAfterInteractions(() => {
			this.refs.inputPassword.focus();
		//});
	}

	onPasswordChange(event){
		this.setState({inputPassword: event.nativeEvent.text});
	}

  	updateProgress() {
	    setTimeout((function() {
	        this.setState({ progress: this.state.progress + (0.4*Skin.loadspd)});
	        if(this.state.progress < 1){
	            this.updateProgress();
	            }else{
	              console.log('complete');
	              this.props.navigator.push(
	                   {id: "Main"}
	              );
	            }
	        }).bind(this), 5);
  	}

	checkPassword(){
//    alert(Main.dnaUserName);
		var pw = this.state.inputPassword;
    if(pw.length>0){
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = pw;
      Events.trigger('showNextChallenge', {response: responseJson});
      // this.updateProgress();
    }
    else{
        alert('Please enter password');
      }
	}

	checkPasswordSuccess(){
		this.refs.inputPassword.blur();
		/*
			Animated.sequence([
				Animated.timing(this.state.passWrapOpac, {
					toValue: 0,
					duration: 100 * Spd,
					delay: 0 * Spd
					}
				),
			Animated.timing(this.state.progWrapOpac, {
				toValue: 1,
				duration: 500 * Spd,
				delay: 0 * Spd
			})
			]).start(); */
    this.state.progress = 0;
			this.updateProgress();

	}

	checkPasswordFailure(){
		this.clearText('inputPassword');

		this.setState({failureMessage: 'Invalid Password'});
		/*
		Animated.sequence([
			Animated.timing(this.state.passWarnOpac, {
				toValue: 1,
				duration: 50 * Spd,
				delay: 0 * Spd
			})
			]).start();
			InteractionManager.runAfterInteractions(() => {
			this.refs.inputPassword.focus();
		});
		*/
			// this.setState({login_button_text: "Login ("+count+" attempts)"});
			// this.setState({passAttempts: count-1});
	}

	clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }

	render() {
		return (
			<View style={Skin.coreStyle.container}>
			    <View style={Skin.loadStyle.bgbase}></View>
	            <Image style={Skin.loadStyle.bgimage} source={require('image!bg')} />
            	<View style={Skin.statusBarStyle.default}>
			    	<StatusBar
            			barStyle='light-content'
            		/>
            	</View>
            	<View style={Skin.loadStyle.bgcolorizer}></View>
            	<View style={Skin.logStyle.wrap}>
            		<View style={Skin.logStyle.top_wrap}>
		            		<Animated.View style={Skin.coreStyle.rid_wrap}>
								<View style={Skin.coreStyle.rid_center}>
									<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_r]}>g</Text>
									<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_i]}>h</Text>
									<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_d]}>i</Text>
								</View>
							</Animated.View>
            		</View>
            		<View style={Skin.logStyle.mid_wrap}>
            			<View style={Skin.logStyle.input_wrap}>
	            			<View style={Skin.logStyle.textinput_wrap}>
								<TextInput
									ref='inputPassword'
									returnKeyType={'next'}
									secureTextEntry={true}
									autoCorrect={false}
									placeholder={'Password'}
									placeholderTextColor={'rgba(255,255,255,0.7)'}
									style={Skin.logStyle.textinput}
									value={this.state.inputPassword}
									onSubmitEditing={this.checkPassword.bind(this)}
									onChange={this.onPasswordChange.bind(this)}
								/>
							</View>
            			</View>
            			<View style={Skin.logStyle.input_wrap}>
            				<TouchableHighlight
								style={Skin.logStyle.button}
								onPress={this.checkPassword.bind(this)}
								underlayColor={'#082340'}
								activeOpacity={0.6}
								>
								<Text style={Skin.logStyle.button_text}>SUBMIT</Text>
							</TouchableHighlight>
            			</View>
            		</View>
            		<View style={Skin.logStyle.bot_wrap}>
            			<OpenLinks/>
            		</View>
				</View>
			</View>

		);
	}

};


module.exports = PasswordVerification;
