package com.uniken.poc.pocwallet;

import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.Toast;

/**
 * Created by UNIKEN on 12/13/2017.
 */

public class BaseActivity extends AppCompatActivity {
    public void showError(Wallet w)
    {
        Toast.makeText(this, w.getError(), Toast.LENGTH_SHORT).show();
    }

    public void showToast( String message ){
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    public void progressBarVisibility(boolean showProgressBar){
        if (showProgressBar)
            (this.findViewById(R.id.progress_bar_container)).setVisibility(View.VISIBLE);
        else
            (this.findViewById(R.id.progress_bar_container)).setVisibility(View.GONE);
    }

}
