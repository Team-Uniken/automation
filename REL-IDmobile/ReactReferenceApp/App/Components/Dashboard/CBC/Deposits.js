'use strict';
/*
  NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image } from 'react-native'

import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';




export default class DepositsScene extends Component {

  render () {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: false,
        }}
        navBar={{
          title: 'Deposits',
          visible: true,
          tint: Skin.main.NAVBAR_TINT,
          left:{
            text: '',
            icon: '\ue20e',
            iconStyle: {
              fontSize: 30,
              marginLeft: 8,
            },
            textStyle: {},
          },
        }}
        bottomMenu={{
          visible: true,
          active: 3,
        }}
        navigator={this.props.navigator}
      >
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
