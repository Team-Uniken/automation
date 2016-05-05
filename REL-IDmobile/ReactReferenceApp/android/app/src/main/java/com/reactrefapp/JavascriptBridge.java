package com.reactrefapp;

import android.webkit.JavascriptInterface;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by uniken on 28/4/16.
 */
public class JavascriptBridge {
    private ReactContext context;

    public JavascriptBridge(ReactContext context) {
        this.context = context;
    }

    @JavascriptInterface
    public void send(String message) {
        WritableMap params = Arguments.createMap();
        params.putString("message", message);
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("webViewBridgeMessage", params);
    }
}
