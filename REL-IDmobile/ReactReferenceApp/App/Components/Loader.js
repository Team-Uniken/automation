import React, { Component } from 'react';
import ReactNative, { View,Text } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

class Loader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
    ColorProp:'rgba(79,173,216,1)',
    color:'#FFF'
      
    };
  }
  render() {
    return (

            <Spinner visible={this.props.visible}
            overlayColor={this.state.ColorProp}
            color={this.state.color}
            />

            );
  }
}
module.exports = Loader;
