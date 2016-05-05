package com.reactrefapp;

/**
 * Created by uniken on 25/4/16.
 */
public class Constants {

    public static final String HOST = "apisdkdev.uniken.com"; //"10.0.9.87"; //
    public static final int PORT = 443;

    public static final String CYPHER_SALT = "salt";       //Cipher salt to be used
    public static final String CYPHER_SPEC = "AES/128/CBC/PKCS7Padding:SHA-1";//Cipher mode to be used
    public static final String AGENT_INFO = "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";

}
