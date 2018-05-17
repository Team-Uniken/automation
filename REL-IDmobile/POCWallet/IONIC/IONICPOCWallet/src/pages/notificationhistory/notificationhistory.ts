import { Component,ChangeDetectorRef,NgZone } from '@angular/core';
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
  selector: 'notificationhistory-login',
  templateUrl: 'notificationhistory.html'
})

export class NotificationHistoryPage {

  notificationList: any;
  static getNotificationHistoryListener: any;
  static updateListener: any;
  refresh:boolean = false;


  account: { login_id: string, password: string } = {
    login_id: 'swap7',
    password: '1111'
    //login_id: '',
    //password: ''
  };

  // Our translated text strings
  private loginErrorString: string;
  private ref:ChangeDetectorRef;

  constructor(public events: Events, public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService,private _ngZone: NgZone) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.callGetMyNotificationHistory();


    if (NotificationHistoryPage.getNotificationHistoryListener) {
      document.removeEventListener('onGetNotificationHistory', NotificationHistoryPage.getNotificationHistoryListener)
    }
    
    NotificationHistoryPage.getNotificationHistoryListener = (e: any) => {
      console.log("***********************"+this.replaceString("\n","\\n",e.response));
      this._ngZone.run(() => {
        
      //const res = JSON.parse(this.replaceString("\n","\\n",e.response));
      const res = JSON.parse(this.replaceString("\n","\\n",e.response));
      //console.log(res);
      if (res.errCode === 0) {
        const statusCode = res.pArgs.response.StatusCode;
        if (statusCode === 100) {
          if (res.pArgs.response.ResponseData) {
            var count = res.pArgs.response.ResponseData.history.length;
            this.notificationList = res.pArgs.response.ResponseData.history;
          }
        }
      }
    });
    };

   
    document.addEventListener('onGetNotificationsHistory', NotificationHistoryPage.getNotificationHistoryListener);
    //document.addEventListener('onUpdateNotification', NotificationPage.updateListener);
  }


  addslashes( str:string ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
  callGetMyNotificationHistory() {
    //[RECORD_COUNT, START_RECORD, ENTERPRISE_ID, START_DATE, END_DATE, NOTIFICATION_STATUS, NOTIFICATION_ACTION_PERFORMED, KEYWORD_SEARCH, DEVICE_ID]
    var recordCount: string = "1";
    var startIndex: string = "1";
    var enterpriseID: string = "";
    var startDate: string = "";
    var endDate: string = "";
    var notificationStatus: string = "";
    var actionPerformed: string = "";
    var keywordSearch: string = "";
    var deviceID: string = "";
    com.uniken.rdnaplugin.RdnaClient.getNotificationHistory(this.initSuccess, this.initFailure, [recordCount, startIndex, enterpriseID, startDate, endDate,notificationStatus,actionPerformed,keywordSearch,deviceID]);
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
    return bulletList;
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
      //alert(action);
      //this.toast.showLoader();
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
