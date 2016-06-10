/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';

// Main Scenes
import AccountsScene from './App/Scenes/Accounts';
import PayBillsScene from './App/Scenes/PayBills';
import ContactScene from './App/Scenes/Contact';
import DepositsScene from './App/Scenes/Deposits';
import FindBranchScene from './App/Scenes/FindBranch';
import AppointmentsScene from './App/Scenes/Appointments';

// SECURITY SCENES
import ActivationScene from './App/Components/challenges/Activation';

// COMPONENTS
import Device from './App/Components/device';
import Load from './App/Components/Load';
import Web from './App/Components/Web';
import QBank from './App/Components/Qbank';
import ComingSoon from './App/Components/ComingSoon';
import UserLogin from './App/Components/challenges/UserLogin';
import PasswordVerification from './App/Components/challenges/PasswordVerification';
import Appointment from './App/Components/Appointment';
import AddAppointment from './App/Components/AddAppointment';
import SecureChat from './App/Components/secure_chat/Navigation';
import Machine from './App/Components/TwoFactorAuthMachine';
import { FormattedWrapper } from 'react-native-globalize';

import Dimensions from 'Dimensions';
import PixelRatio from 'PixelRatio';
import Accounts from './App/Scenes/Accounts';
import Demo from './App/Components/demo';


import Activation from './App/Components/challenges/Activation';
import Password from './App/Components/challenges/Password';
import Otp from './App/Components/challenges/Otp';
import SetQue from './App/Components/challenges/SetQue';
import ActivateNewDevice from './App/Components/ActivateNewDevice';
import buildStyleInterpolator from 'buildStyleInterpolator';
import ConnectionProfile from './App/Components/ConnectionProfile';


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
  Navigator,
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

    if (id === 'Load') {
//      id = 'Activation';
      // id = 'Accounts'
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
    } else if (id === 'Load') {
      return (<Load navigator={nav} />);

    // SECONDARY SCENES
    } else if (id === 'Activation') {
      return (<ActivationScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Web') {
      return (<Web navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'ComingSoon') {
      return (<ComingSoon navigator={nav} title={route.title} />);
    } else if (id === 'QBank') {
      return (<QBank navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'SecureChat') {
      return (<SecureChat navigator={nav} />);
    } else if (id === 'Appointment') {
      return (<Appointment navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'AddAppointment') {
      return (<AddAppointment navigator={nav} url={route.url} title={route.title} />);

    // SECURITY SCENES
    } else if (id === 'UserLogin') {
      return (<UserLogin navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'PasswordVerification') {
      return (<PasswordVerification navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
    } else if (id === 'Machine') {
      return (<Machine navigator={nav} url={route.url} title={route.title} />);
    } else if (id === 'Device') {
      return (<Device navigator={nav} url={route.url} title={route.title} />);
    }else if (id == 'ActivateNewDevice'){
      return (<ActivateNewDevice navigator={nav} url={route.url} title={route.title}/>);
    }else if (id == 'ConnectionProfile'){
      return (<ConnectionProfile navigator={nav} url={route.url} title={route.title}/>);
    }
    return (<Text>Error</Text>);
  }

  render() {
    return (
      <FormattedWrapper locale="en" currency="USD">
        <Navigator
          renderScene={this.renderScene}
          initialRoute={
            { id: 'Load' }
          }
          configureScene={() => {
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
          }}
        />
      </FormattedWrapper>
    );
  }
}

AppRegistry.registerComponent('ReactRefApp', () => ReactRefApp);
