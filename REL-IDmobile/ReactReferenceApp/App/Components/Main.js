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
    this.state = {};
    this.state.drawerState = {
      open: this.props.drawerState.open || false,
      disabled: this.props.drawerState.disabled,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
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
        disabled={this.state.drawerDisabled}
        openDrawerOffset={() => 70}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        negotiatePan
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
  toggleDrawer: this.toggleDrawer,
};
