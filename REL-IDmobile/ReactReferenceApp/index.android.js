/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React from 'react';

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
import Web from './App/Scenes/Web';
import NotificationMgmtScene from './App/Scenes/ZeroNotification';

// SECURITY SCENES


import RegisterOptionScene from './App/Components/PostLogin/Screen_1_4_registerOptionsDashboard';
import PatternLock from './App/Components/Challenges/Screen_PatternLock';
import Screen_3_1_deals from './App/Components/Dashboard/NWD/Screen_3_1_deals';
import Screen_3_2_history from './App/Components/Dashboard/NWD/Screen_3_2_history';
import Screen_3_3_locations from './App/Components/Dashboard/NWD/Screen_3_3_locations';


//Dashboard
import Dashboard from './App/Components/Dashboard/dashboard';



// COMPONENTS

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;



import Screen_0_1_welcome from './App/Components/Challenges/Screen_0_1_welcome';
import Screen_0_2_selectlogin from './App/Components/Challenges/Screen_0_2_selectlogin';
import Screen_1_1_register from './App/Components/Challenges/Screen_1_1_register';
import Screen_1_2_activation from './App/Components/Challenges/Screen_1_2_activation';
import Screen_1_3_setPassword from './App/Components/Challenges/Screen_1_3_setPassword';
import Screen_1_4_registerOptions from './App/Components/Challenges/Screen_1_4_registerOptions';


import Appointment from './App/Scenes/Appointment';
import AddAppointment from './App/Scenes/AddAppointment';

//import SecureChat from './App/Components/secure_chat/Navigation';
import Machine from './App/Components/StateMachine/TwoFactorAuthMachine';
import UpdateMachine from './App/Components/StateMachine/UpdateAuthMachine';
import PostLoginAuthMachine from './App/Components/StateMachine/PostLoginAuthMachine';
import { FormattedWrapper } from 'react-native-globalize';
import buildStyleInterpolator from 'buildStyleInterpolator';
//let buildStyleInterpolator = require('buildStyleInterpolator');

import { AppRegistry, Navigator, Text } from 'react-native';


import { Component } from 'react';


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



class ReactRefApp extends Component {


  renderScene(route, nav) {
    let id = route.id;
    // MAIN SCENES
    if (id === 'Main') {
      return (<Dashboard
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Accounts') {
     return (<Screen_3_1_deals
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'PayBills') {
      return (<PayBillsScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    } else if (id === 'Contact') {
      return (<ContactScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    } else if (id === 'Deposits') {
      return (<DepositsScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    } else if (id === 'FindBranch') {
      return (<FindBranchScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    } else if (id === 'Appointments') {
      return (<AppointmentsScene
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    // LOAD SCENES
    }else if (id === 'Screen_0_1_welcome') {
      return (<Screen_0_1_welcome
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Screen_0_2_selectlogin') {
      return (<Screen_0_2_selectlogin
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Screen_1_1_register') {
      return (<Screen_1_1_register
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }  else if (id === 'Screen_1_2_activation') {
      return (<Screen_1_2_activation
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }else if (id === 'Screen_1_3_setPassword') {
      return (<Screen_1_3_setPassword
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Screen_1_4_registerOptions') {
      return (<Screen_1_4_registerOptions
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }else if (id === 'Screen_3_1_deals') {
      return (<Screen_3_1_deals
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Screen_3_2_history') {
      return (<Screen_3_2_history
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Screen_3_3_locations') {
      return (<Screen_3_3_locations
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }else if (id === 'Load') {
      return (<LoadScene navigator={nav} />);

      // SECONDARY SCENES
    } else if (id === 'ComingSoon') {
      return (<ComingSoonScene
        navigator={nav}
        title={route.title} />);
      /*
       } else if (id === 'QBank') {
       return (<QBank navigator={nav} url={route.url} title={route.title} />);
       } else if (id === 'SecureChat') {
       return (<SecureChat navigator={nav} />);
       */
    } else if (id === 'Appointment') {
      return (<Appointment
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'AddAppointment') {
      return (<AddAppointment
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'ActivateNewDevice') {
      return (<ActivateNewDeviceScene
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'ConnectionProfile') {
      return (<ConnectionProfileScene
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'SecureWebView') {
      return (<Web
        navigator={nav}
        url={route.url}
        title={route.title}
        proxy={Web.proxy}
        secure
        navigate />);
    } else if (id === 'WebView') {
      return (<Web
        navigator={nav}
        url={route.url}
        title={route.title}
        navigate />);

      // SECURITY SCENES
    }else if (id === 'Machine') {
      return (<Machine
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'UpdateMachine') {
      return (<UpdateMachine
        navigator={nav}
        url={route.url}
        title={route.title} />);
    } else if (id === 'PostLoginAuthMachine') {
      return (<PostLoginAuthMachine
        navigator={nav}
        url={route.url}
        title={route.title}
        challengesToBeUpdated={route.challengesToBeUpdated} />);
    } else if (id === 'DeviceMgmt') {
      return (<DeviceMgmtScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    }else if (id === 'NotificationMgmt') {
      return (<NotificationMgmtScene
        navigator={nav}
        url={route.url}
        title={route.title}
        rdna={route.DnaObject} />);
    } else if (id === 'RegisterOptionScene') {
      return (<RegisterOptionScene
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);

    }else if (id === 'pattern') {
      return (<PatternLock navigator={nav} mode={route.mode} data={route.data} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern}/>);
    }
    return (<Text>
      Error
    </Text>);
  }

  render() {
    return (
      <FormattedWrapper
        locale="en"
        currency="USD">
        <Navigator
          renderScene={this.renderScene}
          initialRoute={{
                          id: 'Load',
                          title: 'REL-IDmobile'
                        }}
          configureScene={(route) => {
            if (route.sceneConfig) {
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
            }
          } } />
      </FormattedWrapper>
    );
  }

  getProxy() {
    return AsyncStorage.getItem("Proxy");
  }
}



AppRegistry.registerComponent('ReactRefApp', () => ReactRefApp);
