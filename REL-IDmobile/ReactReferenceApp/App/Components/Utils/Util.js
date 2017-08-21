'use strict'

import ReactNative from 'react-native';
import Main from '../Container/Main';
import {Buffer} from 'buffer';

import {AsyncStorage, DeviceEventEmitter, TouchableHighlight, View, WebView, Alert, Platform, AlertIOS } from 'react-native';
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
    if (url!=null && url != undefined && 
      jsonObject != null && jsonObject != undefined) {    
      var keys = Object.keys(jsonObject).forEach((key) => {
         url = url.replace(key,jsonObject[key]);
      });
    }
    return url;
  }

  static getConfigValue(configname, jsonArray){
    var value = null;
    if (jsonArray != null && jsonArray != undefined) { 
      for (var i=0;i<jsonArray.length;i++){
        var jsonObject = jsonArray[i];
        var keys = Object.keys(jsonObject).forEach((key) => {
        if(key === "key" && jsonObject[key]===configname){
          value = jsonObject["value"];
          return value;
        }
      });
      }   
    }
    return value;
  }
  
  static getFormatedDate(dateString){
    var string = (dateString);
    var res = string.split("T");
    var t0 = res[0];
    var t1 = res[1];
    t1= t1.substring(0, t1.length - 2);
    var cString = t0+" "+t1+" UTC";
    var date = new Date(cString);
    date.setHours(date.getHours() + 4);
    date.toString();
    var displayString = (date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes());
    return displayString;
  }
}



module.exports = Util;
