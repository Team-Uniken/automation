/*if (document.currentScript) {
    alert(document.currentScript.src);
  } else {
    var scripts = document.getElementsByTagName('script');
    alert(scripts[scripts.length-1].src);

  }*/

var addon = require('./resources/RDNA.node');
var remote = require('electron').remote;

//Shared space
var eAppName = remote.getGlobal('sharedObj').appName;
var eAppVersion = remote.getGlobal('sharedObj').appVersion;

var obj = localStorage.getItem("rdnaObj");

//Init response text
var initRespTxt = "";

//Session username
var ssnUserName = "";

//misc
var validation_type = 1;

//Initial chlng
var initChlng = null;

//Advance flow chlng.
var intermediateChlngObj = null;
var intermediateChlngJsonObj = null
var appState = "Startup";
var currentChlngIdx = 0;
var totalChlngCount = 0;
var chlngOpMode = 0;         //0 - verify, 1 - set

//Device details
var devDetailsJsonObj = null;
var devDetails = null;

//Update
var updateOP = "";
var updateChlngObj = null;
var updateChlngJsonObj = null;
var updateChlngIdx = 0;
var updateChlngCount = 0;
var chlngName = "";
var secqaChlngArr = new Array();

if(obj == 'undefined' || obj == null)
{
  var obj = new addon.RDNA();  
}
else
{
  alert("rdna obj rcvd");
}

console.log('The process architecture is ' + process.arch);

function parseInitialChlng(chlngJson)
{
  var chlngArrayObj = JSON.parse(chlngJson.ResponseData);
  var chlngLen = chlngArrayObj.chlng.length;
  if(chlngLen > 1)
  {
    console.log("invalid challenges");
  }
  initChlng = chlngJson;
  appState = "AppStarted";
  currentChlngIdx = 0;
  totalChlngCount = 1;
}

function parseChallenge()
{
  var chlngs = intermediateChlngObj.chlng;
  if(typeof(chlngs) !== 'undefined' && chlngs !== null && chlngs.length > 0)
  {
    intermediateChlngJsonObj = JSON.parse(intermediateChlngObj.chlng);
    totalChlngCount = intermediateChlngJsonObj.length;
    if(totalChlngCount > 0)
    {
      currentChlngIdx = 0;
      appState = intermediateChlngJsonObj[currentChlngIdx].chlng_name;
    }
    else
    {
      alert("challenge count is 0, now what to do next!");
    }
  }
  else
  {
    appState = "sserloggedin";
    if(validation_type == 2)
    {
      alert("Post login challenge success...!!!")
    }
     validation_type = 1;
  }

  displayNextFrame();
}

function parseNextChlngInSeries()
{
  var respStr = "";
  var res = null;
  var error = 0;

  if((currentChlngIdx + 1) >= totalChlngCount)
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
  else
  {
    hideCurrentFrame();
    currentChlngIdx = (currentChlngIdx + 1);
    appState = intermediateChlngJsonObj[currentChlngIdx].chlng_name;
    displayNextFrame();
    hideLoginProgressBar();
  }
}

function parseNextUpdateChlngInSeries()
{
  var respStr = "";
  var res = null;

  if(chlngName == updateOP)
  {
    hideCurrentFrame();
    updateChlngIdx = (updateChlngIdx + 1);
    chlngName = updateChlngJsonObj[updateChlngIdx].chlng_name;
    displayUpdateFrames();
    hideLoginProgressBar();
  }
  else
  {
    respStr = JSON.stringify(updateChlngObj);
    res = updateChallenges(ssnUserName, respStr);
    if(0 != res)
    {
      alert("Invalid input : error code : "+ res);
      hideLoginProgressBar();
    }
  }
}

function parsePostLoginChlng(chlngList)
{
  var postlogin_chlng = "";
  if(typeof(chlngList) != 'undefined' && chlngList != null && chlngList.length > 0)
  {
    intermediateChlngJsonObj = JSON.parse(chlngList);

    validation_type = 2;
    totalChlngCount = intermediateChlngJsonObj.length;
    currentChlngIdx = 0;
    if(totalChlngCount > 0)
    {
      hideCurrentFrame();
      currentChlngIdx = 0;
      appState = intermediateChlngJsonObj[0].chlng_name;
    }
    else
    {
      hideCurrentFrame();
      alert("Invalid challenge sequence received, please try again!");
      appState = "sserloggedin";
    }
    displayNextFrame(); 
  }
  else
  {
    alert("Invalid data received");
  }
}

function parseUpdateChallenge()
{
  if(typeof(updateChlngObj) !== 'undefined' && updateChlngObj !== null)
  {
    updateChlngJsonObj =  JSON.parse(updateChlngObj.chlng);
    updateChlngCount = updateChlngJsonObj.length;
    if(updateChlngCount > 0)
    {
      for(var i = 0; i < updateChlngCount;  i++)
      {      
        if(updateOP == updateChlngJsonObj[i].chlng_name)
        {
          chlngName = updateChlngJsonObj[i].chlng_name;
          updateChlngIdx = i;
          displayUpdateFrames();
          break;
        }
      }      
    }
    else
    {
      alert("challenge count is 0, now what to do next!");      
    }
  }
}

function init_callback(msg, errCode)
{
  if(errCode != 0)
  {
    onInitFailed(errCode);
  }
  else
  {
    var jobj = JSON.parse(msg);
    parseInitialChlng(jobj.pArgs.response);
    onInitialized();
    initRespTxt = msg;
  }
}
function terminate_callback(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
  
  if(errCode != 0)
  {
    console.log("Failed to close application gracefully, callback Error code : " + errCode);
  }
  else
  {
    console.log("Application closed with callback");
  }
}
function pause_callback(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function resume_callback(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function getconfig_callback(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function chk_chlng_callback(msg, errCode)
{
  if(0 == errCode)
  {
    var msgJsonObj = JSON.parse(msg);
    
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
      alert(errMsg + msgJsonObj.status_code + " \nMessage : " + msgJsonObj.status_msg);
    }
    
    if(msgJsonObj.total_no_of_chlngs > 0)
    {
      hideCurrentFrame();
      intermediateChlngObj = msgJsonObj;
      parseChallenge();
    }
    else if(msgJsonObj.total_no_of_chlngs == 0 && msgJsonObj.status_code == 0)
    {
      hideCurrentFrame();
      appState = "sserloggedin";
      displayNextFrame();
    }
  }
  else
  {
    alert("Error! - " + errCode);
  }
  
  hideLoginProgressBar();
}
function get_all_chlng_callback(msg, errCode)
{
  if(0 == errCode)
  {
    var msgJsonObj = JSON.parse(msg);
    if(msgJsonObj.status_code == 0)
    {
      hideCurrentFrame();
      updateChlngObj = msgJsonObj;
      parseUpdateChallenge();
    }
    else
    {
      alert("Challenge response failed with error code : " + msgJsonObj.status_code + " \nMessage : " + msgJsonObj.status_msg);
    }
  }
  else
  {
    alert("Error! - " + errCode);
  }
  
  hideLoginProgressBar();
}
function update_chlng_callback(msg, errCode)
{
  var msgJsonObj = JSON.parse(msg);
  if(0 == errCode)
  {
    if(0 == msgJsonObj.status_code)
    {
      alert("Updated successfully");
      if(updateOP == "pass")
      {
        hideLoginfrm();
      }
      else
      {
        hideSecQAForm();
      }
      updateOP = "";
      displayHomePage();
    }
    else
    {
      alert("status code : " + msgJsonObj.status_code );
    }
  }
  else
  {
    alert("error code : " + errCode );
  }
  
  while(secqaChlngArr.length > 0) 
  {
    secqaChlngArr.pop();
  }
  hideLoginProgressBar();
}
function forgot_pswd_callback(msg, errCode)
{
  if(0 == errCode)
  {
    var msgJsonObj = JSON.parse(msg);
    if(msgJsonObj.status_code == 0)
    {
      hideCurrentFrame();
      intermediateChlngObj = msgJsonObj;
      parseChallenge();
    }
    else
    {
      alert("Challenge response failed with error code : " + msgJsonObj.status_code + " \nMessage : " + msgJsonObj.status_msg);
    }
  }
  else
  {
    alert("Error occured while performing activity - " + errCode);
  }
  hideLoginProgressBar();
}
function logoff_callback(msg, errCode)
{
  if(0 != errCode)
  {
    onLogOffFailed(errCode);
  }
  else
  {
    var jobj = JSON.parse(msg);
    parseInitialChlng(jobj.pArgs.response);
    loggedOff();
    initRespTxt = msg;
  }
}
function get_creds_callback(msg, errCode)
{
  var jobj = null;
  if(0 == errCode)
  {
    jobj = JSON.parse(msg);
    if(typeof(jobj.url) != 'undefined' && jobj.url != null && jobj.url != "")
    {
      showAuthPopup(jobj.url);
    }
    else
    {
      console.log("Invalid url received from callback");
    }
  }
}
function getAppversion(msg, errCode)
{
  return eAppVersion;
}
function getAppname(msg, errCode)
{
  return eAppName;
}
function get_registered_device_callback(msg, errCode)
{
  if(0 == errCode)
  {
    devDetails = JSON.parse(msg);
	  devDetailsJsonObj = JSON.parse(devDetails.device_details);
	  hideCurrentFrame();
	  displaySelfDeviceMgmtFrame();	
  }
  else
  {
    alert("Unable to fetch device details, Error code - " + errCode);
  }
  
  hideLoginProgressBar();
}
function on_update_device_details_callback(msg, errCode)
{
  if(0 == errCode)
  {
    var jObj = JSON.parse(msg);
    if(typeof(jObj.status_code) !== 'undefined' && jObj.status_code != null && jObj.status_code == 0)
    {
      hideLoginProgressBar();
      alert("device details updated...!");
    }
    else
    {
      alert("Update device details operation failed with error code - " + jObj.status_code)
    }
  }
  else
  {
    alert("unable to update device details activity, error code - " + errCode);
  }
}
function get_post_login_challenges_callback(msg, errCode)
{
  if(0 == errCode)
  {
    intermediateChlngObj = JSON.parse(msg);
    totalChlngCount = intermediateChlngObj.total_no_of_chlngs;
    if(typeof(intermediateChlngObj.status_code) !== 'undefined' && intermediateChlngObj.status_code != null && intermediateChlngObj.status_code == 0)
    {
      parsePostLoginChlng(intermediateChlngObj.chlng);
    }
    else
    {
      alert("Operation failed with error code - " + intermediateChlngObj.status_code)
    }
  }
  else
  {
    alert("Unable to fetch device details, Error code - " + errCode);
  }
  
  hideLoginProgressBar();
}

//core API's
function rdnaInitialize()
{
  var res = null;
  var error = 0;
  if(typeof(selectedProfile) === 'undefined' || selectedProfile === "" || selectedProfile === null)
  {
    alert("Please select appropriate connection profile.");
  }
  else
  {
    var profileObj = getProfile(selectedProfile);
    var agentID = getRelID(profileObj.RelId);
    
    var gwHost = profileObj.Host;
    var gwPort = profileObj.Port;
    res = obj.initialize(agentID, gwHost, gwPort, "", "", proxyObj, "First_Electron_APP", init_callback, terminate_callback,                     pause_callback, resume_callback, getconfig_callback, chk_chlng_callback, get_all_chlng_callback,                     update_chlng_callback, forgot_pswd_callback, logoff_callback, get_creds_callback, getAppname,
                         getAppversion, get_registered_device_callback, on_update_device_details_callback, get_post_login_challenges_callback);
    error = res.errorCode;
    if(0 != error)
    {
      onInitFailed(error);
    }
  }
}

function rdnaPause()
{
  var res;
  res = obj.pause();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaResume()
{
  var strCtx = document.getElementById('txtField2').value;
  var res = obj.resume(strCtx, proxy, "First_Electron_APP", init_callback, terminate_callback, pause_callback, resume_callback,
                       getconfig_callback, chk_chlng_callback, get_all_chlng_callback,update_chlng_callback, forgot_pswd_callback,
                       logoff_callback, get_creds_callback, getAppname, getAppversion, get_registered_device_callback,
                       on_update_device_details_callback, get_post_login_challenges_callback);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaTerminate()
{
  var res;
  res = obj.terminate();
  if(res.errorCode != 0)
  {
    console.log("Failed to close application gracefully, Error code : " + res.errorCode);
  }
  else
  {
    console.log("Application closed");
  }
}

function rdnaGetSDKVersion()
{
  var res;
  res = obj.getSdkVersion();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetSessionID()
{
  var res;
  res = obj.getSessionID();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetDeviceID()
{
  var res;
  res = obj.getDeviceID();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetAgentID()
{
  var res;
  res = obj.getAgentID();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetServiceBytargetCoordinate()
{
  var res;
  res = obj.getServiceByTargetCoordinates("www.httpsnow.org", 443)
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetServiceByName()
{
  var res;
  res = obj.getServiceByName("httpsnow")
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetAllServices()
{
  var res;
  res = obj.getAllServices()
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetDefaultCipherSpec()
{
  var res;
  res = obj.getDefaultCipherSpec();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaGetDefaultCipherSalt()
{
  var res;
  res = obj.getDefaultCipherSalt();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaStopService()
{
  var res;
  res = obj.serviceAccessStop();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaStartService()
{
  var res;
  res = obj.serviceAccessStart();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaStopAllServices()
{
  var res;
  res = obj.serviceAccessStopAll();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaStartAllServices()
{
  var res;
  res = obj.serviceAccessStartAll();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaEncryptDataPacket()
{
  var res;
  var data = document.getElementById('txtField1').value;
  res = obj.encryptDataPacket("CORE_PRIVACY_SCOPE_DEVICE", "AES/256/CFB/PKCS7Padding:SHA-256", "Rel-ID-Secure-IV", data);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaDecryptDataPacket()
{
  var res;
  var data = document.getElementById('txtField2').value;
  res = obj.decryptDataPacket("CORE_PRIVACY_SCOPE_DEVICE", "AES/256/CFB/PKCS7Padding:SHA-256", "Rel-ID-Secure-IV", data);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaEncryptHTTPReq()
{
  var res;
  var data = document.getElementById('txtField1').value;
  res = obj.encryptHttpRequest("CORE_PRIVACY_SCOPE_DEVICE", "AES/256/CFB/PKCS7Padding:SHA-256", "Rel-ID-Secure-IV", data);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaDecryptHTTPResp()
{
  var res;
  var data = document.getElementById('txtField2').value;
  res = obj.decryptHttpResponse("RDNA_PRIVACY_SCOPE_SESSION", "AES/256/CFB/PKCS7Padding:SHA-256", "Rel-ID-Secure-IV", data);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaCreatePrivacyStream()
{
  var res;
  res = obj.createPrivacyStream();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function setIWACreds(url, user, pswd, nstatus)
{
  var res = new Object();
  if(typeof(nstatus)== 'undefined' || url == 'undefined' || (nstatus == 0 && (user == 'undefined' || pswd == 'undefined' || user == null || pswd == null || user.length < 1 || pswd.length < 1)))
  {
    res.response = "Invalid arguments";
    res.errorCode = 1;
  }
  else
  {
    if(nstatus != 0 || nstatus != 1)
    {
      console.log("Invalid iwa status received - " + nstatus);
      nstatus = 1;
    }
    res = obj.setIWACredentials(url, user, pswd, nstatus);
  }
  return res;
}

function getConfig(configName)
{
  var res;
  if(configName !== 'undefined' && configName !== null && configName.length > 0)
  {
    res = obj.getConfig(configName); 
  }
  else
  {
    res.response = "";
    res.errorCode = "Empty config name"
  }
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function logOff(userName)
{
  var res;
  if(typeof(userName) !== 'undefined' && userName !== null && userName.length > 0)
  {
    res = obj.logOff(userName);
  }
  else
  {
    res.response = "";
    res.errorCode = "Empty user name"
  }
  if(0 != res.errorCode)
  {
    hideLoginProgressBar();
    alert("Logoff failure, error code - " + res.errorCode);
  }
}

function resetChallenges()
{
  var res;
  res = obj.resetChallenge();
  return res.errorCode;
}

function getAllChallenges(userName)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0)
  {
    res = obj.getAllChallenges(userName);
  }
  else
  {
    res.response = "";
    res.errorCode = "1"
  }
  return res.errorCode;
}

function getPostLoginChallenges(userName, useCase)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0 && useCase !== 'undefined' && useCase !== null && useCase.length > 0)
  {
    res = obj.getPostLoginChallenges(userName, useCase);
  }
  else
  {
    res.response = "";
    res.errorCode = "1"
  }
  return res.errorCode;
}

function getRegistredDeviceDetails(userName)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0)
  {
    res = obj.getRegistredDeviceDetails(userName);
  }
  else
  {
    res.response = "";
    res.errorCode = "1"
  }
  return res.errorCode;
}

function checkChallengeResponse(userName, response)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0 && response !== 'undefined' && response !== null && response.length > 0)
  {
    res = obj.checkChallengeResponse(userName, response);
  }
  else
  {
    res.response = "";
    res.errorCode = "Invalid args"
  }
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;  
}

function forgotPswd(userName)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0)
  {
    res = obj.forgotPassword(userName);
  }
  else
  {
    res.response = "Empty user name"
    res.errorCode = 1;
  }
  return res.errorCode;
}

function updateDeviceDetails(userName, devDetails)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0 && devDetails !== 'undefined' && devDetails !== null && devDetails.length > 0)
  {
    res = obj.updateDeviceDetails(userName, devDetails);
  }
  else
  {
    res.response = "2";
    res.errorCode = "";
  }
  return res.errorCode;   
}

function updateChallenges(userName, response)
{
  var res;
  if(userName !== 'undefined' && userName !== null && userName.length > 0 && response !== 'undefined' && response !== null && response.length > 0)
  {
    res = obj.updateChallenges(userName, response);
  }
  else
  {
    res.response = "";
    res.errorCode = "1";
  }
  return res.errorCode;
}

function formatInitialChallengeresponse(userName)
{
  if(typeof(userName) == 'undefined' || userName == null || userName.length < 1)
  {
    alert("Please enter valid user name");
    return;
  }
  ssnUserName = userName;
  var chlngJobj = JSON.parse(initChlng.ResponseData);
  var chlngStr = "", finalResp = "";
  chlngJobj.chlng[0].chlng_resp[0].response = userName;
  chlngStr = JSON.stringify(chlngJobj);
  initChlng.ResponseData = chlngStr;
  finalResp = JSON.stringify(initChlng);
  checkChallengeResponse(userName, chlngStr);
}

function formatActcodeChlngResp(actCode)
{
  var res = null;
  var error = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(actCode) == 'undefined' || actCode == null || actCode.trim().length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = actCode;
  var respStr = "";
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
  console.log("act chlng str : " + respStr);
}

function formatOTPChlngResp(otpcode)
{
  var res = null;
  var error = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(otpcode) == 'undefined' || otpcode == null || otpcode.trim().length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = otpcode;
  var respStr = "";
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
}

function formatSecQAChlngResp(question, answer)
{
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(question) == 'undefined' || question == null || question.length < 1 || typeof(answer) == 'undefined' || answer == null || answer.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].challenge = question;
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = answer;
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
}

function formatUpdateSecQAChlngResp(question, answer)
{
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(updateChlngJsonObj == null)
  {
    alert("Application error, please try again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(question) == 'undefined' || question == null || question.length < 1 || typeof(answer) == 'undefined' || answer == null || answer.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }

  updateChlngJsonObj[updateChlngIdx].chlng_resp[0].challenge = question;
  updateChlngJsonObj[updateChlngIdx].chlng_resp[0].response = answer;
  secqaChlngArr.push(updateChlngJsonObj[updateChlngIdx]);

  updateChlngObj.chlng = secqaChlngArr;
  if((updateChlngJsonObj[updateChlngIdx] + 1) != updateChlngCount)
  {
    parseNextUpdateChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(updateChlngObj);
    res = updateChallenges(ssnUserName, respStr);
    if(0 != res)
    {
      alert("Invalid input : error code : "+ res);
      hideLoginProgressBar();
    }
  }
}

function formatDevBindingResp(isPermanentBinding)
{
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(isPermanentBinding) == 'undefined' || isPermanentBinding == null || isPermanentBinding.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = isPermanentBinding;
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
}

function formatDevAliasResp(alias)
{
   var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(alias) == 'undefined' || alias == null || alias.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = alias;
  intermediateChlngJsonObj[currentChlngIdx].user_id = ssnUserName;
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
}

function formatPasswordResp(response)
{
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(response) == 'undefined' || response == null || response.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = response;
  intermediateChlngJsonObj[currentChlngIdx].user_id = ssnUserName;
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  
  if(totalChlngCount > 1)
  {
    parseNextChlngInSeries();
  }
  else
  {
    respStr = JSON.stringify(intermediateChlngObj);
    res = obj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      alert("Invalid input : error code : "+ error);
      hideLoginProgressBar();
    }
  }
}

function formatUpdatePasswordResp(newPwd)
{
  var errCode = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  else if(updateChlngJsonObj == null)
  {
    alert("Application error, please try again!");
    hideLoginProgressBar();
    return;
  }
  else if(typeof(newPwd) == 'undefined' || newPwd == null || newPwd.length < 1)
  {
    alert("Please enter valid input.");
    hideLoginProgressBar();
    return;
  }
  
  var chlngArr = new Array();
  updateChlngJsonObj[updateChlngIdx].chlng_resp[0].response = newPwd;
  chlngArr.push(updateChlngJsonObj[updateChlngIdx]);

  updateChlngObj.chlng = chlngArr;
  respStr = JSON.stringify(updateChlngObj);
  
  errCode = updateChallenges(ssnUserName, respStr);
  if(0 == errCode)
  {
    hideLoginProgressBar();
  }
  else
  {
    alert("Error! - " + errCode);
  }
}

process.on('exit', function () {
  process.nextTick(function () {
   console.log('This will not run');
  });
  console.log('About to exit.');
});