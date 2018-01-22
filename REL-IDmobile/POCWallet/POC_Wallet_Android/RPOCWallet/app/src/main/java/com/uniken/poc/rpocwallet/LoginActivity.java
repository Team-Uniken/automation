package com.uniken.poc.rpocwallet;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

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
        txtPass = (EditText) findViewById(R.id.txtRPINLogin);
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

    /**
     * OnClick for login button.
     */
    public void loginClicked(View v)
    {
        if( txtLogin.getText().toString().isEmpty()  ) showToast("Please enter loginID");
        else if( txtPass.getText().toString().isEmpty() ) showToast("Please enter RPIN");
        else{
            if( Util.checkInternetConnection(this) ) {
                User user = User.getInstance();
                user.setLogin_id(txtLogin.getText().toString());
                user.setPassword(txtPass.getText().toString());
                if(user.getLogin_id()!=null)
                    user.setLogin_id(user.getLogin_id().trim());
                new ChallengeHandler(LoginActivity.getInstance()).doLogin(user);
            }else showToast(getString(R.string.no_internet));
        }
    }

}
