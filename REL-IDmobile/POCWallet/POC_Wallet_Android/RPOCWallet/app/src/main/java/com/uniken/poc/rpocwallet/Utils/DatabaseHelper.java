package com.uniken.poc.rpocwallet.Utils;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;


import com.uniken.poc.rpocwallet.ModelsAndHolders.Profile;
import com.uniken.poc.rpocwallet.ModelsAndHolders.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * this class contains methods for database related operations.
 */
public class DatabaseHelper
{

  private        String         TAG      = DatabaseHelper.class.getName();
  private static DatabaseHelper dbHelper = null;
  String database_name    = "userdb";
  int    database_version = 1;

  //Attributes of UserTable (table name and column)
  private String TABLE_USER        = "tbluser";
  private String FIELD_SERVER_IP   = "serverIP";
  private String FIELD_USER_DOMAIN = "userDomain";
  private String FIELD_USER_NAME   = "userName";
  //Query for creating User Table
  public  String CREATE_USER       = "CREATE TABLE IF NOT EXISTS " + TABLE_USER + "("
          + FIELD_SERVER_IP + " TEXT , " + FIELD_USER_DOMAIN + " TEXT, " + FIELD_USER_NAME
          + " TEXT,PRIMARY KEY (" + FIELD_SERVER_IP + "," + FIELD_USER_DOMAIN + "," + FIELD_USER_NAME + "));";

  private String TABLE_PROFILE        = "tblprofile";
  private String FIELD_HOST           = "host";
  private String FIELD_IS_BUILD_IN    = "isbuildIn";
  private String FIELD_IS_SELECTED    = "isseleted";
  private String FIELD_PROFILE_NAME   = "profilename";
  private String FIELD_PORT           = "port";
  private String FIELD_RELID          = "relid";
  private String FIELD_PROXY_PORT     = "proxyport";
  private String FIELD_PROXY_IP       = "proxyip";
  private String FIELD_PROXY_USERNAME = "proxyUsername";
  private String FIELD_PROXY_PASSWORD = "proxyPassword";
  private String FIELD_USE_PROXY      = "useProxy";
  //Query for creating User Table
  public  String CREATE_PROFILE       = "CREATE TABLE IF NOT EXISTS " + TABLE_PROFILE + "("
          + FIELD_HOST + " TEXT , "
          + FIELD_IS_BUILD_IN + " INTEGER DEFAULT 0, "
          + FIELD_IS_SELECTED + " INTEGER DEFAULT 0, "
          + FIELD_PROFILE_NAME + " TEXT , "
          + FIELD_PORT + " INTEGER, "
          + FIELD_RELID + " TEXT ,"
          + FIELD_PROXY_IP + " TEXT ,"
          + FIELD_PROXY_PORT + " INTEGER ,"
          + FIELD_PROXY_USERNAME + " TEXT ,"
          + FIELD_PROXY_PASSWORD + " TEXT ,"
          + FIELD_USE_PROXY + " INTEGER ,"
          + "PRIMARY KEY ( " + FIELD_PROFILE_NAME + "," + FIELD_IS_BUILD_IN + " ));";

  private SQLiteDatabase db;

  private DatabaseHelper(Context context)
  {
    //Get the Database, Create a new DB Handler Object
    Database database = new Database(context, database_name, database_version);
    db = database.getWritableDatabase();
  }

  public static DatabaseHelper getInstance(Context context)
  {
    if (dbHelper == null) {
      return new DatabaseHelper(context);
    }
    else {
      return dbHelper;
    }
  }

  //procedure for inserting data into User Table
  public void insertUser(User u)
  {
    try {
      String INSERT_QUERY = "INSERT OR REPLACE  INTO " + TABLE_USER + " (" + FIELD_SERVER_IP + "," + FIELD_USER_DOMAIN
              + "," + FIELD_USER_NAME + ") VALUES ('" + u.getServerIp() + "','" + u.getUserDomain() + "','" + u.getUserName() + "');";
      db.execSQL(INSERT_QUERY);
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  //procedure for inserting data into Profile Table
  private void insertProfile(Profile p, SQLiteDatabase db)
  {
    try {
      ContentValues values = new ContentValues();
      values.put(FIELD_HOST, p.getHost());
      values.put(FIELD_IS_BUILD_IN, p.getIsBuiltIn());
      values.put(FIELD_IS_SELECTED, p.getIsSelected());
      values.put(FIELD_PROFILE_NAME, p.getProfileName());
      values.put(FIELD_PORT, p.getPort());
      values.put(FIELD_RELID, p.getRelId());
      values.put(FIELD_PROXY_IP, p.getProxyIp());
      values.put(FIELD_PROXY_PORT, p.getProxyPort());
      values.put(FIELD_PROXY_USERNAME, p.getProxyUsername());
      values.put(FIELD_PROXY_PASSWORD, p.getProxyPassword());
      values.put(FIELD_USE_PROXY, p.isUsingProxy());
      Log.d(TAG, "----------- Inserting " + values.toString());
      long id = db.insert(TABLE_PROFILE, null, values);
      Log.d(TAG, "Inserted " + id);
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  //procedure for inserting data into Profile Table
  public void insertProfile(Profile p)
  {
    insertProfile(p, db);
  }

  public void updateProfile(Profile profile)
  {
    ContentValues values = new ContentValues();
    values.put(FIELD_HOST, profile.getHost());
    values.put(FIELD_IS_BUILD_IN, profile.getIsBuiltIn());
    values.put(FIELD_IS_SELECTED, profile.getIsSelected());
    values.put(FIELD_PROFILE_NAME, profile.getProfileName());
    values.put(FIELD_PORT, profile.getPort());
    values.put(FIELD_RELID, profile.getRelId());
    values.put(FIELD_PROXY_IP, profile.getProxyIp());
    values.put(FIELD_PROXY_PORT, profile.getProxyPort());
    values.put(FIELD_PROXY_USERNAME, profile.getProxyUsername());
    values.put(FIELD_PROXY_PASSWORD, profile.getProxyPassword());
    values.put(FIELD_USE_PROXY, profile.isUsingProxy());

    String where = FIELD_PROFILE_NAME + "=? AND " + FIELD_IS_BUILD_IN + "=?";
    String[] whereArgs = new String[2];
    whereArgs[0] = profile.getProfileName();
    whereArgs[1] = String.valueOf(profile.getIsBuiltIn());
    db.update(TABLE_PROFILE, values, where, whereArgs);
  }

  public void deleteAllUser()
  {
    String DELETE_USER = "DELETE FROM " + TABLE_USER;
    db.execSQL(DELETE_USER);
  }


  public void deleteUser(String user)
  {
    String DELETE_USER = "DELETE FROM " + TABLE_USER + " WHERE " + FIELD_USER_NAME + "=\'" + user + "\'";
    db.execSQL(DELETE_USER);
  }

  public void deleteProfile(String profileName)
  {
    String DELETE_PROFILE = "DELETE FROM " + TABLE_PROFILE + " WHERE " + FIELD_PROFILE_NAME + "=\'" + profileName + "\'";
    db.execSQL(DELETE_PROFILE);
  }

  /*
  * this procedure return Arraylist which contain all User
  * */
  public ArrayList<String> getAllUser()
  {
    ArrayList<String> lstUser = null;
    String[] columnArray = new String[]{FIELD_USER_NAME};
    Cursor result = db.query(TABLE_USER, columnArray, FIELD_SERVER_IP + "=?", new String[]{selectedServerIp()}, null, null, null);
    if (result != null) {
      lstUser = new ArrayList<>();
      if (result.moveToFirst()) {
        do {
          lstUser.add(result.getString(result.getColumnIndex(FIELD_USER_NAME)));
        } while (result.moveToNext());
      }
      result.close();
    }
    return lstUser;
  }

  /*
  * this procedure return Arraylist which contain all profiles
  * */
  public List<Profile> getAllProfiles()
  {
    setDefaultProfile();
    Cursor result = db.query(TABLE_PROFILE, null, null, null, null, null, null);
    List<Profile> lstProfile = new ArrayList<>();
    if (result != null) {
      if (result.moveToFirst()) {
        do {
          Profile profile = new Profile();
          profile.setHost(result.getString(result.getColumnIndex(FIELD_HOST)));
          profile.setIsBuildIn(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_BUILD_IN))));
          profile.setIsSelected(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))));
          profile.setProfileName(result.getString(result.getColumnIndex(FIELD_PROFILE_NAME)));
          profile.setPort(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_PORT))));
          profile.setRelId(result.getString(result.getColumnIndex(FIELD_RELID)));
          profile.setProxyIp(result.getString(result.getColumnIndex(FIELD_PROXY_IP)));
          profile.setProxyPort(result.getInt(result.getColumnIndex(FIELD_PROXY_PORT)));
          profile.setProxyUsername(result.getString(result.getColumnIndex(FIELD_PROXY_USERNAME)));
          profile.setProxyPassword(result.getString(result.getColumnIndex(FIELD_PROXY_PASSWORD)));
          profile.setUseProxy(result.getInt(result.getColumnIndex(FIELD_USE_PROXY)));
          lstProfile.add(profile);
        } while (result.moveToNext());
      }
      result.close();
      Collections.sort(lstProfile);
      result.close();
    }
    return lstProfile;
  }

  public String getDefaultRelId()
  {
    String[] columnArray = new String[]{FIELD_RELID};
    Cursor result = db.query(TABLE_PROFILE, columnArray, FIELD_IS_BUILD_IN + "=?", new String[]{"1"}, null, null, null);
    String relId = "";
    if (result != null) {
      if (result.moveToFirst()) {
        do {
          relId = result.getString(result.getColumnIndex(FIELD_RELID));
          return relId;
        } while (result.moveToNext());
      }
      result.close();
    }
    return relId;
  }

  public void selectProfile(Profile p)
  {
    String UPDATE_QUERY = "UPDATE " + TABLE_PROFILE + " SET " + FIELD_IS_SELECTED + "='" + 0 + "' WHERE " + FIELD_IS_SELECTED + " = '" + 1 + "'";
    db.execSQL(UPDATE_QUERY);

    UPDATE_QUERY = "UPDATE " + TABLE_PROFILE + " SET " + FIELD_IS_SELECTED + "='" + 1 + "' WHERE " + FIELD_PROFILE_NAME + " LIKE '" + p.getProfileName() + "'";
    db.execSQL(UPDATE_QUERY);
  }

  public void setDefaultProfile()
  {

    Profile profile = null;
    Profile defaultProfile = null;

    Cursor result = db.query(TABLE_PROFILE, null, null, null, null, null, null);
    if (result != null) {
      if (result.moveToFirst()) {
        defaultProfile = new Profile();
        defaultProfile.setHost(result.getString(result.getColumnIndex(FIELD_HOST)));
        defaultProfile.setIsBuildIn(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_BUILD_IN))));
        defaultProfile.setIsSelected(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))));
        defaultProfile.setProfileName(result.getString(result.getColumnIndex(FIELD_PROFILE_NAME)));
        defaultProfile.setPort(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_PORT))));
        defaultProfile.setRelId(result.getString(result.getColumnIndex(FIELD_RELID)));
        defaultProfile.setProxyIp(result.getString(result.getColumnIndex(FIELD_PROXY_IP)));
        defaultProfile.setProxyPort(result.getInt(result.getColumnIndex(FIELD_PROXY_PORT)));
        defaultProfile.setProxyUsername(result.getString(result.getColumnIndex(FIELD_PROXY_USERNAME)));
        defaultProfile.setProxyPassword(result.getString(result.getColumnIndex(FIELD_PROXY_PASSWORD)));
        defaultProfile.setUseProxy(result.getInt(result.getColumnIndex(FIELD_USE_PROXY)));

        do {
          if (Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))) == 1) {
            profile = new Profile();
            profile.setHost(result.getString(result.getColumnIndex(FIELD_HOST)));
            profile.setIsBuildIn(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_BUILD_IN))));
            profile.setIsSelected(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))));
            profile.setProfileName(result.getString(result.getColumnIndex(FIELD_PROFILE_NAME)));
            profile.setPort(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_PORT))));
            profile.setRelId(result.getString(result.getColumnIndex(FIELD_RELID)));
            profile.setProxyIp(result.getString(result.getColumnIndex(FIELD_PROXY_IP)));
            profile.setProxyPort(result.getInt(result.getColumnIndex(FIELD_PROXY_PORT)));
            profile.setProxyUsername(result.getString(result.getColumnIndex(FIELD_PROXY_USERNAME)));
            profile.setProxyPassword(result.getString(result.getColumnIndex(FIELD_PROXY_PASSWORD)));
            profile.setUseProxy(result.getInt(result.getColumnIndex(FIELD_USE_PROXY)));
            break;
          }
        } while (result.moveToNext());
      }
      if (profile == null) {

        String UPDATE_QUERY = "UPDATE " + TABLE_PROFILE + " SET " + FIELD_IS_SELECTED + "='" + 1 + "' WHERE " + FIELD_PROFILE_NAME + " LIKE '" + (defaultProfile != null ? defaultProfile.getProfileName() : null) + "'";

        db.execSQL(UPDATE_QUERY);
      }
      result.close();
    }
  }

  /*
* this procedure return selected profile
* */
  public Profile selectedProfile()
  {
    setDefaultProfile();
    Profile profile = null;
    String where = FIELD_IS_SELECTED + "=? ";
    String[] whereArgs = new String[1];
    whereArgs[0] = "1";

    Cursor result = db.query(TABLE_PROFILE, null, where, whereArgs, null, null, null);
    if (result != null) {
      if (result.moveToFirst()) {
        do {
          if (Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))) == 1) {
            profile = new Profile();
            profile.setHost(result.getString(result.getColumnIndex(FIELD_HOST)));
            profile.setIsBuildIn(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_BUILD_IN))));
            profile.setIsSelected(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_IS_SELECTED))));
            profile.setProfileName(result.getString(result.getColumnIndex(FIELD_PROFILE_NAME)));
            profile.setPort(Integer.parseInt(result.getString(result.getColumnIndex(FIELD_PORT))));
            profile.setRelId(result.getString(result.getColumnIndex(FIELD_RELID)));
            profile.setProxyIp(result.getString(result.getColumnIndex(FIELD_PROXY_IP)));
            profile.setProxyPort(result.getInt(result.getColumnIndex(FIELD_PROXY_PORT)));
            profile.setProxyUsername(result.getString(result.getColumnIndex(FIELD_PROXY_USERNAME)));
            profile.setProxyPassword(result.getString(result.getColumnIndex(FIELD_PROXY_PASSWORD)));
            profile.setUseProxy(result.getInt(result.getColumnIndex(FIELD_USE_PROXY)));
            break;
          }
        } while (result.moveToNext());
      }
      result.close();
    }
    return profile;

  }

  /*
* this procedure return selected ServerIp
* */
  public String selectedServerIp()
  {
    setDefaultProfile();
    String where = FIELD_IS_SELECTED + "=? ";
    String[] whereArgs = new String[1];
    String[] columnArgs = new String[1];
    whereArgs[0] = "1";
    columnArgs[0] = FIELD_HOST;
    String ip = "";

    Cursor result = db.query(TABLE_PROFILE, columnArgs, where, whereArgs, null, null, null);
    if (result != null) {
      if (result.moveToFirst()) {
        do {
          ip = result.getString(result.getColumnIndex(FIELD_HOST));
        } while (result.moveToNext());
      }
      result.close();
    }
    return ip;
  }

  /*
  * to close database
  * */
  public void closeDatabase()
  {
    db.close();
  }

  private class Database extends SQLiteOpenHelper
  {
    Context context;

    public Database(Context context, String name, int version)
    {
      super(context, name, null, version);
      this.context = context;
    }

    @Override
    public void onCreate(SQLiteDatabase db)
    {
      db.execSQL(CREATE_USER);
      db.execSQL(CREATE_PROFILE);
      ArrayList<Profile> profileObjs = ConnectionProfileHelper.load_built_in_Connection_Profiles(context);
      for (int i = 0; i < profileObjs.size(); i++) {
        insertProfile(profileObjs.get(i), db);
      }
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion)
    {

    }
  }

}

