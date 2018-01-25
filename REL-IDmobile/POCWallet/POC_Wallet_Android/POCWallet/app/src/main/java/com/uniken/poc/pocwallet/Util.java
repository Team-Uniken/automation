package com.uniken.poc.pocwallet;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;

import java.net.InetAddress;

/**
 * Created by nitin on 14/12/17.
 */

public class Util {

    /**
     * method to open new activity
     * @param cntxt
     * @param activity
     */
    public static void openActivity(Activity cntxt, Class<?> activity, boolean backStack){
        cntxt.startActivity(new Intent(cntxt, activity));
        if( !backStack ) cntxt.finish();
    }

    public static boolean checkInternetConnection(Context cntxt){
        ConnectivityManager cm = (ConnectivityManager) cntxt.getSystemService(Context.CONNECTIVITY_SERVICE);
        return cm.getActiveNetworkInfo() != null;
    }

}
