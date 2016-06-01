
/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../MainStyleSheet');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var logStyle = Skin.logStyle;
var progStyle = Skin.progStyle;
var Main = require('../Main');
var Menu = require('../Menu');
var Web = require('../Web');
var PasswordVerification = require('./PasswordVerification');
var Activation = require('./Activation');
var ToolBar = require('../ToolBarWithoutCross');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var Events = require('react-native-simple-events');
var ProgressBar = require('react-native-progress-bar');

/* 
	INSTANCES
*/
var responseJson;
var chlngJson;
var nextChlngName;
var InvalideUsername;
var obj;
var statusMessage;
var subscriptions;
var {
	AppRegistry,
	Component,
	Easing,
	Image,
	ListView,
	StyleSheet,
	Text,
	TextInput,
	StatusBar,
	View,
	StatusBarIOS,
	Animated,
	TouchableOpacity,
	TouchableHighlight,
	InteractionManager,
	ProgressViewIOS,
	Dimensions,
	Platform,
	AsyncStorage,
	ScrollView,
	DeviceEventEmitter,
} = React;





class UserLogin extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			r_opac_val: new Animated.Value(0),
			i_opac_val: new Animated.Value(0),
			d_opac_val: new Animated.Value(0),
			relid_text_opac: new Animated.Value(0),
			rid_top: new Animated.Value(253),
			r_text_opac: new Animated.Value(0),
			i_text_opac: new Animated.Value(0),
			d_text_opac: new Animated.Value(0),
			relid_opac_val: new Animated.Value(0),
			logWrapOpac: new Animated.Value(0),
			logWarnOpac: new Animated.Value(0),
			// passWrapOpac: new Animated.Value(0),
			// passWarnOpac: new Animated.Value(0),
			progWrapOpac: new Animated.Value(0),
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

	openRoute(route){
		this.props.navigator.push(route)
	}

  onCheckChallengeResponseStatus(e){
    var res = JSON.parse(e.response);
    var statusCode= res.pArgs.response.StatusCode
    if (statusCode==100) {
      chlngJson = res.pArgs.response.ResponseData;
      //This is important, hardcoding is done for testing purpose
    // var temp = JSON.parse(chlngJson);
    // nextChlngName = temp.chlng[0].chlng_name
    nextChlngName = 'PasswordVerification';
      obj.checkUsernameSuccess();
    }else{
      statusMessage = res.pArgs.response.StatusMsg;
      obj.checkUsernameFailure();
    };
  }

	componentDidMount() {

		obj = this;
    //subscriptions = DeviceEventEmitter.addListener('onCheckChallengeResponseStatus', this.onCheckChallengeResponseStatus.bind(this))

		Animated.sequence([
			Animated.parallel([
				Animated.timing(this.state.r_opac_val, {
					toValue: 1,
					duration: 500 * Skin.spd,
					delay:0 * Skin.spd,
				}),
				Animated.timing(this.state.i_opac_val, {
					toValue: 1,
					duration: 500 * Skin.spd,
					delay: 0 * Skin.spd,
				}),
				Animated.timing(this.state.d_opac_val, {
					toValue: 1,
					duration: 500 * Skin.spd,
					delay: 0 * Skin.spd,
				}),
			]),
			Animated.timing(this.state.logWrapOpac, {
				toValue: 1,
				duration: 100 * Skin.spd,
				delay: 0 * Skin.spd
				}
			)
			]).start();
		InteractionManager.runAfterInteractions(() => {
			this.refs.inputUsername.focus();
		});
	}

	componentWillMount(){
		console.log("------ userLogin " + JSON.stringify(this.props.url.chlngJson));
	}

	updateProgress() {

		setTimeout((function() {
								this.setState({ progress: this.state.progress + (0.4*LoadSpd)});
								if(this.state.progress < 1){
										this.updateProgress();
										}else{
											console.log('complete');
											// this.props.navigator.push(
											// 	{id: "PasswordVerification",title:nextChlngName,url:chlngJson}
											// );
											}
								}).bind(this),5);
	}

	onUsernameChange(event){
		this.setState({inputUsername: event.nativeEvent.text});
	}

	onPasswordChange(event){
		this.setState({inputPassword: event.nativeEvent.text});
	}

	checkUsername(){
		this.state.progress = 0;
		var un = this.state.inputUsername;

    if(un.length>0){
    	AsyncStorage.setItem("userId", un);
    	Main.dnaUserName = un;
		responseJson = this.props.url.chlngJson;
		responseJson.chlng_resp[0].response = un;
		Events.trigger('showNextChallenge', {response: responseJson});
		// this.updateProgress();
	}else{
		 	alert('Please enter User ID');
		 }
	}

	checkUsernameSuccess(){
    //subscriptions.remove();
		InteractionManager.runAfterInteractions(() => {
				this.props.navigator.push(
					{id: "Activation",title:nextChlngName,url:chlngJson}
				);
			});
	}

	checkUsernameFailure(){
			this.state.progress = 0;
		Animated.sequence([
			Animated.timing(this.state.logWrapOpac, {
				toValue: 1,
				duration: 1 * 0.1,
				delay: 0 * Skin.spd
				}
			),
		Animated.timing(this.state.progWrapOpac, {
			toValue: 0,
			duration: 500 * Skin.spd,
			delay: 0 * Skin.spd
		})
		]).start();
		this.clearText('inputUsername')
		this.setState({failureMessage: statusMessage});
		Animated.sequence([
			Animated.timing(this.state.logWarnOpac, {
				toValue: 1,
				duration: 500 * Skin.spd,
				delay: 0 * Skin.spd
				}
			)
			]).start();
			this.refs.inputUsername.focus();

	}



	getProgress(offset) {
		var progress = this.state.progress + offset;
		return progress;
	}

	clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }

	// checkPassword(){
	// 	var pw = this.state.inputPassword;
	// 	var count = this.state.passAttempts;

	// }

	// onCheckPasswordSuccess(){
	// 	this.refs.inputPassword.blur();
	// 		Animated.sequence([
	// 		Animated.timing(this.state.progWrapOpac, {
	// 			toValue: 1,
	// 			duration: 500 * Skin.spd,
	// 			delay: 0 * Skin.spd
	// 		})
	// 		]).start();
	// 		this.updateProgress();

	// }

	// onCheckPasswordFailure(){
	// 	this.setState({failureMessage: statusMessage});
	// 	Animated.sequence([
	// 		Animated.timing(this.state.passWarnOpac, {
	// 			toValue: 1,
	// 			duration: 500 * Skin.spd,
	// 			delay: 0 * Skin.spd
	// 		})
	// 		]).start();
	// 		this.setState({login_button_text: "Login ("+count+" attempts)"});
	// 		this.setState({passAttempts: count-1});
	// }


	render() {
		return (
			<View>
				<View style={Skin.statusBarStyle.default}>
			    	<StatusBar
            			barStyle='light-content'
            		/>
            	</View>
            	<View style={Skin.loadStyle.bgcolorizer}></View>
            	<View style={Skin.loadStyle.loadwrap}>
            		<Animated.View style={[Skin.loadStyle.rid_wrap, {top: SCREEN_HEIGHT/4}]}>
						<View style={Skin.loadStyle.rid_center}>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_r]}>g</Text>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_i]}>h</Text>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_d]}>i</Text>
						</View>
					</Animated.View>
				</View>
            	<View style={[Skin.logStyle.wrap, {top: SCREEN_HEIGHT/2}]}>
            		<View style={Skin.logStyle.preicon_wrap}>
            			<Text style={Skin.logStyle.preicon_text}>
            				[]
            			</Text>
            		</View>
            		<View style={Skin.logStyle.textinput_wrap}>
		            	<TextInput
							ref='inputUsername'
							returnKeyType={'next'}
							autoCorrect={false}
							keyboardType={'email-address'}
							placeholder={'Enter Username'}
							placeholderTextColor={'rgba(255,255,255,0.5)'}
							style={Skin.logStyle.input}
							value={this.state.inputUsername}
							onSubmitEditing={this.checkUsername.bind(this)}
							onChange={this.onUsernameChange.bind(this)}
						/>
					</View>
				</View>
			</View>
		);
	}

/*



            	<Animated.View style={[Skin.progStyle.wrap, {opacity: this.state.progWrapOpac}]}>
					<Text style={[Skin.progStyle.warning]}>
						Loading...
					</Text>
					<ProgressBar
						fillStyle={{}}
						backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
						style={{marginTop: 200, width: 250,left:(SCREEN_WIDTH - 250) / 2}}
						progress={this.state.progress}
					/>
				</Animated.View>

				<View backgroundStyle={{backgroundColor: '#50acde', borderRadius: 2}}>
					<Animated.View style={[Skin.logStyle.image_center,{opacity: this.state.logWrapOpac}]}>

						<View style={Skin.coreStyle.rid_center}>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_r]}>g</Text>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_i]}>h</Text>
							<Text style={[Skin.coreStyle.logo_rid, Skin.coreStyle.logo_d]}>i</Text>
						</View>
						<View style={{marginTop:Dimensions.get('window').height/3,}}>
							<Animated.Text style={[Skin.logStyle.warning,{opacity: this.state.logWarnOpac}]}>
								<Text style={Skin.logStyle.button}>
									{this.state.failureMessage}
								</Text>
							</Animated.Text>
							<TextInput
								ref='inputUsername'
								returnKeyType={'next'}
								autoCorrect={false}
								keyboardType={'email-address'}
								placeholder={'Enter Username'}
								placeholderTextColor={'rgba(255,255,255,0.5)'}
								style={Skin.logStyle.input}
								value={this.state.inputUsername}
								onSubmitEditing={this.checkUsername.bind(this)}
								onChange={this.onUsernameChange.bind(this)}
							/>
							<TouchableHighlight
								style={Skin.logStyle.roundcorner}
								onPress={this.checkUsername.bind(this)}
								underlayColor={'#082340'}
								activeOpacity={0.6}
							>
								<Text style={Skin.logStyle.button}>{this.state.login_button_text}</Text>
							</TouchableHighlight>
						</View>
					</Animated.View>
				</View >
*/
};

module.exports = UserLogin;
