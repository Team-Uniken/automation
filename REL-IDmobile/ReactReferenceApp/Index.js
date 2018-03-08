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

//import { FormattedWrapper } from 'react-native-globalize';            //Provides access to all formatting options as well as easy-to-use React Native components
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




import {StackNavigator, NavigationActions} from 'react-navigation';
//import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import LoadScreen from './App/Scenes/Load';
import ConnectionProfileScreen from './App/Scenes/ConnectionProfile';
import WelcomeScreen from './App/Scenes/Welcome_Screen';
import SelfRegisterScreen from './App/Scenes/Self_Register';
import StateMachine from './App/Components/StateMachine/TwoFactorAuthMachine';
import Check_UserScreen from './App/Components/Challenges/Check_User';
import pass from './App/Scenes/Select_Login';

import Activation from './App/Components/Challenges/Activation_Code';
import AccessCode from './App/Components/Challenges/Access_Code';
import PasswordSet from './App/Components/Challenges/SetPassword';
import Forgot_Password from './App/Components/Challenges/Forgot_Password';
import Otp from './App/Components/Challenges/Activation_Code';
import QuestionSet from './App/Components/Challenges/SetQuestion';
import QuestionVerification from './App/Components/Challenges/Question_Verification';
import UserLogin from './App/Components/Challenges/Check_User';
import DeviceBinding from './App/Components/Challenges/Device_Binding';
import DeviceName from './App/Components/Challenges/Device_Name';
import PasswordVerification from './App/Components/Challenges/Password_Verification';
import RegisterOption from './App/Scenes/Register_Options';
// import PatternLock from './App/Scenes/Screen_PatternLock';
//import ScreenHider from '../Utils/ScreenHider';
import SelectLogin from './App/Scenes/Select_Login';

import Update_Password_Dashboard from './App/Components/PostLogin/Update_Password_Dashboard';
import Update_Question_Dashboard from './App/Components/PostLogin/Update_Question_Dashboard';


export const IndexNavigator = StackNavigator({
  
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
  
DashBoard: {
screen: Dashboard,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

SelfRegister: {
screen: SelfRegisterScreen,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

Accounts: {
screen: AccountsScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

PayBills: {
screen: PayBillsScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
Contact: {
screen: ContactScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
Deposits: {
screen: DepositsScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },

FindBranch: {
screen: FindBranchScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
DeviceMgmt: {
screen: DeviceMgmtScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
RegisterOptionScene: {
screen: RegisterOptionScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
NotificationMgmt: {
screen: NotificationMgmtScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
Notification_History: {
screen: Notification_History,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
ComingSoon: {
screen: ComingSoonScene,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
SecureWebView: {
screen: Web,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
Update_Question_Dashboard: {
screen: Update_Question_Dashboard,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
Update_Password_Dashboard: {
screen: Update_Password_Dashboard,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
UpdateMachine: {
screen: UpdateMachine,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  

pattern: {
screen: PatternLock,
navigationOptions: ({navigation}) => ({
header: false
  }),
  },
  
  }, {initialRouteName: 'LoadScreen'})

  
const getStateForAction = IndexNavigator.router.getStateForAction;

IndexNavigator.router.getStateForAction = (action, state) => {
  if (state && action.type === 'ReplaceCurrentScreen') {

    const dupRoutes = state.routes;
    var previousRouteObject;
    var currentRouteIndex = state.routes.length -1;;
    for (var i = 0; i < dupRoutes.length; i++) {
      previousRouteObject = dupRoutes[i];
      if (previousRouteObject.routeName === action.routeName) {
        currentRouteIndex = i;
        break;
      }
    }
    const routes = state.routes.slice(0, currentRouteIndex);
    routes.push(action);
    return {
      ...state,
      routes,
      index: currentRouteIndex,
    };
  
  }
  return getStateForAction(action, state);
};


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


