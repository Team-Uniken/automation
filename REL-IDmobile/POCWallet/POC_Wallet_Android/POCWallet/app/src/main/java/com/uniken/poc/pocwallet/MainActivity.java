package com.uniken.poc.pocwallet;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

public class MainActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void registerClicked(View v)
    {
        Log.d("POCWallet", "Register Clicked");
        Util.openActivity(this, RegisterActivity.class, true);
        //finish();
    }

    public void loginClicked(View v)
    {
        Log.d("POCWallet", "Login Clicked");
        Util.openActivity(this, LoginActivity.class, true);
        //finish();
    }

}
