/*
 * a dashboard which will navigate to flavour wise respective dashboard.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Config from 'react-native-config';
import {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native';

/*
 Use in this js
 */
import NWDDashboard from './NWD/Deals';
import SandPDashbord from './SandP/homepage';
import StockDashbord from './Stock/Deals';
import UbsDashbord from './Ubs/homepage';
import CBCDashbord from './CBC/Accounts';
import RELIDMobileDashbord from './REL-IDMobile/Deals';


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
    }else if (Config.ENV == 'cbc') {
      return (
              <CBCDashbord
              navigator={this.props.navigator}
              url={this.props.url}
              title={this.props.title}
              rdna={this.props.rdna}/>
              );
    }else if (Config.ENV == 'relidmobile') {
      return (
              <RELIDMobileDashbord
              navigator={this.props.navigator}
              url={this.props.url}
              title={this.props.title}
              rdna={this.props.rdna}/>
              );
    }



  }
}

module.exports = Dashboard;
