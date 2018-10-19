package com.reactrefapp;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.telecom.Call;
import android.util.Base64;
import android.util.Log;
import android.util.Pair;
import android.webkit.WebView;

//import com.better.workspace.lib.BetterMTD;
//import com.better.workspace.lib.model.ThreatCategory;
//import com.better.workspace.lib.model.ThreatType;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.uniken.rdna.RDNA;
import com.facebook.react.uimanager.UIManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

/**
 * Created by uniken on 5/4/16.
 */
public class ReactRdnaModule extends ReactContextBaseJavaModule {

    int i;
    String uName = "";

    Handler uiHandler;
    Semaphore lock = new Semaphore(0,true);
    RDNA.RDNAIWACreds rdnaiwaCreds = null;

    private RDNA.RDNACallbacks callbacks;                 // Callback object to get the runtime status of RDNA.
    private RDNA rdnaObj;
    private ReactApplicationContext context;
    private String TAG = "ReactRdnaModule";
    private HashMap<Integer,Callback> callbackHashMap = new HashMap<>();
    private final int ERROR_HEALTH_CHECK_FAILED = 1000;
    AlertDialog alertDialog = null;
    boolean isResumeSuccess = true, isPauseSuccess = true;
    private static final String PAUSE_RESUME_ERROR_MESSAGE = "Please wait, While we resume our SDK";

    public ReactRdnaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = getReactApplicationContext();
        createUiHandler();
    }

    void showOrUpdateThreatAlert(String msg,final DialogInterface.OnClickListener clickListener){
        if(context.getCurrentActivity()!=null) {
            if (alertDialog == null) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context.getCurrentActivity());
                builder.setPositiveButton("Quit", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        clickListener.onClick(dialog, which);
                        alertDialog = null;
                    }
                });
                builder.setCancelable(false)
                        .setTitle("Error");

                alertDialog = builder.create();
            }

            alertDialog.setMessage(msg);
            alertDialog.show();
        }

    }

    private void showErrorMessage(String msg){
            if (alertDialog == null) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context.getCurrentActivity());
                builder.setCancelable(true);
                alertDialog = builder.create();
            }
            alertDialog.setMessage(msg);
            alertDialog.show();
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
        constants.put("PRIVACY_SCOPE_DEVICE",RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE.intValue);
        constants.put("PRIVACY_SCOPE_AGENT", RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_AGENT.intValue);
        constants.put("PRIVACY_SCOPE_USER", RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_USER.intValue);
        constants.put("PRIVACY_SCOPE_SESSION", RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_SESSION.intValue);
        constants.put(RDNA.RDNAHTTPMethods.RDNA_HTTP_POST.name(), RDNA.RDNAHTTPMethods.RDNA_HTTP_POST.name());
        constants.put(RDNA.RDNAHTTPMethods.RDNA_HTTP_GET.name(),RDNA.RDNAHTTPMethods.RDNA_HTTP_GET.name());
        constants.put("RdnaCipherSpecs", Constants.CYPHER_SPEC);
        constants.put("RdnaCipherSalt", Constants.CYPHER_SALT);
        constants.put("AppVersion",BuildConfig.VERSION_NAME);
        constants.put("ERROR_HEALTH_CHECK_FAILED",ERROR_HEALTH_CHECK_FAILED);
        return constants;
    }

    @Override
    public String getName() {
        return "ReactRdnaModule";
    }

    @ReactMethod
    public void exitApp(){
        System.exit(0);
    }

    @ReactMethod
    public void initialize(final String agentInfo,final String authGatewayHNIP,final int authGatewayPort,final String cipherSpecs,final String cipherSalt, String proxySettings,String sslCertificate,final Callback callback) {

        callbacks = new RDNA.RDNACallbacks(){

            @Override
            public int onInitializeCompleted(String rdnaStatusInit) {
                i=0;
                WritableMap params = Arguments.createMap();
                params.putString("response", rdnaStatusInit);

                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onInitializeCompleted", params);
                return 0;
            }

            @Override
            public Context getDeviceContext() {
                return context;
            }

            @Override
            public int onTerminate(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onTerminate", params);
                    }
                };

                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onPauseRuntime(final String rdnaStatusPause) {
                    if( !isPauseSuccess && isResumeSuccess ) {
                        isPauseSuccess = true;
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
                    }else return 1;
            }

            @Override
            public int onResumeRuntime(final String status) {
                if( !isResumeSuccess && isPauseSuccess ) {
                    isResumeSuccess = true;
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
                }else return 1;

            }

            @Override
            public int onConfigReceived(final String rdnaStatusGetConfig) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusGetConfig);


                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onConfigReceived", params);
                    }
                };
                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onCheckChallengeResponseStatus(final String rdnaStatusCheckChallengeResponse) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusCheckChallengeResponse);

                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onCheckChallengeResponseStatus", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            @Override
            public int onGetAllChallengeStatus(final String rdnaStatusGetAllChallenges) {
                Runnable runnable= new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusGetAllChallenges);

                        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onGetAllChallengeStatus", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            @Override
            public int onUpdateChallengeStatus(final String rdnaStatusUpdateChallenges) {
                Runnable runnable= new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaStatusUpdateChallenges);

                        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onUpdateChallengeStatus", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            /*@Override
            public int onForgotPasswordStatus(String s) {
                return 0;
            }

//            @Override
//            public int onForgotPasswordStatus(final String rdnaStatusForgotPassword) {
//                Runnable runnable= new Runnable() {
//                    @Override
//                    public void run() {
//                        WritableMap params = Arguments.createMap();
//                        params.putString("response", rdnaStatusForgotPassword);
//
//                        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                                .emit("onForgotPasswordStatus", params);
//                    }
//                };
//
//                callOnMainThread(runnable);
//
//                return 0;
//            }*/

            @Override
            public int onLogOff(final String status) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", status);

                        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onLogOff", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            @Override
            public RDNA.RDNAIWACreds getCredentials(final String domainUrl) {

                if(i==0){
                    Runnable runnable = new Runnable() {
                        @Override
                        public void run() {
                            WritableMap params = Arguments.createMap();
                            params.putString("response", uName);
                            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("onGetpassword", params);
                        }
                    };

                    callOnMainThread(runnable);
                    i++;
                }else{
                    Runnable runnable = new Runnable() {
                        @Override
                        public void run() {
                            WritableMap params = Arguments.createMap();
                            params.putString("response", domainUrl);
                            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("onGetCredentials", params);
                        }
                    };
                    callOnMainThread(runnable);
                }



                try {
                    lock.acquire();
                } catch (InterruptedException e) {
                }

                return rdnaiwaCreds;
            }

            /*@Override
            public String getApplicationName() {
                return BuildConfig.APPLICATION_ID;
            }

            @Override
            public String getApplicationVersion() {
                return BuildConfig.VERSION_NAME;
            }*/

            @Override
            public int onGetPostLoginChallenges(final String rdnaGetPostLoginStatus) {

                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaGetPostLoginStatus);

                        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onGetPostLoginChallenges", params);
                    }
                };

                callOnMainThread(runnable);

                return 0;
            }

            @Override
            public int onGetRegistredDeviceDetails(final String s) {

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
            public int onUpdateDeviceDetails(final String rdnaUpdateDeviceStatus) {

                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", rdnaUpdateDeviceStatus);

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
                       // String p= "{ \"errCode\": 0, \"eMethId\": 14, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"notifications\": [ {\"notification_uuid\":\"77a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}], \"start\": 1, \"count\": 0, \"total\": 0 }, \"ResponseDataLen\": 60, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                     //   String p= "{ \"errCode\": 0, \"eMethId\": 14, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"notifications\": [{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}], \"start\": 1, \"count\": 0, \"total\": 0 }, \"ResponseDataLen\": 60, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p= "{ \"errCode\": 0, \"eMethId\": 14, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"notifications\": [ {\"notification_uuid\":\"77a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}], \"start\": 1, \"count\": 0, \"total\": 0 }, \"ResponseDataLen\": 60, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p= "{ \"errCode\": 0, \"eMethId\": 14, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"notifications\": [ {\"notification_uuid\":\"77a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"17a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"27a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"37a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"47a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"57a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}], \"start\": 1, \"count\": 0, \"total\": 0 }, \"ResponseDataLen\": 60, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p= "{ \"errCode\": 0, \"eMethId\": 14, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"notifications\": [ {\"notification_uuid\":\"07a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"17a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"27a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Hindi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"37a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"47a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"57a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}], \"start\": 1, \"count\": 0, \"total\": 0 }, \"ResponseDataLen\": 60, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";


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
                return 0;
            }

            @Override
            public int onGetNotificationsHistory(final String status) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                       // String p = "{ \"errCode\": 0, \"eMethId\": 16, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"total_count\": 1, \"history\": [{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8l\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]} ] }, \"ResponseDataLen\": 36, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p = "{ \"errCode\": 0, \"eMethId\": 16, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"total_count\": 1, \"history\": [{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8l\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}] }, \"ResponseDataLen\": 36, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p = "{ \"errCode\": 0, \"eMethId\": 16, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"total_count\": 2, \"history\": [{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8l\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]} ] }, \"ResponseDataLen\": 36, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p = "{ \"errCode\": 0, \"eMethId\": 16, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"total_count\": 6, \"history\": [{\"notification_uuid\":\"17a1e04f-6408-47b9-891f-e110775d9e8l\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"27a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"37a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"47a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"57a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"67a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]} ] }, \"ResponseDataLen\": 36, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                       // String p = "{ \"errCode\": 0, \"eMethId\": 16, \"pArgs\": { \"service_details\": { }, \"response\": { \"ResponseData\": { \"total_count\": 7, \"history\":[ {\"notification_uuid\":\"07a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"17a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"27a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"77a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Hindi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"37a1e04f-6408-47b9-861f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}},{\\\"lng\\\":\\\"Marathi\\\",\\\"subject\\\":\\\"अधिसूचना\\\",\\\"message\\\":\\\"समजण्यास सोपी अशी माहिती.\\\",\\\"label\\\":{\\\"Accept\\\":\\\"स्वीकार करा\\\",\\\"Reject\\\":\\\"नाकारा\\\",\\\"Fraud\\\":\\\"फ्रॉड\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"47a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]},{\"notification_uuid\":\"57a1e04f-6408-47b9-891f-e110775d9e8f\",\"action_performed\":\"\",\"ds_required\":true,\"status\":\"EXPIRED\",\"delivery_status\":\"PARTIALLY_NOTIFIED\",\"create_ts\":\"2018-04-18T07:28:48UTC\",\"expiry_timestamp\":\"2018-04-18T07:29:48UTC\",\"update_ts\":\"2018-04-18T07:29:48UTC\",\"enterprise_id\":\"CBCVERIFY\",\"signing_status\":\"Failed\",\"body\":\"[{\\\"lng\\\":\\\"English\\\",\\\"subject\\\":\\\"Notification Alert\\\",\\\"message\\\":\\\"This is a notification message\\\",\\\"label\\\":{\\\"Accept\\\":\\\"Accept\\\",\\\"Reject\\\":\\\"Reject\\\",\\\"Fraud\\\":\\\"Fraud\\\"}}]\",\"actions\":[{\"label\":\"Accept\",\"action\":\"Accept\",\"authlevel\":0},{\"label\":\"Reject\",\"action\":\"Reject\",\"authlevel\":1},{\"label\":\"Fraud\",\"action\":\"Fraud\",\"authlevel\":1}]}]  }, \"ResponseDataLen\": 36, \"StatusMsg\": \"Success\", \"StatusCode\": 100, \"CredOpMode\": 0 }, \"pxyDetails\": { \"isStarted\": 0, \"isLocalhostOnly\": 0, \"isAutoStarted\": 0, \"isPrivacyEnabled\": 0, \"portType\": 0, \"port\": 0 } } }";
                        params.putString("response", status);
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onGetNotificationsHistory", params);
                    }
                };
                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onSessionTimeout(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onSessionTimeout", params);
                    }
                };
                callOnMainThread(runnable);
                return 0;
            }

            @Override
            public int onSdkLogPrintRequest(RDNA.RDNALoggingLevel rdnaLoggingLevel,final String s) {
                Log.e("RDNA-CORE",rdnaLoggingLevel.name()+ " : "+s);
                return 0;
            }

            @Override
            public int onSecurityThreat(final String s) {
                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        WritableMap params = Arguments.createMap();
                        params.putString("response", s);
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onSecurityThreat", params);

                        String msg = s;
                        showOrUpdateThreatAlert("Threats detected on your system : \n" + msg, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                if(rdnaObj!=null)
                                    rdnaObj.terminate();
                                if(getCurrentActivity()!=null)
                                    ActivityCompat.finishAffinity(getCurrentActivity());
                            }
                        });
                    }
                };
                callOnMainThread(runnable);
                return 0;
            }
        };



        RDNA.RDNASSLCertificate rdnaSSLCertificate = null;
        try{
            if(sslCertificate!=null) {
                JSONObject jsonSSl = new JSONObject(sslCertificate);
                rdnaSSLCertificate = new RDNA.RDNASSLCertificate(jsonSSl.optString("data"),jsonSSl.optString("password"));
            }
        }catch (Exception e){}

        final RDNA.RDNASSLCertificate rdnaSSLCert = rdnaSSLCertificate;

        new Thread(new Runnable() {
            @Override
            public void run() {
                RDNA.RDNAStatus<RDNA> rdnaStatus = RDNA.Initialize(agentInfo, callbacks, authGatewayHNIP, authGatewayPort, cipherSpecs, cipherSalt, null, rdnaSSLCert, null, RDNA.RDNALoggingLevel.RDNA_NO_LOGS, context);
                rdnaObj = rdnaStatus.result;

                WritableMap errorMap = Arguments.createMap();
                errorMap.putInt("error", rdnaStatus.errorCode);

                WritableArray writableArray = Arguments.createArray();
                writableArray.pushMap(errorMap);

                callback.invoke(writableArray);
            }
        }).start();

//
//        new Thread(new Runnable()
//        {
//            @Override
//            public void run()
//            {
//                BetterMTD betterMTD = BetterMTD.init(context.getApplicationContext());
//                List<Pair<ThreatCategory,ThreatType>> betterResult =  betterMTD.healthCheck(context.getApplicationContext());
//                RDNA.RDNAStatus<RDNA> rdnaStatus = null;
//                if(betterResult.size() == 0){
//                    rdnaStatus = RDNA.Initialize(agentInfo, callbacks, authGatewayHNIP, authGatewayPort, cipherSpecs, cipherSalt, null,null,null, context);
//                    rdnaObj = rdnaStatus.result;
//
//                    WritableMap errorMap = Arguments.createMap();
//                    errorMap.putInt("error", rdnaStatus.errorCode);
//
//                    WritableArray writableArray = Arguments.createArray();
//                    writableArray.pushMap(errorMap);
//
//                    callback.invoke(writableArray);
//                }else{
//                      Runnable runnable = new Runnable() {
//                          @Override
//                          public void run() {
//                              AlertDialog.Builder alertBuilder = new AlertDialog.Builder(context.getCurrentActivity());
//                              alertBuilder.setPositiveButton("Quit", new DialogInterface.OnClickListener() {
//                                  @Override
//                                  public void onClick(DialogInterface dialogInterface, int i) {
//                                      System.exit(0);
//                                  }
//                              });
//
//                              alertBuilder.setTitle("Alert");
//                              alertBuilder.setMessage("This device is not safe");
//                              alertBuilder.setCancelable(false);
//                              alertBuilder.show();
//                          }
//                      };
//
//                      callOnMainThread(runnable);
////                    WritableMap errorMap = Arguments.createMap();
////                    errorMap.putInt("error",ERROR_HEALTH_CHECK_FAILED);
////
////                    WritableArray writableArray = Arguments.createArray();
////                    writableArray.pushMap(errorMap);
////
////                    callback.invoke(writableArray);
//                    Log.e("ReactRdnaModule","BetterMobi Health Check Failed!");
//                }
//            }
//        }).start();
    }

    @ReactMethod
    public void resetChallenge( Callback callback){
        if(rdnaObj!=null) {
            int error = rdnaObj.resetChallenge();
            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void checkChallenges(final String challengeRequestArray,final String userID,final Callback callback){
        if(rdnaObj!=null) {
            new Thread(new Runnable() {

                @Override
                public void run() {
                    uName = userID;
                    int error = rdnaObj.checkChallengeResponse(challengeRequestArray, userID);

                    WritableMap errorMap = Arguments.createMap();
                    errorMap.putInt("error", error);

                    WritableArray writableArray = Arguments.createArray();
                    writableArray.pushMap(errorMap);

                    callback.invoke(writableArray);
                }
            }).start();
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void updateChallenges(String challenges, String userID, Callback callback){
        if(rdnaObj!=null) {
            int error = rdnaObj.updateChallenges(challenges, userID);

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void getAllChallenges(final String userID,final Callback callback){
        if(rdnaObj!=null) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    int error = -1;
                    if (rdnaObj != null)
                        error = rdnaObj.getAllChallenges(userID);

                    WritableMap errorMap = Arguments.createMap();
                    errorMap.putInt("error", error);

                    WritableArray writableArray = Arguments.createArray();
                    writableArray.pushMap(errorMap);

                    callback.invoke(writableArray);
                }
            }).start();
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void terminate(Callback callback){
        // Logger.d(TAG , "----- terminate call ");
        if(rdnaObj!=null) {
            int error = rdnaObj.terminate();

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void getNotifications(String recordCount, String startRecord, String enterpriseID, String startDate, String endDate, Callback callback){

        if(rdnaObj!=null) {
            int intRecordCount = Integer.parseInt(recordCount);
            int intStartRecord = Integer.parseInt(startRecord);
            int error = -1;
            if (rdnaObj != null) {
                error = rdnaObj.getNotifications(intRecordCount, enterpriseID, intStartRecord, startDate, endDate);
            }

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);
            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);
            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void getNotificationHistory(int recordCount,String enterpriseID,int startIndex,String startDate,String endDate,
                                       String notificationStatus,String actionPerformed,String keywordSearch,String deviceID,Callback callback){
        if(rdnaObj!=null) {
            int error = rdnaObj.getNotificationHistory(recordCount, enterpriseID, startIndex, startDate, endDate, notificationStatus, actionPerformed, keywordSearch, deviceID);

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);
            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);
            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void updateNotification(final String notificationID, final String response,final Callback callback){
        if(rdnaObj!=null) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    int error = rdnaObj.updateNotification(notificationID, response);
                    WritableMap errorMap = Arguments.createMap();
                    errorMap.putInt("error", error);
                    WritableArray writableArray = Arguments.createArray();
                    writableArray.pushMap(errorMap);
                    callback.invoke(writableArray);
                }
            }).start();
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

    }

    @ReactMethod
    public void getPostLoginChallenges(String userID, String useCaseName, Callback callback){
        if(rdnaObj!=null) {
            int error = rdnaObj.getPostLoginChallenges(userID, useCaseName);

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void setDevToken(String devToken){
        Constants.DEV_TOKEN=devToken;
    }

    @ReactMethod
    public void getRegisteredDeviceDetails(String userID, Callback callback){
        if(rdnaObj!=null) {
            int error = rdnaObj.getRegisteredDeviceDetails(userID);

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void updateDeviceDetails(String userID, String devices, Callback callback){
        if(rdnaObj!=null) {
            int error = 0;
            if (rdnaObj != null)
                error = rdnaObj.updateDeviceDetails(userID, devices);

            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", error);

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }else {
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void pauseRuntime(Callback callback){
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj != null && isPauseSuccess && isResumeSuccess) {
            isPauseSuccess = false;
            RDNA.RDNAStatus<String> status = rdnaObj.pauseRuntime();
            try {
                int error = status.errorCode;
                errorMap.putInt("error",error);
                errorMap.putString("response", status.result);
                if(error==0)
                    rdnaObj= null;
            } catch (Exception e) {
               // e.printStackTrace();
                errorMap.putInt("error", 1);
                errorMap.putString("response", "");
            }

        } else {
            errorMap.putInt("error", 1);
            errorMap.putString("response", "");
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void resumeRuntime(final String state,final String proxySettings,final Callback callback){
        if( isResumeSuccess && isPauseSuccess ) {
            isResumeSuccess = false;
            new Thread(new Runnable() {
                @Override
                public void run() {

                    WritableMap errorMap = Arguments.createMap();
                        try {
                            RDNA.RDNAStatus<RDNA> rdnaStatus = RDNA.resumeRuntime(state, callbacks, proxySettings, RDNA.RDNALoggingLevel.RDNA_NO_LOGS, context);
                            rdnaObj = rdnaStatus.result;
                            errorMap.putInt("error", rdnaStatus.errorCode);
                        } catch (Exception e) {
                            errorMap.putInt("error", 1);
                        }

                    WritableArray writableArray = Arguments.createArray();
                    writableArray.pushMap(errorMap);

                    callback.invoke(writableArray);
                }
            }).start();

        }
    }

    @ReactMethod
    public void logOff(String userId, Callback callback){
        WritableMap errorMap = Arguments.createMap();

        if(rdnaObj != null) {
            int error = rdnaObj.logOff(userId);
            errorMap.putInt("error", error);
        } else {
            errorMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getConfig(String userId, Callback callback){
        WritableMap errorMap = Arguments.createMap();

        if(rdnaObj != null) {
            int error = rdnaObj.getConfig(userId);
            errorMap.putInt("error", error);
        } else {
            errorMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }


    @ReactMethod
    public void testConfig(String userId, Callback callback){
        WritableMap errorMap = Arguments.createMap();

        if(rdnaObj != null) {
            int error = rdnaObj.getConfig(userId);
            rdnaObj.terminate();
            errorMap.putInt("error", error);
        } else {
            errorMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);

        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getDefaultCipherSalt(Callback callback)
    {
        RDNA.RDNAStatus<byte[]> status=rdnaObj.getDefaultCipherSalt();
        WritableMap statusMap = Arguments.createMap();
        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response",new String(status.result));
            }
        } else {
            statusMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
        callback.invoke(statusMap);
    }

    @ReactMethod
    public void encryptDataPacket(int scope, String cipherSpecs, String salt, String data, Callback callback)
    {
        RDNA.RDNAPrivacyScope privacyScope = null;
//        if(scope == null)
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_DEVICE")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
//        }
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_AGENT")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_AGENT;
//        }//        else if(scope.equals("RDNA_PRIVACY_SCOPE_USER")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_USER;
//        }
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_SESSION")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_SESSION;
//        }

        if(cipherSpecs == null)
            cipherSpecs = Constants.CYPHER_SPEC;

        /*if(scope == null)
            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
        else
            privacyScope = RDNA.RDNAPrivacyScope.valueOf(scope);*/


        RDNA.RDNAStatus<byte[]> status=rdnaObj.encryptDataPacket(scope, cipherSpecs, salt!=null?salt.getBytes():null, data!=null?data.getBytes():null);
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
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray result = Arguments.createArray();
        result.pushMap(statusMap);
        callback.invoke(result);
    }

    @ReactMethod
    public void decryptDataPacket(int scope, String cipherSpecs, String salt, String data, Callback callback){
        RDNA.RDNAPrivacyScope privacyScope = null;

//        if(scope == null)
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_DEVICE")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
//        }
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_AGENT")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_AGENT;
//        }
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_USER")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_USER;
//        }
//        else if(scope.equals("RDNA_PRIVACY_SCOPE_SESSION")){
//            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_SESSION;
//        }
        WritableMap statusMap = Arguments.createMap();

        if(rdnaObj != null) {
          byte[] base64decodedData = null;
          if(data!=null && data.length() > 0){
               base64decodedData = Base64.decode(data,Base64.DEFAULT);
          }

        /*if(cipherSpecs == null)
            cipherSpecs = Constants.CYPHER_SPEC;

        if(scope == null)
            privacyScope = RDNA.RDNAPrivacyScope.RDNA_PRIVACY_SCOPE_DEVICE;
        else
            privacyScope = RDNA.RDNAPrivacyScope.valueOf(scope);*/

        RDNA.RDNAStatus<byte[]> status=rdnaObj.decryptDataPacket(scope, cipherSpecs, salt!=null?salt.getBytes():null, base64decodedData);

            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response", new String(Base64.encodeToString(status.result,Base64.NO_WRAP)));
            }
        } else {
            statusMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray result = Arguments.createArray();
        result.pushMap(statusMap);
        callback.invoke(result);
    }

    @ReactMethod
    public void setCredentials(String username,String password,boolean val,Callback callback){
        rdnaiwaCreds = new RDNA.RDNAIWACreds();
        rdnaiwaCreds.userName = username;
        rdnaiwaCreds.password = password;
        rdnaiwaCreds.authStatus = val == true ? RDNA.RDNAIWAAuthStatus.RDNA_IWA_AUTH_SUCCESS : RDNA.RDNAIWAAuthStatus.RDNA_IWA_AUTH_CANCELLED;
        WritableMap errorMap = Arguments.createMap();
        errorMap.putInt("error", 0);
        WritableArray writableArray = Arguments.createArray();
        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
        lock.release();
    }

    /*@ReactMethod
    public void forgotPassword(String userId,Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            int error =   rdnaObj.forgotPassword(userId);
            errorMap.putInt("error", error);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }*/

    @ReactMethod
    public void getDeviceID(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status =   rdnaObj.getDeviceID();
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    public RDNA.RDNASSLCertificate getSSLCertificate(){
        RDNA.RDNASSLCertificate certificate = null;
        try {
            byte[] data = getAssetContent(getReactApplicationContext(), "cert/clientcert.p12");
            String base64Byte5 = Base64.encodeToString(data,Base64.NO_WRAP);
            certificate = new RDNA.RDNASSLCertificate(base64Byte5,"uniken123$");
        }catch (Exception e){}

        return certificate;
    }

    public static byte[] getAssetContent(Context context, String file) throws IOException {
        InputStream stream = null;
        stream = context.getAssets().open(file);
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        int nRead;
        byte[] data = new byte[16384];

        while ((nRead = stream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }

        buffer.flush();

        return buffer.toByteArray();
    }

    @ReactMethod
    public void openHttpConnection(final String httpMethod, String url, final String headers, String body, final Callback callback){
        final WritableMap errorMap = Arguments.createMap();
        WritableArray parentArray = Arguments.createArray();
        if(rdnaObj!=null){
            RDNA.RDNAHTTPRequest request = new RDNA.RDNAHTTPRequest();
            if(httpMethod!=null)
                request.method = RDNA.RDNAHTTPMethods.valueOf(httpMethod);
            if(body!=null)
                request.body = body.getBytes();

            request.url = url;

            if (headers != null) {
                try {
                    JSONObject jsonHeaders = new JSONObject(headers);
                    request.headers = new HashMap<>();
                    Iterator<String> iterator = jsonHeaders.keys();
                    while (iterator.hasNext()) {
                        String key = iterator.next();
                        request.headers.put(key, jsonHeaders.getString(key));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            RDNA.RDNAStatus status = rdnaObj.openHttpConnection(request, new RDNA.RDNAHTTPCallbacks() {
                @Override
                public int onHttpResponse(final RDNA.RDNAHTTPStatus rdnaHttpStatus) {
                    Runnable runnable = new Runnable() {
                        @Override
                        public void run() {
                            WritableArray parentArray = Arguments.createArray();
                            WritableMap parentMap = Arguments.createMap();
                            WritableMap responseStatus = Arguments.createMap();
                            WritableMap response = Arguments.createMap();
                            WritableMap request = Arguments.createMap();
                            WritableMap headers = Arguments.createMap();
                            WritableMap requestHeaders = Arguments.createMap();

                            response.putString("version",rdnaHttpStatus.response.version);
                            response.putInt("statusCode",rdnaHttpStatus.response.statusCode);
                            response.putString("statusMessage",rdnaHttpStatus.response.statusMessage);
                            if(rdnaHttpStatus.response.headers!=null) {
                                for (String key : rdnaHttpStatus.response.headers.keySet()){
                                    headers.putString(key,rdnaHttpStatus.response.headers.get(key));
                                }
                            }
                            response.putMap("headers",headers);
                            String responseData = "";
                            if(rdnaHttpStatus.response.body!=null)
                                responseData = new String(rdnaHttpStatus.response.body, Charset.forName("UTF-8"));
                            response.putString("body",responseData);

                            request.putString("method",rdnaHttpStatus.request.method.name());
                            request.putString("url",rdnaHttpStatus.request.url);
                            if(rdnaHttpStatus.request.headers!=null) {
                                for (String key : rdnaHttpStatus.request.headers.keySet()){
                                    requestHeaders.putString(key,rdnaHttpStatus.request.headers.get(key));
                                }
                            }
                            request.putMap("headers",requestHeaders);
                            String requestData = "";
                            if(rdnaHttpStatus.request.body!=null)
                                requestData = new String(rdnaHttpStatus.request.body,Charset.forName("UTF-8"));
                            request.putString("body",requestData);
                            responseStatus.putMap("httpRequest",request);
                            responseStatus.putMap("httpResponse",response);
                            parentMap.putInt("error",rdnaHttpStatus.errorCode);
                            parentMap.putMap("response",responseStatus);
                            parentMap.putInt("requestID",rdnaHttpStatus.requestID);
                            parentArray.pushMap(parentMap);
                            callback.invoke(parentArray);
                        }
                    };
                    callOnMainThread(runnable);
                    return 0;
                }
            });

            errorMap.putInt("error", status.errorCode);
            if(status.errorCode!=0){
                parentArray.pushMap(errorMap);
                callback.invoke(parentArray);
            }
        }
        else{
            errorMap.putInt("error",1);
            parentArray.pushMap(errorMap);
            callback.invoke(parentArray);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }
    }

    @ReactMethod
    public void setProxy(final int reactTag,final String host,final int port, final Promise promise) {
        ReactApplicationContext reactContext = this.getReactApplicationContext();
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                WebView view = null;

                try {
                    view = (WebView) nativeViewHierarchyManager.resolveView(reactTag);
                } catch (Exception e) {
                    promise.reject("Error", e.getMessage());
                    return;
                }

                try {
                    view.clearCache(true);
                    boolean success = ProxySetting.setProxy(view.getContext(), view, host, port);
                    promise.resolve(success);
                }
                catch (Exception e){
                    promise.resolve(false);
                }
            }
        });
    }

    @ReactMethod
    public void clearWebViewHistory(final int reactTag,final Promise promise) {
        ReactApplicationContext reactContext = this.getReactApplicationContext();
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                WebView view = null;

                try {
                    view = (WebView) nativeViewHierarchyManager.resolveView(reactTag);
                } catch (Exception e) {
                    promise.reject("Error", e.getMessage());
                    return;
                }

                view.clearHistory();
                promise.resolve(true);
            }
        });
    }

    @ReactMethod
    public void getSessionID(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status =   rdnaObj.getSessionID();
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getAllServices(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status = rdnaObj.getAllServices();
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getServiceByTargetCoordinate(String HNIP, int port, Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status = rdnaObj.getServiceByTargetCoordinate(HNIP,port);
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getServiceByServiceName(String serviceName,Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status =   rdnaObj.getServiceByServiceName(serviceName);
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void serviceAccessStop(String service,Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            int error  =   rdnaObj.serviceAccessStop(service);
            errorMap.putInt("error", error);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }


    @ReactMethod
    public void serviceAccessStart(String service,Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            int error  =   rdnaObj.serviceAccessStart(service);
            errorMap.putInt("error", error);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void serviceAccessStartAll(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            int error  =   rdnaObj.serviceAccessStartAll();
            errorMap.putInt("error", error);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void serviceAccessStopAll(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            int error  =   rdnaObj.serviceAccessStopAll();
            errorMap.putInt("error", error);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }


    @ReactMethod
    public void getErrorInfo(int errorCode,Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        RDNA.RDNAErrorID rdnaErrorID =   RDNA.getErrorInfo(errorCode);
        errorMap.putInt("error", rdnaErrorID.intValue);
        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void getDefaultCipherSpec(Callback callback)
    {
        RDNA.RDNAStatus<String> status=rdnaObj.getDefaultCipherSpec();
        WritableArray writableArray = Arguments.createArray();
        WritableMap statusMap = Arguments.createMap();

        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response",status.result);
            }

        } else {
            statusMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(statusMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void encryptHttpRequest(int scope, String cipherSpecs, String salt, String request, Callback callback)
    {
        RDNA.RDNAStatus<String> status=rdnaObj.encryptHttpRequest(scope, cipherSpecs, salt!=null?salt.getBytes():null, request);
        WritableMap statusMap = Arguments.createMap();
        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response", status.result);
            }
        } else {
            statusMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray result = Arguments.createArray();
        result.pushMap(statusMap);
        callback.invoke(result);
    }

    @ReactMethod
    public void decryptHttpResponse(int scope, String cipherSpecs, String salt, String response, Callback callback)
    {
        RDNA.RDNAStatus<String> status=rdnaObj.decryptHttpResponse(scope, cipherSpecs, salt!=null?salt.getBytes():null, response);
        WritableMap statusMap = Arguments.createMap();
        if(rdnaObj != null) {
            int error = status.errorCode;
            statusMap.putInt("error", error);
            if(status.errorCode == 0 && status.result!=null) {
                statusMap.putString("response", status.result);
            }
        } else {
            statusMap.putInt("error", 1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        WritableArray result = Arguments.createArray();
        result.pushMap(statusMap);
        callback.invoke(result);
    }

    @ReactMethod
    public void getAgentID(Callback callback){
        WritableArray writableArray = Arguments.createArray();
        WritableMap errorMap = Arguments.createMap();
        if(rdnaObj!=null){
            RDNA.RDNAStatus<String> status =   rdnaObj.getAgentID();
            errorMap.putInt("error", status.errorCode);
            if(status.errorCode == 0)
                errorMap.putString("response",status.result);
        }
        else{
            errorMap.putInt("error",1);
            showErrorMessage(PAUSE_RESUME_ERROR_MESSAGE);
        }

        writableArray.pushMap(errorMap);
        callback.invoke(writableArray);
    }

    @ReactMethod
    public void demo(){
    }
}
