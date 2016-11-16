
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';

const {View, TextInput, Alert} = ReactNative;
const {Component} = React;

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { hasFocus: false };
  }
  setFocus(newstate) {
    //Alert.alert('yes')
    this.setState({ hasFocus: newstate })
  }
  focus(){
    this.refs.textinput.focus()
  }
  render() {
    return (
      <View
          style={[
            Skin.baseline.textinput.wrap,
              this.state.hasFocus ? Skin.baseline.textinput.wrapfocus : {}, this.props.styleView
          ]}>
          <TextInput 
           style = {[Skin.baseline.textinput.base,this.props.styleInput]}
           keyboardType={this.props.keyboardType}
           placeholder={this.props.placeholder}
           ref={'textinput'}
           returnKeyType = {"next"}
           placeholderTextColor={Skin.baseline.textinput.placeholderTextColor} 
           returnKeyType={this.props.returnKeyType}
           returnKeyLabel={this.props.returnKeyLabel}
           secureTextEntry={this.props.secureTextEntry}
           selectionColor={Skin.colors.BUTTON_BG_COLOR}
           autoFocus = {this.props.autoFocus}
           onChange={this.props.onChange}
           onSubmitEditing={this.props.onSubmitEditing}
           onFocus={()=>{this.setFocus(true)}}
           onBlur={()=>{this.setFocus(false)}}
           autoComplete={this.props.autoComplete}
           autoFocus={this.props.autoFocus}
           autoCorrect={this.props.autoCorrect}
           autoCapitalize={this.props.autoCapitalize}
           keyboardAppearance={'light'}
           value={this.props.value}
           enablesReturnKeyAutomatically={this.props.enablesReturnKeyAutomatically}
           />
         </View>
      );
  }
}

module.exports = Button;
/*
<View 
        //ref={this.props.ref}
        style={this.state.hasFocus ?
             { backgroundColor: '#00ffaa' } : { backgroundColor: '#0000aa' }}>
        <TextInput
          //autoCorrect={false}
          //autoCapitalize={'none'}
          keyboardType={this.props.keyboardType}
          placeholder={this.props.placeholder}
          placeholderTextColor={Skin.baseline.textinput.placeholderTextColor} 
          returnKeyType={this.props.returnKeyType}
          secureTextEntry={this.props.secureTextEntry}
          //onChange={this.props.onChange}
          //onFocus={()=>{this.setFocus(true)}}
          //onBlur={this.setFocus(false).bind(this)}
          />
      </View>
*/
