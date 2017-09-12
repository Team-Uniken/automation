/**
 * This is the starting point for Uniken's REL-ID Reference Application developed in react-native for ios
 * This source code for reference app is made available to mobile developers to understand how to integrate with REL-ID SDK
 * Developers can use this source code OR any module or part of this source code as is, without warrenty
 *    
 * Application Name : REL-ID Reference App 
 * https://github.com/Team-Uniken/REL-ID_internal.git
 */

'use strict';

// Loading react library 
import React from 'react';
import {Navigator} from 'react-native-deprecated-custom-components'
import { FormattedWrapper } from 'react-native-globalize';            //Provides access to all formatting options as well as easy-to-use React Native components
import buildStyleInterpolator from 'buildStyleInterpolator';
import { AppRegistry, Text } from 'react-native';
import { Component } from 'react';

/**
 * The application has various screens, staring from initial splash screen i.e load.js, followed by REL-ID user activation and authentication screens.
 * Once user is authenticated into REL-ID, Application shows feature specific screens (Dashboard) 
 */



console.disableYellowBox = true;    //disable yellow warning box

// This application contains difference Scenes. Each scene is a js file present under ./App/Scenes folder
// For example, /App/Scenes/Accounts will be Accounts.js under ./App/Scenes folder
// loading the main scenes (js files), containing display and logic for REL-ID features


import Welcome_Screen from './App/Scenes/Welcome_Screen';                    // Screen (gives option to register / login)
import Select_Login from './App/Scenes/Select_Login';            // Select login mode (password / pattern etc)
import Self_Register from './App/Scenes/Self_Register';                  // screen for self-registration
import ActivateNewDeviceScene from './App/Scenes/ActivateNewDevice';     // generate access code for new device
import DeviceMgmtScene from './App/Scenes/DeviceMgmt';                  // Device Management for edit or delete device 
import ConnectionProfileScene from './App/Scenes/ConnectionProfile';    // import new connection profile or select existing profile for initialization
import LoadScene from './App/Scenes/Load';                              // splash screen perform initialization 
import Web from './App/Scenes/Web';                                               // retun platform specific WebView
import NotificationMgmtScene from './App/Scenes/ZeroNotification';                // notification screen
import Notification_History from './App/Scenes/Notification_History';                    //Notification_History Screen

import ComingSoonScene from './App/Scenes/ComingSoon';                             // comming soon feature UI screen.
import Register_Options from './App/Scenes/Register_Options';            // Provide all other option through which we can login like facebook,pattern,password
import PatternLock from './App/Scenes/Screen_PatternLock';               //

//Challenges
import Activation_Code from './App/Components/Challenges/Activation_Code';              // Activation key verification screen
import SetPassword from './App/Components/Challenges/SetPassword';                       // set password screen

//Dashboard
import Dashboard from './App/Components/Dashboard/dashboard';     //Navigate to respective flavour dashboard

//NWD Dashboard
import Deals from './App/Components/Dashboard/NWD/Deals';
import History from './App/Components/Dashboard/NWD/History';
import Locations from './App/Components/Dashboard/NWD/Locations';

//PostLogin
import RegisterOptionScene from './App/Components/PostLogin/RegisterOptionsDashboard';  //use for change register option

//StateMachine
import Machine from './App/Components/StateMachine/TwoFactorAuthMachine';  // use to flow in challenge array
import UpdateMachine from './App/Components/StateMachine/UpdateAuthMachine';  // use to update challenges
import PostLoginAuthMachine from './App/Components/StateMachine/PostLoginAuthMachine';  //use for post login authentication


import AccountsScene from './App/Components/Dashboard/CBC/Accounts';
import PayBillsScene from './App/Components/Dashboard/CBC/PayBills';
import ContactScene from './App/Components/Dashboard/CBC/Contact';
import DepositsScene from './App/Components/Dashboard/CBC/Deposits';
import FindBranchScene from './App/Components/Dashboard/CBC/FindBranch';

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


//export default class Index extends Component {
//  constructor(props) {
//    super(props);
//}
//
//  renderScene(route, nav) {
//    let id = route.id;
//
//    if (id === 'Load') {
//     // id = 'Accounts'
//
//    // id = 'UserLogin';
//    // id = 'Activation';
//    // id = "PasswordSet";
//    // id = 'PasswordVerification';
//    // id = 'ConnectionProfile';
//    // id = 'Device';
//    // id = 'PayBills';
//    // id = 'QuestionSet';
//    // id = 'DevBind';
//    // id = 'Deposits';
//    // id = 'ActivateNewDevice';
//    // id = 'SecureWebView';
//    // id = 'QuestionSet';
//    // id = 'QuestionVerification';
//    // id = 'Contact';
//    // id = 'Self_Register'
//    // id = 'Screen_1_2_activation'
//    // id = 'Register_Options'
//    // id = 'Screen_1_3_setPassword'
//    // id = 'Deals'
//    // id = 'History'
//    // id = 'Locations'
//    }
//
//    if (id === 'Accounts') {
//      return (<AccountsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
//    } else if (id === 'PayBills') {
//      return (<PayBillsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
//    } else if (id === 'Contact') {
//      return (<ContactScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
//    } else if (id === 'Deposits') {
//      return (<DepositsScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
//    } else if (id === 'FindBranch') {
//      return (<FindBranchScene navigator={nav} url={route.url} title={route.title} rdna={route.DnaObject} />);
//    } else if (id === 'Main') {
//      return (<Dashboard
//              navigator={nav}
//              url={route.url}
//              title={route.title}
//              rdna={route.DnaObject} />);
//    } else if (id === 'Accounts') {
//      return (<Deals
//              navigator={nav}
//              url={route.url}
//              title={route.title}
//              rdna={route.DnaObject} />);
//    }else if (id === 'Welcome_Screen') {
//      return (<Welcome_Screen
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Select_Login') {
//      return (<Select_Login
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Self_Register') {
//      return (<Self_Register
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Activation_Code') {
//      return (<Activation_Code
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'SetPassword') {
//      return (<SetPassword
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Register_Options') {
//      return (<Register_Options
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Deals') {
//      return (<Deals
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'History') {
//      return (<History
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Locations') {
//      return (<Locations
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'demo') {
//      return (<Demo
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'Load') {
//      return (<LoadScene navigator={nav} />);
//
//    // SECONDARY SCENES
//    } else if (id === 'ComingSoon') {
//      return (<ComingSoonScene
//                navigator={nav}
//                title={route.title} />);
//    /*
//     } else if (id === 'QBank') {
//     return (<QBank navigator={nav} url={route.url} title={route.title} />);
//     } else if (id === 'SecureChat') {
//     return (<SecureChat navigator={nav} />);
//     */
//    }else if (id === 'ActivateNewDevice') {
//      return (<ActivateNewDeviceScene
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'ConnectionProfile') {
//      return (<ConnectionProfileScene
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'SecureWebView') {
//      return (<Web
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                proxy={global.proxy}
//                secure
//                navigate />);
//    } else if (id === 'WebView') {
//      return (<Web
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                navigate />);
//
//    // SECURITY SCENES
//    } else if (id === 'Machine') {
//      return (<Machine
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'UpdateMachine') {
//      return (<UpdateMachine
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'PostLoginAuthMachine') {
//      return (<PostLoginAuthMachine
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                challengesToBeUpdated={route.challengesToBeUpdated} />);
//    } else if (id === 'DeviceMgmt') {
//      return (<DeviceMgmtScene
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'QuestionSet') {
//      return (<QuestionSet
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'QuestionVerification') {
//      return (<QuestionVerification
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    } else if (id === 'DevBind') {
//      return (<DeviceBinding
//                navigator={nav}
//                url={route.url}
//                title={route.title} />);
//    } else if (id === 'NotificationMgmt') {
//      return (<NotificationMgmtScene
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//    }else if (id === 'Notification_History') {
//      return (<Notification_History
//        navigator={nav}
//        url={route.url}
//        title={route.title}
//        rdna={route.DnaObject} />);
//    }else if (id === 'RegisterOptionScene') {
//      return (<RegisterOptionScene
//                navigator={nav}
//                url={route.url}
//                title={route.title}
//                rdna={route.DnaObject} />);
//
//    }else if (id === 'pattern') {
//      return (<PatternLock navigator={nav} mode={route.mode} data={route.data} operationMsg={route.operationMsg} onClose={route.onClose} onUnlock={route.onUnlock} onSetPattern={route.onSetPattern} disableClose={route.disableClose}/>);
//    }
//
//
//    return (<Text>
//              Error
//            </Text>);
//  }
//
//  render() {
//    return (
//      <FormattedWrapper
//        locale="en"
//        currency="USD">
//        <Navigator
//          renderScene={this.renderScene}
//          initialRoute={{
//                          id: 'Load',
//                          title: 'REL-IDmobile'
//                        }}
//          configureScene={(route) => {
//                            if (route.sceneConfig) {
//                              return route.sceneConfig;
//                            } else {
//                              let config = Navigator.SceneConfigs.FadeAndroid;
//                              // var config = Navigator.SceneConfigs.FloatFromRight
//                              config = {
//                          
//                                // Rebound spring parameters when transitioning FROM this scene
//                                springFriction: 26,
//                                springTension: 200,
//                          
//                                // Velocity to start at when transitioning without gesture
//                                defaultTransitionVelocity: 3.5,
//                          
//                                gestures: null,
//                                animationInterpolators: {
//                                  into: buildStyleInterpolator(FadeIn),
//                                  out: buildStyleInterpolator(FadeOut),
//                                },
//                              };
//                              return config;
//                            }
//                          }} />
//      </FormattedWrapper>
//      );
//  }
//}

import {StackNavigator, NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator'
import LoadScreen from './App/Scenes/Load';
import ConnectionProfileScreen from './App/Scenes/ConnectionProfile';
import WelcomeScreen from './App/Scenes/Welcome_Screen';
import SelfRegisterScreen from './App/Scenes/Self_Register';
import StateMachine from './App/Components/StateMachine/TwoFactorAuthMachine';
import Check_UserScreen from './App/Components/Challenges/Check_User';
import pass from './App/Scenes/Select_Login';
//import Check_UserScreen from './App/Components/Challenges/Check_User';



//const StateNavigator = StackNavigator({
//  
//checkuser: {
//screen: Check_UserScreen,
//navigationOptions: ({navigation}) => ({
//header: false
//  }),
//  },
//  
//SelfRegisterScreen: {
//screen: SelfRegisterScreen,
//navigationOptions: ({navigation}) => ({
//header: false
//  }),
//  },
//
//StateMachine: {
//screen: StateMachine,
//navigationOptions: ({navigation}) => ({
//header: false
//  }),
//  }
//  
//})
//  




const IndexNavigator = StackNavigator({
  
LoadScreen: {
screen: LoadScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
ConnectionProfileScreen: {
screen: ConnectionProfileScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
WelcomeScreen: {
screen: WelcomeScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
SelfRegisterScreen: {
screen: SelfRegisterScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

StateMachine: {
screen: StateMachine,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
checkuser: {
screen: Check_UserScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
  
DashBoard: {
screen: Dashboard,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
pass: {
screen: pass,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

  
  }, {
transitionConfig: () => ({
screenInterpolator: (sceneProps) => {
  if (sceneProps.index === 0 && sceneProps.scene.route.routeName !== 'LoadScreen' && sceneProps.scenes.length > 2)
    return null
    return CardStackStyleInterpolator.forHorizontal(sceneProps)
    }
    })
  }, {initialRouteName: 'LoadScreen'})

function separateRoot(WrappedComponent) {
  const EnhencedComponent = class extends React.Component {
    static navigationOptions = {
    header: null
    };
    render() {
      return <WrappedComponent
      screenProps={{
      outerNavigation: this.props.navigation
      }}/>
    }
  }
  EnhencedComponent.navigationOptions = WrappedComponent.navigationOptions
  return EnhencedComponent
}

class Index extends Component {
  static navigationOptions = {
  header: null
  };
  render() {
    return (<IndexNavigator/>)
  }
}
module.exports = Index


