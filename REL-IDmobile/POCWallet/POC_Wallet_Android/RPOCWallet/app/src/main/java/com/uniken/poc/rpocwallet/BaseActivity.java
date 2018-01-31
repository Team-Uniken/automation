package com.uniken.poc.rpocwallet;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Toast;

import com.uniken.poc.rpocwallet.Utils.Helper;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClient;

/**
 * Created by UNIKEN on 12/13/2017.
 */

public class BaseActivity extends AppCompatActivity{

    boolean progress;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RDNAClient.getInstance().setCurrentActivity(this);

    }

    public void showError(Wallet w)
    {
        Toast.makeText(this, w.getError(), Toast.LENGTH_SHORT).show();
    }

    public void showToast( String message ){
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    public void progressBarVisibility(boolean showProgressBar){
        if (showProgressBar) {
            progress = true;
            (this.findViewById(R.id.progress_bar_container)).setVisibility(View.VISIBLE);
        }
        else {
            progress = false;
            (this.findViewById(R.id.progress_bar_container)).setVisibility(View.GONE);
        }
    }

    @Override
    protected void onResume() {
        RDNAClient.getInstance().setCurrentActivity(this);
        super.onResume();
    }

    @Override
    public void onBackPressed() {
        if(!progress)
        super.onBackPressed();
    }
}
