/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
console.disableYellowBox = true;

// Main Scenes
import AccountsScene from './App/Scenes/Accounts';
import PayBillsScene from './App/Scenes/PayBills';
import ContactScene from './App/Scenes/Contact';
import DepositsScene from './App/Scenes/Deposits';
import FindBranchScene from './App/Scenes/FindBranch';

// Secondary Scenes
import DeviceMgmtScene from './App/Scenes/DeviceMgmt';
import AppointmentsScene from './App/Scenes/Appointments';
import ActivateNewDeviceScene from './App/Scenes/ActivateNewDevice';
import ComingSoonScene from './App/Scenes/ComingSoon';
import ConnectionProfileScene from './App/Scenes/ConnectionProfile';
import LoadScene from './App/Scenes/Load';
import PatternLock from './App/Scenes/PatternLock'
import Web from './App/Scenes/Web';
import NotificationMgmtScene from './App/Scenes/ZeroNotification';


// SECURITY SCENES
import Activation from './App/Components/challenges/Activation';
import PasswordSet from './App/Components/challenges/PasswordSet';
import Otp from './App/Components/challenges/Otp';
import QuestionSet from './App/Components/challenges/QuestionSet';
import QuestionVerification from './App/Components/challenges/QuestionVerification';
import UserLogin from './App/Components/challenges/UserLogin';
import DeviceBinding from './App/Components/challenges/DeviceBinding';
import PasswordVerification from './App/Components/challenges/PasswordVerification';

// COMPONENTS

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

import Demo from './App/Components/demo';

import Appointment from './App/Components/Appointment';
import AddAppointment from './App/Components/AddAppointment';
//import SecureChat from './App/Components/secure_chat/Navigation';
import Machine from './App/Components/TwoFactorAuthMachine';
import { FormattedWrapper } from 'react-native-globalize';
import buildStyleInterpolator from 'buildStyleInterpolator';

var PushNotification = require('react-native-push-notification');
import Notification from 'react-native-system-notification';

import dismissKeyboard from 'react-native-dismiss-keyboard';
var {DeviceEventEmitter} = require('react-native')
DeviceEventEmitter.addListener('keyboardDidHide', dismissKeyboard)

const {
  AppRegistry,
  Navigator,
  Text,
  BackAndroid,
} = React;


const FadeIn = {
  opacity: {
    from: 0,
    to: 1,
    min: 0, // 0.5,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: 1000,
  },
};

const FadeOut = {
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 1, // 0.5,
    type: 'linear',
    extrapolate: true,
    round: 1000,
  },
};



class ReactRefApp extends React.Component {


  renderScene(route, nav) {
    let id = route.id;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (nav.getCurrentRoutes().length <= 1 ) {
     return false;
  }
  return true;
});



    if (id === 'Load') {
      // id = 'Accounts'
      // id = 'UserLogin';
      // id = 'Activation';
      // id = "PasswordSet";
      // id = 'PasswordVerification';
      // id = 'FindBranch';
      // id = 'ConnectionProfile';
      // id = 'Device';
      // id = 'PayBills';
      // id = 'QuestionSet';
      // id = 'DevBind';
      // id = 'Deposits';
      // id = 'ActivateNewDevice';
      // id = 'SecureWebView';
      // id = 'QuestionSet';
      // id = 'QuestionVerification';
     // id = 'Contact';
    }

    // MAIN SCENES
    if (id === 'Main' || id === 'Accounts') {
      return (<AccountsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'PayBills') {
      return (<PayBillsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Contact') {
      return (<ContactScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Deposits') {
      return (<DepositsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'FindBranch') {
      return (<FindBranchScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Appointments') {
      return (<AppointmentsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);

    // LOAD SCENES
    }else if (id === 'demo') {
      return (<Demo navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);

    // LOAD SCENES
    }else if (id === 'Load') {
      return (<LoadScene navigator={nav} />);

    // SECONDARY SCENES
    } else if (id === 'ComingSoon') {
      return (<ComingSoonScene navigator={nav} title={route.title} />);
    /*
    } else if (id === 'QBank') {
      return (<QBank navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'SecureChat') {
      return (<SecureChat navigator={nav} />);
    */
    } else if (id === 'Appointment') {
      return (<Appointment navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'AddAppointment') {
      return (<AddAppointment navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'ActivateNewDevice') {
      return (<ActivateNewDeviceScene navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'ConnectionProfile') {
      return (<ConnectionProfileScene navigator={nav} url={route.url} title={route.title} />);
    }else if (id === 'Pattern') {
      return (<PatternLock navigator={nav} url={route.url} title={route.title} 
              onSetPattern={route.setPatternCallback} data={route.url.data} 
              onUnlock={route.unlockCallback} mode={route.mode} />);
    } else if (id === 'SecureWebView') {
      return (<Web navigator={nav} url={route.url} title={route.title} secure navigate />);
    } else if (id === 'WebView') {
      return (<Web navigator={nav} url={route.url} title={route.title} navigate />);

    // SECURITY SCENES
    } else if (id === 'Activation') {
      return (<Activation navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'PasswordSet') {
      return (<PasswordSet navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'UserLogin') {
      return (<UserLogin navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'PasswordVerification') {
      return (<PasswordVerification navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Machine') {
      return (<Machine navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'DeviceMgmt') {
      return (<DeviceMgmtScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject}/>);
    } else if (id === 'QuestionSet') {
      return (<QuestionSet navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'QuestionVerification') {
      return (<QuestionVerification navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'DevBind') {
      return (<DeviceBinding navigator={nav} url={route.url} title={route.title} />);
     }else if (id === 'NotificationMgmt') {
      return (<NotificationMgmtScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject}/>);
    }

    return (<Text>Error</Text>);
  }


componentDidMount() {
    console.log('component did mounted.');

   

  }

  render() {
    return (
      <FormattedWrapper locale="en" currency="USD">
        <Navigator
          renderScene={this.renderScene}
          initialRoute={{
            id: 'Load',
            title: 'REL-IDmobile'
          }}
          configureScene={(route) => {
            if (route.sceneConfig){
              return route.sceneConfig;
            } else {
              let config = Navigator.SceneConfigs.FadeAndroid;
              // var config = Navigator.SceneConfigs.FloatFromRight
              config = {

                // Rebound spring parameters when transitioning FROM this scene
                springFriction: 26,
                springTension: 200,

                // Velocity to start at when transitioning without gesture
                defaultTransitionVelocity: 3.5,

                gestures: null,
                animationInterpolators: {
                  into: buildStyleInterpolator(FadeIn),
                  out: buildStyleInterpolator(FadeOut),
                },
            };
              return config;
          }}}
        />
      </FormattedWrapper>
    );
  }
}

AppRegistry.registerComponent('ReactRefApp', () => ReactRefApp);
