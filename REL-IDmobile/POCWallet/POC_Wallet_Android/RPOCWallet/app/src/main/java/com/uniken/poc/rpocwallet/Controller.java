package com.uniken.poc.rpocwallet;

/**
 * Created by UNIKEN on 12/13/2017.
 */

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.uniken.poc.rpocwallet.Utils.RDNAClient.RDNAClient;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Controller implements Callback<Wallet>
{
    final String BASE_URL="http://"+RDNAClient.getInstance().getConnectedProfile().getHost()+":8080/DummyWalletAPI2/";

    private String method;
    public User user;
    static Gson gson = new GsonBuilder()
            .setLenient()
            .create();

    /**
     *  Setting REL-ID proxy to retrofit
     */
    java.net.Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("127.0.0.1", RDNAClient.getInstance().getPxyPort().port));
    OkHttpClient client = new OkHttpClient.Builder().proxy(proxy).readTimeout(120,TimeUnit.SECONDS).connectTimeout(120, TimeUnit.SECONDS).build();

    Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build();

    /**
     *
     * @param user - Object of user for which api is to be fired
     * @param method - Api method name
     */
    Controller(User user, String method)
    {
        this.user= user;
        this.method = method;
    }


    /**
     *  Call apis according to the method passed in constructor.
     */
    public void start()
    {
            if(user.getLogin_id()!=null)
                user.setLogin_id(user.getLogin_id().trim());

            if (method.equals("register")) {
                WalletAPI api = retrofit.create(WalletAPI.class);
                Call<Wallet> call = api.registerUser(user.getLogin_id(), user.getPassword(),
                        user.getCard_no(), user.getCard_pin(),RDNAClient.getInstance().getSessionId());
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

    /*
     *  Receive response from retrofit and act according to the method passed in constructor.
     */

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

                    RegisterActivity.getInstance().progressBarVisibility(false);
                    new ChallengeHandler(RegisterActivity.getInstance()).startActivation(w.getAct_code(),user.getLogin_id(),user.getPassword());
                    //Util.openActivity(RegisterActivity.getInstance(), HomeActivity.class, false);
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

                    HomeActivity.getInstance().progressBarVisibility(false);
                    Util.openActivity(HomeActivity.getInstance(), HomeActivity.class, false);
                }

            }

        } else {
            apiFailed("Something went wrong, please try again");
            Log.d("MyApp","Error");
            System.out.println(response.errorBody());
            System.out.println(response.toString());
        }


    }

    /*
        Handles failure case
     */
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
