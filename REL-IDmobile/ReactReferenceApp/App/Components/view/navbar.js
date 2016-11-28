import React, { Component, PropTypes } from 'react';
import Skin from '../../Skin';
import NavButton from './navbutton';
import NavigationBar from 'react-native-navbar';

class NavBar extends Component {

  constructor(props) {
    super(props);
  }

  //tintColor={[Skin.navbar.bgcolor, this.props.tintColor]}

  render() {
    return (
      <NavigationBar
        title={{
                 title: this.props.title,
                 style: this.props.titleStyle,
                 tintColor: this.props.titleTint,
               }}
        style={this.props.style ? this.props.style : Skin.navbar.base}
        tintColor={this.props.tintColor ? this.props.tintColor : Skin.navbar.bgcolor}
        statusBar={{
                     tintColor: this.props.statusBarTint || Skin.navbar.statusBar.tint,
                     style: Skin.navbar.statusBar.light ? 'light-content' : 'default',
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
  titleTint: PropTypes.string,
  titleStyle: PropTypes.object,
  visible: PropTypes.bool,
  tint: PropTypes.string,
  left: PropTypes.object,
  right: PropTypes.object,
  toggleDrawer: PropTypes.func,
}
NavBar.defaultProps = {
  toggleDrawer: () => {
  },
  title: '',
  titleStyle: Skin.navbar.title.style,
  titleTint: Skin.TITLE_COLOR,
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
