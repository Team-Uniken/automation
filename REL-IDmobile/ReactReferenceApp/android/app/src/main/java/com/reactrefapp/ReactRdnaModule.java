package com.reactrefapp;

import android.os.Handler;
import android.telecom.Call;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.uniken.rdna.RDNA;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by uniken on 5/4/16.
 */
public class ReactRdnaModule extends ReactContextBaseJavaModule {

    private RDNA.RDNACallbacks callbacks;                 // Callback object to get the runtime status of RDNA.
    private RDNA rdnaObj;
    private ReactApplicationContext context;
    private String TAG = "ReactRdnaModule";
    Handler uiHandler;

    public ReactRdnaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = getReactApplicationContext();
        createUiHandler();
    }

    private void callOnMainThread(Runnable runnable) {
        uiHandler.post(runnable);
    }

    private void createUiHandler() {
        if (uiHandler == null) {
            uiHandler = new Handler(context.getMainLooper());
        }
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("agentInfo", Constants.AGENT_INFO);
        constants.put("GatewayHost", Constants.HOST);
        constants.put("GatewayPort", Constants.PORT);
        constants.put("RdnaCipherSpecs", Constants.CYPHER_SPEC);
        constants.put("RdnaCipherSalt", Constants.CYPHER_SALT);
        return constants;
    }

    @Override
    public String getName() {
        return "ReactRdnaModule";
    }

    //CONST_AGENTINFO, CONST_RDNA_IP, CONST_RDNA_PORT, CONST_CYPHER_SPEC, CONST_CYPHER_SALT, null, (response) =>
    @ReactMethod
    public void initialize(String agentInfo, String authGatewayHNIP, int authGatewayPort, String cipherSpecs, String cipherSalt, String proxySettings, Callback callback) {

        callbacks = new RDNA.RDNACallbacks(){

            @Override
            public int onInitializeCompleted(String rdnaStatusInit) {

                Logger.d(TAG, "------- "+rdnaStatusInit);
                WritableMap params = Arguments.createMap();
                params.putString("response", rdnaStatusInit);

                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onInitializeCompleted", params);
                return 0;
            }

            @Override
            public Object getDeviceContext() {
                return context;
            }

            @Override
            public String getApplicationFingerprint() {
                return "avsguysdvnh23r76wejfhgqwvshnc7e3tru4251";
            }

            @Override
            public int onTerminate(RDNA.RDNAStatusTerminate rdnaStatusTerminate) {
                return 0;
            }

            @Override
            public int onPauseRuntime(final String rdnaStatusPause) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusPause);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onPauseCompleted", params);
                    }
                };

                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onResumeRuntime(final String status) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", status);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onResumeCompleted", params);
                    }
                };

                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onConfigReceived(RDNA.RDNAStatusGetConfig rdnaStatusGetConfig) {
                return 0;
            }

            @Override
            public int onCheckChallengeResponseStatus(final String rdnaStatusCheckChallengeResponse) {
                Logger.d(TAG, "-------- onCheckChallengeResponseStatus " + rdnaStatusCheckChallengeResponse);
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusCheckChallengeResponse);

                        //WritableArray writableArray = Arguments.createArray();
                        //writableArray.pushMap(params);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onCheckChallengeResponseStatus", params);
                    }
                };

                callOnMainThread(runnable);
                /*int a = 10;
                while(a > 0){
                    a--;
                    Log.d(TAG,"--------- " + a);
                }*/

                return 0;
            }

            @Override
            public int onGetAllChallengeStatus(RDNA.RDNAStatusGetAllChallenges rdnaStatusGetAllChallenges) {
                return 0;
            }

            @Override
            public int onUpdateChallengeStatus(RDNA.RDNAStatusUpdateChallenges rdnaStatusUpdateChallenges) {
                return 0;
            }

            @Override
            public int onForgotPasswordStatus(RDNA.RDNAStatusForgotPassword rdnaStatusForgotPassword) {
                return 0;
            }


            @Override
            public int onLogOff(final String status) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", status);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onLogOff", params);
                    }
                };

                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public RDNA.RDNAIWACreds getCredentials(String s) {
                return null;
            }

            @Override
            public String getApplicationName() {
                return "DemoBanking";
            }

            @Override
            public String getApplicationVersion() {
                return "1.0.0";
            }

            @Override
            public int onGetPostLoginChallenges(String s) {
                WritableMap params = Arguments.createMap();
                params.putString("response", s);

                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onGetPostLoginChallenges", params);
                return 0;
            }

            @Override
            public int onGetRegistredDeviceDetails(final String s) {
                Logger.d(TAG, "--------- device details " + s);
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onGetRegistredDeviceDetails", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            @Override
            public int onUpdateDeviceDetails(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onUpdateDeviceDetails", params);
                    }
                };

                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public String getDeviceToken() {
                return Constants.DEV_TOKEN;
            }

            @Override
            public int onGetNotifications(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onGetNotifications", params);
                    }
                };
                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onUpdateNotification(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onUpdateNotification", params);
                    }
                };
                callOnMainThread(runnable);
                return 0;            }
        };

        RDNA.RDNAStatus<RDNA> rdnaStatus = RDNA.Initialize(agentInfo, callbacks, authGatewayHNIP, authGatewayPort, cipherSpecs, cipherSalt, null, context);
        rdnaObj = rdnaStatus.result;

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", rdnaStatus.errorCode);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void checkChallenges(String challengeRequestArray, String userID, Callback callback){
        Logger.d(TAG , "----- checkChallenges " + challengeRequestArray);
        Logger.d(TAG , "----- userID " + userID);
        int error = rdnaObj.checkChallenges(challengeRequestArray, userID);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void terminate(Callback callback){
        Logger.d(TAG , "----- terminate call ");
        int error = rdnaObj.terminate();

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getNotifications(String recordCount, String startRecord, String enterpriseID, String startDate, String endDate, Callback callback){
        Logger.d(TAG , "----- getNotification ");
        Logger.d(TAG , "----- recordCount " + recordCount);
        Logger.d(TAG , "----- startRecord " + startRecord);
        Logger.d(TAG , "----- enterpriseID " + enterpriseID);
        Logger.d(TAG , "----- startDate " + startDate);
        Logger.d(TAG , "----- endDate " + endDate);


        int intRecordCount=Integer.parseInt(recordCount);
        int intStartRecord=Integer.parseInt(startRecord);

        int error = rdnaObj.getNotifications(intRecordCount, intStartRecord, enterpriseID, startDate, endDate);

        Logger.d(TAG , "----- error " + error);
        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);
        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }
    @ReactMethod
    public void updateNotification(String notificationID, String response, Callback callback){
        Logger.d(TAG , "----- updateNotification ");
        Logger.d(TAG , "----- notificationID " + notificationID);
        Logger.d(TAG , "----- startReresponsecord " + response);

        int error = rdnaObj.updateNotifications(notificationID, response);
        Logger.d(TAG , "----- error " + error);
        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);
        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getPostLoginChallenges(String userID, String useCaseName, Callback callback){
        int error = rdnaObj.getPostLoginChallenges(userID, useCaseName);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void setDevToken(String devToken){
      Log.d(TAG, "setdevtoken:" + devToken);
      String deviceToken=null;
      try {
        JSONObject jobj=new JSONObject(devToken);
        deviceToken= jobj.getString("token");
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Constants.DEV_TOKEN=deviceToken;
    }

    @ReactMethod
    public void getRegisteredDeviceDetails(String userID, Callback callback){
        int error = rdnaObj.getRegisteredDeviceDetails(userID);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void updateDeviceDetails(String userID, String devices, Callback callback){
        int error = 0;
        if(rdnaObj != null)
            error = rdnaObj.updateDeviceDetails(userID, devices);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void pauseRuntime(Callback callback){

        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj != null) {
            String state = rdnaObj.pauseRuntime();
            errorMap.putInt("error", 0);
            errorMap.putString("response", state);
        } else {
            errorMap.putInt("error", 1);
            errorMap.putString("response", "");
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void resumeRuntime(String state, String proxySettings, Callback callback){
        WritableMap errorMap = Arguments.createMap();

        if(rdnaObj != null) {
            try {
                JSONObject jsonObject = new JSONObject(state);
                RDNA.RDNAStatus<RDNA> rdnaStatus = rdnaObj.resumeRuntime(jsonObject.getString("response"), callbacks, proxySettings, context);
                rdnaObj = rdnaStatus.result;
                errorMap.putInt("error", rdnaStatus.errorCode);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        } else {
            errorMap.putInt("error", 1);
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void logOff(String userId, Callback callback){
        WritableMap errorMap = Arguments.createMap();

        if(rdnaObj != null) {
            int error = rdnaObj.logOff(userId);
            errorMap.putInt("error", error);
        } else {
            errorMap.putInt("error", 1);
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void encryptDataPacket(String data,String salt, Callback callback)
    {
        RDNA.RDNAStatus<byte[]> status=rdnaObj.encryptDataPacket(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE, Constants.CYPHER_SPEC, salt.getBytes(), data.getBytes());
        WritableMap statusMap = Arguments.createMap();
        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                String base64EncodedString = Base64.encodeToString(status.result, Base64.DEFAULT);
                statusMap.putString("response", base64EncodedString);
            }
        } else {
            statusMap.putInt("error", 1);
        }

        callback.invoke(statusMap);
    }

    @ReactMethod
    public void decryptDataPacket(String data,String salt,Callback callback){
        byte[] base64decodedData = null;
        if(data!=null && data.length() > 0){
            base64decodedData = Base64.decode(data,Base64.DEFAULT);
        }

        RDNA.RDNAStatus<byte[]> status=rdnaObj.decryptDataPacket(RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE, Constants.CYPHER_SPEC, salt.getBytes(), base64decodedData);
        WritableMap statusMap = Arguments.createMap();
        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response", new String(status.result));
            }
        } else {
            statusMap.putInt("error", 1);
        }

        callback.invoke(statusMap);
    }

    @ReactMethod
    public void demo(){
    }
}
