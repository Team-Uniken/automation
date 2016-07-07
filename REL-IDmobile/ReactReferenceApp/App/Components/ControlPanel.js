
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
var styles = Skin.loadStyle;
var Main = require('./Main');
//var Menu = require('./Menu');
var UserLogin = require('./challenges/UserLogin');
//var Web = require('./Web');
var {DeviceEventEmitter} = require('react-native');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


/*
 INSTANCES
 */
var {View, Text, Navigator, StyleSheet, TouchableHighlight, AsyncStorage, Alert, } = React;
var styles = Skin.controlStyle;
var Obj;

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  showLogOffAlert() {

    Alert.alert(
      '',
      'Do you want to log-off',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!')
        },
        {
          text: 'OK',
          onPress: () => AsyncStorage.getItem('userId').then((value) => {
            ReactRdna.logOff(value, (response) => {
              if (response) {
                console.log('immediate response is' + response[0].error);
              } else {
                console.log('immediate response is' + response[0].error);
              }
            })
          }).done()
        },
      ]
    )
  }

  doLogOff() {
    AsyncStorage.getItem('userId').then((value) => {
      ReactRdna.logOff(value, (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      })
    }).done();
  }

  componentDidMount() {
    Obj = this;
    DeviceEventEmitter.addListener('onLogOff', function(e) {
      console.log('immediate response is' + e.response);
      var responseJson = JSON.parse(e.response);
      if (responseJson.errCode == 0) {
        console.log('LogOff Successfull');
        Obj.popToLoadView();
      } else {
        alert('Failed to Log-Off with Error ' + responseJson.errCode);
      }
    });
  }

  popToLoadView() {
    this.props.navigator.replace({
      id: 'Load'
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.controlHeader}>
          UNIKEN
        </Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();
                     this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Alerts',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Alerts
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Profile & Settings',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Profile & Settings
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'ActivateNewDevice',
                       title: 'Activate New Device',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Activate New Device
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'DeviceMgmt',
                       title: 'Self Device Managment',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Device Managment
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Change Secret Question',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Change Secret Question
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Help & Support',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Help & Support
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'SecureWebView',
                       title: 'Secure Portal',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                       url: 'http://apisdkdev.uniken.com/demoapp/relid.php'
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Secure Portal
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'WebView',
                       title: 'Open Portal',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                       url: 'http://apisdkdev.uniken.com/demoapp/relid.html'
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Open Portal
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Send App Feedback',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Send App Feedback
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={() => {
                     this.props.toggleDrawer();this.props.navigator.push({
                       id: 'ComingSoon',
                       title: 'Legal Info',
                       sceneConfig: Navigator.SceneConfigs.PushFromRight,
                     });
                   }}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Legal Info
          </Text>
        </TouchableHighlight>
        <View style={styles.menuBorder}></View>
        <Text style={styles.menuItem}></Text>
        <View style={styles.menuBorder}></View>
        <TouchableHighlight
          onPress={this.showLogOffAlert.bind(this)}
          style={styles.touch}>
          <Text style={styles.menuItem}>
            Logout
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}
;

module.exports = ControlPanel