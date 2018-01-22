package com.uniken.poc.rpocwallet.Utils;

import android.content.Context;


import com.uniken.poc.rpocwallet.ModelsAndHolders.Profile;
import com.uniken.poc.rpocwallet.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;


public class ConnectionProfileHelper
{

  public static ArrayList<Profile> load_built_in_Connection_Profiles(Context context)
  {
    ArrayList<Profile> response;
    String val = "";
    Scanner s = new Scanner(context.getResources().openRawResource(R.raw.built_in_profiles));
    try {
      while (s.hasNext()) {
        val += s.next();
      }
    }
    finally {
      s.close();
    }
    response = parseJson(val, true, context);
    return response;
  }

  /*
   *This method parses the connection profile json.
   */
  public static ArrayList<Profile> parseJson(String jsonString, boolean areBuiltInProfiles, Context context)
  {
    ArrayList<Profile> response = new ArrayList<>();
    try {
      JSONObject json = new JSONObject(jsonString);
      Profile p;
      JSONArray relIds = null;
      JSONArray profiles = null;
      if (json.has("RelIds")) {
        relIds = json.getJSONArray("RelIds");
      }
      if (json.has("Profiles")) {
        profiles = json.getJSONArray("Profiles");
      }
      if (profiles != null) {
        for (int i = 0; i < profiles.length(); i++) {
          JSONObject c = profiles.getJSONObject(i);
          p = new Profile();
          String name = c.getString("Name");
          String host = c.getString("Host");
          Integer port = c.getInt("Port");
          String relIDName = c.getString("RelId");
          int proxyPort = c.optInt("ProxyPort");
          String proxyIp = c.optString("ProxyIp");
          String proxyUsername = c.optString("ProxyUsername");
          String proxyPassword = c.optString("ProxyPassword");

          String relID = null;
          int j = 0;
          for (j = 0; j < (relIds != null ? relIds.length() : 0); j++) {
            JSONObject r = relIds.getJSONObject(j);
            if (r.has("Name")) {
              String relIdName = r.getString("Name");
              if (relIdName.equals(relIDName)) {
                if (r.has("RelId")) {
                  relID = r.getString("RelId");
                  p.setHost(host);
                  p.setIsBuildIn(boolToInt(areBuiltInProfiles));
                  p.setIsSelected(0);
                  p.setProfileName(name);
                  p.setPort(port);
                  p.setRelId(relID);
                  p.setProxyIp(proxyIp);
                  p.setProxyPort(proxyPort);
                  p.setProxyUsername(proxyUsername);
                  p.setProxyPassword(proxyPassword);
                  response.add(p);
                }
                break;
              }
            }
          }
          if (j == relIds.length() && DatabaseHelper.getInstance(context).getDefaultRelId().length() > 0) {
            p.setHost(host);
            p.setIsBuildIn(boolToInt(areBuiltInProfiles));
            p.setIsSelected(0);
            p.setProfileName(name);
            p.setPort(port);
            p.setRelId(DatabaseHelper.getInstance(context).getDefaultRelId());
            p.setProxyIp(proxyIp);
            p.setProxyPort(proxyPort);
            p.setProxyUsername(proxyUsername);
            p.setProxyPassword(proxyPassword);
            response.add(p);
          }

        }
      }
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return response;
  }

  public static int boolToInt(boolean b)
  {
    if (b) {
      return 1;
    }
    else {
      return 0;
    }
  }


  public static Comparator<Profile> p
          = new Comparator<Profile>()
  {

    public int compare(Profile p1, Profile p2)
    {

      //ascending order
      return p1.compareTo(p2);

    }

  };
}


