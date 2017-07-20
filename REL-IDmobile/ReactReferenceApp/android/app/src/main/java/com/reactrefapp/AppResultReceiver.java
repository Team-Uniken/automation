package com.reactrefapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Created by Sirack Hailu on 1/15/17.
 */

public class AppResultReceiver extends BroadcastReceiver {

    private static final String TAG = AppResultReceiver.class.getSimpleName();

    @Override
    public void onReceive(Context context, Intent intent) {

        if(intent != null) {
            Log.d(TAG, "\n\n");
            Log.d(TAG, "type --> " + intent.getStringExtra("type"));
            Log.d(TAG, "package --> " + intent.getStringExtra("analyzed_package_name"));
            Log.d(TAG, "certificate --> " + intent.getStringExtra("app_cert"));
            Log.d(TAG, "vt positive --> " + intent.getIntExtra("vt_positive", -1));
            Log.d(TAG, "vt total --> " + intent.getIntExtra("vt_total", -1));
        }
    }
}