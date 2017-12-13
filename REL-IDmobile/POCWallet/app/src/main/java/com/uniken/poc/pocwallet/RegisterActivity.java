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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);


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

        EditText txtLogin = (EditText) findViewById(R.id.txtLoginId);
        EditText txtPass = (EditText) findViewById(R.id.regMPIN);
        EditText txtCard_no= (EditText) findViewById(R.id.card_no);
        EditText txtCard_pin= (EditText) findViewById(R.id.card_pin);

        User user = User.getInstance();
        user.setLogin_id(txtLogin.getText().toString());
        user.setPassword(txtPass.getText().toString());
        user.setCard_no(txtCard_no.getText().toString());
        user.setCard_pin(txtCard_pin.getText().toString());
        Controller ctrl = new Controller(user,"register");
        ctrl.start();

    }

}
