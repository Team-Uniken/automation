/*
  ALWAYS NEED
*/

'use strict';

var React = require('react-native');
var Skin = require('../Skin');
var SCREEN_WIDTH = require('Dimensions').get('window').width;
var SCREEN_HEIGHT = require('Dimensions').get('window').height;

/*
  CALLED
*/
var Accounts = require('../Scenes/Accounts');
var Load = require('./Load');
var ControlPanel = require('./ControlPanel');
var NavigationBar = require('react-native-navbar');
var BottomMenu = require('./BottomMenu');
var Content = require('./Content');
import Drawer from 'react-native-drawer'


/* 
  Instantiaions
*/
var dnaProxyPort;
var dnaUserName;
var {
  View,
  Dimensions,
  Text,
  Image,
  Navigator,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  StyleSheet,
  StatusBarIOS,
  BackAndroid,
  PropTypes,
} = React;



class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      drawerState:{
        open: this.props.drawerState.open || false,
        disabled: this.props.drawerState.disabled,
      },
      navBar: {
        title: this.props.navBar.title,
        visible: this.props.navBar.visible,
        leftText: ()=> {(this.props.navBar.backIcon) 
            ? (<Text><Text style={Skin.nav.icon}>{'x'}</Text><Text style={Skin.nav.sidetext}>{' '+this.props.navBar.leftText}</Text></Text>) 
            : (this.props.navBar.leftText == "") 
              ? <Text style={Skin.nav.icon}>{'\ue20e'}</Text> 
              : <Text style={Skin.nav.sidetext}>{this.props.navBar.leftText}</Text>},
        rightText: this.props.navBar.rightText,
        backIcon: this.props.navBar.backIcon,
        exitIcon: this.props.navBar.exitIcon,
      },
      bottomMenu:{
        visible: this.props.bottomMenu.visible,
        active: this.props.bottomMenu.active,
      }
    };
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }


  /**
   * Toggles the drawer open and closed. Is passed down the chain to navbar.
   * @return {null}
   */
  toggleDrawer(){
    console.log(this);
    if(this.state.drawerState.open){
      this.drawer.close();
    }else{
      this.drawer.open();
    }
  }


  /**
   * Builds the main wrapper elements of the post-login screen.
   * Main----
   *   Drawer----
   *     Control Panel ---  |=  Navbar ------
   *                        |   Content -----
   *                        |   BottomMenu --
   *                        
   * @return {JSX}
   */
  render() {
    console.log(this.props.navBar);
    return (
      <Drawer
        ref={c => this.drawer = c}
        type="static"
        content={
          <ControlPanel toggleDrawer={this.toggleDrawer} />
        }
        acceptDoubleTap
        //styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
        onOpen={() => {
          this.setState({drawerState:{open: true, disabled:this.state.drawerState.disabled}})
        }}
        onClose={() => {
          //console.log('onclose')
          this.setState({drawerState:{open: false, disabled:this.state.drawerState.disabled}})
          console.log(this.state)
        }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.0}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 70
        }}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        negotiatePan
        >
          <NavigationBar
            title={{title:this.state.navBar.title,tintColor:Skin.colors.TEXT_COLOR}}
            tintColor={Skin.colors.PRIMARY}
            statusBar={{tintColor:Skin.colors.DARK_PRIMARY,style:'light-content'}}
            leftButton={{
              tintColor: Skin.colors.TEXT_COLOR,
              title: {this.state.navBar.leftText},
              handler: this.toggleDrawer,
            }} 
          />
          {this.props.children}
          <BottomMenu navigator={this.props.navigator} bottomMenu={this.props.bottomMenu}/>
      </Drawer>
    )
  }
/**
 *            leftButton={{
              tintColor: Skin.colors.TEXT_COLOR,
              title: this.state.navBar.leftText,
              handler: this.toggleDrawer,
            }} 
 *
 * 
 */


};

Main.propTypes = {
   drawerState: React.PropTypes.object,
   navBar: React.PropTypes.object,
   bottomMenu: React.PropTypes.object,
};

Main.defaultProps = {
        drawerState:{
          open: false, 
          disabled: false
        },
        navBar:{
              title: 'Accounts',
              visible: true,
              leftText: '',
              rightText: '',
              backIcon: false,
              exitIcon: false,
        },
        bottomMenu:{
          visible: true,
          active: 1,
        },
};


module.exports = Main;
  