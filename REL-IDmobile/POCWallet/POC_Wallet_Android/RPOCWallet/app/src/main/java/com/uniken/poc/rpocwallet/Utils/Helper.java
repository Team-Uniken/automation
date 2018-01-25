package com.uniken.poc.rpocwallet.Utils;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.StyleSpan;
import android.util.Base64;
import android.widget.Toast;

import com.uniken.poc.rpocwallet.ModelsAndHolders.User;
import com.uniken.poc.rpocwallet.R;
import com.uniken.rdna.RDNA;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;


public class Helper
{
  private static SharedPreferences appPrefs  = null;
  private static SharedPreferences userPrefs = null;
  private static boolean isRememberUser;
  private static String loggedInUserName="";
  static AlertDialog  alertDialog;

  public static SharedPreferences getAppPrefs(Context context)
  {
    if (appPrefs == null) {
      appPrefs = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE);
    }

    return appPrefs;
  }

  public static SharedPreferences getUserPrefs(Context context)
  {
    if (userPrefs == null) {
      userPrefs = context.getSharedPreferences("UserPrefs", Context.MODE_PRIVATE);
    }

    return userPrefs;
  }

  public static void saveUserID(Context context, String userID)
  {
    getUserPrefs(context).edit()
            .putString(Constants.USER_ID, userID)
            .commit();
  }

  public static String getUserID(Context context)
  {
    return getUserPrefs(context).getString(Constants.USER_ID, "");
  }

  public static String getLoggenInUserID(Context context)
  {
    return getUserPrefs(context).getString(Constants.LOGGED_IN_USERID, "");
  }

  public static void saveLoggenInUserID(Context context)
  {
    getUserPrefs(context).edit().putString(Constants.LOGGED_IN_USERID, getUserID(context)).commit();
  }


  public static void rememberUser(Context context)
  {
    if (isRememberUser()) {
      User u = new User();
      u.setServerIp(DatabaseHelper.getInstance(context).selectedServerIp());
      u.setUserDomain("domain");
      u.setUserName(Helper.getUserID(context));
      DatabaseHelper.getInstance(context).insertUser(u);
      setIsRememberUser(false);
    }
  }

  public static int dpToPx(int dp)
  {
    return (int) (dp * Resources.getSystem().getDisplayMetrics().density);
  }

  public static int pxToDp(int px)
  {
    return (int) (px / Resources.getSystem().getDisplayMetrics().density);
  }

  public static void showAlert(final Context context, String title, String msg)
  {
    showAlert(context, title, msg, null,false);
  }

  public static void showAlert(final Context context, String title, String msg,boolean isCancellable)
  {
    showAlert(context, title, msg, null,isCancellable);
  }

  public static int getColor(Context context, int color)
  {
    return ContextCompat.getColor(context, color);
  }

  public static AlertDialog showAlert(final Context context, final String title, final String message, final DialogInterface.OnClickListener clickListener,boolean isCancallable)
  {
    final AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context,R.style.AlertDialogTheme);
    alertDialogBuilder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        if (clickListener != null) {
          clickListener.onClick(dialogInterface,i);
        }
      }
    });
    alertDialogBuilder.setCancelable(isCancallable);
    alertDialogBuilder.setTitle(title).setMessage(message);
    return alertDialogBuilder.show();
  }

  public static AlertDialog showAlert(final Activity context, final String title, final String message, String positiveBtn, final DialogInterface.OnClickListener clickListener, boolean isCancallable)
  {
    if( alertDialog == null) {
     AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context, R.style.AlertDialogTheme);
      alertDialogBuilder.setPositiveButton(positiveBtn, new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialogInterface, int i) {
          dialogInterface.dismiss();
          if (clickListener != null) {
            clickListener.onClick(dialogInterface, i);
            alertDialog = null;
          }
        }
      });
      alertDialogBuilder.setCancelable(isCancallable);
      alertDialogBuilder.setTitle(title);
      alertDialog =  alertDialogBuilder.create();
    }
    alertDialog.setMessage(message);
    alertDialog.show();
    return alertDialog;
  }

  public static AlertDialog showAlert(final Activity context, final String title, final String message, String positiveBtn, final DialogInterface.OnClickListener clickListener,String negativeBtn, boolean isCancallable)
  {
    final AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context,R.style.AlertDialogTheme);
    alertDialogBuilder.setPositiveButton(positiveBtn, new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        if (clickListener != null) {
          clickListener.onClick(dialogInterface,i);
        }
      }
    });
    alertDialogBuilder.setNegativeButton(negativeBtn, new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialogInterface, int i) {
        dialogInterface.cancel();
      }
    });
    alertDialogBuilder.setCancelable(isCancallable);
    alertDialogBuilder.setTitle(title).setMessage(message);
    return alertDialogBuilder.show();
  }

  public static String getErrorInfo(int errorCode)
  {
    String errorInfo = "Internal system error, please exit and log in again \n"
            + "Error Code : 0x" + Integer.toHexString(errorCode);
    return errorInfo;
  }

  public static String getStatusInfo(RDNA.RDNAResponseStatus status)
  {
    String statusInfo = "null";
    if (status != null) {
      statusInfo = "Status Message : " + status.message;
    }
    return statusInfo;
  }

  public static Drawable returnDrawable(int id, Context context)
  {
    return ContextCompat.getDrawable(context, id);
  }

  private static String b64Encode(byte[] data)
  {
    String base64 = "";
    try {
      base64 = Base64.encodeToString(data, Base64.NO_WRAP);
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return base64;
  }

  public static String b64Decode(byte[] data)
  {
    byte[] decodedBytes = null;
    try {
      decodedBytes = Base64.decode(data, Base64.NO_WRAP);
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return Arrays.toString(decodedBytes);
  }

  public static String getEncodedString(String val)
  {
    String encodedString = null;
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      md.update(val.getBytes("UTF-8")); // Change this to "UTF-16" if needed
      byte[] digest = md.digest();
      encodedString = b64Encode(digest);
    }
    catch (UnsupportedEncodingException | NoSuchAlgorithmException e) {
      e.printStackTrace();
    }

    return encodedString;
  }

  public static SpannableStringBuilder getAttemptLeft(int attempt)
  {
    String attemptLeft;
    if (attempt > 1) {
      attemptLeft = attempt + " Attempts Left";
    }
    else {
      attemptLeft = attempt + " Attempt Left";
    }
    final SpannableStringBuilder sb = new SpannableStringBuilder(attemptLeft);
    final StyleSpan bss = new StyleSpan(android.graphics.Typeface.BOLD); // Span to make text bold
    sb.setSpan(bss, 0, 1, Spannable.SPAN_INCLUSIVE_INCLUSIVE); // make first 1 characters Bold
    return sb;
  }

  public static void saveGcmToken(Context context,String token){
    getAppPrefs(context).edit().putString("GcmToken",token).commit();
  }

  public static String getGcmToken(Context context){
    return getAppPrefs(context).getString("GcmToken","");
  }

  public static void showToast(Context context, String msg)
  {
    Toast.makeText(context, msg, Toast.LENGTH_LONG).show();
  }

  public static boolean isRememberUser()
  {
    return isRememberUser;
  }

  public static void setIsRememberUser(boolean isRememberUser)
  {
    Helper.isRememberUser = isRememberUser;
  }

  public static void setLoggedInUser(String loggedInUserName)
  {
    Helper.loggedInUserName = loggedInUserName;
  }
  public static String getLoggedInUser()
  {
    return loggedInUserName;
  }

  public static AlertDialog showProgress(AlertDialog progressView, Context context){
    AlertDialog alertDialog = new AlertDialog.Builder(context,R.style.ProgressDialog)
            .setView(R.layout.layout_progress)
            .setCancelable(false)
            .setMessage(null).create();
    progressView = alertDialog;

    if(!progressView.isShowing())
      progressView.show();
    return progressView;
  }

  public static void hideProgress(AlertDialog progressView){
    if(progressView!=null && progressView.isShowing())
      progressView.dismiss();
  }
}
