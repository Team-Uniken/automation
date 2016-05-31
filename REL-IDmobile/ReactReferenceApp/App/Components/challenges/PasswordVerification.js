'use strict';

import Spinner from 'react-native-loading-spinner-overlay';
var React = require('react-native');
var Menu = require('../Menu');
var Main = require('../Main');
var Web = require('../Web');
var total=0.3;
var ToolBar = require('../ToolBarWithoutCross');
var Events = require('react-native-simple-events');


var Platform = require("react-native").Platform;
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
var FailureStatusMessage;


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
ScrollView,
	Platform,
  AsyncStorage,
	Dimensions,
} = React;

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

var {DeviceEventEmitter} = require('react-native');

var obj;

var PROXY_PORT = "@ReactRefApp:proxyKey";

var statusMessage;

var ProgressBar = require('react-native-progress-bar');

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
			r_opac_val: new Animated.Value(0),
			i_opac_val: new Animated.Value(0),
			d_opac_val: new Animated.Value(0),
			relid_text_opac: new Animated.Value(0),
			rid_top: new Animated.Value(253),
			r_text_opac: new Animated.Value(0),
			i_text_opac: new Animated.Value(0),
			d_text_opac: new Animated.Value(0),
			relid_opac_val: new Animated.Value(0),
			passWrapOpac: new Animated.Value(0),
			passWarnOpac: new Animated.Value(0),
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
	componentDidMount() {

		obj = this;

		DeviceEventEmitter.addListener('onCheckChallengeResponseStatus', function (e) {
		      var res = JSON.parse(e.response);
          var statusCode= res.pArgs.response.StatusCode;
		      if (statusCode==100) {
             var pPort = res.pArgs.pxyDetails.port;
             Main.dnaProxyPort = pPort;
             if(pPort>0){
             RDNARequestUtility.setHttpProxyHost('127.0.0.1',pPort,(response) => {});
           }
		      	obj.checkPasswordSuccess();
		      }else{
		      	statusMessage = res.pArgs.response.StatusMsg;
		      	obj.checkPasswordFailure();
		      };

		   });
		Animated.sequence([
			Animated.timing(this.state.passWrapOpac, {
				toValue: 1,
				duration: 100 * Spd,
				delay: 0 * Spd
				}
			)
			]).start();
		InteractionManager.runAfterInteractions(() => {
			this.refs.inputPassword.focus();
		});
	}

	onPasswordChange(event){
		this.setState({inputPassword: event.nativeEvent.text});
	}

  updateProgress() {

    setTimeout((function() {
                this.setState({ progress: this.state.progress + (0.4*LoadSpd)});
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
			]).start();
    this.state.progress = 0;
			this.updateProgress();

	}

	checkPasswordFailure(){
		this.clearText('inputPassword');

		this.setState({failureMessage: 'Invalid Password'});
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
			// this.setState({login_button_text: "Login ("+count+" attempts)"});
			// this.setState({passAttempts: count-1});
	}

	clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }

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


						<Animated.View style={[styles.image_center,{opacity: this.state.passWrapOpac}]}>


				<View style={styles.rid_center}>
					<Text style={[styles.logo_rid, styles.logo_r]}>g</Text>
					<Text style={[styles.logo_rid, styles.logo_i]}>h</Text>
					<Text style={[styles.logo_rid, styles.logo_d]}>i</Text>
					</View>
<View style={{marginTop:Dimensions.get('window').height/3,}}>
<Animated.Text style={[logStyle.warning,{opacity: this.state.passWarnOpac}]}>
	<Text style={logStyle.button}>
		{this.state.failureMessage}
	</Text>
</Animated.Text>
<TextInput
ref='inputPassword'
returnKeyType={'next'}
secureTextEntry={true}
placeholder={'Enter Password'}
placeholderTextColor={'rgba(255,255,255,0.5)'}
style={logStyle.input}
value={this.state.inputPassword}
onSubmitEditing={this.checkPassword.bind(this)}
onChange={this.onPasswordChange.bind(this)}
/>


<TouchableHighlight
style={logStyle.roundcorner}
onPress={this.checkPassword.bind(this)}

	underlayColor={'#082340'}
	activeOpacity={0.6}
>
<Text style={logStyle.button}>{this.btnText()}</Text>
</TouchableHighlight>

</View>
</Animated.View>
</ScrollView>



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
                                  warning: {
                                  top: 190,
                                  fontFamily: 'Century Gothic',
                                  color: 'rgba(255,255,255,0.8)',
                                  fontSize: 22,
                                  textAlign: 'center',
                                  height: 35,
                                  },
                                  });

var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               justifyContent: 'center',
                               alignItems: 'center',
                               backgroundColor: '#F5FCFF',
                               },
                               welcome: {
                               fontSize: 20,
                               textAlign: 'center',
                               margin: 10,
                               },
                               instructions: {
                               textAlign: 'center',
                               color: '#333333',
                               marginBottom: 5,
                               },
                               });


var logStyle = StyleSheet.create({
	wrap: {
		position: 'absolute',
		top: 245,
		height: 200,
		width: SCREEN_WIDTH,
		backgroundColor: 'transparent'
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
		textAlign:'center',
		color: 'rgba(255,255,255,1)',
		alignItems: 'center',
	},
	warning: {
		fontFamily: 'Century Gothic',
		color: 'rgba(255,255,255,0.8)',
		fontSize: 22,
		textAlign: 'center',
		height: 35,
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
	image_center: {
		alignItems: 'center',
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
		top: 380,
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


module.exports = PasswordVerification;
