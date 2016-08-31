import React, { View,Text } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

class Loader extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
    ColorProp:'rgba(255,255,255,1)',
    color:'#4fadd8'
      
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
