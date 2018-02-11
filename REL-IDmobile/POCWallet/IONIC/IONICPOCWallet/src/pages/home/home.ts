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

    document.addEventListener('onInitializeCompleted', function (e: any) {
      //console.log(e);
      
      alert('onInitializeCompleted');
      let res = JSON.parse(e.response);
      //console.log("error code--->" + responseJson.errCode);

      if (res.errCode == 0) {
        //this.toast.showToast("Initialization Done");

        //  var statusCode = res.pArgs.response.StatusCode;
        //   if (statusCode == 100) {
        if (res.pArgs.response.ResponseData) {
          this.challengeJson = res.pArgs.response.ResponseData;
          TwoFactorState.initialChallengesJson = this.challengeJson;
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
    com.uniken.rdnaplugin.RdnaClient.initialize(this.initSuccess, this.initFailure, ["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", "poc7-uniken.com", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", ""]);
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
