/*
 *Custome Title Component.
 *it is a simple row with title text in middle and cross on left side.
 */

/*
 *ALWAYS NEED
 */
import React, { Component } from 'react';
import ReactNative, { Platform, TouchableHighlight,TouchableOpacity} from 'react-native';
import NavBar from './navbar.js';
import IconBadge from 'react-native-icon-badge';
import Badge from 'react-native-smart-badge'
import Events from 'react-native-simple-events';
import Main from '../Container/Main'


/*
 Required for this js
 */
import { Text, View, } from 'react-native';

/*
 Use in this js
 */
import Skin from '../../Skin';
var eventId;
var preBadgeValue;

class PageTitle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      badgeValue: Main.notificationCount,
      refresh: false,
    };
    self = this;
    this.updateBadge = this.updateBadge.bind(this);
    this.onPressNotificationView = this.onPressNotificationView.bind(this);
  }

  componentDidMount() {
    eventId = this.getRandomInt(0, 999);
    Events.on('updateBadge', eventId, this.updateBadge);
  }

  componentDidUpdate() {
    //Events.on('updateBadge', 'updateBadge', this.updateBadge);
    if (this.state.refresh === true) {
      this.setState({ refresh: false });
    }
  }

  componentWillUnmount() {
    Events.rm('updateBadge', eventId)
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  updateBadge(value) {
    this.state.refresh = true;
    this.state.badgeValue = value;
    this.setState({ badgeValue: value });
     Main.notificationCount = value;
  }

  onPressNotificationView()
  {
     Events.trigger('showNoticiationScreen');
  }

  render() {
    return (

      <View style={{ height: Platform.OS === 'android' ? 87 : 107 }}>
        <NavBar
          tintColor={'#fff'}
          statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
          statusBarLight={'light-content'}
          titleStyle={Skin.navbar.title.titleStyle}
          title={Skin.icon.logo}
          titleTint={'#146cc0'}
          right={''}
          left={{
            icon: Skin.icon.hamburger,
            iconStyle: {
              fontSize: 35,
              paddingLeft: 17,
              width: 40,
              color: '#146cc0',
            },
            handler: this.props.handler
          }} />
        <Text style={Skin.navbar.title.titleText}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>
          {this.props.title}
        </Text>

        {this.props.isBadge &&<View style={{ width:50,height:50, position: 'absolute', right: 10 }}>
           <TouchableOpacity underlayColor='transparent' onPress={this.onPressNotificationView}>
          <Text style={{
            color: Skin.color.LOGO_COLOR,
            textAlign: 'center',
            fontSize: 35,
            height:50,
            fontWeight: 'normal',
            top: Platform.OS === 'android' ? 12 : 32.5,
            //backgroundColor: '#50ae3c',
            fontFamily: Skin.font.ICON_FONT
          }}>{Skin.icon.bell}</Text>
          
          {this.state.badgeValue > 0 && <Badge style={{
            top: Platform.OS === 'android' ? -45 : -24,
            right: -25,
          }} minWidth={12} minHeight={12} extraPaddingHorizontal={2} textStyle={{ color: '#fff', }} >
            {this.state.badgeValue>9?"9+":this.state.badgeValue}

          </Badge>}
</TouchableOpacity>

        </View>
 }

      </View>

    );
  }
}
module.exports = PageTitle;
