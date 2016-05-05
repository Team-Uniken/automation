/*
    CSS classes which are common to all screens will be defined over here.
*/
'use strict';

var React = require('react-native');

var {StyleSheet} = React;

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

var leftrid = 23;
var styles = StyleSheet.create({
	container: {
		flex: 1,
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
// ======================================================================================
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
	button: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'transparent',
		height: 55,
		fontSize: 22,
		marginTop: 13,
		color: MIDBLUE,
	},
	buttonWrap: {
		top: 15,
		width: 280,
		left: ((SCREEN_WIDTH - 280) / 2),
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
		alignItems: 'center',
		left: ((SCREEN_WIDTH - 280) / 2),
	},
	warning: {
		fontFamily: 'Century Gothic',
		color: 'rgba(255,255,255,0.8)',
		fontSize: 22,
		textAlign: 'center',
		height: 35,
	}
});


module.exports = {
  styles : styles,
  logStyle : logStyle,
  progStyle : progStyle
}
