package com.uniken.poc.rpocwallet.Utils.RDNAClient;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Environment;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.uniken.poc.rpocwallet.MainActivity;
import com.uniken.poc.rpocwallet.ModelsAndHolders.ErrorInfo;
import com.uniken.poc.rpocwallet.ModelsAndHolders.PauseResumeLock;
import com.uniken.poc.rpocwallet.ModelsAndHolders.Profile;
import com.uniken.poc.rpocwallet.R;
import com.uniken.poc.rpocwallet.Util;
import com.uniken.poc.rpocwallet.Utils.Constants;
import com.uniken.poc.rpocwallet.Utils.DatabaseHelper;
import com.uniken.poc.rpocwallet.Utils.Helper;
import com.uniken.rdna.RDNA;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Iterator;

/*
 *  A class which does RDNA initialization and
 *  implement callback methods
 */
public class RDNAClient
{
  private RDNA.RDNACallbacks callbacks;                 // Callback object to get the runtime status of RDNA.
  private RDNA               rdnaObj;                   // RDNA object used to call RDNA apis.
  private RDNA.RDNAService[] rdnaServices;              // Services used to get service details.
  private RDNA.RDNAPort      pxyPort;                   // Port used to set proxy to control panel.
  Handler     uiHandler;                                // handler for communicating to UI thread.
  Application context;                                  // Instance of application class.
  private PauseResumeLock pauseResumeLock;    // used to  synchronize pause and resume
  private static RDNAClient         rdnaClient;         // RDNAClient instance.
  private        RDNAClientCallback rdnaClientCallback; // Callback object used to forward RDNA runtime status.
  private        byte[]             pauseState;         // pause state data
  private final String TAG = "RDNAClient";
  private Profile connectedProfile = null;
  public RDNA.RDNAChallenge[] initialChallenges = null;
  public RDNA.RDNAChallenge[] currentChallenges = null;
  private Activity activity;

  public static class SessionTimeout{}
  public static class ThreatStatus{public String threatMsg=""; ThreatStatus(String threatMsg){this.threatMsg= threatMsg;}}

  /*
  *This method registers the supplied callback instance with RDNAClient.
  */
  public void registerCallback(RDNAClientCallback rdnaClientCallback)
  {
    Log.e(TAG, "---- Register called " + rdnaClientCallback);
    this.rdnaClientCallback = rdnaClientCallback;
  }

   /*
    *This method unregisters the supplied callback instance from RDNAClient.
    */

  public void unRegisterCallback(RDNAClientCallback rdnaClientCallback)
  {
    Log.e(TAG, "---- Unregister called " + rdnaClientCallback);
    if (this.rdnaClientCallback == rdnaClientCallback) {
      Log.e(TAG, "---- Unregister set callback to null " + rdnaClientCallback);
      this.rdnaClientCallback = null;
    }
  }

  public RDNA.RDNAPort getPxyPort()
  {
    if (pxyPort != null) {
      Log.e("host _ port", pxyPort.port + "");
      return pxyPort;
    }

    return new RDNA.RDNAPort(0);
  }

  private RDNAClient()
  {
  }

  /*
   *This method returns the instance of RDNAClient.
   */
  public static RDNAClient getInstance()
  {
    if (null == rdnaClient) {
      rdnaClient = new RDNAClient();
    }

    return rdnaClient;
  }

  /*
   *This method takes the status  as a input and forwards it to registered activity.
   */
  private void onRDNAResponse(final Object status)
  {
    uiHandler.post(new Runnable()
    {
      @Override
      public void run()
      {
        if (rdnaClientCallback != null) {
          rdnaClientCallback.onRDNAResponse(status);
        }
        else {
          Log.e(TAG, "rdnaClientCallback");
        }
      }
    });
  }

  private void callOnMainThread(Runnable runnable)
  {
    uiHandler.post(runnable);
  }

  private void createUiHandler()
  {
    if (uiHandler == null) {
      uiHandler = new Handler(context.getMainLooper());
    }
  }

  private  static  String convertToPostData(JSONObject jsonObject) throws JSONException{
    if (jsonObject != null ) {
      String postData = "";
      boolean firstKey = true;
      Iterator<?> keys = jsonObject.keys();
  
      while( keys.hasNext() ) {
        String key = (String)keys.next();
        if (firstKey == true) {
          firstKey = false;
          postData = postData + key + '=' + jsonObject.getString(key);
        }
        else {
          postData = postData + '&' + key + '=' + jsonObject.getString(key);
        }
     
      }
      return postData;
    } else {
      return null;
    }
  }
  
  /*
   *  Method initializes the RDNA.
   */
  public void init(final Application context)
  {
    this.context = context;
    createUiHandler();
    pauseResumeLock = new PauseResumeLock();
    pauseState = null;

    callbacks = new RDNA.RDNACallbacks()
    {
      /*
       *  Method is called by the RDNA to notify the client that the initialize is complete.
       */

      @Override
      public int onInitializeCompleted(RDNA.RDNAStatusInit status)
      {
        Log.e("onInitializeCompleted", "" + status.errCode);
        setServices(status.services);
        setProxyPort(status.pxyDetails);
        initialChallenges = status.challenges;
        if (pxyPort != null) {
          Log.e("------------proxy_port ", pxyPort.port + "");
        }
        else {
          Log.e("onInitializeCompleted", "------------proxy_port is null");
        }

        if (status.challenges == null) {
          Log.e(TAG, "Challenges is null and error code = " + status.errCode);
        }
  
        onRDNAResponse(status);

        return 0;
      }
      

      /*
       *  This method is used to fetch application context to RDNA.
       */

      @Override
      public Context getDeviceContext()
      {
        return context;
      }

      @Override
      public String getDeviceToken() {
        String gcmToken = Helper.getGcmToken(context);
        return gcmToken;
      }

      @Override
      public int onGetNotifications(final RDNA.RDNAStatusGetNotifications rdnaStatusGetNotifications) {
        onRDNAResponse(rdnaStatusGetNotifications);
        return 0;
      }

      @Override
      public int onUpdateNotification(RDNA.RDNAStatusUpdateNotification rdnaStatusUpdateNotification) {
        onRDNAResponse(rdnaStatusUpdateNotification);
        return 0;
      }


     /*
      *  Method is called by the RDNA to notify the
      *  client that the RDNA termination is completed.
      */

      @Override
      public int onTerminate(RDNA.RDNAStatusTerminate status)
      {
        Log.e("terminate", "terminate call back");
        callOnMainThread(new Runnable() {
          @Override
          public void run() {
            ActivityCompat.finishAffinity(getCurrentActivity());
          }
        });
        return 0;
      }

      /*
       *  Method is called by the RDNA to notify the
       *  client that the RDNA pauseRuntime is completed.
       */

      @Override
      public int onPauseRuntime(final RDNA.RDNAStatusPause status)
      {
        callOnMainThread(new Runnable()
        {
          @Override
          public void run()
          {
            Log.e("RdnaClient pause", "---------- Pause call back");
            pauseResumeLock.setLastMethodId(null);
            if (status.errCode != 0) {
              onRDNAResponse(new ErrorInfo(status.errCode, RDNA.RDNAMethodID.RDNA_METH_PAUSE.name()));
            }
            else if (pauseResumeLock.getCurrentMethodId() == RDNA.RDNAMethodID.RDNA_METH_RESUME) {
              Log.e("RdnaClient pause", "---------- Calling ResumeRDNA from pause callback");
              resumeRdna();
            }
          }
        });
        return 0;
      }

      /*
       *  Method is called by the RDNA to notify the
       *  client that the resumeRuntime is completed.
       */

      @Override
      public int onResumeRuntime(final RDNA.RDNAStatusResume status)
      {

        callOnMainThread(new Runnable()
        {
          @Override
          public void run()
          {
            Log.e("RdnaClient pause", "---------- Resume call back");

            pauseResumeLock.setLastMethodId(null);
            if (status.errCode != 0) {
              onRDNAResponse(new ErrorInfo(status.errCode, RDNA.RDNAMethodID.RDNA_METH_RESUME.name()));
            }
            else {

              pauseState = null;
              onRDNAResponse(status);
              setProxyPort(status.pxyDetails);
              setServices(status.services);
              if (pauseResumeLock.getCurrentMethodId() == RDNA.RDNAMethodID.RDNA_METH_PAUSE) {
                Log.e("RdnaClient resume", "---------- Calling PauseRDNA from resume callback");
                pauseRnda();
              }
            }
          }
        });

        return 0;
      }


      /*
       *  Method is called by the RDNA to notify the
       *  client that the RDNA getConfig is completed and
       *  returns the response status.
       */
      @Override
      public int onConfigReceived(RDNA.RDNAStatusGetConfig rdnaStatusGetConfig)
      {
        Log.e(TAG, "----- rdnaStatusGetConfig");
        onRDNAResponse(rdnaStatusGetConfig);
        return 0;
      }

      /*
      *  Method is called by the RDNA to notify the
      *  client that the RDNA checkChallenge is completed and
      *  returns the response status.
      */

      @Override
      public int onCheckChallengeResponseStatus(RDNA.RDNAStatusCheckChallengeResponse rdnaStatusCheckChallengeResponse)
      {
        Log.e("error", RDNA.getErrorInfo(rdnaStatusCheckChallengeResponse.errCode) + "");

        Log.e(TAG, "----- onChallengeReceived in referenceapp");
        if (rdnaStatusCheckChallengeResponse != null) {
          if (rdnaStatusCheckChallengeResponse.methodID == RDNA.RDNAMethodID.RDNA_METH_CHECK_CHALLENGE) {
            if (rdnaStatusCheckChallengeResponse.services != null) {
              setServices(rdnaStatusCheckChallengeResponse.services);
            }

            setProxyPort(rdnaStatusCheckChallengeResponse.pxyDetails);
          }
        }

        onRDNAResponse(rdnaStatusCheckChallengeResponse);
        return 0;
      }

      /*
      *  Method is called by the RDNA to notify the
      *  client that the RDNA getAllChallenges is completed and
      *  returns the response status.
      */

      @Override
      public int onGetAllChallengeStatus(RDNA.RDNAStatusGetAllChallenges rdnaStatusGetAllChallenges)
      {
        onRDNAResponse(rdnaStatusGetAllChallenges);
        return 0;
      }

      /*
     * This method is called by the RDNA to forward the response status of updateChallenges() call.
     */

      @Override
      public int onUpdateChallengeStatus(RDNA.RDNAStatusUpdateChallenges rdnaStatusUpdateChallenges)
      {
        onRDNAResponse(rdnaStatusUpdateChallenges);
        return 0;
      }


      /*Method deprecated
     *  Method is called by the RDNA to notify the
     *  client that the RDNA forgotPassword is completed and
     *  returns the response status.
     */
      /*@Override
      public int onForgotPasswordStatus(RDNA.RDNAStatusForgotPassword rdnaStatusForgotPassword)
      {
        onRDNAResponse(rdnaStatusForgotPassword);
        return 0;
      }*/

      /*
     *  Method is called by the RDNA to notify the
     *  client that the RDNA postLoginChallenge is completed and
     *  returns the response status.
     */
      @Override
      public int onGetPostLoginChallenges(RDNA.RDNAStatusGetPostLoginChallenges rdnaStatusGetPostLoginChallenges)
      {
        onRDNAResponse(rdnaStatusGetPostLoginChallenges);
        return 0;
      }

      /*
       *  Method is called by the RDNA to notify the
       *  client that the RDNA logOff is completed and
       *  returns the response status.
      */
      @Override
      public int onLogOff(RDNA.RDNAStatusLogOff rdnaStatusLogOff)
      {
        onRDNAResponse(rdnaStatusLogOff);
        rdnaStatusLogOff.services = null;
        rdnaStatusLogOff.pxyDetails = null;

        if (rdnaStatusLogOff.services != null) {
          setServices(rdnaStatusLogOff.services);
        }

        setProxyPort(rdnaStatusLogOff.pxyDetails);
        return 0;
      }


      /*
      * This  Method is called by the RDNA to get the
      * IWA credential information for authentication.
      */

      @Override
      public RDNA.RDNAIWACreds getCredentials(String domainUrl)
      {
        return rdnaClientCallback.getIWACreds(domainUrl);
      }

      /*
       *  Method is called by the RDNA to get the name of application.
      */
      @Override
      public String getApplicationName()
      {
        return context.getString(R.string.app_name);
      }


      /*
       *  Method is called by the RDNA to get the  version of application.
       */

      @Override
      public String getApplicationVersion()
      {
        String version = null;
        try {
          PackageInfo pInfo;
          pInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
          version = String.valueOf(pInfo.versionName);
        }
        catch (PackageManager.NameNotFoundException e) {
          e.printStackTrace();
        }
        return version;
      }

      /*
       *  Method is called by the RDNA to provide  registered device details
       */

      @Override
      public int onGetRegistredDeviceDetails(final RDNA.RDNAStatusGetRegisteredDeviceDetails rdnaStatusGetRegisteredDeviceDetails)
      {
        int statusCode = rdnaStatusGetRegisteredDeviceDetails.errCode;
        uiHandler.post(new Runnable()
        {
          @Override
          public void run()
          {
            rdnaClientCallback.onRDNAResponse(rdnaStatusGetRegisteredDeviceDetails);
          }
        });
        return statusCode;
      }

      /*
       *  Method is called by the RDNA to forward the response of updateDeviceDetails() call.
       */

      @Override
      public int onUpdateDeviceDetails(final RDNA.RDNAStatusUpdateDeviceDetails rdnaStatusUpdateDeviceDetails)
      {
        int statusCode = rdnaStatusUpdateDeviceDetails.errCode;
        uiHandler.post(new Runnable()
        {
          @Override
          public void run()
          {
            rdnaClientCallback.onRDNAResponse(rdnaStatusUpdateDeviceDetails);
          }
        });
        return statusCode;
      }

      @Override
      public int onGetNotificationsHistory(RDNA.RDNAStatusGetNotificationHistory rdnaStatusGetNotificationHistory) {
        return 0;
      }

      @Override
      public int onSessionTimeout(String s)
      {
        onRDNAResponse(new SessionTimeout());
        callOnMainThread(new Runnable() {
          @Override
          public void run() {
            Util.openActivity(getCurrentActivity(), MainActivity.class,false);
            Toast.makeText(context,"Your session has been timed out",Toast.LENGTH_LONG).show();
          }
        });
        return 0;
      }
  
      @Override
      public int onSdkLogPrintRequest(RDNA.RDNALoggingLevel rdnaLoggingLevel, String s)
      {
        Log.d("onSdkLogPrintRequest",rdnaLoggingLevel.toString()+"-"+s);
        return 0;
      }

      @Override
      public int onSecurityThreat(final String s) {
        Log.d("onSecurityThreat : ",s);
        onRDNAResponse(new ThreatStatus(s));
        callOnMainThread(new Runnable() {
          @Override
          public void run() {
            String msg = "\u2022 "+s.replaceAll("\n","\n\u2022 ");
            Helper.showAlert(getCurrentActivity(), "Error", "Threats detected on your system : \n" + msg, "Quit", new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialogInterface, int i) {
                if(rdnaObj!=null)
                  RDNAClient.getInstance().terminate();

                ActivityCompat.finishAffinity(getCurrentActivity());
              }
            }, false);
          }
        });
        return 0;
      }
    };

    Profile profile = DatabaseHelper.getInstance(context).selectedProfile();
    if (profile != null) {
      RDNA.RDNAProxySettings proxySettings = null;

      if (profile.isUsingProxy() == 1
              && profile.getProxyIp() != null
              && !profile.getProxyIp().isEmpty()) {

        proxySettings = new RDNA.RDNAProxySettings(profile.getProxyIp(),
                                                   profile.getProxyPort(),
                                                   profile.getProxyUsername(),
                                                   profile.getProxyPassword());
      }

      final Profile finProfile = profile;
      connectedProfile = finProfile;
      final RDNA.RDNAProxySettings finProxySettings = proxySettings;

      new Thread(new Runnable()
      {
        @Override
        public void run()
        {
          // Sync register to make sure you have token before Initialize of the RDNA.
          //GCMDeviceRegistrationService.register(context);

          //Initializing RDNA
          if (null != rdnaClientCallback){
            callOnMainThread(new Runnable() {
              @Override
              public void run() {
                rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_INITIALIZE);
              }
            });
          }
          RDNA.RDNAStatus<RDNA> rdnaStatus = RDNA.Initialize(finProfile.getRelId(), callbacks, finProfile.getHost(), finProfile.getPort(), Constants.CONST_CYPHER_SPEC, Constants.CONST_CYPHER_SALT, finProxySettings, null, null, RDNA.RDNALoggingLevel.RDNA_LOG_VERBOSE, context);
          Log.e(TAG, "---- Init " + rdnaStatus.errorCode + " Error Info " + rdnaStatus.errorCode);
          Log.e(TAG, "Get SDK version = " + RDNA.getSDKVersion());
          rdnaObj = rdnaStatus.result;
          int error = rdnaStatus.errorCode;
          if (error != 0) {
            onRDNAResponse(new ErrorInfo(rdnaStatus.errorCode, RDNA.RDNAMethodID.RDNA_METH_INITIALIZE.name()));
          }
        }
      }).start();
    }
  }


  private void setServices(RDNA.RDNAService[] rdnaServices)
  {
    this.rdnaServices = rdnaServices;
  }


  public RDNA.RDNAService[] getServices()
  {
    return rdnaServices;
  }

  public void startService(RDNA.RDNAService service)
  {
    rdnaObj.serviceAccessStart(service);
  }

    /*
     *  This method is called by the Client to submit and verify the challenges.
     */

  public void checkChallenge(RDNA.RDNAChallenge[] challenges, String userID)
  {
    if (null != rdnaClientCallback && rdnaObj != null) {
      rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_CHECK_CHALLENGE);
      int error = rdnaObj.checkChallengeResponse(challenges, userID);
      if (error != 0) {
        onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_CHECK_CHALLENGE.name()));
      }
    }
    else {
      Log.e(TAG, " RdnaStatusCallbak or rdnaObj is null");
    }
  }

  /*
   *  This method is called by the Client when any challenge is to be updated.
   */

  public void updateChallenge(RDNA.RDNAChallenge[] challenges, String userID)
  {
    if (null != rdnaClientCallback) {
      rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_UPDATE_CHALLENGE);
      int error = rdnaObj.updateChallenges(challenges, userID);
      if (error != 0) {
        onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_UPDATE_CHALLENGE.name()));
      }
    }
    else {
      Log.e(TAG, " RdnaStatusCallbak is null");
    }
  }

  /*
   * This method is called to log off the user session
   */

  public void logOff(String userID)
  {
    rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_LOGOFF);
    int error = rdnaObj.logOff(userID);
    if (error != 0) {
      onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_LOGOFF.name()));
    }
  }

  public byte[] encryptDataPacket(byte[] data, String salt)
  {
    RDNA.RDNAStatus<byte[]> status=rdnaObj.encryptDataPacket(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE,Constants.CONST_CYPHER_SPEC,salt.getBytes(),data);
    if(status.errorCode==0){
      return status.result;
    }else
      return null;
  }

  public byte[] decryptDataPacket(byte[] data, String salt){
    RDNA.RDNAStatus<byte[]> status=rdnaObj.decryptDataPacket(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE,Constants.CONST_CYPHER_SPEC,salt.getBytes(),data);
    if(status.errorCode==0){
      return status.result;
    }else
      return null;
  }

  /*
   * This method is called by client to get all challenges for updating .
   */

  public void getAllChallenges(String userID)
  {
    rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_GET_ALL_CHALLENGES);
    int error = rdnaObj.getAllChallenges(userID);
    if (error != 0) {
      onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_GET_ALL_CHALLENGES.name()));
    }
  }

  /*
   * This method is called by client to get post login authentication challenges
   */

  public void getPostLoginChallenges(String userID, String useCaseName)
  {
    rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_GET_POST_LOGIN_CHALLENGES);
    int error = rdnaObj.getPostLoginChallenges(userID, useCaseName);
    if (error != 0) {
      onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_GET_POST_LOGIN_CHALLENGES.name()));
    }
  }

  /*API deprecated
   * This  Method is called by the client to get the challenges for forgot password flow.
   */
  /*public void forgotPassword(String userID)
  {
    rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_FORGOT_PASSWORD);
    int error = rdnaObj.forgotPassword(userID);
    if (error != 0) {
      onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_FORGOT_PASSWORD.name()));
    }
  }
*/
  /*
   * This method is called by client to pause the RDNA.
   */
  public void pauseRnda()
  {
    if (rdnaObj != null) {

      Log.e("PauseResumeLock", "--------- pauseRnda setting current methodId null");
      pauseResumeLock.setCurrentMethodId(null);

      if (pauseResumeLock.getLastMethodId() == null) {

        pauseResumeLock.setLastMethodId(RDNA.RDNAMethodID.RDNA_METH_PAUSE);
        RDNA.RDNAStatus<byte[]> pauseStatus = rdnaObj.pauseRuntime();
        if (pauseStatus.errorCode == 0) {
          pauseState = pauseStatus.result;

        }
        else {
          pauseResumeLock.setLastMethodId(null);
        }
      }
      else {
        pauseResumeLock.setCurrentMethodId(RDNA.RDNAMethodID.RDNA_METH_PAUSE);
      }
    }
  }

   /*
   * This method is called by client to resume the RDNA.
   */

  public int resumeRdna()
  {
    if (pauseState != null) {

      Log.e("PauseResumeLock", "------------ resumeRdna setting current methodId null");
      pauseResumeLock.setCurrentMethodId(null);

      if (pauseResumeLock.getLastMethodId() == null) {
        rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_RESUME);

        pauseResumeLock.setLastMethodId(RDNA.RDNAMethodID.RDNA_METH_RESUME);
        Log.e("JNI", "PauseStateArray Len java = " + pauseState.length);
        RDNA.RDNAStatus<RDNA> rdnaResumeStatus = RDNA.resumeRuntime(pauseState, callbacks, null, RDNA.RDNALoggingLevel.RDNA_NO_LOGS , context);
        rdnaObj = rdnaResumeStatus.result;
        if (rdnaResumeStatus.errorCode != 0) {
          onRDNAResponse(new ErrorInfo(rdnaResumeStatus.errorCode, RDNA.RDNAMethodID.RDNA_METH_RESUME.name()));
          pauseResumeLock.setLastMethodId(null);
        }
        return rdnaResumeStatus.errorCode;
      }
      else {
        pauseResumeLock.setCurrentMethodId(RDNA.RDNAMethodID.RDNA_METH_RESUME);
      }
    }

    return -1;
  }

  /*
   * This method is used to reset the challenge flow/sequence
   * to the initial challenge received in onInitializeCompleted callback.
   */

  public void resetChallenge()
  {
    if (rdnaObj != null) {
      rdnaObj.resetChallenge();
    }
  }

  public void savePauseState(byte[] state)
  {
    try {
      File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "javaPauseStateData.txt");
      if (file.exists()) {
        boolean deleted = file.delete();
      }
      FileOutputStream stateDataOutStream = new FileOutputStream(new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "javaPauseStateData.txt"), false);
      stateDataOutStream.write(state);
      stateDataOutStream.close();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  /*
   * This method is called to shutdown the RDNA.
   */

  public void terminate()
  {
    if (rdnaObj != null) {
      rdnaServices = null;
      int error = rdnaObj.terminate();
      if (error != 0) {
        onRDNAResponse(new ErrorInfo(error, RDNA.RDNAMethodID.RDNA_METH_TERMINATE.name()));
      }
    }
  }

  /*
   * This method is called to shutdown the previous instance of RDNA and initialize the new one.
   */

  public void terminateThenInit(final Application context)
  {
    this.context = context;
    createUiHandler();
    callOnMainThread(new Runnable()
    {
      @Override
      public void run()
      {
        terminate();
        init(context);
      }
    });
  }

  public void resumeOrInitialize(Application context)
  {
    if (resumeRdna() != 0) {
      init(context);
    }
  }

  /*
   * This method encrypts http request
   */
  public String encryptHttpRequest(String httpRequest)
  {
    RDNA.RDNAStatus<String> status = rdnaObj.encryptHttpRequest(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_SESSION, Constants.CONST_CYPHER_SPEC, Constants.CONST_CYPHER_SALT.getBytes(), httpRequest);
    return status.result;
  }

  /*
   * This method decrypts encrypted http response
   */
  public String decryptHttpResponse(String response)
  {
    RDNA.RDNAStatus<String> decryptedResponse = rdnaObj.decryptHttpResponse(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_SESSION, Constants.CONST_CYPHER_SPEC, Constants.CONST_CYPHER_SALT.getBytes(), response);
    return decryptedResponse.result;
  }

  /*
   * This method is to get Configuration.
   */
  public void getConfig(String s)
  {
    if (rdnaObj != null) {
      rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_GET_CONFIG);
      int errCode = rdnaObj.getConfig(s);
      if (errCode != 0) {
        onRDNAResponse(new ErrorInfo(errCode, RDNA.RDNAMethodID.RDNA_METH_GET_CONFIG.name()));
      }
    }
  }

 /* This method fetches the list of devices
  * registered with the corresponding username.
  */

  public void getDeviceDetails()
  {
    int resultcode = rdnaObj.getRegisteredDeviceDetails(Helper.getUserID(context));
  }

  /* This method updates the details of
   * registered devices.
   */

  public int updateDeviceDetails(RDNA.RDNADeviceDetails[] deviceDetails)
  {
    int resultCode = rdnaObj.updateDeviceDetails(Helper.getUserID(context), deviceDetails);
    Log.d(TAG, "updateDeviceDetails Return code:" + resultCode);
    return resultCode;
  }

  public void getNotifications(){
    if (rdnaObj != null) {
      rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_GET_NOTIFICATIONS);
      int errCode = rdnaObj.getNotifications(0,1,"","","");
      if (errCode != 0) {
        onRDNAResponse(new ErrorInfo(errCode, RDNA.RDNAMethodID.RDNA_METH_GET_NOTIFICATIONS.name()));
      }
    }
  }

  public void updateNotification(String notificationID,String response){
    if (rdnaObj != null) {
      rdnaClientCallback.onCallToRDNA(RDNA.RDNAMethodID.RDNA_METH_UPDATE_NOTIFICATION);
      int errCode = rdnaObj.updateNotification(notificationID,response);
      if (errCode != 0) {
        onRDNAResponse(new ErrorInfo(errCode, RDNA.RDNAMethodID.RDNA_METH_UPDATE_NOTIFICATION.name()));
      }
    }
  }

  public boolean isRDNAInitCompleted(){
    if(isRDNAPaused()){
      return true;
    }

    else {
      if (rdnaObj != null) {
        RDNA.RDNAStatus<String> status = rdnaObj.getSessionID();
        if (RDNA.getErrorInfo(status.errorCode) == RDNA.RDNAErrorID.RDNA_ERR_NOT_INITIALIZED) {
          return false;
        } else if (status.errorCode == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  public boolean isRDNAPaused(){
    if(pauseState!=null && pauseState.length > 0){
      return true;
    }

    return false;
  }

  public boolean isUserLoggedIn(){
    if(isRDNAInitCompleted()) {
      String userId = Helper.getLoggenInUserID(context);
      if (userId != null && !userId.isEmpty()) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  public String getSessionId(){
    String sessionID = null;
    if (rdnaObj != null) {
      RDNA.RDNAStatus<String> rdnaGetSessionIDStatus = rdnaObj.getSessionID();
      sessionID = rdnaGetSessionIDStatus.result;
    }

    return sessionID;
  }

  public void setCurrentActivity(Activity activity){
    this.activity = activity;
  }

  private Activity getCurrentActivity(){
    return this.activity;
  }

  public Profile getConnectedProfile(){
    return connectedProfile;
  }

  public RDNA.RDNAStatus<Integer> openHttpConnection(RDNA.RDNAHTTPRequest request, RDNA.RDNAHTTPCallbacks callbacks){
    if(rdnaObj!=null){
      RDNA.RDNAStatus<Integer> requestStatus = rdnaObj.openHttpConnection(request,callbacks);
      return requestStatus;
    }

    return null;
  }

  private void setProxyPort(RDNA.RDNAPort  rdnaPort){
    if (rdnaPort != null && rdnaPort.port!=0) {
      pxyPort = rdnaPort;
    }
  }
}