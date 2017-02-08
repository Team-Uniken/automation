/*
 *Custome TextInput component.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {View, TextInput} from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';


class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { hasFocus: false };
  }
  setFocus(newstate) {
    //Alert.alert('yes')
    this.setState({ hasFocus: newstate })
  }
  focus() {
    this.refs.textinput.focus()
  }
  render() {
    return (
      <View
        style={[
          Skin.baseline.textinput.wrap,
          this.state.hasFocus ? Skin.baseline.textinput.wrapfocus : {}, this.props.styleView, this.props.styleInputView
        ]}>
        <TextInput
          multiline={this.props.multiline}
          style = {[Skin.baseline.textinput.base, this.props.styleInput, this.props.styleInputView]}
          keyboardType={this.props.keyboardType}
          placeholder={this.props.placeholder}
          ref={'textinput'}
          returnKeyType = {"next"}
          placeholderTextColor={Skin.baseline.textinput.placeholderTextColor}
          returnKeyType={this.props.returnKeyType}
          returnKeyLabel={this.props.returnKeyLabel}
          secureTextEntry={this.props.secureTextEntry}
          selectionColor={Skin.colors.BUTTON_BG_COLOR}
          onChange={this.props.onChange}
          onSubmitEditing={this.props.onSubmitEditing}
          onFocus={() => { this.setFocus(true) } }
          onBlur={() => { this.setFocus(false) } }
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

module.exports = Input;
