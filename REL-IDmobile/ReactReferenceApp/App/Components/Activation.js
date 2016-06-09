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
var Main = require('./Main');
//import Main as default from '../../Components/Main';
//var BottomMenu = require('../BottomMenu');
//var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
//var NavigationBar = require('react-native-navbar');
//var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

/* 
  Instantiaions
*/
var {
  View,
  Text,
  Navigator,
  //TextInput,
  //TouchableHighlight,
  //ActivityIndicatorIOS,
  //StyleSheet
} = React;


export default class ActivationScene extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Main>
        <View style={{flex:1,backgroundColor:Skin.colors.BACK_GRAY}}>
          <Text>This is my Deposits content</Text>
        </View>
      </Main>
    );
  }
}

module.exports = ActivationScene;