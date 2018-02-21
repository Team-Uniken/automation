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

  constructor(public navCtrl: NavController, public toast : Toast) {

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
   
  }


  login() {
    this.navCtrl.push(LoginPage);
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }


  initRelID() {
   // this.toast.showLoader();
   //com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "10.0.6.17", "443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
   
   com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "10.0.5.24", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
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
