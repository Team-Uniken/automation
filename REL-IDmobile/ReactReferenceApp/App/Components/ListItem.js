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
} = React;


class ListItem extends React.Component{
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
		padding: 10,
		width:SCREEN_WIDTH*4/5,
		marginBottom:2
	}

});