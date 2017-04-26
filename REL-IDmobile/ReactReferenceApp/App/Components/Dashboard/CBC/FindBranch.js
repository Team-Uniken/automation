'use strict';
/*
    NEED
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image,MapView } from 'react-native'
import Main from '../../Container/Main';

import Skin from '../../../Skin';

import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';
import Events from 'react-native-simple-events';


class FindBranchScene extends Component{

    constructor(props){
        super(props);
        this.state={
            pop: ()=>{
                console.log(this);
                this.props.navigator.pop();
            },
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            lat:'',
            lon:'',
        }
    }

    componentDidMount() {
        console.log('in did mount')
        console.log(navigator);
        navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position)
              var initialPosition = JSON.stringify(position);
              this.setState({initialPosition});
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
              this.setState({
                pop:this.state.pop,
                initialPosition:this.state.initialPosition,
                lastPosition:this.state.lastPosition,
                lat:position.coords.latitude,
                lon:position.coords.longitude,
              });

              fetch(
                  'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lon+'&radius=5000&query=ATMs&key=AIzaSyDibnF5vLSMkxIsOWP41lqXNNTJ-q6oBMM'
                  //'https://maps.googleapis.com/maps/api/directions/json?origin=41.13694,-73.359778&destination=41.13546,-73.35997&mode=driver&sensor=true&key=AIzaSyDibnF5vLSMkxIsOWP41lqXNNTJ-q6oBMM'
              )
              .then(
                  (response) => response.text()
              )
              .then(
                  (responseText) => {
                      //console.log(responseText);
                  }
              )
              .catch(
                  (error) => {
                      console.warn(error);
                  }
              );
            },
            (error) => {},
            //(error) => alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
          );

        this.watchID = navigator.geolocation.watchPosition((position) => {
          console.log('watching');
          var lastPosition = JSON.stringify(position);
          this.setState({lastPosition});
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }
  
  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }

    render() {
        //console.log(this.props);
        return (
                <Main
                controlPanel={ControlPanel}
                drawerState={this.props.drawerState}
                navigator={this.props.navigator}
                defaultNav={false}
                bottomMenu={{
                visible: true,
                active: 4,
                }}>
                <NavBar
                tintColor={'#fff'}
                statusBarTint={'#146cc0'}
                statusBarLight={'light-content'}
                title={'Find Branch'}
                titleTint={'#146cc0'}
                right={''}
                left={{
                icon: Skin.icon.user,
                iconStyle: {
                fontSize: 35,
                paddingLeft: 17,
                width: 100,
                color: '#146cc0',
                },
                handler: this.triggerDrawer
                }} />

              <View style={{ flex: 1, backgroundColor: Skin.colors.BACK_GRAY }}>
                <MapView
                    style={{flex:1,width:Skin.SCREEN_WIDTH}}
                    showsUserLocation={true}
                    followUserLocation={true}
                />
              </View>
            </Main>
        );
    }
}

module.exports = FindBranchScene;
