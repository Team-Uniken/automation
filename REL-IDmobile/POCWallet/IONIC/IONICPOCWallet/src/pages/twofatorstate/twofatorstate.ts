import { Component } from '@angular/core';
import { NavController ,Events} from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import * as Constants from './constants';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import { Toast } from '../toast/toast';

declare var com: any;
@Component({
    selector: 'page-twofatorstate',
    templateUrl: 'twofatorstate.html'
})

export class TwoFactorState {
    challengeJson: any;
    challengeJsonArr: any;
    userName: any;
    actCode: any;
    passcode: any;
    method: any;
    public callback:any;
    static initialChallengesJson: any;
    static listener:any;
    static isLoginToDashboard:boolean;

    static setInitialChallenge(challegeJson) {
        TwoFactorState.initialChallengesJson = challegeJson;
    }

    constructor(public navCtrl: NavController,public toast:Toast,public events:Events) {
        if(TwoFactorState.listener)
            document.removeEventListener('onCheckChallengeResponseStatus',TwoFactorState.listener)

        TwoFactorState.listener =  (e: any) => {
              this.toast.hideLoader();
              let res = JSON.parse(e.response);
              if (res.errCode == 0) {
                  var statusCode = res.pArgs.response.StatusCode;
                  var statusMsg = res.pArgs.response.StatusMsg;
                  console.log('TwoFactorAuthMachine - statusCode ' + statusCode);
                  if (statusCode == 100) {
                      if (res.pArgs.response.ResponseData) {
                          this.challengeJson = res.pArgs.response.ResponseData;
                          this.challengeJsonArr = this.challengeJson.chlng;
                          if (this.challengeJsonArr != null)
                              this.handleChallenges(this.challengeJson);
                      } else
                          if(this.method === "login"){
                              //alert("event publish login:success");
                             //this.events.publish("login:success",null);
                             this.callback.callLoginApi();
                          }
                          else{
                            this.callback.doDashboard();
                          }
                  } else {
                      alert(statusMsg);
                  }
              } else {
                  alert("Internal system error\nErrorCode : " + res.errCode);
              }
          };

        document.addEventListener('onCheckChallengeResponseStatus',TwoFactorState.listener);
    }

    checkChallenge(challenges: any, userID: string) {
        this.toast.showLoader();
        com.uniken.rdnaplugin.RdnaClient.checkChallengeResponse(this.onSuccess, this.onFailure, [JSON.stringify(challenges), userID]);
    }

    handleChallenges(rdnaChallengeJson) {
       /// alert(JSON.stringify(rdnaChallengeJson));
        let rdnaChallenges = rdnaChallengeJson.chlng;
        if (rdnaChallenges != null) {
            for (var i = 0; i < rdnaChallenges.length; i++) {
                let challenge = rdnaChallenges[i];
                let challengeName = challenge.chlng_name;
                if (challengeName === Constants.CHLNG_CHECK_USER) {
                    challenge.chlng_resp[0].response = this.userName;
                }
                else if (challengeName === Constants.CHLNG_OTP) {

                }
                else if (challengeName === Constants.CHLNG_SECONDARY_SEC_QA) {
                    if (challenge.challengeOperation != Constants.CHLNG_VERIFICATION_MODE) {
                        challenge.chlng_resp[0].response = Constants.SAMPLE_ANSWER;
                        challenge.chlng_resp[0].challenge = Constants.SAMPLE_QUESTION;
                    } else {
                        challenge.chlng_resp[0].response = Constants.SAMPLE_ANSWER;
                    }
                }
                else if (challengeName === (Constants.CHLNG_ACTIVATION_CODE)) {
                    challenge.chlng_resp[0].response = this.actCode;
                }
                else if (challengeName === (Constants.CHLNG_SEC_QA)) {
                    if (challenge.challengeOperation != Constants.CHLNG_VERIFICATION_MODE) {
                        challenge.chlng_resp[0].response = Constants.SAMPLE_ANSWER;
                        challenge.chlng_resp[0].challenge = Constants.SAMPLE_QUESTION;
                    } else {
                        challenge.chlng_resp[0].response = Constants.SAMPLE_ANSWER;
                    }
                }
                else if (challengeName === (Constants.CHLNG_PASS)) {
                    challenge.chlng_resp[0].response = this.passcode; TwoFactorState
                }
                else if (challengeName === (Constants.CHLNG_DEV_BIND)) {
                    challenge.chlng_resp[0].response = true;
                }
                else if (challengeName === (Constants.CHLNG_DEV_NAME)) {
                    challenge.chlng_resp[0].response = "My Droid";
                }
            }

            this.checkChallenge(rdnaChallengeJson, this.userName);
        }
    }

    onSuccess(data) {
        console.log("RdnaClient.js: initSuccess");
    }

    onFailure(data) {
        console.log("RdnaClient.js: initFailure");
        this.toast.hideLoader();
    }

    doLogin(userName: any, passcode: any) {
        this.userName = userName;
        this.passcode = passcode;
        this.method = "login";
        this.handleChallenges(TwoFactorState.initialChallengesJson);
    }

    startActivation(actCode: string, userName: string, passcode: string) {
        this.actCode = actCode;
        this.userName = userName;
        this.passcode = passcode;
        this.method = "activation";
        this.handleChallenges(TwoFactorState.initialChallengesJson);
    }

}
