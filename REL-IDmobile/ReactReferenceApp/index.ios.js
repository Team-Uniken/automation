/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';


var React = require('react-native');
var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');
// var NavigationBar = require('react-native-navbar');

var Main = require('./App/Components/Main');
var Load = require('./App/Components/Load');
var Web = require('./App/Components/Web');
var Menu = require('./App/Components/Menu');
var ComingSoon = require('./App/Components/ComingSoon');
var UserLogin = require('./App/Components/UserLogin');
var PasswordVerification = require('./App/Components/PasswordVerification');
var QBank = require('./App/Components/Qbank');
var MainStyleSheet = require('./App/Components/MainStyleSheet');
var SecureChat = require('./App/Components/secure_chat/Navigation');
var Appointment = require('./App/Components/Appointment');
var AddAppointment = require('./App/Components/AddAppointment');


var buildStyleInterpolator = require('buildStyleInterpolator');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var {DeviceEventEmitter} = require('react-native');
var responseJson;
var chlngJson;
var nextChlngName;

var CORE_FONT = 'Century Gothic';
var NAV_BAR_TINT = '#FFFFFF'
var NAV_SHADOW_BOOL = true;
var MENU_TXT_COLOR = '#2579A2';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var MID_COL = '#2579A2';
var LIGHT_COL = '#50ADDC';
var DARK_COL = '#10253F';
var Spd = 1;
var LoadSpd = 0.1;




var {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  View,
} = React;


var FromTheRight = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  transformTranslate: {
    from: {x: Dimensions.get('window').width, y: 0, z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  translateX: {
    from: Dimensions.get('window').width,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
};


var ToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Dimensions.get('window').width, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  translateX: {
    from: 0,
    to: -Dimensions.get('window').width,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};




class ReactRefApp extends React.Component{

  constructor(props){
    super(props);
  }

  renderScene(route,nav) {
    var id = route.id;

    if(id == "Main"){
      return (<Main navigator={nav}/>);
    }else if (id == "Load"){
      return (<Load navigator={nav}/>);      
    }else if (id == "Web"){
      return (<Web navigator={nav} url={route.url} title={route.title}/>);      
    }else if (id == "ComingSoon"){
      return (<ComingSoon navigator={nav} title={route.title}/>);      
    }else if (id == "UserLogin"){
      return (<UserLogin navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject}/>);     
    }else if (id == "PasswordVerification"){
      return (<PasswordVerification navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject}/>);     
    }else if (id == "QBank"){
      return (<QBank navigator={nav} url={route.url} title={route.title} />);
    }else if (id == "SecureChat"){
      return (<SecureChat navigator={nav}/>);
    }else if (id == "Appointment"){
      return (<Appointment navigator={nav} url={route.url} title={route.title} />);//rdna={route.DnaObject}/>);
    }else if (id == "AddAppointment"){
      return (<AddAppointment navigator={nav} url={route.url} title={route.title} />);//rdna={route.DnaObject}/>);
    }

  }

  render() {


    return (
      <Navigator
        style={styles.navigator}
        renderScene={this.renderScene}
        initialRoute={
          {id: "Load"}
          //{id: "Web",title:"Uniken Wiki",url:"http://wiki.uniken.com"}
        }
        configureScene={(route) => {
          var config = Navigator.SceneConfigs.FloatFromRight;
          config ={

              // Rebound spring parameters when transitioning FROM this scene
              springFriction: 26,
              springTension: 200,

              // Velocity to start at when transitioning without gesture
              defaultTransitionVelocity: 1.5,

              // Animation interpolators for horizontal transitioning:
              animationInterpolators: {
                into: buildStyleInterpolator(FromTheRight),
                out: buildStyleInterpolator(ToTheLeft),
              }
          }
          return config;
        }}
      />
    );
  }
}



var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    fontFamily: CORE_FONT
  },
  bar:{
    backgroundColor: MID_COL,
    width: 20,
    height:3,
    marginTop:3,
  },
  navbar:{
    backgroundColor: '#ffffff',
    height: 65,
    flexDirection: 'row',
    padding: 10,
    paddingTop:30
  },
  navButton:{
    //backgroundColor:'#dddddd',
    backgroundColor: 'transparent',
    width: 100,
    height: 20,

    flex:1,

  },
  navButtonText:{
    //textAlign: 'left',
    //fontFamily: CORE_FONT,
  },
  navButtonIcon:{
    fontFamily: CORE_FONT,
  },
  navRight:{
    //textAlign: 'right'
   // right: 0,
   // position: 'absolute'
  },
  navLeft:{
    //left: 0,
   // position: 'absolute',
    //flex:1
  },
  navTitle:{
    flex:2,
    fontFamily: CORE_FONT,
    textAlign: 'center',
    color: MID_COL,
    fontSize: 20,
  }
});


/*
navigationBar: <NavigationBar
             title="Menu"
             titleColor={MID_COL}
             backgroundStyle={{backgroundColor:'#ffffff'}}
             customTitle={
                <Text 
                  style={{
                    fontFamily:CORE_FONT,
                    color: MID_COL,
                    fontSize: 20
                  }}
                >Menu</Text>}
              
          />
          */

AppRegistry.registerComponent('ReactRefApp', () => ReactRefApp);
