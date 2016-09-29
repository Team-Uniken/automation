//internal function
function populateDnaDetails(detailsJobj) {
  if(typeof(detailsJobj) == 'undefined' || detailsJobj == null)
  {
    log_msg("unable to read details, invalid input.");
    return;
  }

  if(typeof(detailsJobj.pxyDetails) != 'undefined' && detailsJobj.pxyDetails != null)
  {
    if(dna == null)
    {
      dna = new Object();
    }
    dna.pxyDetails = detailsJobj.pxyDetails;
  }

  var servicesList = sdkObj.getAllServices();//To-Do analyze output here.
  if(servicesList.errorCode == 0)
  {
    try
    {
      var svcObj = JSON.parse(servicesList.response);
      if(svcObj != null && typeof(svcObj.Services) != 'undefined' && svcObj.Services != '')
      {
        try
        {
          var svcList = JSON.parse(svcObj.Services);
          dna.services = svcList;
        }
        catch (e)
        {
          log_msg("Failed to parse service details, please login again or contact your administrator!");
        }
      }
    }
    catch (e)
    {
      log_msg("Invalid service details received, please login again or contact your administrator!");
    }
  }
}

//Challenge parsers
function parseInitialChlng(chlngJson) {
  intermediateChlngObj = null;
  if(typeof(chlngJson) !== 'undefined' && chlngJson !== null
     && typeof(chlngJson.ResponseData) !== 'undefined' &&
     chlngJson.ResponseData !== null && chlngJson.ResponseData != "")
  {
    try
    {
      intermediateChlngObj = JSON.parse(chlngJson.ResponseData);
    }
    catch(e)
    {
      log_msg("Invalid initial challegne received");
    }

    if(intermediateChlngObj != null && typeof(intermediateChlngObj.chlng) != 'undefined' && intermediateChlngObj.chlng != null)
    {
      totalChlngCount = intermediateChlngObj.chlng.length;
    }

    if(totalChlngCount < 1)
    {
      log_msg("invalid challenges");
      popup("Invalid challenges");
    }
    else
    {
      hideCurrentFrame();
      initChlng = chlngJson;
      appState = intermediateChlngObj.chlng[0].chlng_name;
      intermediateChlngJsonObj = intermediateChlngObj.chlng
      currentChlngIdx = 0;
      displayNextFrame();
    }
  }
  else
  {
    popup("Empty challenge received. Please try again!!!");
  }
}

function parseChallenge() {
  hideCurrentFrame();
  if(intermediateChlngObj != null && typeof(intermediateChlngObj.chlng) != 'undefined' && intermediateChlngObj.chlng != null)
  {
    try
    {
      intermediateChlngJsonObj = JSON.parse(intermediateChlngObj.chlng);
    }
    catch (e)
    {
      log_msg("Invalid challenge data received.");
    }

    if(intermediateChlngJsonObj && intermediateChlngObj.total_no_of_chlngs > 0)
    {
      totalChlngCount = intermediateChlngJsonObj.length;
      if(totalChlngCount != intermediateChlngObj.total_no_of_chlngs)
      {
        popup("Invalid responsw received..Please try again.");
        return;
      }
    }
    else
    {
      popup("Invalid state attained please login again!");
    }
  }

  if(totalChlngCount > 0)
  {
    currentChlngIdx = 0;
    appState = intermediateChlngJsonObj[currentChlngIdx].chlng_name;
  }
  else
  {
    popup("Internal Error, Please login again!!!");
  }

  displayNextFrame();
}

function forgotPswd(userName) {
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0)
  {
    res = sdkObj.forgotPassword(userName);
  }
  else
  {
    res.response = "Empty user name"
    res.errorCode = 1;
  }
  return res.errorCode;
}

//Callback functions for core
function init_callback(msg, errCode) {
  if(errCode != 0)
  {
    popup(errCode);
  }
  else
  {
    var jobj = null;
    try
    {
      jobj = JSON.parse(msg);
    }
    catch (e)
    {
      log_msg("Invalid initial challenge format.");
      popup("Invalid initial challenge format.");
    }

    if(typeof(jobj) != 'undefined' && jobj != null && typeof(jobj.pArgs) != 'undefined'
       && jobj.pArgs != null && typeof(jobj.pArgs.response) != 'undefined' && jobj.pArgs.response != null)
    {
      parseInitialChlng(jobj.pArgs.response);
      initRespTxt = msg;
    }
  }
}
function terminate_callback(msg, errCode) {
	//To-DO
}
function pause_callback(msg, errCode) {
	//To-DO
}
function resume_callback(msg, errCode) {
	//To-DO
}
function getconfig_callback(msg, errCode) {
	//To-DO
}
function chk_chlng_callback(msg, errCode) {
  if(0 == errCode)
  {
    var msgJsonObj = null;
    try
    {
      msgJsonObj = JSON.parse(msg);
    }
    catch (e)
    {
      popup("Invalid received response format.");
    }

    if(msgJsonObj != null)
    {
      if(msgJsonObj.status_code != 0)
      {
        var errMsg = "";
        if(validation_type == 2)
        {
          errMsg = "Post login challenge response failed with error code : ";
        }
        else
        {
          errMsg = "Challenge response failed with error code : ";
        }

        if(typeof(msgJsonObj.status_msg) != 'undefined' && msgJsonObj.status_msg != null)
        {
          popup(errMsg + msgJsonObj.status_code + "\nMessage : " + msgJsonObj.status_msg);
        }
        else
        {
          popup(errMsg + msgJsonObj.status_code);
        }
      }

      if(msgJsonObj.total_no_of_chlngs > 0)
      {
        intermediateChlngObj = msgJsonObj;
        parseChallenge();
      }
      else if(msgJsonObj.total_no_of_chlngs == 0 && msgJsonObj.status_code == 0)
      {
        hideCurrentFrame();
        appState = "sserloggedin";
        if(validation_type == 2)
        {
          popup("Post login challenge success...!!!")
        }
        validation_type = 1;
        populateDnaDetails(msgJsonObj);
        displayNextFrame();
      }
    }
  }
  else
  {
    popup("Error in challenge validation - " + errCode);
  }
}
function get_all_chlng_callback(msg, errCode) {
	//To-DO
}
function update_chlng_callback(msg, errCode) {
	//To-DO
}
function forgot_pswd_callback(msg, errCode) {
  if(0 == errCode)
  {
    var msgJsonObj = null;
    try
    {
      msgJsonObj = JSON.parse(msg);
    }
    catch (e)
    {
      popup("Invalid received response format.");
    }

    if(msgJsonObj)
    {
      if(msgJsonObj.status_code == 0)
      {
        intermediateChlngObj = msgJsonObj;
        parseChallenge();
      }
      else
      {
        popup("Challenge response failed with error code : " + msgJsonObj.status_code + "\nMessage : " + msgJsonObj.status_msg);
      }
    }
  }
  else
  {
    popup("Error occured while performing activity - " + errCode);
  }
}
function logoff_callback(msg, errCode) {
  ssnUserName = "";
  if(typeof(initChlng) == 'undefined' || initChlng == null || initChlng.length < 1)
  {
    popup("Application state invalid please restart the application.");
    return;
  }
  else
  {
    hideCurrentFrame();
    parseInitialChlng(initChlng);
  }
}
function get_creds_callback(msg, errCode) {
	//To-DO
}
function getAppversion(msg, errCode) {
  return eAppVersion;
}
function getAppname(msg, errCode) {
  return eAppName;
}
function get_registered_device_callback(msg, errCode) {
  if(errCode != 0)
  {
    popup(errCode);
  }
  else
  {
    var jObj = null;
    try
    {
      jObj = JSON.parse(msg);
    }
    catch (e)
    {
      log_msg("Invalid device details response.");
      popup("Invalid device details response.");
    }

    if(typeof(jObj) != 'undefined' && jObj != null
       && typeof(jObj.device_details) != 'undefined' && jObj.device_details != null)
    {
      try
      {
        devDetailsJsonObj = JSON.parse(jObj.device_details);
      } catch (e)
      {
        log_msg("Invalid device details received.");
        popup("Invalid device details received.");
      }
      showDeviceDetailsFrame();
    }
  }
}
function on_update_device_details_callback(msg, errCode) {
	//To-DO
}
function get_post_login_challenges_callback(msg, errCode) {
	//To-DO
}
