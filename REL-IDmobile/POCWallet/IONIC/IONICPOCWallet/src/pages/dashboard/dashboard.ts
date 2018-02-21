import { CHLNG_TBACRED } from './../twofatorstate/constants';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController,NavParams,Platform } from 'ionic-angular';
import { Toast } from '../toast/toast';
import { User } from '../../providers/providers';
import { NotificationPage } from '../notification/notification';
import { TwoFactorState } from '../twofatorstate/twofatorstate';
import * as Constants from '../twofatorstate/constants';

declare var com: any;


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {
  static getAllChallengeListener:any;
  static updateChallengesListener:any;

  account:{ login_id: string, amount:string,  text1:string,text2:string,} = {
    login_id: '',
    amount: '',
    text1: '',
    text2:'',
    
  };

  // Our translated text strings
  private signupErrorString: string;

  amount:any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,public navParams: NavParams,public toast: Toast,platform:Platform,) {

      this.account.login_id = navParams.get('login_id'); 
      this.amount = navParams.get('amount');
      this.account.text1 = 'Welcome '+this.account.login_id;
      this.account.text2 = 'Your wallet balance is '+this.amount;
      //alert(this.account.login_id+" "+this.amount );
      //this.account.amount = this.amount;
     TwoFactorState.isLoginToDashboard = true;
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    }) 
  
  }

  setMPIN(){
    alert("setMPIN");
    this.getAllChallenges((challengeJson,i)=>{
      this.toast.showPrompt([
        {
          name: 'mpin',
          placeholder: 'MPIN'
        }],
        [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Register',
            handler: (data) => {
              var challengeRes = challengeJson.chlng[i].chlng_resp;
              challengeRes[0].challenge = "MPIN";
              challengeRes[0].response = data.mpin;
              this.updateChallenges(challengeJson);
            }
          }
        ]);
    });
  }

  replaceString(find, replace, str) {
    while (str.indexOf(find) > -1) {
      str = str.replace(find, replace);
    }
    return str;
  }

  getAllChallenges(callback) {
    if (DashboardPage.getAllChallengeListener)
      document.removeEventListener('onGetAllChallengeStatus', DashboardPage.getAllChallengeListener)

    DashboardPage.getAllChallengeListener = (e: any) => {
      this.toast.hideLoader();
     // alert(e.response);

    //  let res = JSON.parse("{ \"errCode\": 0, \"eMethId\": 8, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"chlng\": [ { \"chlng_idx\": 1, \"sub_challenge_index\": 0, \"chlng_name\": \"secqa\", \"chlng_type\": 2, \"challengeOperation\": 1, \"chlng_prompt\": [ [ \"what is your petname\", \"what is the name of your mother\", \"what is the name of your father\", \"what is the name of your sister\", \"what is the name of your brother\" ] ], \"chlng_info\": [ { \"key\": \"Prompt label\", \"value\": \"Secret Question\" }, { \"key\": \"Response label\", \"value\": \"Secret Answer\" }, { \"key\": \"Description\", \"value\": \"Choose your secret question and then provide answer\" }, { \"key\": \"Reading\", \"value\": \"Set secret question and answer\" } ], \"chlng_resp\": [ { \"challenge\": \"\", \"response\": \"\" } ], \"challenge_response_policy\": [ ], \"chlng_response_validation\": false, \"attempts_left\": 3 }, { \"chlng_idx\": 2, \"sub_challenge_index\": 0, \"chlng_name\": \"pass\", \"chlng_type\": 1, \"challengeOperation\": 1, \"chlng_prompt\": [ [ ] ], \"chlng_info\": [ { \"key\": \"Response label\", \"value\": \"Password\" }, { \"key\": \"description\", \"value\": \"Enter password of length 8-10characters\" } ], \"chlng_resp\": [ { \"challenge\": \"pass\", \"response\": \"\" } ], \"challenge_response_policy\": [ ], \"chlng_response_validation\": false, \"attempts_left\": 3 }, { \"chlng_idx\": 3, \"sub_challenge_index\": 0, \"chlng_name\": \"tbacred\", \"chlng_type\": 1, \"challengeOperation\": 1, \"chlng_prompt\": [ [ {\"cred_type\": \"MPIN\",\"is_registered\": false} ] ], \"chlng_info\": [ { \"key\": \"Promptlabel\", \"value\": \"Additional Authentication\" } ], \"chlng_resp\": [ { \"challenge\": \"\", \"response\": \"\" } ], \"challenge_response_policy\": [ ], \"chlng_response_validation\": false, \"attempts_left\": 3 } ] }, \"ResponseDataLen\": 1824, \"StatusMsg\": \"Success.\", \"StatusCode\": 100, \"CredOpMode\": 1 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 }}}");
      let res = JSON.parse(e.response);
      if (res.errCode == 0) {
        var statusCode = res.pArgs.response.StatusCode;
        var statusMsg = res.pArgs.response.StatusMsg;
        var arrTba = new Array();
        console.log('TwoFactorAuthMachine - statusCode ' + statusCode);
        if (statusCode == 100) {
        //  alert(JSON.stringify(res.pArgs.response.ResponseData));
          if (res.pArgs.response.ResponseData) {
            var challengeJson = res.pArgs.response.ResponseData;
            var challengeJsonArr = challengeJson.chlng;
            if (challengeJsonArr != null){
            for (var i = 0; i < challengeJson.chlng.length; i++) {
              // if(challengeJson.chlng[i].chlng_name === Constants.CHLNG_PASS){
              //   challengeJson.chlng[i].chlng_resp[0].response = '4444';
              // }
              if (challengeJson.chlng[i].chlng_name === Constants.CHLNG_TBACRED){
                arrTba.push(challengeJson.chlng[i]);
                callback(challengeJson,i);
              }
              }
            }            
          }
        } else {
          alert(statusMsg);
        }
      } else {
        alert("Internal system error\nErrorCode : " + res.errCode);
      }
    }

    document.addEventListener('onGetAllChallengeStatus',DashboardPage.getAllChallengeListener);

    com.uniken.rdnaplugin.RdnaClient.getAllChallenges((successRes) => {
      alert("getAllChallenges sync");
      console.log('getAllChallenges success');
    }, (errRes) => {
      alert("Something went wrong");
    }, [TwoFactorState.loggedInUser]);
  }

  updateChallenges(arrChallenges) {
    if (DashboardPage.updateChallengesListener)
      document.removeEventListener('onUpdateChallengeStatus', DashboardPage.updateChallengesListener)

    DashboardPage.updateChallengesListener = (e: any) => {
      let res = JSON.parse(e.response);
      if (res.errCode == 0) {
        var statusCode = res.pArgs.response.StatusCode;
        var statusMsg = res.pArgs.response.StatusMsg;
        if (statusCode == 100) {
          alert("Update challenge success");
        }else{
          alert(statusMsg);
        }
      }else{
        alert("Internal system error\nErrorCode : " + res.errCode);
      }
    }

    document.addEventListener('onUpdateChallengeStatus',DashboardPage.updateChallengesListener);

    com.uniken.rdnaplugin.RdnaClient.updateChallenges((successRes) => {
      console.log('updateChallenges success');
    }, (errRes) => {
      alert("Something went wrong");
    },[JSON.stringify(arrChallenges), TwoFactorState.loggedInUser]);
  }
  
  doAddMoney() {
    // Attempt to login in through our User service
    if(this.account.amount.length === 0){
      this.toast.showToast("Please enter amount");
      return;
    }

    this.toast.showLoader()
    this.user.addMoney(this.account).subscribe((resp:any) => {
      this.toast.hideLoader();
      
      if(resp.error){
        let toast = this.toastCtrl.create({
          message: resp.error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        alert(JSON.stringify(resp));
        this.account.amount = '';
        this.account.text2 = 'Your wallet balance is '+resp.balance;
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

  showNotification(){
    this.navCtrl.push(NotificationPage);
  }

}
