'use strict';
/*
    NEED
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet,ListView, Image } from 'react-native'
import Events from 'react-native-simple-events';
//import { FormattedCurrency } from 'react-native-globalize';
import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';
import ZeroNotification from '../../../Scenes/ZeroNotification';
/*
  CALLED
*/
import ListSectionHeader from '../../ListSectionHeader';
import { FormattedCurrency } from 'react-native-globalize';
var ReactRdna = require('react-native').NativeModules.ReactRdnaModule;
/*
  Instantiaions
*/
// const ReactRdna = React.NativeModules.ReactRdnaModule;
const RDNARequestUtility = ReactNative.NativeModules.RDNARequestUtility;

import ControlPanel from '../ControlPanel';
import Config from 'react-native-config';
import NavBar from '../../view/navbar.js';


let self;
const headers = {
  1: 'Savings',
  2: 'Personal Checking',
  3: 'Credit Cards',
};
const icons = { 1: '\ue2f7',2: '\ue277',3: '\ue285', };

const iconcolor = {
  1: Skin.colors.DIVIDER_COLOR,
  2: Skin.colors.POSITIVE_ACCENT,
  3: Skin.colors.ACCENT,
};


export default class Notification extends Component {

  constructor(props) {
    super(props);
    self = this;
  }

  /**
   * Creates the self object for reference later
   * @return {null}
   */
  componentDidMount() {
    //this.getMyNotifications();
  }


  getMyNotifications() {

    var recordCount = "0";
    var startIndex = "1";
    var enterpriseID = "";
    var startDate = "";
    var endDate = "";
    ReactRdna.getNotifications(recordCount, startIndex, enterpriseID, startDate, endDate, (response) => {

      console.log('----- NotificationMgmt.getMyNotifications.response ');
      console.log(response);

      if (response[0].error !== 0) {
        console.log('----- ----- response is not 0');
      //                               if (NotificationObtianedResponse !== undefined) {
      //                               // If error occurred reload last response
      //
      //                                                              }
      }

    });
  }



  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
  }


  render() {
    return (
     <Main
        controlPanel={ControlPanel}
        drawerState={this.props.drawerState}
        navigator={this.props.navigator}
        defaultNav={false}
         bottomMenu={{
          visible: true,
          active: 1,
        }}>
            
          <NavBar
            tintColor={'#fff'}
            statusBarTint={Skin.STATUS_BAR_TINT_COLOUR}
            statusBarLight={'light-content'}
            title={'My Notifications'}
            titleTint={'#146cc0'}
            right={''}
            left={{
              icon: Skin.icon.user,
              iconStyle: {
                fontSize: 35,
                paddingLeft: 17,
                width: 100,
                color: '#146cc0',
              },
              handler: this.triggerDrawer
            }} />
            
        <View style={{
                       flex: 1,
                       backgroundColor: Skin.main.BACKGROUND_COLOR
                     }}>
            <ZeroNotification navigator={this.props.navigator} disableMain={true}/>
        </View>
      </Main>
      );
  }

}

const styles = StyleSheet.create({
  rowwrap: {
    flexDirection: 'row',
    alignItems: 'center',
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
  namewrap: {
    flex: 3,
  },
  nametext: {
    fontSize: 14,
    color: Skin.colors.PRIMARY_TEXT,
    paddingTop: 3,
  },
  numtext: {
    fontSize: 12,
    color: ('rgba(' + Skin.colors.PRIMARY_TEXT_RGB + ',0.54)'),
    paddingTop: 3,
  },
  totalwrap: {
    flex: 2,
    flexDirection: 'column',
  },
  totaltext: {
    fontSize: 18,
    textAlign: 'right',
    flex: 1,
  },
});
