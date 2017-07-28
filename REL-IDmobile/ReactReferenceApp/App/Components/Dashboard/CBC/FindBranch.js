'use strict';
/*
    NEED
 */

import React, { Component, PropTypes, } from 'react';
import ReactNative, { View, Text, StyleSheet, ListView,Platform,PermissionsAndroid, Image, Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
var isEqual = require('lodash.isequal');
import Main from '../../Container/Main';
import MyLocationMapMarker from '../../view/MyLocationMapMarker';

import Skin from '../../../Skin';


import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';
import PageTitle from '../../view/pagetitle.js';
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

class FindBranchScene extends Component {


    constructor(props) {
        super(props);
        this.state = {
            pop: () => {
                console.log(this);
                this.props.navigator.pop();
            },
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            lat: '',
            lon: '',
            myPosition: null,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        }

        this.requestLocationPermission = this.requestLocationPermission.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.watchPosition = this.watchPosition.bind(this);
    }

    componentDidMount() {
        console.log('in did mount')
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            this.checkLocationPermission();
        }

        if (Platform.OS === "ios" || (Platform.OS === "android" && this.state.locationPermissionAndroid)){
            this.getCurrentPosition();
            this.watchPosition();
        }
    }

    watchPosition() {
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

                this.state.region = {
                    latitude: myPosition.latitude,
                    longitude: myPosition.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }

                this.map.animateToRegion(this.state.region);

            }
        });
    }

    getCurrentPosition() {
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
                this.setState({ initialPosition });
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
                    'https://maps.googleapis.com/maps/api/place/textsearch/json?location=' + lat + ',' + lon + '&radius=5000&query=ATMs&key=AIzaSyDibnF5vLSMkxIsOWP41lqXNNTJ-q6oBMM'
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
            (error) => { },
            //(error) => alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region) {
        // this.setState({ region });
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': Skin.CLIENT_TITLE_TEXT + ' App Location Permission',
                    'message': Skin.CLIENT_TITLE_TEXT + ' App needs access to your location '
                }
            )
            if (granted) {
                this.setState({
                    locationPermissionAndroid: granted
                   // showMap: false
                }, () => {
                    this.getCurrentPosition();
                    this.watchPosition();
                    //this.setState({ showMap: true });
                });
                console.log("You can use the location")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    checkLocationPermission() {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(response => {
                //response is an object mapping type to permission
                if (response) {
                    this.setState({
                        locationPermissionAndroid: response,
                    }, () => { this.getCurrentPosition();
                               this.watchPosition();
                     });
                } else {
                    this.requestLocationPermission();
                }
            });
    }

    triggerDrawer() {
        console.log('trigger')
        Events.trigger('toggleDrawer')
    }
    onRegionChange(region) {
        this.setState({ region });
    }


    render() {
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
               <PageTitle title={'Find Branch'}
               handler={this.triggerDrawer}/>
                   
          
                <View style={[{ flex: 1 }, { backgroundColor: Skin.colors.BACK_GRAY }]}>
                    
                    <MapView
                        {...this.props}
                        ref={ref => { this.map = ref; } }
                        style={[{ flex: 1 }, { width: Skin.SCREEN_WIDTH }]}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        rotateEnabled={true}
                        onRegionChange={region => this.onRegionChange(region) }
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



module.exports = FindBranchScene;
FindBranchScene.propTypes = propTypes;

