'use strict';

import React, { Component } from 'react';
import Modal from 'react-native-simple-modal';
import TextField from 'react-native-md-textinput';
var Skin = require('../Skin');

import { AppRegistry, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native';

class Demo extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }
  render() {
    return (
      <View style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center'
             }}>
        <TouchableOpacity onPress={() => this.setState({
                                     open: true
                                   })}>
          <Text>
            Open modal
          </Text>
        </TouchableOpacity>
        <Modal
          style={Skin.ConnectionProfile.branchstyle}
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => this.setState({
                           open: false
                         })}>
        
      
         
        </Modal>
      </View>
      );
  }
}

module.exports = Demo;