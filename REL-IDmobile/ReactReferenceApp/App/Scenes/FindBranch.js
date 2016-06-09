/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Main = require('../Components/Main');
var BottomMenu = require('../Components/BottomMenu');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
var NavigationBar = require('react-native-navbar');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

/* 
  Instantiaions
*/
var {
    View,
    Text,
    Navigator,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet,
    //WebView,
    MapView,
} = React;
var WEBVIEW_REF = 'webview';
var watchID = (null: ?number);

class FindBranchScene extends React.Component{

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
          },
          (error) => alert(error.message),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        ).then(
          fetch(
              'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+this.state.lat+','+this.state.lon+'&radius=5000&query=ATMs&key=AIzaSyDibnF5vLSMkxIsOWP41lqXNNTJ-q6oBMM'
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
          )
        ); 
        console.log('https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lon+'&radius=5000&query=ATMs&key=AIzaSyDibnF5vLSMkxIsOWP41lqXNNTJ-q6oBMM');

        this.watchID = navigator.geolocation.watchPosition((position) => {
          console.log('watching');
          var lastPosition = JSON.stringify(position);
          this.setState({lastPosition});
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
        //console.log(this.props);
        return (
            <Main
                drawerState={{
                    open: false, 
                    disabled: false
                }}
                navBar={{
                    title: 'Find Branch',
                    visible: true,
                    tint: Skin.colors.TEXT_COLOR,
                    left:{
                        text: '',
                        icon: '\ue20e',
                        iconStyle: {
                            fontSize:30,
                            marginLeft:8,
                        },
                        textStyle:{},
                    }
                }}
                bottomMenu={{
                    visible: true,
                    active: 4,
                }}
                navigator={this.props.navigator}
            >  
                <MapView
                    style={{flex:1}}
                    showsUserLocation={true}
                    followUserLocation={true}
                />
            </Main>
        );
    }
}
/*

 
<WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={{flex:1}}
          source={{uri: 'https://www.google.com/maps/search/atms/@40.7068006,-74.0682381,13z'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
        />
 */
module.exports = FindBranchScene;