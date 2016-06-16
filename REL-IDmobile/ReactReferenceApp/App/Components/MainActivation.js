
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
        <View style={Skin.activationStyle.container}>
        <StatusBar
        backgroundColor={Skin.colors.STATUS_BAR_COLOR}
        barStyle='light-content'/>
          <View style={Skin.activationStyle.bgbase} />
          <Image style={Skin.activationStyle.bgimage} source={require('image!bg')} />
          <View style={Skin.activationStyle.bgcolorizer} />
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
