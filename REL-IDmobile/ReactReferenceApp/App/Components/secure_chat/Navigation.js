'use strict';

var androidBackPressListener, obj;
var navigator;

import React, {
  Navigator,
  Component,
  StatusBar,
  Platform,
  BackAndroid,
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';



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
      <ExNavigator
        initialRoute={Router.GiftedMessenger()}
        style={{flex: 1}}
        sceneStyle={{paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight}}
        showNavigationBar={true}
        navigationBarStyle={{
          backgroundColor: '#007aff',
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: '#ffffff',
        }}
      />
    );
  }
}

module.exports = Navigation;