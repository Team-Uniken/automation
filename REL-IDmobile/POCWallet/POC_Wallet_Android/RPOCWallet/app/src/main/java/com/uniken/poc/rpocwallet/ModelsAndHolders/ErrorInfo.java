package com.uniken.poc.rpocwallet.ModelsAndHolders;

import com.uniken.rdna.RDNA;

public class ErrorInfo
{
  private RDNA.RDNAErrorID errorID;
  private String           msg;
  private String           methodID;
  private String           errorHex;
  private int              errorCode;

  public int getErrorCode()
  {
    return errorCode;
  }

  public void setErrorCode(int errorCode)
  {
    this.errorCode = errorCode;
  }

  public String getMsg()
  {
    return msg;
  }

  public void setMsg(String msg)
  {
    this.msg = msg;
  }

  public String getMethodID()
  {
    return methodID;
  }

  public void setMethodID(String methodID)
  {
    this.methodID = methodID;
  }

  public String getErrorHex()
  {
    return errorHex;
  }

  public void setErrorHex(String errorHex)
  {
    this.errorHex = errorHex;
  }

  public RDNA.RDNAErrorID getErrorID()
  {
    return errorID;
  }

  public void setErrorID(RDNA.RDNAErrorID errorID)
  {
    this.errorID = errorID;
  }

  public ErrorInfo(int errorCode)
  {
    this.errorCode = errorCode;
    this.errorID = RDNA.getErrorInfo(errorCode);
    this.errorHex = Integer.toHexString(errorCode);
  }

  public ErrorInfo(int errorCode, String methodID)
  {
    this(errorCode);
    this.methodID = methodID;
  }

  public static String getErrorMsg(RDNA.RDNAErrorID errorID)
  {
    return null;
  }

  @Override
  public String toString()
  {
    String errorInfo = "Internal system error, please exit and log in again";
    return errorInfo;
  }
}
