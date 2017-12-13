package com.uniken.poc.dao;


import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import com.uniken.poc.utils.DBUtils;

public class BaseDAO {
	Statement stmt = null;
	String strSQL = null;

	public void execute(String sql) throws Exception
	{
		getStatement();
		stmt.execute(sql);
		closeStatement();
		
	}
	
	public int getIDByName(String table,  String idcol, String nameCol, String name) throws Exception
	{
		stmt = DBUtils.getInstance().getConnection().createStatement();
		String sql = "select "+idcol+" from "+table+" where "+nameCol+"='" + name + "'";
		System.out.println(sql);
		ResultSet rs = stmt.executeQuery(sql);
		rs.next();
		int id = rs.getInt(1);
		rs.close();
		stmt.close();
		return id;
		
	}
	
	
	
	public ResultSet executeQuery(String sql) throws Exception
	{
		getStatement();
		return(stmt.executeQuery(sql));
		
	}
	
	public void closeStatement(ResultSet rs) throws Exception
	{
		rs.close();
		stmt.close();
	}
	
	
	private void closeStatement() throws Exception
	{
		stmt.close();
	}
	
	public void getStatement() throws Exception
	{
		stmt = DBUtils.getInstance().getConnection().createStatement();
	}
	
	public void getRS(String sql)
	{
		
	}
}

