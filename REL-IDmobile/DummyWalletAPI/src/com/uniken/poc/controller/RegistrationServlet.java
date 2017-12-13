package com.uniken.poc.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.*;
import com.uniken.poc.beans.Wallet;
import com.uniken.poc.dao.UserDAO;
public class RegistrationServlet extends MyHttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{

		
		System.out.println("Register Called: ");
		String login_id = request.getParameter("login_id");
		String password = request.getParameter("password");
		String card_no = request.getParameter("card_no");
		String card_pin = request.getParameter("card_pin");
		
		System.out.println(login_id+":"+password+":"+card_no+":"+card_pin);
		
		try
		{
		Wallet w = new UserDAO().registerUser(login_id, password,card_no,card_pin);
		Gson g = new Gson();
		sendResponse(g.toJson(w), request, response);

		}
		catch(Exception e)
		{
			Wallet w = new Wallet();
			w.setUser_id(0);
			w.setUser_name("ERROR");
			w.setError(e.getMessage());
			Gson g = new Gson();
			sendResponse(g.toJson(w), request, response);

		}
	}
}
