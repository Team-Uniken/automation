package com.uniken.poc.rpocwallet.ModelsAndHolders;

public class User
{
  private String serverIp;
  private String userName;
  private String userDomain;

  public String getUserDomain()
  {
    return userDomain;
  }

  public void setUserDomain(String userDomain)
  {
    this.userDomain = userDomain;
  }

  public String getServerIp()
  {
    return serverIp;
  }

  public void setServerIp(String serverIp)
  {
    this.serverIp = serverIp;
  }

  public String getUserName()
  {
    return userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }
}
