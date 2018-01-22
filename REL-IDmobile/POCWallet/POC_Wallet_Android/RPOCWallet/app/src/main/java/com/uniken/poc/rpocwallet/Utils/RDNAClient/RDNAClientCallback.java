package com.uniken.poc.rpocwallet.Utils.RDNAClient;

import android.app.Activity;

import com.uniken.rdna.RDNA;

public interface RDNAClientCallback
{
  /*
      Called before calling the methods of RDNA. This method is called by RDNAClient util.
   */
  void onCallToRDNA(RDNA.RDNAMethodID methodID);

  /*
      Response received in RDNACallbacks are forwarded to this method. This method is called by RDNAClient util.
  */
  void onRDNAResponse(Object status);

  /**
   * This is called by RDNAClient to take credentials from client for given domain.
   */
  RDNA.RDNAIWACreds getIWACreds(String domain);
}
