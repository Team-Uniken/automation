package com.reactrefapp;

import android.os.Handler;
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
            public int onPauseRuntime(RDNA.RDNAStatusPause rdnaStatusPause) {
                return 0;
            }

            @Override
            public int onResumeRuntime(String s) {
                return 0;
            }

            @Override
            public int onConfigReceived(RDNA.RDNAStatusGetConfig rdnaStatusGetConfig) {
                return 0;
            }

            @Override
            public int onCheckChallengeResponseStatus(final String rdnaStatusCheckChallengeResponse) {
                Log.d(TAG, "-------- onCheckChallengeResponseStatus " + rdnaStatusCheckChallengeResponse);
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
            public int onLogOff(RDNA.RDNAStatusLogOff rdnaStatusLogOff) {
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
            public int onGetRegistredDeviceDetails(String s) {
                Logger.d(TAG, "--------- device details "+s);
                //WritableMap params = Arguments.createMap();
                //params.putString("response", s);

                //context
                  //      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    //    .emit("onGetRegistredDeviceDetails", params);
                return 0;
            }

            @Override
            public int onUpdateDeviceDetails(String s) {
                WritableMap params = Arguments.createMap();
                params.putString("response", s);

                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onUpdateDeviceDetails", params);
                return 0;
            }
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
    public void getPostLoginChallenges(String userID, String useCaseName, Callback callback){
        int error = rdnaObj.getPostLoginChallenges(userID, useCaseName);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
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
        int error = rdnaObj.updateDeviceDetails(userID, devices);

        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", error);

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void demo(){
    }
}
