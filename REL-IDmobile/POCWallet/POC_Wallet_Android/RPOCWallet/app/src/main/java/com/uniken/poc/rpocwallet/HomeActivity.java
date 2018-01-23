package com.uniken.poc.rpocwallet;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.uniken.poc.rpocwallet.ModelsAndHolders.ErrorInfo;
import com.uniken.poc.rpocwallet.Utils.Helper;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClient;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClientCallback;
import com.uniken.rdna.RDNA;

public class HomeActivity extends BaseActivity implements RDNAClientCallback
{

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
        RDNAClient.getInstance().registerCallback(this);
    }

    @Override
    public void onBackPressed() {
        //super.onBackPressed();
        Helper.showAlert(this, "Confirmation", "Are you sure you want logoff ?", "Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                RDNAClient.getInstance().logOff(Helper.getLoggedInUser());
                Helper.setLoggedInUser("");
            }
        },"No",false);
    }

    /**
     * OnClick for add amount button.
     */
    public void addAmount(View v)
    {
        txtAmount = (EditText) findViewById(R.id.txtAmount);

        if( txtAmount.getText().toString().isEmpty() ) showToast("Please enter amount");
        else {
            if(
                Util.checkInternetConnection(this) ) {
                String strAmount = txtAmount.getText().toString();
                User user = User.getInstance();
                user.setUpdate_amount(Double.parseDouble(strAmount));
                Controller ctrl = new Controller(user, "update");
                ctrl.start();
            }else showToast(getString(R.string.no_internet));
        }
    }

    @Override
    public void onCallToRDNA(RDNA.RDNAMethodID methodID) {
        progressBarVisibility(true);
    }

    @Override
    public void onRDNAResponse(Object status) {
        if(status instanceof RDNA.RDNAStatusLogOff){
            RDNA.RDNAStatusLogOff statusLogOff = (RDNA.RDNAStatusLogOff) status;
            if(statusLogOff.errCode == 0){
                /*Helper.showAlert(this, "Error", "Failed to logoff.\nError Code" + statusLogOff.errCode, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Util.openActivity(HomeActivity.this,MainActivity.class,false);
                    }
                },false);*/
                Util.openActivity(HomeActivity.this,LoginActivity.class,false);
            }else{
                Helper.showAlert(this, "Error", "Failed to logoff.\nError Code : " + statusLogOff.errCode, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Helper.setLoggedInUser("");
                        RDNAClient.getInstance().terminate();
                    }
                },false);
            }
        }else if(status instanceof ErrorInfo){
            ErrorInfo errorInfo = (ErrorInfo) status;
            if(errorInfo.getErrorCode()!=0){
                Helper.setLoggedInUser("");
                RDNAClient.getInstance().terminate();
            }
        }
        progressBarVisibility(false);
    }

    @Override
    public RDNA.RDNAIWACreds getIWACreds(String domain) {
        return null;
    }
}
