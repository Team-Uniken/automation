'use strict';
/*
    NEED
 */

import React, { Component, PropTypes, } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image, Dimensions } from 'react-native'
import MapView from 'react-native-maps';
var isEqual = require('lodash.isequal');
import Main from '../../Container/Main';
import MyLocationMapMarker from '../../view/MyLocationMapMarker';

import Skin from '../../../Skin';


import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';
import Events from 'react-native-simple-events';


const propTypes = {
  ...MapView.Marker.propTypes,
  // override this prop to make it optional
coordinate: PropTypes.shape({
                            latitude: PropTypes.number.isRequired,
                            longitude: PropTypes.number.isRequired,
                            }),
};

const { width, height } = Dimensions.get('window');

var ASPECT_RATIO = width / height;
var LATITUDE = 37.78825;
var LONGITUDE = -122.4324;
var LATITUDE_DELTA = 0.0922;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
         myPosition: null,
        region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        },
        }
    }

    componentDidMount() {
        console.log('in did mount')
        navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position)
             // const myPosition = position.coords;
               // this.setState({ myPosition });
                                                 const myLastPosition = this.state.myPosition;
                                                 const myPosition = position.coords;
                                                 if (!isEqual(myPosition, myLastPosition)) {
                                                 this.setState({ myPosition });
                                                 }

              
              var initialPosition = JSON.stringify(position);
              this.setState({initialPosition});
              var lat = position.coords.latitude;
              var lon = position.coords.longitude;
//              this.setState({
//                pop:this.state.pop,
//                initialPosition:this.state.initialPosition,
//                lastPosition:this.state.lastPosition,
//                lat:position.coords.latitude,
//                lon:position.coords.longitude,
//              });

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
         // var lastPosition = JSON.stringify(position);
         // this.setState({lastPosition});
           const myLastPosition = this.state.myPosition;
           const myPosition = position.coords;
           if (!isEqual(myPosition, myLastPosition)) {
                
                //this.state.region.longitude = myPosition.longitude ;
                //this.state.region.latitude = myPosition.latitude ;
                                                           LONGITUDE = myPosition.longitude;
                                                           LATITUDE = myPosition.latitude
                                                          this.setState({ myPosition });
                                                           
                                                           this.state.region = {latitude:myPosition.latitude,
                                                           longitude: myPosition.longitude,
                                                           latitudeDelta: LATITUDE_DELTA,
                                                           longitudeDelta: LONGITUDE_DELTA,}
                                                           
                                                           this.map.animateToRegion(this.state.region);
                                                           
           }
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }
  
  onRegionChange(region) {
   // this.setState({ region });
  }
  
  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }
  onRegionChange(region) {
    this.setState({ region });
  }


    render(){
        //console.log(this.props);
      let {coordinate} = this.props;
  
        coordinate = this.state.myPosition;
       
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
                statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
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

                <View style={[{ flex: 1}, {backgroundColor: Skin.colors.BACK_GRAY}]}>
                <MapView
                {...this.props}
                 ref={ref => { this.map = ref; }}
                style={[{flex:1},{width:Skin.SCREEN_WIDTH}]}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={true}
                rotateEnabled={true}
                onRegionChange={region => this.onRegionChange(region)}
                
                >
                <MyLocationMapMarker
                coordinate={coordinate}
                />
                </MapView>
                
              </View>
            </Main>
        );
    }
}



module.exports  = FindBranchScene;
FindBranchScene.propTypes = propTypes;

