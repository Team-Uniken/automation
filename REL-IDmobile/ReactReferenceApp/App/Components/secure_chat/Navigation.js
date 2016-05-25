'use strict';
var ToolBar = require('../ToolBar');

var androidBackPressListener, obj;
var navigator;

var Dimensions = require('Dimensions');
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var Dimensions = require('Dimensions');
var TEXT_COLOR = '#FFFFFF';
var MIDBLUE = '#2579A2';

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

import React, {
  Navigator,
  Component,
  StatusBar,
  Platform,
  BackAndroid,
} from 'react-native';



var {
	View,
	Text,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	StyleSheet,
Dimensions,
} = React;

import ExNavigator from '@exponent/react-native-navigator';


var styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: 'rgba(8,26,60,0.9)'

	},
  toolbarrow: {
            flexDirection:'row',
            backgroundColor: '#fff',
            width:Dimensions.get('window').width,
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
});


let Router = {
  GiftedMessenger() {
    return {
      getSceneClass() {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('light-content');
        }
        return require('./GiftedMessengerContainer');
      },
      getTitle() {
        return 'Gifted Messenger';
      },
    };
  },
};

class Navigation extends Component {

componentDidMount() {
    console.log('------ Navigation componentDidMount');
    obj = this;
    navigator = this.props.navigator;
}

  render() {
    return (
      <View style={styles.container}>

            <View style={styles.navbar}>
            <TouchableHighlight
            style={[styles.navButton,styles.navLeft]}
            underlayColor={'#FFFFFF'}
            activeOpacity={0.6}
            >
            <View style={styles.navButtonText}>
            </View>
            </TouchableHighlight>
            
            <Text style={styles.navTitle}>Chat</Text>
            
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

       <View style={{backgroundColor:'#2579a2', height:1}}>
       </View>
      <ExNavigator
        initialRoute={Router.GiftedMessenger()}
        style={{flex: 1}}
        showNavigationBar={false}
        navigationBarStyle={{
          backgroundColor: '#007aff',
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: '#ffffff',
        }}
      />
      </View>
    );
  }
}

module.exports = Navigation;
