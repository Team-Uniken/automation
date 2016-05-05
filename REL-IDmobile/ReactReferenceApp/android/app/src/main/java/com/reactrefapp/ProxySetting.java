package com.reactrefapp;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Proxy;
import android.os.Build;
import android.util.ArrayMap;
import android.util.Log;
import android.webkit.WebView;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;


public class ProxySetting {

  private static final String TAG = "ProxySettings";
  private static Context applicationContext;

  public static boolean setProxy (Context ctx, WebView wv, String proxyHost, int proxyPort) {

    ProxySetting.applicationContext = ctx.getApplicationContext();

    boolean ret = false;
    if (Build.VERSION.SDK_INT <= 12) { // upto Android 3.1.x (HONEYCOMB_MR1)
//      HttpHost hhProxy = new HttpHost (proxyHost, proxyPort, "http");
//      ret = setProxy_SDK_until_12 (hhProxy);
    }

    else if (Build.VERSION.SDK_INT <= 15) { // upto Android 4.0.x (ICE_CREAM_SANDWICH_MR1)
      ret = setProxy_SDK_13_14_15 (proxyHost, proxyPort, wv);
    }

    else if (Build.VERSION.SDK_INT <= 18) { // upto Android 4.3.x (JELLY_BEAN_MR1)
      ret = setProxy_SDK_16_17_18 (proxyHost, proxyPort, wv, "");
    }
    else {
      ret = setProxy_SDK_19_21 (proxyHost, proxyPort, wv, "");
    }

    return ret;
  }

  @SuppressLint("NewApi")
  private static boolean setProxy_SDK_19_21 (String host, int port, WebView webview, String exclusionList) {

    boolean isRequestTunneled = true;

    Log.d(TAG, "Setting proxy with android >= 4.4.x and <= 5.x API.");

    try {

      setSystemProperties(host, port);

      Class applictionCls = Class.forName("android.app.Application");
      Field loadedApkField = applictionCls.getDeclaredField("mLoadedApk");
      loadedApkField.setAccessible(true);
      Object loadedApk = loadedApkField.get(applicationContext);
      Class loadedApkCls = Class.forName("android.app.LoadedApk");
      Field receiversField = loadedApkCls.getDeclaredField("mReceivers");
      receiversField.setAccessible(true);
      ArrayMap receivers = (ArrayMap) receiversField.get(loadedApk);
      for (Object receiverMap : receivers.values()) {
        for (Object rec : ((ArrayMap) receiverMap).keySet()) {
          Class clazz = rec.getClass();
          if (clazz.getName().contains("ProxyChangeListener")) {
            Method onReceiveMethod = clazz.getDeclaredMethod("onReceive", Context.class, Intent.class);
            Intent intent = new Intent(Proxy.PROXY_CHANGE_ACTION);
            onReceiveMethod.invoke(rec, applicationContext, intent);
          }
        }
      }

      Log.d(TAG, "Setting proxy with android >= 4.4.x and <= 5.x API successful!");
    }

    catch (ClassNotFoundException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (NoSuchFieldException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (IllegalAccessException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (IllegalArgumentException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (NoSuchMethodException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (InvocationTargetException e) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + e);
      isRequestTunneled = false;
    }
    catch (Exception ex) {
      Log.e(TAG,"Setting proxy with android >= 4.4.x and <= 5.x API failed with error: " + ex);
      isRequestTunneled = false;
    }

    return isRequestTunneled;
  }

  @SuppressWarnings({ "unchecked", "rawtypes" })
  private static boolean setProxy_SDK_16_17_18 (String host, int port, WebView webview, String exclusionList) {

    Log.d(TAG, "Setting proxy with >= 4.0.x and <= 4.3.x API.");

    try {
      Class wvcClass = Class.forName("android.webkit.WebViewClassic");
      Class wvParams[] = new Class[1];
      wvParams[0] = Class.forName("android.webkit.WebView");
      Method fromWebView = wvcClass.getDeclaredMethod("fromWebView", wvParams);
      Object webViewClassic = fromWebView.invoke(null, webview);

      Class wv = Class.forName("android.webkit.WebViewClassic");
      Field mWebViewCoreField = wv.getDeclaredField("mWebViewCore");
      Object mWebViewCoreFieldIntance = getFieldValueSafely(mWebViewCoreField, webViewClassic);

      Class wvc = Class.forName("android.webkit.WebViewCore");
      Field mBrowserFrameField = wvc.getDeclaredField("mBrowserFrame");
      Object mBrowserFrame = getFieldValueSafely(mBrowserFrameField, mWebViewCoreFieldIntance);

      Class bf = Class.forName("android.webkit.BrowserFrame");
      Field sJavaBridgeField = bf.getDeclaredField("sJavaBridge");
      Object sJavaBridge = getFieldValueSafely(sJavaBridgeField, mBrowserFrame);

      Class ppclass = Class.forName("android.net.ProxyProperties");
      Class pparams[] = new Class[3];
      pparams[0] = String.class;
      pparams[1] = int.class;
      pparams[2] = String.class;
      Constructor ppcont = ppclass.getConstructor(pparams);

      Class jwcjb = Class.forName("android.webkit.JWebCoreJavaBridge");
      Class params[] = new Class[1];
      params[0] = Class.forName("android.net.ProxyProperties");
      Method updateProxyInstance = jwcjb.getDeclaredMethod("updateProxy", params);

      updateProxyInstance.invoke(sJavaBridge, ppcont.newInstance(host, port, exclusionList));
    }
    catch (Exception ex) {
      Log.e(TAG,"Setting proxy with >= 4.0.x and <= 4.3.x API failed with error: " + ex);
      return false;
    }

    Log.d(TAG, "Setting proxy with >= 4.0.x and <= 4.3.x API successful!");
    return true;
  }

  @SuppressWarnings("rawtypes")
  private static boolean setProxy_SDK_13_14_15 (String proxyHost, int proxyPort, WebView wv) {

    try {

      Class jwcjbCls = Class.forName("android.webkit.JWebCoreJavaBridge");
      Class params[] = new Class[1];
      params[0] = Class.forName("android.net.ProxyProperties");
      @SuppressWarnings("unchecked")
      Method updateProxyInstance = jwcjbCls.getDeclaredMethod("updateProxy", params);

      Class wvCls = Class.forName("android.webkit.WebView");
      Field mWebViewCoreField = wvCls.getDeclaredField("mWebViewCore");
      Object mWebViewCoreFieldIntance = getFieldValueSafely(mWebViewCoreField, wv);

      Class wvc = Class.forName("android.webkit.WebViewCore");
      Field mBrowserFrameField = wvc.getDeclaredField("mBrowserFrame");
      Object mBrowserFrame = getFieldValueSafely(mBrowserFrameField, mWebViewCoreFieldIntance);

      Class bf = Class.forName("android.webkit.BrowserFrame");
      Field sJavaBridgeField = bf.getDeclaredField("sJavaBridge");
      Object sJavaBridge = getFieldValueSafely(sJavaBridgeField, mBrowserFrame);

      Class ppclass = Class.forName("android.net.ProxyProperties");
      Class pparams[] = new Class[3];
      pparams[0] = String.class;
      pparams[1] = int.class;
      pparams[2] = String.class;
      @SuppressWarnings("unchecked")
      Constructor ppcont = ppclass.getConstructor(pparams);

      updateProxyInstance.invoke(sJavaBridge, ppcont.newInstance(proxyHost, proxyPort, null));

      return true;
    }
    catch (Exception ex) {

      Log.e (TAG, "error in setProxy_SDK_13_14_15()", ex);
      return false;
    }
  }
//
//  @SuppressWarnings("rawtypes")
//  private static boolean setProxy_SDK_until_12 (HttpHost hhProxy) {
//
//    // Getting network
//    Class networkClass = null;
//    Object network = null;
//
//    try {
//      networkClass = Class.forName("android.webkit.Network");
//      Field networkField = networkClass.getDeclaredField("sNetwork");
//      network = getFieldValueSafely(networkField, null);
//    }
//    catch (Exception ex) {
//
//      Log.e(TAG, "error getting network", ex);
//      return false;
//    }
//
//    if (network == null) {
//      Log.e(TAG, "error getting network : null");
//      return false;
//    }
//
//    Object requestQueue = null;
//
//    try {
//      Field requestQueueField = networkClass.getDeclaredField("mRequestQueue");
//      requestQueue = getFieldValueSafely(requestQueueField, network);
//    }
//    catch(Exception ex) {
//
//      Log.e(TAG, "error getting field value", ex);
//      return false;
//    }
//
//    if (requestQueue == null) {
//      Log.e(TAG, "Request queue is null");
//      return false;
//    }
//
//    Field proxyHostField = null;
//
//    try {
//      Class requestQueueClass = Class.forName("android.net.http.RequestQueue");
//      proxyHostField = requestQueueClass.getDeclaredField("mProxyHost");
//    }
//    catch(Exception ex) {
//
//      Log.e(TAG, "error getting proxy host field", ex);
//      return false;
//    }
//
//    do {
//      boolean temp = proxyHostField.isAccessible();
//      try {
//        proxyHostField.setAccessible(true);
//        proxyHostField.set(requestQueue, hhProxy);
//      } catch (Exception ex) {
//        Log.e(TAG, "error setting proxy host", ex);
//      } finally {
//        proxyHostField.setAccessible(temp);
//      }
//    } while (false);
//    return true;
//  }

  private static Object getFieldValueSafely(Field field, Object classInstance) throws IllegalArgumentException, IllegalAccessException {
    boolean oldAccessibleValue = field.isAccessible();
    field.setAccessible(true);
    Object result = field.get(classInstance);
    field.setAccessible(oldAccessibleValue);
    return result;
  }

  private static void setSystemProperties(String proxyHost, int proxyPort) {

    System.setProperty("http.proxyHost", proxyHost);
    System.setProperty("http.proxyPort", proxyPort + "");

    System.setProperty("https.proxyHost", proxyHost);
    System.setProperty("https.proxyPort", proxyPort + "");
  }
}