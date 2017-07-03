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
import { AppRegistry} from 'react-native';


/**
 * The application has various screens, staring from initial splash screen i.e load.js, followed by REL-ID user activation and authentication screens.
 * Once user is authenticated into REL-ID, Application shows feature specific screens (Dashboard) 
 */



// This application contains difference Scenes. Each scene is a js file present under ./App/Scenes folder
// For example, /App/Scenes/Accounts will be Accounts.js under ./App/Scenes folder
// loading the main scenes (js files), containing display and logic for REL-ID features


import Index from './Index'  //Main index file for android and iOS


AppRegistry.registerComponent('ReactRefApp', () => Index);

