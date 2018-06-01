package com.uniken.rdnaplugin;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;
import android.app.Activity;
import android.content.Context;
import android.util.Base64;
import android.util.Log;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Iterator;
import java.util.concurrent.Semaphore;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.uniken.rdna.RDNA;
import android.os.Handler;
import android.util.Log;
import java.lang.reflect.Method;

import static java.text.DateFormat.DEFAULT;

public class RdnaClient extends CordovaPlugin {
  
  public static final String TAG = "Rdna Plugin";
  private RDNA.RDNACallbacks callbacks;                 // Callback object to get the runtime status of RDNA.
  private RDNA rdnaObj;
  CordovaInterface context;
  CordovaWebView webView;
  CallbackContext callbackContext;
  public String deviceToken;
  public String applicationName;
  public String applicationVersion;
  Semaphore lock = new Semaphore(0, true);
  RDNA.RDNAIWACreds rdnaiwaCreds = null;
  
  /**
   * Constructor.
   */
  public RdnaClient() {
    
  }
  
  /**
   * Sets the context of the Command. This can then be used to do things like
   * get file paths associated with the Activity.
   *
   * @param cordova The context of the main Activity.
   * @param webView The CordovaWebView Cordova is running in.
   */
  
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    Log.v(TAG, "Init RdnaPlugin");
    this.context = context;
    this.webView = webView;
  }

  public boolean execute(final String action, final JSONArray args, CallbackContext callbackContext) throws JSONException {
    
    this.callbackContext = callbackContext;    
    if (action.equals("initialize")) {
      initialize(args);
    } else if (action.equals("terminate")) {
      terminate();
    } else if (action.equals("pauseRuntime")) {
      pauseRuntime();
    } else if (action.equals("resumeRuntime")) {
      resumeRuntime(args);
    } else if (action.equals("logoff")) {
      logOff(args);
    } else if (action.equals("checkChallengeResponse")) {
      checkChallengeResponse(args);
    } else if (action.equals("updateChallenges")) {
      updateChallenges(args);
    } else if (action.equals("getAllChallenges")) {
      getAllChallenges(args);
    } else if (action.equals("getNotifications")) {
      getNotifications(args);
    } else if (action.equals("updateNotifications")) {
      updateNotifications(args);
    } else if (action.equals("getDefaultCipherSalt")) {
      getDefaultCipherSalt();
    } else if (action.equals("getDefaultCipherSpec")) {
      getDefaultCipherSpec();
    }else if (action.equals("setDeviceToken")) {
      setDeviceToken(args);
    } else if (action.equals("setApplicationName")) {
      setApplicationName(args);
    } else if (action.equals("setApplicationVersion")) {
      setApplicationVersion(args);
    } else if (action.equals("encryptDataPacket")) {
      encryptDataPacket(args);
    } else if (action.equals("decryptDataPacket")) {
      decryptDataPacket(args);
    } else if (action.equals("encryptHttpRequest")) {
      encryptHttpRequest(args);
    }else if (action.equals("decryptHttpResponse")) {
      decryptHttpResponse(args);
    }else if (action.equals("getPostLoginChallenges")) {
      getPostLoginChallenges(args);
    } else if (action.equals("getRegisteredDeviceDetails")) {
      getRegisteredDeviceDetails(args);
    } else if (action.equals("updateDeviceDetails")) {
      updateDeviceDetails(args);
    } else if (action.equals("setCredentials")) {
      setCredentials(args);
    }else if (action.equals("getServiceByServiceName")) {
      getServiceByServiceName(args);
    }else if (action.equals("getServiceByTargetCoordinate")) {
      getServiceByTargetCoordinate(args);
    }else if (action.equals("getAllServices")) {
      getAllServices(args);
    }else if (action.equals("serviceAccessStart")) {
      serviceAccessStart(args);
    }else if (action.equals("serviceAccessStop")) {
      serviceAccessStop(args);
    }else if (action.equals("serviceAccessStartAll")) {
      serviceAccessStartAll(args);
    }else if (action.equals("serviceAccessStopAll")) {
      serviceAccessStopAll(args);
    }else if (action.equals("getConfig")) {
      getConfig(args);
    }else if (action.equals("resetChallenge")) {
      resetChallenge(args);
    }else if (action.equals("forgotPassword")) {
      forgotPassword(args);
    }else if (action.equals("getSDKVersion")) {
      getSDKVersion(args);
    }else if (action.equals("getErrorInfo")) {
      getErrorInfo(args);
    }else if (action.equals("getSessionID")) {
      getSessionID();
    }else if (action.equals("getAgentID")) {
      getAgentID();
    }else if(action.equals("getDeviceID")){
      getDeviceID();
    }else if(action.equals("getNotificationHistory")){
      getNotificationHistory(args);
    }else if (action.equals("openHttpConnection")) {
      openHttpConnection(args);
    }
    return true;
  }

  void initialize(JSONArray args) {

    callbacks = new RDNA.RDNACallbacks() {
      @Override
      public int onInitializeCompleted(String s) {
        callJavaScript("onInitializeCompleted", s);
        return 0;
      }

      @Override
      public int onLogOff(String s) {
        callJavaScript("onLogOff", s);
        return 0;
      }

      @Override
      public int onTerminate(String s) {
        callJavaScript("onTerminate", s);
        return 0;
      }

      @Override
      public int onSessionTimeout(String s) {
        callJavaScript("onSessionTimeout", s);
        return 0;
      }

      @Override
      public int onPauseRuntime(String s) {
        callJavaScript("onPauseRuntime", s);
        return 0;
      }

      @Override
      public int onResumeRuntime(String s) {
        callJavaScript("onResumeRuntime", s);
        return 0;
      }

      @Override
      public String getDeviceToken() {
        return deviceToken;
      }

      @Override
      public int onCheckChallengeResponseStatus(String s) {
        callJavaScript("onCheckChallengeResponseStatus", s);
        return 0;
      }

      @Override
      public int onGetAllChallengeStatus(String s) {
        callJavaScript("onGetAllChallengeStatus", s);
        return 0;

      }

      @Override
      public int onUpdateChallengeStatus(String s) {
        callJavaScript("onUpdateChallengeStatus", s);
        return 0;
      }

      @Override
      public int onGetNotifications(String s) {
        callJavaScript("onGetNotifications", s);
        return 0;
      }

      @Override
      public int onUpdateNotification(String s) {
        callJavaScript("onUpdateNotification", s);
        return 0;
      }

      @Override
      public int onGetNotificationsHistory(String s) {
        callJavaScript("onGetNotificationsHistory", s);
        return 0;
      }

      @Override
      public int onGetRegistredDeviceDetails(String s) {
        callJavaScript("onGetRegistredDeviceDetails", s);
        return 0;
      }

      @Override
      public int onUpdateDeviceDetails(String s) {
        callJavaScript("onUpdateDeviceDetails", s);
        return 0;
      }

      @Override
      public String getApplicationName() {
        return applicationName;
      }

      @Override
      public String getApplicationVersion() {
        return applicationVersion;
      }

      @Override
      public int onForgotPasswordStatus(String s) {
        callJavaScript("onForgotPasswordStatus", s);
        return 0;
      }

      @Override
      public int onGetPostLoginChallenges(String s) {
        callJavaScript("onGetPostLoginChallenges", s);
        return 0;
      }

      @Override
      public int onConfigReceived(String s) {
        callJavaScript("onConfigReceived", s);
        return 0;
      }

      @Override
      public RDNA.RDNAIWACreds getCredentials(String s) {
        callJavaScript("getCredentials", s);
        try {
          lock.acquire();
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
        return rdnaiwaCreds;
      }

      @Override
      public int onSdkLogPrintRequest(RDNA.RDNALoggingLevel rdnaLoggingLevel, String s) {
        callJavaScript("onSdkLogPrintRequest", s);
        return 0;
      }

      @Override
      public int onSecurityThreat(String s) {
        callJavaScript("onSecurityThreat", s);
        return 0;
      }

      @Override
      public Context getDeviceContext() {
        return cordova.getActivity();
      }
    };

    try {
      RDNA.RDNAStatus<RDNA> rdnaStatus = RDNA.Initialize(args.getString(0), callbacks, args.getString(1), args.getInt(2), args.getString(3), args.getString(4), null, null,null, RDNA.RDNALoggingLevel.RDNA_NO_LOGS, "edewf");
      rdnaObj = rdnaStatus.result;
      decideCallback(rdnaStatus);
    } catch (Exception e) {
      PluginResult pluginResult = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION, e.toString());
      pluginResult.setKeepCallback(true);
    }
  }

  void logOff(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.logOff(args.getString(0)));
  }

  void terminate() {
    decideCallback(rdnaObj.terminate());
  }

  public void pauseRuntime() {

    decideCallback(rdnaObj.pauseRuntime());
  }

  public void resumeRuntime(JSONArray args) {
    try {
      RDNA.RDNAStatus<RDNA> rdnaStatus = rdnaObj.resumeRuntime(args.getString(0), callbacks, null, RDNA.RDNALoggingLevel.RDNA_NO_LOGS, cordova.getActivity());
      //RDNA.RDNAStatus<RDNA> rdnaStatus = rdnaObj.resumeRuntime(args.getString(0), callbacks, null, cordova.getActivity());
      rdnaObj = rdnaStatus.result;
      decideCallback(rdnaStatus);
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  void checkChallengeResponse(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.checkChallengeResponse(args.getString(0), args.getString(1)));
  }

  void getAllChallenges(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.getAllChallenges(args.getString(0)));
  }

  void updateChallenges(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.updateChallenges(args.getString(0), args.getString(1)));
  }

  public void resetChallenge(JSONArray args) {
    try {
      decideCallback(rdnaObj.resetChallenge());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  void getNotifications(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.getNotifications(args.getInt(0), args.getInt(1), args.getString(2), args.getString(3), args.getString(4)));
  }

  void updateNotifications(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.updateNotification(args.getString(0), args.getString(1)));
  }

  void getRegisteredDeviceDetails(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.getRegisteredDeviceDetails(args.getString(0)));
  }

  void updateDeviceDetails(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.updateDeviceDetails(args.getString(0), args.getString(1)));
  }

  void setApplicationName(JSONArray args) throws JSONException {
    applicationName = args.getString(0);
    createDefaultConstantSettingCallBack(applicationName);
  }

  void setApplicationVersion(JSONArray args) throws JSONException {
    applicationVersion = args.getString(0);
    createDefaultConstantSettingCallBack(applicationVersion);
  }

  void setDeviceToken(JSONArray args) throws JSONException {
    deviceToken = args.getString(0);
    createDefaultConstantSettingCallBack(deviceToken);
  }

  void getSessionID(){
    try {
      decideCallback(rdnaObj.getSessionID());
    }catch (Exception e){}
  }

  private void getAgentID() {
    try {
      decideCallback(rdnaObj.getAgentID());
    }catch (Exception e){}
  }

  private void getDeviceID() {
    try {
      decideCallback(rdnaObj.getDeviceID());
    }catch (Exception e){}
  }

  public void getErrorInfo(JSONArray args) {
    try {
      decideCallback(rdnaObj.getErrorInfo(args.getInt(0)).name());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void getDefaultCipherSpec() {
    decideCallback(rdnaObj.getDefaultCipherSpec());
  }

  public void getDefaultCipherSalt() {
    decideCallback(rdnaObj.getDefaultCipherSalt());
  }

  public void getSDKVersion(JSONArray args) {
    try {
      decideCallback(rdnaObj.getSDKVersion());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void getAllServices(JSONArray args) {
    try {
      decideCallback(rdnaObj.getAllServices());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void getServiceByServiceName(JSONArray args) {
    try {
      decideCallback(rdnaObj.getServiceByServiceName(args.getString(0)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void getServiceByTargetCoordinate(JSONArray args) {
    try {
      decideCallback(rdnaObj.getServiceByTargetCoordinate(args.getString(0),args.getInt(1)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void serviceAccessStart(JSONArray args) {
    try {
      decideCallback(rdnaObj.serviceAccessStart(args.getString(0)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void serviceAccessStop(JSONArray args) {
    try {
      decideCallback(rdnaObj.serviceAccessStop(args.getString(0)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void serviceAccessStartAll(JSONArray args) {
    try {
      decideCallback(rdnaObj.serviceAccessStartAll());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void serviceAccessStopAll(JSONArray args) {
    try {
      decideCallback(rdnaObj.serviceAccessStopAll());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void getNotificationHistory(JSONArray args) throws JSONException{
    decideCallback(rdnaObj.getNotificationHistory(args.getInt(0), args.getString(1), args.getInt(2), args.getString(3), args.getString(4), args.getString(5), args.getString(6), args.getString(7), args.getString(8)));
  }

  public void encryptDataPacket(JSONArray args) {
    try {
      RDNA.RDNAStatus<byte[]> a=rdnaObj.encryptDataPacket(args.getInt(0), args.getString(1), args.getString(2).getBytes(), args.getString(3).getBytes());
      decideCallback(Base64.encodeToString(a.result, Base64.DEFAULT));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void decryptDataPacket(JSONArray args) {
    try {
      decideCallback(rdnaObj.decryptDataPacket(args.getInt(0), args.getString(1), args.getString(2).getBytes(), Base64.decode(args.getString(3), Base64.DEFAULT)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void encryptHttpRequest(JSONArray args) {
    try {
      decideCallback(rdnaObj.encryptHttpRequest(args.getInt(0), args.getString(1), args.getString(2).getBytes(), args.getString(3)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }


  public void decryptHttpResponse(JSONArray args) {
    try {
      decideCallback(rdnaObj.decryptHttpResponse(args.getInt(0), args.getString(1), args.getString(2).getBytes(), args.getString(3)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void forgotPassword(JSONArray args) {
    try {
      decideCallback(rdnaObj.forgotPassword(args.getString(0)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  void getPostLoginChallenges(JSONArray args) throws JSONException {
    decideCallback(rdnaObj.getPostLoginChallenges(args.getString(0), args.getString(1)));
  }

  public void getConfig(JSONArray args) {
    try {
      decideCallback(rdnaObj.getConfig(args.getString(0)));
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void setCredentials(JSONArray args) throws JSONException {
    rdnaiwaCreds = new RDNA.RDNAIWACreds();
    rdnaiwaCreds.userName = args.getString(0);
    rdnaiwaCreds.password = args.getString(1);
    rdnaiwaCreds.authStatus = args.getBoolean(2) == true ? RDNA.RDNAIWAAuthStatus.RDNA_IWA_AUTH_SUCCESS : RDNA.RDNAIWAAuthStatus.RDNA_IWA_AUTH_CANCELLED;
    lock.release();
  }
  
  
  public void openHttpConnection(JSONArray args) throws JSONException {
    RDNA.RDNAHTTPRequest request = new RDNA.RDNAHTTPRequest();
    if(args.getString(0) != null){
      if( args.getInt(0) == 0 ) request.method = RDNA.RDNAHTTPMethods.RDNA_HTTP_POST;
      else request.method = RDNA.RDNAHTTPMethods.RDNA_HTTP_GET;
    }
    if(args.getString(3) != null)
      request.body = args.getString(3).getBytes();
    if(args.getString(1) != null)
      request.url = args.getString(1);
    if(args.getString(2) != null && args.getString(2).length() > 0){
      try {
        JSONObject jsonHeaders = new JSONObject(args.getString(2));
        request.headers = new HashMap<>();
        Iterator<String> iterator = jsonHeaders.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            request.headers.put(key, jsonHeaders.getString(key));
        }
      }catch (JSONException je){
        je.printStackTrace();
      }
    }

    RDNA.RDNAStatus status = rdnaObj.openHttpConnection(request, new RDNA.RDNAHTTPCallbacks() {
        @Override
        public int onHttpResponse(final RDNA.RDNAHTTPStatus rdnaHttpStatus) {
            try {
              JSONArray parentArray = new JSONArray();
              JSONObject parentMap = new JSONObject();
              JSONObject responseStatus = new JSONObject();
              JSONObject response = new JSONObject();
              JSONObject request = new JSONObject();
              JSONObject headers = new JSONObject();
              JSONObject requestHeaders = new JSONObject();

              response.put("version", rdnaHttpStatus.response.version);
              response.put("statusCode",rdnaHttpStatus.response.statusCode);
              response.put("statusMessage",rdnaHttpStatus.response.statusMessage);
              if(rdnaHttpStatus.response.headers!=null) {
                for (String key : rdnaHttpStatus.response.headers.keySet()){
                  headers.put(key,rdnaHttpStatus.response.headers.get(key));
                }
              }
              response.put("headers",headers);
              String responseData = "";
              if(rdnaHttpStatus.response.body!=null)
                responseData = Base64.encodeToString(rdnaHttpStatus.response.body, Base64.NO_WRAP);
              response.put("body",responseData);

              request.put("method",rdnaHttpStatus.request.method.name());
              request.put("url",rdnaHttpStatus.request.url);
              if(rdnaHttpStatus.request.headers!=null) {
                for (String key : rdnaHttpStatus.request.headers.keySet()){
                  requestHeaders.put(key,rdnaHttpStatus.request.headers.get(key));
                }
              }
              request.put("headers",requestHeaders);
              String requestData = "";
              if(rdnaHttpStatus.request.body!=null)
                requestData = new String(rdnaHttpStatus.request.body,Charset.forName("UTF-8"));
              request.put("body",requestData);
              responseStatus.put("httpRequest",request);
              responseStatus.put("httpResponse",response);
              parentMap.put("errorCode",rdnaHttpStatus.errorCode);
              parentMap.put("response",responseStatus);
              parentMap.put("requestID",rdnaHttpStatus.requestID);
              callJavaScript("onHttpResponse", parentMap.toString());
            }catch (JSONException je){
              je.printStackTrace();
            }
            return 0;
          }
      });
    decideCallback(status);
  }

  private synchronized void callJavaScript(String methodName, String s) {
    Log.d("RDNANative", "javascript:cordova.fireDocumentEvent('");
    final StringBuilder stringBuilder = new StringBuilder();
    //stringBuilder.append("javascript:try{cordova.fireDocumentEvent('");
    stringBuilder.append("javascript:cordova.fireDocumentEvent('");
    stringBuilder.append(methodName);
    stringBuilder.append("',");
    stringBuilder.append("{response:'");
    stringBuilder.append(s);
    // stringBuilder.append("'");
    stringBuilder.append("'})");
    //stringBuilder.append(")}catch(error){Android.onError(error.message);}");
    
    Runnable jsLoader =
    new Runnable() {
      public void run() {
        webView.loadUrl(stringBuilder.toString());
        
      }
    };
    try {
      
      Method post = webView.getClass().getMethod("post", Runnable.class);
      post.invoke(webView, jsLoader);
    } catch (Exception e) {
      
      ((Activity) (webView.getContext())).runOnUiThread(jsLoader);
    }
  }
  
  void decideCallback(Object result) {
    try {
      if (result instanceof RDNA.RDNAStatus) {
        RDNA.RDNAStatus rdnaStatus = (RDNA.RDNAStatus) result;
        
        if (rdnaStatus.errorCode == 0) {
          PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, createCallBackRespose(rdnaStatus.errorCode, decideResultTypeAndReturnStringResult(rdnaStatus.result)));
          pluginResult.setKeepCallback(true);
          callbackContext.sendPluginResult(pluginResult);          
        } else {
          PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, createCallBackRespose(rdnaStatus.errorCode, decideResultTypeAndReturnStringResult(rdnaStatus.result)));
          pluginResult.setKeepCallback(true);
          callbackContext.sendPluginResult(pluginResult);
        }        
        
      } else if (result instanceof Integer) {
        Integer errorCode = (Integer) result;
        if (errorCode == 0) {
          PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, createCallBackRespose(errorCode, decideResultTypeAndReturnStringResult(null)));
          pluginResult.setKeepCallback(true);
          callbackContext.sendPluginResult(pluginResult);
          
        } else {
          PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, createCallBackRespose(errorCode, decideResultTypeAndReturnStringResult(null)));
          pluginResult.setKeepCallback(true);
          callbackContext.sendPluginResult(pluginResult);
        }
      } else if (result instanceof String) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, createCallBackRespose(0, decideResultTypeAndReturnStringResult(result)));
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
      }
    } catch (Exception e) {
      PluginResult pluginResult = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION, e.toString());
      pluginResult.setKeepCallback(true);
    }
  }
  
  String decideResultTypeAndReturnStringResult(Object result) {
    if (result instanceof String) {
      
      if (result != null) {
        return (String) result;
      } else {
        return "null";
      }
    } else if (result instanceof byte[]) {
      if (result != null) {
        return new String((byte[]) result);
        //        return  Base64.encodeToString((byte[]) result,Base64.DEFAULT);
      } else {
        return "null";
      }
    } else if (result instanceof RDNA) {
      return "null";
    } else if (result == null) {
      return "null";
    } else if ( result instanceof Integer )
      return String.format("%d", result);
    return "unknown";
  }
  
  String createCallBackRespose(int errCode, String response) throws JSONException {
    JSONObject jsonResObj = new JSONObject();
    jsonResObj.put("error", errCode);
    jsonResObj.put("response", response);
    return jsonResObj.toString();
  }

  void createDefaultConstantSettingCallBack(String result) {

    try {
      if (result != null || result.length() > 0) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, "");
        pluginResult.setKeepCallback(true);

      } else {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, "Invalid Argument");
        pluginResult.setKeepCallback(true);
      }
    } catch (Exception e) {
      PluginResult pluginResult = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION, e.toString());
      pluginResult.setKeepCallback(true);
      callbackContext.sendPluginResult(pluginResult);
    }
  }

  byte[] decodeBase64(String encodedBase64) {
    byte[] base64decodedData = null;
    try {
      base64decodedData = Base64.decode(encodedBase64, Base64.DEFAULT);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return base64decodedData;
  }
}

