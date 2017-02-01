/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React from 'react';

console.disableYellowBox = true;

// Main Scenes
import ContactScene from './App/Scenes/Contact';
import DepositsScene from './App/Scenes/Deposits';
import FindBranchScene from './App/Scenes/FindBranch';

// Secondary Scenes
import DeviceMgmtScene from './App/Scenes/DeviceMgmt';
import ActivateNewDeviceScene from './App/Scenes/ActivateNewDevice';
import ComingSoonScene from './App/Scenes/ComingSoon';
import ConnectionProfileScene from './App/Scenes/ConnectionProfile';
import LoadScene from './App/Scenes/Load';
import Web from './App/Scenes/Web';
import NotificationMgmtScene from './App/Scenes/ZeroNotification';

// SECURITY SCENES


import RegisterOptionScene from './App/Components/PostLogin/RegisterOptionsDashboard';
import PatternLock from './App/Scenes/Screen_PatternLock';
import Deals from './App/Components/Dashboard/NWD/Deals';
import History from './App/Components/Dashboard/NWD/History';
import Locations from './App/Components/Dashboard/NWD/Locations';


//Dashboard
import Dashboard from './App/Components/Dashboard/dashboard';



// COMPONENTS

var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;


import Welcome_Screen from './App/Scenes/Welcome_Screen';                    // Screen (gives option to register / login)
import Select_Login from './App/Scenes/Select_Login';            // Select login mode (password / pattern etc)
import Self_Register from './App/Scenes/Self_Register';


import Activation_Code from './App/Components/Challenges/Activation_Code';              // Activation key verification screen
import SetPassword from './App/Components/Challenges/SetPassword'; 
import Register_Options from './App/Scenes/Register_Options';



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
     return (<Deals
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
    }else if (id === 'Welcome_Screen') {
      return (<Welcome_Screen
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Select_Login') {
      return (<Select_Login
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Self_Register') {
      return (<Self_Register
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }  else if (id === 'Activation_Code') {
      return (<Activation_Code
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }else if (id === 'SetPassword') {
      return (<SetPassword
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Register_Options') {
      return (<Register_Options
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    }else if (id === 'Deals') {
      return (<Deals
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'History') {
      return (<History
                navigator={nav}
                url={route.url}
                title={route.title}
                rdna={route.DnaObject} />);
    } else if (id === 'Locations') {
      return (<Locations
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
    }else if (id === 'ActivateNewDevice') {
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
