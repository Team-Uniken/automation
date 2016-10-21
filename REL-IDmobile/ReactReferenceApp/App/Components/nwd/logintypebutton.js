
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {
  Text,
  View,
  TouchableOpacity,
} = ReactNative;
const{Component} =  React;

class LoginTypeButton extends Component {
  render() {
    return (  
<View style={Skin.nwd.col}> 
        <TouchableOpacity
                style={Skin.nwd.regtypebutton}
                underlayColor={'#082340'}
                onPress={this.props.onPress}
                activeOpacity={0.8}
                >
                <Text style={Skin.nwd.regtypebuttontext}>
                {this.props.lable}
                </Text>
                </TouchableOpacity>
                <Text style={Skin.nwd.regtype}>{this.props.text}</Text>
       </View>
            );
  }
}

module.exports = LoginTypeButton;