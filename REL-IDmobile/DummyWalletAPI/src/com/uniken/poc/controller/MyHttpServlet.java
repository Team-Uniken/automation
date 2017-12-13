package com.uniken.poc.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.*;

public class MyHttpServlet extends HttpServlet {
	
	public void sendResponse(String msg, HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		PrintWriter writer = response.getWriter();
		writer.append(msg);
		writer.flush();
		writer.close();
	}
	
	public void sendError(String msg, HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		PrintWriter writer = response.getWriter();
		writer.append(msg);
		writer.flush();
		writer.close();
	}

}
