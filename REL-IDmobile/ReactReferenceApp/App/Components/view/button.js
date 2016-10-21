
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} = ReactNative;
const{Component} =  React;

class Button extends Component {
  render() {
    return (  
<TouchableOpacity
                style={Skin.nwd.button}
                underlayColor={'#082340'}
                activeOpacity={0.8}
                  onPress={this.props.onPress}
                >
                <Text style={Skin.nwd.buttontext}>
                 {this.props.lable}
                </Text>
                </TouchableOpacity>
            );
  }
}

module.exports = Button;