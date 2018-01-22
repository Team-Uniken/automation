package com.uniken.poc.rpocwallet.ModelsAndHolders;

public class Profile implements Comparable<Profile>
{
  private String host;
  private int    isBuiltIn;
  private int    isSelected;
  private String profileName;
  private int    port;
  private String relId;
  private int    proxyPort;
  private String proxyIp = "";
  String proxyUsername = "";
  String proxyPassword = "";
  int    useProxy      = 0;


  public int isUsingProxy()
  {
    return useProxy;
  }

  public void setUseProxy(int val)
  {
    useProxy = val;
  }

  public String getProxyPassword()
  {
    return proxyPassword;
  }

  public void setProxyPassword(String proxyPassword)
  {
    this.proxyPassword = proxyPassword;
  }

  public String getProxyUsername()
  {
    return proxyUsername;
  }

  public void setProxyUsername(String proxyUsername)
  {
    this.proxyUsername = proxyUsername;
  }

  public void setProxyIp(String proxyIp)
  {
    this.proxyIp = proxyIp;
  }

  public String getProxyIp()
  {
    return proxyIp;
  }

  public void setProxyPort(int proxyPort)
  {
    this.proxyPort = proxyPort;
  }

  public int getProxyPort()
  {
    return proxyPort;
  }

  public String getHost()
  {
    return host;
  }

  public void setHost(String mHost)
  {
    this.host = mHost;
  }

  public int getIsBuiltIn()
  {
    return isBuiltIn;
  }

  public void setIsBuildIn(int mIsBuildIn)
  {
    this.isBuiltIn = mIsBuildIn;
  }

  public int getIsSelected()
  {
    return isSelected;
  }

  public void setIsSelected(int mIsSelected)
  {
    this.isSelected = mIsSelected;
  }

  public String getProfileName()
  {
    return profileName;
  }

  public void setProfileName(String mProfileName)
  {
    this.profileName = mProfileName;
  }

  public int getPort()
  {
    return port;
  }

  public void setPort(int mPort)
  {
    this.port = mPort;
  }

  public String getRelId()
  {
    return relId;
  }

  public void setRelId(String mRelId)
  {
    this.relId = mRelId;
  }

  @Override
  public int compareTo(Profile another)
  {
    int compare = another.getIsBuiltIn();
    //ascending order
    return compare - this.getIsBuiltIn();

  }
}
