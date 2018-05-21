package com.uniken.rdnaplugin;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * Created by uniken on 22/4/16.
 */
public class RDNARequestUtility extends CordovaPlugin {
    private String TAG = "RDNARequestUtility";
    private String proxyHNIP = null;
    private int proxyPort = -1;
    private CallbackContext callback;
    private CordovaInterface cordovaContext;

    public RDNARequestUtility(CordovaInterface cordovaContext, CallbackContext callback) {
        this.cordovaContext = cordovaContext;
        this.callback = callback;
    }


    public void setHttpProxyHost(String proxyHNIP, int proxyPort){
        this.proxyHNIP = proxyHNIP;
        this.proxyPort = proxyPort;
    }


    public void doHTTPGetRequest(String url){

        if(isNetworkAvailable(cordovaContext.getContext())){
            new NetworkTask(proxyHNIP, proxyPort, callback).execute(url);
        } else {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("error", "1");
                jsonObject.put("response","");
            }catch (JSONException e) {
                e.printStackTrace();
            }
            PluginResult pluginResult = new PluginResult( PluginResult.Status.OK, jsonObject.toString() );
            pluginResult.setKeepCallback(true);
            callback.sendPluginResult(pluginResult);
        }
    }


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

