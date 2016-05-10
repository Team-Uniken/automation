var addon = require('./resources/RDNA.node');
var obj = localStorage.getItem("rdnaObj")

if(obj == 'undefined' || obj == null)
{
  var obj = new addon.RDNA();  
}
else
{
  alert("rdna obj rcvd");
}

console.log('The process architecture is ' + process.arch);

function dna_status_callback(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
  if(0 == errCode)
  {
   onInitialized(); 
  }
  else
  {
    onInitFailed(errCode);
  }
}
function dna_status_callback1(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback2(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback3(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback4(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback5(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback6(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback7(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback8(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback9(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback10(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback11(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}
function dna_status_callback12(msg, errCode)
{
  console.log("callback function - " + msg);
  console.log("callback function - " + errCode);
}

function getAppname()
{
  return "api-sdk-app-v1";
}

//core API's
function rdnaInitialize()
{
  console.log("initializing\n");
  var error = 0;
  if(typeof(selectedProfile) === 'undefined' || selectedProfile === "" || selectedProfile === null)
  {
    alert("Please select appropriate connection profile.");
    onInitFailed(error);
  }
  else
  {
    var profileObj = getProfile(selectedProfile);
    var agentID = getRelID(profileObj.RelId);
    
    var gwHost = profileObj.Host;
    var gwPort = profileObj.Port;
    //alert(gwHost + ":" + gwPort);
    res = obj.initialize(agentID, gwHost, gwPort, "", "", proxyObj, "Tejas_First_Electron_APP", dna_status_callback, dna_status_callback1,                     dna_status_callback2, dna_status_callback3, dna_status_callback4, dna_status_callback5, dna_status_callback6,                     dna_status_callback7, dna_status_callback8, dna_status_callback9, dna_status_callback10, getAppname,                     dna_status_callback12);
    console.log("returned from init call\n");
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
  var res = obj.resume(strCtx, proxy, "Tejas_First_Electron_APP", dna_status_callback, dna_status_callback1, dna_status_callback2, dna_status_callback3, dna_status_callback4, dna_status_callback5, dna_status_callback6, dna_status_callback7, dna_status_callback8, dna_status_callback9, dna_status_callback10, getAppname, dna_status_callback12);
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
}

function rdnaTerminate()
{
  var res;
  res = obj.terminate();
  document.getElementById('t1').value = res.response+"\n"+res.errorCode;
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

process.on('exit', function () {
  process.nextTick(function () {
   console.log('This will not run');
  });
  console.log('About to exit.');
});