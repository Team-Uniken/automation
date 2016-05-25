'use strict';

var React = require('react-native');
var ToolBar = require('./ToolBar');


var {
  View,
  Text,
  Navigator,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  StyleSheet,
  Platform,
  Image,
} = React;

var SecuredWebview = require('./SecuredWebview');
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var Main = require('./Main');


var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
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
  },
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
  },
});



class Web extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      url: DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    }


    if(Platform.OS === "ios") {
      //WebView = require('react-native').WebView;
    } else if (Platform.OS === 'Android') {
      console.log('--------- loading web from Android');
      //WebView = require('../android_native_modules/native.webview');
    }

  }
  openRoute(route){
    this.props.navigator.push(route)
  }


  render() {
    return (
            <View style={[styles.container]}>
            
            <View style={styles.navbar}>
            <TouchableHighlight
            style={[styles.navButton,styles.navLeft]}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <View style={styles.navButtonText}>
            </View>
            </TouchableHighlight>
            
            <Text style={styles.navTitle}>{this.props.title}</Text>
            
            <TouchableHighlight
            style={[styles.navButton,styles.navRight]}
            onPress={()=>{
            this.props.navigator.pop();
            }}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <Text
            style={[styles.navButtonText,{textAlign: 'right',fontSize:22}]}
            >X</Text>
            </TouchableHighlight>
            </View>
            <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>
            
            <SecuredWebview
		          ref={WEBVIEW_REF}
		          automaticallyAdjustContentInsets={false}
		          style={styles.webView}
		          source={{uri: this.props.url}}
		          proxy={{host:'127.0.0.1', port:28000}}
		          javaScriptEnabledAndroid={true}
		          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
		          scalesPageToFit={true}
            />
            <View style={{borderColor:"#D0D0D0",borderStyle:'solid',borderWidth:0.5,width:SCREEN_WIDTH}}></View>
            <View style={[styles.bottomBar]}>
            <TouchableOpacity
            onPress={this.goBack.bind(this)}
            style={[styles.backForButton,this.state.backButtonEnabled ? styles.navButton : styles.disabledButton]}>
            <Text style={this.state.backButtonEnabled ? styles.buttonText : styles.disabledButtonText}>
            {'<'}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={this.goForward.bind(this)}
            style={[styles.backForButton,this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton]}>
            <Text style={this.state.forwardButtonEnabled ? styles.buttonText : styles.disabledButtonText}>
            {'>'}
            </Text>
            </TouchableOpacity>
            </View>
            
            </View>
            );
  }


  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }

  onNavigationStateChange(navState) {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  }

  onSubmitEditing(event) {
    this.pressGoButton();
  }

  pressGoButton() {
    var url = this.inputText.toLowerCase();
    if (url === this.state.url) {
      this.reload();
    } else {
      this.setState({
        url: url,
      });
    }
    // dismiss keyoard
    this.refs[TEXT_INPUT_REF].blur();
  }

};




module.exports = Web;
