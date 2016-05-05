'use strict';

var React = require('react-native');

var {
  Platform,
  WebView,
  StyleSheet,
  Dimensions,
  View,
  Text,
} = React;

var WEBVIEW_REF = 'webview';

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var Main = require('./Main');


var TEXT_INPUT_REF = 'urlInput';
var DEFAULT_URL = 'http://www.google.com';


var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var MID_COL = '#2579A2';
var LIGHT_COL = '#50ADDC';
var DARK_COL = '#10253F';
var Spd = 0.1;
var LoadSpd = 0.2;
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var WebViewAndroid = require('../android_native_modules/nativewebview');

var SecuredWebview = React.createClass({

 render: function() {
	
	let {source, ...props} = {...this.props};

 	if(Platform.OS === "ios") {
 		return (
 			<View style={styles.container}>
	 			<WebView
	 				  ref={this.props.WEBVIEW_REF}
	          		automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
	          		style={styles.webView}
	          		source={this.props.source}
	          		javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
	          		scalesPageToFit={this.props.scalesPageToFit}
	          		onNavigationStateChange={this.props.onNavigationStateChange}
	 			/>
 			</View>
 			);
    } else if (Platform.OS === 'android') {
     	return (
     		<View>
	     		<WebViewAndroid
	          		ref={this.props.WEBVIEW_REF}
	          		automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
	          		style={styles.webView}
	          		source={this.props.source}
	          		proxy={this.props.proxy}
	          		javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
	          		scalesPageToFit={this.props.scalesPageToFit}
	          		onNavigationStateChange={this.props.onNavigationStateChange}
	        	/>
 			</View>
     		);
    }
    return (null);
	}
});	

var styles = StyleSheet.create({
  container:{
    flexDirection: 'column',
    flex:1,
  },
  bar:{
    backgroundColor: MID_COL,
    width: 20,
    height:3,
    marginTop:3,
  },
  navbar:{
    backgroundColor: '#ffffff',
    height: 65,
    flexDirection: 'row',
    padding: 10,
    paddingTop:30
  },
  navButton:{
    //backgroundColor:'#D43B43',
    backgroundColor: 'transparent',
//    width: 100,
//    height: 20,
  },
  navButtonText:{
    //textAlign: 'left',
    //fontFamily: CORE_FONT,
    // color: MID_COL,
    // paddingRight:10
  },
  navButtonIcon:{
    fontFamily: CORE_FONT,
  },
  navRight:{
    //textAlign: 'right'
   // right: 0,
   // position: 'absolute'
  },
  navLeft:{
    //left: 0,
   // position: 'absolute',
    //flex:1
  },
  navTitle:{
    flex:2,
    fontFamily: CORE_FONT,
    textAlign: 'center',
    // color: MID_COL,
    fontSize: 20,
  },
  webView: {
    backgroundColor: BGWASH,
    height: SCREEN_HEIGHT - 110,
  },
  disabledButton: {

  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
  bottomBar:{
    height:53,
    padding: 5,
    width: SCREEN_WIDTH,
    backgroundColor: '#ffffff',
    flexDirection: 'row'
  },
  backForButton:{
    width:50,
    //backgroundColor: '#adefac',
    //padding: 3,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  buttonText:{
    // color: MID_COL,
    fontSize: 25,
  },
  disabledButtonText:{
    color: '#D0D0D0',
    fontSize: 25,
  }
});

module.exports = SecuredWebview;