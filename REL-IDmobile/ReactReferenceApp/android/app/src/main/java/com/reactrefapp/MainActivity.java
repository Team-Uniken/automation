package com.reactrefapp;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.provider.Settings;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    public static Activity currentActivity;

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
       // _askForOverlayPermission();
        super.onCreate(savedInstanceState, persistentState);
        currentActivity = this;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    private static final int OVERLAY_PERMISSION_REQUEST_CODE = 2;

    @TargetApi(Build.VERSION_CODES.M)
    private void _askForOverlayPermission() {
        if (!BuildConfig.DEBUG || android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }

        if (!Settings.canDrawOverlays(this)) {
            Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
            startActivityForResult(settingsIntent, OVERLAY_PERMISSION_REQUEST_CODE);
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactRefApp";
    }

}
