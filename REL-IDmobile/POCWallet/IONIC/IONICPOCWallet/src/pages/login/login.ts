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
import * as Constants from '../twofatorstate/constants';
import { Util } from '../twofatorstate/Util';

declare var com: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  account: { login_id: string, password: string, acess_code: string } = {
    login_id: 'Nikhil',
    password: '1234',
    acess_code: '1111'
  };

  // Our translated text strings
  private loginErrorString: string;
  sessionID:string;

  constructor(public events: Events, public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService) {
    this.sessionID="";
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    //this.events.subscribe('login:success', this.callLoginApi);
    this.callLoginApi = this.callLoginApi.bind(this);
    this.onSuccessSessionId = this.onSuccessSessionId.bind(this);
    document.addEventListener('onHttpResponse',this.activation);

    com.uniken.rdnaplugin.RdnaClient.getSessionID(this.onSuccessSessionId,this.onFailureSessionId);
  }

  activation(e:any) {
    console.log(e);
   var timedifference = Util.getTimeDifference(Constants.OPEN_HTTP_CONNECTION);
   console.log('login - ActivateUserTimedifference '+timedifference);

    this.toast.hideLoader();
    var jsonObj = JSON.parse(e.response);

    if (jsonObj.errorCode == 0) {
      alert("Successfully created user");
    } else {  
        alert("Something went wrong, please try again..!");       
    }
   }

  callLoginApi() {
    if(Constants.IS_MRI == 1){
      this.navCtrl.push(DashboardPage,{login_id:this.account.login_id , amount:0});
      return;
    }else {
      //DummyWalletAPI2 is not working 
      this.navCtrl.push(DashboardPage,{login_id:this.account.login_id , amount:0});
      return;
    }
    
    //uncomment this line for dummywallet api purpose
    /* this.toast.showLoader();
    this.user.login(this.account).subscribe((resp: any) => {
      this.toast.hideLoader();
      if (resp.error) {
        this.toast.showToast(resp.error);
      } else {
        this.navCtrl.push(DashboardPage,{login_id: resp.login_id, amount:resp.balance});
      }
    }, (err) => {
      this.toast.hideLoader();
      this.toast.showToast(this.loginErrorString);
    }); */
      }

  // Attempt to login in through our User service
  doLogin() {

    if(!this.validate())
    return;
    
    this.toast.showLoader();
    let state:TwoFactorState;
    state = new TwoFactorState(this.navCtrl,this.toast,this.events);
    state.callback = this;
    alert(this.account.acess_code.trim());
    if(this.account.acess_code.trim() === "")
    state.doLogin(this.account.login_id.trim(), this.account.password.trim());
    else 
    state.doActivationLogin(this.account.login_id.trim(), this.account.password.trim(), this.account.acess_code.trim());
  }


  validate(){
    if(this.account.login_id.trim().length===0){
     this.toast.showToast("Please enter loginID");
      return false;
    }
    if(this.account.password.trim().length===0){
      this.toast.showToast("Please enter RPIN");
      return false;
    }
    return true;
  }

  doSignup() {
  
   alert(this.sessionID);

    var URL = Constants.HOSTNAME+"enrollUser.htm";
    //console.log("---Register ---baseUrl =" + baseUrl)

    // USER_ID_STR, mandatory = true          // will be email Id
    // GROUP_NAME_STR, mandatory = true       // Hardcode
    // SECONDARY_GROUP_NAMES_STR, mandatory = false
    // EMAIL_ID_STR, mandatory = false          // sholud be there
    // MOB_NUM_ID_STR, mandatory = false        // sholud be there
    // IS_RELIDZERO_ENABLED, mandatory = true     // hardcode

    var userMap = {
      "firstName":this.account.login_id,
      "lastName":"kulkarni",
      "userId":this.account.login_id,
      "actCode":"1111",
      "groupName":"group1",
      "emailId":"onkar.kulkarni@uniken.com",
      "mobNum":"9168086688",
      "username":"sruser",
      "password":"1e99b14aa45d6add97271f8e06adacda4e521ad98a4ed18e38cfb0715e7841d2",
      "isRELIDZeroEnabled":"true",
      "apiversion":"v1",
      "sessionId":this.sessionID,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length":"0"
    };

    com.uniken.rdnaplugin.RdnaClient.openHttpConnection(this.onSuccess, this.onFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAHttpMethods.RDNA_HTTP_POST,URL,JSON.stringify(userMap),""]);  
    Util.setTime(Constants.OPEN_HTTP_CONNECTION); 
    
    
  }

  doSignupDevice() {
  
    alert(this.sessionID);

    var URL = Constants.HOSTNAME+"enrollUserDevice.htm";
    //console.log("---Register ---baseUrl =" + baseUrl)

    // USER_ID_STR, mandatory = true          // will be email Id
    // GROUP_NAME_STR, mandatory = true       // Hardcode
    // SECONDARY_GROUP_NAMES_STR, mandatory = false
    // EMAIL_ID_STR, mandatory = false          // sholud be there
    // MOB_NUM_ID_STR, mandatory = false        // sholud be there
    // IS_RELIDZERO_ENABLED, mandatory = true     // hardcode

    var userMap = {
      "userId":this.account.login_id,
      "actCode":"1111",
      "username":"sruser",
      "password":"1e99b14aa45d6add97271f8e06adacda4e521ad98a4ed18e38cfb0715e7841d2",
      "apiversion":"v1",
      "sessionId":this.sessionID,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length":"0"
    };

    com.uniken.rdnaplugin.RdnaClient.openHttpConnection(this.onSuccess, this.onFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAHttpMethods.RDNA_HTTP_POST,URL,JSON.stringify(userMap),""]);  
    Util.setTime(Constants.OPEN_HTTP_CONNECTION);  
  }

    onSuccess(data) {
      alert("RdnaClient.js: openHttpConnectionSuccess"+data);
      console.log("RdnaClient.js: openHttpConnectionSuccess");
      this.activation;
    }

  onFailure(data) {
    alert("RdnaClient.js: openHttpConnectionFailure"+data);
      console.log("RdnaClient.js: openHttpConnectionFailure");
  }

onSuccessSessionId(data) {
  alert(data);
  console.log("RdnaClient.js: onSuccessSessionId"+data);
  var jsonObj ;
  try{
    jsonObj = JSON.parse(data);
  }catch (e){
    console.log("parsing fails");
  }
 
  console.log("jsonObj --- "+jsonObj.response);
  this.sessionID = jsonObj.response
  console.log("SessionId --- "+this.sessionID);
  //this.doSignup();
}

onFailureSessionId(data) {
  console.log("RdnaClient.js: onFailureSessionId"+data);

  this.toast.hideLoader();
}

showTimeDifferenc()
  {
    var timeDifference = "";
    var timeDifferenceMap = Util.getAPITIMINGDIFFERENCE();
    Object.keys(timeDifferenceMap).forEach((key)=>{
      timeDifference += key+"-"+timeDifferenceMap[key]+"\n";   
    });    
    console.log(timeDifference);
    alert(timeDifference);
  }



}
