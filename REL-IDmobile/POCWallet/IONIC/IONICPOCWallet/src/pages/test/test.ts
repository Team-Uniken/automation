import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Toast } from '../toast/toast';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import { Util } from '../twofatorstate/Util';
import * as Constants from '../twofatorstate/constants';

declare var com: any;
@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
  serviceName: string;
  ip: string;
  port: number;
  serviceStringJson: string;
  cipherSalt: string;
  cipherSpect: string;
  plainText: string;
  encryptDataPacketOutput: string;
  decryptDataPacketOutput: string;
  plainHttpRequest: string;
  encryptHttpRequestOutput: string;
  decryptHttpResponseOutput: string;


  constructor(public navCtrl: NavController, public toast: Toast) {

    this.serviceName = 'port_forward';
    this.ip = "127.0.0.1";
    this.port = 9080;
   // this.serviceStringJson = "{\"serviceName\": \"serv3_portF\",\"targetHNIP\": \"99.99.99.99\",\"app_uuid\": \"415a4174-c0c3-4ee4-8931-04c5f325db0c\",\"accessServerName\": \"cluster1\",\"targetPort\": 9999,\"portInfo\": {\"isAutoStartedPort\": 0,\"isLocalhostOnly\": 1,\"isStarted\": 0,\"isPrivacyEnabled\": 1,\"portType\": 1,\"port\": 9999}}";
    this.serviceStringJson = "{\"serviceName\": \"port_forward\", \"targetHNIP\": \"127.0.0.1\", \"app_uuid\": \"729f64e2-5a67-11e8-a9f4-e6cfa37cafc2\", \"accessServerName\": \"uniken\", \"targetPort\": 9080, \"portInfo\": { \"isAutoStartedPort\": 1, \"isLocalhostOnly\": 1, \"isStarted\": 1, \"isPrivacyEnabled\": 0, \"portType\": 1, \"port\": 8443 }}";
    this.cipherSalt = "";
    this.cipherSpect = "";
    this.plainText = "uniken";
    this.encryptDataPacketOutput = "";
    this.decryptDataPacketOutput = "";
    this.plainHttpRequest = "GET /docs/index.html HTTP/1.1\r\nHost: www.nowhere123.com\r\n\r\n";
    this.encryptHttpRequestOutput = "";
    this.decryptHttpResponseOutput = "";


    this.getDefaultCipherSpecSuccess = this.getDefaultCipherSpecSuccess.bind(this);
    this.getDefaultCipherSaltSuccess = this.getDefaultCipherSaltSuccess.bind(this);
    this.decryptDataPacketSuccess = this.decryptDataPacketSuccess.bind(this);
    this.encryptDataPacketSuccess = this.encryptDataPacketSuccess.bind(this);
    this.encryptHttpRequestSuccess = this.encryptHttpRequestSuccess.bind(this);
    this.decryptHttpResponseSuccess = this.decryptHttpResponseSuccess.bind(this);

  }


  login() {
    this.navCtrl.push(LoginPage);
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }

  getServiceByServiceName() {
    com.uniken.rdnaplugin.RdnaClient.getServiceByServiceName(this.getServiceByServiceNameSuccess, this.getServiceByServiceNameFailure, [this.serviceName]);
    Util.setTime(Constants.SERVICENAME);
  }

  getServiceByServiceNameSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICENAME);
    console.log ('TwoFactorAuthMachine - serviceNameTimeDifference '+timedifference);
    console.log("RdnaClient.js: getServiceByServiceNameSuccess-->" + data);
    alert(data);
  }

  getServiceByServiceNameFailure(data) {
    console.log("RdnaClient.js: getServiceByServiceNameFailure-->" + data);
    alert(data);
  }


  getServiceByTargetCoordinate() {
    com.uniken.rdnaplugin.RdnaClient.getServiceByTargetCoordinate(this.getServiceByTargetCoordinateSuccess, this.getServiceByTargetCoordinateFailure, [this.ip, this.port]);
    Util.setTime(Constants.SERVICEBYTARGETCOORDINATE);
  }

  getServiceByTargetCoordinateSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICEBYTARGETCOORDINATE);
    console.log ('TwoFactorAuthMachine - serviceByTargetCoordinateTimeDifference '+timedifference);
    console.log("RdnaClient.js: getServiceByServiceNameSuccess-->" + data);
    alert(data);
  }

  getServiceByTargetCoordinateFailure(data) {
    console.log("RdnaClient.js: getServiceByTargetCoordinateFailure-->" + data);
    alert(data);
  }


  getAllServices() {
    com.uniken.rdnaplugin.RdnaClient.getAllServices(this.getAllServicesSuccess, this.getAllServicesFailure);
    Util.setTime(Constants.ALLSERVICES);
  }

  getAllServicesSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.ALLSERVICES);
    console.log ('TwoFactorAuthMachine - allServicesTimeDifference '+timedifference);
    console.log("RdnaClient.js: getAllServicesSuccess-->" + data);
    alert(data);
  }

  getAllServicesFailure(data) {
    console.log("RdnaClient.js: getAllServicesFailure-->" + data);
    alert(data);
  }


  serviceAccessStart() {
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStart(this.serviceAccessStartSuccess, this.serviceAccessStartFailure, [this.serviceStringJson]);
    Util.setTime(Constants.SERVICEACCESSSTART);
  }

  serviceAccessStartSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICEACCESSSTART);
    console.log ('TwoFactorAuthMachine - serviceAccessStartTimeDifference '+timedifference);
    console.log("RdnaClient.js: serviceAccessStartSuccess-->" + data);
    alert(data);
  }

  serviceAccessStartFailure(data) {
    console.log("RdnaClient.js: serviceAccessStartSuccess-->" + data);
    alert(data);
  }


  serviceAccessStop() {
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStop(this.serviceAccessStopSuccess, this.serviceAccessStopFailure, [this.serviceStringJson]);
    Util.setTime(Constants.SERVICEACCESSSTOP);
  }
  serviceAccessStopSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICEACCESSSTOP);
    console.log ('TwoFactorAuthMachine - serviceAccessStartTimeDifference '+timedifference);
    console.log("RdnaClient.js: serviceAccessStopSuccess-->" + data);
    alert(data);
  };
  serviceAccessStopFailure(data) {
    console.log("RdnaClient.js: serviceAccessStopFailure-->" + data);
    alert(data);
  };


  serviceAccessStartAll() {
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStartAll(this.serviceAccessStartAllSuccess, this.serviceAccessStartAllFailure);
    Util.setTime(Constants.SERVICEACCESSSTARTALL);
  }

  serviceAccessStartAllSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICEACCESSSTARTALL);
    console.log ('TwoFactorAuthMachine - serviceAccessStartAllTimeDifference '+timedifference);
    console.log("RdnaClient.js: serviceAccessStartAllSuccess-->" + data);
    alert(data);
  }

  serviceAccessStartAllFailure(data) {
    console.log("RdnaClient.js: serviceAccessStartAllFailure-->" + data);
    alert(data);
  }


  serviceAccessStopAll() {
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStopAll(this.serviceAccessStopAllSuccess, this.serviceAccessStopAllSuccess);
    Util.setTime(Constants.SERVICEACCESSSTOPALL);
  }

  serviceAccessStopAllSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SERVICEACCESSSTOPALL);
    console.log ('TwoFactorAuthMachine - serviceAccessStopAllTimeDifference '+timedifference);
    console.log("RdnaClient.js: serviceAccessStopAllSuccess-->" + data);
    alert(data);
  }

  serviceAccessStopAllFailure(data) {
    console.log("RdnaClient.js: serviceAccessStopAllFailure-->" + data);
    alert(data);
  }




  getDefaultCipherSpec() {
    com.uniken.rdnaplugin.RdnaClient.getDefaultCipherSpec(this.getDefaultCipherSpecSuccess, this.getDefaultCipherSpecFailure);
    Util.setTime(Constants.DEFAULTCIPHERSPEC);
  }
  getDefaultCipherSpecSuccess(data) {
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.cipherSpect = jsonObj.response;
    var timedifference = Util.getTimeDifference(Constants.DEFAULTCIPHERSPEC);
    console.log ('TwoFactorAuthMachine - defaultCipherTimeDifference '+timedifference);
    console.log("RdnaClient.js: getDefaultCipherSpecSuccess-->" + data);
    alert(data);
  }

  getDefaultCipherSpecFailure(data) {
    console.log("RdnaClient.js: getDefaultCipherSpecFailure-->" + data);
    alert(data);
  }



  getDefaultCipherSalt() {
    com.uniken.rdnaplugin.RdnaClient.getDefaultCipherSalt(this.getDefaultCipherSaltSuccess, this.getDefaultCipherSaltFailure);
    Util.setTime(Constants.DEFAULTCIPHERSALT);
  }
  getDefaultCipherSaltSuccess(data) {
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.cipherSalt = jsonObj.response;
    var timedifference = Util.getTimeDifference(Constants.DEFAULTCIPHERSALT);
    console.log ('TwoFactorAuthMachine - defaultCipherSaltTimeDifference '+timedifference);
    console.log("RdnaClient.js: getDefaultCipherSaltSuccess-->" + data);
    alert(data);
  }

  getDefaultCipherSaltFailure(data) {
    console.log("RdnaClient.js: getDefaultCipherSaltFailure-->" + data);
    alert(data);
  }



  encryptDataPacket() {
    com.uniken.rdnaplugin.RdnaClient.encryptDataPacket(this.encryptDataPacketSuccess, this.encryptDataPacketFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE, this.cipherSpect, this.cipherSalt, this.plainText]);
    Util.setTime(Constants.ENCRYPTDATAPACKET);
  }

  encryptDataPacketSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.ENCRYPTDATAPACKET);
    console.log ('TwoFactorAuthMachine - encryptDataPacketTimeDifference '+timedifference);
    console.log("RdnaClient.js: encryptDataPacketSuccess-->" + data);
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.encryptDataPacketOutput = jsonObj.response;

    
    alert(data);
  }
  encryptDataPacketFailure(data) {
    console.log("RdnaClient.js: encryptDataPacketFailure-->" + data);
    alert(data);
  }


  decryptDataPacket() {
    com.uniken.rdnaplugin.RdnaClient.decryptDataPacket(this.decryptDataPacketSuccess, this.decryptDataPacketFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE, this.cipherSpect, this.cipherSalt, this.encryptDataPacketOutput]);
    Util.setTime(Constants.DECRYPTDATAPACKET);
  }

  decryptDataPacketSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.DECRYPTDATAPACKET);
    console.log ('TwoFactorAuthMachine - decryptDataPacketTimeDifference '+timedifference);
    console.log("RdnaClient.js: decryptDataPacketSuccess-->" + data);
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.decryptDataPacketOutput = jsonObj.response;
    console.log("RdnaClient.js: decryptDataPacketSuccess-->" + data);
    alert(data);
  }

  decryptDataPacketFailure(data) {
    console.log("RdnaClient.js: decryptDataPacketFailure-->" + data);
    alert(data);
  }

  encryptHttpRequest() {
    com.uniken.rdnaplugin.RdnaClient.encryptHttpRequest(this.encryptHttpRequestSuccess, this.encryptHttpRequestFailure, [2, this.cipherSpect, this.cipherSalt, this.plainHttpRequest]);
  }

  encryptHttpRequestSuccess(data) {
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.encryptHttpRequestOutput = jsonObj.response;
    console.log("RdnaClient.js: encryptHttpRequestSuccess-->" + data);
    alert(data);
  }

  encryptHttpRequestFailure(data) {
    console.log("RdnaClient.js: encryptHttpRequestFailure-->" + data);
    alert(data);
  }


  decryptHttpResponse() {
    com.uniken.rdnaplugin.RdnaClient.decryptHttpResponse(this.decryptHttpResponseSuccess, this.decryptHttpResponseFailure, [2, this.cipherSpect, this.cipherSalt, this.encryptHttpRequestOutput]);
  }

  decryptHttpResponseSuccess(data) {
    let jsonObj: any;
    jsonObj = JSON.parse(data);
    this.decryptDataPacketOutput = jsonObj.response;
    console.log("RdnaClient.js: decryptHttpResponseSuccess-->" + data);
    alert(data);
  }

  decryptHttpResponseFailure(data) {
    console.log("RdnaClient.js: decryptHttpResponseFailure-->" + data);
    alert(data);
  }


  getSessionID() {
    com.uniken.rdnaplugin.RdnaClient.getSessionID(this.getSessionIDSuccess, this.getSessionIDFailure);
    Util.setTime(Constants.SESSIONID);
  }

  getSessionIDSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SESSIONID);
    console.log ('TwoFactorAuthMachine - sessionIDTimeDifference '+timedifference);
    console.log("RdnaClient.js: getSessionIDSuccess-->" + data);
    alert(data);
  }

  getSessionIDFailure(data) {
    console.log("RdnaClient.js: getSessionIDFailure-->" + data);
    alert(data);
  }

  getSDKVersion() {
    com.uniken.rdnaplugin.RdnaClient.getSDKVersion(this.getSDKVersionSuccess, this.getSDKVersionFailure);
    Util.setTime(Constants.SDKVERSION);
  }

  getSDKVersionSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.SDKVERSION);
    console.log ('TwoFactorAuthMachine - sdkVersionTimeDifference '+timedifference);
    console.log("RdnaClient.js: getSDKVersionSuccess-->" + data);
    alert(data);
  }

  getSDKVersionFailure(data) {
    console.log("RdnaClient.js: getSDKVersionFailure-->" + data);
    alert(data);
  }

  setApplicationVersion() {
    com.uniken.rdnaplugin.RdnaClient.setDeviceToken(this.setApplicationVersionSuccess, this.setApplicationVersionFailure, ["5.3.7"]);
    Util.setTime(Constants.APPLICATIONVERSION);
  }

  setApplicationVersionSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.APPLICATIONVERSION);
    console.log ('TwoFactorAuthMachine - setApplicationVersionSuccessTimeDifference '+timedifference);
    console.log("RdnaClient.js: setApplicationVersionSuccess-->" + data);
    alert(data);
  }

  setApplicationVersionFailure(data) {
    console.log("RdnaClient.js: setApplicationVersionFailure-->" + data);
    alert(data);
  }

  setDeviceToken() {
    com.uniken.rdnaplugin.RdnaClient.setDeviceToken(this.setDeviceTokenSuccess, this.setDeviceTokenFailure, ["DEVICETOKEN"]);
    Util.setTime(Constants.DEVICETOKEN);
  }

  setDeviceTokenSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.DEVICETOKEN);
    console.log ('TwoFactorAuthMachine - setDeviceTokenSuccessTimeDifference '+timedifference);
    console.log("RdnaClient.js: setDeviceTokenSuccess-->" + data);
    alert(data);
  }

  setDeviceTokenFailure(data) {
    console.log("RdnaClient.js: setDeviceTokenFailure-->" + data);
    alert(data);
  }

  terminate() {
    com.uniken.rdnaplugin.RdnaClient.terminate(this.terminateSuccess, this.terminateFailure);
    Util.setTime(Constants.TERMINATE);
  }

  terminateSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.TERMINATE);
    console.log ('TwoFactorAuthMachine - terminateSuccessTimeDifference '+timedifference);
    console.log("RdnaClient.js: terminateSuccess-->" + data);
    alert(data);
  }

  terminateFailure(data) {
    console.log("RdnaClient.js: terminateFailure-->" + data);
    alert(data);
  }

  getAgentID() {
    com.uniken.rdnaplugin.RdnaClient.getAgentID(this.getAgentIDSuccess, this.getAgentIDFailure);
    Util.setTime(Constants.AGENTID);
  }

  getAgentIDSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.AGENTID);
    console.log ('TwoFactorAuthMachine - getAgentIDSuccessTimeDifference '+timedifference);
    console.log("RdnaClient.js: getAgentIDSuccess-->" + data);
    alert(data);
  }

  getAgentIDFailure(data) {
    console.log("RdnaClient.js: getAgentIDFailure-->" + data);
    alert(data);
  }

  getDeviceID() {
    com.uniken.rdnaplugin.RdnaClient.getDeviceID(this.getDeviceIDSuccess, this.getDeviceIDFailure);
    Util.setTime(Constants.DEVICEID);
  }

  getDeviceIDSuccess(data) {
    var timedifference = Util.getTimeDifference(Constants.DEVICEID);
    console.log ('TwoFactorAuthMachine - getDeviceIDSuccesssTimeDifference '+timedifference);
    console.log("RdnaClient.js: getDeviceIDSuccess-->" + data);
    alert(data);
  }

  getDeviceIDFailure(data) {
    console.log("RdnaClient.js: getDeviceIDFailure-->" + data);
    alert(data);
  }

}
