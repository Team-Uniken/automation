package com.uniken.poc.pocwallet;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class RegisterActivity extends BaseActivity {

    private EditText txtLogin, txtPass, confirmPass, txtCard_no, txtCard_pin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        init();
    }

    private void init(){
        txtLogin = (EditText) findViewById(R.id.txtLoginId);
        txtPass = (EditText) findViewById(R.id.regMPIN);
        confirmPass = (EditText) findViewById(R.id.confMPIN);
        txtCard_no= (EditText) findViewById(R.id.card_no);
        txtCard_pin= (EditText) findViewById(R.id.card_pin);
    }

    private static RegisterActivity instance = null;

    public RegisterActivity()
    {
        instance = this;
    }

    public static RegisterActivity getInstance()
    {
        return instance;
    }

    public void registerClicked(View v)
    {
        if( txtLogin.getText().toString().isEmpty() ) showToast("Please enter loginID");
        else if( txtCard_no.getText().toString().isEmpty() ) showToast("Please enter card number");
        else if( txtCard_pin.getText().toString().isEmpty() ) showToast("Please enter card pin");
        else if( txtPass.getText().toString().isEmpty() ) showToast("Please enter MPIN");
        else if( confirmPass.getText().toString().isEmpty() ) showToast("Please enter conferm MPIN");
        else if( !confirmPass.getText().toString().equals( txtPass.getText().toString() )  ) showToast("MPIN and Confirm MPIN should be same");
        else {
            if( Util.checkInternetConnection(this) ) {
                User user = User.getInstance();
                user.setLogin_id(txtLogin.getText().toString());
                user.setPassword(txtPass.getText().toString());
                user.setCard_no(txtCard_no.getText().toString());
                user.setCard_pin(txtCard_pin.getText().toString());
                Controller ctrl = new Controller(user, "register");
                ctrl.start();
            }else showToast(getString(R.string.no_internet));
        }

    }

}
