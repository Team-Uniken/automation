package com.uniken.poc.rpocwallet;

/**
 * Created by UNIKEN on 12/13/2017.
 */

public class Wallet {
    private String id;
    private String login_id;
    private double balance;
    private String error;
    private String act_code;

    @Override
    public String toString()
    {
        return this.getUser_name() + ":" + this.getBalance() + ":" + this.getError();
    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}
    public String getError() {
        return error;
    }
    public void setError(String error) {
        this.error = error;
    }
    public String getUser_name() {
        return login_id;
    }
    public void setLogin_id(String login_id) {
        this.login_id = login_id;
    }
    public String getLogin_id() {
        return this.login_id ;
    }
    public double getBalance() {
        return balance;
    }
    public void setBalance(double balance) {
        this.balance = balance;
    }
    public String getAct_code() {return act_code;}
    public void setAct_code(String act_code) {this.act_code = act_code;}
}
