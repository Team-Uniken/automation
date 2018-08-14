'use strict'

import ReactNative from 'react-native';
import Main from '../Container/Main';
import { Buffer } from 'buffer';
import moment from 'moment';
import Finger from 'react-native-touch-id-android'
 
import { AsyncStorage, DeviceEventEmitter, TouchableHighlight, View, WebView, Alert, Platform, AlertIOS } from 'react-native';
import React, { Component, } from 'react';
const ReactRdna = require('react-native').NativeModules.ReactRdnaModule;

class Util extends Component {
  static decryptText(encryptedText) {
    return new Promise(function (resolve, reject) {
      if (encryptedText && typeof encryptedText === "string") {
        ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, encryptedText, (response) => {
          if (response && response[0].error == 0) {
            var response = response[0].response;
            if (Platform.OS === "android") {
              response = new Buffer(response, 'base64').toString();
            }
            resolve(response);
          } else {
            if (response) {
              reject({ error: response[0].error });
            }
            else {
              reject(null);
            }
          }
        });
      } else {
        reject({ error: "Invalid encryptedText" });
      }
    });
  }

  static decryptTextWithSalt(encryptedText, salt) {
    return new Promise(function (resolve, reject) {
      if (encryptedText && typeof encryptedText === "string") {
        ReactRdna.decryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, salt, encryptedText, (response) => {
          if (response && response[0].error == 0) {
            var response = response[0].response;
            if (Platform.OS === "android") {
              response = new Buffer(response, 'base64').toString();
            }
            resolve(response);
          } else {
            if (response) {
              reject({ error: response[0].error });
            }
            else {
              reject(null);
            }
          }
        });
      } else {
        reject({ error: "Invalid encryptedText" });
      }
    });
  }

  static encryptText(plainText) {
    return new Promise(function (resolve, reject) {
      if (plainText && typeof plainText === "string") {
        ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, ReactRdna.RdnaCipherSalt, plainText, (response) => {
          if (response && response[0].error == 0) {
            resolve(response[0].response);
          } else {
            if (response) {
              reject({ error: response[0].error });
            }
            else {
              reject(null);
            }
          }
        });
      }
      else {
        reject({ error: "Invalid Plain Text" });
      }
    });
  }

  static encryptTextWithSalt(plainText, salt) {
    return new Promise(function (resolve, reject) {
      if (plainText && typeof plainText === "string") {
        ReactRdna.encryptDataPacket(ReactRdna.PRIVACY_SCOPE_DEVICE, ReactRdna.RdnaCipherSpecs, salt, plainText, (response) => {
          if (response && response[0].error == 0) {
            resolve(response[0].response);
          } else {
            if (response) {
              reject({ error: response[0].error });
            }
            else {
              reject(null);
            }
          }
        });
      } else {
        reject({ error: "Invalid Plain Text" });
      }
    });
  }


  static saveUserData(key, data){
    return new Promise(function (resolve, reject){
        if( typeof key === "string" && data != null ){
          AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ [key]: data }), null)
              .then(resolve)
              .catch(reject).done();
        }else {
          reject({ error : "Invalid Key" });
        }
    });
  }

  static getUserData(key){
    return new Promise(function (resolve, reject) {
      if( key && typeof key === "string" && Main.dnaUserName != "" && Main.dnaUserName != undefined ) { 
          AsyncStorage.getItem(Main.dnaUserName).then( (value) =>{
              if(value){
                value = JSON.parse(value);
                resolve(value[key]);
              }else
              reject({ error : "Invalid Key" });
          }).catch(reject).done();
      }else{
        reject({ error : "Invalid Key" });
      }
    })
  }

  static saveUserDataSecure(key, data) {
    return new Promise(function (resolve, reject) {
      if (typeof key === "string") {
        Util.encryptText(data).then((encryptData) => {
          if (encryptData != null) {
            AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ [key]: encryptData }), null)
              .then(resolve)
              .catch(reject).done();
          } else {
            reject({ error: "Encryption failed" })
          }
        }).catch(reject).done();
      }
      else {
        reject({ error: "Invalid Key" });
      }
    });
  }

  static saveUserDataSecureWithSalt(key, data, salt) {
    return new Promise(function (resolve, reject) {
      if (typeof key === "string") {
        Util.encryptTextWithSalt(data, salt).then((encryptData) => {
          if (encryptData != null) {
            AsyncStorage.mergeItem(Main.dnaUserName, JSON.stringify({ [key]: encryptData }), null)
              .then(resolve)
              .catch(reject).done();
          } else {
            reject({ error: "Encryption failed" })
          }
        }).catch(reject).done();
      }
      else {
        reject({ error: "Invalid Key" });
      }
    });
  }

  static getUserDataSecureWithSalt(key, salt) {
    return new Promise(function (resolve, reject) {
      if (key && typeof key === "string") {
        AsyncStorage.getItem(Main.dnaUserName).then((value) => {
          if (value) {
            value = JSON.parse(value);
            if (value[key]) {
              Util.decryptTextWithSalt(value[key], salt).then(resolve).catch(reject).done();
            }
            else {
              reject({ error: "Data not found" });
            }
          }
          else {
            reject({ error: "Data not found" });
          }
        }).catch(reject).done();
      }
      else {
        reject({ error: "Invalid Key" });
      }
    });
  }

  static getUserDataSecure(key) {
    return new Promise(function (resolve, reject) {
      if (key && typeof key === "string") {
        AsyncStorage.getItem(Main.dnaUserName).then((value) => {
          if (value) {
            value = JSON.parse(value);
            if (value[key]) {
              Util.decryptText(value[key]).then(resolve).catch(reject).done();
            }
            else {
              reject({ error: "Data not found" });
            }
          } else {
            reject({ error: "Data not found" });
          }
        }).catch(reject).done();
      }
      else {
        reject({ error: "Invalid Key" });
      }
    });
  }

  static convertToPostData(jsonObject) {
    if (jsonObject != null && jsonObject != undefined) {
      var postData = "";
      var firstKey = true;
      var keys = Object.keys(jsonObject).forEach((key) => {
        if (firstKey === true) {
          firstKey = false;
          postData = postData + key + '=' + jsonObject[key];
        }
        else {
          postData = postData + '&' + key + '=' + jsonObject[key];
        }
      });

      return postData;
    } else {
      return null;
    }
  }

  static replaceUrlMacros(url, jsonObject) {
    if (url != null && url != undefined &&
      jsonObject != null && jsonObject != undefined) {
      var keys = Object.keys(jsonObject).forEach((key) => {
        url = url.replace(key, jsonObject[key]);
      });
    }
    return url;
  }

  static getConfigValue(configname, jsonArray) {
    var value = null;
    if (jsonArray != null && jsonArray != undefined) {
      for (var i = 0; i < jsonArray.length; i++) {
        var jsonObject = jsonArray[i];
        var keys = Object.keys(jsonObject).forEach((key) => {
          if (key === "key" && jsonObject[key] === configname) {
            value = jsonObject["value"];
            return value;
          }
        });
      }
    }
    return value;
  }

  static getFormatedDate(dateString) {
    var testDateUtc;
    if (dateString.includes("EDT"))
      testDateUtc = moment.utc(dateString.replace('EDT', '')).add(4, 'hours');
    else if (dateString.includes("EST"))
      testDateUtc = moment.utc(dateString.replace('EST', '')).add(5, 'hours');
    else if (dateString.includes("UTC"))
      testDateUtc = moment.utc(dateString.replace('UTC', ''));
    else if (dateString.includes("IST"))
      testDateUtc = moment.utc(dateString.replace('IST', '')).subtract(330,'minutes');
    var localDate = moment(testDateUtc).local();
    var s = localDate.format("DD/MM/YYYY HH:mm:ss");
    return s;
  }

  static replaceString(find, replace, str) {
    while (str.indexOf(find) > -1) {
      str = str.replace(find, replace);
    }
    return str;
  }

  static getErrorInfo(errorCode, callback) {
    ReactRdna.getErrorInfo(errorCode, (response) => {
      if (response) callback(response[0].error);
      else callback(null);
    });
  }

  static createErrorMessage(errorCode){
    switch(errorCode){
      case 58:
        return "User state is not valid, please register again";
      case 63:
        return "Response time out";
      default :
        break;
    }
  }
 
  static isAndroidTouchSensorAvailable() {
    return new Promise(function (resolve, reject) {
      Finger.isSensorAvailable()
        .then((isAvailable) => {
          resolve('success');
        }) 
        .catch(error => {
          reject(error);
          //alert('Sensor is not available');
        });
    })
  }

  static androidTouchAuth(){
    return new Promise(function (resolve, reject) {
      Finger.requestTouch()
      .then(success => {
        resolve('success');
      })
      .catch(error => {        
        reject(error);
        if( String(error) === 'LOCKED_OUT' )
          alert('You have made 5 wrong fingerprint attempts, please try after 30 seconds');
        else
          alert(error);
      });
    })
  }

  static isJSON(str){
      try {
        JSON.parse(str);
      } catch (e) {
          return false;
      }
    return true;
  }

  static parseJSON(str){
    var json = null;
    try {
      json  = JSON.parse(str);
    } catch (e) {
      json = null;
    }
    
    return json;
  }

  static isEmpty(str) {
    return (!str || 0 === str.length);
  }

  static convertUnicode(input) {
    return input.replace(/\\u(\w\w\w\w)/g,function(a,b) {
      var charcode = parseInt(b,16);
      return String.fromCharCode(charcode);
    });
  }

}


module.exports = Util;
