package com.uniken.poc.pocwallet;

/**
 * Created by UNIKEN on 12/13/2017.
 */

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Controller implements Callback<Wallet>
{
    //static final String BASE_URL="http://34.207.14.201:8080/DummyWalletAPI/";
    static final String BASE_URL="https://poc5-uniken.com:8443/DummyWalletAPI/";

    private String method;
    private User user;


    Controller(User user, String method)
    {
        this.user= user;
        this.method = method;
    }

    public void start()
    {
            Gson gson = new GsonBuilder()
                    .setLenient()
                    .create();

            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .build();

            if (method.equals("register")) {
                WalletAPI api = retrofit.create(WalletAPI.class);
                Call<Wallet> call = api.registerUser(user.getLogin_id(), user.getPassword(),
                        user.getCard_no(), user.getCard_pin());
                call.enqueue(this);
                RegisterActivity.getInstance().progressBarVisibility(true);
            } else if (method.equals("login")) {
                WalletAPI api = retrofit.create(WalletAPI.class);
                Call<Wallet> call = api.login(user.getLogin_id(), user.getPassword());
                call.enqueue(this);
                LoginActivity.getInstance().progressBarVisibility(true);
            } else if (method.equals("balance")) {
                WalletAPI api = retrofit.create(WalletAPI.class);
                Call<Wallet> call = api.getBalance("login_id:" + user.getLogin_id());
                call.enqueue(this);
                HomeActivity.getInstance().progressBarVisibility(true);
            } else if (method.equals("update")) {
                WalletAPI api = retrofit.create(WalletAPI.class);
                Call<Wallet> call = api.updateAmount(user.getLogin_id(), "" + user.getUpdate_amount());
                call.enqueue(this);
                HomeActivity.getInstance().progressBarVisibility(true);

            }
        Log.d("MyApp","I am here");
    }

    @Override
    public void onResponse(Call<Wallet> call, Response<Wallet> response)
    {
        Log.d("MyApp","Got Response");
        if(response.isSuccessful()) {

            Log.d("MyApp","Success - "+response.body().toString());

            if(method.equals("register"))
            {
                Wallet w = response.body();
                if(w.getError()!=null)
                {
                    RegisterActivity.getInstance().showError(w);
                    apiFailed(w.getError());
                }
                else
                {
                    Log.d("response.body()", w.toString());
                    String balance = ""+w.getBalance();
                    System.out.println(balance);
                    user.setWallet_balance(Double.parseDouble(balance));
                    /*Intent myIntent = new Intent(RegisterActivity.getInstance(),
                            HomeActivity.class);
                    RegisterActivity.getInstance().startActivity(myIntent);*/
                    RegisterActivity.getInstance().progressBarVisibility(false);
                    Util.openActivity(RegisterActivity.getInstance(), HomeActivity.class, false);

                }

            }
            else if(method.equals("login")) {
                Wallet w = response.body();
                if(w.getError()!=null)
                {
                    LoginActivity.getInstance().showError(w);
                    apiFailed(w.getError());
                }
                else
                {
                    Log.d("response.body()", w.toString());
                    String balance = "" + w.getBalance();
                    System.out.println(balance);
                    user.setWallet_balance(Double.parseDouble(balance));
                    /*Intent myIntent = new Intent(LoginActivity.getInstance(),
                            HomeActivity.class);
                    LoginActivity.getInstance().startActivity(myIntent);*/
                    LoginActivity.getInstance().progressBarVisibility(false);
                    Util.openActivity(LoginActivity.getInstance(), HomeActivity.class, false);
                }
            }
            else if(method.equals("balance")) {

            }
            else if(method.equals("update")) {

                Wallet w = response.body();
                if(w.getError()!=null)
                {
                    HomeActivity.getInstance().showError(w);
                    apiFailed(w.getError());
                }else {
                    Log.d("response.body()", w.toString());
                    String balance = "" + w.getBalance();
                    System.out.println(balance);
                    user.setWallet_balance(Double.parseDouble(balance));
                /*Intent myIntent = new Intent(HomeActivity.getInstance(),
                        HomeActivity.class);
                HomeActivity.getInstance().startActivity(myIntent);*/
                    HomeActivity.getInstance().progressBarVisibility(false);
                    Util.openActivity(HomeActivity.getInstance(), HomeActivity.class, false);
                }

            }

        } else {
            Log.d("MyApp","Error");
            System.out.println(response.errorBody());
            System.out.println(response.toString());

        }


    }

    @Override
    public void onFailure(Call<Wallet> call, Throwable t )
    {
        Log.d("MyApp","Inside Failure");
        t.printStackTrace();
        apiFailed(t.getMessage());

    }

    private void apiFailed( String error ){

        if(method.equals("register"))
        {
            RegisterActivity.getInstance().progressBarVisibility(false);
            RegisterActivity.getInstance().showToast(error);
        } else if(method.equals("balance")) {

        } else if(method.equals("update")) {
            HomeActivity.getInstance().progressBarVisibility(false);
            HomeActivity.getInstance().showToast(error);
        } else if(method.equals("login")) {
            LoginActivity.getInstance().progressBarVisibility(false);
            LoginActivity.getInstance().showToast(error);
        }
    }
}
