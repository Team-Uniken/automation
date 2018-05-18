import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '../toast/toast';
import { User } from '../../providers/providers';
import { NotificationPage } from '../notification/notification';
import { NotificationHistoryPage } from '../notificationhistory/notificationhistory';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
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
  private signupErrorString: string;


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

  getRegisteredDeviceDetails() {
    com.uniken.rdnaplugin.RdnaClient.getRegisteredDeviceDetails(this.onSuccess, this.onFailure, [this.account.login_id]);
    document.addEventListener('onGetRegistredDeviceDetails', (e: any) => {
      alert("onGetRegistredDeviceDetails success");
      console.log("RdnaClient.js: onGetRegistredDeviceDetails********************************************************" + JSON.stringify(e));
    });

  }

  updateDeviceDetails() {
    com.uniken.rdnaplugin.RdnaClient.updateDeviceDetails(this.onSuccess, this.onFailure, [this.account.login_id, JSON.stringify({ "device": [ { "devUUID": "2TSY20TYOSURSJAPXVSCQF7F7L11EXGVG14NT8IO60QGISJYN9", "devName": "swapnil", "status": "Update", "lastAccessedTs": "2018-05-18T09:07:35UTC", "createdTs": "2018-05-18T08:57:13UTC", "devBind": 0 } ] })]);
    document.addEventListener('onUpdateDeviceDetails', (e: any) => {
      alert("onUpdateDeviceDetails success");
      console.log("RdnaClient.js: onGetRegistredDeviceDetails********************************************************" + JSON.stringify(e));
    });
  }

  onSuccess(data) {
    alert(data);
    console.log("RdnaClient.js: onSuccess");
  }

  onFailure(data) {
    alert(data);
    console.log("RdnaClient.js: onFailure");
  }

}
