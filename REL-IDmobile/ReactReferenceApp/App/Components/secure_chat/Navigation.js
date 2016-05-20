'use strict';
var ToolBar = require('../ToolBar');

var androidBackPressListener, obj;
var navigator;

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

      <ToolBar navigator={this.props.navigator} title="Chat"/>

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
