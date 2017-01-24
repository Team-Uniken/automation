import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, ListView, Image, MapView, PermissionsAndroid, Platform} from 'react-native'
import Skin from '../../../Skin';
import Main from '../../Main';
import ControlPanel from '../ControlPanel';
import ListItem from '../../../Components/ListItem';
import Events from 'react-native-simple-events'
import NavBar from '../../view/navbar.js'



class Screen_3_3_locations extends Component {

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
      locationPermissionAndroid: false,
      showMap: true,
    }
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
  }

  componentDidMount() {
    console.log('in did mount')
    console.log(navigator);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      this.checkLocationPermission();
    }

    if (Platform.OS === "ios" || (Platform.OS === "android" && this.state.locationPermissionAndroid))
      this.getCurrentPosition();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        var initialPosition = JSON.stringify(position);
        this.setState({ initialPosition });
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        this.setState({
          pop: this.state.pop,
          initialPosition: this.state.initialPosition,
          lastPosition: this.state.lastPosition,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

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
      (error) => {
        alert(error)
      },
      //(error) => alert(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log('watching');
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
    });
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'NWD App Location Permission',
          'message': 'NWD App needs access to your location '
        }
      )
      if (granted) {
        this.setState({
          locationPermissionAndroid: granted,
          showMap: false
        }, () => {
          this.getCurrentPosition();
          this.setState({ showMap: true });
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
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(response => {
        //response is an object mapping type to permission
        if (response) {
          this.setState({
            locationPermissionAndroid: response,
          }, () => { this.getCurrentPosition(); });
        } else {
          this.requestLocationPermission();
        }
      });
  }

  componentWillUnmount() {
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
        drawerState={{ open: false, disabled: false }}
        bottomMenu={{ visible: true, active: 3, }}
        navigator={this.props.navigator}
        defaultNav={false}>
        <NavBar
          title={'Locations'}
          titleTint={Skin.main.TITLE_COLOR}
          tintColor={'#ffffff'}
          right={''}
          left={{
            icon: Skin.icon.user,
            iconStyle: {
              fontSize: 35,
              paddingLeft: 17,
              width: 100,
              color: Skin.navbar.icon.color,
            },
            handler: this.triggerDrawer
          }} />
        <View style={{ height: 1, backgroundColor: Skin.main.TITLE_COLOR }}/>
        <View style={{
          flex: 1,
          backgroundColor: Skin.colors.BACK_GRAY
        }}>
          <MapView
            style={{
              flex: 1,
              width: Skin.SCREEN_WIDTH
            }}
            showsUserLocation={true}
            followUserLocation={true} />
        </View>
      </Main>
    );
  }
}

Screen_3_3_locations.propTypes = {
  icons: PropTypes.object,
  headers: PropTypes.object,
  iconcolor: PropTypes.object,
  recordCount: PropTypes.string,
  startIndex: PropTypes.string,
  enterpriseID: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  response: PropTypes.object,
  drawerState: PropTypes.object,
  navState: PropTypes.object,
}

Screen_3_3_locations.defaultProps = {
  headers: {
    1: 'Savings',
    2: 'Personal Checking',
    3: 'Credit Cards',
  },
  drawerState: {
    open: false,
    disabled: false,
  },
  menuState: {
    visible: true,
    active: 2,
  },
  recordCount: '0',
  startIndex: '1',
  enterpriseID: '',
  startDate: '',
  endDate: '',
  icons: {
    1: Skin.icon.store,
    2: Skin.icon.gift,
    3: Skin.icon.timer,
  },
  iconcolor: {
    1: Skin.colors.POSITIVE_ACCENT,
    2: Skin.colors.ACCENT,
    3: Skin.colors.NEGATIVE_ACCENT,
  },
  response: {
    0: {
      error: 0,
      response: '{"accountList":[ \
                  {"date":"10/1/16","location":"New York City, NY","title":"Brocade Country","pts":150,"bal":15565.32}, \
                  {"date":"10/1/16","location":"Central, HK","title":"Express","pts":77,"bal":3039.00}, \
                  {"date":"10/1/16","location":"San Francisco, CA","title":"Philip Le Bac","pts":10,"bal":-4074.52}, \
                  {"date":"10/1/16","location":"London, UK","title":"Mian Hua Tian","pts":24,"bal":243.22}, \
                  {"date":"10/1/16","location":"Shanghai, CH","title":"Alibaba","pts":30,"bal":1357.98}, \
                  {"date":"10/1/16","location":"Austin, TX","title":"Tiffany & Co.","pts":80,"bal":-403.12}], \
              "error":"", \
              "status":"success" \
            }',
    },
  },
}

export default Screen_3_3_locations