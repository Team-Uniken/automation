
import React from 'react';
import ReactNative from 'react-native';
import Skin from '../../Skin';
import Config from 'react-native-config';


const {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} = ReactNative;
const {Component} = React;
import NWDDashboard from './NWD/Screen_3_1_deals';

import SandPDashbord from './SandP/homepage';

import StockDashbord from './Stock/Screen_3_1_deals';

import UbsDashbord from './Ubs/homepage';


class Dashboard extends Component {
  render() {

    if (Config.ENV == 'sandp') {
      return (
        <SandPDashbord
          navigator={this.props.navigator}
                url={this.props.url}
                title={this.props.title}
                rdna={this.props.rdna}/>
      );
    } else if (Config.ENV == 'nwd') {
      return (
        <NWDDashboard
          navigator={this.props.navigator}
                url={this.props.url}
                title={this.props.title}
                rdna={this.props.rdna}/>
      );
    }else if (Config.ENV == 'stock') {
      return (
        <StockDashbord
          navigator={this.props.navigator}
                url={this.props.url}
                title={this.props.title}
                rdna={this.props.rdna}/>
      );
    }else if (Config.ENV == 'ubs') {
      return (
        <UbsDashbord
          navigator={this.props.navigator}
                url={this.props.url}
                title={this.props.title}
                rdna={this.props.rdna}/>
      );
    }


  }
}

module.exports = Dashboard;
