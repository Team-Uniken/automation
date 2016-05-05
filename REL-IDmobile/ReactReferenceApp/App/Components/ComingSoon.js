'use strict';

var React = require('react-native');


var {
  View,
  Text,
  Navigator,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  StyleSheet,
  WebView
} = React;


var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var Main = require('./Main');


var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://m.facebook.com';


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
    //backgroundColor:'#dddddd',
    backgroundColor: 'transparent',
    width: 100,
    height: 20,

    flex:1,

  },
  navButtonText:{
    //textAlign: 'left',
    //fontFamily: CORE_FONT,
    color: MID_COL
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
    color: MID_COL,
    fontSize: 20,
  },
  webView: {
    backgroundColor: BGWASH,
    height: SCREEN_HEIGHT - 130,
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
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
});



class ComingSoon extends React.Component{

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

        <Text style={{padding:30,textAlign:'center',flex:1,backgroundColor:'#50accd',color:"#ffffff"}}>
          This is a Customizable Feature Slot.  Put your own web app here!
        </Text>
        
      </View>
    );
  }


};




module.exports = ComingSoon;