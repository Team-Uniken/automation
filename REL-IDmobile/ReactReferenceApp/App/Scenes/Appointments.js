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

/* 
  Instantiaions
*/
var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet
} = React;


class AppointmentsScene extends React.Component{
	constructor(props){
		super(props);
		this.state={
			pop: ()=>{
				console.log(this);
				this.props.navigator.pop();
			}
		}
	}
	render() {
		console.log(this.props);
		return (
			<Main 
				drawerState={{
					open: false, 
					disabled: false
				}}
				navBar={{
        			title: 'Appointments',
        			visible: true,
        			tint: Skin.colors.TEXT_COLOR,
        			left:{
        				text: 'Back',
        				icon: 'x',
        				iconStyle: {},
        				textStyle:{},
        			},
        			right:{
        				text: '',
        				icon: '',
        				iconStyle: {},
        				textStyle:{},
        				handler:()=>{return('')},
        			}
        		}}
      			bottomMenu={{
        			visible: true,
        			active: 5,
      			}}
      			navigator={this.props.navigator} 
			>	
				<View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY}}>
					<Text>This is my Accounts content</Text>
				</View>
			</Main>
		);
	}
}

module.exports = AppointmentsScene;