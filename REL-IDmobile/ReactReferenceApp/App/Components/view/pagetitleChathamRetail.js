/*
 *Custome Title Component.
 *it is a simple row with title text in middle and cross on left side.
 */

/*
 *ALWAYS NEED
 */
import React, { Component } from 'react';
import ReactNative, { Platform, TouchableHighlight, TouchableOpacity,StyleSheet,TextInput } from 'react-native';
import NavBar from './navbar.js';
import IconBadge from 'react-native-icon-badge';
import Badge from 'react-native-smart-badge'
import Events from 'react-native-simple-events';
import Main from '../Container/Main'
import Config from 'react-native-config'


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

  onPressNotificationView() {
    Events.trigger('showNoticiationScreen');
  }

  render() {
    return (

      <View style={{ height: Platform.OS === 'android' ?135 : 156}}>
        <NavBar
          tintColor={Skin.BUTTON_BG_COLOR}
          statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
          statusBarLight={'light-content'}
          titleStyle={Skin.navbar.title.titleStyle}
          titleTint={Config.LOGO_COLOR}
          right={''}
          left={{
            text: this.props.isBackBtnText ? 'Back' : '',
            icon: this.props.isBackBtnText ? '' : Skin.icon.hamburger,
            iconStyle: this.props.isBackBtnText ? '' : {
              fontSize: 35,
              paddingLeft: 17,
              width: 40,
              color: 'white',
            },
            handler: this.props.handler
          }} />
          
         <View style={{ width: 300, height: 50, position: 'absolute', left: 60, top: Platform.OS=='android'?8:30 }}>
            <Text style={{ fontSize: 18, color: 'white',fontWeight:'bold' ,backgroundColor: 'transparent' }}>
              {"Chatham Retail"}
            </Text>
            <Text style={{ fontSize: 13, color: 'white', backgroundColor: 'transparent' }}>
              {"Open now until 9 PM"}
            </Text>
          </View>

        <View style={{backgroundColor:Skin.BUTTON_BG_COLOR}}>
          <View style={{ backgroundColor: 'white', height: 60, margin: 10, flexDirection: 'row' }}>
            <Text style={[styles.searchIcons, { marginLeft: 15 }]}>{'\ue986'}</Text>
            <TextInput style={styles.searchBar} underlineColorAndroid='transparent' placeholder="Search"></TextInput>
            <Text style={styles.searchIcons}>{'\ue91e'}</Text>
            <Text style={[styles.searchIcons, { marginRight: 15 }]}>{'\ue937'}</Text>
          </View>
        </View>

        {this.props.isBadge && <View style={{ width: 80, height: 50, position: 'absolute', right: 10 , flexDirection:'row'}}>
        <TouchableOpacity underlayColor='transparent'>
            <Text style={{
                color: 'white',
                fontSize: 30,
                height: 40,
                marginTop:3,
                textAlign:'center',
                marginRight:10,
                fontWeight: 'normal',
                top: Platform.OS === 'android' ? 12 : 32.5,
                backgroundColor: 'transparent',
                fontFamily: Skin.font.LOGO_FONT
              }}>{'\ue93a'}</Text>
          </TouchableOpacity>
          <TouchableOpacity underlayColor='transparent' onPress={this.onPressNotificationView}>
            <Text style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 35,
              height: 50,
              marginRight:10,
              fontWeight: 'normal',
              top: Platform.OS === 'android' ? 12 : 32.5,
              backgroundColor: 'transparent',
              fontFamily: Skin.font.ICON_FONT
            }}>{Skin.icon.bell}</Text>

            {this.state.badgeValue > 0 && <Badge style={{
              top: Platform.OS === 'android' ? -45 : -24,
              right: -17,
            }} minWidth={12} minHeight={12} extraPaddingHorizontal={2} textStyle={{ color: '#fff', }} >
              {this.state.badgeValue > 9 ? "9+" : this.state.badgeValue}

            </Badge>}
          </TouchableOpacity>
        </View>
        }

      </View>

    );
  }
}

const styles = StyleSheet.create({
  searchBar:{
    flex:1,
    fontSize:18,
    backgroundColor:'transparent'
  },
  searchIcons:{
    fontFamily: Skin.font.LOGO_FONT,
    fontSize: 25,
    width:30,
    marginTop:15,
    height:30,
    marginRight:5,
    color:Skin.BUTTON_BG_COLOR,
    textAlign:'center'
  },
  icon: {
    fontFamily: Skin.font.ICON_FONT,
    fontSize: 20,
  },
  iconwrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
});
module.exports = PageTitle;
