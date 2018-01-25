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

    private EditText txtLogin, txtPass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        init();
    }

    private void init() {
        txtLogin = (EditText) findViewById(R.id.txtLoginId_Login);
        txtPass = (EditText) findViewById(R.id.txtMPINLogin);
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
        if( txtLogin.getText().toString().isEmpty()  ) showToast("Please enter loginID");
        else if( txtPass.getText().toString().isEmpty() ) showToast("Please enter MPIN");
        else{
            if( Util.checkInternetConnection(this) ) {
                User user = User.getInstance();
                user.setLogin_id(txtLogin.getText().toString());
                user.setPassword(txtPass.getText().toString());
                Controller ctrl = new Controller(user, "login");
                ctrl.start();
            }else showToast(getString(R.string.no_internet));
        }
    }

}
