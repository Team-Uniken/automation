'use strict';

var React = require('react-native');
var Menu = require('../Menu');
var Main = require('../Main');
var Web = require('../Web');
var PasswordVerification = require('./PasswordVerification');
var Activation = require('./Activation');

var ToolBar = require('../ToolBarWithoutCross');

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var LIGHTBLUE = '#50ADDC';
var MIDBLUE = '#2579A2';
var DARKBLUE = '#10253F';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var CORE_FONT = 'Century Gothic';
var Spd = 0.8;
var LoadSpd = 0.3;
var responseJson;
var chlngJson;
var nextChlngName;
var InvalideUsername;


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
} = React;


var Events = require('react-native-simple-events');

var ProgressBar = require('react-native-progress-bar');

var {DeviceEventEmitter} = require('react-native');
//var DeviceEventEmitter = require('DeviceEventEmitter');

var obj;

var statusMessage;

var subscriptions;

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
					duration: 500 * Spd,
					delay:0 * Spd,
				}),
				Animated.timing(this.state.i_opac_val, {
					toValue: 1,
					duration: 500 * Spd,
					delay: 0 * Spd,
				}),
				Animated.timing(this.state.d_opac_val, {
					toValue: 1,
					duration: 500 * Spd,
					delay: 0 * Spd,
				}),
			]),
			Animated.timing(this.state.logWrapOpac, {
				toValue: 1,
				duration: 100 * Spd,
				delay: 0 * Spd
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
				delay: 0 * Spd
				}
			),
		Animated.timing(this.state.progWrapOpac, {
			toValue: 0,
			duration: 500 * Spd,
			delay: 0 * Spd
		})
		]).start();
		this.clearText('inputUsername')
		this.setState({failureMessage: statusMessage});
		Animated.sequence([
			Animated.timing(this.state.logWarnOpac, {
				toValue: 1,
				duration: 500 * Spd,
				delay: 0 * Spd
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
	// 			duration: 500 * Spd,
	// 			delay: 0 * Spd
	// 		})
	// 		]).start();
	// 		this.updateProgress();

	// }

	// onCheckPasswordFailure(){
	// 	this.setState({failureMessage: statusMessage});
	// 	Animated.sequence([
	// 		Animated.timing(this.state.passWarnOpac, {
	// 			toValue: 1,
	// 			duration: 500 * Spd,
	// 			delay: 0 * Spd
	// 		})
	// 		]).start();
	// 		this.setState({login_button_text: "Login ("+count+" attempts)"});
	// 		this.setState({passAttempts: count-1});
	// }

	render() {
		return (
			<View style={styles.container}>
			<ToolBar navigator={this.props.navigator} title="Login"/>


			<Animated.View style={[progStyle.wrap,{opacity: this.state.progWrapOpac}]}>
			<Text style={[progStyle.warning]}>
			Loading...
			</Text>
			<ProgressBar
			fillStyle={{}}
			backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
			style={{marginTop: 200, width: 250,left:(SCREEN_WIDTH - 250) / 2}}
			progress={this.state.progress}
			/>
			</Animated.View>


			<ScrollView >

			<Animated.View style={[logStyle.image_center,{opacity: this.state.logWrapOpac}]}>

			<View style={styles.rid_center}>
				<Text style={[styles.logo_rid, styles.logo_r]}>g</Text>
				<Text style={[styles.logo_rid, styles.logo_i]}>h</Text>
				<Text style={[styles.logo_rid, styles.logo_d]}>i</Text>
			</View>
			<View style={{marginTop:Dimensions.get('window').height/3,}}>
				<Animated.Text style={[logStyle.warning,{opacity: this.state.logWarnOpac}]}>
					<Text style={logStyle.button}>
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
					style={logStyle.input}
					value={this.state.inputUsername}
					onSubmitEditing={this.checkUsername.bind(this)}
					onChange={this.onUsernameChange.bind(this)}
				/>


				<TouchableHighlight
				style={logStyle.roundcorner}
				onPress={this.checkUsername.bind(this)}

					underlayColor={'#082340'}
					activeOpacity={0.6}
				>
				<Text style={logStyle.button}>{this.state.login_button_text}</Text>
				</TouchableHighlight>
					</View>
			</Animated.View>
			</ScrollView >

		</View>

		);
	}

};


var progStyle = StyleSheet.create({
	wrap: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		backgroundColor: 'rgba(0,20,40,0.95)'
	},
	progressView: {
		top: 200,
		width: 250,
		height: 10,
		left: (SCREEN_WIDTH - 250) / 2,
	},
	warning: {
		top: 190,
		fontFamily: 'Century Gothic',
		color: 'rgba(255,255,255,0.8)',
		fontSize: 22,
		textAlign: 'center',
		height: 35,
	}
});

var logStyle = StyleSheet.create({
	wrap: {
		position: 'absolute',
		top: 245,
		height: 200,
		width: SCREEN_WIDTH,
		backgroundColor: 'transparent'
	},
	image_center: {
		alignItems: 'center',
	},

		button: {
				fontFamily: 'Century Gothic',
			backgroundColor:'transparent',
		flex:1,
		fontSize: 16,
		margin:1,
		textAlign:'center',
		textAlignVertical:'center',
		color: '#FFF',
		marginTop:16,
		},

		roundcorner: {
			height: 56,
			width: 280,
		marginTop:16,
		borderWidth: 1,
		borderColor: "#fff",
		backgroundColor:'rgba(255,255,255,0.1)',
		borderRadius: 30,
		},
	buttonWrap: {
		top: 15,
		width: 280,
		backgroundColor: 'rgba(255,255,255,1)',
		alignItems: 'center',
	},
	input: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'rgba(255,255,255,0.1)',
		height: 55,
		fontSize: 22,
		width: 280,
		color: 'rgba(255,255,255,1)',
		textAlign:'center',
		alignItems: 'center',
	},
	warning: {
		fontFamily: 'Century Gothic',
		color: 'rgba(255,255,255,0.8)',
		fontSize: 22,
		textAlign: 'center',
		width: 280,
	}
});




var leftrid = 23;
var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(8,26,60,0.9)'
	},
	bgimage: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	relidimage: {
		position: 'absolute',
		top: 80,
		width: 150,
		height: 150,
		left: ((SCREEN_WIDTH / 2 ) - 75),
		backgroundColor: 'rgba(8,26,60,0.9)'
	},
	bgcolorizer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: 'rgba(8,26,60,0.9)'
	},


	loadwrap: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: 'transparent',
		//backgroundColor: 'rgba(17,200,62,0.2)'
	},
	rid_wrap: {
		alignItems: 'center',
		//backgroundColor: 'rgba(50,250,250,0.2)',
	},
	rid_center: {
		alignItems: 'center',
		width: 160,
		marginTop:SCREEN_HEIGHT/8,
		//height:130,
		// backgroundColor: 'rgba(0,50,200,0.2)',
	},
	logo_rid: {
		fontFamily: 'icomoon',
	},
	logo_i: {
		position: 'absolute',
		fontSize: 89,
		width: 160,
		marginLeft: 31 + leftrid,
		marginTop: 31,
		color: LIGHTBLUE,
		//backgroundColor: 'rgba(70,0,0,0.5)',

	},
	logo_r: {
		position: 'absolute',
		fontSize: 120,
		width: 160,
		marginLeft: leftrid,
		color: '#FFFFFF',
		//backgroundColor: 'rgba(70,0,0,0.5)',
	},
	logo_d: {
		position: 'absolute',
		fontSize: 120,
		width: 160,
		marginLeft: 62 + leftrid,
		color: MIDBLUE,
		//backgroundColor: 'rgba(70,0,0,0.5)',
	},
	logo_relid_wrap: {
		alignItems: 'center',
		top: 0,
	},
	logo_relid: {
		fontFamily: 'icomoon',
		fontSize: 21,
		marginLeft: 22,
		width: 160,
		color: '#FFFFFF',
		backgroundColor: 'transparent',
		//backgroundColor: 'rgba(0,100,0,0.5)',
	},
	load_text_wrap: {
		top: 450,
		alignItems: 'center',
	},
	load_text: {
		color: '#FFFFFF',
		fontFamily: 'Century Gothic',
		fontSize: 20,
		position: 'absolute',
		width: 200,
		left: ((SCREEN_WIDTH - 200) / 2),
		fontWeight: 'bold',
		textAlign: 'center',
		alignItems: 'center',
		//backgroundColor: 'rgba(100,100,0,0.5)',
	},


});


module.exports = UserLogin;
