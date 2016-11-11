package com.reactrefapp;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


/**
 * Created by uniken on 22/4/16.
 */
public class RDNARequestUtility extends ReactContextBaseJavaModule {
    private String TAG = "RDNARequestUtility";
    private String proxyHNIP = null;
    private int proxyPort = -1;

    private ReactApplicationContext reactContext;

    public RDNARequestUtility(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RDNARequestUtility";
    }

    @ReactMethod
    public void setHttpProxyHost(String proxyHNIP, int proxyPort, Callback callback){
        this.proxyHNIP = proxyHNIP;
        this.proxyPort = proxyPort;
        WritableMap errorMap = Arguments.createMap();
        callback.invoke(errorMap);
    }

    @ReactMethod
    public void doHTTPGetRequest(String url, Callback callback){

        if(isNetworkAvailable(reactContext)){
            new NetworkTask(proxyHNIP, proxyPort, callback).execute(url);
        } else {
            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", 1);
            errorMap.putString("response", "Please check your network connection");

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }
    }

    @ReactMethod
    public void doHTTPPostRequest(String url, ReadableMap map, Callback callback){
        Logger.d(TAG , "----- url "+url);
        if(isNetworkAvailable(reactContext)){
            new NetworkHttpPostTask(proxyHNIP, proxyPort,map, callback).execute(url);
        } else {
            WritableMap errorMap = Arguments.createMap();
            errorMap.putInt("error", 1);
            errorMap.putString("response", "Please check your network connection");

            WritableArray writableArray = Arguments.createArray();
            writableArray.pushMap(errorMap);

            callback.invoke(writableArray);
        }

    }

//    @ReactMethod
//    public void doHTTPPostRequest(String url, String jsonString, Callback callback){
//        Logger.d(TAG , "----- url "+url);
//        if(isNetworkAvailable(reactContext)){
//            new NetworkHttpPostTask(proxyHNIP, proxyPort,jsonString, callback).execute(url);
//        } else {
//            WritableMap errorMap = Arguments.createMap();
//            errorMap.putInt("error", 1);
//            errorMap.putString("response", "Please check your network connection");
//
//            WritableArray writableArray = Arguments.createArray();
//            writableArray.pushMap(errorMap);
//
//            callback.invoke(writableArray);
//        }
//
//    }

    private boolean isNetworkAvailable(Context context) {
        boolean haveConnectedWifi = false;
        boolean haveConnectedMobile = false;
        ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo[] netInfo = cm.getAllNetworkInfo();
        for (NetworkInfo ni : netInfo) {
            if (ni.getTypeName().equalsIgnoreCase("WIFI"))
                if (ni.isConnected())
                    haveConnectedWifi = true;
            if (ni.getTypeName().equalsIgnoreCase("MOBILE"))
                if (ni.isConnected())
                    haveConnectedMobile = true;
        }
        return haveConnectedWifi || haveConnectedMobile;
    }
}
