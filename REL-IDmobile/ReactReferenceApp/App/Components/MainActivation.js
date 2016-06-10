
/*
  ALWAYS NEED
*/
'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import dismissKeyboard from 'dismissKeyboard';

/* 
  INSTANCES
*/
const {
  StatusBar,
  View,
  Image,
  TouchableWithoutFeedback,

} = React;





class UserLogin extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }

  dismiss() {
        dismissKeyboard();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.dismiss}>
        <View style={Skin.coreStyle.container}>
          <View style={Skin.loadStyle.bgbase} />
          <Image style={Skin.loadStyle.bgimage} source={require('image!bg')} />
          <View style={Skin.statusBarStyle.default}>
            <StatusBar
              barStyle="light-content"
            />
          </View>
          <View style={Skin.loadStyle.bgcolorizer} />
          <View style={Skin.activationStyle.centering_wrap}>
            <View style={Skin.activationStyle.wrap}>
              {this.props.children}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

module.exports = UserLogin;

