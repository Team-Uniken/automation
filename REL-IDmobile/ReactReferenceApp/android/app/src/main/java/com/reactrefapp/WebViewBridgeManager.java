package com.reactrefapp;

import android.os.Build;
import android.util.Log;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
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
    public static final int COMMAND_GO_BACK = 103;
    public static final int COMMAND_GO_FORWARD = 104;
    public static final int COMMAND_RELOAD = 105;
    public static final int COMMAND_CLEAR = 106;

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
        commandsMap.put("goBack", COMMAND_GO_BACK);
        commandsMap.put("reload", COMMAND_RELOAD);
        commandsMap.put("goForward", COMMAND_GO_FORWARD);
        commandsMap.put("clear", COMMAND_CLEAR);
        return commandsMap;
    }

    @Override
    public void receiveCommand(WebView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        switch (commandId) {
            case COMMAND_INJECT_BRIDGE_SCRIPT:
                injectBridgeScript(root);
                break;
            case COMMAND_CLEAR:
                clear(root);
                break;
            case COMMAND_SEND_TO_BRIDGE:
                sendToBridge(root, args.getString(0));
                break;
            case COMMAND_SET_PROXY:
                Log.d(REACT_CLASS, "----- command setProxy");
                break;
            case COMMAND_GO_BACK:
                Log.d(REACT_CLASS, "----- command goBack");
                if(root.canGoBack()){
                    root.goBack();
                }
                break;
            case COMMAND_GO_FORWARD:
                Log.d(REACT_CLASS, "----- command goForward");
                if(root.canGoForward()){
                    root.goForward();
                }
                break;
            case COMMAND_RELOAD:
                Log.d(REACT_CLASS, "----- command reload");
                root.reload();
                break;
            default:
                //do nothing!!!!
        }
    }

    private void clear(WebView view){
        view.loadUrl("javascript:document.body.innerHTML = '';");
    }

    @ReactProp(name = "messagingEnabled")
    public void setMessagingEnabled(WebView view,boolean enabled) {
        super.setMessagingEnabled(view,enabled);
    }

    @ReactProp(name = "proxy")
    public void setProxy(WebView view, ReadableMap source){
        int proxyPort = 0;
//        try{
//            proxyPort = Integer.parseInt(port);
//        }
//        catch (Exception e){
//            proxyPort = 0;
//        }
        Log.d(REACT_CLASS, "----------- In SetProxy 1234 "  + ":" + proxyPort);
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

    @ReactProp(name="webViewClient")
    public void setWebViewClient(final WebView webView,ReadableMap params){
        webView.getSettings().setJavaScriptEnabled(false);
        addEventEmitters((ThemedReactContext) webView.getContext(),webView);
//        webView.setWebViewClient(new WebViewClient()
//        {
//            @Override
//            public void onPageStarted(WebView view, String url, Bitmap favicon) {
//                super.onPageStarted(view, url, favicon);
//                WritableMap event = Arguments.createMap();
//                event.putString("name","onPageStarted");
//                event.putString("url", url);
//                ReactContext reactContext = (ReactContext) view.getContext();
//                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(view.getId(), "topChange", event);
//            }
//
//            @Override
//            public void onReceivedError(WebView view,final int errorCode,final String description,final String failingUrl) {
//                super.onReceivedError(view, errorCode, description, failingUrl);
//                WritableMap event = Arguments.createMap();
//                event.putString("name","onReceivedError");
//                event.putInt("code", errorCode);
//                event.putString("description",description);
//                event.putString("failingUrl",failingUrl);
//                ReactContext reactContext = (ReactContext) view.getContext();
//                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(view.getId(), "topChange", event);
//            }
//
//            @Override
//            public void onPageFinished(WebView view, String url) {
//                super.onPageFinished(view, url);
//                WritableMap event = Arguments.createMap();
//                event.putString("name","onPageFinished");
//                event.putString("url", url);
//                ReactContext reactContext = (ReactContext) view.getContext();
//                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(view.getId(), "topChange", event);
//            }
//
//            @Override
//            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error)
//            {
//                //showSslErrorAlertDialog(handler,error);
//                Log.e("onReceivedSslError", "Valid Not before date " + error.getCertificate().getValidNotBeforeDate());
//                Log.e("onReceivedSslError", error.toString());
//            }
//
//            @Override
//            public WebResourceResponse shouldInterceptRequest(WebView view, String url)
//            {
//                if (url.endsWith("favicon.ico")) {
//                    return loadFaviconFromAssetFolder();
//                }
//                return super.shouldInterceptRequest(view, url);
//            }
//
//            @SuppressLint("NewApi")
//            @Override
//            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request)
//            {
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//                    if (request.getUrl().toString().endsWith("favicon.ico")) {
//                        return loadFaviconFromAssetFolder();
//                    }
//                }
//
//                return super.shouldInterceptRequest(view, request);
//            }
//
//            public WebResourceResponse loadFaviconFromAssetFolder()
//            {
//                try {
//                    return new WebResourceResponse("image/x-icon", "UTF-8", webView.getContext().getAssets().open("blank_favicon.ico"));
//                }
//                catch (IOException e) {
//                    e.printStackTrace();
//                }
//
//                return null;
//            }
//        });
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
