import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicPage, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/providers';
import { DashboardPage } from '../dashboard/dashboard';
import { Toast } from '../toast/toast';
import { elementDef } from '@angular/core/src/view/element';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'
import { TwoFactorState } from '../twofatorstate/twofatorstate';

declare var com;
@Component({
  selector: 'notification-login',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  notificationList: any;
  static getNotificationListener: any;
  static updateListener: any;
  account: { login_id: string, password: string } = {
    login_id: 'swap7',
    password: '1111'
    //login_id: '',
    //password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public events: Events, public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.callGetMyNotification();

    // this.notificationList = [{
    //   notification_uuid: "f05b1ddd-b154-4fe6-bc61-36d670f74390",
    //   created_ts: "2018-02-12T10:32:00UTC",
    //   expiry_timestamp: "2018-02-12T10:35:00UTC",
    //   message: {
    //     subject: "Login Attempt",
    //     body: "You are attempting to log into the CBC website\nRemember that our website will NEVER ask for your password\nPlease confirm or reject"
    //   },
    //   action: [
    //     {
    //       label: "Accept",
    //       action: "Accept",
    //       authlevel: "0"
    //     },
    //     {
    //       label: "Reject",
    //       action: "Reject",
    //       authlevel: "0"
    //     }
    //   ]
    // },{
    //   notification_uuid: "f05b1ddd-b154-4fe6-bc61-36d670f74390",
    //   created_ts: "2018-02-12T10:32:00UTC",
    //   expiry_timestamp: "2018-02-12T10:35:00UTC",
    //   message: {
    //     subject: "Login Attempt",
    //     body: "You are attempting to log into the CBC website\nRemember that our website will NEVER ask for your password\nPlease confirm or reject"
    //   },
    //   action: [
    //     {
    //       label: "Accept",
    //       action: "Accept",
    //       authlevel: "0"
    //     },
    //     {
    //       label: "Reject",
    //       action: "Reject",
    //       authlevel: "0"
    //     }
    //   ]
    // }]
    //this.events.subscribe('login:success', this.callLoginApi);

    if (NotificationPage.getNotificationListener) {
      document.removeEventListener('onGetNotifications', NotificationPage.getNotificationListener)
    }
    if (NotificationPage.updateListener) {
      document.removeEventListener('onUpdateNotification', NotificationPage.updateListener)
    }
    NotificationPage.getNotificationListener = (e: any) => {

      alert(e.response);
      const res = JSON.parse(e.response);
      console.log(res);
      if (res.errCode === 0) {
        const statusCode = res.pArgs.response.StatusCode;
        console.log("statusCode===>"+e.response);
        if (statusCode === 100) {
          if (res.pArgs.response.ResponseData) {
            alert(e.response);
            var count = res.pArgs.response.ResponseData.notifications.length;
            this.notificationList = res.pArgs.response.ResponseData.notifications;
          }
        }
      }

    };

    NotificationPage.updateListener = (e: any) => {
      const res = JSON.parse(e.response);
    if (res.errCode === 0) {
      const statusCode = res.pArgs.response.StatusCode;
      if (statusCode === 100) {
        //this.props.navigator.pop();
        for (var i = 0; i < this.notificationList.length; i++) {
          var notification = this.notificationList[i];
          if (notification.notification_uuid === res.pArgs.response.ResponseData.notification_uuid) {
            this.notificationList.splice(i, 1);
            break;
          }
        }
      }else{
        alert(res.pArgs.response.StatusMsg);
        this.callGetMyNotification();
      }
    }else{
      alert("Notification update error : "+res.errCode);
    }
    };
    document.addEventListener('onGetNotifications', NotificationPage.getNotificationListener);
    document.addEventListener('onUpdateNotification', NotificationPage.updateListener);
  }



  callGetMyNotification() {
    var recordCount: string = "0";
    var startIndex: string = "1";
    var enterpriseID: string = "";
    var startDate: string = "";
    var endDate: string = "";
    com.uniken.rdnaplugin.RdnaClient.getNotifications(this.initSuccess, this.initFailure, [recordCount, startIndex, enterpriseID, startDate, endDate]);
  }

   replaceString(find, replace, str) {
    while (str.indexOf(find) > -1) {
      str = str.replace(find, replace);
    }
    return str;
  }


  getBulletList(body){
    var bodyarray = body.split("\n");
      var amount = bodyarray[3];
      var font = 22;
    
    var bulletList = [];
    
    for(let i = 0; i < bodyarray.length; i++){
      var bodyStr = bodyarray[i];
      bodyStr = this.replaceString('<br/>','\n',bodyStr);
      bulletList.push(bodyStr);
    }

    return ["abc","hhh"];
  }

  getButtonList(actions){

   
    var count = actions.length;
    var buttonList=[];
    for(var i = 0; i<count;i++ ){
      var colorTemp:string;
     var button = actions[i];
    switch (i) {
      case 0:
      colorTemp = "secondary"
        break;
        case 1:
        colorTemp = "danger"
        break;    
        case 2:
        colorTemp = "light"
        break;
    
      default:
        break;
    }

      buttonList.push({color:colorTemp,action:button.action,label:button.label});
    }

    return buttonList;
  }

  notificationClick(notification:any,action:string){
      alert(action);
      this.callUpdateNotification(notification.notification_uuid,action);
  }


  callUpdateNotification(notificationID:string,action:string){
    com.uniken.rdnaplugin.RdnaClient.updateNotifications(this.updateSuccess,this.updateFailure,[notificationID,action]);
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

  updateSuccess(data) {
    // this.toast.hideLoader();
    console.log("RdnaClient.js: updateSuccess");
  }

  updateFailure(data) {
    //this.toast.hideLoader();
    this.toast.hideLoader();
    console.log("RdnaClient.js: updateSuccess");
  }
  
  
  
  
  
  
  callLoginApi() {
    this.toast.showLoader();
    this.user.login(this.account).subscribe((resp: any) => {
      this.toast.hideLoader();
      if (resp.error) {
        this.toast.showToast(resp.error);
      } else {
        this.navCtrl.push(DashboardPage, { login_id: resp.login_id, amount: resp.balance });
      }
    }, (err) => {
      this.toast.hideLoader();
      this.toast.showToast(this.loginErrorString);
    });
  }

  // Attempt to login in through our User service
  doLogin() {

    if (!this.validate())
      return;

    this.toast.showLoader();
    let state: TwoFactorState;
    state = new TwoFactorState(this.navCtrl, this.toast, this.events);
    state.callback = this;
    state.doLogin(this.account.login_id.trim(), this.account.password.trim());
  }


  validate() {
    if (this.account.login_id.trim().length === 0) {
      this.toast.showToast("Please enter loginID");
      return false;
    }
    if (this.account.password.trim().length === 0) {
      this.toast.showToast("Please enter RPIN");
      return false;
    }
    return true;
  }
}
