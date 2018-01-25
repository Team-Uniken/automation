package com.uniken.poc.rpocwallet;

import android.app.Activity;
import android.content.DialogInterface;

import com.uniken.poc.rpocwallet.ModelsAndHolders.ErrorInfo;
import com.uniken.poc.rpocwallet.Utils.Constants;
import com.uniken.poc.rpocwallet.Utils.Helper;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClient;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClientCallback;
import com.uniken.rdna.RDNA;

import java.util.ArrayList;

/**
 * Created by nikhil on 22/12/17.
 */

public class ChallengeHandler implements RDNAClientCallback{
    Activity activity;
    String userName;
    String actCode = "";
    private String passcode="";
    String method = "";
    User user;
    private static final String SAMPLE_QUESTION = "sampleQuestion";
    private static final String SAMPLE_ANSWER = "sampleAnswer";

    public ChallengeHandler(Activity activity){
        this.activity = activity;
    }

    public void handleChallenges(RDNA.RDNAChallenge[] rdnaChallenges){
        if(rdnaChallenges!=null){
            for(int i=0;i<rdnaChallenges.length; i++){
                RDNA.RDNAChallenge challenge = rdnaChallenges[i];
                String challengeName = challenge.name;
                if (challengeName.equals(Constants.CHLNG_CHECK_USER)) {
                    challenge.responseValue = userName;
                }
                else if (challengeName.equals(Constants.CHLNG_OTP)) {

                }
                else if (challengeName.equals(Constants.CHLNG_SECONDARY_SEC_QA)) {
                    if(challenge.challengeOperation == RDNA.RDNAChallengeOpMode.RDNA_CHALLENGE_OP_SET) {
                        challenge.responseValue = SAMPLE_ANSWER;
                        challenge.responseKey = SAMPLE_QUESTION;
                    }else{
                        challenge.responseValue = SAMPLE_ANSWER;
                    }
                }
                else if (challengeName.equals(Constants.CHLNG_ACTIVATION_CODE)) {
                    challenge.responseValue = actCode;
                }
                else if (challengeName.equals(Constants.CHLNG_SEC_QA)) {
                    if(challenge.challengeOperation == RDNA.RDNAChallengeOpMode.RDNA_CHALLENGE_OP_SET) {
                        challenge.responseValue = SAMPLE_ANSWER;
                        challenge.responseKey = SAMPLE_QUESTION;
                    }else{
                        challenge.responseValue = SAMPLE_ANSWER;
                    }
                }
                else if (challengeName.equals(Constants.CHLNG_PASS)) {
                    challenge.responseValue = passcode;
                }
                else if (challengeName.equals(Constants.CHLNG_DEV_BIND)) {
                    challenge.responseValue = true;
                }
                else if (challengeName.equals(Constants.CHLNG_DEV_NAME)) {
                    challenge.responseValue = "My Droid";
                }
            }

            RDNAClient.getInstance().checkChallenge(rdnaChallenges,userName);
        }
    }

    public void handleSuccess(RDNA.RDNAStatusCheckChallengeResponse rdnaStatusCheckChallengeResponse){

    }

    public void doLogin(User user){
        this.user = user;
        doLogin(user.getLogin_id(),user.getPassword());
    }

    public void doLogin(String userName,String passcode){
        this.userName = userName;
        this.passcode = passcode;
        this.method = "login";
        RDNAClient.getInstance().registerCallback(this);
        handleChallenges(RDNAClient.getInstance().initialChallenges);
    }

    public void startActivation(String actCode,String userName,String passcode){
        this.actCode = actCode;
        this.userName = userName;
        this.passcode = passcode;
        this.method = "activation";
        RDNAClient.getInstance().registerCallback(this);
        handleChallenges(RDNAClient.getInstance().initialChallenges);
    }

    @Override
    public void onCallToRDNA(RDNA.RDNAMethodID methodID) {
        ((BaseActivity)activity).progressBarVisibility(true);
    }

    @Override
    public void onRDNAResponse(Object status) {
        ((BaseActivity)activity).progressBarVisibility(false);
        if(status instanceof RDNA.RDNAStatusCheckChallengeResponse){
            final RDNA.RDNAStatusCheckChallengeResponse response = (RDNA.RDNAStatusCheckChallengeResponse) status;
            if (response.errCode == 0) {
                if(response.status.statusCode ==
                        RDNA.RDNAResponseStatusCode.RDNA_RESP_STATUS_SUCCESS) {

                    if(response.challenges==null ||
                            response.challenges.length ==0){
                        Helper.setLoggedInUser(userName);
                        if(method.equalsIgnoreCase("login")){
                            Controller ctrl = new Controller(user, "login");
                            ctrl.start();
                        }else {
                            Util.openActivity(activity, HomeActivity.class, false);
                        }
                    }else{
                        handleChallenges(response.challenges);
                    }
                }else if(response.status.statusCode ==
                        RDNA.RDNAResponseStatusCode.RDNA_RESP_STATUS_USER_DEVICE_NOT_REGISTERED ||
                        response.status.statusCode == RDNA.RDNAResponseStatusCode.RDNA_RESP_STATUS_USER_SUSPENDED ||
                        response.status.statusCode == RDNA.RDNAResponseStatusCode.RDNA_RESP_STATUS_NO_USER_ID ){
                    Helper.showAlert(activity, "Error", response.status.message+" Please register again", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            RDNAClient.getInstance().resetChallenge();
                            if( !(activity instanceof RegisterActivity) ) {
                                Util.openActivity(activity, RegisterActivity.class, false);
                            }
                        }
                    },false);
                }else{
                    Helper.showAlert(activity, "Error", response.status.message, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            if(response.challenges!=null){
                                if(method.equals("activation"))
                                    handleChallenges(response.challenges);
                            }
                        }
                    },false);
                }
            } else if(RDNA.getErrorInfo(response.errCode)== RDNA.RDNAErrorID.RDNA_ERR_INVALID_USER_MR_STATE){
                RDNAClient.getInstance().resetChallenge();
                Helper.showAlert(activity, "Error", "User state is not valid, please register again.", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Util.openActivity(activity,RegisterActivity.class,false);
                    }
                },false);

            } else{
                Helper.showAlert(activity,"Error","Internal system error, please exit and log in again\nError Code: " + response.errCode);
            }
        }else if(status instanceof ErrorInfo){
            ErrorInfo info = (ErrorInfo) status;
            Helper.showAlert(activity,"Error","Internal system error, please exit and log in again \nError Code: "+ info.getErrorCode());
        }
    }

    @Override
    public RDNA.RDNAIWACreds getIWACreds(String domain) {
        return null;
    }
}
