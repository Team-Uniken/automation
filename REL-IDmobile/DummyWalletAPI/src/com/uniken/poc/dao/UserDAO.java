package com.uniken.poc.dao;

import java.sql.ResultSet;

import com.uniken.poc.beans.Wallet;

public class UserDAO extends BaseDAO {
	
	public Wallet registerUser(String login_id, String password, String card_no, String card_pin) throws Exception
	{
		Wallet w = new Wallet();
		try
		{
			ResultSet rs = executeQuery("select card_no,card_pin from user_info where login_id = '" + login_id + "'");
			if(!rs.next())
				throw new Exception("User does not Exist");
			if(!rs.getString(1).equals(card_no) || !rs.getString(2).equals(card_pin) )
				throw new Exception("Registration Failed");
		}
		catch(Exception e)
		{
				
			throw new Exception("Error in Registering User: " + e.getMessage());
				
		}
			
		try
		{
			execute("insert into users(login_id,password) values ('"+login_id+"','"+password+"')");
			execute("insert into wallets(user_id) values((select user_id from users where login_id = '"+login_id+"'))");
		}
		catch(Exception e)
		{
			throw new Exception("User Already Registered: ");
		}
		
		return getBalance(login_id);
		
	}
	
	public boolean checkUser(String login_id, String password)
	{
		boolean success = false;
		try
		{
			ResultSet rs = executeQuery("select password from users where login_id ='" +login_id +"'");
			rs.next();
			String dbpass = rs.getString(1);
			if(dbpass.equals(password))
				success = true;
			closeStatement(rs);	
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
		
		return success;
	}
	
	public Wallet getBalance(String login_id)
	{
		Wallet w = new Wallet();
		try
		{
			ResultSet rs = executeQuery("select balance, u.user_id, w.wallet_id from wallets w, users u where "
					+ " u.user_id = w.user_id and  "
					+ " u.login_id = '"+login_id+"'");
			rs.next();
			w.setUser_name(login_id);
			w.setBalance(rs.getDouble(1));
			w.setUser_id(rs.getInt(2));
			w.setWallet_id(rs.getInt(3));
			closeStatement(rs);
			w.setError(null);
		}
		catch(Exception e)
		{
			w.setError("ERROR : " + e.getMessage());
			e.printStackTrace();
		}
		
		return w;
		
	}
	
	public Wallet updateBalance(String login_id, double amount) throws Exception
	{
		try
		{
		execute("update wallets set  balance = balance + " + amount + " where user_id = "
				+ "(select user_id from users where login_id = '"+login_id+"')");
		}
		catch(Exception e)
		{
			e.printStackTrace();

			throw new Exception("Error in Updating Balance");
		}
		return getBalance(login_id);
	}

	public boolean changePassword(String login_id, String password)
	{
		try
		{
			execute("update users set password = '" + password +"' where "
					+ " login_id = '"+login_id+"'" );
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
		return true;
		
	}
	
}
