package com.reactrefapp;

import android.util.Log;

class Logger {

  private static final int ENTRY_MAX_LEN = 4000;

  public enum LogLevel {
    LOG_I(0),                              
    LOG_D(1),
    LOG_E(2), 
    LOG_V(3), 
    LOG_W(4); 
    
    public final int intValue;

    private LogLevel(int val) {
      this.intValue = val;
    }
  }
  
  /**
   * @param args If the last argument is an exception than it prints out the stack trace, and there should be no {}
   *             or %s placeholder for it.
   */
  public static void d(String tag, String message) {
      log(LogLevel.LOG_D, tag, message);
  }

  public static void i(String tag, String message) {
      log(LogLevel.LOG_I, tag, message);
  }

  public static void w(String tag, String message) {
      log(LogLevel.LOG_W, tag, message);
  }

  public static void e(String tag, String message) {
      log(LogLevel.LOG_E, tag, message);
  }
  
  public static void v(String tag, String message) {
    log(LogLevel.LOG_V, tag, message);
  }

  public static void log(LogLevel logLevel, String TAG, String str) {
    if(BuildConfig.enableLogs) {
      if (str.length() > ENTRY_MAX_LEN) {
        print(logLevel, TAG, str.substring(0, ENTRY_MAX_LEN));
        log(logLevel, TAG, str.substring(ENTRY_MAX_LEN));
      } else
        print(logLevel, TAG, str);
    }
}
  
  private static void print(LogLevel logLevel, String TAG, String str){
    switch (logLevel) {
    case LOG_D:
      Log.d(TAG, str);
      break;
    case LOG_E:
      Log.e(TAG, str);
      break;
    case LOG_I:
      Log.i(TAG, str);
      break;
    case LOG_V:
      Log.v(TAG, str);
      break;
    case LOG_W:
      Log.w(TAG, str);
      break;

    default:
      break;
    }
  }
  
 
}
