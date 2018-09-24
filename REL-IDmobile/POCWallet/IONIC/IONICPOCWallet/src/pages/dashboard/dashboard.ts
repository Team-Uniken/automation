import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, Platform, Alert } from 'ionic-angular';
import { Toast } from '../toast/toast';
import { User } from '../../providers/providers';
import { NotificationPage } from '../notification/notification';
import { NotificationHistoryPage } from '../notificationhistory/notificationhistory';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import { Util } from '../twofatorstate/Util';
import * as Constants from '../twofatorstate/constants';
declare var updateDeviceDetails: any;
declare var com: any;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {

  account: { login_id: string, amount: string, text1: string, text2: string, } = {
    login_id: '',
    amount: '',
    text1: '',
    text2: '',

  };

  // Our translated text strings
  private signupErrorString: string;c
  updateDeviceDetails: any;

  amount: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, public navParams: NavParams, public toast: Toast, platform: Platform, ) {

    this.account.login_id = navParams.get('login_id');
    this.amount = navParams.get('amount');
    this.account.text1 = 'Welcome ' + this.account.login_id;
    this.account.text2 = 'Your wallet balance is ' + this.amount;
    //alert(this.account.login_id+" "+this.amount );
    //this.account.amount = this.amount;
    TwoFactorState.isLoginToDashboard = true;
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

  }


  doAddMoney() {
    // Attempt to login in through our User service
    if (this.account.amount.length === 0) {
      this.toast.showToast("Please enter amount");
      return;
    }

    this.toast.showLoader()
    this.user.addMoney(this.account).subscribe((resp: any) => {
      this.toast.hideLoader();

      if (resp.error) {
        let toast = this.toastCtrl.create({
          message: resp.error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      } else {
        //alert(JSON.stringify(resp));
        this.account.amount = '';
        this.account.text2 = 'Your wallet balance is ' + resp.balance;
      }
    }, (err) => {
      // Unable to sign up
      this.toast.hideLoader();
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  showNotification() {
    this.navCtrl.push(NotificationPage);
  }

  showNotificationHistory() {
    this.navCtrl.push(NotificationHistoryPage);
  }

  getErrorInfo() {
    com.uniken.rdnaplugin.RdnaClient.getErrorInfo(this.getErrorInfoOnSuccess, this.getErrorInfoOnFailure, ["539001398"]);
  }

  showTimeDifferenc() {
    var timeDifference = "";
    var timeDifferenceMap = Util.getAPITIMINGDIFFERENCE();
    Object.keys(timeDifferenceMap).forEach((key) => {
      timeDifference += key + "-" + timeDifferenceMap[key] + "\n";
    });
    alert(timeDifference);

  }


  getRegisteredDeviceDetails() {
    com.uniken.rdnaplugin.RdnaClient.getRegisteredDeviceDetails(this.onSuccess, this.onFailure, [this.account.login_id]);
    Util.setTime(Constants.REGISTERDEVICEDETAILS);
    document.addEventListener('onGetRegistredDeviceDetails', (e: any) => {
      //alert("onGetRegistredDeviceDetails success");
      // this.registerDeviceDetailsData = JSON.stringify(e);
      //const res = JSON.parse(e.respnose);
      const jsonOBJ = JSON.parse(e.response);;
      //alert("ErrorCode : " + jsonOBJ.errCode);
      //alert("1");
      this.updateDeviceDetails = jsonOBJ;
      //alert("2");
      this.updateDeviceDetails.pArgs.response.ResponseData.device[0].devName = "Undefined";
      //alert("3");
      this.updateDeviceDetails.pArgs.response.ResponseData.device[0].status = "Update";
      alert("Device values changed " + this.updateDeviceDetails);
      alert("Device values changed " + updateDeviceDetails);
      console.log("RdnaClient.js: onGetRegistredDeviceDetails********************************************************" + JSON.stringify(e));
      var timedifference = Util.getTimeDifference(Constants.REGISTERDEVICEDETAILS);
      console.log('TwoFactorAuthMachine - registerDeviceDetailsTimedifference ' + timedifference);
    });

  }

  updateDeviceDetailsValue() {
    com.uniken.rdnaplugin.RdnaClient.updateDeviceDetails(this.onSuccess, this.onFailure, [this.account.login_id, JSON.stringify(this.updateDeviceDetails.pArgs.response.ResponseData)]);
    Util.setTime(Constants.UPDATEDEVICEDETAILS);
    document.addEventListener('onUpdateDeviceDetails', (e: any) => {
      alert("UPDATEDEVICEDETAILS " + e.respnose);
      console.log("RdnaClient.js: onGetRegistredDeviceDetails********************************************************" + JSON.stringify(e));
      var timedifference = Util.getTimeDifference(Constants.UPDATEDEVICEDETAILS);
      console.log('TwoFactorAuthMachine - updateDeviceDetailsTimedifference ' + timedifference);
    });
  }

  getAllChallenges(){
    com.uniken.rdnaplugin.RdnaClient.getAllChallenges(this.getAllChallengesSuccess, this.getAllChallengesFailure, [this.account.login_id]);
    Util.setTime(Constants.GET_ALL_CHALLENGES);
    document.addEventListener('onGetAllChallengeStatus', (e: any) => {
      alert("GET_ALL_CHALLENGES"+e.respnose);
      Util.getTimeDifference(Constants.GET_ALL_CHALLENGES);
    });
  }

  updateAllChallenges(){

  }

  onSuccess(data) {
    alert(data);
    console.log("RdnaClient.js: onSuccess");
  }

  onFailure(data) {
    alert(data);
    console.log("RdnaClient.js: onFailure");
  }

  getErrorInfoOnSuccess(data) {
    alert(data);
    console.log("RdnaClient.js: onSuccess");
  }

  getErrorInfoOnFailure(data) {
    alert(data);
    console.log("RdnaClient.js: onFailure");
  }

  getAllChallengesSuccess(data){

  }

  getAllChallengesFailure(data){
    
  }

}
