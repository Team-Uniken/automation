package com.uniken.poc.rpocwallet;

/**
 * Created by UNIKEN on 12/13/2017.
 */

public class User {

    private static User user = null;

    private User()
    {

    }

    public static User getInstance()
    {
        if(user==null)
            user = new User();
        return user;
    }


    public String getLogin_id() {
        return login_id;
    }

    public void setLogin_id(String login_id) {
        this.login_id = login_id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCard_no() {
        return card_no;
    }

    public void setCard_no(String card_no) {
        this.card_no = card_no;
    }

    public String getCard_pin() {
        return card_pin;
    }

    public void setCard_pin(String card_pin) {
        this.card_pin = card_pin;
    }

    private String login_id;
    private String password;
    private String card_no;
    private String card_pin;

    public double getWallet_balance() {
        return wallet_balance;
    }

    public void setWallet_balance(double wallet_balance) {
        this.wallet_balance = wallet_balance;
    }

    public double getUpdate_amount() {
        return update_amount;
    }

    public void setUpdate_amount(double update_amount) {
        this.update_amount = update_amount;
    }

    private double wallet_balance;
    private double update_amount;
}
