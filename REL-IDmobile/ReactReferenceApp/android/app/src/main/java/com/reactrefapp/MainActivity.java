package com.reactrefapp;

import android.app.Activity;
import android.os.Bundle;
import android.os.PersistableBundle;

import com.facebook.react.ReactActivity;


public class MainActivity extends ReactActivity {

    public static Activity currentActivity;

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
        currentActivity = this;
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
