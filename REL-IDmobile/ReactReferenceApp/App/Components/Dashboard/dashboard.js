/*
 * a dashboard which will navigate to flavour wise respective dashboard.
 */

/*
 ALWAYS NEED
 */
import React, {Component} from 'react';
import ReactNative from 'react-native';
import {ClientBasedConfig} from '../Utils/LocalConfig';
import Drawer from 'react-native-drawer';
import ControlPanel from './ControlPanel.js'
import Events from 'react-native-simple-events';
/*
 Required for this js
 */
import Config from 'react-native-config';
import {Text, View, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      drawerState:{
        open: false,
        disabled: false
      }
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    Events.on('toggleDrawer', 'toggleDrawerID', this.toggleDrawer);
  }

    /**
   * Toggles the drawer open and closed. Is passed down the chain to navbar.
   * @return {null}
   */
  toggleDrawer(close) {
    //console.log("$$$$$$$$$$########### In Toggle drawer"+this.state.tempVariable);
  if (close) {
    this.drawer.close();
  } else {
    console.log('in Main toggleDrawer')
    if (this.state.drawerState.open) {
      this.drawer.close();
    } else {
      this.drawer.open();
    }
  }
}

  render() {
    return (
      <Drawer
        ref={(c) => {
        console.log("Drawer = " + c);
        this.drawer = c;
      }}
        type="static"
        content={
          <ControlPanel
            toggleDrawer={this.toggleDrawer}
            registerDrawer={() => {
            
          }}
            closeDrawer={this.closeDrawer}
            navigator={this.props.navigation}/>
        } 
        acceptDoubleTap
        onOpen={() => {
        this.setState({
          drawerState: {
            open: true,
            disabled: this.state.drawerState.disabled
          }
        });
      }}
        onClose={() => {
        this.setState({
          drawerState: {
            open: false,
            disabled: this.state.drawerState.disabled
          }
        });
      }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.0}
        disabled={this.state.drawerState.disabled}
        openDrawerOffset={() => 70}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}>
        <ClientBasedConfig.dashboard.screen
          {...this.props}
          navigator={this.props.navigation}
          url={this.props.navigation.state.params.url}
          title={this.props.navigation.state.params.title}/>
      </Drawer>
    );

  }
}

module.exports = Dashboard;
