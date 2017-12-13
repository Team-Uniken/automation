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
        Intent myIntent = new Intent(MainActivity.this,
                RegisterActivity.class);
        startActivity(myIntent);

    }

    public void loginClicked(View v)
    {
        Log.d("POCWallet", "Login Clicked");
        Intent myIntent = new Intent(MainActivity.this,
                LoginActivity.class);
        startActivity(myIntent);
    }

}
