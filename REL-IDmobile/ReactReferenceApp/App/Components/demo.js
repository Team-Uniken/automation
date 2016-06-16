'use strict';

import React, { Component } from 'react';
import Modal from 'react-native-simple-modal';
import TextField from 'react-native-md-textinput';
var Skin = require('../Skin');

import {
   AppRegistry,
   Text,
   TouchableOpacity,
   View,
   TouchableHighlight,
} from 'react-native';

class Demo extends Component {
   constructor() {
      super();
      this.state = {
         open: false
      };
   }
   render() {
      return (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.setState({open: true})}>
               <Text>Open modal</Text>
            </TouchableOpacity>
            <Modal
            style={Skin.ConnectionProfile.branchstyle}
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({open: false})}
            >
              <Text style={[Skin.customeStyle.text3,{textAlign:'left',marginTop:0,marginLeft:4}]}>Device</Text>
              <TextField
              autoCorrect={false}
                label={'Enter device name'}
                labelColor={Skin.colors.HINT_COLOR}
                highlightColor={'transparent'}
                style={{height:40,textAlignVertical:'top'}}
              />
            <View style={Skin.ConnectionProfile.customerow}>
            <TouchableHighlight
            onPress={() => this.setState({open: false})}
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={{height:48,width:70,marginLeft:100}}
            >
            <Text style={[Skin.customeStyle.text1,{width:70,opacity:1}]}>CANCEL</Text>
            </TouchableHighlight>
            <TouchableHighlight
            onPress={() => this.setState({open: false})}
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={{height:48,width:70}}>
            <Text style={[Skin.customeStyle.text1,{width:70,color:'#007ECE',opacity:1}]}>OK</Text>
            </TouchableHighlight>
     </View>
            </Modal>
         </View>
      );
   }
}

module.exports = Demo;
