/**
 * Genrate Access key and Access code for new device activation. 
 */
'use strict';

/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';
import ReactNative from 'react-native';

/*
 Required for this js
 */
import { FormattedCurrency } from 'react-native-globalize';
import {View, Text, TouchableHighlight, StyleSheet, ScrollView, AsyncStorage, } from 'react-native'
import {Navigator} from 'react-native-deprecated-custom-components'


/*
 Use in this js
 */
import Skin from '../Skin';
import Main from '../Components/Container/Main';
import ListItem from '../Components/ListItem';
import ListSectionHeader from '../Components/ListSectionHeader';
const RDNARequestUtility = require('react-native').NativeModules.RDNARequestUtility;

class ActivateNewDeviceScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      accCode: '-----',
      accValue: '-----',
      expiryMsg: 'Your access code expires on ',
      isLoading: false
    };
  }
  /*
  This is life cycle method of the react native component.
  This method is called when the component is Mounted/Loaded.
*/
  componentDidMount() {
    this.setState({ isLoading: true });
    AsyncStorage.getItem("userId").then((value) => {
      AsyncStorage.getItem('CurrentConnectionProfile', (err, currentProfile) => {
        currentProfile = JSON.parse(currentProfile);
        //var baseUrl = "http://" + currentProfile.Host + ":8080" + "/GM/generateOTP.htm?userId=";

        var baseUrl = "http://" + currentProfile.Host + ":9080" + "/WSH/rest/generateOTP.htm";

        //  var url = baseUrl.concat(value);
        // fetch(url, {
        //     method: 'POST',
        //     })
        // .then((response) => response.text())
        // .then((responseText) => {
        //     console.log(responseText);
        //     var res = JSON.parse(responseText);
        //     this.state.accCode =res.otpId;
        //     this.state.accValue=res.otpValue;
        //     var Msg=res.expiryTs;
        //     this.state.expiryMsg = 'Your access code expires on '.concat(Msg);
        //     this.setState({ isLoading:false});
        //     })
        // .catch((error) => {
        //      console.warn(error);
        //      this.state.expiryMsg="Failed to generate access code. Please try again";
        //      this.setState({ isLoading:false});
        //      });



        //doHTTPPostRequest to get otp.
        var userMap = { "userId": value };
        RDNARequestUtility.doHTTPPostRequest(baseUrl, userMap, (response) => {
          console.log(response);
          if (response[0].error == 0) {
            var res = JSON.parse(response[0].response);
            this.state.accCode = res.otpId;
            this.state.accValue = res.otpValue;
            var Msg = res.expiryTs;
            this.state.expiryMsg = 'Your access code expires on '.concat(Msg);
            this.setState({ isLoading: false });
          } else {
            alert('Error');
          }

        })

      }).done();
    });
  }
  /*
This method is used to render the componenet with all its element.
*/
  render() {
    return (
      <Main
        drawerState={{
          open: false,
          disabled: true,
        }}
        navBar={{
          title: 'Activate New Device',
          visible: true,
          tint: Skin.colors.TEXT_COLOR,
          left: {
            text: 'Back',
            icon: '',
            iconStyle: {},
            textStyle: {},
            handler: () => { this.props.navigator.pop(); },
          },
        }}
        bottomMenu={{
          visible: false,
        }}
        navigator={this.props.navigator}
        >
        <View style={styles.container}>
          <Text style={styles.headline}>Activate a new device using Verification Code and Access Code below.</Text>
          <Text style={styles.codeTitle}> Verification Code: </Text>
          <Text style={styles.codeValue}>{this.state.accCode}</Text>
          <Text style={styles.codeTitle}> Access Code: </Text>
          <Text style={styles.codeValue}>{this.state.accValue}</Text>
          <Text style={styles.footer}> {this.state.expiryMsg}</Text>

        </View>

      </Main>
    );
  }
};
module.exports = ActivateNewDeviceScene;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Skin.colors.TEXT_COLOR,
    color: 'black',
  },
  headline: {
    textAlign: 'center',
    padding: 15,
    paddingTop: 30,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  codeTitle: {
    textAlign: "center",
    padding: 5,
    paddingTop: 20,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 17,
  },
  codeValue: {
    textAlign: "center",
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    backgroundColor: Skin.colors.BACK_GRAY,
    paddingVertical: 20,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    padding: 15,
    paddingTop: 30,
    color: Skin.colors.PRIMARY_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  }
});
