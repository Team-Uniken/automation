'use strict';
/*
    NEED
 */
import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import Main from '../Components/Main';

/*
  Instantiaions
*/
const {
  View,
  Navigator,
  Text,
  MapView,
} = React;


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
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
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
                    style={{flex:1,width:Skin.SCREEN_WIDTH}}
                    showsUserLocation={true}
                    followUserLocation={true}
                />
            </Main>
        );
    }
}

module.exports = FindBranchScene;
