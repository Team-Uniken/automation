package com.uniken.poc.pocwallet;

import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

/**
 * Created by UNIKEN on 12/13/2017.
 */

public class BaseActivity extends AppCompatActivity {
    public void showError(Wallet w)
    {
        Toast.makeText(this, w.getError(), Toast.LENGTH_SHORT).show();
    }

}
