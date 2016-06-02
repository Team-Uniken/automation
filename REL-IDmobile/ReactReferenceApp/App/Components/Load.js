/*
  ALWAYS NEED
*/
'use strict';

var React = require('react-native');
var Skin = require('./Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Main = require('./Main');
var Menu = require('./Menu');
var UserLogin = require('./challenges/UserLogin');
//var Web = require('./Web');
var {DeviceEventEmitter} = require('react-native');
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


/* 
  Instantiaions
*/
var initSuc = false, isRunAfterInteractions = false;
var initCount = 0;
var initSuccess = 2, initError = 3;
var Obj;
var responseJson;
var chlngJson;
var nextChlngName;
var initErrorMsg;
var {
  AppRegistry,
  Easing,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBarIOS,
  Animated,
  TouchableOpacity,
  TouchableHighlight,
  InteractionManager,
  Dimensions,
  StatusBar,
  // ProgressViewIOS,
} = React;



/*
  Class Load
*/

class Load extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      r_opac_val: new Animated.Value(0),
      i_opac_val: new Animated.Value(0),
      d_opac_val: new Animated.Value(0),
      relid_text_opac: new Animated.Value(0),
      rid_top: new Animated.Value(253),
      r_text_opac: new Animated.Value(0),
      i_text_opac: new Animated.Value(0),
      d_text_opac: new Animated.Value(0),
      relid_opac_val: new Animated.Value(0),
    };
  }
  openRoute(route){
    this.props.navigator.push(route)
  }
  componentDidMount() {
    
    Obj = this;
    
    DeviceEventEmitter.addListener('onInitializeCompleted', function(e) {
        console.log('immediate response is' + e.response);
        responseJson = JSON.parse(e.response);
        if (responseJson.errCode == 0) {
            initCount = initSuccess;
            chlngJson = responseJson.pArgs.response.ResponseData;
            nextChlngName = chlngJson.chlng[0].chlng_name
            Obj.onInitCompleted();
            console.log('--------- onInitializeCompleted initCount ' + initCount);
        } else {
            initCount = initError;
            initErrorMsg = ' Error code ' + responseJson.errCode + '. Please restart application.';
            console.log('--------- onInitializeCompleted initCount ' + initCount);
            Obj.onInitCompleted();
        }
    });

    
    this.doInitialize();
    
    Animated.sequence([
                       Animated.parallel([
                                          Animated.timing(this.state.r_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay:1000 *Skin.spd,
                                                          }),
                                          Animated.timing(this.state.r_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay:1000 * Skin.spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.r_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Skin.spd,
                                                          delay:1000 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.i_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay: 1500 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.i_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay:1500 * Skin.spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.i_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Skin.spd,
                                                          delay:1000 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.d_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay: 1500 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.d_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay:1500 * Skin.spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.d_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Skin.spd,
                                                          delay:1000 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.relid_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay: 1500 * Skin.spd,
                                                          }),
                                          Animated.timing(this.state.relid_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Skin.spd,
                                                          delay:1500 * Skin.spd,
                                                          }),
                                          ])
                       ]).start();
    
    
    InteractionManager.runAfterInteractions(() => {
      isRunAfterInteractions = true;
      Obj.onInitCompleted();
    });
    
  }
  

  
  doInitialize() {
      console.log('Initialize RDNA');
      var proxySettings; //= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
      var jsonProxySettings = JSON.stringify(proxySettings);
      ReactRdna.initialize(ReactRdna.agentInfo, ReactRdna.GatewayHost, ReactRdna.GatewayPort, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, jsonProxySettings, (response) => {
          if (response) {
              console.log('immediate response is' + response[0].error);
              // alert(response[0].error);
          } else {
              console.log('immediate response is' + response[0].error);
              // alert(response[0].error);
          }
      })
  }

  onInitCompleted(){
    console.log('--------- onInitCompleted initCount '+ initCount + ' isRunAfterInteractions ' + isRunAfterInteractions);
    if(isRunAfterInteractions){
      if(initCount === initSuccess)
        Obj.doNavigation();
      else if(initCount === initError)
        alert(initErrorMsg);
    }
  }
  
  doNavigation() {
      /*while (!initSuc) {
       //console.log('DNA initializing');
       }*/
      this.props.navigator.push({ id: "Machine", title: "nextChlngName", url: { "chlngJson": chlngJson, "screenId": nextChlngName } });
  }

  
  render() {
    // StatusBarIOS.setStyle(1);
    return (
            <View style={Skin.loadStyle.container}>
            <View style={Skin.loadStyle.setfooter}>
            
            <StatusBar
            backgroundColor='#082340'
            barStyle='light-content'
            />
            <Image style={Skin.loadStyle.bgimage} source={require('image!bg')} />
            <View style={Skin.loadStyle.bgcolorizer}></View>
            
            <View style={Skin.loadStyle.loadwrap}>
            <Animated.View style={[Skin.loadStyle.rid_wrap, {top: this.state.rid_top}]}>
            <View style={Skin.loadStyle.rid_center}>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_r,{opacity: this.state.r_opac_val}]}>g</Animated.Text>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_i,{opacity: this.state.i_opac_val}]}>h</Animated.Text>
            <Animated.Text style={[Skin.loadStyle.logo_rid, Skin.loadStyle.logo_d,{opacity: this.state.d_opac_val}]}>i</Animated.Text>
            </View>
            </Animated.View>
            
            <View style={Skin.loadStyle.logo_relid_wrap}>
            <Animated.Text style={[Skin.loadStyle.logo_relid,{opacity: this.state.relid_opac_val}]}>W</Animated.Text>
            </View>
            
            <View style={Skin.loadStyle.load_text_wrap}>
            <Animated.Text style={[Skin.loadStyle.load_text,{opacity:this.state.r_text_opac}]}>Initializing Authentication</Animated.Text>
            <Animated.Text style={[Skin.loadStyle.load_text,{opacity:this.state.i_text_opac}]}>Authenticating Device</Animated.Text>
            <Animated.Text style={[Skin.loadStyle.load_text,{opacity:this.state.d_text_opac}]}>Securing Connection</Animated.Text>
            <Animated.Text style={[Skin.loadStyle.load_text,{opacity:this.state.relid_text_opac}]}>Secure Access Established</Animated.Text>
            </View>
            
            </View>
            </View>
            <View style={Skin.loadStyle.footerrow}>
            <Text
            style={{fontSize:16,color: '#2579a2',margin:4,fontWeight: 'bold'}}
            >Version : 1.0.0.1</Text>
            </View>
            </View>
            
            );
  }
  
};



module.exports = Load;
