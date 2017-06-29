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

class Dashboard extends Component {
  render() {
    
    if (Config.ENV == 'nwd') {
      return (
        <NWDDashboard
        navigator={this.props.navigator}
        url={this.props.url}
        title={this.props.title}
        rdna={this.props.rdna}/>
        );
    }
  }
}

module.exports = Dashboard;
