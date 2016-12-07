package com.reactrefapp;

import android.os.AsyncTask;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;


public class NetworkHttpPostTask extends AsyncTask<String, String, String> {

  private String proxyHNIP = null;
  private int proxyPort = -1;
  Callback callback;
  int errorCode = 0;
  String jsonPostData;

  public NetworkHttpPostTask(String proxyHNIP, int proxyPort, ReadableMap map,Callback callback){
    this.callback = callback;
    this.proxyHNIP = proxyHNIP;
    this.proxyPort = proxyPort;
    try {
      this.jsonPostData = new JSONObject(map.toString()).get("NativeMap").toString();
    }
    catch (Exception e){}
  }

  public NetworkHttpPostTask(String proxyHNIP, int proxyPort, String jsonPostData,Callback callback){
    this.callback = callback;
    this.proxyHNIP = proxyHNIP;
    this.proxyPort = proxyPort;
    this.jsonPostData = jsonPostData;
  }

  @Override
  protected void onPreExecute() {
    super.onPreExecute();
  }

  @Override
  protected String doInBackground(String... params) {
    String response;
    try {
      if(jsonPostData!=null) {
       // HashMap<String, String> postData = new ObjectMapper().readValue(jsonPostData, HashMap.class);
        Gson gson = new Gson();
        Type stringStringMap = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String,String> postData = gson.fromJson(jsonPostData, stringStringMap);
        response = performPostCall(params[0], postData);
      }
      else{
        errorCode =1;
        response = "Request data is invalid";
      }
    } catch (Exception e) {
      e.printStackTrace();
      errorCode = 1;
      response = "The request timed out";
    }

    return response;
  }

  @Override
  protected void onPostExecute(String result) {
    super.onPostExecute(result);

    WritableMap errorMap = Arguments.createMap();
    errorMap.putInt("error", errorCode);
    errorMap.putString("response", result);

    WritableArray writableArray = Arguments.createArray();
    writableArray.pushMap(errorMap);

    callback.invoke(writableArray);
  }



//  public String post(String urlString,ReadableMap map) throws IOException, JSONException {
//    HttpURLConnection con;
//
//    Proxy proxy = null;
//
//    // Applying proxy setting to HttpUrlConnection for RDNA
//    if(proxyPort!= -1){
//      //proxyHNIP = "127.0.0.1";
//      proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHNIP, proxyPort));
//    }
//
//    URL url = new URL(urlString);
//    if(proxyPort!=-1 && proxy != null){
//      con = (HttpURLConnection) url.openConnection(proxy);
//      con.setReadTimeout(5000);
//
//    }else{
//      con = (HttpURLConnection) url.openConnection();
//    }
//
//
//    con.setConnectTimeout(15000);
//    con.setRequestMethod("POST");
//    con.setDoInput(true);
//    con.setDoOutput(true);
//
//  List<NameValuePair> params = new ArrayList<NameValuePair>();
//  params.add(new BasicNameValuePair("firstParam", paramValue1));
//  params.add(new BasicNameValuePair("secondParam", paramValue2));
//  params.add(new BasicNameValuePair("thirdParam", paramValue3));
//
//  OutputStream os = con.getOutputStream();
//  BufferedWriter writer = new BufferedWriter(
//          new OutputStreamWriter(os, "UTF-8"));
//  writer.write(getQuery(params));
//  writer.flush();
//  writer.close();
//  os.close();
//
//  conn.connect();
//
//
//    BufferedReader reader;
//    StringBuilder line= new StringBuilder();
//
//    con.connect();
//    reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
//
//    String nextLine;
//
//    while ((nextLine = reader != null ? reader.readLine() : null) != null) {
//      line.append(nextLine);
//    }
//
//    con.disconnect();
//
//    return line.toString();
//  }

//  private String getQuery(List<NameValuePair> params) throws UnsupportedEncodingException
//  {
//    StringBuilder result = new StringBuilder();
//    boolean first = true;
//
//    for (NameValuePair pair : params)
//    {
//      if (first)
//        first = false;
//      else
//        result.append("&");
//
//      result.append(URLEncoder.encode(pair.getName(), "UTF-8"));
//      result.append("=");
//      result.append(URLEncoder.encode(pair.getValue(), "UTF-8"));
//    }
//
//    return result.toString();
//  }

  public String  performPostCall(String requestURL,
                                 HashMap<String, String> postDataParams) {
    URL url;
    String response = "";
    try {
      url = new URL(requestURL);
      HttpURLConnection conn;
      Proxy proxy = null;
      // Applying proxy setting to HttpUrlConnection for RDNA
      if(proxyPort!= -1){
        //proxyHNIP = "127.0.0.1";
        proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHNIP, proxyPort));
      }
      if(proxyPort!=-1 && proxy != null){
        conn = (HttpURLConnection) url.openConnection(proxy);
        conn.setReadTimeout(5000);

      }else{
        conn = (HttpURLConnection) url.openConnection();
      }

     // conn.setConnectTimeout(15000);
      conn.setRequestMethod("POST");
      conn.setDoInput(true);
      conn.setDoOutput(true);

      OutputStream os = conn.getOutputStream();
      BufferedWriter writer = new BufferedWriter(
              new OutputStreamWriter(os, "UTF-8"));
      writer.write(getPostDataString(postDataParams));

      writer.flush();
      writer.close();
      os.close();
      int responseCode=conn.getResponseCode();

      if (responseCode == HttpsURLConnection.HTTP_OK) {
        String line;
        BufferedReader br=new BufferedReader(new InputStreamReader(conn.getInputStream()));
        while ((line=br.readLine()) != null) {
          response+=line;
        }
      }
      else {
        response="";
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return response;
  }
  private String getPostDataString(HashMap<String, String> params) throws UnsupportedEncodingException{
    StringBuilder result = new StringBuilder();
    boolean first = true;
    for(Map.Entry<String, String> entry : params.entrySet()){
      if (first)
        first = false;
      else
        result.append("&");

      result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
      result.append("=");
      result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
    }

    return result.toString();
  }

}
