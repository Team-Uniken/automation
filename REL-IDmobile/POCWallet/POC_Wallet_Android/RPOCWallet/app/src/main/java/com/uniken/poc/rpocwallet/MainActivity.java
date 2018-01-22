package com.uniken.poc.rpocwallet;

import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.uniken.poc.rpocwallet.ModelsAndHolders.ErrorInfo;
import com.uniken.poc.rpocwallet.Utils.Helper;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClient;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClientCallback;
import com.uniken.rdna.RDNA;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class MainActivity extends BaseActivity implements RDNAClientCallback{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        RDNAClient.getInstance().registerCallback(this);
        RDNAClient.getInstance().init(getApplication());
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

    @Override
    public void onCallToRDNA(RDNA.RDNAMethodID methodID) {
        progressBarVisibility(true);
    }

    @Override
    public void onRDNAResponse(Object status) {
        progressBarVisibility(false);
        if(status instanceof ErrorInfo){
            ErrorInfo errorInfo = (ErrorInfo)status;
            if(errorInfo.getMethodID()== RDNA.RDNAMethodID.RDNA_METH_INITIALIZE.name()){
                Helper.showAlert(this,"Error","Failed to initialize \nError Code: " + errorInfo.getErrorCode()+ "\n Error Name : "+errorInfo.getErrorID().name());
            }
        }else if(status instanceof RDNA.RDNAStatusInit){
            RDNA.RDNAStatusInit statusInit = (RDNA.RDNAStatusInit) status;
            if(statusInit.errCode!=0){
                Helper.showAlert(this,"Error","Failed to initialize \nError Code: " + statusInit.errCode);
            }
        }
    }

    @Override
    public RDNA.RDNAIWACreds getIWACreds(String domain) {
        return null;
    }
}
