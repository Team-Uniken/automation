package com.uniken.poc.utils;


import java.text.SimpleDateFormat;
import java.util.Date;

public class Validator {
	
	public static boolean isValidNumber(String text)
	{
		try
		{
			Integer.parseInt(text);
		}
		catch(Exception e)
		{
			return false;
		}
		return true;
	}
	
	private static SimpleDateFormat format = new SimpleDateFormat("dd-MMM-yyyy");
	private static SimpleDateFormat parseformat = new SimpleDateFormat("yyyy-MM-dd");
	
	
	public static java.util.Date parseJavaDate(String str) throws Exception
	{
		return(format.parse(str));
		
	}
	
	public static String formatJavaDate(java.util.Date date) throws Exception
	{
		return format.format(date);
				
	}
	
	public static String formatSQLDate(java.sql.Date sqldate) throws Exception
	{
		return format.format(sqldate);
	}
	
	public static java.sql.Date parseSQLDate(String str) throws Exception
	{
		return(new java.sql.Date(parseformat.parse(str).getTime()));
		
	}
	
	public static boolean isDouble(String text)
	
	{
		try
		{
			Double.parseDouble(text);
		}
		catch(Exception e)
		{
			return false;
		}
		return true;
	}
	
	public static boolean isEmpty(String text)
	
	{
		try
		{
			if(text==null || text.trim().equals("") || text.trim().equals(" "))
				return true;
				
		}
		catch(Exception e)
		{
			return true;
		}
		return false;
	}

	public static boolean isDate(String text) {
		// TODO Auto-generated method stub
		try
		{
			format.parse(text);
			return true;
		}catch(Exception e)
		{
			return false;
		}
		
		
	}

	public static java.sql.Date parseSQLDate2(String str) throws Exception{
		// TODO Auto-generated method stub
		return(new java.sql.Date(format.parse(str).getTime()));
	}

	public static Date parseJavaDateyyyy(String str) throws Exception {
		// TODO Auto-generated method stub
		return parseformat.parse(str);
	}

	public static String formatJavaDateyyyy(Date date) {
		// TODO Auto-generated method stub
		return parseformat.format(date);
	}
	
}
