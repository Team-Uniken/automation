'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
} = ReactNative;
  
var html = '<!DOCTYPE html><html><body><h1>This is a heading!</body></html>';

var SampleApp = React.createClass({
  render: function() {
    return (
  	  <View style={styles.container}>
        <WebView html={html}/>        
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
   
  }
});

AppRegistry.registerComponent('SampleApp', () => SampleApp);

module.exports = SampleApp;
