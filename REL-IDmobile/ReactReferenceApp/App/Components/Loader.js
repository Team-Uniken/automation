import React, { View,Text } from 'react-native';
import Skin from '../Skin';

import Spinner from 'react-native-loading-spinner-overlay';

class Loader extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
    ColorProp: Skin.load.OVERLAY_BG_RGB,
    color: Skin.load.OVERLAY_SPINNER_COLOR
      
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
