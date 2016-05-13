
var React = require('react-native');
var challengeJson;
var currentIndex;
var totalChallengesCount;
var screenId;

var buildStyleInterpolator = require('buildStyleInterpolator');
var Activation = require('./challenges/Activation');
var Password = require('./challenges/Password');
var Otp = require('./challenges/Otp');
var SetQue = require('./challenges/SetQue');
var Machine = require('./TwoFactorAuthMachine');
var UserLogin = require('./challenges/UserLogin');
var PasswordVerification = require('./challenges/PasswordVerification');


var {
	Component,
	Text,
	Navigator,
	Dimensions,
	PixelRatio,
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

class TwoFactorAuthMachine extends React.Component{
	constructor(props){
		super(props);
		console.log('---------- Machine param ');
	}

	componentDidMount(){
		screenId = "UserLogin";//this.props.screenId;
	}

	componentDidMount(){

	}

	renderScene(route,nav) {
	    var id = route.id;
	    console.log('---------- renderScene ' + id);
	    if(id == "UserLogin"){
	    	return (<UserLogin navigator={nav} url={route.url} title={route.title} />);//rdna={route.DnaObject}/>);
	    }else if (id == "PasswordVerification"){
	      return (<PasswordVerification navigator={nav} url={route.url} title={route.title} />);//rdna={route.DnaObject}/>);
	    }else if (id == "Activation"){
      	  return (<Activation navigator={nav}/>);
	    }else if (id == "Password"){
	      return (<Password navigator={nav}/>);
	    }else if (id == "Otp"){
	      return (<Otp navigator={nav}/>);
	    }else if (id == "SetQue"){
	      return (<SetQue navigator={nav}/>);
	    }
	}

render() {
    return (
      <Navigator
        renderScene={this.renderScene}
        initialRoute={
          {id: this.props.url.screenId}
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

	showNextChallenge(){

	}

	hasNextChallenge(){

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

	}

	getTotalChallenges(){

	}
}



module.exports = TwoFactorAuthMachine;