
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
  Text,
  TouchableHighlight,
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
    console.log('nav look');
    console.log(this);
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
          <TouchableHighlight
            activeOpacity={1.0}
            style={{
              backgroundColor:'white',
              height: 50,
              width: 50,
              alignItems:'center',
              justifyContent:'center',
              borderTopRightRadius:20,
            }}
            underlayColor={Skin.colors.DARK_PRIMARY}
            onPress={()=>this.props.navigator.push({id: "ConnectionProfile"})}>
            <View>
              <Text
                style={{
                  color:Skin.colors.DARK_PRIMARY,
                  fontSize:30,
                }}
              >{'\ue2cb'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

module.exports = UserLogin;
