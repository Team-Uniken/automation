// var actCode;
var userName;
var method;
var valueChlg;
var challengeName = "";

// function doActivationLogin(userName) {
//     this.userName = userName;
//     this.handleChallenges(getFromStorage(constant.CHALLENGES_AFTR_INIT));
// }

let gotToNextChallenge = (value) => {
    this.valueChlg = value;
    this.userName = "Nikhil";
    this.handleChallenges(getFromStorage(constant.CURRENT_CHALLENGES));
}

function handleChallenges(rdnaChallengeJson){
    this.challengeName = "";
    let rdnaJson = JSON.parse(rdnaChallengeJson);
    //   rdnaJson.chlng;
     if (rdnaJson.chlng != null) {
         var currentChalngIndex = getFromStorage(constant.CHALLENGE_INDEX);
        //  for (var i = 0; i < rdnaChallenges.length; i++) {
            if ( currentChalngIndex>=0 && currentChalngIndex<rdnaJson.chlng.length) {
            //  let challenge = rdnaJson.chlng[currentChalngIndex];
             let challengeName = rdnaJson.chlng[currentChalngIndex].chlng_name;
             console.log("Challenge name is: " +challengeName);
             this.challengeName += "-"+rdnaJson.chlng[currentChalngIndex].chlng_name;
             if (challengeName === constant.CHLNG_CHECK_USER) {
                 rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = this.userName;
                 updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === constant.CHLNG_OTP) {
                updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === constant.CHLNG_SECONDARY_SEC_QA) {
                 if (rdnaJson.chlng[currentChalngIndex].challengeOperation != constant.CHLNG_VERIFICATION_MODE) {
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = constant.SAMPLE_ANSWER;
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].challenge = constant.SAMPLE_QUESTION;
                 } else {
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = constant.SAMPLE_ANSWER;
                 }
                 updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === (constant.CHLNG_ACTIVATION_CODE)) {
                 rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = this.valueChlg;
                 updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === (constant.CHLNG_SEC_QA)) {
                 if (rdnaJson.chlng[currentChalngIndex].challengeOperation != constant.CHLNG_VERIFICATION_MODE) {
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = constant.SAMPLE_ANSWER;
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].challenge = constant.SAMPLE_QUESTION;
                 } else {
                     rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = constant.SAMPLE_ANSWER;
                 }
                 updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === (constant.CHLNG_PASS)) {
                 rdnaJson.chlng[currentChalngIndex].chlng_resp[0].response = this.valueChlg;
                updateChallengeIndex(rdnaJson); 
             }
             else if (challengeName === (constant.CHLNG_DEV_BIND)) {
                 rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = true;
                 updateChallengeIndex(rdnaJson);
             }
             else if (challengeName === (constant.CHLNG_DEV_NAME)) {
                 rdnaJson.chlng[currentChalngIndex].chlng_resp[constant.RESPONSE_VALUE_INDEX].response = "My Droid";
                 updateChallengeIndex(rdnaJson);
             }
         } else {
            this.checkChallenge(rdnaJson, this.userName, this.challengeName);
         }

        //  this.checkChallenge(rdnaJson, this.userName, this.challengeName);
     }
 }

 function updateChallengeIndex(rdnaJson){

    //increment the current challenge count
    var chlngIndex = getFromStorage(constant.CHALLENGE_INDEX);
    saveToStorage(constant.CHALLENGE_INDEX,parseInt(chlngIndex)+parseInt(1));
    // alert("Updated Index: "+ getFromStorage(constant.CHALLENGE_INDEX));

    saveToStorage(constant.CURRENT_CHALLENGES,JSON.stringify(rdnaJson));
    //  let rdnaChallenges = rdnaJson.chlng;
     if (rdnaJson.chlng != null) {
         var currentChalngIndex = getFromStorage(constant.CHALLENGE_INDEX);
            if ( currentChalngIndex>=0 && currentChalngIndex<rdnaJson.chlng.length) {
                let challenge = rdnaJson.chlng[currentChalngIndex];
                // let challengeName = challenge.chlng_name;
                challengeNavigator(challenge);
            }else{
                this.handleChallenges(JSON.stringify(rdnaJson));
            }
    // this.handleChallenges(getFromStorage(constant.CHALLENGES_AFTR_INIT));
        }
 }

function checkChallenge(challenges, userID, challengeName) {
    alert("called check challenge"+JSON.stringify(challenges));
    com.uniken.rdnaplugin.RdnaClient.checkChallengeResponse(this.onSuccessChallenge, this.onFailureChallenge, [JSON.stringify(challenges), userID]);
    document.addEventListener('onCheckChallengeResponseStatus',this.asyncCheckChlng.bind(this), false);
}


function onSuccessChallenge(data){
    alert("Check challenge success"+ data);
}

function onFailureChallenge(data){
    alert("Check challenge failed"+ data);
}

function asyncCheckChlng(e){
    alert("In async challenge response"+e.response);
    
    let res = JSON.parse(e.response);
    if (res.errCode == 0) {
        var statusCode = res.pArgs.response.StatusCode;
        var statusMsg = res.pArgs.response.StatusMsg;
        console.log('TwoFactorAuthMachine - statusCode ' + statusCode);
        if (statusCode == 100) {
            //set challenge count to zero again
            saveToStorage(constant.CHALLENGE_INDEX,0);

            if (res.pArgs.response.ResponseData) {
                let challengeJson = res.pArgs.response.ResponseData;
                alert("Sucess checkUser:"+ challengeJson.chlng);
                let challengeJsonArr = challengeJson.chlng;
                if (challengeJsonArr != null){
                    // this.handleChallenges(JSON.stringify(challengeJson));
                    saveToStorage(constant.CURRENT_CHALLENGES,JSON.stringify(challengeJson));
                    challengeNavigator(challengeJson);
                }
            } else
                // if(this.method === "login"){
                //    this.callback.callLoginApi();
                // }
                // else{
                //   this.callback.doDashboard();
                alert("Challenge completed");
                // }
        } else {
            alert(statusMsg);
        }
    } else {
        alert("Internal system error\nErrorCode : " + res.errCode);
    }
}

function challengeNavigator(challengeJson){

    alert("In challenge Navi"+JSON.stringify(challengeJson));
    switch(getChallengeName(challengeJson)){

        case  constant.CHLNG_CHECK_USER:

           break;
        
        case  constant.CHLNG_OTP:
            break;

        case  constant.CHLNG_SECONDARY_SEC_QA:
            break;
            
        case  constant.CHLNG_ACTIVATION_CODE:
            alert("Called verification page");
            window.location.href = "../scan_qr/verification_with_qr.html";
            break;
            
        case constant.CHLNG_SEC_QA:
            break;
            
        case  constant.CHLNG_PASS:
                alert("Enter Password");
                window.location.href = "../password/confirm_password.html";
            break;
            
        case  constant.CHLNG_DEV_BIND:
            break;
            
        case constant.CHLNG_DEV_NAME:
            break;

        default:
                window.location.href = "../dashboard/dashboard.html";
            break;
    }
}

function getChallengeName(challengeJson){

        // let rdnaJson = JSON.parse(challengeJson);
         if (challengeJson.chlng != null) {
            var currentChalngIndex = getFromStorage(constant.CHALLENGE_INDEX);
            let challengeName = challengeJson.chlng[currentChalngIndex].chlng_name;

            return challengeName;
         }else {
             return "";
         }
}