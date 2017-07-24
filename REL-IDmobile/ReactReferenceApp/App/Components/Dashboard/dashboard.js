/*
 * a dashboard which will navigate to flavour wise respective dashboard.
 */

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';
import {ClientBasedConfig} from '../Utils/LocalConfig';

/*
 Required for this js
 */
import Config from 'react-native-config';
import {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native';


class Dashboard extends Component {
  render() {
      return (
        <ClientBasedConfig.dashboard.screen
          navigator={this.props.navigator}
                url={this.props.url}
                title={this.props.title}
                rdna={this.props.rdna}
              dashboardScreenName={ClientBasedConfig.dashboard.screenName}  />
      );
    
  }
}

module.exports = Dashboard;
