var React = require('react-native');
var Menu = require('./Menu');
var Main = require('./Main');
var Web = require('./Web');
var UserLogin = require('./challenges/UserLogin');



var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var LIGHTBLUE = '#50ADDC';
var MIDBLUE = '#2579A2';
var DARKBLUE = '#10253F';
var ICON_COLOR = '#FFFFFF';
var ICON_FAMILY = 'icomoon';
var CORE_FONT = 'Century Gothic';
var Spd = 0.8;
var LoadSpd = 0.3;
var {DeviceEventEmitter} = require('react-native');

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
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
    
    DeviceEventEmitter.addListener('onInitializeCompleted', function (e) {
                                   console.log('immediate response is'+e.response);
                                   responseJson = JSON.parse(e.response);
                                   if(responseJson.errCode == 0){
                                   initCount = initSuccess;
                                   chlngJson = JSON.parse(responseJson.pArgs.response.ResponseData);
                                   nextChlngName = chlngJson.chlng[0].chlng_name
                                   Obj.onInitCompleted();
                                   console.log('--------- onInitializeCompleted initCount '+ initCount);
                                   } else {
                                   initCount = initError;
                                   initErrorMsg = ' Error code '+ responseJson.errCode +'. Please restart application.';
                                   console.log('--------- onInitializeCompleted initCount '+ initCount);
                                   Obj.onInitCompleted();
                                   }
                                   });
    
    this.doInitialize();
    
    Animated.sequence([
                       Animated.parallel([
                                          Animated.timing(this.state.r_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay:1000 * Spd,
                                                          }),
                                          Animated.timing(this.state.r_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay:1000 * Spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.r_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Spd,
                                                          delay:1000 * Spd,
                                                          }),
                                          Animated.timing(this.state.i_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay: 1500 * Spd,
                                                          }),
                                          Animated.timing(this.state.i_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay:1500 * Spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.i_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Spd,
                                                          delay:1000 * Spd,
                                                          }),
                                          Animated.timing(this.state.d_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay: 1500 * Spd,
                                                          }),
                                          Animated.timing(this.state.d_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay:1500 * Spd,
                                                          }),
                                          ]),
                       Animated.parallel([
                                          Animated.timing(this.state.d_text_opac, {
                                                          toValue: 0,
                                                          duration: 500 * Spd,
                                                          delay:1000 * Spd,
                                                          }),
                                          Animated.timing(this.state.relid_opac_val, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay: 1500 * Spd,
                                                          }),
                                          Animated.timing(this.state.relid_text_opac, {
                                                          toValue: 1,
                                                          duration: 500 * Spd,
                                                          delay:1500 * Spd,
                                                          }),
                                          ])
                       ]).start();
    
    InteractionManager.runAfterInteractions(() => {
                                            isRunAfterInteractions = true;
                                            Obj.onInitCompleted();
                                            });
    
  }
  
  onInitCompleted(){
    
    if(isRunAfterInteractions){
      if(initCount === initSuccess)
        Obj.doPostInit();
      else if(initCount === initError)
        alert(initErrorMsg);
    }
  }
  
  doInitialize() {
    console.log('Initialize RDNA');
    var proxySettings ;//= {'proxyHost':'127.0.0.1','proxyPort':'proxyport'};
    var jsonProxySettings = JSON.stringify(proxySettings);
    ReactRdna.initialize(ReactRdna.agentInfo,ReactRdna.GatewayHost,ReactRdna.GatewayPort,ReactRdna.RdnaCipherSpecs,ReactRdna.RdnaCipherSalt,jsonProxySettings,(response) => {
                         if (response) {
                         console.log('immediate response is'+response[0].error);
                         // alert(response[0].error);
                         }else{
                         console.log('immediate response is'+response[0].error);
                         // alert(response[0].error);
                         }
                         })
  }
  
  doPostInit() {
    /*while (!initSuc) {
     //console.log('DNA initializing');
     }*/
    this.props.navigator.push(
                              {id: "UserLogin",title:nextChlngName,url:chlngJson}
                              );
    
  }
  
  render() {
    // StatusBarIOS.setStyle(1);
    return (
            <View style={styles.container}>
            <View style={styles.setfooter}>
            
            <StatusBar
            backgroundColor='#082340'
            barStyle='light-content'
            />
            <Image style={styles.bgimage} source={require('image!bg')} />
            <View style={styles.bgcolorizer}></View>
            
            <View style={styles.loadwrap}>
            <Animated.View style={[styles.rid_wrap, {top: this.state.rid_top}]}>
            <View style={styles.rid_center}>
            <Animated.Text style={[styles.logo_rid, styles.logo_r,{opacity: this.state.r_opac_val}]}>g</Animated.Text>
            <Animated.Text style={[styles.logo_rid, styles.logo_i,{opacity: this.state.i_opac_val}]}>h</Animated.Text>
            <Animated.Text style={[styles.logo_rid, styles.logo_d,{opacity: this.state.d_opac_val}]}>i</Animated.Text>
            </View>
            </Animated.View>
            
            <View style={styles.logo_relid_wrap}>
            <Animated.Text style={[styles.logo_relid,{opacity: this.state.relid_opac_val}]}>W</Animated.Text>
            </View>
            
            <View style={styles.load_text_wrap}>
            <Animated.Text style={[styles.load_text,{opacity:this.state.r_text_opac}]}>Initializing Authentication</Animated.Text>
            <Animated.Text style={[styles.load_text,{opacity:this.state.i_text_opac}]}>Authenticating Device</Animated.Text>
            <Animated.Text style={[styles.load_text,{opacity:this.state.d_text_opac}]}>Securing Connection</Animated.Text>
            <Animated.Text style={[styles.load_text,{opacity:this.state.relid_text_opac}]}>Secure Access Established</Animated.Text>
            </View>
            
            </View>
            </View>
            <View style={styles.footerrow}>
            <Text
            style={{fontSize:16,color: '#2579a2',margin:4,fontWeight: 'bold'}}
            >Version : 1.0.0.1</Text>
            </View>
            </View>
            
            );
  }
  
};

var leftrid = 23;
var styles = StyleSheet.create({
                               container: {
                               flex: 1,
                               },
                               setfooter: {
                               flex: 1,
                               alignItems: 'center',
                               height:Dimensions.get('window').height-40,
                               
                               
                               },
                               footerrow: {
                               flexDirection:'row',
                               backgroundColor: '#fff',
                               width:Dimensions.get('window').width,
                               bottom: 0,
                               height:32,
                               },
                               bgimage: {
                               position: 'absolute',
                               top: 0,
                               bottom: 0,
                               right: 0,
                               left: 0,
                               width: SCREEN_WIDTH,
                               height: SCREEN_HEIGHT,
                               },
                               bgcolorizer: {
                               position: 'absolute',
                               top: 0,
                               bottom: 0,
                               right: 0,
                               left: 0,
                               backgroundColor: 'rgba(8,26,60,0.9)'
                               },
                               
                               
                               loadwrap: {
                               position: 'absolute',
                               top: 0,
                               bottom: 0,
                               right: 0,
                               left: 0,
                               backgroundColor: 'transparent',
                               //backgroundColor: 'rgba(17,200,62,0.2)'
                               },
                               rid_wrap: {
                               alignItems: 'center',
                               //backgroundColor: 'rgba(50,250,250,0.2)',
                               },
                               rid_center: {
                               alignItems: 'center',
                               width: 160,
                               //height:130,
                               // backgroundColor: 'rgba(0,50,200,0.2)',
                               },
                               logo_rid: {
                               fontFamily: 'icomoon',
                               },
                               logo_i: {
                               position: 'absolute',
                               fontSize: 89,
                               width: 160,
                               marginLeft: 31 + leftrid,
                               marginTop: 31,
                               color: LIGHTBLUE,
                               //backgroundColor: 'rgba(70,0,0,0.5)',
                               
                               },
                               logo_r: {
                               position: 'absolute',
                               fontSize: 120,
                               width: 160,
                               marginLeft: leftrid,
                               color: '#FFFFFF',
                               //backgroundColor: 'rgba(70,0,0,0.5)',
                               },
                               logo_d: {
                               position: 'absolute',
                               fontSize: 120,
                               width: 160,
                               marginLeft: 62 + leftrid,
                               color: MIDBLUE,
                               //backgroundColor: 'rgba(70,0,0,0.5)',
                               },
                               logo_relid_wrap: {
                               alignItems: 'center',
                               top: 380,
                               },
                               logo_relid: {
                               fontFamily: 'icomoon',
                               fontSize: 21,
                               marginLeft: 22,
                               width: 160,
                               color: '#FFFFFF',
                               backgroundColor: 'transparent',
                               //backgroundColor: 'rgba(0,100,0,0.5)',
                               },
                               load_text_wrap: {
                               top: 450,
                               alignItems: 'center',
                               },
                               load_text: {
                               color: '#FFFFFF',
                               fontFamily: 'Century Gothic',
                               fontSize: 20,
                               position: 'absolute',
                               width: 200,
                               left: ((SCREEN_WIDTH - 200) / 2),
                               fontWeight: 'bold',
                               textAlign: 'center',
                               alignItems: 'center',
                               //backgroundColor: 'rgba(100,100,0,0.5)',
                               },
                               
                               
                               });


module.exports = Load;
