/*
  ALWAYS NEED
*/
'use strict';

var ReactNative = require('react-native');
var React = require('react');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/

/* 
  Instantiaions
*/
var {
	View,
	Text,
	Navigator,
	TextInput,
	TouchableHighlight,
	StyleSheet
} = ReactNative;


const{Component}=React;

class ListItem extends Component{
	constructor(props){
		super(props);
	}
	render() {
		return (
			<View style={styles.wrap}>
				<View style={styles.rowwrap}>{this.props.children}</View>
			</View>
		);
	}
}

module.exports = ListItem;

var styles = StyleSheet.create({
	wrap:{
		flex:1,
		alignItems: 'center'
	},
	rowwrap:{
		backgroundColor: Skin.colors.TEXT_COLOR,
		padding: 8,
		width: (SCREEN_WIDTH > 350) ? SCREEN_WIDTH*4/5 : SCREEN_WIDTH-32,
		marginBottom:2
	}

});
