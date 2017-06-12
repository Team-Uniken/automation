import {Navigator} from 'react-native-deprecated-custom-components'
import ReactNative, {
	View,
	Text,
	TextInput,
	TouchableHighlight,
	StyleSheet
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import Skin from '../Skin';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;


class ListItem extends Component{
	constructor(props){
		super(props);
	}
	render() {
		return (
			<View style={this.props.wrapstyle}>
				<View style={this.props.rowstyle}>{this.props.children}</View>
			</View>
		);
	}
}

ListItem.propTypes = {
  wrapstyle: PropTypes.object,
  rowstyle: PropTypes.object,
}

ListItem.defaultProps={
	wrapstyle:{
		flex:1,
		alignItems: 'center'
	},
	rowstyle:{
		backgroundColor: Skin.colors.TEXT_COLOR,
		paddingTop: 5,
        paddingBottom: 5,
		width: SCREEN_WIDTH-32,
		marginBottom:0,
	}
}
  
module.exports = ListItem;

