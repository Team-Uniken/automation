import { Component } from '@angular/core';
import { NavController,AlertController,Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { RegisterPageMRI } from '../register_mri/register_mri';
import { TestPage } from '../test/test';
import { Toast } from '../toast/toast';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import * as Constants from '../twofatorstate/constants';
import { Util } from '../twofatorstate/Util';

declare var com: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public toast : Toast,public alertCtrl: AlertController,public platform:Platform) {
    
    document.addEventListener('onInitializeCompleted',  (e: any)=> {
      Util.getTimeDifference(Constants.INITIALIZE);
      //console.log(e);
      
      let res = JSON.parse(e.response);
      //console.log("error code--->" + responseJson.errCode);

      if (res.errCode == 0) {
        //this.toast.showToast("Initialization Done");
        alert('onInitializeCompleteeeeeeeeeeeeed');
        //  var statusCode = res.pArgs.response.StatusCode;
        //   if (statusCode == 100) {
          let challengeJson;
        if (res.pArgs.response.ResponseData) {
          challengeJson = res.pArgs.response.ResponseData;
          TwoFactorState.initialChallengesJson = challengeJson;
        }        
      }
      else
        this.toast.showToast("Initialization Failed");

      //alert(JSON.stringify(e));
    });
   
    setTimeout(() => {
      this.initRelID();
     }, 2000);

     document.addEventListener('onSecurityThreat',  (e: any)=> {
      //alert(JSON.parse(JSON.stringify(e)).response);
      //platform.exitApp();
      //ionic.Platform.exitApp();
      let confirmAlert = this.alertCtrl.create({
        title: 'Threat detected',
        message: JSON.parse(JSON.stringify(e)).response,
        buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            //confirmAlert.
            if(this.platform.is('android'))
            this.platform.exitApp();
          }
        }]
      });
      confirmAlert.present();
    });
     
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  register() {
    //this.navCtrl.push(RegisterPage);
    if(Constants.IS_MRI == 0)
    this.navCtrl.push(RegisterPage);
    else
    this.navCtrl.push(RegisterPageMRI); 
  }

  test() {
    this.navCtrl.push(TestPage);
  }

  showTimeDifferenc() {
    var timeDifference = "";
    var timeDifferenceMap = Util.getAPITIMINGDIFFERENCE();
    Object.keys(timeDifferenceMap).forEach((key)=>{
      timeDifference += key+"-"+timeDifferenceMap[key]+"\n";   
    });    
    alert(timeDifference);
  }
  
  initRelID() {
   // this.toast.showLoader();
   if(Constants.IS_MRI == 1){
     //alert("1");
     //com.uniken.rdnaplugin.RdnaClient.getSDKVersion(this.initSuccess, this.initFailure);
     //com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "poc6-uniken.com", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", "", "", "", ""]);
     com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "18.211.218.44", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", "", "", "", ""]);
     Util.setTime(Constants.INITIALIZE);
   //com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "18.232.236.255", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", "",com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_NO_LOGS]);
      //alert("2");
  } else{
    com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "poc7-uniken.com", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", "", "", "", ""]);
     //com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "10.0.5.21", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
   }
  }


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
