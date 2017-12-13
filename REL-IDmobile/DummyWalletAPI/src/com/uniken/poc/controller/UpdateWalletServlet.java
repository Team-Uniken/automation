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
public class UpdateWalletServlet extends MyHttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String login_id = request.getParameter("login_id");
		String strAmount = request.getParameter("amount");
		double amount = Double.parseDouble(strAmount);
		UserDAO dao = new UserDAO();
		try
		{
			Wallet w = dao.updateBalance(login_id, amount);
			Gson g = new Gson();
			sendResponse(g.toJson(w), request, response);

		}
		catch(Exception e)
		{
			sendError(e.getMessage(), request, response);
		}
					
	}
}
