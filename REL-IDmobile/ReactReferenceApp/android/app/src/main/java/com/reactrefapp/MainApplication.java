package com.reactrefapp;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;

import com.airbnb.android.react.maps.MapsPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import java.util.Arrays;
import java.util.List;

import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.facebook.stetho.Stetho;
import okhttp3.OkHttpClient;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import java.util.concurrent.TimeUnit;


public class MainApplication extends Application implements ReactApplication {


    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    public void onCreate() {
        super.onCreate();


        //  if(BuildConfig.DEBUG) {
        Stetho.initializeWithDefaults(this);
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer())
                .addNetworkInterceptor(new StethoInterceptor())
                .build();
        OkHttpClientProvider.replaceOkHttpClient(client);
        // }
        //FacebookSdk.sdkInitialize(getApplicationContext());
        //  Code for facebook key hash
//        try {
//            PackageInfo info = getPackageManager().getPackageInfo(BuildConfig.APPLICATION_ID,
//                    PackageManager.GET_SIGNATURES);
//            for (Signature signature : info.signatures) {
//                MessageDigest md = MessageDigest.getInstance("SHA");
//                md.update(signature.toByteArray());
//                Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
//            }
//        } catch (PackageManager.NameNotFoundException e) {
//
//        } catch (NoSuchAlgorithmException e) {
//
//        }
    }


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new MapsPackage(),
                    new ReactNativeConfigPackage(),
                    new RDNAReactPackage(),
                    new ReactNativePushNotificationPackage(),
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
