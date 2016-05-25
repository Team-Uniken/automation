
var React = require('react-native');
var challengeJson;
var challengeJsonArr;
var currentIndex;
var totalChallengesCount;
var screenId;

var buildStyleInterpolator = require('buildStyleInterpolator');
var Activation = require('./challenges/Activation');
var Main = require('./Main');
var Password = require('./challenges/Password');
var Otp = require('./challenges/Otp');
var SetQue = require('./challenges/SetQue');
var Machine = require('./TwoFactorAuthMachine');
var UserLogin = require('./challenges/UserLogin');
var PasswordVerification = require('./challenges/PasswordVerification');
var QuestionVerification = require('./challenges/questionVerification');
var DeviceBinding = require('./challenges/devbind');
var DeviceName = require('./challenges/devname');
var EventEmitter = require('EventEmitter');
var Constants = require('./Constants');
var Events = require('react-native-simple-events');
var RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

var subscriptions;
var obj;
var stateNavigator;

var {
  Component,
  Text,
  Navigator,
  Dimensions,
  PixelRatio,
  Animated,
  AsyncStorage,
} = React;

var {DeviceEventEmitter} = require('react-native');

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

class TwoFactorAuthMachine extends React.Component{
  constructor(props){
    super(props);
    console.log('---------- Machine param ');
  }
  
  componentDidMount(){
    screenId = "UserLogin";//this.props.screenId;
    obj = this;
    Events.on('showNextChallenge', 'showNextChallenge', this.showNextChallenge)
  }
  
  componentWillMount(){
    currentIndex = 0;
    challengeJson = this.props.url.chlngJson;
    challengeJsonArr = challengeJson.chlng;
    console.log('------ challengeJson ' + JSON.stringify(challengeJson));
    console.log('------ challengeJsonArray ' + JSON.stringify(challengeJsonArr));
    console.log('------- current Element ' + JSON.stringify(challengeJsonArr[currentIndex]));
    subscriptions = DeviceEventEmitter.addListener('onCheckChallengeResponseStatus', this.onCheckChallengeResponseStatus.bind(this));
  }
  
  componentWillUnmount() {
    console.log("----- TwoFactorAuthMachine unmounted");
  }
  
  onCheckChallengeResponseStatus(e){
    var res = JSON.parse(e.response);
    var statusCode= res.pArgs.response.StatusCode
    if(res.errCode == 0){
      if (statusCode==100) {
        
        //Unregister All Events
        // We can also unregister in componentWillUnmount
        subscriptions.remove();
        Events.rm('showNextChallenge', 'showNextChallenge');
        if(res.pArgs.response.ResponseData){
        var chlngJson = JSON.parse(res.pArgs.response.ResponseData);
        var nextChlngName = chlngJson.chlng[0].chlng_name
        
        //this.props.navigator.pop();
        //this.props.navigator.replace();
          if(chlngJson!=null){
            this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1,1));
            this.props.navigator.push({id: "Machine", title:nextChlngName, url:{"chlngJson":chlngJson, "screenId":nextChlngName}});
          }
        }else{
          var pPort = res.pArgs.pxyDetails.port;
          if(pPort>0){
            RDNARequestUtility.setHttpProxyHost('127.0.0.1',pPort,(response) => {});
          }
          this.props.navigator.immediatelyResetRouteStack(this.props.navigator.getCurrentRoutes().splice(-1,1));
          this.props.navigator.push({id: "Main", title:'DashBoard', url:''});
        }
        
      }else{
        alert(res.pArgs.response.StatusMsg);
      }
    } else {
      alert();
    }
  }
  
  
  /**
   public static final String CHLNG_CHECK_USER       = "checkuser";
   public static final String CHLNG_ACTIVATION_CODE  = "actcode";
   public static final String CHLNG_SEC_QA           = "secqa";
   public static final String CHLNG_PASS             = "pass";
   public static final String CHLNG_DEV_BIND         = "devbind";
   public static final String CHLNG_DEV_NAME         = "devname";
   public static final String CHLNG_OTP              = "otp";
   public static final String CHLNG_SECONDARY_SEC_QA = "secondarySecqa";
   **/
  
  renderScene(route,nav) {
    var id = route.id;
    console.log('---------- renderScene ' + id);
    var challengeOperation;
    if(route.url!=undefined){
      challengeOperation = route.url.chlngJson.challengeOperation;
    }
    
    if(id == "checkuser"){
      return (<UserLogin navigator={nav} url={route.url} title={route.title} />);
    }
    else if (id == "actcode"){
      return (<Activation navigator={nav} url={route.url} title={route.title}/>);
    }
    else if (id == "pass"){
      if(challengeOperation == Constants.CHLNG_VERIFICATION_MODE)
        return (<PasswordVerification navigator={nav} url={route.url} title={route.title} />);
      else
        return (<Password navigator={nav} url={route.url} title={route.title}/>);
    }
    else if (id == "otp"){
      return (<Otp navigator={nav} url={route.url} title={route.title}/>);
    }
    else if (id == "secqa" || id == "secondarySecqa"){
      if(challengeOperation == Constants.CHLNG_VERIFICATION_MODE)
        return (<QuestionVerification navigator={nav} url={route.url} title={route.title}/>);
      else
        return (<SetQue navigator={nav} url={route.url} title={route.title}/>);
    }
    else if (id == "devname"){
      return (<DeviceName navigator={nav} url={route.url} title={route.title}/>);
    }
    else if (id == "devbind"){
      return (<DeviceBinding navigator={nav} url={route.url} title={route.title}/>);
    }
  }
  
  render() {
    return (
            <Navigator
            ref={(ref) => this.stateNavigator = ref}
            renderScene={this.renderScene}
            initialRoute={
            {id: this.props.url.screenId,url: {"chlngJson":this.getCurrentChallenge(), "chlngsCount":challengeJsonArr.length},title: this.props.title}
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
  
  showNextChallenge(args){
    console.log("----- showNextChallenge jsonResponse " + JSON.stringify(args));
    //alert(JSON.stringify(args));
    
    var i = challengeJsonArr.indexOf(currentIndex);
    challengeJsonArr[i] = args.response;
    
    currentIndex ++;
    if(obj.hasNextChallenge()){
      // Show Next challenge screen
      var currentChlng = obj.getCurrentChallenge();
      obj.stateNavigator.push({id: currentChlng.chlng_name, url: {"chlngJson": currentChlng, "chlngsCount":challengeJsonArr.length},title: obj.props.title});
    } else {
      // Call checkChallenge
      obj.callCheckChallenge();
    }
  }
  
  hasNextChallenge(){
    return challengeJsonArr.length > currentIndex;
  }
  
  hasPreviousChallenge(){
    
  }
  
  showPreviousChallenge(){
    
  }
  
  showCurrentChallenge(){
    
  }
  
  start(json, nav){
    challengeJson = json;
    currentIndex = 0;
  }
  
  stop(){
    
  }
  
  getCurrentChallenge(){
    return challengeJsonArr[currentIndex];
  }
  
  getTotalChallenges(){
    
  }
  
  callCheckChallenge(){
    console.log('----- Main.dnaUserName ' + Main.dnaUserName);
    AsyncStorage.getItem("userId").then((value) => {
                                        
        ReactRdna.checkChallenges(JSON.stringify(challengeJson), value,(response) => {
                                  if (response[0].error==0) {
                                  console.log('immediate response is'+response[0].error);
                                  // alert(response[0].error);
                                  }else{
                                  console.log('immediate response is'+response[0].error);
                                  alert(response[0].error);
                                  }
                                  
                                  })
        }).done();
  }
}



module.exports = TwoFactorAuthMachine;