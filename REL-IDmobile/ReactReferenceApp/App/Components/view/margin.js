/*
 *Custome Vertical margin component.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {View, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';

class Margin extends Component {
  render() {
    return (  
      <View style={{marginBottom:this.props.space}}/>
         );
  }
}

module.exports = Margin;