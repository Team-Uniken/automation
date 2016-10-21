
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
                autoCorrect={false}
                autoCapitalize={'none'}
                 keyboardType={this.props.keyboardType}
                placeholder={this.props.placeholder}
                placeholderTextColor={'rgba(171,171,171,1)'}
                style={[Skin.nwd.textinput,{marginBottom:this.props.marginBottom}]}
                ref={this.props.ref}
                returnKeyType = {this.props.returnKeyType}
                secureTextEntry = {this.props.secureTextEntry}
                 onChange={this.props.onChange}
                 onSubmitEditing={ this.props.onSubmitEditing}
                />
            );
  }
}

module.exports = Button;
