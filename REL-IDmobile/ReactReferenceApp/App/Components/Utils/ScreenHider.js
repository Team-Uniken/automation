
/*
 * Use to hide challenge screen and just show spinner.
 */

'use strict';
/*
 ALWAYS NEED
 */
import React, { Component, } from 'react';

/*
 Required for this js
 */
import {AsyncStorage, } from 'react-native';
import Events from 'react-native-simple-events';

/*
 Use in this js
 */
import Skin from '../../Skin';
import Loader from './Loader';
import Main from '../Container/Main';
import Util from "./Util";

/*
  INSTANCES
 */
let responseJson;


class ScreenHider extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }
  /*
     This is life cycle method of the react native component.
     This method is called when the component is Mounted/Loaded.
   */
  componentDidMount() {
    //if challenge name is checkuser then get user from database and call showNextChallenge
    if (this.props.url.chlngJson.chlng_name == 'checkuser') {
      AsyncStorage.getItem("userId").then((value) => {
        if (value) {
          if (value == "empty") {
          } else {
            Main.dnaUserName = value;
            responseJson = this.props.url.chlngJson;
            responseJson.chlng_resp[0].response = value;
            Events.trigger('showNextChallenge', { response: responseJson });
          }
        }
      }).done();
    }
    //if challenge name is pass then get stored password against user from database and call showNextChallenge
    if (this.props.url.chlngJson.chlng_name == 'pass') {
      AsyncStorage.getItem("userId").then((value) => {
        if (value) {
          if (value == "empty") {
          } else {
            AsyncStorage.getItem(value).then((userinfo) => {
              if (userinfo) {
                try {
                  userinfo = JSON.parse(userinfo);
                  var RPasswd = userinfo.RPasswd;
                  if (value == "empty") {
                  }else{
                    Util.decryptText(RPasswd).then((decryptedRPasswd)=>{
                      responseJson = this.props.url.chlngJson;
                      responseJson.chlng_resp[0].response = decryptedRPasswd;
                      Events.trigger('showNextChallenge', { response: responseJson });
                    }).done();
                  }
                } catch (e) { }
              }
            }).done();
          }
        }
      }).done();
    }
    //if challenge name is devbind then call showNextChallenge in response true to make device permanent
    if (this.props.url.chlngJson.chlng_name == 'devbind') {
      responseJson = this.props.url.chlngJson;
      responseJson.chlng_resp[0].response = 'true';
      Events.trigger('showNextChallenge', { response: responseJson });

    }
    //if challenge name is devname then call showNextChallenge in response this.props.url.chlngJson
    if (this.props.url.chlngJson.chlng_name == 'devname') {
      responseJson = this.props.url.chlngJson;
      Events.trigger('showNextChallenge', { response: responseJson });
    }
  }
  /*
    This method is used to render the componenet with all its element.
  */
  render() {
    return (
      <Loader visible={true}/>
    );
  }
}

module.exports = ScreenHider;