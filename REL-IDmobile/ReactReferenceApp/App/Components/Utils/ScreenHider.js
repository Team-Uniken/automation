'use strict';


import React, { Component } from 'react';
import Skin from '../../Skin';
import Events from 'react-native-simple-events';
import { AppRegistry, Text, TouchableOpacity, View, TouchableHighlight,
} from 'react-native';

let responseJson;
class ScreenHider extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    if(this.props.url.chlngJson.chlng_name=='checkuser'){
    AsyncStorage.getItem("userId").then((value) => {
                                        if(value){
                                        if(value == "empty"){
                                        }else{
                                            responseJson = this.props.url.chlngJson;
                                             responseJson.chlng_resp[0].response = value;
                                            Events.trigger('showNextChallenge', { response: responseJson });
                                        }
                                        }                                        
                                        }).done();
    
    
  }
    if(this.props.url.chlngJson.chlng_name=='pass'){
    AsyncStorage.getItem("passwd").then((value) => {
                                        if(value){
                                        if(value == "empty"){
                                        }else{
                                            responseJson = this.props.url.chlngJson;
                                             responseJson.chlng_resp[0].response = value;
                                            Events.trigger('showNextChallenge', { response: responseJson });
                                        }
                                        }                                        
                                        }).done();
    
    
  }
     if(this.props.url.chlngJson.chlng_name=='devbind'){
       responseJson = this.props.url.chlngJson;
                                             responseJson.chlng_resp[0].response ='true';
                                            Events.trigger('showNextChallenge', { response: responseJson });
    
  }
     if(this.props.url.chlngJson.chlng_name=='devname'){
     responseJson = this.props.url.chlngJson;
    Events.trigger('showNextChallenge', { response: responseJson });
  }
    }

  render() {
    return (
            <View style={{ flex: 1, backgroundColor:'#f00' }}/>
      );
  }
}

module.exports = ScreenHider;