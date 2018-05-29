import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,Events, Platform } from 'ionic-angular';

import { User } from '../../providers/providers';
import { DashboardPage } from '../dashboard/dashboard';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import { Toast } from '../toast/toast';

declare var com: any;
@IonicPage()
@Component({
  selector: 'page-register_mri',
  templateUrl: 'register_mri.html'
})
export class RegisterPageMRI {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { login_id: string, mob_no: string, card_no: string, password: string, password_cofirm: string } = {
    // login_id: 'swap7',
    // card_no: '111111',
    // card_pin:"1111",
    // password: '1111',
    // password_cofirm:'1111'
    login_id: '',
    mob_no: '',
    card_no:"",
    password: '',
    password_cofirm:''

    
  };
  static openHttpListener:any;

  response:any;
  sessionID:string;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toast: Toast,
    public translateService: TranslateService,
    public events:Events,platform:Platform) {

      this.onSuccessSessionId = this.onSuccessSessionId.bind(this); 
      this.doSignup = this.doSignup.bind(this);
      this.activation = this.activation.bind(this);

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

   // if(RegisterPage.openHttpListener)
  //  document.removeEventListener('onHttpResponse',RegisterPage.openHttpListener)   


    document.addEventListener('onHttpResponse',this.activation);

  com.uniken.rdnaplugin.RdnaClient.getSessionID(this.onSuccessSessionId,this.onFailureSessionId);
  //com.uniken.rdnaplugin.RdnaClient.getDeviceID(this.onSuccessSessionId,this.onFailureSessionId);
  //com.uniken.rdnaplugin.RdnaClient.getAgentID(this.onSuccessSessionId,this.onFailureSessionId);
  }

   activation(e:any) {
    console.log(e);
    this.toast.hideLoader();
    var jsonObj = JSON.parse(e.response);

    if (jsonObj.errorCode == 0) {
      var res;
      try {
        res = JSON.parse(atob(jsonObj.httpResponse.body));
      } catch (e) {
        alert("Invalid response.Please try again..");
        return;
      }
      if (res.error === '0') {
         // this.saveACTCODE(res.actCode);
      let state:TwoFactorState;
      state = new TwoFactorState(this.navCtrl,this.toast,this.events);
      state.callback = this;
      state.startActivation(res.actCode,this.account.login_id,this.account.password);
        
      } else {       
          alert(res.error);      
      }
    } else {  
        alert("Something went wrong, please try again..!");       
    }


}


  doSignup() {

    if(!this.validate())
    return;
    
    this.toast.showLoader();
    var URL = "http://18.232.236.255:8080/enterprise-api-server/enrollUser";
    //console.log("---Register ---baseUrl =" + baseUrl)

    // USER_ID_STR, mandatory = true          // will be email Id
    // GROUP_NAME_STR, mandatory = true       // Hardcode
    // SECONDARY_GROUP_NAMES_STR, mandatory = false
    // EMAIL_ID_STR, mandatory = false          // sholud be there
    // MOB_NUM_ID_STR, mandatory = false        // sholud be there
    // IS_RELIDZERO_ENABLED, mandatory = true     // hardcode

    var userMap = {
      "emailId": this.account.login_id,
      "mobNum":  this.account.mob_no,
      "cardNum": this.account.card_no,
      "sessionId":this.sessionID,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length":"0"
    };
    com.uniken.rdnaplugin.RdnaClient.openHttpConnection(this.onSuccess, this.onFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAHttpMethods.RDNA_HTTP_POST,URL,JSON.stringify(userMap),""]);

    }

     convertToPostData(jsonObject) {
      if (jsonObject != null && jsonObject != undefined) {
        var postData = "";
        var firstKey = true;
        var keys = Object.keys(jsonObject).forEach((key) => {
          if (firstKey === true) {
            firstKey = false;
            postData = postData + key + '=' + jsonObject[key];
          }
          else {
            postData = postData + '&' + key + '=' + jsonObject[key];
          }
        });
  
        return postData;
      } else {
        return null;
      }
    }

    onSuccess(data) {
      console.log("RdnaClient.js: openHttpConnectionSuccess");
  }

  onFailure(data) {
    this.toast.hideLoader();
      console.log("RdnaClient.js: openHttpConnectionFailure");
      this.toast.hideLoader();
  }


  onSuccessSessionId(data) {
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

  
  /*doSignup() {

    if(!this.validate())
    return;

    this.toast.showLoader();
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp:any) => {
      this.toast.hideLoader();
      if(resp.error){
       
        this.toast.showToast(resp.error);
      }else{
         this.response = resp;
        let state:TwoFactorState;
        state = new TwoFactorState(this.navCtrl,this.toast,this.events);
        state.callback = this;
        state.startActivation(this.response.act_code,this.account.login_id,this.account.password);
      }
    }, (err) => {
      this.toast.showToast(this.signupErrorString);
      this.toast.hideLoader();
      // Unable to sign up
    });
    }*/

    public doDashboard(){
      this.navCtrl.push(DashboardPage,{
        login_id: "cdcd", amount:"cdc"
    });
    }
    validate(){
      if(this.account.login_id.trim().length===0){
       this.toast.showToast("Please enter loginID");
        return false;
      }

      if(this.account.mob_no.trim().length===0 || this.account.mob_no.trim().length < 10){
        this.toast.showToast("Please enter valid Mobile number (10 - 15)");
         return false;
       }
      if(this.account.card_no.trim().length===0 || this.account.card_no.trim().length < 6){
        this.toast.showToast("Please enter card number (Lasrt 6 Digit)");
         return false;
       }
      
      if(this.account.password.trim().length===0){
        this.toast.showToast("Please enter RPIN");
        return false;
      }
      if(this.account.password_cofirm.trim().length===0){
        this.toast.showToast("Please enter confirm RPIN");
        return false;
      }

      if(this.account.password_cofirm.trim()=== this.account.password.trim()){
      }else{
        this.toast.showToast("RPIN and Confirm RPIN should be same");
        return false;
      }

      return true;
    }
}
