package com.uniken.poc.rpocwallet;

/**
 * Created by UNIKEN on 12/13/2017.
 */

import retrofit2.Call;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface WalletAPI {

    @POST("balance")
    Call<Wallet> getBalance(@Query("login_id") String user);

    @POST("register")
    Call<Wallet> registerUser(@Query("login_id") String user,
                              @Query("password") String password,
                              @Query("card_no") String card_no,
                              @Query("card_pin") String card_pin,
                              @Query("session_id") String session_id);


    @POST("update")
    Call<Wallet> updateAmount(@Query("login_id") String user,
                              @Query("amount") String amount);

    @POST("login")
    Call<Wallet> login(@Query("login_id") String user, @Query("password") String password);
}
