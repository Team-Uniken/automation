/*
    CSS classes which are common to all screens will be defined over here.
*/

//ALWAYS NEED
'use strict';

var React = require('react-native');
//var Skin = require('./MainStyleSheet');
//var styles = Skin.styles;
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

//Called
var {
	StyleSheet,
	Dimensions,
	PixelRatio,
} = React;



//Colors
var DARK_PRIMARY = '#3B8BB3';
var PRIMARY = '#4FADD8';
var LIGHT_PRIMARY = '#BCE0F2';
var TEXT_COLOR = '#FFFFFF';
var ACCENT = '#f18F01';
var PRIMARY_TEXT = '#212121';
var SECONDARY_TEXT = '#727272';
var DIVIDER_COLOR = '#b6b6b6';
var NAV_BAR_TINT = '#FFFFFF'
var MENU_TXT_COLOR = '#2579A2';
var ICON_COLOR = '#FFFFFF';

//Fonts
var CORE_FONT = 'Century Gothic';
var ICON_FAMILY = 'icomoon';
var NAV_SHADOW_BOOL = true;

//Speeds
var SPEED = 0; //0.8
var LOADSPEED = 0; //0.3


var colors = {
	DARK_PRIMARY : '#3B8BB3',
	PRIMARY : '#4FADD8',
	LIGHT_PRIMARY : '#BCE0F2',
	TEXT_COLOR : '#FFFFFF',
	ACCENT : '#f18F01',
	PRIMARY_TEXT : '#212121',
	SECONDARY_TEXT : '#727272',
	DIVIDER_COLOR : '#b6b6b6',
	NAV_BAR_TINT : '#FFFFFF',
	MENU_TXT_COLOR : '#2579A2',
	ICON_COLOR : '#FFFFFF',
}



//Positions
var leftrid = 23;
var coreStyle = StyleSheet.create({
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
		color: LIGHT_PRIMARY,
		//backgroundColor: 'rgba(70,0,0,0.5)',

	},
	logo_r: {
		position: 'absolute',
		fontSize: 120,
		width: 160,
		marginLeft: leftrid,
		color: TEXT_COLOR,
		//backgroundColor: 'rgba(70,0,0,0.5)',
	},
	logo_d: {
		position: 'absolute',
		fontSize: 120,
		width: 160,
		marginLeft: 62 + leftrid,
		color: DARK_PRIMARY,
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
		color: TEXT_COLOR,
		backgroundColor: 'transparent',
		//backgroundColor: 'rgba(0,100,0,0.5)',
	},
	load_text_wrap: {
		top: 450,
		alignItems: 'center',
	},
	load_text: {
		color: TEXT_COLOR,
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
		top: SCREEN_HEIGHT/4,
		height: SCREEN_HEIGHT/
		width: SCREEN_WIDTH,
		backgroundColor: 'transparent'
	},
	input_wrap:{
		height: SCREEN_WIDTH/8,
		width: SCREEN_WIDTH/8*6,
		left: SCREEN_WIDTH/8,
		backgroundColor: 'red',
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	preicon:{
		fontFamily: 'Century Gothic',
		fontSize: 22,
		height: SCREEN_WIDTH/8,
		color: TEXT_COLOR,
		textAlign: 'center'
	},
	input: {
		fontFamily: 'Century Gothic',
		height: SCREEN_WIDTH/8,
		fontSize: 22,
		color: 'rgba(255,255,255,1)',
	},
	button: {
		fontFamily: 'Century Gothic',
		backgroundColor: 'transparent',
		height: 55,
		fontSize: 22,
		marginTop: 13,
		color: DARK_PRIMARY,
	},
	buttonWrap: {
		top: 15,
		width: 280,
		left: ((SCREEN_WIDTH - 280) / 2),
		backgroundColor: 'rgba(255,255,255,1)',
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

var loadStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    setfooter: {
        flex: 1,
        alignItems: 'center',
        height: Dimensions.get('window').height - 40
    },
    footerrow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        bottom: 0,
        height: 32
    },
    bgimage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    bgcolorizer: {
        position: 'absolute',
        top: 20,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: PRIMARY,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
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
        color: LIGHT_PRIMARY,
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
        color: DARK_PRIMARY,
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


var transforms = {
	FromTheRight: {
	    opacity: {
	        value: 1.0,
	        type: 'constant',
	    },
	    transformTranslate: {
	        from: { x: Dimensions.get('window').width, y: 0, z: 0 },
	        to: { x: 0, y: 0, z: 0 },
	        min: 0,
	        max: 1,
	        type: 'linear',
	        extrapolate: true,
	        round: PixelRatio.get(),
	    },
	    translateX: {
	        from: Dimensions.get('window').width,
	        to: 0,
	        min: 0,
	        max: 1,
	        type: 'linear',
	        extrapolate: true,
	        round: PixelRatio.get(),
	    },
	    scaleX: {
	        value: 1,
	        type: 'constant',
	    },
	    scaleY: {
	        value: 1,
	        type: 'constant',
	    },
	},
	ToTheLeft: {
	    transformTranslate: {
	        from: { x: 0, y: 0, z: 0 },
	        to: { x: -Dimensions.get('window').width, y: 0, z: 0 },
	        min: 0,
	        max: 1,
	        type: 'linear',
	        extrapolate: true,
	        round: PixelRatio.get(),
	    },
	    opacity: {
	        value: 1.0,
	        type: 'constant',
	    },

	    translateX: {
	        from: 0,
	        to: -Dimensions.get('window').width,
	        min: 0,
	        max: 1,
	        type: 'linear',
	        extrapolate: true,
	        round: PixelRatio.get(),
	    }
	}
};


var controlStyle = StyleSheet.create({
  container:{
    backgroundColor: '#1c1c1c',
    flex: 1,
    //color: '#ffffff',
  },
  shadow:{
    width: 300,
    height: 300,
    shadowOffset:{width: 10, height: 10}
  },
  menuItem:{
    color: '#ffffff',
    fontFamily: 'Century Gothic',
    paddingTop: 15,
    paddingBottom: 15,
  },
  menuBorder:{
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#222222',
    marginLeft:20,
  },
  touch:{
    paddingLeft: 20
  },
  controlHeader:{
    color: '#ffffff',
    fontFamily: 'Century Gothic',
    paddingTop: 30,
    fontSize: 30,
    paddingBottom: 50,
    width: SCREEN_WIDTH-90,
    textAlign: 'center',
  }
});

var statusBarStyle = StyleSheet.create({
	default:{
		backgroundColor: DARK_PRIMARY,
		height: 20,
		width: SCREEN_WIDTH
	}
});


module.exports = {
  coreStyle : coreStyle,
  logStyle : logStyle,
  progStyle : progStyle,
  loadStyle : loadStyle,
  transforms : transforms,
  spd : SPEED,
  loadspd: LOADSPEED,
  controlStyle: controlStyle,
  colors: colors,
  statusBarStyle: statusBarStyle
}
