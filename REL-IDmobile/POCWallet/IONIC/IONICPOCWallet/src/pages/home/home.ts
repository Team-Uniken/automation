import { Component } from '@angular/core';
import { NavController,AlertController,Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { RegisterPageMRI } from '../register_mri/register_mri';
import { TestPage } from '../test/test';
import { Toast } from '../toast/toast';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import * as Constants from '../twofatorstate/constants';

declare var com: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public toast : Toast,public alertCtrl: AlertController,public platform:Platform) {
    
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
    if(Constants.IS_MRI == 0)
    this.navCtrl.push(RegisterPage);
    else
    this.navCtrl.push(RegisterPageMRI);
  }

  test() {
    this.navCtrl.push(TestPage);
  }
  
  initRelID() {
   // this.toast.showLoader();
   if(Constants.IS_MRI == 1)
   com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "18.232.236.255", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", "",com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_NO_LOGS]);
   else
   com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "10.0.5.21", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
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
