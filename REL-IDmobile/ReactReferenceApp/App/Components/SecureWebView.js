'use strict';

import React from 'react-native';
import Skin from '../Skin';

import Main from './Main';
import WebViewMenu from './WebViewMenu';


const {
  Platform,
  WebView,
  StyleSheet,
  Dimensions,
  View,
} = React;

var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';


var DEFAULT_URL = 'http://www.google.com';


let WEBVIEW_REF;
var CORE_FONT = 'Century Gothic';
var MID_COL = '#2579A2';
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var WebViewAndroid = require('../android_native_modules/nativewebview');

export default class SecureWebView extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  getWebView() {
    if (Platform.OS === 'ios') {
      return (
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webview}
          source={{ uri: 'http://www.google.com' }}
          javaScriptEnable
          domStorageEnabled
          decelerationRate="normal"
          scalesPageToFit
        />
      );
    } else {
      return (
        <WebViewAndroid
          ref={this.props.WEBVIEW_REF}
          automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
          style={styles.webview}
          source={this.props.source}
          proxy={this.props.proxy}
          javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
          scalesPageToFit={this.props.scalesPageToFit}
          onNavigationStateChange={this.props.onNavigationStateChange}
        />
      );
    }
  }

  render() {
    let { source, ...props } = { ...this.props };
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
        title: this.props.title || 'Secure Viewer',
        visible: true,
        tint: Skin.colors.TEXT_COLOR,
        left: {
          text: 'Back',
          icon: 'x',
          iconStyle: {},
          textStyle: {},
          handler: this.props.navigator.pop
        },
        }}
        bottomMenu={{
          visible: false,
          active: 3,
        }}
        navigator={this.props.navigator}
      >
        {this.getWebView()}
      </Main>
    );

      /*
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
          style={styles.webview}
          source={DEFAULT_URL}
          javaScriptEnabledAndroid={this.props.javaScriptEnabledAndroid}
          scalesPageToFit={this.props.scalesPageToFit}
          onNavigationStateChange={this.props.onNavigationStateChange}
        />
       */
  }
} 

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
    paddingTop: 30,
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
  webview: {
    flex: 1,
    backgroundColor: 'red',
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

module.exports = SecureWebView;