
/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('./Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var styles = Skin.loadStyle;
var Main = require('./Main');
var Menu = require('./Menu');
var UserLogin = require('./challenges/UserLogin');
//var Web = require('./Web');
var {DeviceEventEmitter} = require('react-native');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


/* 
  INSTANCES
*/
var {
  View,
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
} = React;
var styles = Skin.controlStyle;




class ControlPanel extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.controlHeader}>UNIKEN</Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Alerts"});}} style={styles.touch}><Text style={styles.menuItem}>Alerts</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Profile & Settings"});}} style={styles.touch}><Text style={styles.menuItem}>Profile & Settings</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Activate New Device"});}}  style={styles.touch}><Text style={styles.menuItem}>Activate New Device</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Change Secret Question"});}}  style={styles.touch}><Text style={styles.menuItem}>Change Secret Question</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Help & Support"});}}  style={styles.touch}><Text style={styles.menuItem}>Help & Support</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Contact Us"});}}  style={styles.touch}><Text style={styles.menuItem}>Contact Us</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Send App Feedback"});}}  style={styles.touch}><Text style={styles.menuItem}>Send App Feedback</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "ComingSoon", title:"Legal Info"});}}  style={styles.touch}><Text style={styles.menuItem}>Legal Info</Text>
        </TouchableHighlight><View style={styles.menuBorder}></View>
        <Text style={styles.menuItem}>   </Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight onPress={()=>{this.props.toggle();this.props.navigator.push({id: "Load"});}}  style={styles.touch}><Text style={styles.menuItem}>Logout</Text>
        </TouchableHighlight>
      </View>
    )
  }
};

module.exports = ControlPanel