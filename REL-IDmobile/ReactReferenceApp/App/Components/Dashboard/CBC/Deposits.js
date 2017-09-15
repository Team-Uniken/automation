'use strict';
/*
  NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image } from 'react-native'

import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';

import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';
import PageTitle from '../../view/pagetitle.js';
import Events from 'react-native-simple-events';


export default class DepositsScene extends Component {

  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }
  
  render () {
    return (
            <Main
            controlPanel={ControlPanel}
            drawerState={this.props.drawerState}
            navigator={this.props.navigation}
            defaultNav={false}
            bottomMenu={{
            visible: true,
            active: 3,
            }}>
            
            <PageTitle title={'Deposits'}
            handler={this.triggerDrawer}/>
        <View
          style={{
            flex:1,
            backgroundColor: Skin.colors.TEXT_COLOR,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        
          <Text
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              //backgroundColor: 'red',
              fontSize: 30,
              color: Skin.PLACEHOLDER_TEXT_COLOR_RGB,
              fontWeight: 'bold',
              alignItems: 'center',
            }}
          >
            Photo Deposit Feature Coming Soon!
          </Text>
        </View>
       
      </Main>
    );
  }
}

module.exports = DepositsScene;
