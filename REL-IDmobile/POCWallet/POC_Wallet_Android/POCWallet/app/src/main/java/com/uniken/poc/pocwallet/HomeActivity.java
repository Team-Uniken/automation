package com.uniken.poc.pocwallet;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class HomeActivity extends BaseActivity {

    private EditText txtAmount;

    private static HomeActivity instance = null;
    public HomeActivity()
    {
        instance = this;
    }

    public static HomeActivity getInstance()
    {
        return instance;
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        User user = User.getInstance();
        TextView txtWelcome = (TextView) findViewById(R.id.txtWelcome);
        txtWelcome.setText("Welcome " + user.getLogin_id());
        TextView txtBalance = (TextView) findViewById(R.id.txtBalance);
        txtBalance.setText("Your Wallet Balance is : " + user.getWallet_balance());

    }

    public void addAmount(View v)
    {
        txtAmount = (EditText) findViewById(R.id.txtAmount);

        if( txtAmount.getText().toString().isEmpty() ) showToast("Please enter amount");
        else {
            if( Util.checkInternetConnection(this) ) {
                String strAmount = txtAmount.getText().toString();
                User user = User.getInstance();
                user.setUpdate_amount(Double.parseDouble(strAmount));
                Controller ctrl = new Controller(user, "update");
                ctrl.start();
            }else showToast(getString(R.string.no_internet));
        }
    }

}
