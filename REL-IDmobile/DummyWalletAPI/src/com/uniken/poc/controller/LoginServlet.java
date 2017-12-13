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
public class LoginServlet extends MyHttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String login_id = request.getParameter("login_id");
		String password = request.getParameter("password");
		UserDAO dao = new UserDAO();
		if(dao.checkUser(login_id, password))
		{
			Wallet w = dao.getBalance(login_id);
			Gson g = new Gson();
			sendResponse(g.toJson(w), request, response);
		}
		else
		{
			Wallet w = new Wallet();
			w.setUser_name(login_id);
			w.setError("INVALID CREDENTIALS");
			Gson g = new Gson();
			sendResponse(g.toJson(w), request, response);
			
		}
		
	}
}
