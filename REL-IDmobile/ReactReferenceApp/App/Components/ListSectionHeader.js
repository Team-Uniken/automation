/*
  ALWAYS NEED
*/
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/

/* 
  Instantiaions
*/
import {Navigator} from 'react-native-deprecated-custom-components'

var {
	View,
	Text,
	TextInput,
	TouchableHighlight,
	StyleSheet
} = ReactNative;

const{Component}=React;


class ListSectionHeader extends Component{
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
		color: Skin.list.LIST_HEADER_COLOR,
		paddingBottom: 3,
		marginTop: 14,
		backgroundColor: Skin.main.BACKGROUND_COLOR,
	},
	rowwrap:{
		width: SCREEN_WIDTH-32,
		
	}

});
