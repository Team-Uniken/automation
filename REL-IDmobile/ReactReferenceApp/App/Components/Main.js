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
import NavButton from './NavButton'
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
    this.state={};
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.state.navBar                 = {};
    
    this.state.navBar.title           = this.props.navBar.title || '';
    this.state.navBar.visible         = this.props.navBar.visible || true;
    this.state.navBar.tint            = this.props.navBar.tint || '#000000';
    
    this.state.navBar.left            = {};
    this.state.navBar.left            = {};
    this.state.navBar.left.text       = this.props.navBar.left.text || '';
    this.state.navBar.left.icon       = this.props.navBar.left.icon || '';
    this.state.navBar.left.iconStyle  = this.props.navBar.left.iconStyle || {};
    this.state.navBar.left.textStyle  = this.props.navBar.left.textStyle || {};
    this.state.navBar.left.handler    = this.props.navBar.left.handler || this.toggleDrawer;
 
    this.state.navBar.right           = {};
    this.props.navBar.right           = {};
    this.state.navBar.right.text      = this.props.navBar.right.text || '';
    this.state.navBar.right.icon      = this.props.navBar.right.icon || '';
    this.state.navBar.right.iconStyle = this.props.navBar.right.iconStyle || {};
    this.state.navBar.right.textStyle = this.props.navBar.right.textStyle || {};
    this.state.navBar.right.handler   = this.props.navBar.right.handler || this.toggleDrawer;

    this.state.bottomMenu={
        visible: this.props.bottomMenu.visible,
        active: this.props.bottomMenu.active,
    };
    this.state.drawerState={
      open: false,
      disabled: false,
    }
    
  }

  /**
   * Toggles the drawer open and closed. Is passed down the chain to navbar.
   * @return {null}
   */
  toggleDrawer(){
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
    //console.log('main')
    //console.log(this)
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
            title={{title:this.props.navBar.title,tintColor:Skin.colors.TEXT_COLOR}}
            tintColor={Skin.colors.PRIMARY}
            statusBar={{tintColor:Skin.colors.DARK_PRIMARY,style:'light-content'}}
            rightButton={
                <NavButton
                  left={false}
                  icon={this.state.navBar.right.icon}
                  title={this.state.navBar.right.text}
                  tint={this.state.navBar.tint}
                  iconStyle={this.state.navBar.right.iconStyle}
                  textStyle={this.state.navBar.right.iconStyle}
                  handler={this.state.navBar.right.handler}
                  toggleDrawer = {this.toggleDrawer}
                />
            }
            leftButton={
                <NavButton
                  left={true}
                  icon={this.state.navBar.left.icon}
                  title={this.state.navBar.left.text}
                  tint={this.state.navBar.tint}
                  iconStyle={this.state.navBar.left.iconStyle}
                  textStyle={this.state.navBar.left.iconStyle}
                  handler={this.state.navBar.left.handler}
                  toggleDrawer = {this.toggleDrawer}
                />
            }
          />
          {this.props.children}
          <BottomMenu navigator={this.props.navigator} bottomMenu={this.props.bottomMenu}/>
      </Drawer>
    )
  }
/**
 * 
leftButton={
  <NavButton
    title={this.state.navBar.leftText}
    icon={this.state.navBar.leftIcon}
    handler={this.toggleDrawer}
  />
}
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
   toggleDrawer: React.PropTypes.func,
};

Main.defaultProps = {
        drawerState:{
          open: false, 
          disabled: false
        },
        navBar:{
          title: '',
          visible: true,
          left:{
            text: '',
            icon: '',
            iconStyle: '',
            textStyle: '',
            handler: ()=>{},
          },
          right:{
            text: '',
            icon: '',
            iconStyle: '',
            textStyle: '',
            handler: ()=>{},
          },
        },
        bottomMenu:{
          visible: true,
          active: 1,
        },
        toggleDrawer: this.toggleDrawer
};


module.exports = Main;
  