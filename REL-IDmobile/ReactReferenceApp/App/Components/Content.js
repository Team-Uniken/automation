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
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

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



class Content extends React.Component{

	/*
	 * Create an Accounts List
	 * @param {string} username - username being passed
	 * @param {bool} isLoading - 
	 * @param {bool} error - 
	 */
	constructor(props){
		super(props);
		this.state = {
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor:'white'}}>
	            
			</View>
		);
	}

};

module.exports = Content;

