import React, { Component, PropTypes } from 'react';
import Skin from '../../Skin';
import NavButton from './navbutton';
import NavigationBar from 'react-native-navbar';

class NavBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationBar
        title={{
                 title: this.props.title,
                 tintColor: Skin.navbar.title.color,
               }}
        tintColor={[Skin.navbar.bgcolor, this.props.tintColor]}
        statusBar={{
                     tintColor: this.props.statusBarTint || Skin.navbar.statusBar.tint,
                     style: 'light-content'
                   }}
        rightButton={<NavButton
                       left={false}
                       icon={this.props.right.icon}
                       title={this.props.right.text}
                       tint={this.props.tint}
                       iconStyle={this.props.right.iconStyle}
                       textStyle={this.props.right.iconStyle}
                       handler={this.props.right.handler}
                       toggleDrawer={this.props.toggleDrawer} />}
        leftButton={<NavButton
                      left
                      icon={this.props.left.icon}
                      title={this.props.left.text}
                      tint={this.props.tint}
                      iconStyle={this.props.left.iconStyle}
                      textStyle={this.props.left.iconStyle}
                      handler={this.props.left.handler}
                      toggleDrawer={this.props.toggleDrawer} />} />
    )
  }
}

NavBar.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  tint: PropTypes.string,
  left: PropTypes.object,
  right: PropTypes.object,
  toggleDrawer: PropTypes.func,
}
NavBar.defaultProps = {
  toggleDrawer: () => {
  },
  title: 'title',
  visible: true,
  tint: '#000000',
  left: {
    text: 'left',
    icon: 'i',
    iconStyle: {},
    textStyle: {},
    handler: () => {
    },
  },
  right: {
    text: 'right',
    icon: 'i',
    iconStyle: {
      color: '#ffffff'
    },
    textStyle: {
      color: '#ffffff'
    },
    handler: () => {
    },
  }
}
export default NavBar
