/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Main = require('../Components/Main');
var BottomMenu = require('../Components/BottomMenu');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');
//var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;
var ListItem = require('../Components/ListItem');
import Communications from 'react-native-communications';

/* 
  Instantiaions
*/

var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	ActivityIndicatorIOS,
	StyleSheet
} = React;


class ContactScene extends React.Component{
	constructor(props){
		super(props);
		this._handleClick = this._handleClick.bind(this)
	}
	render() {
		return (
			<Main 
				drawerState={{
					open: false, 
					disabled: false
				}}
				navBar={{
                    title: 'Contact',
                    visible: true,
                    tint: Skin.colors.TEXT_COLOR,
                    left:{
                        text: '',
                        icon: '\ue20e',
                        iconStyle: {
                            fontSize:30,
                            marginLeft:8,
                        },
                        textStyle:{},
                    }
                }}
      			bottomMenu={{
        			visible: true,
        			active: 5,
      			}}
      			navigator={this.props.navigator}
			>	
				<View 
					style={{
						flex:1,
						backgroundColor:Skin.colors.BACK_GRAY,
						flexDirection:'column',
						alignItems:'center',
						justifyContent:'space-around',
						padding:25
					}}
				>
					<TouchableOpacity 
						onPress={() => Communications.email(['info@uniken.com'],null,null,'I\'m interested in REL-IDmobile!',
							'Hello, <br> I\'m interested in REL-IDmobile.  Please send me more details! <br><br> Sincerely,<br>--{Put your name}')}
						style={[styles.buttonwrap,{backgroundColor:Skin.colors.POSITIVE_ACCENT}]}
					>
						<View style={styles.titlewrap}>
							<Text style={styles.title}>Email us</Text>
						</View>
						<View style={styles.iconwrap}>
							<Text style={[styles.icon,{color:Skin.colors.POSITIVE_ACCENT}]}>{'\ue04c'}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity 
						onPress={() => Communications.phonecall('+15047157230', true)}
						style={[styles.buttonwrap,{backgroundColor:Skin.colors.ACCENT}]}
					>
						<View style={styles.titlewrap}>
							<Text style={styles.title}>Call us</Text>
						</View>
						<View style={styles.iconwrap}>
							<Text style={[styles.icon,{color:Skin.colors.ACCENT}]}>{'\ue03f'}</Text>
						</View>
					</TouchableOpacity>	
					<TouchableOpacity 
						onPress={() => this._handleClick({id:'Appointments'})}
						style={[styles.buttonwrap,{backgroundColor:Skin.colors.DARK_PRIMARY}]}
					>	
						<View style={styles.titlewrap}>
							<Text style={styles.title}>Make Appointment</Text>
						</View>
						<View style={styles.iconwrap}>
							<Text style={[styles.icon,{color:Skin.colors.DARK_PRIMARY}]}>{'\ue21a'}</Text>
						</View>
					</TouchableOpacity>						
				</View>
			</Main>
		);
	}
	_handleClick(route) {
		//console.log(this);
		//console.log(i);
		//console.log({id:this.props.list[i].link});
  		var routeStack = this.props.navigator.state.routeStack;
  		routeStack.push(route);
  		this.props.navigator.immediatelyResetRouteStack(routeStack);
    	//this.props.navigator.push({id:this.props.list[i].link});
  	}
}

module.exports = ContactScene;


var styles = StyleSheet.create({
	buttonwrap:{
		flex:1,
		width:SCREEN_WIDTH*4/5,
		margin:25,
		flexDirection:'row'
	},
	titlewrap:{
		flex:1.6,
		justifyContent:'center',
		padding:20
	},
	title:{
		color:Skin.colors.TEXT_COLOR,
		fontSize:25,
		fontWeight:'bold'
	},
	iconwrap:{
		flex:1,
		backgroundColor:'rgba(255,255,255,0.54)',
		justifyContent:'center',
	},
	icon:{
		textAlign:'center',
		fontFamily: Skin.font.ICON_FONT,
		fontSize:40
	}
});