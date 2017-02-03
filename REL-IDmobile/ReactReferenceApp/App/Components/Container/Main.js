/**
 *  this js is act as a container.
 * it contain drawer, and child.
 *this screen use in Dashboard
 */

'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import Drawer from 'react-native-drawer';
import Modal from 'react-native-simple-modal';
import Events from 'react-native-simple-events';
import {View, Image, Text, TouchableHighlight, TouchableWithoutFeedback, StyleSheet, TextInput, DeviceEventEmitter } from 'react-native'
import { NativeModules, NativeEventEmitter } from 'react-native';


/*
 Use in this js
 */
import Skin from '../../Skin';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
const onGetCredentialsModuleEvt = new NativeEventEmitter(NativeModules.ReactRdnaModule);


/*
 Custome View
 */
import NavigationBar from '../view/navbar.js'
import BottomMenu from '../view/bottomMenu';
import NavButton from '../NavButton';

/*
  INSTANCED
 */
let _toggleDrawer;
let eventToggleDrawer = false;
let onGetCredentialSubscriptions;



/*
  Instantiaions
*/
export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userName: '',
      password: '',
      baseUrl: '',
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.cancelCreds = this.cancelCreds.bind(this);
    this.checkCreds = this.checkCreds.bind(this);
    this.selectedDialogOp = false;
    // this.cancelCreds = ;
    this.state.navBar = {};

    this.state.navBar.title = this.props.navBar.title || '';
    this.state.navBar.visible = this.props.navBar.visible || true;
    this.state.navBar.tint = this.props.navBar.tint || '#000000';

    this.state.navBar.left = {};
    this.state.navBar.left = {};
    this.state.navBar.left.text = this.props.navBar.left.text || '';
    this.state.navBar.left.icon = this.props.navBar.left.icon || '';
    this.state.navBar.left.iconStyle = this.props.navBar.left.iconStyle || {};
    this.state.navBar.left.textStyle = this.props.navBar.left.textStyle || {};
    this.state.navBar.left.handler = this.props.navBar.left.handler || this.toggleDrawer;

    this.state.navBar.right = {};
    this.props.navBar.right = {};
    this.state.navBar.right.text = this.props.navBar.right.text || '';
    this.state.navBar.right.icon = this.props.navBar.right.icon || '';
    this.state.navBar.right.iconStyle = this.props.navBar.right.iconStyle || {};
    this.state.navBar.right.textStyle = this.props.navBar.right.textStyle || {};
    this.state.navBar.right.handler = this.props.navBar.right.handler || this.toggleDrawer;

    this.state.bottomMenu = {
      visible: this.props.bottomMenu.visible,
      active: this.props.bottomMenu.active,
    };
    this.state.drawerState = {
      open: this.props.drawerState.open || false,
      disabled: this.props.drawerState.disabled || false,
    };

    _toggleDrawer = this.toggleDrawer;

  }
  /*
This is life cycle method of the react native component.
This method is called when the component will start to load
*/
  componentWillMount() {
    if (onGetCredentialSubscriptions) {
      onGetCredentialSubscriptions.remove();
      onGetCredentialSubscriptions = null;
    }
    onGetCredentialSubscriptions = onGetCredentialsModuleEvt.addListener('onGetCredentials',
      this.onGetCredentials.bind.bind(this));
  }
  /*
 This is life cycle method of the react native component.
 This method is called when the component is Mounted/Loaded.
*/
  componentDidMount() {
    console.log("eventToggleDrawer = " + eventToggleDrawer);
    if (eventToggleDrawer === true) {
      Events.rm('toggleDrawer', 'toggleDrawerID')
    }
    Events.on('toggleDrawer', 'toggleDrawerID', this.toggleDrawer);
    eventToggleDrawer = true;
  }
  /*
    This is life cycle method of the react native component.
    This method is called after the component is Updated.
  */
  componentDidUpdate() {
    if (eventToggleDrawer === true) {
      Events.rm('toggleDrawer', 'toggleDrawerID')
    }

    Events.on('toggleDrawer', 'toggleDrawerID', this.toggleDrawer);
  }
  //to open drawer
  open() {
    this.setState({ open: true });
  }
  //to close drawer
  close() {
    this.setState({ open: false });
  }

  onGetCredentials(domainUrl) {
    this.state.baseUrl = domainUrl.response;
    this.open();
  }

  checkCreds() {
    const user = this.state.userName;
    const pass = this.state.password;
    if (user.length > 0) {
      ReactRdna.setCredentials(this.state.userName, this.state.password, true, (response) => {
        if (response) {
          console.log('immediate response is' + response[0].error);
        } else {
          console.log('immediate response is' + response[0].error);
        }
      });
    } else {
      alert('Please enter valid data');
    }
  }

  cancelCreds() {
    ReactRdna.setCredentials(this.state.userName, this.state.password, false, (response) => {
      if (response) {
        console.log('immediate response is' + response[0].error);
      } else {
        console.log('immediate response is' + response[0].error);
      }
    });
  }
  /*
    onTextchange method for userName TextInput
  */
  onUserChange(event) {
    var newstate = this.state;
    newstate.userName = event.nativeEvent.text;
    this.setState(newstate);
  }
  /*
     onTextchange method for Password TextInput
   */
  onPasswordChange(event) {
    var newstate = this.state;
    newstate.password = event.nativeEvent.text;
    this.setState(newstate);
  }

  /**
   * Toggles the drawer open and closed. Is passed down the chain to navbar.
   * @return {null}
   */
  toggleDrawer() {
    console.log('in Main toggleDrawer')
    if (this.state.drawerState.open) {
      this.drawer.close();
    } else {
      this.drawer.open();
    }
  }

  onGetCredentials(domainUrl) {
    this.state.baseUrl = domainUrl.response;
    this.open();
  }
  /**
   * Builds the main wrapper elements of the post-login screen.
   * Main----
   *   Drawer----
   *     Control Panel ---  |=  Navbar ------
   *                        |   Content (this.props.children)
   *                        |   BottomMenu --
   *
   * @return {JSX}
   */

  getDrawerState() {
    return this.state.drawerState.open;
  }
  //tool bar 
  buildNavBar() {
    if (this.props.defaultNav) {
      return (
        [<NavigationBar
          title={this.props.navBar.title}
          titleTint={Skin.main.TITLE_COLOR}
          tintColor={Skin.main.NAVBAR_BG}
          //tintColor={'transparent'}
          // rightButton={
          //   <NavButton
          //       left={false}
          //       icon={this.state.navBar.right.icon}
          //       title={this.state.navBar.right.text}
          //       tint={this.state.navBar.tint}
          //       iconStyle={this.state.navBar.right.iconStyle}
          //       textStyle={this.state.navBar.right.iconStyle}
          //       handler={this.state.navBar.right.handler}
          //       toggleDrawer={this.toggleDrawer}
          //     />
          // }
          right={''}
          left={this.props.navBar.left}
          />,
          <View style={{ height: 1, backgroundColor: Skin.main.TITLE_COLOR }}/>]
      );
    }
  }

  render() {
    return (
      <Drawer
        ref={(c) => {
          console.log("Drawer  = " + c);
          this.drawer = c;
        } }
        type="static"
        content={this.props.controlPanel != null && this.props.controlPanel != undefined ? <this.props.controlPanel
          toggleDrawer={this.toggleDrawer}
          closeDrawer={this.closeDrawer}
          navigator={this.props.navigator} /> : null}
        acceptDoubleTap
        onOpen={() => {
          this.setState({
            drawerState: {
              open: true,
              disabled: this.state.drawerState.disabled
            }
          });
        } }
        onClose={() => {
          this.setState({
            drawerState: {
              open: false,
              disabled: this.state.drawerState.disabled
            }
          });
        } }
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.0}
        disabled={this.state.drawerState.disabled}
        openDrawerOffset={() => 70}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}>
        {this.buildNavBar() }
        {this.props.children}
        <BottomMenu
          navigator={this.props.navigator}
          bottomMenu={this.props.bottomMenu} />
        <Modal
          onPress={() => {
            this.setState({ userName: '', password: '', open: false }); this.cancelCreds();
          } }
          style={styles.modalwrap}
          overlayOpacity={0.75}
          offset={100}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open') }
          modalDidClose={() => {
            if (this.selectedDialogOp) {
              this.selectedDialogOp = false;
              this.checkCreds();
            } else {
              this.selectedDialogOp = false;
              this.cancelCreds();
            }
          } }>
          <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
              401 Authentication
              {'\n'}
              {this.state.baseUrl}
            </Text>
            <View style={styles.border}></View>
          </View>
          <TextInput
            autoCorrect={false}
            ref='userName'
            style={styles.modalInput}
            placeholder={'Enter username'}
            value={this.state.userName}
            onChange={this.onUserChange.bind(this) }
            placeholderTextColor={Skin.colors.HINT_COLOR} />
          <View style={styles.underline}></View>
          <TextInput
            autoCorrect={false}
            ref='password'
            style={styles.modalInput}
            secureTextEntry
            placeholder={'Enter password'}
            value={this.state.password}
            onChange={this.onPasswordChange.bind(this) }
            placeholderTextColor={Skin.colors.HINT_COLOR} />
          <View style={styles.underline}></View>
          <View style={{
            flex: 1,
            flexDirection: 'row'
          }}>
            <TouchableHighlight
              onPress={() => {
                this.selectedDialogOp = false;
                this.setState({ userName: '', password: '', open: false });
              } }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                CANCEL
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.selectedDialogOp = true;
                this.close();
              } }
              underlayColor={Skin.colors.REPPLE_COLOR}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                SUBMIT
              </Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </Drawer>
    );
  }

}

/**
 * [propTypes description]
 * @type {Object}
 */
Main.propTypes = {
  drawerState: React.PropTypes.object,
  navBar: React.PropTypes.object,
  bottomMenu: React.PropTypes.object,
  toggleDrawer: React.PropTypes.func,
  navigator: React.PropTypes.object,
  children: React.PropTypes.object,
};

/**
 * [defaultProps description]
 * @type {Object}
 */
Main.defaultProps = {
  defaultNav: true,
  drawerState: {
    open: false,
    disabled: false,
  },
  navBar: {
    title: '',
    visible: true,
    left: {
      text: '',
      icon: '',
      iconStyle: '',
      textStyle: '',
      handler: () => {
      },
    },
    right: {
      text: '',
      icon: '',
      iconStyle: '',
      textStyle: '',
      handler: () => {
      },
    },
  },
  bottomMenu: {
    visible: true,
    active: 1,
  },
  toggleDrawer: _toggleDrawer,
};
const styles = StyleSheet.create({
  modalwrap: {
    height: 180,
    flexDirection: 'column',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  modalTitleWrap: {
    justifyContent: 'center',
    flex: 1,
  },
  modalTitle: {
    color: Skin.colors.PRIMARY_TEXT,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 10,

  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalButtonText: {
    textAlign: 'center',
  },
  modalInput: {
    textAlign: 'center',
    color: Skin.colors.PRIMARY_TEXT,
    height: 32,
    fontSize: 16,

    backgroundColor: null

  },
  border: {
    height: 1,
    marginBottom: 16,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  },
  underline: {
    height: 2,
    backgroundColor: Skin.colors.DIVIDER_COLOR,
  },
  DeviceListView: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    height: 48,
    width: 48,
    opacity: 0.6,
    justifyContent: "center",
    marginTop: 4,
  },
  images: {
    width: 18,
    height: 18,
    margin: 16,
  },
  customerow: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'transparent',
  },
});
module.exports = Main;
