package com.reactrefapp;

import android.os.Build;
import android.util.Log;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.facebook.react.views.webview.WebViewConfig;

import java.util.Map;

import javax.annotation.Nullable;

public class WebViewBridgeManager extends ReactWebViewManager {
    private static final String REACT_CLASS = "RCTWebViewBridge";

    public static final int COMMAND_INJECT_BRIDGE_SCRIPT = 100;
    public static final int COMMAND_SEND_TO_BRIDGE = 101;
    public static final int COMMAND_SET_PROXY = 102;

    private boolean initializedBridge;

    public WebViewBridgeManager() {
        super();
        initializedBridge = false;
    }

    public WebViewBridgeManager(WebViewConfig webViewConfig) {
        super(webViewConfig);
        initializedBridge = false;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandsMap = super.getCommandsMap();

        commandsMap.put("injectBridgeScript", COMMAND_INJECT_BRIDGE_SCRIPT);
        commandsMap.put("sendToBridge", COMMAND_SEND_TO_BRIDGE);
        commandsMap.put("setProxy", COMMAND_SET_PROXY);

        return commandsMap;
    }

    @Override
    public void receiveCommand(WebView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        switch (commandId) {
            case COMMAND_INJECT_BRIDGE_SCRIPT:
                injectBridgeScript(root);
                break;
            case COMMAND_SEND_TO_BRIDGE:
                sendToBridge(root, args.getString(0));
                break;
            case COMMAND_SET_PROXY:
                Log.d(REACT_CLASS, "----- command setProxy");
                break;
            default:
                //do nothing!!!!
        }
    }

    @ReactProp(name = "proxy")
    public void setProxy(WebView view, @Nullable ReadableMap source){
        Log.d(REACT_CLASS, "----------- In SetProxy 1234 " + source.getString("host") + ":" + source.getInt("port"));
        view.clearCache(true);
        ProxySetting.setProxy(view.getContext(), view, source.getString("host"), source.getInt("port"));
    }

    private void sendToBridge(WebView root, String message) {
        //root.loadUrl("javascript:(function() {\n" + script + ";\n})();");
        if(Build.VERSION.SDK_INT >= 19) {
            String script = "WebViewBridge.onMessage('" + message + "');";
            root.evaluateJavascript(script, null);
        }
    }

    private void injectBridgeScript(WebView root) {
        //this code needs to be called once per context
        if (Build.VERSION.SDK_INT >= 19) {
            if (!initializedBridge) {
                root.addJavascriptInterface(new JavascriptBridge((ReactContext) root.getContext()), "WebViewBridgeAndroid");
                initializedBridge = true;
                root.reload();
            }

            //this code needs to be executed everytime a url changes.
            root.evaluateJavascript(""
                    + "(function() {"
                    + "if (window.WebViewBridge) return;"
                    + "var customEvent = document.createEvent('Event');"
                    + "var WebViewBridge = {"
                    + "send: function(message) { WebViewBridgeAndroid.send(message); },"
                    + "onMessage: function() {}"
                    + "};"
                    + "window.WebViewBridge = WebViewBridge;"
                    + "customEvent.initEvent('WebViewBridge', true, true);"
                    + "document.dispatchEvent(customEvent);"
                    + "}());", null);
        }
    }
}