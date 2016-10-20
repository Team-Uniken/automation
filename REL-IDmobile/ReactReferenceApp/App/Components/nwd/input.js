
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {
  TextInput
} = ReactNative;
const{Component} =  React;

class Button extends Component {
  render() {
    return (  
 <TextInput
                returnKeyType={'next'}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                placeholder={this.props.placeholder}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={[Skin.nwd.textinput,{marginBottom:this.props.marginBottom}]}
                />
            );
  }
}

module.exports = Button;