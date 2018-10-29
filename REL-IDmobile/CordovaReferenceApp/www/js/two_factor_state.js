var actCode;
var userName;
var passcode;
var method;
var challengeName = "";

function checkUserLogin(){
    com.uniken.rdnaplugin.RdnaClient.checkChallengeResponse(this.onSuccessChallenge, this.onFailureChallenge, [JSON.stringify(challenges), userID]);
}

function onSuccessChallenge(e){
    alert("Check challenge success");
}

function onFailureChallenge(e){
    alert("Check challenge failed");
}


function doActivationLogin(userName, passcode, actCode) {
    this.actCode = actCode;
    this.userName = userName;
    this.passcode = passcode;
    this.method = "login";
    this.handleChallenges(TwoFactorState.initialChallengesJson);
}

function handleChallenges(rdnaChallengeJson){
    /// alert(JSON.stringify(rdnaChallengeJson));
    this.challengeName = "";
     let rdnaChallenges = rdnaChallengeJson.chlng;
     if (rdnaChallenges != null) {
         for (var i = 0; i < rdnaChallenges.length; i++) {
             let challenge = rdnaChallenges[i];
             let challengeName = challenge.chlng_name;
             this.challengeName += "-"+challenge.chlng_name;
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
                 challenge.chlng_resp[0].response = this.passcode; 
             }
             else if (challengeName === (Constants.CHLNG_DEV_BIND)) {
                 challenge.chlng_resp[0].response = true;
             }
             else if (challengeName === (Constants.CHLNG_DEV_NAME)) {
                 challenge.chlng_resp[0].response = "My Droid";
             }
         }

         this.checkChallenge(rdnaChallengeJson, this.userName, this.challengeName);
     }
 }
