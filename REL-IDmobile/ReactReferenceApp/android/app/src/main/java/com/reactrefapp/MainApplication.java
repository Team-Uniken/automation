package com.reactrefapp;

import android.app.Application;
import android.util.Log;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import java.util.Arrays;
import java.util.List;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import io.neson.react.notification.NotificationPackage;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
    }


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RDNAReactPackage(),
              new ExtraDimensionsPackage(MainActivity.currentActivity),
              new ReactNativePushNotificationPackage(),
              new NotificationPackage(MainActivity.currentActivity),
              new FBSDKPackage(getCallbackManager()),
              new RCTCameraPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
}
