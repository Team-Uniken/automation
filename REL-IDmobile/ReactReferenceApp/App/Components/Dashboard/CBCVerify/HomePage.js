'use strict';
/*
    NEED
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet, ListView, Image } from 'react-native'
import Events from 'react-native-simple-events';
//import { FormattedCurrency } from 'react-native-globalize';
import Skin from '../../../Skin';
import Main from '../../Container/Main';
import ListItem from '../../ListItem';
import Web from '../../../Scenes/Web';
import Util from "../../Utils/Util";
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
import PageTitle from '../../view/pagetitle.js';

let self;

export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {urlData:"" };
     this.onGetConfig = this.onGetConfig.bind(this);
    self = this;
  }

  /**
   * Creates the self object for reference later
   * @return {null}
   */

   componentWillMount() {
     Events.on('onGetConfig', 'onGetConfig', this.onGetConfig);
    
   }

  componentDidMount() {
    this.getMyNotifications();
    Events.trigger('getConfiguration');  
  }

  onGetConfig(value){
   //alert("data->>>>>"+value.config[1].value);
      if(value){
        var url = Util.getConfigValue('main_page_url',value.config)
        this.setState({urlData:Util.replaceUrlMacros(url,{"__USERNAME__":Main.dnaUserName,"__CONNECTEDIP__":Main.gatewayHost})});
      }
  }
  
  triggerDrawer() {
    console.log('trigger')
    Events.trigger('toggleDrawer')
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
        <PageTitle title={'Welcome ' +Main.dnaUserName}
          handler={this.triggerDrawer}
          isBadge={true} />

        <View style={{
          flex: 1,
          backgroundColor: Skin.main.BACKGROUND_COLOR
        }}>
        {this.state.urlData.length > 0 &&
          <Web
            url={this.state.urlData}
            title={''}
            secure
            disableMain={true}
            navigate
          />
        }

        </View>
      </Main>
    );
  }

}


