/*
 * A spinner progress component
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import {Text, View,} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

/*
 Use in this js
 */
import Skin from '../../Skin';

class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      color: Skin.load.OVERLAY_SPINNER_COLOR    //spinner color

    };
  }
  //Show spinner if visible==true.
  render() {
    return (
      <Spinner visible={ this.props.visible } color={ this.state.color } />
      );
  }
}
module.exports = Loader;
