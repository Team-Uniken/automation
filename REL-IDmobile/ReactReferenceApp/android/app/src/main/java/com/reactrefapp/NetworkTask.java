package com.reactrefapp;

import android.os.AsyncTask;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;

public class NetworkTask extends AsyncTask<String, String, String> {

    private String proxyHNIP = null;
    private int proxyPort = -1;
    Callback callback;
    int errorCode = 0;

    public NetworkTask(String proxyHNIP, int proxyPort, Callback callback){
        this.callback = callback;
        this.proxyHNIP = proxyHNIP;
        this.proxyPort = proxyPort;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    protected String doInBackground(String... params) {
        String response;
        try {
            response = get(params[0]);
        } catch (IOException e) {
            //e.printStackTrace();
            errorCode = 1;
            response = "The request timed out";
        } catch (JSONException e) {
           // e.printStackTrace();
            errorCode = 1;
            response = "Invalid server response";
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

    public String get(String urlString) throws IOException, JSONException {
        HttpURLConnection con;

            Proxy proxy = null;

            // Applying proxy setting to HttpUrlConnection for RDNA
            if(proxyPort!= -1){
                //proxyHNIP = "127.0.0.1";
                proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHNIP, proxyPort));
            }

            URL url = new URL(urlString);
            if(proxyPort!=-1 && proxy != null){
                con = (HttpURLConnection) url.openConnection(proxy);
                con.setReadTimeout(5000);

            }else{
                con = (HttpURLConnection) url.openConnection();
            }

            BufferedReader reader;
            StringBuilder line= new StringBuilder();

            con.connect();
            reader = new BufferedReader(new InputStreamReader(con.getInputStream()));

            String nextLine;

            while ((nextLine = reader != null ? reader.readLine() : null) != null) {
                line.append(nextLine);
            }

            con.disconnect();

        return line.toString();
    }
}
