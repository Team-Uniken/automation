'use strict';

import React from 'react-native';
import Skin from '../Skin';

/*
  CALLED
*/
import ControlPanel from './ControlPanel';
import NavigationBar from 'react-native-navbar';
import BottomMenu from './BottomMenu';
import NavButton from './NavButton';
import Drawer from 'react-native-drawer';
import Modal from 'react-native-simple-modal';
var {DeviceEventEmitter} = require('react-native');
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
let getCredentialSubscriptions;
const {
  View,
  Image,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} = React;

/*
  Instantiaions
*/
export default class Main extends React.Component {

  /**
   * [constructor description]
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  constructor(props) {
    super(props);
    this.state = { open: false,
    userName: '',
    password:'',
      baseUrl:'',};
    this.toggleDrawer = this.toggleDrawer.bind(this);
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

    this.state.bottomMenu = {
      visible: this.props.bottomMenu.visible,
      active: this.props.bottomMenu.active,
    };
    this.state.drawerState = {
      open: this.props.drawerState.open || false,
      disabled: this.props.drawerState.disabled || false,
    };
    
  }
  open() {
    this.setState({
                  open: true
                  });
  }
  
  close() {
    this.setState({
                  open: false
                  });
  }
  
  onGetCredentialsStatus(domainUrl)
  {
    
    this.open();
    this.setState({
                  baseUrl: domainUrl.response
                  });
  }
  checkCreds() {
    
    const user = this.state.userName;
    const pass = this.state.password;
    if(user.length > 0)
    {
      
      ReactRdna.setCredentials(this.state.userName,this.state.password,true,(response) => {
                               if (response) {
                               console.log('immediate response is'+response[0].error);
                               }else{
                               console.log('immediate response is'+response[0].error);
                               }
                               })
      this.close();
    }else{
      alert('Please enter valid data');
    }
    
  }
  
  cancelCreds(){
    
    ReactRdna.setCredentials(this.state.userName,this.state.password,false,(response) => {
                             if (response) {
                             console.log('immediate response is'+response[0].error);
                             }else{
                             console.log('immediate response is'+response[0].error);
                             }
                             })
    
    this.close();
  }
  onUserChange(event) {
    var newstate = this.state;
    newstate.userName = event.nativeEvent.text;
    this.setState(newstate);
  }
  
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
    if (this.state.drawerState.open) {
      this.drawer.close();
    } else {
      this.drawer.open();
    }
  }
  
  componentWillMount(){
       if(getCredentialSubscriptions){
      getCredentialSubscriptions.remove();
    }
    getCredentialSubscriptions  = DeviceEventEmitter.addListener(
                                                                 'onGetCredentials',
                                                                 this.onGetCredentialsStatus.bind(this)
                                                                 );
  }
  
  onGetCredentialsStatus(domainUrl)
  {
    
    this.open();
    this.setState({
                  baseUrl: domainUrl.response
                  });
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
  render() {
    return (
      <Drawer
        ref={(c) => { this.drawer = c; }}
        type="static"
        content={
          <ControlPanel
            toggleDrawer={this.toggleDrawer}
            closeDrawer={this.closeDrawer}
            navigator={this.props.navigator}
          />}
        acceptDoubleTap
        onOpen={() => {
          this.setState({ drawerState: {
            open: true,
            disabled: this.state.drawerState.disabled } });
        }}
        onClose={() => {
          this.setState({ drawerState: {
            open: false,
            disabled: this.state.drawerState.disabled } });
        }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.0}
        disabled={this.state.drawerState.disabled}
        openDrawerOffset={() => 70}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
      >
        <NavigationBar
          title={{ title: this.props.navBar.title, tintColor: Skin.colors.TEXT_COLOR }}
          tintColor={Skin.colors.PRIMARY}
          statusBar={{ tintColor: Skin.colors.DARK_PRIMARY, style: 'light-content' }}
          rightButton={<NavButton
            left={false}
            icon={this.state.navBar.right.icon}
            title={this.state.navBar.right.text}
            tint={this.state.navBar.tint}
            iconStyle={this.state.navBar.right.iconStyle}
            textStyle={this.state.navBar.right.iconStyle}
            handler={this.state.navBar.right.handler}
            toggleDrawer={this.toggleDrawer}
          />}
          leftButton={<NavButton
            left
            icon={this.state.navBar.left.icon}
            title={this.state.navBar.left.text}
            tint={this.state.navBar.tint}
            iconStyle={this.state.navBar.left.iconStyle}
            textStyle={this.state.navBar.left.iconStyle}
            handler={this.state.navBar.left.handler}
            toggleDrawer={this.toggleDrawer}
          />}
        />
        {this.props.children}
        <BottomMenu navigator={this.props.navigator} bottomMenu={this.props.bottomMenu} />
            <Modal
            style={styles.modalwrap}
            overlayOpacity={0.75}
            offset={100}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({
                                               open: false
                                               })}>
            <View style={styles.modalTitleWrap}>
            <Text style={styles.modalTitle}>
            401 Authentication{'\n'}{this.state.baseUrl}
            </Text>
            
            <View style={styles.border}></View>
            </View>
            <TextInput
            autoCorrect={false}
            ref='userName'
            style={styles.modalInput}
            placeholder={'Enter username'}
            value={this.state.userName}
            onChange={this.onUserChange.bind(this)}
            placeholderTextColor={Skin.colors.HINT_COLOR}
            />
            <TextInput
            autoCorrect={false}
            ref='password'
            style={styles.modalInput}
            secureTextEntry
            placeholder={'Enter password'}
            value={this.state.password}
            onChange={this.onPasswordChange.bind(this)}
            placeholderTextColor={Skin.colors.HINT_COLOR}
            />
            <View style={styles.border}></View>
            <View style={{
            flex: 1,
            flexDirection: 'row'
            }}>
            <TouchableHighlight
            onPress={() => this.setState({
                                         userName:'',
                                         password:'',
                                         open: false
                                         }),this.cancelCreds.bind(this)}
            underlayColor={Skin.colors.REPPLE_COLOR}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
            CANCEL
            </Text>
            </TouchableHighlight>
            <TouchableHighlight
            onPress={this.checkCreds.bind(this)}
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
      handler: () => {},
    },
    right: {
      text: '',
      icon: '',
      iconStyle: '',
      textStyle: '',
      handler: () => {},
    },
  },
  bottomMenu: {
    visible: true,
    active: 1,
  },
  toggleDrawer: this.toggleDrawer,
};
const styles = StyleSheet.create({
                                 modalwrap: {
                                 height: 160,
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
                                 marginTop :10,
                                 
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
                                 textAlign: 'left',
                                 color: Skin.colors.PRIMARY_TEXT,
                                 height: 35,
                                 fontSize: 16,
                
                                 },
                                 border: {
                                 height: 1,
                                 backgroundColor: Skin.colors.DIVIDER_COLOR,
                                 marginBottom: 10,
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
