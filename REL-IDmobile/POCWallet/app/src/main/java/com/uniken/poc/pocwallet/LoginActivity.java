package com.uniken.poc.pocwallet;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends BaseActivity{


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

    }

    private static LoginActivity instance;
    public LoginActivity()
    {
        instance = this;
    }
    public static LoginActivity getInstance()
    {
        return instance;
    }

    public void loginClicked(View v)
    {
        User user = User.getInstance();
        EditText txtLogin = (EditText)findViewById(R.id.txtLoginId_Login);
        user.setLogin_id(txtLogin.getText().toString());
        EditText txtPass = (EditText)findViewById(R.id.txtMPINLogin);
        user.setPassword(txtPass.getText().toString());
        Controller ctrl = new Controller(user,"login");
        ctrl.start();
    }
}
