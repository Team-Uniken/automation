import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Toast } from '../toast/toast';
import { TwoFactorState } from '../twofatorstate/twofatorstate';

declare var com: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    serviceName : string;
  ip : string ;
  port : number;
  serviceStringJson: string;
  cipherSalt: string ;
  cipherSpect : string;
  plainText : string ;
  encryptDataPacketOutput : string ;
  decryptDataPacketOutput : string ; 
  plainHttpRequest : string ;
  encryptHttpRequestOutput : string ;
  decryptHttpResponseOutput : string ; 

  constructor(public navCtrl: NavController, public toast : Toast) {

    this.serviceName='serv3_portF';
    this.ip = "99.99.99.99";
    this.port = 9999;
    this.serviceStringJson= "{\"serviceName\": \"serv3_portF\",\"targetHNIP\": \"99.99.99.99\",\"app_uuid\": \"415a4174-c0c3-4ee4-8931-04c5f325db0c\",\"accessServerName\": \"cluster1\",\"targetPort\": 9999,\"portInfo\": {\"isAutoStartedPort\": 0,\"isLocalhostOnly\": 1,\"isStarted\": 0,\"isPrivacyEnabled\": 1,\"portType\": 1,\"port\": 3652}}";
    this.cipherSalt= "";
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
    
    document.addEventListener('onInitializeCompleted',  (e: any)=> {
      //console.log(e);
      
      alert('onInitializeCompleted');
      let res = JSON.parse(e.response);
      //console.log("error code--->" + responseJson.errCode);

      if (res.errCode == 0) {
        //this.toast.showToast("Initialization Done");

        //  var statusCode = res.pArgs.response.StatusCode;
        //   if (statusCode == 100) {
          let challengeJson;
        if (res.pArgs.response.ResponseData) {
          challengeJson = res.pArgs.response.ResponseData;
          TwoFactorState.initialChallengesJson = challengeJson;
        }
        //com.uniken.rdnaplugin.RdnaClient.getAllServices(this.initSuccess1, this.initFailure1, []);
        //com.uniken.rdnaplugin.RdnaClient.getServiceByServiceName(this.initSuccess1, this.initFailure1, ['pfwsh_portF']);
        
      }
      else
        this.toast.showToast("Initialization Failed"+res.errCode);

      //alert(JSON.stringify(e));
    });
   
    setTimeout(() => {
      this.initRelID();
     }, 2000);
   
  }


  login() {
    this.navCtrl.push(LoginPage);
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }


  initRelID() {
   // this.toast.showLoader();
  com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "10.0.5.21", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
  }


  getServiceByServiceName(){
    com.uniken.rdnaplugin.RdnaClient.getServiceByServiceName(this.getServiceByServiceNameSuccess,this.getServiceByServiceNameFailure,[this.serviceName]);
   }

   getServiceByServiceNameSuccess(data) {
     console.log("RdnaClient.js: getServiceByServiceNameSuccess-->"+data);
     alert(data);
   }

   getServiceByServiceNameFailure(data) {
    console.log("RdnaClient.js: getServiceByServiceNameFailure-->"+data);
    alert(data);
  }


   getServiceByTargetCoordinate(){
    com.uniken.rdnaplugin.RdnaClient.getServiceByTargetCoordinate(this.getServiceByTargetCoordinateSuccess,this.getServiceByTargetCoordinateFailure, [this.ip, this.port]);
   }

   getServiceByTargetCoordinateSuccess(data){
    console.log("RdnaClient.js: getServiceByServiceNameSuccess-->"+data);
    alert(data);
   }

   getServiceByTargetCoordinateFailure(data){
    console.log("RdnaClient.js: getServiceByTargetCoordinateFailure-->"+data);
    alert(data);
   }


   getAllServices(){
    com.uniken.rdnaplugin.RdnaClient.getAllServices(this.getAllServicesSuccess,this.getAllServicesFailure);
   }

   getAllServicesSuccess(data){
    console.log("RdnaClient.js: getAllServicesSuccess-->"+data);
    alert(data);
   }

   getAllServicesFailure(data){
    console.log("RdnaClient.js: getAllServicesFailure-->"+data);
    alert(data);
   }

  
   serviceAccessStart(){
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStart(this.serviceAccessStartSuccess,this.serviceAccessStartFailure,[this.serviceStringJson]);
   }

   serviceAccessStartSuccess(data){
    console.log("RdnaClient.js: serviceAccessStartSuccess-->"+data);
    alert(data);
   }

   serviceAccessStartFailure(data){
    console.log("RdnaClient.js: serviceAccessStartSuccess-->"+data);
    alert(data);
  }
  

   serviceAccessStop(){
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStop(this.serviceAccessStopSuccess,this.serviceAccessStopFailure,[this.serviceStringJson]);
   }
   serviceAccessStopSuccess(data){
    console.log("RdnaClient.js: serviceAccessStopSuccess-->"+data);
    alert(data);
   };
   serviceAccessStopFailure(data){
    console.log("RdnaClient.js: serviceAccessStopFailure-->"+data);
    alert(data);
   };

  
   serviceAccessStartAll(){
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStartAll(this.serviceAccessStartAllSuccess,this.serviceAccessStartAllFailure);
   }

   serviceAccessStartAllSuccess(data){
    console.log("RdnaClient.js: serviceAccessStartAllSuccess-->"+data);
    alert(data);
   }

   serviceAccessStartAllFailure(data){
    console.log("RdnaClient.js: serviceAccessStartAllFailure-->"+data);
    alert(data);
   }

  
   serviceAccessStopAll(){
    com.uniken.rdnaplugin.RdnaClient.serviceAccessStopAll(this.serviceAccessStopAllSuccess,this.serviceAccessStopAllSuccess);
   }

   serviceAccessStopAllSuccess(data){
    console.log("RdnaClient.js: serviceAccessStopAllSuccess-->"+data);
    alert(data);
   }

   serviceAccessStopAllFailure(data){
    console.log("RdnaClient.js: serviceAccessStopAllFailure-->"+data);
    alert(data);
   }

  


   getDefaultCipherSpec(){
    com.uniken.rdnaplugin.RdnaClient.getDefaultCipherSpec(this.getDefaultCipherSpecSuccess,this.getDefaultCipherSpecFailure);
   }
   getDefaultCipherSpecSuccess(data){
     let jsonObj : any;
     jsonObj = JSON.parse(data);
      this.cipherSpect = jsonObj.response;

    console.log("RdnaClient.js: getDefaultCipherSpecSuccess-->"+data);
    alert(data);
   }

   getDefaultCipherSpecFailure(data){
    console.log("RdnaClient.js: getDefaultCipherSpecFailure-->"+data);
    alert(data);
   }


  
   getDefaultCipherSalt(){
    com.uniken.rdnaplugin.RdnaClient.getDefaultCipherSalt(this.getDefaultCipherSaltSuccess,this.getDefaultCipherSaltFailure);
   }
   getDefaultCipherSaltSuccess(data){
    let jsonObj : any;
    jsonObj = JSON.parse(data);
     this.cipherSalt = jsonObj.response;

    console.log("RdnaClient.js: getDefaultCipherSaltSuccess-->"+data);
    alert(data);
   }

   getDefaultCipherSaltFailure(data){
    console.log("RdnaClient.js: getDefaultCipherSaltFailure-->"+data);
    alert(data);
   }


  
   encryptDataPacket(){
    com.uniken.rdnaplugin.RdnaClient.encryptDataPacket(this.encryptDataPacketSuccess,this.encryptDataPacketFailure,[2,this.cipherSpect,this.cipherSalt,this.plainText]);
   }

   encryptDataPacketSuccess(data){
    let jsonObj : any;
    jsonObj = JSON.parse(data);
     this.encryptDataPacketOutput = jsonObj.response;

    console.log("RdnaClient.js: encryptDataPacketSuccess-->"+data);
    alert(data);
   }
   encryptDataPacketFailure(data){
    console.log("RdnaClient.js: encryptDataPacketFailure-->"+data);
    alert(data);
   }

  
   decryptDataPacket(){
    com.uniken.rdnaplugin.RdnaClient.decryptDataPacket(this.decryptDataPacketSuccess,this.decryptDataPacketFailure,[2,this.cipherSpect,this.cipherSalt,this.encryptDataPacketOutput]);
  }

  decryptDataPacketSuccess(data){
    let jsonObj : any;
    jsonObj = JSON.parse(data);
     this.decryptDataPacketOutput = jsonObj.response;
    console.log("RdnaClient.js: decryptDataPacketSuccess-->"+data);
    alert(data);
  }

  decryptDataPacketFailure(data){
    console.log("RdnaClient.js: decryptDataPacketFailure-->"+data);
    alert(data);
  }
  
    encryptHttpRequest(){
      com.uniken.rdnaplugin.RdnaClient.encryptHttpRequest(this.encryptHttpRequestSuccess,this.encryptHttpRequestFailure,[2,this.cipherSpect,this.cipherSalt,this.plainHttpRequest]);
     }

     encryptHttpRequestSuccess(data){
      let jsonObj : any;
      jsonObj = JSON.parse(data);
       this.encryptHttpRequestOutput = jsonObj.response;
      console.log("RdnaClient.js: encryptHttpRequestSuccess-->"+data);
      alert(data);
     }

     encryptHttpRequestFailure(data){
      console.log("RdnaClient.js: encryptHttpRequestFailure-->"+data);
      alert(data);
     }

    
     decryptHttpResponse(){
      com.uniken.rdnaplugin.RdnaClient.decryptHttpResponse(this.decryptHttpResponseSuccess,this.decryptHttpResponseFailure,[2,this.cipherSpect,this.cipherSalt,this.encryptHttpRequestOutput]);
     }

      decryptHttpResponseSuccess(data){
        let jsonObj : any;
        jsonObj = JSON.parse(data);
        this.decryptDataPacketOutput = jsonObj.response;
        console.log("RdnaClient.js: decryptHttpResponseSuccess-->"+data);
        alert(data);
       }
  
       decryptHttpResponseFailure(data){
        console.log("RdnaClient.js: decryptHttpResponseFailure-->"+data);
        alert(data);
       }
   
  
   getSessionID(){
    com.uniken.rdnaplugin.RdnaClient.getSessionID(this.getSessionIDSuccess,this.getSessionIDFailure);
   }

   getSessionIDSuccess(data){
    console.log("RdnaClient.js: getSessionIDSuccess-->"+data);
    alert(data);
   }

   getSessionIDFailure(data){
    console.log("RdnaClient.js: getSessionIDFailure-->"+data);
    alert(data);
   }
  
  //  getAgentID(){
  //   com.uniken.rdnaplugin.RdnaClient.getAgentID((response)=>{
  //     this.showMessage('getAgentID',JSON.stringify(response),false);
  //   });
  //  }
  
  //  getDeviceID(){
  //   com.uniken.rdnaplugin.RdnaClient.getDeviceID((response)=>{
  //     this.showMessage('getDeviceID',JSON.stringify(response),false);
  //   });
  //  }


  initSuccess(data) {
   // this.toast.hideLoader();
    console.log("RdnaClient.js: initSuccess");
  }

  initFailure(data) {
    //this.toast.hideLoader();
    this.toast.hideLoader();
    console.log("RdnaClient.js: initFailure");
  }

}
