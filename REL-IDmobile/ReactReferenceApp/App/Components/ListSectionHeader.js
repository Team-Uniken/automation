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


class ListSectionHeader extends React.Component{
	constructor(props){
		super(props);
	}
	render() {
		return (
			<View style={styles.wrap}>
				<View style={styles.rowwrap}>
					<Text style={styles.text}>{this.props.children}</Text>
				</View>
			</View>
		);
	}
}

module.exports = ListSectionHeader;

var styles = StyleSheet.create({
	wrap:{
		flex:1,
		alignItems:'center',
	},
	text:{
		color: 'rgba('+Skin.colors.PRIMARY_TEXT_RGB+',0.46)',
		paddingBottom: 5,
		paddingTop: 10,
		backgroundColor: Skin.colors.BACK_GRAY,
	},
	rowwrap:{
		width: SCREEN_WIDTH*4/5,
		
	}

});